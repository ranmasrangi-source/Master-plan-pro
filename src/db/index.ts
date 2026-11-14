/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Production PostgreSQL Connection Pool (node-postgres pg.Pool) &
 * Local Development / CI Dual-Mode PostgreSQL Engine
 *
 * Remediation Coverage:
 * - BUG-01: Production fail-closed validation (never falls back to in-memory PGlite in production)
 * - BUG-04: Vendor-neutral ISqlExecutor + PgDatabase abstraction
 * - BUG-06: Departmental role-scoped transaction execution (SET LOCAL ROLE)
 * - BUG-07: Real PostgreSQL server integration via pg.Pool when SQL_HOST / DATABASE_URL is configured
 */

import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzleNodePg, NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { drizzle as drizzlePglite, PgliteDatabase } from 'drizzle-orm/pglite';
import { Pool, type PoolClient, type PoolConfig } from 'pg';
import { ADVENTURE_CATEGORIES_24, MACRO_DOMAINS_SUMMARY } from '../data/designSystemCatalog.ts';
import { ALL_100_FEATURED_DESTINATIONS } from '../data/destinations100Catalog.ts';
import {
  CONSTITUTIONAL_LOCKS,
  GovernanceDepartmentId,
  PlatformRole,
} from '../types/constitution.ts';
import * as schema from './schema.ts';

export { ALL_86_PHYSICAL_TABLE_NAMES, IMMUTABLE_APPEND_ONLY_TABLES } from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPgDatabase = PgDatabase<any, typeof schema>;
export type DrizzleDatabase = NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;

export interface ISqlExecutor {
  readonly engineType: 'node-postgres' | 'pglite';
  query<TRow = Record<string, unknown>>(
    queryText: string,
    params?: unknown[]
  ): Promise<{ readonly rows: TRow[] }>;
  exec(sqlBatch: string): Promise<void>;
  close(): Promise<void>;
}

export const ALLOWED_DEPARTMENT_DB_ROLES = [
  'app_public_readonly',
  'app_adventurer_role',
  'app_verification_dept03',
  'app_appeal_dept04',
  'app_security_dept05',
  'app_finance_dept06',
  'app_system_admin_dept07',
  'app_internal_audit_dept11',
  'app_ai_assistive_readonly',
] as const;

export type AllowedDepartmentDbRole = (typeof ALLOWED_DEPARTMENT_DB_ROLES)[number];

/**
 * Validates that production PostgreSQL connection parameters exist.
 * Fails closed in production if neither DATABASE_URL nor SQL_HOST/SQL_USER/SQL_PASSWORD/SQL_DB_NAME are provided (BUG-01).
 */
export function validateProductionDatabaseConfig(
  env: NodeJS.ProcessEnv = process.env
): {
  readonly connectionString?: string;
  readonly host?: string;
  readonly port: number;
  readonly user?: string;
  readonly password?: string;
  readonly database?: string;
} {
  const databaseUrl = env.DATABASE_URL?.trim();
  const host = env.SQL_HOST?.trim();
  const port = Number(env.SQL_PORT || 5432);
  const user = env.SQL_USER?.trim();
  const password = env.SQL_PASSWORD;
  const database = env.SQL_DB_NAME?.trim();

  if (databaseUrl && databaseUrl.length > 0) {
    return { connectionString: databaseUrl, port };
  }

  if (host && user && typeof password === 'string' && password.length > 0 && database) {
    return { host, port, user, password, database };
  }

  const err = new Error(
    'FATAL_PRODUCTION_DB_CONFIG_MISSING: Production database connection requires DATABASE_URL or (SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DB_NAME). In-memory fallback is prohibited in production.'
  ) as Error & { code?: string };
  err.code = 'FATAL_PRODUCTION_DB_CONFIG_MISSING';
  throw err;
}

/**
 * Returns true if external PostgreSQL connection environment variables are configured.
 */
export function hasExternalPostgresConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
    return true;
  }
  return Boolean(
    env.SQL_HOST?.trim() &&
      env.SQL_USER?.trim() &&
      typeof env.SQL_PASSWORD === 'string' &&
      env.SQL_DB_NAME?.trim()
  );
}

