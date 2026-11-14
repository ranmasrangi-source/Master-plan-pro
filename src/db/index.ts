/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: PostgreSQL Connection Pool (pg Object Method) & Embedded PostgreSQL 16 (PGlite)
 * Supports production Cloud SQL (via SQL_HOST/SQL_USER/SQL_PASSWORD/SQL_DB_NAME) and
 * real PostgreSQL 16 engine execution in CI/local environments without startup probe loops.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzleNodePg, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite, PgliteDatabase } from 'drizzle-orm/pglite';
import { Pool } from 'pg';
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

export type DrizzleDatabase = NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;

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
 * Creates or retrieves the production pg.Pool using the Object Method (no startup probes).
 */
export const createPool = (): Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

/**
 * Creates an isolated real PostgreSQL 16 instance via @electric-sql/pglite
 * for deterministic integration testing, local development, and 48h DR drills.
 */
export async function createEmbeddedPostgresEngine(): Promise<{
  readonly pglite: PGlite;
  readonly db: PgliteDatabase<typeof schema>;
}> {
  const pglite = new PGlite();
  await pglite.waitReady;
  const db = drizzlePglite(pglite, { schema });
  return { pglite, db };
}

/**
 * Applies Phase 05 SQL migrations (0000_phase05_core_86_tables.sql & 0001_append_only_triggers_and_roles.sql)
 * inside an atomic PostgreSQL transaction (BEGIN ... COMMIT / ROLLBACK).
 */
