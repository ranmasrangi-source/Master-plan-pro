/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 10 — Governance, Whistleblower, Audit, Federation & System Operations
 * (Schema Groups #69 to #80 = 18 Physical Tables #69 to #86)
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  dataPrivacyTierEnum,
  governanceDepartmentEnum,
  platformRoleEnum,
  securitySeverityEnum,
  supportedLocaleEnum,
} from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { organizations } from './08_marketplace_guides_orgs.ts';

/**
 * Table #69: governance_proposals (System #14 Multi-Sig Quorum & +72h Timelock)
 */
export const governanceProposals = pgTable(
  'governance_proposals',
  {
    proposalId: varchar('proposal_id', { length: 64 }).primaryKey(),
    departmentId: governanceDepartmentEnum('department_id').notNull(),
    actionType: varchar('action_type', { length: 64 }).notNull(),
    proposedByUserId: varchar('proposed_by_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    coSignedByUserIdsJson: jsonb('co_signed_by_user_ids_json').notNull(),
    requiredQuorumCount: integer('required_quorum_count').notNull().default(2),
    quorumMet: boolean('quorum_met').notNull().default(false),
    timelockExpiresAt: timestamp('timelock_expires_at', { withTimezone: true }).notNull(),
    executedAt: timestamp('executed_at', { withTimezone: true }),
    status: varchar('status', { length: 32 }).notNull().default('PENDING_QUORUM'),
  },
  (table) => [
    check('chk_governance_proposals_quorum_floor', sql`${table.requiredQuorumCount} >= 2`),
  ]
);

/**
 * Table #70: continuity_policies (System #14 Expedition Unreachability Protocol)
 */
export const continuityPolicies = pgTable('continuity_policies', {
  policyId: varchar('policy_id', { length: 64 }).primaryKey(),
  founderLastHeartbeatAt: timestamp('founder_last_heartbeat_at', {
    withTimezone: true,
  }).notNull(),
  inactivityThresholdDays: integer('inactivity_threshold_days').notNull().default(30),
  designatedQuorumRolesJson: jsonb('designated_quorum_roles_json').notNull(),
});

/**
 * Table #71: whistleblower_reports (System #4 Zero-IP Isolated Vault — DEPT-11 Only)
 * Strictly omits any IP address, User-Agent, or reporterUserId columns.
 */
export const whistleblowerReports = pgTable('whistleblower_reports', {
  reportId: varchar('report_id', { length: 64 }).primaryKey(),
  receiptCodeHash: char('receipt_code_hash', { length: 64 }).notNull().unique(),
  category: varchar('category', { length: 64 }).notNull(),
  encryptedNarrative: text('encrypted_narrative').notNull(), // AES-256-GCM TIER_4_REGULATED_PII
  assignedInternalAuditorId: varchar('assigned_internal_auditor_id', { length: 64 }).references(
    () => users.id,
    { onDelete: 'restrict' }
  ),
  privacyTier: dataPrivacyTierEnum('privacy_tier')
    .notNull()
    .default('TIER_4_REGULATED_PII'),
  status: varchar('status', { length: 32 }).notNull().default('SUBMITTED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #72: transparency_reports (System #6)
 */
export const transparencyReports = pgTable('transparency_reports', {
  reportId: varchar('report_id', { length: 64 }).primaryKey(),
  periodKey: varchar('period_key', { length: 32 }).notNull().unique(),
  applicationsReviewedCount: integer('applications_reviewed_count').notNull().default(0),
  approvedCount: integer('approved_count').notNull().default(0),
  rejectedCount: integer('rejected_count').notNull().default(0),
  appealsUpheldCount: integer('appeals_upheld_count').notNull().default(0),
  revocationsCount: integer('revocations_count').notNull().default(0),
  generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #73: federation_clients (System #9 Read-Only Federation API)
 */
export const federationClients = pgTable('federation_clients', {
  clientId: varchar('client_id', { length: 64 }).primaryKey(),
  orgId: varchar('org_id', { length: 64 })
    .notNull()
    .references(() => organizations.orgId, { onDelete: 'restrict' }),
  apiKeyHash: char('api_key_hash', { length: 64 }).notNull().unique(),
  allowedScopesJson: jsonb('allowed_scopes_json').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE'),
});

/**
 * Table #74: user_federation_consents
 */
export const userFederationConsents = pgTable(
  'user_federation_consents',
  {
    consentId: varchar('consent_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    orgId: varchar('org_id', { length: 64 })
      .notNull()
      .references(() => organizations.orgId, { onDelete: 'restrict' }),
    grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_user_federation_consents_user_org').on(table.userId, table.orgId),
  ]
);

/**
 * Table #75: community_posts
 */
export const communityPosts = pgTable('community_posts', {
  postId: varchar('post_id', { length: 64 }).primaryKey(),
  authorUserId: varchar('author_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  postType: varchar('post_type', { length: 32 }).notNull(),
  content: text('content').notNull(),
  moderationStatus: varchar('moderation_status', { length: 32 }).notNull().default('PUBLISHED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #76: moderation_cases
 */
export const moderationCases = pgTable('moderation_cases', {
  modCaseId: varchar('mod_case_id', { length: 64 }).primaryKey(),
  targetType: varchar('target_type', { length: 64 }).notNull(),
  targetId: varchar('target_id', { length: 64 }).notNull(),
  reason: text('reason').notNull(),
  moderatorUserId: varchar('moderator_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  actionTaken: varchar('action_taken', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #77: historical_recognitions (Section 25 Legends & Memorial Archive — Excluded from Competitive Leaderboards)
 */
export const historicalRecognitions = pgTable(
  'historical_recognitions',
  {
    legendId: varchar('legend_id', { length: 64 }).primaryKey(),
    honoreeNameEn: varchar('honoree_name_en', { length: 200 }).notNull(),
    honoreeNameNe: varchar('honoree_name_ne', { length: 200 }).notNull(),
    achievementSummary: text('achievement_summary').notNull(),
    historicalDate: varchar('historical_date', { length: 32 }).notNull(),
    authoritativeSourcesJson: jsonb('authoritative_sources_json').notNull(),
    familyRepresentativeConsentNotes: text('family_representative_consent_notes').notNull(),
    approvedByEditorialPanel: boolean('approved_by_editorial_panel').notNull().default(false),
    excludedFromCompetitiveLeaderboards: boolean('excluded_from_competitive_leaderboards')
      .notNull()
      .default(true),
  },
  (table) => [
    check(
      'chk_historical_recognitions_non_competitive',
      sql`${table.excludedFromCompetitiveLeaderboards} = TRUE`
    ),
  ]
);

/**
 * Table #78: audit_logs (IMMUTABLE APPEND-ONLY HASH-CHAINED SYSTEM AUDIT LEDGER)
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    auditId: varchar('audit_id', { length: 64 }).primaryKey(),
    sequenceNumber: integer('sequence_number').notNull().unique(),
    actorUserId: varchar('actor_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'restrict',
    }),
    actorRole: platformRoleEnum('actor_role').notNull(),
    departmentId: governanceDepartmentEnum('department_id').notNull(),
    action: varchar('action', { length: 120 }).notNull(),
    targetEntityType: varchar('target_entity_type', { length: 64 }).notNull(),
    targetEntityId: varchar('target_entity_id', { length: 64 }).notNull(),
    metadataJson: jsonb('metadata_json').notNull(),
    prevAuditHash: char('prev_audit_hash', { length: 64 }).notNull(),
    currentAuditHash: char('current_audit_hash', { length: 64 }).notNull().unique(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_audit_logs_sequence').on(table.sequenceNumber),
    index('idx_audit_logs_actor').on(table.actorUserId),
  ]
);

/**
 * Table #79 (Group 79a): security_incidents (System #15)
 */
export const securityIncidents = pgTable('security_incidents', {
  incidentId: varchar('incident_id', { length: 64 }).primaryKey(),
  severity: securitySeverityEnum('severity').notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  containmentAction: text('containment_action').notNull(),
  regulatoryNoticeRequired: boolean('regulatory_notice_required').notNull().default(false),
  status: varchar('status', { length: 32 }).notNull().default('OPEN'),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

/**
 * Table #80 (Group 79b): security_events (IMMUTABLE APPEND-ONLY SECURITY TELEMETRY LEDGER)
 */
export const securityEvents = pgTable(
  'security_events',
  {
    eventId: varchar('event_id', { length: 64 }).primaryKey(),
    incidentId: varchar('incident_id', { length: 64 }).references(
      () => securityIncidents.incidentId,
      { onDelete: 'restrict' }
    ),
    severity: securitySeverityEnum('severity').notNull(),
    eventType: varchar('event_type', { length: 64 }).notNull(),
    actorUserId: varchar('actor_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'restrict',
    }),
    summary: text('summary').notNull(),
    prevEventHash: char('prev_event_hash', { length: 64 }).notNull(),
    currentEventHash: char('current_event_hash', { length: 64 }).notNull().unique(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_security_events_incident').on(table.incidentId)]
);

/**
 * Table #81 (Group 80a): system_settings (Constitutional Launch Locks)
 */
export const systemSettings = pgTable('system_settings', {
  settingKey: varchar('setting_key', { length: 64 }).primaryKey(),
  settingValueJson: jsonb('setting_value_json').notNull(),
  isConstitutionalLock: boolean('is_constitutional_lock').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #82 (Group 80b): policy_versions
 */
export const policyVersions = pgTable('policy_versions', {
  versionId: varchar('version_id', { length: 32 }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  summary: text('summary').notNull(),
  approvedByProposalId: varchar('approved_by_proposal_id', { length: 64 }),
  effectiveFrom: timestamp('effective_from', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #83 (Group 80c): translation_strings (Human-Verified Multilingual Dictionary)
 */
export const translationStrings = pgTable(
  'translation_strings',
  {
    stringId: varchar('string_id', { length: 64 }).primaryKey(),
    locale: supportedLocaleEnum('locale').notNull(),
    translationKey: varchar('translation_key', { length: 120 }).notNull(),
    translatedText: text('translated_text').notNull(),
    reviewStatus: varchar('review_status', { length: 32 })
      .notNull()
      .default('HUMAN_VERIFIED'),
    policyVersion: varchar('policy_version', { length: 32 })
      .notNull()
      .references(() => policyVersions.versionId, { onDelete: 'restrict' }),
  },
  (table) => [
    uniqueIndex('uq_translation_strings_locale_key_ver').on(
      table.locale,
      table.translationKey,
      table.policyVersion
    ),
  ]
);

/**
 * Table #84 (Group 80d): aggregated_daily_metrics (System #16 k >= 5 k-Anonymity Floor)
 */
export const aggregatedDailyMetrics = pgTable(
  'aggregated_daily_metrics',
  {
    metricId: varchar('metric_id', { length: 64 }).primaryKey(),
    dateBucket: varchar('date_bucket', { length: 10 }).notNull(),
    metricKey: varchar('metric_key', { length: 64 }).notNull(),
    dimensionKey: varchar('dimension_key', { length: 64 }).notNull(),
    metricCount: integer('metric_count').notNull(),
    kAnonymityFloorEnforced: integer('k_anonymity_floor_enforced').notNull().default(5),
  },
  (table) => [
    check(
      'chk_aggregated_daily_metrics_k_anonymity_floor',
      sql`${table.metricCount} >= 5 AND ${table.kAnonymityFloorEnforced} >= 5`
    ),
  ]
);

/**
 * Table #85 (Group 80e): backup_verification_logs (System #18 DR Snapshot Manifest Verification)
 */
export const backupVerificationLogs = pgTable('backup_verification_logs', {
  backupLogId: varchar('backup_log_id', { length: 64 }).primaryKey(),
  snapshotId: varchar('snapshot_id', { length: 64 }).notNull().unique(),
  schemaVersion: varchar('schema_version', { length: 32 }).notNull(),
  sha256ManifestHash: char('sha256_manifest_hash', { length: 64 }).notNull(),
  totalRecordsCount: integer('total_records_count').notNull(),
  residencyRegionScope: varchar('residency_region_scope', { length: 16 })
    .notNull()
    .default('ALL'),
  restoreVerified: boolean('restore_verified').notNull().default(false),
  exportedAt: timestamp('exported_at', { withTimezone: true }).notNull().defaultNow(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
});

/**
 * Table #86 (Group 80f): ai_audit_logs (Sections 50–51 Assistive AI Governance Lock)
 */
export const aiAuditLogs = pgTable(
  'ai_audit_logs',
  {
    auditId: varchar('audit_id', { length: 64 }).primaryKey(),
    providerName: varchar('provider_name', { length: 64 }).notNull(),
    modelVersion: varchar('model_version', { length: 64 }).notNull(),
    taskType: varchar('task_type', { length: 64 }).notNull(),
    inputSha256: char('input_sha256', { length: 64 }).notNull(),
    requiresHumanReview: boolean('requires_human_review').notNull().default(true),
    canApproveOrRejectAchievement: boolean('can_approve_or_reject_achievement')
      .notNull()
      .default(false),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_ai_audit_logs_constitutional_lock',
      sql`${table.requiresHumanReview} = TRUE AND ${table.canApproveOrRejectAchievement} = FALSE`
    ),
  ]
);
