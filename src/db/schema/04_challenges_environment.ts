/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 4 — Challenges & Environmental Registry (Tables #23 to #26)
 */

import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './01_identity_rbac_privacy.ts';
import { destinations } from './03_destinations_routes_safety.ts';

/**
 * Table #23: challenges
 */
export const challenges = pgTable('challenges', {
  challengeId: varchar('challenge_id', { length: 64 }).primaryKey(),
  titleEn: varchar('title_en', { length: 200 }).notNull(),
  titleNe: varchar('title_ne', { length: 200 }).notNull(),
  challengeType: varchar('challenge_type', { length: 64 }).notNull(),
  targetMetric: numeric('target_metric', { precision: 10, scale: 2 }).notNull(),
  safetyRulesJson: jsonb('safety_rules_json').notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE'),
});

/**
 * Table #24: challenge_participants
 */
export const challengeParticipants = pgTable(
  'challenge_participants',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    challengeId: varchar('challenge_id', { length: 64 })
      .notNull()
      .references(() => challenges.challengeId, { onDelete: 'restrict' }),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    verifiedProgress: numeric('verified_progress', { precision: 10, scale: 2 })
      .notNull()
      .default('0.00'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_challenge_participants_challenge_user').on(table.challengeId, table.userId),
  ]
);

/**
 * Table #25: environmental_campaigns
 */
export const environmentalCampaigns = pgTable('environmental_campaigns', {
  campaignId: varchar('campaign_id', { length: 64 }).primaryKey(),
  destinationId: varchar('destination_id', { length: 32 })
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'restrict' }),
  organizerOrgId: varchar('organizer_org_id', { length: 64 }),
  title: varchar('title', { length: 200 }).notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
});

/**
 * Table #26: environmental_achievements (System #11 & NF-05 Leave No Trace)
 */
export const environmentalAchievements = pgTable(
  'environmental_achievements',
  {
    envAchievementId: varchar('env_achievement_id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    destinationId: varchar('destination_id', { length: 32 })
      .notNull()
      .references(() => destinations.destinationId, { onDelete: 'restrict' }),
    campaignId: varchar('campaign_id', { length: 64 }).references(
      () => environmentalCampaigns.campaignId,
      { onDelete: 'restrict' }
    ),
    wasteRemovedKg: numeric('waste_removed_kg', { precision: 8, scale: 2 })
      .notNull()
      .default('0.00'),
    stewardshipHours: numeric('stewardship_hours', { precision: 8, scale: 2 })
      .notNull()
      .default('0.00'),
    lntScore: integer('lnt_score').notNull(),
    receiptEvidenceId: varchar('receipt_evidence_id', { length: 64 }).notNull(),
    verifiedByReviewerId: varchar('verified_by_reviewer_id', { length: 64 }).references(
      () => users.id,
      { onDelete: 'restrict' }
    ),
    status: varchar('status', { length: 32 }).notNull().default('PENDING'),
  },
  (table) => [
    check('chk_environmental_achievements_lnt_range', sql`${table.lntScore} >= 0 AND ${table.lntScore} <= 100`),
  ]
);