/**
 * Creates or retrieves the production pg.Pool using the Object Method (no startup probe loops).
 */
export const createPool = (customConfig?: PoolConfig, env: NodeJS.ProcessEnv = process.env): Pool => {
  if (customConfig) {
    return new Pool({
      max: 10,
      connectionTimeoutMillis: 15000,
      ...customConfig,
    });
  }
  if (!global._postgresPool) {
    const poolConfig: PoolConfig = env.DATABASE_URL?.trim()
      ? {
          connectionString: env.DATABASE_URL.trim(),
          max: 10,
          connectionTimeoutMillis: 15000,
        }
      : {
          host: env.SQL_HOST,
          port: Number(env.SQL_PORT || 5432),
          user: env.SQL_USER,
          password: env.SQL_PASSWORD,
          database: env.SQL_DB_NAME,
          max: 10,
          connectionTimeoutMillis: 15000,
        };

    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

/**
 * Wraps a node-postgres pg.Pool in a session-consistent ISqlExecutor so BEGIN/COMMIT/ROLLBACK
 * and SET LOCAL ROLE execute on a pinned PoolClient when inside a transaction.
 */
export function createNodePgSqlExecutor(pool: Pool): ISqlExecutor {
  let pinnedClient: PoolClient | null = null;

  return {
    engineType: 'node-postgres',
    async query<TRow = Record<string, unknown>>(
      queryText: string,
      params?: unknown[]
    ): Promise<{ readonly rows: TRow[] }> {
      const target = pinnedClient ?? pool;
      const res = await target.query(queryText, params);
      return { rows: res.rows as TRow[] };
    },
    async exec(sqlBatch: string): Promise<void> {
      const trimmed = sqlBatch.trim().toUpperCase();
      if (trimmed === 'BEGIN;' || trimmed === 'BEGIN') {
        if (!pinnedClient) {
          pinnedClient = await pool.connect();
        }
        await pinnedClient.query('BEGIN');
        return;
      }
      if (
        trimmed === 'COMMIT;' ||
        trimmed === 'COMMIT' ||
        trimmed === 'ROLLBACK;' ||
        trimmed === 'ROLLBACK'
      ) {
        if (pinnedClient) {
          try {
            await pinnedClient.query(trimmed.startsWith('COMMIT') ? 'COMMIT' : 'ROLLBACK');
          } finally {
            pinnedClient.release();
            pinnedClient = null;
          }
          return;
        }
      }
      const target = pinnedClient ?? pool;
      await target.query(sqlBatch);
    },
    async close(): Promise<void> {
      if (pinnedClient) {
        pinnedClient.release();
        pinnedClient = null;
      }
      await pool.end();
    },
  };
}

/**
 * Wraps a PGlite instance in the standard ISqlExecutor interface.
 */
export function createPgliteSqlExecutor(pglite: PGlite): ISqlExecutor {
  return {
    engineType: 'pglite',
    async query<TRow = Record<string, unknown>>(
      queryText: string,
      params?: unknown[]
    ): Promise<{ readonly rows: TRow[] }> {
      const res = await pglite.query<TRow>(queryText, params);
      return { rows: res.rows };
    },
    async exec(sqlBatch: string): Promise<void> {
      await pglite.exec(sqlBatch);
    },
    async close(): Promise<void> {
      await pglite.close();
    },
  };
}

function toSqlExecutor(executorOrPglite: ISqlExecutor | PGlite): ISqlExecutor {
  if ('engineType' in executorOrPglite) {
    return executorOrPglite;
  }
  return createPgliteSqlExecutor(executorOrPglite);
}

/**
 * Creates an isolated real PostgreSQL 16 instance via @electric-sql/pglite
 * for local development/testing when no external PostgreSQL server is configured.
 */
export async function createEmbeddedPostgresEngine(): Promise<{
  readonly pglite: PGlite;
  readonly sqlExecutor: ISqlExecutor;
  readonly db: PgliteDatabase<typeof schema>;
}> {
  const pglite = new PGlite();
  await pglite.waitReady;
  const db = drizzlePglite(pglite, { schema });
  const sqlExecutor = createPgliteSqlExecutor(pglite);
  return { pglite, sqlExecutor, db };
}

/**
 * Resolves the database connection according to runtime environment (BUG-01 & BUG-07):
 * - In production (or when requireProductionPostgres = true), strictly requires external PostgreSQL
 *   (DATABASE_URL or SQL_HOST/SQL_USER/SQL_PASSWORD/SQL_DB_NAME) and connects via pg.Pool + drizzle-orm/node-postgres.
 *   Never falls back to in-memory PGlite in production.
 * - In non-production, connects to external PostgreSQL via pg.Pool if SQL_HOST or DATABASE_URL is set
 *   (e.g., GitHub Actions postgres:16 service container), or falls back to embedded PostgreSQL 16 (PGlite) for local dev.
 */
export async function resolveDatabaseEngine(options?: {
  readonly nodeEnv?: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly requireProductionPostgres?: boolean;
}): Promise<{
  readonly db: AnyPgDatabase;
  readonly sqlExecutor: ISqlExecutor;
  readonly engineType: 'node-postgres' | 'pglite';
  readonly pool?: Pool;
  readonly pglite?: PGlite;
}> {
  const env = options?.env ?? process.env;
  const nodeEnv = options?.nodeEnv ?? env.NODE_ENV ?? 'development';
  const mustUseProductionPg =
    nodeEnv === 'production' ||
    options?.requireProductionPostgres === true ||
    hasExternalPostgresConfig(env);

  if (mustUseProductionPg) {
    const validated = validateProductionDatabaseConfig(env);
    const pool = createPool(
      validated.connectionString
        ? { connectionString: validated.connectionString }
        : {
            host: validated.host,
            port: validated.port,
            user: validated.user,
            password: validated.password,
            database: validated.database,
          },
      env
    );
    const db = drizzleNodePg(pool, { schema });
    const sqlExecutor = createNodePgSqlExecutor(pool);
    return { db, sqlExecutor, engineType: 'node-postgres', pool };
  }

  const { pglite, sqlExecutor, db } = await createEmbeddedPostgresEngine();
  return { db, sqlExecutor, engineType: 'pglite', pglite };
}

/**
 * Applies Phase 05 SQL migrations (0000_phase05_core_86_tables.sql & 0001_append_only_triggers_and_roles.sql)
 * inside an atomic PostgreSQL transaction (BEGIN ... COMMIT / ROLLBACK).
 * Works against both real PostgreSQL (pg.Pool / NodePgSqlExecutor) and PGlite.
 */
export async function applyPhase05Migrations(
  executorOrPglite: ISqlExecutor | PGlite
): Promise<{
  readonly appliedMigrationFiles: readonly string[];
  readonly totalTablesCreated: number;
}> {
  const executor = toSqlExecutor(executorOrPglite);
  const migrationsDir = path.join(process.cwd(), 'src/db/migrations');
  const migrationFiles = [
    '0000_phase05_core_86_tables.sql',
    '0001_append_only_triggers_and_roles.sql',
  ];

  await executor.exec('BEGIN;');
  try {
    for (const fileName of migrationFiles) {
      const fullPath = path.join(migrationsDir, fileName);
      const rawSql = fs.readFileSync(fullPath, 'utf-8');
      const cleanedSql = rawSql.replace(/--> statement-breakpoint/g, '\n');
      await executor.exec(cleanedSql);
    }
    await executor.exec('COMMIT;');
  } catch (error) {
    await executor.exec('ROLLBACK;');
    throw error;
  }

  const countResult = await executor.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`
  );
  const totalTablesCreated = Number(countResult.rows[0]?.count ?? 0);

  return {
    appliedMigrationFiles: migrationFiles,
    totalTablesCreated,
  };
}

/**
 * Executes a callback inside a transaction under a specific least-privilege PostgreSQL department role
 * (`SET LOCAL ROLE <role>`), blocking any attempt to execute `RESET ROLE` or `SET SESSION AUTHORIZATION`.
 * Works identically on real PostgreSQL (pg.Pool) and PGlite.
 */
export async function executeWithDepartmentRole<T>(
  executorOrPglite: ISqlExecutor | PGlite,
  roleName: AllowedDepartmentDbRole,
  fn: (
    execSql: (queryText: string, params?: unknown[]) => Promise<{ rows: unknown[] }>
  ) => Promise<T>
): Promise<T> {
  const executor = toSqlExecutor(executorOrPglite);
  if (!ALLOWED_DEPARTMENT_DB_ROLES.includes(roleName)) {
    const err = new Error(
      `INVALID_DB_ROLE: Role "${roleName}" is not in the approved departmental role allowlist.`
    ) as Error & { code?: string };
    err.code = '42501';
    throw err;
  }

  await executor.exec('BEGIN;');
  try {
    await executor.exec(`SET LOCAL ROLE ${roleName};`);

    const guardedExecSql = async (
      queryText: string,
      params?: unknown[]
    ): Promise<{ rows: unknown[] }> => {
      const normalized = queryText.toUpperCase();
      if (
        /\bRESET\s+ROLE\b/.test(normalized) ||
        /\bSET\s+(SESSION\s+|LOCAL\s+)?ROLE\b/.test(normalized) ||
        /\bSET\s+SESSION\s+AUTHORIZATION\b/.test(normalized) ||
        /\bALTER\s+ROLE\b/.test(normalized) ||
        /\bDISABLE\s+TRIGGER\b/.test(normalized)
      ) {
        const err = new Error(
          'ROLE_ESCALATION_ATTEMPT_BLOCKED: Shared-pool transactions are forbidden from executing SET/RESET ROLE, SET SESSION AUTHORIZATION, or DISABLE TRIGGER.'
        ) as Error & { code?: string };
        err.code = '42501';
        throw err;
      }
      const res = await executor.query(queryText, params);
      return { rows: res.rows };
    };

    const result = await fn(guardedExecSql);
    await executor.exec('COMMIT;');
    return result;
  } catch (error) {
    await executor.exec('ROLLBACK;');
    throw error;
  }
}

/**
 * Seeds the authoritative Phase 05 baseline data into PostgreSQL using batched multi-row inserts:
 * - Constitutional system_settings locks
 * - Initial policy_versions ('v1.1.0')
 * - All 21 Platform Roles across 11 Governance Departments
 * - All 6 Macro-Domains (MD-01..06)
 * - All 24 Adventure Categories (CAT-01..24)
 * - Geographical Regions & All 100 PROPOSED Featured Destinations (DEST-001..100)
 * - Separated Destination Routes (RTE-*), Achievements (ACH-*), and Standard Free Badges (BDG-*)
 */
export async function seedPhase05Database(db: AnyPgDatabase): Promise<{
  readonly macroDomainsSeeded: number;
  readonly categoriesSeeded: number;
  readonly rolesSeeded: number;
  readonly destinationsSeeded: number;
  readonly routesSeeded: number;
}> {
  // 1. Seed system_settings constitutional locks (batched)
  const lockValues = Object.entries(CONSTITUTIONAL_LOCKS).map(([key, value]) => ({
    settingKey: key,
    settingValueJson: { value },
    isConstitutionalLock: true,
  }));
  await db.insert(schema.systemSettings).values(lockValues).onConflictDoNothing();

  // 2. Seed initial policy version
  await db
    .insert(schema.policyVersions)
    .values({
      versionId: 'v1.1.0',
      title: '0 TO 8848 Ultimate V1.1 Constitutional Baseline',
      summary: 'Incorporates Binding Amendments A1–A7, CHK-01.14–01.18, and NF-01–05.',
    })
    .onConflictDoNothing();

  // 3. Seed all 21 Constitutional Platform Roles (batched)
  const roleDepartmentMap: Readonly<
    Record<
      PlatformRole,
      { dept: GovernanceDepartmentId; requiresMfa: boolean; isPrivileged: boolean; label: string }
    >
  > = {
    [PlatformRole.PUBLIC_VISITOR]: {
      dept: GovernanceDepartmentId.DEPT_10_COMMUNITY,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Public Visitor',
    },
    [PlatformRole.REGISTERED_ADVENTURER]: {
      dept: GovernanceDepartmentId.DEPT_10_COMMUNITY,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Registered Adventurer',
    },
    [PlatformRole.VERIFIED_ADVENTURER]: {
      dept: GovernanceDepartmentId.DEPT_10_COMMUNITY,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Verified Adventurer',
    },
    [PlatformRole.PROFESSIONAL_GUIDE]: {
      dept: GovernanceDepartmentId.DEPT_09_MARKETPLACE,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Professional Guide',
    },
    [PlatformRole.GUIDE_COMPANY]: {
      dept: GovernanceDepartmentId.DEPT_09_MARKETPLACE,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Guide Company',
    },
    [PlatformRole.TOUR_OPERATOR]: {
      dept: GovernanceDepartmentId.DEPT_09_MARKETPLACE,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Tour Operator',
    },
    [PlatformRole.ORGANIZATION_MEMBER]: {
      dept: GovernanceDepartmentId.DEPT_09_MARKETPLACE,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Organization Member',
    },
    [PlatformRole.ORGANIZATION_ADMIN]: {
      dept: GovernanceDepartmentId.DEPT_09_MARKETPLACE,
      requiresMfa: true,
      isPrivileged: false,
      label: 'Organization Admin',
    },
    [PlatformRole.DESTINATION_PARTNER]: {
      dept: GovernanceDepartmentId.DEPT_08_DESTINATION,
      requiresMfa: true,
      isPrivileged: false,
      label: 'Destination Partner',
    },
    [PlatformRole.SPONSOR]: {
      dept: GovernanceDepartmentId.DEPT_06_FINANCE,
      requiresMfa: false,
      isPrivileged: false,
      label: 'Commercial Sponsor',
    },
    [PlatformRole.REVIEWER]: {
      dept: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Accredited Reviewer',
    },
    [PlatformRole.SENIOR_REVIEWER]: {
      dept: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Senior Reviewer',
    },
    [PlatformRole.HERITAGE_GUARDIAN]: {
      dept: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Heritage Guardian (NF-01)',
    },
    [PlatformRole.APPEAL_REVIEWER]: {
      dept: GovernanceDepartmentId.DEPT_04_APPEAL_REVIEW,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Independent Appeal Reviewer',
    },
    [PlatformRole.MODERATOR]: {
      dept: GovernanceDepartmentId.DEPT_10_COMMUNITY,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Community Moderator',
    },
    [PlatformRole.CUSTOMER_SUPPORT]: {
      dept: GovernanceDepartmentId.DEPT_07_OPERATIONS,
      requiresMfa: true,
      isPrivileged: false,
      label: 'Customer Support Specialist',
    },
    [PlatformRole.FINANCE_OPERATOR]: {
      dept: GovernanceDepartmentId.DEPT_06_FINANCE,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Finance Operator',
    },
    [PlatformRole.SECURITY_AUDITOR]: {
      dept: GovernanceDepartmentId.DEPT_05_SECURITY,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Security & Internal Auditor',
    },
    [PlatformRole.SYSTEM_ADMIN]: {
      dept: GovernanceDepartmentId.DEPT_07_OPERATIONS,
      requiresMfa: true,
      isPrivileged: true,
      label: 'System Administrator',
    },
    [PlatformRole.GOVERNANCE_MEMBER]: {
      dept: GovernanceDepartmentId.DEPT_02_GOVERNANCE_COMMITTEE,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Governance Committee Member',
    },
    [PlatformRole.FOUNDER]: {
      dept: GovernanceDepartmentId.DEPT_01_FOUNDER_OFFICE,
      requiresMfa: true,
      isPrivileged: true,
      label: 'Platform Founder',
    },
  };

  const roleValues = Object.entries(roleDepartmentMap).map(([roleId, meta]) => ({
    roleId: roleId as PlatformRole,
    roleName: meta.label,
    departmentId: meta.dept,
    requiresMfa: meta.requiresMfa,
    isPrivileged: meta.isPrivileged,
  }));
  await db.insert(schema.roles).values(roleValues).onConflictDoNothing();

  // 4. Seed all 6 Macro-Domains (MD-01..06) (batched)
  const macroDomainValues = MACRO_DOMAINS_SUMMARY.map((md) => ({
    domainId: md.domainId,
    nameEn: md.nameEn,
    nameNe: md.nameNe,
    description: md.summary,
  }));
  await db.insert(schema.macroDomains).values(macroDomainValues).onConflictDoNothing();

  // 5. Seed all 24 Adventure Categories (CAT-01..24) (batched)
  const categoryValues = ADVENTURE_CATEGORIES_24.map((cat) => {
    const fullCat = cat as Partial<typeof cat> & {
      requiredSkills?: readonly string[];
      requiredEquipmentAndSafety?: readonly string[];
      badgeEligible?: boolean;
      competitiveLeaderboardEligible?: boolean;
    };
    return {
      categoryId: cat.categoryId,
      macroDomainId: cat.macroDomainId,
      nameEn: cat.nameEn,
      nameNe: cat.nameNe,
      difficultySystem: cat.difficultyScale,
      riskLevel: cat.riskLevel,
      requiredSkillsJson: fullCat.requiredSkills ?? ['NAVIGATION', 'ALPINE_SAFETY'],
      safetyRequirementsJson: fullCat.requiredEquipmentAndSafety ?? [
        'FIRST_AID_KIT',
        'EMERGENCY_BEACON',
      ],
      minReviewerTier: cat.minReviewerTier,
      minEcfThreshold: cat.minEcfScoreThreshold,
      badgeEligible: fullCat.badgeEligible ?? true,
      competitiveRankEligible:
        fullCat.competitiveLeaderboardEligible ?? cat.categoryId !== 'CAT-24',
    };
  });
  await db.insert(schema.adventureCategories).values(categoryValues).onConflictDoNothing();

  // 6. Seed Geographical Regions & All 100 PROPOSED Featured Destinations (batched)
  const uniqueRegionIds = Array.from(new Set(ALL_100_FEATURED_DESTINATIONS.map((d) => d.regionId)));
  const regionValues = uniqueRegionIds.map((regId) => ({
    regionId: regId,
    continent: regId.includes('HIM') || regId.includes('KAR') ? 'ASIA' : 'GLOBAL',
    nameEn: regId.replace(/^REG-/, '').replace(/-/g, ' '),
    nameNe: regId,
    parentRegionId: null,
  }));
  await db.insert(schema.geographicalRegions).values(regionValues).onConflictDoNothing();

  const destinationValues = ALL_100_FEATURED_DESTINATIONS.map((dest) => ({
    destinationId: dest.destinationId,
    regionId: dest.regionId,
    entityType: dest.entityType,
    nameEn: dest.nameEn,
    nameNe: dest.nameNe,
    altNamesJson: dest.indigenousOrAltNames,
    countryCodesJson: dest.countryCodes,
    latitude: dest.coordinates.latitude.toFixed(6),
    longitude: dest.coordinates.longitude.toFixed(6),
    elevationMeters: dest.elevationMeters.toFixed(2),
    primaryCategoryId: dest.primaryCategoryId,
    difficultySummary: dest.difficultySummary,
    permitRequirements: dest.permitRequirements,
    sourceUrl: dest.source_url,
    sourceType: dest.source_type,
    lastVerifiedDate: dest.last_verified_date,
    confidence: dest.confidence,
    unverifiedFieldsJson: dest.unverified_fields,
    geopoliticalFlag: dest.geopoliticalFlag,
    emergencySarProtocolJson: dest.emergencyRescueProtocol,
    seasonalRiskMatrixJson: dest.seasonalRiskMatrix,
    verificationStatus: 'PROPOSED' as const,
  }));
  await db.insert(schema.destinations).values(destinationValues).onConflictDoNothing();

  const sourceValues = ALL_100_FEATURED_DESTINATIONS.map((dest) => ({
    sourceId: `SRC-${dest.destinationId}-01`,
    destinationId: dest.destinationId,
    authorityName: dest.jurisdictionDisplay,
    documentTitle: `${dest.nameEn} Official Survey & Mountaineering Reference`,
    sourceUrl: dest.source_url,
    sourceType: dest.source_type,
  }));
  await db.insert(schema.destinationSources).values(sourceValues).onConflictDoNothing();

  const routeValues: Array<typeof schema.destinationRoutes.$inferInsert> = [];
  const achievementValues: Array<typeof schema.achievements.$inferInsert> = [];
  const badgeValues: Array<typeof schema.badges.$inferInsert> = [];

  for (const dest of ALL_100_FEATURED_DESTINATIONS) {
    for (const routeId of dest.separatedRouteIds) {
      routeValues.push({
        routeId,
        destinationId: dest.destinationId,
        trailCorridorId: null,
        nameEn: `${dest.nameEn} — Standard Route (${routeId})`,
        nameNe: `${dest.nameNe} — मानक मार्ग (${routeId})`,
        startPointCoords: {
          lat: dest.coordinates.latitude,
          lon: dest.coordinates.longitude,
          elevM: Math.max(0, Math.round(dest.elevationMeters * 0.55)),
        },
        endPointCoords: {
          lat: dest.coordinates.latitude,
          lon: dest.coordinates.longitude,
          elevM: dest.elevationMeters,
        },
        gpxReferenceUri: null,
        distanceKm: '24.50',
        elevationGainM: Math.max(100, Math.round(dest.elevationMeters * 0.45)),
        elevationLossM: Math.max(100, Math.round(dest.elevationMeters * 0.45)),
        technicalGrade: dest.difficultySummary,
        hazardsJson: ['ALTITUDE', 'WEATHER_EXPOSURE'],
        acclimatizationProfileJson: {
          maxSleepingGainPerDayM: 500,
          restDayEveryNDays: 3,
          nonMedicalDisclaimer: true,
        },
        routeVersion: 'v1.0',
        status: 'PROPOSED',
      });
    }

    const achId = `ACH-${dest.destinationId}`;
    achievementValues.push({
      achievementId: achId,
      categoryId: dest.primaryCategoryId,
      destinationId: dest.destinationId,
      archetype: 'TYPE_B',
      titleEn: `${dest.nameEn} Verified Completion`,
      titleNe: `${dest.nameNe} प्रमाणित उपलब्धि`,
      completionCriteriaJson: {
        minEcfScore: 75,
        requiresVisualEvidence: true,
      },
      basePoints: Math.max(100, Math.round(dest.elevationMeters / 4)),
      difficultyMultiplier: '1.50',
      altitudeRemotenessFactor: '1.25',
      requiresHeritageGuardian: dest.requiresHeritageGuardianCheck,
      effectivePolicyVersion: 'v1.1.0',
    });

    badgeValues.push({
      badgeId: dest.associatedBadgeId,
      destinationId: dest.destinationId,
      achievementId: achId,
      nameEn: `${dest.nameEn} Summit Shield`,
      nameNe: `${dest.nameNe} गौरव शिल्ड`,
      shieldDesignSpecJson: {
        obsidianBlack: '#0A0A0A',
        metallicGold: '#C9A86A',
        highlightGold: '#FFD700',
        summitWhite: '#FFFFFF',
        elevationMeters: dest.elevationMeters,
      },
      isFreeStandard: true,
    });
  }

  await db.insert(schema.destinationRoutes).values(routeValues).onConflictDoNothing();
  await db.insert(schema.achievements).values(achievementValues).onConflictDoNothing();
  await db.insert(schema.badges).values(badgeValues).onConflictDoNothing();

  return {
    macroDomainsSeeded: MACRO_DOMAINS_SUMMARY.length,
    categoriesSeeded: ADVENTURE_CATEGORIES_24.length,
    rolesSeeded: Object.keys(roleDepartmentMap).length,
    destinationsSeeded: ALL_100_FEATURED_DESTINATIONS.length,
    routesSeeded: routeValues.length,
  };
}
