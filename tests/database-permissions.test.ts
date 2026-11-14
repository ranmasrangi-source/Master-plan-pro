/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 05 Database Architecture, Security Roles, Triggers & Persistence Suite
 * Executes DB-TEST-01 through DB-TEST-12 against a real PostgreSQL 16 engine (@electric-sql/pglite)
 * with Drizzle ORM, testing all 86 physical tables, 7-tier FK DAG, append-only triggers (SQLSTATE 42501),
 * departmental RBAC role isolation, governance quorum enforcement, AES-256-GCM privacy controls,
 * backup/restore verification, and IDatabaseRepository adapter portability.
 */

import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import type { PGlite } from '@electric-sql/pglite';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import { createPhase05ExpressApp } from '../server.ts';
import type { IDatabaseRepository } from '../src/adapters/IDatabaseRepository.ts';
import { InMemoryRelationalRepository } from '../src/adapters/InMemoryRelationalRepository.ts';
import {
  PostgresDrizzleRepository,
  decryptEnvelopeAes256Gcm,
  encryptEnvelopeAes256Gcm,
} from '../src/adapters/PostgresDrizzleRepository.ts';
import {
  ALL_86_PHYSICAL_TABLE_NAMES,
  ALLOWED_DEPARTMENT_DB_ROLES,
  IMMUTABLE_APPEND_ONLY_TABLES,
  applyPhase05Migrations,
  createEmbeddedPostgresEngine,
  createPool,
  executeWithDepartmentRole,
  seedPhase05Database,
} from '../src/db/index.ts';
import type * as schema from '../src/db/schema.ts';
import {
  GENESIS_AUDIT_BLOCK_HASH,
  appendCryptographicAuditRecord,
  computeSha256Hex,
  verifyCryptographicAuditChainDetailed,
} from '../src/services/securityAndVerificationCore.ts';
import { GovernanceDepartmentId, PlatformRole } from '../src/types/constitution.ts';
import { CredentialValidityStatus } from '../src/types/credentials.ts';

/**
 * Helper that asserts a PostgreSQL query fails with a specific 5-character SQLSTATE code
 * (e.g. '42501' insufficient_privilege, '23503' foreign_key_violation, '23505' unique_violation, '23514' check_violation).
 */
async function assertPgSqlState(
  fn: () => Promise<unknown>,
  expectedSqlState: string,
  contextDescription: string
): Promise<void> {
  let caughtError: unknown = null;
  try {
    await fn();
  } catch (err) {
    caughtError = err;
  }
  assert.ok(
    caughtError !== null,
    `Expected PostgreSQL error (${expectedSqlState}) for [${contextDescription}], but operation succeeded`
  );
  const pgCode =
    (caughtError as { code?: string; cause?: { code?: string } })?.code ??
    (caughtError as { cause?: { code?: string } })?.cause?.code ??
    '';
  const errMsg = caughtError instanceof Error ? caughtError.message : String(caughtError);
  assert.equal(
    pgCode,
    expectedSqlState,
    `Expected SQLSTATE '${expectedSqlState}' for [${contextDescription}], but got code='${pgCode}' message='${errMsg}'`
  );
}

