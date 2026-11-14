/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 8 — Marketplace, Guides & Organizations (Tables #50 to #60)
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
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { guideVerificationStatusEnum, organizationTypeEnum } from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { destinationRoutes, destinations } from './03_destinations_routes_safety.ts';

/**
 * Table #59: organizations (Defined before guide_profiles so companyOrgId FK resolves cleanly)
 */
export const organizations = pgTable(
  'organizations',
  {
    orgId: varchar('org_id', { length: 64 }).primaryKey(),
    orgType: organizationTypeEnum('org_type').notNull(),
    legalName: varchar('legal_name', { length: 200 }).notNull().unique(),
    registrationJurisdiction: varchar('registration_jurisdiction', { length: 64 }).notNull(),
    verificationStatus: varchar('verification_status', { length: 32 })
      .notNull()
      .default('UNVERIFIED'),
    canSelfApproveMemberAchievements: boolean('can_self_approve_member_achievements')
      .notNull()
      .default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_organizations_no_self_approval',
      sql`${table.canSelfApproveMemberAchievements} = FALSE`
    ),
  ]
);

/**
 * Table #60: organization_members
 */
export const organizationMembers = pgTable(
  'organization_members',
  {
    membershipId: varchar('membership_id', { length: 64 }).primaryKey(),
    orgId: varchar('org_id', { length: 64 })
      .notNull()
      .references(() => organizations.orgId, { onDelete: 'restrict' }),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    orgRole: varchar('org_role', { length: 32 }).notNull().default('MEMBER'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_organization_members_org_user').on(table.orgId, table.userId),
  ]
);

/**
 * Table #50: guide_profiles
 */
export const guideProfiles = pgTable('guide_profiles', {
  guideId: varchar('guide_id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'restrict' }),
  companyOrgId: varchar('company_org_id', { length: 64 }).references(() => organizations.orgId, {
    onDelete: 'restrict',
  }),
  licenseNumber: varchar('license_number', { length: 120 }).notNull(),
  licensingBody: varchar('licensing_body', { length: 64 }).notNull(),
  verificationStatus: guideVerificationStatusEnum('verification_status')
    .notNull()
    .default('UNVERIFIED'),
  languagesJson: jsonb('languages_json').notNull(),
  serviceRegionsJson: jsonb('service_regions_json').notNull(),
  lntEndorsed: boolean('lnt_endorsed').notNull().default(false),
});

/**
 * Table #51: guide_qualifications
 */
export const guideQualifications = pgTable('guide_qualifications', {
  qualificationId: varchar('qualification_id', { length: 64 }).primaryKey(),
  guideId: varchar('guide_id', { length: 64 })
    .notNull()
    .references(() => guideProfiles.guideId, { onDelete: 'restrict' }),
  certificateTitle: varchar('certificate_title', { length: 200 }).notNull(),
  issuingAuthority: varchar('issuing_authority', { length: 200 }).notNull(),
  documentVaultUri: text('document_vault_uri').notNull(),
  verifiedByStaffId: varchar('verified_by_staff_id', { length: 64 }).references(() => users.id, {
    onDelete: 'restrict',
  }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

/**
 * Table #52: guide_insurance_records
 */
export const guideInsuranceRecords = pgTable('guide_insurance_records', {
  insuranceId: varchar('insurance_id', { length: 64 }).primaryKey(),
  guideId: varchar('guide_id', { length: 64 })
    .notNull()
    .references(() => guideProfiles.guideId, { onDelete: 'restrict' }),
  providerName: varchar('provider_name', { length: 200 }).notNull(),
  policyNumberHash: varchar('policy_number_hash', { length: 64 }).notNull(),
  coverageMaxAltitudeM: integer('coverage_max_altitude_m').notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
  verifiedStatus: varchar('verified_status', { length: 32 }).notNull().default('UNVERIFIED'),
});

/**
 * Table #53: marketplace_listings
 */
export const marketplaceListings = pgTable('marketplace_listings', {
  listingId: varchar('listing_id', { length: 64 }).primaryKey(),
  guideOrOrgId: varchar('guide_or_org_id', { length: 64 }).notNull(),
  destinationId: varchar('destination_id', { length: 32 })
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'restrict' }),
  routeId: varchar('route_id', { length: 64 })
    .notNull()
    .references(() => destinationRoutes.routeId, { onDelete: 'restrict' }),
  title: varchar('title', { length: 200 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  priceDisplayUsd: numeric('price_display_usd', { precision: 10, scale: 2 }).notNull(),
  maxClientRatio: varchar('max_client_ratio', { length: 32 }).notNull(),
  cancellationPolicy: text('cancellation_policy').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE_INQUIRY_ONLY'),
});

/**
 * Table #54: booking_requests (Constitutional Lock: INQUIRY_ONLY_PAYMENTS_LOCKED)
 */
export const bookingRequests = pgTable('booking_requests', {
  bookingRequestId: varchar('booking_request_id', { length: 64 }).primaryKey(),
  listingId: varchar('listing_id', { length: 64 })
    .notNull()
    .references(() => marketplaceListings.listingId, { onDelete: 'restrict' }),
  adventurerUserId: varchar('adventurer_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  guideUserId: varchar('guide_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  requestedDates: varchar('requested_dates', { length: 120 }).notNull(),
  status: varchar('status', { length: 48 })
    .notNull()
    .default('INQUIRY_ONLY_PAYMENTS_LOCKED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #55: bookings (Constitutional Lock: paymentExecutionLocked = TRUE)
 */
export const bookings = pgTable(
  'bookings',
  {
    bookingId: varchar('booking_id', { length: 64 }).primaryKey(),
    bookingRequestId: varchar('booking_request_id', { length: 64 })
      .notNull()
      .references(() => bookingRequests.bookingRequestId, { onDelete: 'restrict' }),
    commissionRateDisclosed: numeric('commission_rate_disclosed', {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    paymentExecutionLocked: boolean('payment_execution_locked').notNull().default(true),
    status: varchar('status', { length: 32 }).notNull().default('INQUIRY_RECORDED'),
  },
  (table) => [
    check('chk_bookings_payment_locked', sql`${table.paymentExecutionLocked} = TRUE`),
  ]
);

/**
 * Table #56: reviews
 */
export const reviews = pgTable(
  'reviews',
  {
    reviewId: varchar('review_id', { length: 64 }).primaryKey(),
    bookingId: varchar('booking_id', { length: 64 })
      .notNull()
      .references(() => bookings.bookingId, { onDelete: 'restrict' }),
    authorUserId: varchar('author_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    safetyRating: integer('safety_rating').notNull(),
    ethicsLntRating: integer('ethics_lnt_rating').notNull(),
    comment: text('comment').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_reviews_ratings_1_to_5',
      sql`${table.safetyRating} BETWEEN 1 AND 5 AND ${table.ethicsLntRating} BETWEEN 1 AND 5`
    ),
  ]
);

/**
 * Table #57: complaints
 */
export const complaints = pgTable('complaints', {
  complaintId: varchar('complaint_id', { length: 64 }).primaryKey(),
  targetEntityType: varchar('target_entity_type', { length: 64 }).notNull(),
  targetEntityId: varchar('target_entity_id', { length: 64 }).notNull(),
  reporterUserId: varchar('reporter_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  severity: varchar('severity', { length: 32 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('OPEN'),
});

/**
 * Table #58: disputes
 */
export const disputes = pgTable('disputes', {
  disputeId: varchar('dispute_id', { length: 64 }).primaryKey(),
  bookingId: varchar('booking_id', { length: 64 })
    .notNull()
    .references(() => bookings.bookingId, { onDelete: 'restrict' }),
  reason: text('reason').notNull(),
  resolutionNotes: text('resolution_notes'),
  resolvedByStaffId: varchar('resolved_by_staff_id', { length: 64 }).references(() => users.id, {
    onDelete: 'restrict',
  }),
  status: varchar('status', { length: 32 }).notNull().default('OPEN'),
});
