/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 05 Backend Server Bootstrap & Constitutional API Gateway
 * Implements Express + PostgreSQL/Drizzle ORM persistence for the 86-table schema,
 * enforces fail-closed production PostgreSQL connection & external AES-256-GCM key validation,
 * executes departmental PostgreSQL roles (SET LOCAL ROLE) on live application queries,
 * enforces hard HTTP 403 constitutional locks on payment & blockchain routes,
 * and mounts Vite development middleware on port 3000.
 */

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IDatabaseRepository } from './src/adapters/IDatabaseRepository.ts';
import {
  PostgresDrizzleRepository,
  resolveAndValidateEncryptionKeyHex,
} from './src/adapters/PostgresDrizzleRepository.ts';
import { lookupCredentialVerificationPortal } from './src/components/credentials/OfficialCertificateView.tsx';
import { MACRO_DOMAINS_SUMMARY } from './src/data/designSystemCatalog.ts';
import {
  ALL_86_PHYSICAL_TABLE_NAMES,
  IMMUTABLE_APPEND_ONLY_TABLES,
  applyPhase05Migrations,
  resolveDatabaseEngine,
  seedPhase05Database,
} from './src/db/index.ts';
import {
  createZeroIpWhistleblowerReport,
  enforceConstitutionalEndpointGate,
} from './src/services/securityAndVerificationCore.ts';
import { CONSTITUTIONAL_LOCKS } from './src/types/constitution.ts';

let sharedRepositoryPromise: Promise<IDatabaseRepository> | null = null;

export interface Phase05RepositoryRuntimeOptions {
  readonly nodeEnv?: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly encryptionKeyHex?: string;
}

/**
 * Initializes a Phase 05 PostgreSQL 86-table repository instance.
 *
 * Security & Production Guarantees (BUG-01 & BUG-02):
 * 1. Validates external 256-bit `DATA_ENCRYPTION_KEY_HEX` first (fails closed with
 *    `ENCRYPTION_KEY_MISSING_OR_INVALID` if missing or weak).
 * 2. Calls `resolveDatabaseEngine`:
 *    - In production (`NODE_ENV === 'production'`), requires `DATABASE_URL` or
 *      `SQL_HOST` + `SQL_USER` + `SQL_PASSWORD` + `SQL_DB_NAME` and connects via `pg.Pool`
 *      (`drizzle-orm/node-postgres`). Never falls back to in-memory PGlite in production.
 *    - When `SQL_HOST` or `DATABASE_URL` is configured in any environment (including CI),
 *      connects to the real PostgreSQL server over `pg.Pool`.
 */
export async function initializePhase05Repository(
  options?: Phase05RepositoryRuntimeOptions
): Promise<{
  readonly repository: PostgresDrizzleRepository;
  readonly engineType: 'node-postgres' | 'pglite';
  readonly close: () => Promise<void>;
}> {
  const env = options?.env ?? process.env;
  const encryptionKeyHex = resolveAndValidateEncryptionKeyHex(
    options?.encryptionKeyHex ?? env.DATA_ENCRYPTION_KEY_HEX
  );
  const engine = await resolveDatabaseEngine({
    nodeEnv: options?.nodeEnv ?? env.NODE_ENV,
    env,
  });

  try {
    await applyPhase05Migrations(engine.sqlExecutor);
    await seedPhase05Database(engine.db);

    const repository = engine.pool
      ? PostgresDrizzleRepository.fromPgPool(engine.pool, encryptionKeyHex)
      : new PostgresDrizzleRepository({
          db: engine.db,
          sqlExecutor: engine.sqlExecutor,
          encryptionKeyHex,
        });

    return {
      repository,
      engineType: engine.engineType,
      close: () => engine.sqlExecutor.close(),
    };
  } catch (err) {
    await engine.sqlExecutor.close();
    throw err;
  }
}

/**
 * Returns the shared singleton Phase 05 PostgreSQL repository.
 */
export async function getPhase05Repository(): Promise<IDatabaseRepository> {
  if (!sharedRepositoryPromise) {
    sharedRepositoryPromise = initializePhase05Repository()
      .then((res) => res.repository)
      .catch((err) => {
        sharedRepositoryPromise = null;
        throw err;
      });
  }
  return sharedRepositoryPromise;
}

/**
 * Creates the Express application wired to the Phase 05 IDatabaseRepository and constitutional guards.
 */
