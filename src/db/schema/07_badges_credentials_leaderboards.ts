/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 7 — Badges, Certificates, Integrity Registry & Leaderboards (Tables #43 to #49)
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
  varchar,
} from 'drizzle-orm/pg-core';
import {
  credentialLifecycleEventTypeEnum,
  credentialValidityStatusEnum,
  leaderboardScopeEnum,
  portableExportFormatEnum,
} from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { achievements } from './02_taxonomy_standards.ts';
import { destinationRoutes, destinations } from './03_destinations_routes_safety.ts';
import { achievementApplications } from './05_applications_evidence_witness.ts';
import { verificationCases } from './06_verification_antifraud_appeals.ts';

/**
 * Table #43: badges
 */
export const badges = pgTable(
  'badges',
  {
    badgeId: varchar('badge_id', { length: 64 }).primaryKey(),
    destinationId: varchar('destination_id', { length: 32 }).references(
      () => destinations.destinationId,
      { onDelete: 'restrict' }
    ),
    achievementId: varchar('achievement_id', { length: 64 })
      .notNull()
      .references(() => achievements.achievementId, { onDelete: 'restrict' }),
    nameEn: varchar('name_en', { length: 200 }).notNull(),
    nameNe: varchar('name_ne', { length: 200 }).notNull(),
    shieldDesignSpecJson: jsonb('shield_design_spec_json').notNull(),
    isFreeStandard: boolean('is_free_standard').notNull().default(true),
  },
  (table) => [
    check('chk_badges_free_standard_forever', sql`${table.isFreeStandard} = TRUE`),
  ]
);

/**
 * Table #44: credential_registry (Hash-Chained Authoritative Ledger — System #3)
 */
export const credentialRegistry = pgTable(
  'credential_registry',
  {
    credentialId: varchar('credential_id', { length: 64 }).primaryKey(),
    subjectUserId: varchar('subject_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }), // Non-transferable owner
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    verificationCaseId: varchar('verification_case_id', { length: 64 })
      .notNull()
      .references(() => verificationCases.caseId, { onDelete: 'restrict' }),
    achievementId: varchar('achievement_id', { length: 64 })
      .notNull()
      .references(() => achievements.achievementId, { onDelete: 'restrict' }),
    destinationId: varchar('destination_id', { length: 32 })
      .notNull()
      .references(() => destinations.destinationId, { onDelete: 'restrict' }),
    routeId: varchar('route_id', { length: 64 })
      .notNull()
      .references(() => destinationRoutes.routeId, { onDelete: 'restrict' }),
    badgeId: varchar('badge_id', { length: 64 })
      .notNull()
      .references(() => badges.badgeId, { onDelete: 'restrict' }),
    certificateId: varchar('certificate_id', { length: 64 }).notNull().unique(),
    completionDate: varchar('completion_date', { length: 10 }).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
    issuingAuthority: varchar('issuing_authority', { length: 160 })
      .notNull()
      .default('0 TO 8848 Independent Verification Department'),
    status: credentialValidityStatusEnum('status').notNull().default('VALID'),
    previousEventHash: char('previous_event_hash', { length: 64 }).notNull(),
    currentCredentialHash: char('current_credential_hash', { length: 64 }).notNull().unique(),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
  },
  (table) => [
    index('idx_credential_registry_subject').on(table.subjectUserId),
    index('idx_credential_registry_destination').on(table.destinationId),
  ]
);

/**
 * Table #45: credential_lifecycle_events (IMMUTABLE APPEND-ONLY LEDGER)
 */
export const credentialLifecycleEvents = pgTable(
  'credential_lifecycle_events',
  {
    eventId: varchar('event_id', { length: 64 }).primaryKey(),
    credentialId: varchar('credential_id', { length: 64 })
      .notNull()
      .references(() => credentialRegistry.credentialId, { onDelete: 'restrict' }),
    eventType: credentialLifecycleEventTypeEnum('event_type').notNull(),
    reason: text('reason').notNull(),
    authorizedByQuorumOrCaseId: varchar('authorized_by_quorum_or_case_id', {
      length: 64,
    }).notNull(),
    prevHash: char('prev_hash', { length: 64 }).notNull(),
    eventHash: char('event_hash', { length: 64 }).notNull().unique(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_credential_lifecycle_credential').on(table.credentialId)]
);

/**
 * Table #46: certificates
 */
export const certificates = pgTable('certificates', {
  certificateId: varchar('certificate_id', { length: 64 }).primaryKey(),
  credentialId: varchar('credential_id', { length: 64 })
    .notNull()
    .unique()
    .references(() => credentialRegistry.credentialId, { onDelete: 'restrict' }),
  qrVerificationUrl: text('qr_verification_url').notNull(),
  ed25519Signature: text('ed25519_signature').notNull(),
  pdfTemplateVersion: varchar('pdf_template_version', { length: 32 }).notNull().default('v1.1'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #47: public_credentials (Zero-PII Sanitized Projection Table)
 */
export const publicCredentials = pgTable('public_credentials', {
  credentialId: varchar('credential_id', { length: 64 })
    .primaryKey()
    .references(() => credentialRegistry.credentialId, { onDelete: 'restrict' }),
  publicDisplayName: varchar('public_display_name', { length: 160 }).notNull(),
  achievementTitleEn: varchar('achievement_title_en', { length: 200 }).notNull(),
  achievementTitleNe: varchar('achievement_title_ne', { length: 200 }).notNull(),
  destinationNameEn: varchar('destination_name_en', { length: 200 }).notNull(),
  destinationNameNe: varchar('destination_name_ne', { length: 200 }).notNull(),
  routeNameEn: varchar('route_name_en', { length: 200 }).notNull(),
  elevationMeters: numeric('elevation_meters', { precision: 8, scale: 2 }).notNull(),
  completionDate: varchar('completion_date', { length: 10 }).notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
  status: credentialValidityStatusEnum('status').notNull().default('VALID'),
  revocationNotice: text('revocation_notice'),
  currentCredentialHash: char('current_credential_hash', { length: 64 }).notNull(),
  replay3dOptIn: boolean('replay_3d_opt_in').notNull().default(false),
});

/**
 * Table #48: portable_credential_exports (System #10 W3C VC & OpenBadges 3.0)
 */
export const portableCredentialExports = pgTable('portable_credential_exports', {
  exportId: varchar('export_id', { length: 64 }).primaryKey(),
  credentialId: varchar('credential_id', { length: 64 })
    .notNull()
    .references(() => credentialRegistry.credentialId, { onDelete: 'restrict' }),
  format: portableExportFormatEnum('format').notNull(),
  detachedSignature: text('detached_signature').notNull(),
  exportedAt: timestamp('exported_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #49: leaderboard_snapshots
 */
export const leaderboardSnapshots = pgTable(
  'leaderboard_snapshots',
  {
    snapshotId: varchar('snapshot_id', { length: 64 }).primaryKey(),
    boardScope: leaderboardScopeEnum('board_scope').notNull(),
    scopeKey: varchar('scope_key', { length: 64 }).notNull(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    verifiedCredentialsCount: integer('verified_credentials_count').notNull().default(0),
    totalScore: numeric('total_score', { precision: 12, scale: 2 }).notNull().default('0.00'),
    algorithmVersion: varchar('algorithm_version', { length: 32 }).notNull().default('v1.1'),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_leaderboard_snapshots_scope').on(table.boardScope, table.scopeKey),
  ]
);
