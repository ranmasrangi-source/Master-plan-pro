/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 6 — Human Verification, Anti-Fraud & Independent Appeals (Tables #35 to #42)
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
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
  appealCaseStatusEnum,
  reviewerAccreditationStatusEnum,
  reviewerDecisionTypeEnum,
  reviewerQualificationTierEnum,
  reviewerSlotEnum,
  verificationCaseStatusEnum,
} from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { achievementApplications, evidenceFiles } from './05_applications_evidence_witness.ts';

/**
 * Table #35: reviewer_accreditations (System #7 & NF-01)
 */
export const reviewerAccreditations = pgTable(
  'reviewer_accreditations',
  {
    accreditationId: varchar('accreditation_id', { length: 64 }).primaryKey(),
    reviewerUserId: varchar('reviewer_user_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'restrict' }),
    reviewerTier: reviewerQualificationTierEnum('reviewer_tier').notNull(),
    qualifiedCategoryIdsJson: jsonb('qualified_category_ids_json').notNull(),
    qualifiedSacredDestinationIdsJson: jsonb('qualified_sacred_destination_ids_json').notNull(),
    calibrationAccuracyScore: integer('calibration_accuracy_score').notNull(),
    lastAssessedAt: timestamp('last_assessed_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    status: reviewerAccreditationStatusEnum('status').notNull().default('ACTIVE'),
  },
  (table) => [
    check(
      'chk_reviewer_calibration_score',
      sql`${table.calibrationAccuracyScore} >= 0 AND ${table.calibrationAccuracyScore} <= 100`
    ),
  ]
);

/**
 * Table #36: calibration_tests
 */
export const calibrationTests = pgTable('calibration_tests', {
  testId: varchar('test_id', { length: 64 }).primaryKey(),
  reviewerUserId: varchar('reviewer_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  seedCaseId: varchar('seed_case_id', { length: 64 }).notNull(),
  expectedOutcome: varchar('expected_outcome', { length: 32 }).notNull(),
  reviewerSubmittedOutcome: varchar('reviewer_submitted_outcome', { length: 32 }).notNull(),
  passed: boolean('passed').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #37: verification_cases
 */
export const verificationCases = pgTable(
  'verification_cases',
  {
    caseId: varchar('case_id', { length: 64 }).primaryKey(),
    applicationId: varchar('application_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
    requiredReviewerTier: reviewerQualificationTierEnum('required_reviewer_tier').notNull(),
    requiresDualSenior: boolean('requires_dual_senior').notNull().default(false),
    requiresHeritageGuardian: boolean('requires_heritage_guardian').notNull().default(false),
    assignedReviewerIdsJson: jsonb('assigned_reviewer_ids_json').notNull(),
    approvedSeniorCount: integer('approved_senior_count').notNull().default(0),
    heritageGuardianApproved: boolean('heritage_guardian_approved'),
    fraudInvestigationPriorityScore: integer('fraud_investigation_priority_score')
      .notNull()
      .default(0),
    status: verificationCaseStatusEnum('status').notNull().default('SUBMITTED'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => [index('idx_verification_cases_status').on(table.status)]
);

/**
 * Table #38: verification_assignments
 */
export const verificationAssignments = pgTable(
  'verification_assignments',
  {
    assignmentId: varchar('assignment_id', { length: 64 }).primaryKey(),
    caseId: varchar('case_id', { length: 64 })
      .notNull()
      .references(() => verificationCases.caseId, { onDelete: 'restrict' }),
    reviewerUserId: varchar('reviewer_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    reviewerSlot: reviewerSlotEnum('reviewer_slot').notNull(),
    coiCheckPassed: boolean('coi_check_passed').notNull(),
    coiDeclarationSignedAt: timestamp('coi_declaration_signed_at', {
      withTimezone: true,
    }).notNull(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_verification_assignments_case_reviewer').on(table.caseId, table.reviewerUserId),
    uniqueIndex('uq_verification_assignments_case_slot').on(table.caseId, table.reviewerSlot),
    check('chk_verification_assignments_coi_passed', sql`${table.coiCheckPassed} = TRUE`),
  ]
);

/**
 * Table #39: reviewer_decisions
 */
export const reviewerDecisions = pgTable(
  'reviewer_decisions',
  {
    decisionId: varchar('decision_id', { length: 64 }).primaryKey(),
    caseId: varchar('case_id', { length: 64 })
      .notNull()
      .references(() => verificationCases.caseId, { onDelete: 'restrict' }),
    reviewerUserId: varchar('reviewer_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    decision: reviewerDecisionTypeEnum('decision').notNull(),
    documentedReasons: text('documented_reasons').notNull(),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
    decidedAt: timestamp('decided_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_reviewer_decisions_case_reviewer').on(table.caseId, table.reviewerUserId),
  ]
);

/**
 * Table #40: fraud_investigations (Amendment A4)
 */
export const fraudInvestigations = pgTable('fraud_investigations', {
  investigationId: varchar('investigation_id', { length: 64 }).primaryKey(),
  applicationId: varchar('application_id', { length: 64 })
    .notNull()
    .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
  demRmseValue: numeric('dem_rmse_value', { precision: 8, scale: 3 }),
  maxAscentRateObserved: numeric('max_ascent_rate_observed', { precision: 8, scale: 2 }),
  westPhysiologicalLimit: numeric('west_physiological_limit', { precision: 8, scale: 2 }),
  minPHashHammingDistance: integer('min_p_hash_hamming_distance'),
  matchedEvidenceId: varchar('matched_evidence_id', { length: 64 }).references(
    () => evidenceFiles.evidenceId,
    { onDelete: 'restrict' }
  ),
  forensicFlagsJson: jsonb('forensic_flags_json').notNull(),
  priorityScore: integer('priority_score').notNull().default(0),
  investigatorReviewerId: varchar('investigator_reviewer_id', { length: 64 }).references(
    () => users.id,
    { onDelete: 'restrict' }
  ),
  resolutionOutcome: text('resolution_outcome'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #41: appeal_cases (DEPT-04 Independent Appeals)
 */
export const appealCases = pgTable('appeal_cases', {
  appealId: varchar('appeal_id', { length: 64 }).primaryKey(),
  applicationId: varchar('application_id', { length: 64 })
    .notNull()
    .references(() => achievementApplications.applicationId, { onDelete: 'restrict' }),
  originalCaseId: varchar('original_case_id', { length: 64 })
    .notNull()
    .references(() => verificationCases.caseId, { onDelete: 'restrict' }),
  appellantUserId: varchar('appellant_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  excludedReviewerIdsJson: jsonb('excluded_reviewer_ids_json').notNull(),
  appealGrounds: text('appeal_grounds').notNull(),
  newEvidenceIdsJson: jsonb('new_evidence_ids_json').notNull(),
  assignedAppealReviewerId: varchar('assigned_appeal_reviewer_id', { length: 64 }).references(
    () => users.id,
    { onDelete: 'restrict' }
  ),
  status: appealCaseStatusEnum('status').notNull().default('OPEN'),
  filedAt: timestamp('filed_at', { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
});

/**
 * Table #42: appeal_assignments
 */
export const appealAssignments = pgTable(
  'appeal_assignments',
  {
    appealAssignmentId: varchar('appeal_assignment_id', { length: 64 }).primaryKey(),
    appealId: varchar('appeal_id', { length: 64 })
      .notNull()
      .references(() => appealCases.appealId, { onDelete: 'restrict' }),
    appealReviewerUserId: varchar('appeal_reviewer_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    verifiedNotInExcludedList: boolean('verified_not_in_excluded_list').notNull(),
    coiCheckPassed: boolean('coi_check_passed').notNull(),
    decision: varchar('decision', { length: 32 }),
    reasonedOutcome: text('reasoned_outcome'),
    policyVersion: varchar('policy_version', { length: 32 }).notNull(),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_appeal_assignments_appeal_reviewer').on(
      table.appealId,
      table.appealReviewerUserId
    ),
    check(
      'chk_appeal_assignments_independence',
      sql`${table.verifiedNotInExcludedList} = TRUE AND ${table.coiCheckPassed} = TRUE`
    ),
  ]
);
