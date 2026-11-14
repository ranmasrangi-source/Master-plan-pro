/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 05 Backend Server Bootstrap & Constitutional API Gateway
 * Implements Express + PostgreSQL/Drizzle ORM persistence for the 86-table schema,
 * enforces hard HTTP 403 constitutional locks on payment & blockchain routes,
 * and mounts Vite development middleware on port 3000.
 */

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IDatabaseRepository } from './src/adapters/IDatabaseRepository.ts';
import { PostgresDrizzleRepository } from './src/adapters/PostgresDrizzleRepository.ts';
import { lookupCredentialVerificationPortal } from './src/components/credentials/OfficialCertificateView.tsx';
import { MACRO_DOMAINS_SUMMARY } from './src/data/designSystemCatalog.ts';
import {
  ALL_86_PHYSICAL_TABLE_NAMES,
  IMMUTABLE_APPEND_ONLY_TABLES,
  applyPhase05Migrations,
  createEmbeddedPostgresEngine,
  seedPhase05Database,
} from './src/db/index.ts';
import { enforceConstitutionalEndpointGate } from './src/services/securityAndVerificationCore.ts';
import { CONSTITUTIONAL_LOCKS } from './src/types/constitution.ts';

let sharedRepositoryPromise: Promise<IDatabaseRepository> | null = null;

/**
 * Initializes the Phase 05 PostgreSQL 86-table repository (with migrations & baseline seed).
 */
export async function getPhase05Repository(): Promise<IDatabaseRepository> {
  if (!sharedRepositoryPromise) {
    sharedRepositoryPromise = (async () => {
      const { pglite, db } = await createEmbeddedPostgresEngine();
      await applyPhase05Migrations(pglite);
      await seedPhase05Database(db);
      return new PostgresDrizzleRepository({ db, pglite });
    })();
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
        message: gate.message,
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

  // 3. Taxonomy: 6 Macro-Domains & 24 Adventure Categories
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

  // 4. Destinations Catalog (100 PROPOSED Destinations)
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

  // 5. Separated Route Geometries for a Destination
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

  // 6. Zero-PII Public Credential Verification Portal
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

  // 7. Public Governance & Constitutional Transparency Endpoint
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
 */
export async function startServer(port = Number(process.env.PORT) || 3000): Promise<void> {
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
