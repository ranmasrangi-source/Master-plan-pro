/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 5 — Achievement Applications, Evidence Custody & Witness Engine (Tables #27 to #34)
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  applicationStatusEnum,
  calendarSystemEnum,
  dataPrivacyTierEnum,
  ecfPathwayClassificationEnum,
  evidenceAccessActionEnum,
  evidenceFileTypeEnum,
  evidencePillarEnum,
  platformRoleEnum,
  witnessAttestationStatusEnum,
  witnessRelationshipEnum,
} from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { achievements, adventureCategories } from './02_taxonomy_standards.ts';
import { destinationRoutes, destinations } from './03_destinations_routes_safety.ts';

/**
 * Table #27: achievement_applications
 */
export const achievementApplications = pgTable(
  'achievement_applications',
  {
    applicationId: varchar('application_id', { length: 64 }).primaryKey(),
    applicantUserId: varchar('applicant_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    categoryId: varchar('category_id', { length: 16 })
      .notNull()
      .references(() => adventureCategories.categoryId, { onDelete: 'restrict' }),
    achievementId: varchar('achievement_id', { length: 64 })
      .notNull()
      .references(() => achievements.achievementId, { onDelete: 'restrict' }),
    destinationId: varchar('destination_id', { length: 32 })
      .notNull()
      .references(() => destinations.destinationId, { onDelete: 'restrict' }),
    routeId: varchar('route_id', { length: 64 })
      .notNull()
      .references(() => destinationRoutes.routeId, { onDelete: 'restrict' }),
    attemptStartDate: varchar('attempt_start_date', { length: 10 }).notNull(),
    attemptCompletionDate: varchar('attempt_completion_date', { length: 10 }).notNull(),
    dateCalendarSystem: calendarSystemEnum('date_calendar_system')
      .notNull()
      .default('GREGORIAN_AD'),
    originalBsDateString: varchar('original_bs_date_string', { length: 32 }),
    supplementalOxygenUsed: boolean('supplemental_oxygen_used').notNull().default(false),
    lntSelfScore: integer('lnt_self_score').notNull().default(100),
    applicantDeclarationSigned: boolean('applicant_declaration_signed').notNull(),
    status: applicationStatusEnum('status').notNull().default('SUBMITTED'),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_applications_applicant').on(table.applicantUserId),
    index('idx_applications_destination').on(table.destinationId),
    index('idx_applications_status').on(table.status),
    check('chk_applications_declaration_signed', sql`${table.applicantDeclarationSigned} = TRUE`),
    check('chk_applications_lnt_score', sql`${table.lntSelfScore} >= 0 AND ${table.lntSelfScore} <= 100`),
  ]
);

/**
 * Table #28: evidence_files (TIER_3_RESTRICTED_EVIDENCE)
 */
export const evidenceFiles = pgTable(
  'evidence_files',
  {
    evidenceId: varchar('evidence_id', { length: 64 }).primaryKey(),
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    uploaderUserId: varchar('uploader_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    evidencePillar: evidencePillarEnum('evidence_pillar').notNull(),
    fileType: evidenceFileTypeEnum('file_type').notNull(),
    storageUri: text('storage_uri').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    exifSummaryJson: jsonb('exif_summary_json'), // Nullable: missing EXIF never penalized
    gpxDemRmseMeters: numeric('gpx_dem_rmse_meters', { precision: 8, scale: 3 }),
    residentialGeozoneMasked: boolean('residential_geozone_masked').notNull().default(true),
    rawBinaryDeletedPostApproval: boolean('raw_binary_deleted_post_approval')
      .notNull()
      .default(false),
    privacyTier: dataPrivacyTierEnum('privacy_tier')
      .notNull()
      .default('TIER_3_RESTRICTED_EVIDENCE'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_evidence_files_application').on(table.applicationId)]
);

/**
 * Table #29: evidence_hashes (IMMUTABLE APPEND-ONLY LEDGER)
 */
export const evidenceHashes = pgTable(
  'evidence_hashes',
  {
    hashRecordId: varchar('hash_record_id', { length: 64 }).primaryKey(),
    evidenceId: varchar('evidence_id', { length: 64 })
      .notNull()
      .references(() => evidenceFiles.evidenceId, { onDelete: 'restrict' }),
    sha256Hex: char('sha256_hex', { length: 64 }).notNull(),
    pHash64Hex: char('p_hash_64_hex', { length: 16 }),
    pHashMirror64Hex: char('p_hash_mirror_64_hex', { length: 16 }),
    dHash64Hex: char('d_hash_64_hex', { length: 16 }),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_evidence_hashes_sha256').on(table.sha256Hex),
    index('idx_evidence_hashes_phash').on(table.pHash64Hex),
  ]
);

/**
 * Table #30: evidence_access_logs (IMMUTABLE APPEND-ONLY LEDGER)
 */
export const evidenceAccessLogs = pgTable(
  'evidence_access_logs',
  {
    accessLogId: varchar('access_log_id', { length: 64 }).primaryKey(),
    evidenceId: varchar('evidence_id', { length: 64 })
      .notNull()
      .references(() => evidenceFiles.evidenceId, { onDelete: 'restrict' }),
    actorUserId: varchar('actor_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    actorRole: platformRoleEnum('actor_role').notNull(),
    actionType: evidenceAccessActionEnum('action_type').notNull(),
    sha256VerifiedMatch: boolean('sha256_verified_match').notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_evidence_access_logs_evidence').on(table.evidenceId)]
);

/**
 * Table #31: evidence_confidence_assessments (System #1 & Amendment A3)
 */
export const evidenceConfidenceAssessments = pgTable(
  'evidence_confidence_assessments',
  {
    assessmentId: varchar('assessment_id', { length: 64 }).primaryKey(),
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    pil01VisualScore: integer('pil01_visual_score').notNull(),
    pil02TelemetryScore: integer('pil02_telemetry_score').notNull(),
    pil03DocumentaryScore: integer('pil03_documentary_score').notNull(),
    pil04WitnessScore: integer('pil04_witness_score').notNull(),
    pil05ChronologyScore: integer('pil05_chronology_score').notNull(),
    totalConfidenceScore: integer('total_confidence_score').notNull(),
    requiredThreshold: integer('required_threshold').notNull().default(75),
    isGpsOnlyBlocked: boolean('is_gps_only_blocked').notNull(),
    pathwayClassification: ecfPathwayClassificationEnum('pathway_classification').notNull(),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_ecf_pillar_bounds_and_sum',
      sql`${table.pil01VisualScore} BETWEEN 0 AND 40 AND ${table.pil02TelemetryScore} BETWEEN 0 AND 35 AND ${table.pil03DocumentaryScore} BETWEEN 0 AND 35 AND ${table.pil04WitnessScore} BETWEEN 0 AND 30 AND ${table.pil05ChronologyScore} BETWEEN 0 AND 20 AND ${table.totalConfidenceScore} = (${table.pil01VisualScore} + ${table.pil02TelemetryScore} + ${table.pil03DocumentaryScore} + ${table.pil04WitnessScore} + ${table.pil05ChronologyScore})`
    ),
  ]
);

/**
 * Table #32: ecf_override_audit_logs (IMMUTABLE APPEND-ONLY LEDGER — Amendment A3)
 */
export const ecfOverrideAuditLogs = pgTable(
  'ecf_override_audit_logs',
  {
    overrideId: varchar('override_id', { length: 64 }).primaryKey(),
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    computedEcfScore: integer('computed_ecf_score').notNull(),
    requiredThreshold: integer('required_threshold').notNull(),
    missingPillarReason: text('missing_pillar_reason').notNull(),
    compensatingEvidenceSummary: text('compensating_evidence_summary').notNull(),
    primarySeniorReviewerId: varchar('primary_senior_reviewer_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    coSigningSeniorReviewerId: varchar('co_signing_senior_reviewer_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    verificationLeadApprovalId: varchar('verification_lead_approval_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
    prevAuditHash: char('prev_audit_hash', { length: 64 }).notNull(),
    overrideEventHash: char('override_event_hash', { length: 64 }).notNull().unique(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_ecf_override_distinct_signers',
      sql`${table.primarySeniorReviewerId} <> ${table.coSigningSeniorReviewerId}`
    ),
  ]
);

/**
 * Table #33: witness_attestations (System #2)
 */
export const witnessAttestations = pgTable(
  'witness_attestations',
  {
    attestationId: varchar('attestation_id', { length: 64 }).primaryKey(),
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    applicantUserId: varchar('applicant_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    witnessUserId: varchar('witness_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'restrict',
    }),
    witnessLicenseOrIdRef: varchar('witness_license_or_id_ref', { length: 120 }),
    relationshipType: witnessRelationshipEnum('relationship_type').notNull(),
    coiAndPerjurySigned: boolean('coi_and_perjury_signed').notNull(),
    verificationTokenHash: char('verification_token_hash', { length: 64 }).notNull(),
    ipDeviceDistinctFromApplicant: boolean('ip_device_distinct_from_applicant').notNull(),
    status: witnessAttestationStatusEnum('status').notNull().default('INVITED'),
    attestedAt: timestamp('attested_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_witness_attestation_app_witness').on(table.applicationId, table.witnessUserId),
    check(
      'chk_witness_no_self_attestation',
      sql`${table.witnessUserId} IS NULL OR ${table.witnessUserId} <> ${table.applicantUserId}`
    ),
  ]
);

/**
 * Table #34: offline_sync_receipts (System #20)
 */
export const offlineSyncReceipts = pgTable('offline_sync_receipts', {
  syncId: varchar('sync_id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  clientDraftId: varchar('client_draft_id', { length: 64 }).notNull(),
  serverApplicationId: varchar('server_application_id', { length: 64 })
    .notNull()
    .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
  syncedAt: timestamp('synced_at', { withTimezone: true }).notNull().defaultNow(),
});
