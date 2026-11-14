/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 2 — Adventure Taxonomy & Verification Standards (Tables #10 to #14)
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  achievementArchetypeEnum,
  reviewerQualificationTierEnum,
  riskLevelEnum,
} from './00_enums.ts';

/**
 * Table #10: macro_domains (Amendment A2: MD-01 to MD-06)
 */
export const macroDomains = pgTable('macro_domains', {
  domainId: varchar('domain_id', { length: 16 }).primaryKey(),
  nameEn: varchar('name_en', { length: 160 }).notNull().unique(),
  nameNe: varchar('name_ne', { length: 160 }).notNull(),
  description: text('description').notNull(),
});

/**
 * Table #11: adventure_categories (CAT-01 to CAT-24 — Bijective 1:N mapping to macro_domains)
 */
export const adventureCategories = pgTable(
  'adventure_categories',
  {
    categoryId: varchar('category_id', { length: 16 }).primaryKey(),
    macroDomainId: varchar('macro_domain_id', { length: 16 })
      .notNull()
      .references(() => macroDomains.domainId, { onDelete: 'restrict' }),
    nameEn: varchar('name_en', { length: 160 }).notNull().unique(),
    nameNe: varchar('name_ne', { length: 160 }).notNull(),
    difficultySystem: varchar('difficulty_system', { length: 120 }).notNull(),
    riskLevel: riskLevelEnum('risk_level').notNull(),
    requiredSkillsJson: jsonb('required_skills_json').notNull(),
    safetyRequirementsJson: jsonb('safety_requirements_json').notNull(),
    minReviewerTier: reviewerQualificationTierEnum('min_reviewer_tier').notNull(),
    minEcfThreshold: integer('min_ecf_threshold').notNull().default(75),
    badgeEligible: boolean('badge_eligible').notNull().default(true),
    competitiveRankEligible: boolean('competitive_rank_eligible').notNull().default(true),
  },
  (table) => [
    check('chk_adventure_categories_min_ecf_threshold', sql`${table.minEcfThreshold} >= 75`),
  ]
);

/**
 * Table #12: achievements
 */
export const achievements = pgTable(
  'achievements',
  {
    achievementId: varchar('achievement_id', { length: 64 }).primaryKey(),
    categoryId: varchar('category_id', { length: 16 })
      .notNull()
      .references(() => adventureCategories.categoryId, { onDelete: 'restrict' }),
    destinationId: varchar('destination_id', { length: 32 }),
    archetype: achievementArchetypeEnum('archetype').notNull(),
    titleEn: varchar('title_en', { length: 200 }).notNull(),
    titleNe: varchar('title_ne', { length: 200 }).notNull(),
    completionCriteriaJson: jsonb('completion_criteria_json').notNull(),
    basePoints: integer('base_points').notNull().default(0),
    difficultyMultiplier: numeric('difficulty_multiplier', { precision: 6, scale: 2 })
      .notNull()
      .default('1.00'),
    altitudeRemotenessFactor: numeric('altitude_remoteness_factor', { precision: 6, scale: 2 })
      .notNull()
      .default('1.00'),
    requiresHeritageGuardian: boolean('requires_heritage_guardian').notNull().default(false),
    effectivePolicyVersion: varchar('effective_policy_version', { length: 32 }).notNull(),
  },
  (table) => [
    check('chk_achievements_base_points_non_negative', sql`${table.basePoints} >= 0`),
  ]
);

/**
 * Table #13: achievement_eligible_routes
 */
export const achievementEligibleRoutes = pgTable(
  'achievement_eligible_routes',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    achievementId: varchar('achievement_id', { length: 64 })
      .notNull()
      .references(() => achievements.achievementId, { onDelete: 'restrict' }),
    routeId: varchar('route_id', { length: 64 }).notNull(),
  },
  (table) => [
    uniqueIndex('uq_achievement_eligible_routes').on(table.achievementId, table.routeId),
  ]
);

/**
 * Table #14: verification_standards
 */
export const verificationStandards = pgTable(
  'verification_standards',
  {
    standardId: varchar('standard_id', { length: 64 }).primaryKey(),
    categoryId: varchar('category_id', { length: 16 })
      .notNull()
      .references(() => adventureCategories.categoryId, { onDelete: 'restrict' }),
    pillarWeightsJson: jsonb('pillar_weights_json').notNull(),
    minTotalConfidence: integer('min_total_confidence').notNull().default(75),
    allowGpsFreePathway: boolean('allow_gps_free_pathway').notNull().default(true),
    allowStrippedExif: boolean('allow_stripped_exif').notNull().default(true),
    requiresDualSenior: boolean('requires_dual_senior').notNull().default(false),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
  },
  (table) => [
    check('chk_verification_standards_min_confidence', sql`${table.minTotalConfidence} >= 75`),
    check('chk_verification_standards_gps_free_allowed', sql`${table.allowGpsFreePathway} = TRUE`),
    check('chk_verification_standards_stripped_exif_allowed', sql`${table.allowStrippedExif} = TRUE`),
  ]
);