export function createPhase05ExpressApp(
  repositoryProvider: () => Promise<IDatabaseRepository> = getPhase05Repository
): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  // 1. Constitutional Endpoint Gate Middleware (Blocks /api/v1/payments/* & /api/v1/blockchain/* with HTTP 403)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const gate = enforceConstitutionalEndpointGate(req.originalUrl || req.url);
    if (gate.blocked) {
      res.status(gate.httpStatus).json({
        status: 'BLOCKED_BY_CONSTITUTION',
        httpStatus: gate.httpStatus,
        errorCode: gate.errorCode,
        message: `Constitutional Launch Lock enforced: ${gate.errorCode}`,
        constitutionalLocks: CONSTITUTIONAL_LOCKS,
      });
      return;
    }
    next();
  });

  // 2. Health & 86-Table Database Readiness Endpoint
  app.get('/api/v1/health', async (_req: Request, res: Response) => {
    try {
      await repositoryProvider();
      res.status(200).json({
        status: 'OK',
        phase: 'PHASE_05_DATABASE_PERSISTENCE',
        physicalTableCount: ALL_86_PHYSICAL_TABLE_NAMES.length,
        immutableAppendOnlyTables: IMMUTABLE_APPEND_ONLY_TABLES,
        constitutionalLocks: {
          paymentsEnabled: CONSTITUTIONAL_LOCKS.PAYMENTS_ENABLED,
          blockchainEnabled: CONSTITUTIONAL_LOCKS.BLOCKCHAIN_ENABLED,
          aiFinalDecisionAllowed: CONSTITUTIONAL_LOCKS.AI_FINAL_DECISION_ALLOWED,
          standardBadgePriceUsd: CONSTITUTIONAL_LOCKS.STANDARD_BADGE_PRICE_USD,
          standardCertificatePriceUsd: CONSTITUTIONAL_LOCKS.STANDARD_CERTIFICATE_PRICE_USD,
          publicVerificationPriceUsd: CONSTITUTIONAL_LOCKS.PUBLIC_VERIFICATION_PRICE_USD,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'ERROR',
        errorCode: 'DATABASE_HEALTH_CHECK_FAILED',
        message: err instanceof Error ? err.message : 'Unknown database error',
      });
    }
  });

  // 3. Taxonomy: 6 Macro-Domains & 24 Adventure Categories (Executes under SET LOCAL ROLE app_public_readonly)
  app.get('/api/v1/categories', async (_req: Request, res: Response) => {
    try {
      const repo = await repositoryProvider();
      const categories = await repo.getAdventureCategories();
      res.status(200).json({
        macroDomainsCount: MACRO_DOMAINS_SUMMARY.length,
        categoriesCount: categories.length,
        macroDomains: MACRO_DOMAINS_SUMMARY,
        categories,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'CATEGORIES_QUERY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 4. Destinations Catalog (100 PROPOSED Destinations — Executes under SET LOCAL ROLE app_public_readonly)
  app.get('/api/v1/destinations', async (req: Request, res: Response) => {
    try {
      const repo = await repositoryProvider();
      const statusFilter =
        typeof req.query.status === 'string' ? req.query.status : undefined;
      const destinations = await repo.getFeaturedDestinations(
        statusFilter ? { status: statusFilter } : undefined
      );
      res.status(200).json({
        count: destinations.length,
        destinations,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'DESTINATIONS_QUERY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 5. Separated Route Geometries for a Destination (Executes under SET LOCAL ROLE app_public_readonly)
  app.get('/api/v1/destinations/:destinationId/routes', async (req: Request, res: Response) => {
    try {
      const repo = await repositoryProvider();
      const routes = await repo.getRoutesByDestination(req.params.destinationId);
      res.status(200).json({
        destinationId: req.params.destinationId,
        count: routes.length,
        routes,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'ROUTES_QUERY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 6. Zero-PII Public Credential Verification Portal (Executes under SET LOCAL ROLE app_public_readonly)
  app.get('/api/v1/credentials/verify/:credentialId', async (req: Request, res: Response) => {
    try {
      const credentialId = req.params.credentialId;
      const portalResult = lookupCredentialVerificationPortal(credentialId);
      if (!portalResult.isFormatValid) {
        res.status(400).json(portalResult);
        return;
      }
      if (portalResult.status === 'DESIGN_PREVIEW_ONLY') {
        res.status(200).json(portalResult);
        return;
      }
      const repo = await repositoryProvider();
      const dbRecord = await repo.getPublicCredentialVerification(credentialId);
      if (!dbRecord) {
        res.status(404).json(portalResult);
        return;
      }
      res.status(200).json({
        queriedCredentialId: credentialId,
        isFormatValid: true,
        status: dbRecord.status,
        httpStatus: 200,
        isRealAchievement: true,
        record: dbRecord,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'CREDENTIAL_VERIFY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 7. Department 03 Verification Case Firewall View (Executes under SET LOCAL ROLE app_verification_dept03)
  app.get('/api/v1/verification/cases/:caseId', async (req: Request, res: Response) => {
    try {
      const repo = await repositoryProvider();
      const sanitizedCase = await repo.getSanitizedCaseForReviewer(req.params.caseId);
      if (!sanitizedCase) {
        res.status(404).json({
          errorCode: 'VERIFICATION_CASE_NOT_FOUND',
          caseId: req.params.caseId,
        });
        return;
      }
      res.status(200).json({
        departmentRoleEnforced: 'app_verification_dept03',
        commercialFirewallApplied: true,
        case: sanitizedCase,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'VERIFICATION_CASE_QUERY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 8. Department 11 Zero-IP Whistleblower Intake (Executes under SET LOCAL ROLE app_internal_audit_dept11)
  app.post('/api/v1/whistleblower/reports', async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        reportId?: string;
        oneTimeReceiptToken?: string;
        category?:
          | 'SPONSOR_INTERFERENCE'
          | 'REVIEWER_CONFLICT_OR_BRIBERY'
          | 'FAKE_ACHIEVEMENT_CLAIM'
          | 'SAFETY_HAZARD_COVERUP'
          | 'ADMIN_PRIVILEGE_ABUSE';
        encryptedNarrative?: string;
      };
      if (
        !body?.reportId ||
        !body?.oneTimeReceiptToken ||
        !body?.category ||
        !body?.encryptedNarrative
      ) {
        res.status(400).json({
          errorCode: 'INVALID_WHISTLEBLOWER_PAYLOAD',
        });
        return;
      }

      const report = createZeroIpWhistleblowerReport({
        reportId: body.reportId,
        oneTimeReceiptToken: body.oneTimeReceiptToken,
        category: body.category,
        encryptedNarrative: body.encryptedNarrative,
        callerIpAddress: req.ip ?? '0.0.0.0',
        createdAtIso: new Date().toISOString(),
      });

      const repo = await repositoryProvider();
      const saved = await repo.submitWhistleblowerReport(report);
      res.status(201).json({
        status: 'SUBMITTED_ZERO_IP',
        departmentRoleEnforced: 'app_internal_audit_dept11',
        callerIpLogged: false,
        receiptCodeHash: saved.receiptCodeHash,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'WHISTLEBLOWER_SUBMISSION_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  // 9. Public Governance & Constitutional Transparency Endpoint
  app.get('/api/v1/transparency', async (_req: Request, res: Response) => {
    try {
      const repo = await repositoryProvider();
      const [transparency, chainStatus] = await Promise.all([
        repo.getTrustTransparencySnapshot(),
        repo.verifyRegistryHashChain(),
      ]);
      res.status(200).json({
        policyVersion: 'v1.1.0',
        physicalTableCount: ALL_86_PHYSICAL_TABLE_NAMES.length,
        immutableAppendOnlyTablesCount: IMMUTABLE_APPEND_ONLY_TABLES.length,
        registryHashChain: chainStatus,
        transparency,
        constitutionalLocks: CONSTITUTIONAL_LOCKS,
      });
    } catch (err) {
      res.status(500).json({
        errorCode: 'TRANSPARENCY_QUERY_FAILED',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  return app;
}

/**
 * Starts the HTTP server on port 3000 with Vite middleware in development or static serving in production.
 * In production (`NODE_ENV === 'production'`), fails closed immediately at startup if PostgreSQL
 * connection parameters or `DATA_ENCRYPTION_KEY_HEX` are missing.
 */
export async function startServer(port = Number(process.env.PORT) || 3000): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await getPhase05Repository();
  }

  const app = createPhase05ExpressApp();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[0 TO 8848] Phase 05 Server listening on http://0.0.0.0:${port}`);
  });
}

const isMainModule =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  startServer().catch((err) => {
    console.error('[0 TO 8848] Fatal server startup error:', err);
    process.exit(1);
  });
}