export async function applyPhase05Migrations(pglite: PGlite): Promise<{
  readonly appliedMigrationFiles: readonly string[];
  readonly totalTablesCreated: number;
}> {
  const migrationsDir = path.join(process.cwd(), 'src/db/migrations');
  const migrationFiles = ['0000_phase05_core_86_tables.sql', '0001_append_only_triggers_and_roles.sql'];

  await pglite.exec('BEGIN;');
  try {
    for (const fileName of migrationFiles) {
      const fullPath = path.join(migrationsDir, fileName);
      const rawSql = fs.readFileSync(fullPath, 'utf-8');
      // Drizzle uses `--> statement-breakpoint` markers; strip markers and execute cleanly
      const cleanedSql = rawSql.replace(/--> statement-breakpoint/g, '\n');
      await pglite.exec(cleanedSql);
    }
    await pglite.exec('COMMIT;');
  } catch (error) {
    await pglite.exec('ROLLBACK;');
    throw error;
  }

  const countResult = await pglite.query<{ count: string }>(
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
 */
export async function executeWithDepartmentRole<T>(
  pglite: PGlite,
  roleName: AllowedDepartmentDbRole,
  fn: (execSql: (queryText: string, params?: unknown[]) => Promise<{ rows: unknown[] }>) => Promise<T>
): Promise<T> {
  if (!ALLOWED_DEPARTMENT_DB_ROLES.includes(roleName)) {
    const err = new Error(`INVALID_DB_ROLE: Role "${roleName}" is not in the approved departmental role allowlist.`) as Error & { code?: string };
    err.code = '42501';
    throw err;
  }

  await pglite.exec('BEGIN;');
  try {
    await pglite.exec(`SET LOCAL ROLE ${roleName};`);

    const guardedExecSql = async (queryText: string, params?: unknown[]): Promise<{ rows: unknown[] }> => {
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
      const res = await pglite.query(queryText, params);
      return { rows: res.rows };
    };

    const result = await fn(guardedExecSql);
    await pglite.exec('COMMIT;');
    return result;
  } catch (error) {
    await pglite.exec('ROLLBACK;');
    throw error;
  }
}

/**
 * Seeds the authoritative Phase 05 baseline data into PostgreSQL:
 * - Constitutional system_settings locks
 * - Initial policy_versions ('v1.1.0')
 * - All 21 Platform Roles across 11 Governance Departments
 * - All 6 Macro-Domains (MD-01..06)
 * - All 24 Adventure Categories (CAT-01..24)
 * - Geographical Regions & All 100 PROPOSED Featured Destinations (DEST-001..100)
 * - Separated Destination Routes (RTE-*), Achievements (ACH-*), and Standard Free Badges (BDG-*)
 */
export async function seedPhase05Database(db: PgliteDatabase<typeof schema>): Promise<{
  readonly macroDomainsSeeded: number;
  readonly categoriesSeeded: number;
  readonly rolesSeeded: number;
  readonly destinationsSeeded: number;
  readonly routesSeeded: number;
}> {
  // 1. Seed system_settings constitutional locks
  const lockEntries = Object.entries(CONSTITUTIONAL_LOCKS);
  for (const [key, value] of lockEntries) {
    await db
      .insert(schema.systemSettings)
      .values({
        settingKey: key,
        settingValueJson: { value },
        isConstitutionalLock: true,
      })
      .onConflictDoNothing();
  }

  // 2. Seed initial policy version
  await db
    .insert(schema.policyVersions)
    .values({
      versionId: 'v1.1.0',
      title: '0 TO 8848 Ultimate V1.1 Constitutional Baseline',
      summary: 'Incorporates Binding Amendments A1–A7, CHK-01.14–01.18, and NF-01–05.',
    })
    .onConflictDoNothing();

  // 3. Seed all 21 Constitutional Platform Roles
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

  for (const [roleId, meta] of Object.entries(roleDepartmentMap)) {
    await db
      .insert(schema.roles)
      .values({
        roleId: roleId as PlatformRole,
        roleName: meta.label,
        departmentId: meta.dept,
        requiresMfa: meta.requiresMfa,
        isPrivileged: meta.isPrivileged,
      })
      .onConflictDoNothing();
  }

  // 4. Seed all 6 Macro-Domains (MD-01..06)
  for (const md of MACRO_DOMAINS_SUMMARY) {
    await db
      .insert(schema.macroDomains)
      .values({
        domainId: md.domainId,
        nameEn: md.nameEn,
        nameNe: md.nameNe,
        description: md.summary,
      })
      .onConflictDoNothing();
  }

  // 5. Seed all 24 Adventure Categories (CAT-01..24)
  for (const cat of ADVENTURE_CATEGORIES_24) {
    const fullCat = cat as Partial<typeof cat> & {
      requiredSkills?: readonly string[];
      requiredEquipmentAndSafety?: readonly string[];
      badgeEligible?: boolean;
      competitiveLeaderboardEligible?: boolean;
    };
    await db
      .insert(schema.adventureCategories)
      .values({
        categoryId: cat.categoryId,
        macroDomainId: cat.macroDomainId,
        nameEn: cat.nameEn,
        nameNe: cat.nameNe,
        difficultySystem: cat.difficultyScale,
        riskLevel: cat.riskLevel,
        requiredSkillsJson: fullCat.requiredSkills ?? ['NAVIGATION', 'ALPINE_SAFETY'],
        safetyRequirementsJson: fullCat.requiredEquipmentAndSafety ?? ['FIRST_AID_KIT', 'EMERGENCY_BEACON'],
        minReviewerTier: cat.minReviewerTier,
        minEcfThreshold: cat.minEcfScoreThreshold,
        badgeEligible: fullCat.badgeEligible ?? true,
        competitiveRankEligible:
          fullCat.competitiveLeaderboardEligible ?? cat.categoryId !== 'CAT-24',
      })
      .onConflictDoNothing();
  }

  // 6. Seed Geographical Regions & All 100 PROPOSED Featured Destinations
  const uniqueRegionIds = Array.from(new Set(ALL_100_FEATURED_DESTINATIONS.map((d) => d.regionId)));
  for (const regId of uniqueRegionIds) {
    await db
      .insert(schema.geographicalRegions)
      .values({
        regionId: regId,
        continent: regId.includes('HIM') || regId.includes('KAR') ? 'ASIA' : 'GLOBAL',
        nameEn: regId.replace(/^REG-/, '').replace(/-/g, ' '),
        nameNe: regId,
        parentRegionId: null,
      })
      .onConflictDoNothing();
  }

  let routesCount = 0;
  for (const dest of ALL_100_FEATURED_DESTINATIONS) {
    await db
      .insert(schema.destinations)
      .values({
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
        verificationStatus: 'PROPOSED',
      })
      .onConflictDoNothing();

    // Seed destination_sources entry
    await db
      .insert(schema.destinationSources)
      .values({
        sourceId: `SRC-${dest.destinationId}-01`,
        destinationId: dest.destinationId,
        authorityName: dest.jurisdictionDisplay,
        documentTitle: `${dest.nameEn} Official Survey & Mountaineering Reference`,
        sourceUrl: dest.source_url,
        sourceType: dest.source_type,
      })
      .onConflictDoNothing();

    // Seed separated destination_routes
    for (const routeId of dest.separatedRouteIds) {
      await db
        .insert(schema.destinationRoutes)
        .values({
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
        })
        .onConflictDoNothing();
      routesCount++;
    }

    // Seed primary achievement & free standard badge for each destination
    const achId = `ACH-${dest.destinationId}`;
    await db
      .insert(schema.achievements)
      .values({
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
      })
      .onConflictDoNothing();

    await db
      .insert(schema.badges)
      .values({
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
      })
      .onConflictDoNothing();
  }

  return {
    macroDomainsSeeded: MACRO_DOMAINS_SUMMARY.length,
    categoriesSeeded: ADVENTURE_CATEGORIES_24.length,
    rolesSeeded: Object.keys(roleDepartmentMap).length,
    destinationsSeeded: ALL_100_FEATURED_DESTINATIONS.length,
    routesSeeded: routesCount,
  };
}
