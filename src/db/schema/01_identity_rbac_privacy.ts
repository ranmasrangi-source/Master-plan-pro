/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 1 — Identity, RBAC & Privacy Governance (Tables #01 to #09)
 */

import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  accountStatusEnum,
  ageBracketEnum,
  dataPrivacyTierEnum,
  dataResidencyRegionEnum,
  deletionScopeEnum,
  governanceDepartmentEnum,
  permissionActionEnum,
  platformRoleEnum,
  privacyRequestTypeEnum,
  supportedLocaleEnum,
} from './00_enums.ts';

/**
 * Table #01: users
 */
export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    emailVerified: boolean('email_verified').notNull().default(false),
    mfaEnabled: boolean('mfa_enabled').notNull().default(false),
    mfaSecretEncrypted: text('mfa_secret_encrypted'), // TIER_4_REGULATED_PII AES-256-GCM
    accountStatus: accountStatusEnum('account_status').notNull().default('ACTIVE'),
    ageBracket: ageBracketEnum('age_bracket').notNull().default('ADULT_18_PLUS'),
    residencyRegion: dataResidencyRegionEnum('residency_region').notNull().default('GLOBAL'),
    privacyTier: dataPrivacyTierEnum('privacy_tier')
      .notNull()
      .default('TIER_4_REGULATED_PII'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_users_email').on(table.email),
    index('idx_users_status').on(table.accountStatus),
    index('idx_users_residency').on(table.residencyRegion),
  ]
);

/**
 * Table #02: user_profiles
 */
export const userProfiles = pgTable('user_profiles', {
  userId: varchar('user_id', { length: 64 })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 120 }).notNull(),
  fullNameEncrypted: text('full_name_encrypted').notNull(), // TIER_4_REGULATED_PII AES-256-GCM
  countryCode: varchar('country_code', { length: 3 }).notNull(),
  preferredLocale: supportedLocaleEnum('preferred_locale').notNull().default('en'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  publicProfileVisible: boolean('public_profile_visible').notNull().default(true),
  showOnLeaderboards: boolean('show_on_leaderboards').notNull().default(true),
  shareEvidenceSummaryPublicly: boolean('share_evidence_summary_publicly')
    .notNull()
    .default(false),
  lowBandwidthDefault: boolean('low_bandwidth_default').notNull().default(false),
  privacyTier: dataPrivacyTierEnum('privacy_tier')
    .notNull()
    .default('TIER_4_REGULATED_PII'),
});

/**
 * Table #03: user_sessions
 */
export const userSessions = pgTable(
  'user_sessions',
  {
    sessionId: varchar('session_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    userAgentSummary: varchar('user_agent_summary', { length: 255 }).notNull(),
    mfaVerifiedAt: timestamp('mfa_verified_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revocationReason: text('revocation_reason'),
  },
  (table) => [index('idx_user_sessions_user_id').on(table.userId)]
);

/**
 * Table #04: roles (21 Constitutional Platform Roles)
 */
export const roles = pgTable('roles', {
  roleId: platformRoleEnum('role_id').primaryKey(),
  roleName: varchar('role_name', { length: 120 }).notNull().unique(),
  departmentId: governanceDepartmentEnum('department_id').notNull(),
  requiresMfa: boolean('requires_mfa').notNull().default(false),
  isPrivileged: boolean('is_privileged').notNull().default(false),
});

/**
 * Table #05: permissions
 */
export const permissions = pgTable('permissions', {
  permissionId: varchar('permission_id', { length: 64 }).primaryKey(),
  resource: varchar('resource', { length: 120 }).notNull(),
  action: permissionActionEnum('action').notNull(),
  description: text('description').notNull(),
});

/**
 * Table #06: role_assignments
 * Note: grantedByProposalId references governance_proposals.proposal_id (enforced in SQL DDL & trigger
 * so privileged roles cannot be self-assigned).
 */
export const roleAssignments = pgTable(
  'role_assignments',
  {
    assignmentId: varchar('assignment_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    roleId: platformRoleEnum('role_id')
      .notNull()
      .references(() => roles.roleId, { onDelete: 'restrict' }),
    grantedByUserId: varchar('granted_by_user_id', { length: 64 }).references(
      () => users.id,
      { onDelete: 'restrict' }
    ),
    grantedByProposalId: varchar('granted_by_proposal_id', { length: 64 }),
    grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_role_assignments_user_role').on(table.userId, table.roleId),
    index('idx_role_assignments_user_id').on(table.userId),
  ]
);

/**
 * Table #07: consent_records
 */
export const consentRecords = pgTable(
  'consent_records',
  {
    consentId: varchar('consent_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
    purposeKey: varchar('purpose_key', { length: 120 }).notNull(),
    granted: boolean('granted').notNull(),
    guardianVerified: boolean('guardian_verified').notNull().default(false),
    residencyRegion: dataResidencyRegionEnum('residency_region').notNull().default('GLOBAL'),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_consent_records_user_id').on(table.userId)]
);

/**
 * Table #08: privacy_requests
 */
export const privacyRequests = pgTable(
  'privacy_requests',
  {
    requestId: varchar('request_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    requestType: privacyRequestTypeEnum('request_type').notNull(),
    status: varchar('status', { length: 32 }).notNull().default('PENDING'),
    exportDownloadHash: varchar('export_download_hash', { length: 64 }),
    residencyRegion: dataResidencyRegionEnum('residency_region').notNull().default('GLOBAL'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [index('idx_privacy_requests_user_id').on(table.userId)]
);

/**
 * Table #09: deletion_requests (System #17 Post-Approval Raw Evidence Erasure & Account Anonymization)
 */
export const deletionRequests = pgTable(
  'deletion_requests',
  {
    deletionId: varchar('deletion_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    scope: deletionScopeEnum('scope').notNull(),
    targetEvidenceId: varchar('target_evidence_id', { length: 64 }),
    legalHoldActive: boolean('legal_hold_active').notNull().default(false),
    status: varchar('status', { length: 32 }).notNull().default('REQUESTED'),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    executedAt: timestamp('executed_at', { withTimezone: true }),
  },
  (table) => [index('idx_deletion_requests_user_id').on(table.userId)]
);