describe('PHASE 05 — PostgreSQL 86-Table Schema, Drizzle ORM, Security Roles & Append-Only Ledger Suite (DB-TEST-01..12)', () => {
  let pglite: PGlite;
  let db: PgliteDatabase<typeof schema>;
  let pgRepo: PostgresDrizzleRepository;

  before(async () => {
    const engine = await createEmbeddedPostgresEngine();
    pglite = engine.pglite;
    db = engine.db;
    await applyPhase05Migrations(pglite);
    await seedPhase05Database(db);
    pgRepo = new PostgresDrizzleRepository({ db, pglite });
  });

  it('DB-TEST-01: Database Connection, Pool Configuration (Object Method) & Constitutional System Settings Locks', async () => {
    // 1. Verify pg.Pool factory uses the Object Method without startup connection loops
    const pool = createPool();
    assert.equal(typeof pool.query, 'function');

    // 2. Verify live PostgreSQL 16 engine connection and system_settings constitutional locks (#81)
    const pingRes = await pglite.query<{ one: number }>('SELECT 1 AS one');
    assert.equal(pingRes.rows[0].one, 1);

    const settingsRes = await pglite.query<{
      setting_key: string;
      setting_value_json: { value: unknown };
      is_constitutional_lock: boolean;
    }>(`SELECT setting_key, setting_value_json, is_constitutional_lock FROM public.system_settings`);

    const settingsMap = new Map(
      settingsRes.rows.map((r) => [r.setting_key, r.setting_value_json.value])
    );
    assert.equal(settingsMap.get('PAYMENTS_ENABLED'), false, 'PAYMENTS_ENABLED must be false');
    assert.equal(settingsMap.get('BLOCKCHAIN_ENABLED'), false, 'BLOCKCHAIN_ENABLED must be false');
    assert.equal(
      settingsMap.get('AI_FINAL_DECISION_ALLOWED'),
      false,
      'AI_FINAL_DECISION_ALLOWED must be false'
    );
    assert.equal(settingsMap.get('STANDARD_BADGE_PRICE_USD'), 0);
    assert.equal(settingsMap.get('STANDARD_CERTIFICATE_PRICE_USD'), 0);
    assert.equal(settingsMap.get('PUBLIC_VERIFICATION_PRICE_USD'), 0);
    assert.equal(settingsMap.get('SPONSOR_VERIFICATION_INFLUENCE_MULTIPLIER'), 0);
  });

  it('DB-TEST-02: 7-Tier Migration Execution (86 Physical Tables) & Transactional DDL Rollback Verification', async () => {
    // 1. Verify exactly 86 physical base tables exist in public schema
    assert.equal(ALL_86_PHYSICAL_TABLE_NAMES.length, 86);
    const tablesRes = await pglite.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    assert.equal(
      tablesRes.rows.length,
      86,
      `Expected 86 physical tables in PostgreSQL information_schema.tables, found ${tablesRes.rows.length}`
    );

    const actualTableSet = new Set(tablesRes.rows.map((r) => r.table_name));
    for (const expectedTable of ALL_86_PHYSICAL_TABLE_NAMES) {
      assert.equal(
        actualTableSet.has(expectedTable),
        true,
        `Missing required physical table in PostgreSQL: ${expectedTable}`
      );
    }

    // 2. Verify transactional DDL rollback on simulated mid-migration failure leaves zero partial tables
    const tempEngine = await createEmbeddedPostgresEngine();
    await assert.rejects(async () => {
      await tempEngine.pglite.exec(`
        BEGIN;
        CREATE TABLE temp_partial_migration_test (id varchar(64) PRIMARY KEY);
        SELECT * FROM non_existent_table_causing_ddl_abort;
        COMMIT;
      `);
    });
    await tempEngine.pglite.exec('ROLLBACK;');
    const partialCheck = await tempEngine.pglite.query<{ cnt: string }>(
      `SELECT COUNT(*)::text AS cnt FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'temp_partial_migration_test'`
    );
    assert.equal(
      Number(partialCheck.rows[0].cnt),
      0,
      'Failed transactional DDL migration must roll back completely with 0 partial tables'
    );
    await tempEngine.pglite.close();
  });

  it('DB-TEST-03: Foreign Key Referential Integrity & ON DELETE RESTRICT Enforcement Across All 7 DAG Tiers', async () => {
    // Seed a complete chain across Tiers 1 -> 2 -> 3 -> 4 -> 5 to test ON DELETE RESTRICT
    await pglite.exec(`
      INSERT INTO public.users (id, email, password_hash, account_status, residency_region)
      VALUES
        ('USR-FK-APPLICANT', 'applicant.fk@0to8848.org', 'argon2id$hash1', 'ACTIVE', 'NP'),
        ('USR-FK-REVIEWER-1', 'reviewer1.fk@0to8848.org', 'argon2id$hash2', 'ACTIVE', 'NP'),
        ('USR-FK-REVIEWER-2', 'reviewer2.fk@0to8848.org', 'argon2id$hash3', 'ACTIVE', 'NP'),
        ('USR-FK-LEAD-1', 'lead1.fk@0to8848.org', 'argon2id$hash4', 'ACTIVE', 'NP')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.achievement_applications (
        application_id, applicant_user_id, category_id, achievement_id, destination_id, route_id,
        attempt_start_date, attempt_completion_date, date_calendar_system, lnt_self_score,
        applicant_declaration_signed, status, policy_version
      ) VALUES (
        'APP-FK-001', 'USR-FK-APPLICANT', 'CAT-12', 'ACH-DEST-001', 'DEST-001', 'RTE-001A',
        '2026-05-10', '2026-05-19', 'GREGORIAN_AD', 95, TRUE, 'APPROVED', 'v1.1.0'
      ) ON CONFLICT (application_id) DO NOTHING;

      INSERT INTO public.verification_cases (
        case_id, application_id, required_reviewer_tier, requires_dual_senior,
        requires_heritage_guardian, assigned_reviewer_ids_json, status
      ) VALUES (
        'CASE-FK-001', 'APP-FK-001', 'DUAL_L4_SOVEREIGN_8000M_POLAR', TRUE,
        TRUE, '["USR-FK-REVIEWER-1", "USR-FK-REVIEWER-2"]'::jsonb, 'APPROVED'
      ) ON CONFLICT (case_id) DO NOTHING;

      INSERT INTO public.credential_registry (
        credential_id, subject_user_id, application_id, verification_case_id,
        achievement_id, destination_id, route_id, badge_id, certificate_id,
        completion_date, status, previous_event_hash, current_credential_hash, policy_version
      ) VALUES (
        '0TO8848-CRED-2026-000501', 'USR-FK-APPLICANT', 'APP-FK-001', 'CASE-FK-001',
        'ACH-DEST-001', 'DEST-001', 'RTE-001A', 'BDG-DEST-001', 'CERT-2026-000501',
        '2026-05-19', 'VALID',
        '${'0'.repeat(64)}', '${computeSha256Hex('0TO8848-CRED-2026-000501')}', 'v1.1.0'
      ) ON CONFLICT (credential_id) DO NOTHING;

      INSERT INTO public.public_credentials (
        credential_id, public_display_name, achievement_title_en, achievement_title_ne,
        destination_name_en, destination_name_ne, route_name_en, elevation_meters,
        completion_date, status, current_credential_hash, replay_3d_opt_in
      ) VALUES (
        '0TO8848-CRED-2026-000501', 'Pasang Sherpa', 'Mount Everest Verified Completion',
        'सगरमाथा प्रमाणित उपलब्धि', 'Mount Everest (Sagarmatha)', 'सगरमाथा',
        'South Col — Southeast Ridge (RTE-001A)', 8848.86, '2026-05-19', 'VALID',
        '${computeSha256Hex('0TO8848-CRED-2026-000501')}', FALSE
      ) ON CONFLICT (credential_id) DO NOTHING;
    `);

    // 1. Attempting to DELETE a referenced user must fail with SQLSTATE 23503 (foreign_key_violation)
    await assertPgSqlState(
      () => pglite.query(`DELETE FROM public.users WHERE id = 'USR-FK-APPLICANT'`),
      '23503',
      'ON DELETE RESTRICT on users referenced by achievement_applications/credential_registry'
    );

    // 2. Attempting to DELETE a referenced destination (DEST-001) must fail with SQLSTATE 23503
    await assertPgSqlState(
      () => pglite.query(`DELETE FROM public.destinations WHERE destination_id = 'DEST-001'`),
      '23503',
      'ON DELETE RESTRICT on destinations referenced by destination_routes and achievement_applications'
    );

    // 3. Attempting to DELETE a referenced achievement_application must fail with SQLSTATE 23503
    await assertPgSqlState(
      () =>
        pglite.query(
          `DELETE FROM public.achievement_applications WHERE application_id = 'APP-FK-001'`
        ),
      '23503',
      'ON DELETE RESTRICT on achievement_applications referenced by verification_cases'
    );

    // 4. Attempting to DELETE a referenced verification_case must fail with SQLSTATE 23503
    await assertPgSqlState(
      () => pglite.query(`DELETE FROM public.verification_cases WHERE case_id = 'CASE-FK-001'`),
      '23503',
      'ON DELETE RESTRICT on verification_cases referenced by credential_registry'
    );
  });

  it('DB-TEST-04: Unique Constraints, Domain CHECK Constraints & 100 PROPOSED Destinations Catalog Verification', async () => {
    // 1. Verify all 100 destinations (DEST-001..DEST-100) are seeded as PROPOSED with nonRescuePlatformDisclaimer = true
    const destinations = await pgRepo.getFeaturedDestinations();
    assert.equal(destinations.length, 100, 'Expected exactly 100 seeded destinations');
    for (let i = 0; i < 100; i++) {
      const expectedId = `DEST-${String(i + 1).padStart(3, '0')}`;
      assert.equal(destinations[i].destinationId, expectedId);
      assert.equal(destinations[i].status, 'PROPOSED');
      assert.equal(destinations[i].emergencyRescueProtocol.nonRescuePlatformDisclaimer, true);
      assert.ok(
        destinations[i].unverified_fields.includes('nearest_trauma_center_field_verification')
      );
    }

    // 2. Verify composite unique constraints on verification_assignments (#38):
    // uq_verification_assignments_case_slot (case_id, reviewer_slot) &
    // uq_verification_assignments_case_reviewer (case_id, reviewer_user_id)
    await pglite.exec(`
      INSERT INTO public.verification_assignments (
        assignment_id, case_id, reviewer_user_id, reviewer_slot, coi_check_passed, coi_declaration_signed_at
      ) VALUES (
        'ASG-001', 'CASE-FK-001', 'USR-FK-REVIEWER-1', 'PRIMARY', TRUE, NOW()
      );
    `);

    // Duplicate slot on same case -> SQLSTATE 23505 (unique_violation)
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.verification_assignments (
            assignment_id, case_id, reviewer_user_id, reviewer_slot, coi_check_passed, coi_declaration_signed_at
          ) VALUES (
            'ASG-002-DUP-SLOT', 'CASE-FK-001', 'USR-FK-REVIEWER-2', 'PRIMARY', TRUE, NOW()
          );
        `),
      '23505',
      'Duplicate (case_id, reviewer_slot) must violate uq_verification_assignments_case_slot'
    );

    // Same reviewer assigned to both PRIMARY and CO_SIGNER_SENIOR on same case -> SQLSTATE 23505
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.verification_assignments (
            assignment_id, case_id, reviewer_user_id, reviewer_slot, coi_check_passed, coi_declaration_signed_at
          ) VALUES (
            'ASG-003-SAME-REV', 'CASE-FK-001', 'USR-FK-REVIEWER-1', 'CO_SIGNER_SENIOR', TRUE, NOW()
          );
        `),
      '23505',
      'Duplicate (case_id, reviewer_user_id) must violate uq_verification_assignments_case_reviewer'
    );

    // 3. Verify CHECK constraint: evidence_confidence_assessments 5-pillar sum must match total_confidence_score (SQLSTATE 23514)
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.evidence_confidence_assessments (
            assessment_id, application_id, pil01_visual_score, pil02_telemetry_score,
            pil03_documentary_score, pil04_witness_score, pil05_chronology_score,
            total_confidence_score, required_threshold, is_gps_only_blocked, pathway_classification
          ) VALUES (
            'ECF-BAD-SUM', 'APP-FK-001', 30, 30, 20, 20, 10,
            999, 75, FALSE, 'STANDARD_MULTIMODAL'
          );
        `),
      '23514',
      'Mismatched 5-pillar ECF score total must violate chk_ecf_pillar_bounds_and_sum'
    );

    // 4. Verify CHECK constraint: badges.is_free_standard = TRUE (SQLSTATE 23514)
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.badges (
            badge_id, destination_id, achievement_id, name_en, name_ne, shield_design_spec_json, is_free_standard
          ) VALUES (
            'BDG-PAID-ILLEGAL', 'DEST-001', 'ACH-DEST-001', 'Illegal Paid Badge', 'अवैध ब्याज', '{}'::jsonb, FALSE
          );
        `),
      '23514',
      'badges with is_free_standard = FALSE must violate chk_badges_free_standard_forever'
    );

    // 5. Verify CHECK constraint: ai_audit_logs cannot set can_approve_or_reject_achievement = TRUE (SQLSTATE 23514)
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.ai_audit_logs (
            audit_id, provider_name, model_version, task_type, input_sha256,
            requires_human_review, can_approve_or_reject_achievement
          ) VALUES (
            'AI-ILLEGAL-01', 'google-genai', 'gemini-2.5-flash', 'OCR_PERMIT_ASSIST',
            '${computeSha256Hex('in')}', TRUE, TRUE
          );
        `),
      '23514',
      'ai_audit_logs with can_approve_or_reject_achievement = TRUE must violate chk_ai_audit_logs_constitutional_lock'
    );
  });

  it('DB-TEST-05: ACID Transaction Atomicity, Rollback on Partial Failure & SELECT ... FOR UPDATE NOWAIT Locking', async () => {
    // 1. Seed a secondary application & case for transactional credential issuance rollback test
    await pglite.exec(`
      INSERT INTO public.achievement_applications (
        application_id, applicant_user_id, category_id, achievement_id, destination_id, route_id,
        attempt_start_date, attempt_completion_date, date_calendar_system, lnt_self_score,
        applicant_declaration_signed, status, policy_version
      ) VALUES (
        'APP-TX-ABORT-888', 'USR-FK-APPLICANT', 'CAT-12', 'ACH-DEST-002', 'DEST-002', 'RTE-002A',
        '2026-05-10', '2026-05-19', 'GREGORIAN_AD', 95, TRUE, 'APPROVED', 'v1.1.0'
      ) ON CONFLICT (application_id) DO NOTHING;

      INSERT INTO public.verification_cases (
        case_id, application_id, required_reviewer_tier, requires_dual_senior,
        requires_heritage_guardian, assigned_reviewer_ids_json, status
      ) VALUES (
        'CASE-TX-ABORT-888', 'APP-TX-ABORT-888', 'DUAL_L4_SOVEREIGN_8000M_POLAR', TRUE,
        TRUE, '["USR-FK-REVIEWER-1", "USR-FK-REVIEWER-2"]'::jsonb, 'APPROVED'
      ) ON CONFLICT (case_id) DO NOTHING;
    `);

    const abortedCredId = '0TO8848-CRED-2026-000888';
    await assert.rejects(async () => {
      await pgRepo.withTransaction(async (tx) => {
        await pgRepo.appendCredentialRegistryRecord(
          {
            credentialId: abortedCredId,
            subjectUserId: 'USR-FK-APPLICANT',
            applicationId: 'APP-TX-ABORT-888',
            verificationCaseId: 'CASE-TX-ABORT-888',
            achievementId: 'ACH-DEST-002',
            destinationId: 'DEST-002',
            routeId: 'RTE-002A',
            badgeId: 'BDG-DEST-002',
            certificateId: 'CERT-ABORT-888',
            completionDateIso: '2026-05-19',
            issuedAtIso: '2026-11-14T01:00:00.000Z',
            issuingAuthority: '0 TO 8848 Independent Verification Department',
            status: CredentialValidityStatus.VALID,
            previousEventHash: computeSha256Hex('0TO8848-CRED-2026-000501'),
            currentCredentialHash: computeSha256Hex(abortedCredId),
            policyVersion: 'v1.1.0',
          },
          tx
        );
        throw new Error('SIMULATED_MID_TRANSACTION_FAILURE');
      });
    }, /SIMULATED_MID_TRANSACTION_FAILURE/);

    const checkAbortedCred = await pgRepo.getPublicCredentialVerification(abortedCredId);
    assert.equal(
      checkAbortedCred,
      null,
      'Rolled-back transaction must leave zero orphan rows in public_credentials / credential_registry'
    );

    const checkAbortedEvent = await pglite.query<{ cnt: string }>(
      `SELECT COUNT(*)::text AS cnt FROM public.credential_lifecycle_events WHERE credential_id = '${abortedCredId}'`
    );
    assert.equal(
      Number(checkAbortedEvent.rows[0].cnt),
      0,
      'Rolled-back transaction must leave zero orphan rows in credential_lifecycle_events'
    );

    // 2. Verify PostgreSQL SELECT ... FOR UPDATE NOWAIT row locking executes cleanly inside a transaction
    await pglite.exec('BEGIN;');
    const lockedCase = await pglite.query<{ case_id: string; status: string }>(
      `SELECT case_id, status FROM public.verification_cases WHERE case_id = 'CASE-FK-001' FOR UPDATE NOWAIT`
    );
    assert.equal(lockedCase.rows.length, 1);
    assert.equal(lockedCase.rows[0].case_id, 'CASE-FK-001');
    await pglite.exec('COMMIT;');
  });

  it('DB-TEST-06: Immutable Append-Only Triggers on All 6 Ledgers Block UPDATE, DELETE & TRUNCATE with Explicit SQLSTATE 42501', async () => {
    assert.equal(IMMUTABLE_APPEND_ONLY_TABLES.length, 6);

    // Build a 2-record cryptographic hash chain for audit_logs (#78)
    const chain1 = appendCryptographicAuditRecord([], {
      auditId: 'AUD-DB-001',
      timestampIso: '2026-11-14T01:00:00.000Z',
      actorUserId: 'USR-FK-REVIEWER-1',
      actorRole: PlatformRole.SENIOR_REVIEWER,
      departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      action: 'CASE_CLAIMED',
      targetEntityId: 'CASE-FK-001',
    });
    const fullAuditChain = appendCryptographicAuditRecord(chain1, {
      auditId: 'AUD-DB-002',
      timestampIso: '2026-11-14T01:05:00.000Z',
      actorUserId: 'USR-FK-REVIEWER-2',
      actorRole: PlatformRole.SENIOR_REVIEWER,
      departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      action: 'DUAL_SENIOR_APPROVED',
      targetEntityId: 'CASE-FK-001',
    });

    // Seed 1 valid row into each of the 6 append-only tables
    await pglite.exec(`
      INSERT INTO public.evidence_files (
        evidence_id, application_id, uploader_user_id, evidence_pillar, file_type,
        storage_uri, size_bytes, residential_geozone_masked, raw_binary_deleted_post_approval
      ) VALUES (
        'EV-IMMUT-001', 'APP-FK-001', 'USR-FK-APPLICANT', 'PIL-01_VISUAL', 'PHOTO',
        's3://bucket/ev-immut-001.jpg', 204800, TRUE, FALSE
      ) ON CONFLICT (evidence_id) DO NOTHING;

      INSERT INTO public.evidence_hashes (
        hash_record_id, evidence_id, sha256_hex, p_hash_64_hex
      ) VALUES (
        'EH-001', 'EV-IMMUT-001', '${computeSha256Hex('ev1')}', 'f8c492a17b3e60d5'
      ) ON CONFLICT (hash_record_id) DO NOTHING;

      INSERT INTO public.evidence_access_logs (
        access_log_id, evidence_id, actor_user_id, actor_role, action_type, sha256_verified_match
      ) VALUES (
        'EAL-001', 'EV-IMMUT-001', 'USR-FK-REVIEWER-1', 'SENIOR_REVIEWER', 'REVIEW_VIEW', TRUE
      ) ON CONFLICT (access_log_id) DO NOTHING;

      INSERT INTO public.ecf_override_audit_logs (
        override_id, application_id, computed_ecf_score, required_threshold,
        missing_pillar_reason, compensating_evidence_summary,
        primary_senior_reviewer_id, co_signing_senior_reviewer_id, verification_lead_approval_id,
        policy_version, prev_audit_hash, override_event_hash
      ) VALUES (
        'EOAL-001', 'APP-FK-001', 110, 75,
        'Satellite tracker battery froze at 8400m',
        'Verified summit logbook + 2 independent Sherpa witness attestations',
        'USR-FK-REVIEWER-1', 'USR-FK-REVIEWER-2', 'USR-FK-LEAD-1',
        'v1.1.0', '${GENESIS_AUDIT_BLOCK_HASH}', '${computeSha256Hex('eoal-chain-1')}'
      ) ON CONFLICT (override_id) DO NOTHING;

      INSERT INTO public.credential_lifecycle_events (
        event_id, credential_id, event_type, reason, authorized_by_quorum_or_case_id,
        prev_hash, event_hash
      ) VALUES (
        'CLE-001', '0TO8848-CRED-2026-000501', 'ISSUED', 'Initial dual-senior issuance',
        'CASE-FK-001', '${GENESIS_AUDIT_BLOCK_HASH}', '${computeSha256Hex('cle-chain-1')}'
      ) ON CONFLICT (event_id) DO NOTHING;

      INSERT INTO public.audit_logs (
        audit_id, sequence_number, actor_user_id, actor_role, department_id,
        action, target_entity_type, target_entity_id, metadata_json,
        prev_audit_hash, current_audit_hash, timestamp
      ) VALUES
        (
          '${fullAuditChain[0].auditId}', ${fullAuditChain[0].sequenceNumber},
          '${fullAuditChain[0].actorUserId}', '${fullAuditChain[0].actorRole}',
          '${fullAuditChain[0].departmentId}', '${fullAuditChain[0].action}',
          'VERIFICATION_CASE', '${fullAuditChain[0].targetEntityId}', '{}'::jsonb,
          '${fullAuditChain[0].prevAuditHash}', '${fullAuditChain[0].currentAuditHash}',
          '${fullAuditChain[0].timestampIso}'
        ),
        (
          '${fullAuditChain[1].auditId}', ${fullAuditChain[1].sequenceNumber},
          '${fullAuditChain[1].actorUserId}', '${fullAuditChain[1].actorRole}',
          '${fullAuditChain[1].departmentId}', '${fullAuditChain[1].action}',
          'VERIFICATION_CASE', '${fullAuditChain[1].targetEntityId}', '{}'::jsonb,
          '${fullAuditChain[1].prevAuditHash}', '${fullAuditChain[1].currentAuditHash}',
          '${fullAuditChain[1].timestampIso}'
        )
      ON CONFLICT (audit_id) DO NOTHING;

      INSERT INTO public.security_events (
        event_id, severity, event_type, actor_user_id, summary, prev_event_hash, current_event_hash
      ) VALUES (
        'SE-001', 'LOW', 'CONSTITUTIONAL_GATE_ENFORCED', 'USR-FK-REVIEWER-1',
        'Blocked /api/v1/payments probe',
        '${GENESIS_AUDIT_BLOCK_HASH}', '${computeSha256Hex('se-chain-1')}'
      ) ON CONFLICT (event_id) DO NOTHING;
    `);

    const chainCheck = verifyCryptographicAuditChainDetailed(fullAuditChain);
    assert.equal(chainCheck.intact, true, 'Persisted audit_logs SHA-256 hash chain must be intact');

    // Verify UPDATE, DELETE, and TRUNCATE on all 6 immutable tables raise explicit SQLSTATE '42501'
    const updateAttempts: ReadonlyArray<{ table: string; sql: string }> = [
      {
        table: 'evidence_hashes',
        sql: `UPDATE public.evidence_hashes SET sha256_hex = '${computeSha256Hex('tampered')}' WHERE hash_record_id = 'EH-001'`,
      },
      {
        table: 'evidence_access_logs',
        sql: `UPDATE public.evidence_access_logs SET sha256_verified_match = FALSE WHERE access_log_id = 'EAL-001'`,
      },
      {
        table: 'ecf_override_audit_logs',
        sql: `UPDATE public.ecf_override_audit_logs SET compensating_evidence_summary = 'TAMPERED' WHERE override_id = 'EOAL-001'`,
      },
      {
        table: 'credential_lifecycle_events',
        sql: `UPDATE public.credential_lifecycle_events SET reason = 'TAMPERED' WHERE event_id = 'CLE-001'`,
      },
      {
        table: 'audit_logs',
        sql: `UPDATE public.audit_logs SET action = 'TAMPERED' WHERE audit_id = 'AUD-DB-001'`,
      },
      {
        table: 'security_events',
        sql: `UPDATE public.security_events SET summary = 'TAMPERED' WHERE event_id = 'SE-001'`,
      },
    ];

    for (const item of updateAttempts) {
      await assertPgSqlState(
        () => pglite.query(item.sql),
        '42501',
        `BEFORE UPDATE trigger on ${item.table} must raise SQLSTATE 42501`
      );
      await assertPgSqlState(
        () => pglite.query(`DELETE FROM public.${item.table}`),
        '42501',
        `BEFORE DELETE trigger on ${item.table} must raise SQLSTATE 42501`
      );
      await assertPgSqlState(
        () => pglite.query(`TRUNCATE TABLE public.${item.table}`),
        '42501',
        `BEFORE TRUNCATE trigger on ${item.table} must raise SQLSTATE 42501`
      );
    }
  });

  it('DB-TEST-07: Default-Deny Privileges, Non-Transferable Soulbound Credentials & Governance Proposal Quorum Validation (SQLSTATE 42501)', async () => {
    // 1. Soulbound Non-Transferability: Attempting to change credential_registry.subject_user_id must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.query(
          `UPDATE public.credential_registry SET subject_user_id = 'USR-FK-REVIEWER-1' WHERE credential_id = '0TO8848-CRED-2026-000501'`
        ),
      '42501',
      'Soulbound credential_registry.subject_user_id transfer must be blocked with SQLSTATE 42501'
    );

    // 2. Attempting to delete from credential_registry must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.query(
          `DELETE FROM public.credential_registry WHERE credential_id = '0TO8848-CRED-2026-000501'`
        ),
      '42501',
      'DELETE on credential_registry must be blocked with SQLSTATE 42501'
    );

    // 3. Governance Proposal & Role Assignment Validation (#06 role_assignments + #69 governance_proposals):
    await pglite.exec(`
      INSERT INTO public.governance_proposals (
        proposal_id, department_id, action_type, proposed_by_user_id,
        co_signed_by_user_ids_json, required_quorum_count, quorum_met,
        timelock_expires_at, executed_at, status
      ) VALUES (
        'PROP-UNEXECUTED-01', 'DEPT-02_GOVERNANCE_COMMITTEE', 'GRANT_HERITAGE_GUARDIAN',
        'USR-FK-REVIEWER-1', '["USR-FK-REVIEWER-1"]'::jsonb, 2, FALSE,
        NOW() + INTERVAL '72 hours', NULL, 'PENDING_QUORUM'
      ), (
        'PROP-EXECUTED-02', 'DEPT-02_GOVERNANCE_COMMITTEE', 'GRANT_HERITAGE_GUARDIAN',
        'USR-FK-REVIEWER-1', '["USR-FK-REVIEWER-1", "USR-FK-REVIEWER-2"]'::jsonb, 2, TRUE,
        NOW() - INTERVAL '1 hour', NOW(), 'EXECUTED'
      ) ON CONFLICT (proposal_id) DO NOTHING;
    `);

    // 3a. Self-promotion (user_id = granted_by_user_id) must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.role_assignments (
            assignment_id, user_id, role_id, granted_by_user_id, granted_by_proposal_id
          ) VALUES (
            'RA-SELF-PROMO', 'USR-FK-APPLICANT', 'SENIOR_REVIEWER', 'USR-FK-APPLICANT', 'PROP-EXECUTED-02'
          );
        `),
      '42501',
      'Self-promotion in role_assignments must fail with SQLSTATE 42501'
    );

    // 3b. Assigning a privileged role (HERITAGE_GUARDIAN) without granted_by_proposal_id must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.role_assignments (
            assignment_id, user_id, role_id, granted_by_user_id, granted_by_proposal_id
          ) VALUES (
            'RA-NO-PROP', 'USR-FK-APPLICANT', 'HERITAGE_GUARDIAN', 'USR-FK-REVIEWER-1', NULL
          );
        `),
      '42501',
      'Privileged role assignment without granted_by_proposal_id must fail with SQLSTATE 42501'
    );

    // 3c. Referencing a governance proposal where quorum_met = FALSE or status != 'EXECUTED' must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.role_assignments (
            assignment_id, user_id, role_id, granted_by_user_id, granted_by_proposal_id
          ) VALUES (
            'RA-UNEXECUTED-PROP', 'USR-FK-APPLICANT', 'HERITAGE_GUARDIAN', 'USR-FK-REVIEWER-1', 'PROP-UNEXECUTED-01'
          );
        `),
      '42501',
      'Privileged role assignment referencing unexecuted/non-quorum proposal must fail with SQLSTATE 42501'
    );

    // 3d. Referencing a valid EXECUTED + quorum_met = TRUE proposal succeeds
    await pglite.exec(`
      INSERT INTO public.role_assignments (
        assignment_id, user_id, role_id, granted_by_user_id, granted_by_proposal_id
      ) VALUES (
        'RA-VALID-EXEC', 'USR-FK-APPLICANT', 'HERITAGE_GUARDIAN', 'USR-FK-REVIEWER-1', 'PROP-EXECUTED-02'
      );
    `);
    const validAssignment = await pglite.query<{ role_id: string }>(
      `SELECT role_id FROM public.role_assignments WHERE assignment_id = 'RA-VALID-EXEC'`
    );
    assert.equal(validAssignment.rows[0].role_id, 'HERITAGE_GUARDIAN');
  });

  it('DB-TEST-08: Departmental Role Isolation (SET LOCAL ROLE) & Shared-Pool Anti-Escalation Enforcement (SQLSTATE 42501)', async () => {
    assert.equal(ALLOWED_DEPARTMENT_DB_ROLES.length, 9);

    // 1. app_verification_dept03 (Department 03 Verification) must be denied SELECT on Domain 9 commercial tables (sponsors, subscriptions, invoices, payment_records) with SQLSTATE 42501
    for (const commercialTable of ['sponsors', 'subscriptions', 'invoices', 'payment_records']) {
      await assertPgSqlState(
        () =>
          executeWithDepartmentRole(pglite, 'app_verification_dept03', async (execSql) => {
            await execSql(`SELECT * FROM public.${commercialTable}`);
          }),
        '42501',
        `app_verification_dept03 must be denied SELECT on Domain 9 table ${commercialTable}`
      );
    }

    // Verify app_verification_dept03 CAN read verification_cases
    const dept03ReadCases = await executeWithDepartmentRole(
      pglite,
      'app_verification_dept03',
      async (execSql) => {
        const res = await execSql(
          `SELECT case_id FROM public.verification_cases WHERE case_id = 'CASE-FK-001'`
        );
        return res.rows;
      }
    );
    assert.equal(dept03ReadCases.length, 1);

    // 2. app_finance_dept06 (Department 06 Finance) must be denied UPDATE on verification_cases and credential_registry with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        executeWithDepartmentRole(pglite, 'app_finance_dept06', async (execSql) => {
          await execSql(
            `UPDATE public.verification_cases SET status = 'APPROVED' WHERE case_id = 'CASE-FK-001'`
          );
        }),
      '42501',
      'app_finance_dept06 must be denied UPDATE on verification_cases'
    );

    await assertPgSqlState(
      () =>
        executeWithDepartmentRole(pglite, 'app_finance_dept06', async (execSql) => {
          await execSql(
            `UPDATE public.credential_registry SET status = 'REVOKED' WHERE credential_id = '0TO8848-CRED-2026-000501'`
          );
        }),
      '42501',
      'app_finance_dept06 must be denied UPDATE on credential_registry'
    );

    // 3. app_system_admin_dept07 (Department 07 Platform Admin) must be denied SELECT on whistleblower_reports (DEPT-11 zero-IP vault) with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        executeWithDepartmentRole(pglite, 'app_system_admin_dept07', async (execSql) => {
          await execSql(`SELECT * FROM public.whistleblower_reports`);
        }),
      '42501',
      'app_system_admin_dept07 must be denied SELECT on whistleblower_reports (DEPT-11 vault)'
    );

    // 4. app_ai_assistive_readonly must be denied SELECT on users, verification_cases, and credential_registry with SQLSTATE 42501
    for (const restrictedTable of ['users', 'verification_cases', 'credential_registry']) {
      await assertPgSqlState(
        () =>
          executeWithDepartmentRole(pglite, 'app_ai_assistive_readonly', async (execSql) => {
            await execSql(`SELECT * FROM public.${restrictedTable}`);
          }),
        '42501',
        `app_ai_assistive_readonly must be denied SELECT on ${restrictedTable}`
      );
    }

    // 5. Shared-pool anti-escalation guard: attempting RESET ROLE, SET ROLE postgres, SET SESSION AUTHORIZATION, or DISABLE TRIGGER inside executeWithDepartmentRole must fail with SQLSTATE 42501
    for (const forbiddenCmd of [
      'RESET ROLE',
      'SET ROLE postgres',
      'SET SESSION AUTHORIZATION postgres',
      'ALTER TABLE public.audit_logs DISABLE TRIGGER ALL',
    ]) {
      await assertPgSqlState(
        () =>
          executeWithDepartmentRole(pglite, 'app_verification_dept03', async (execSql) => {
            await execSql(forbiddenCmd);
          }),
        '42501',
        `Shared-pool escalation command [${forbiddenCmd}] must be blocked with SQLSTATE 42501`
      );
    }
  });

  it('DB-TEST-09: Privacy Tiers, Data Residency (NP/EU/UAE/GLOBAL), AES-256-GCM Envelope Encryption, k>=5 Anonymity & Post-Approval Binary Purge with Legal Hold Guard', async () => {
    // 1. Verify Data Residency Partitioning across NP, EU, UAE, and GLOBAL (#01 users & #07 consent_records)
    await pglite.exec(`
      INSERT INTO public.users (id, email, password_hash, account_status, residency_region, privacy_tier)
      VALUES
        ('USR-RES-NP', 'np@0to8848.org', 'hash', 'ACTIVE', 'NP', 'TIER_4_REGULATED_PII'),
        ('USR-RES-EU', 'eu@0to8848.org', 'hash', 'ACTIVE', 'EU', 'TIER_4_REGULATED_PII'),
        ('USR-RES-UAE', 'uae@0to8848.org', 'hash', 'ACTIVE', 'UAE', 'TIER_4_REGULATED_PII'),
        ('USR-RES-GLOBAL', 'global@0to8848.org', 'hash', 'ACTIVE', 'GLOBAL', 'TIER_4_REGULATED_PII')
      ON CONFLICT (id) DO NOTHING;
    `);
    const residencyCounts = await pglite.query<{ residency_region: string; cnt: string }>(
      `SELECT residency_region, COUNT(*)::text AS cnt FROM public.users WHERE id LIKE 'USR-RES-%' GROUP BY residency_region`
    );
    assert.equal(
      residencyCounts.rows.length,
      4,
      'All 4 data residency jurisdictions (NP, EU, UAE, GLOBAL) must be supported'
    );

    // 2. Verify AES-256-GCM authenticated envelope encryption for TIER_4_REGULATED_PII (user_profiles.full_name_encrypted)
    const aadContext = 'USR-RES-NP|NP|FULL_LEGAL_NAME';
    const encryptedFullName = encryptEnvelopeAes256Gcm(
      'Pasang Lhamu Sherpa',
      aadContext
    );

    await pglite.query(
      `INSERT INTO public.user_profiles (
        user_id, display_name, full_name_encrypted, country_code, preferred_locale, privacy_tier
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      ['USR-RES-NP', 'Pasang S.', encryptedFullName, 'NPL', 'ne', 'TIER_4_REGULATED_PII']
    );

    const storedProfile = await pglite.query<{
      full_name_encrypted: string;
      privacy_tier: string;
    }>(`SELECT full_name_encrypted, privacy_tier FROM public.user_profiles WHERE user_id = 'USR-RES-NP'`);
    assert.equal(storedProfile.rows[0].privacy_tier, 'TIER_4_REGULATED_PII');
    assert.equal(
      storedProfile.rows[0].full_name_encrypted.includes('Pasang Lhamu'),
      false,
      'Raw plaintext PII must never appear in stored TIER_4_REGULATED_PII column'
    );

    const decryptedPlaintext = decryptEnvelopeAes256Gcm(
      storedProfile.rows[0].full_name_encrypted,
      aadContext
    );
    assert.equal(decryptedPlaintext, 'Pasang Lhamu Sherpa');

    // Wrong AAD context must fail GCM authentication tag verification
    assert.throws(() => {
      decryptEnvelopeAes256Gcm(
        storedProfile.rows[0].full_name_encrypted,
        'USR-RES-EU|EU|WRONG_CONTEXT'
      );
    });

    // 3. Verify k >= 5 k-anonymity floor on aggregated_daily_metrics (#84)
    await assertPgSqlState(
      () =>
        pglite.exec(`
          INSERT INTO public.aggregated_daily_metrics (
            metric_id, date_bucket, metric_key, dimension_key, metric_count, k_anonymity_floor_enforced
          ) VALUES (
            'METRIC-TOO-SMALL', '2026-11-14', 'VERIFIED_ASCENTS', 'REG-NEPAL-KHUMBU', 3, 5
          );
        `),
      '23514',
      'Cohort with metric_count < 5 must violate chk_aggregated_daily_metrics_k_anonymity_floor'
    );

    await pglite.exec(`
      INSERT INTO public.aggregated_daily_metrics (
        metric_id, date_bucket, metric_key, dimension_key, metric_count, k_anonymity_floor_enforced
      ) VALUES (
        'METRIC-VALID-K5', '2026-11-14', 'VERIFIED_ASCENTS', 'REG-NEPAL-KHUMBU', 7, 5
      );
    `);

    // 4. Verify Post-Approval Raw Binary Purge & Legal-Hold Protection:
    // 4a. Create a deletion_requests row with legal_hold_active = TRUE targeting EV-IMMUT-001
    await pglite.exec(`
      INSERT INTO public.deletion_requests (
        deletion_id, user_id, scope, target_evidence_id, legal_hold_active, status
      ) VALUES (
        'DEL-HOLD-001', 'USR-FK-APPLICANT', 'RAW_EVIDENCE_BINARY_ONLY', 'EV-IMMUT-001', TRUE, 'LEGAL_HOLD'
      );
    `);

    // Attempting to set raw_binary_deleted_post_approval = TRUE while legal_hold_active = TRUE must fail with SQLSTATE 42501
    await assertPgSqlState(
      () =>
        pglite.exec(`
          UPDATE public.evidence_files
          SET raw_binary_deleted_post_approval = TRUE, storage_uri = 'PURGED_POST_APPROVAL'
          WHERE evidence_id = 'EV-IMMUT-001';
        `),
      '42501',
      'Purging raw binary evidence while deletion_requests.legal_hold_active = TRUE must fail with SQLSTATE 42501'
    );

    // 4b. Release the legal hold (legal_hold_active = FALSE); now post-approval raw binary purge succeeds while preserving evidence_hashes.sha256_hex
    await pglite.exec(`
      UPDATE public.deletion_requests SET legal_hold_active = FALSE WHERE deletion_id = 'DEL-HOLD-001';
      UPDATE public.evidence_files
      SET raw_binary_deleted_post_approval = TRUE, storage_uri = 'PURGED_POST_APPROVAL'
      WHERE evidence_id = 'EV-IMMUT-001';
    `);

    const purgedCheck = await pglite.query<{
      raw_binary_deleted_post_approval: boolean;
      sha256_hex: string;
    }>(`
      SELECT ef.raw_binary_deleted_post_approval, eh.sha256_hex
      FROM public.evidence_files ef
      JOIN public.evidence_hashes eh ON eh.evidence_id = ef.evidence_id
      WHERE ef.evidence_id = 'EV-IMMUT-001'
    `);
    assert.equal(purgedCheck.rows[0].raw_binary_deleted_post_approval, true);
    assert.equal(purgedCheck.rows[0].sha256_hex, computeSha256Hex('ev1'));
  });

  it('DB-TEST-10: Encrypted Portable Backup Snapshot Export, SHA-256 Manifest Verification & Tamper Rejection', async () => {
    // 1. Export portable snapshot from PostgreSQL repository
    const snapshot = await pgRepo.exportPortableSnapshot();
    assert.ok(snapshot.snapshotId.startsWith('SNAP-'));
    assert.equal(snapshot.schemaVersion, 'v1.1.0-phase05-86tables');
    assert.ok(snapshot.totalRecordsCount >= 200);
    assert.ok(/^[0-9a-f]{64}$/.test(snapshot.sha256ManifestHash));

    // 2. Restore and verify snapshot into pgRepo and check backup_verification_logs (#85)
    const verifyOk = await pgRepo.restoreAndVerifyPortableSnapshot(snapshot);
    assert.equal(verifyOk.manifestVerified, true);
    assert.equal(verifyOk.hashChainIntact, true);
    assert.equal(verifyOk.restoredRecordsCount, snapshot.totalRecordsCount);

    const backupLogRow = await pglite.query<{
      restore_verified: boolean;
      sha256_manifest_hash: string;
    }>(
      `SELECT restore_verified, sha256_manifest_hash FROM public.backup_verification_logs WHERE snapshot_id = $1`,
      [snapshot.snapshotId]
    );
    assert.equal(backupLogRow.rows.length, 1);
    assert.equal(backupLogRow.rows[0].restore_verified, true);
    assert.equal(backupLogRow.rows[0].sha256_manifest_hash, snapshot.sha256ManifestHash);

    // 3. Tamper with manifest SHA-256 hash and verify restore rejects it
    const tamperedSnapshot = {
      ...snapshot,
      sha256ManifestHash: computeSha256Hex('TAMPERED_BACKUP_MANIFEST'),
    };
    await assert.rejects(async () => {
      await pgRepo.restoreAndVerifyPortableSnapshot(tamperedSnapshot);
    });
  });

  it('DB-TEST-11: Vendor-Independent IDatabaseRepository Adapter Portability (PostgresDrizzleRepository vs InMemoryRelationalRepository)', async () => {
    const inMemoryRepo = new InMemoryRelationalRepository();

    async function runPortableAdapterContractSuite(repo: IDatabaseRepository): Promise<void> {
      const categories = await repo.getAdventureCategories();
      assert.equal(categories.length, 24);

      const proposedDests = await repo.getFeaturedDestinations({ status: 'PROPOSED' });
      assert.equal(proposedDests.length, 100);

      const everest = await repo.getDestinationById('DEST-001');
      assert.ok(everest !== null);
      assert.equal(everest.destinationId, 'DEST-001');

      const everestRoutes = await repo.getRoutesByDestination('DEST-001');
      assert.ok(everestRoutes.length >= 1);
      assert.equal(everestRoutes[0].destinationId, 'DEST-001');

      const coiSelf = await repo.verifyNoConflictOfInterest({
        reviewerUserId: 'USR-SAME',
        applicantUserId: 'USR-SAME',
        applicationId: 'APP-01',
      });
      assert.equal(coiSelf.passed, false);
      assert.equal(coiSelf.conflictReason, 'COI_SELF_REVIEW_FORBIDDEN');
    }

    await runPortableAdapterContractSuite(pgRepo);
    await runPortableAdapterContractSuite(inMemoryRepo);

    // Also test credential issuance, hash chain verification, and snapshot round-trip on InMemoryRelationalRepository
    await inMemoryRepo.withTransaction(async (tx) => {
      await inMemoryRepo.appendCredentialRegistryRecord(
        {
          credentialId: '0TO8848-CRED-2026-000777',
          subjectUserId: 'USR-PORTABLE-01',
          applicationId: 'APP-PORTABLE-01',
          verificationCaseId: 'CASE-PORTABLE-01',
          achievementId: 'ACH-DEST-001',
          destinationId: 'DEST-001',
          routeId: 'RTE-001A',
          badgeId: 'BDG-DEST-001',
          certificateId: 'CERT-PORTABLE-01',
          completionDateIso: '2026-05-19',
          issuedAtIso: '2026-11-14T01:00:00.000Z',
          issuingAuthority: '0 TO 8848 Independent Verification Department',
          status: CredentialValidityStatus.VALID,
          previousEventHash: '0'.repeat(64),
          currentCredentialHash: computeSha256Hex('0TO8848-CRED-2026-000777'),
          policyVersion: 'v1.1.0',
        },
        tx
      );
    });
    const memCred = await inMemoryRepo.getPublicCredentialVerification('0TO8848-CRED-2026-000777');
    assert.ok(memCred !== null);
    assert.equal(memCred.status, 'VALID');

    const memChain = await inMemoryRepo.verifyRegistryHashChain();
    assert.equal(memChain.intact, true);
    assert.equal(memChain.verifiedCount, 1);

    const memSnap = await inMemoryRepo.exportPortableSnapshot();
    const memRestore = await inMemoryRepo.restoreAndVerifyPortableSnapshot(memSnap);
    assert.equal(memRestore.manifestVerified, true);
    assert.equal(memRestore.hashChainIntact, true);
  });

  it('DB-TEST-12: Phase 05 Express API Gateway Integration & Cumulative Constitutional Endpoint Verification', async () => {
    const app = createPhase05ExpressApp(async () => pgRepo);
    const server = app.listen(0, '127.0.0.1');
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
      // 1. GET /api/v1/health
      const healthRes = await fetch(`${baseUrl}/api/v1/health`);
      assert.equal(healthRes.status, 200);
      const healthJson = (await healthRes.json()) as {
        status: string;
        physicalTableCount: number;
        constitutionalLocks: { paymentsEnabled: boolean; blockchainEnabled: boolean };
      };
      assert.equal(healthJson.status, 'OK');
      assert.equal(healthJson.physicalTableCount, 86);
      assert.equal(healthJson.constitutionalLocks.paymentsEnabled, false);
      assert.equal(healthJson.constitutionalLocks.blockchainEnabled, false);

      // 2. GET /api/v1/categories
      const catRes = await fetch(`${baseUrl}/api/v1/categories`);
      assert.equal(catRes.status, 200);
      const catJson = (await catRes.json()) as {
        macroDomainsCount: number;
        categoriesCount: number;
      };
      assert.equal(catJson.macroDomainsCount, 6);
      assert.equal(catJson.categoriesCount, 24);

      // 3. GET /api/v1/destinations
      const destRes = await fetch(`${baseUrl}/api/v1/destinations?status=PROPOSED`);
      assert.equal(destRes.status, 200);
      const destJson = (await destRes.json()) as { count: number };
      assert.equal(destJson.count, 100);

      // 4. GET /api/v1/credentials/verify/:credentialId (Issued in DB-TEST-03 vs Unknown vs Preview Fixture)
      const issuedCredRes = await fetch(
        `${baseUrl}/api/v1/credentials/verify/0TO8848-CRED-2026-000501`
      );
      assert.equal(issuedCredRes.status, 200);
      const issuedCredJson = (await issuedCredRes.json()) as {
        status: string;
        isRealAchievement: boolean;
      };
      assert.equal(issuedCredJson.status, 'VALID');
      assert.equal(issuedCredJson.isRealAchievement, true);

      const unknownCredRes = await fetch(
        `${baseUrl}/api/v1/credentials/verify/0TO8848-CRED-2026-999999`
      );
      assert.equal(unknownCredRes.status, 404);

      // 5. Constitutional HTTP 403 Locks on /api/v1/payments/* and /api/v1/blockchain/*
      const paymentRes = await fetch(`${baseUrl}/api/v1/payments/checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amountUsd: 100 }),
      });
      assert.equal(paymentRes.status, 403);
      const paymentJson = (await paymentRes.json()) as { errorCode: string };
      assert.equal(paymentJson.errorCode, 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION');

      const blockchainRes = await fetch(`${baseUrl}/api/v1/blockchain/mint-soulbound`, {
        method: 'POST',
      });
      assert.equal(blockchainRes.status, 403);
      const blockchainJson = (await blockchainRes.json()) as { errorCode: string };
      assert.equal(blockchainJson.errorCode, 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION');
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
