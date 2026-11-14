/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 3 — Global Destinations, Routes & Safety Intelligence (Tables #15 to #22)
 */

import { sql } from 'drizzle-orm';
import {
  AnyPgColumn,
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
  authoritativeSourceTypeEnum,
  dataConfidenceLevelEnum,
  destinationCatalogStatusEnum,
  destinationEntityTypeEnum,
  geopoliticalSensitivityFlagEnum,
  riskLevelEnum,
  trailConditionStatusEnum,
} from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { adventureCategories } from './02_taxonomy_standards.ts';

/**
 * Table #15: geographical_regions (Self-referential parentRegionId)
 */
export const geographicalRegions = pgTable('geographical_regions', {
  regionId: varchar('region_id', { length: 64 }).primaryKey(),
  continent: varchar('continent', { length: 64 }).notNull(),
  nameEn: varchar('name_en', { length: 160 }).notNull(),
  nameNe: varchar('name_ne', { length: 160 }).notNull(),
  parentRegionId: varchar('parent_region_id', { length: 64 }).references(
    (): AnyPgColumn => geographicalRegions.regionId,
    { onDelete: 'restrict' }
  ),
});

/**
 * Table #16: destinations (100 Featured Destinations — Amendment A6 & CHK-01.14..01.18)
 */
export const destinations = pgTable(
  'destinations',
  {
    destinationId: varchar('destination_id', { length: 32 }).primaryKey(),
    regionId: varchar('region_id', { length: 64 })
      .notNull()
      .references(() => geographicalRegions.regionId, { onDelete: 'restrict' }),
    entityType: destinationEntityTypeEnum('entity_type').notNull(),
    nameEn: varchar('name_en', { length: 200 }).notNull(),
    nameNe: varchar('name_ne', { length: 200 }).notNull(),
    altNamesJson: jsonb('alt_names_json').notNull(),
    countryCodesJson: jsonb('country_codes_json').notNull(),
    latitude: numeric('latitude', { precision: 9, scale: 6 }).notNull(),
    longitude: numeric('longitude', { precision: 9, scale: 6 }).notNull(),
    elevationMeters: numeric('elevation_meters', { precision: 8, scale: 2 }).notNull(),
    primaryCategoryId: varchar('primary_category_id', { length: 16 })
      .notNull()
      .references(() => adventureCategories.categoryId, { onDelete: 'restrict' }),
    difficultySummary: text('difficulty_summary').notNull(),
    permitRequirements: text('permit_requirements').notNull(),
    sourceUrl: text('source_url').notNull(),
    sourceType: authoritativeSourceTypeEnum('source_type').notNull(),
    lastVerifiedDate: varchar('last_verified_date', { length: 10 }).notNull(),
    confidence: dataConfidenceLevelEnum('confidence').notNull(),
    unverifiedFieldsJson: jsonb('unverified_fields_json').notNull(),
    geopoliticalFlag: geopoliticalSensitivityFlagEnum('geopolitical_flag')
      .notNull()
      .default('NONE'),
    emergencySarProtocolJson: jsonb('emergency_sar_protocol_json').notNull(),
    seasonalRiskMatrixJson: jsonb('seasonal_risk_matrix_json').notNull(),
    verificationStatus: destinationCatalogStatusEnum('verification_status')
      .notNull()
      .default('PROPOSED'),
  },
  (table) => [
    index('idx_destinations_region').on(table.regionId),
    index('idx_destinations_category').on(table.primaryCategoryId),
    index('idx_destinations_status').on(table.verificationStatus),
    check(
      'chk_destinations_wgs84_bounds',
      sql`${table.latitude} >= -90 AND ${table.latitude} <= 90 AND ${table.longitude} >= -180 AND ${table.longitude} <= 180`
    ),
  ]
);

/**
 * Table #17: destination_sources
 */
export const destinationSources = pgTable(
  'destination_sources',
  {
    sourceId: varchar('source_id', { length: 64 }).primaryKey(),
    destinationId: varchar('destination_id', { length: 32 })
      .notNull()
      .references(() => destinations.destinationId, { onDelete: 'restrict' }),
    authorityName: varchar('authority_name', { length: 200 }).notNull(),
    documentTitle: text('document_title').notNull(),
    sourceUrl: text('source_url').notNull(),
    sourceType: authoritativeSourceTypeEnum('source_type').notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_destination_sources_dest').on(table.destinationId)]
);

/**
 * Table #18: destination_routes (Strictly separated from destinations per Amendment A7)
 */
export const destinationRoutes = pgTable(
  'destination_routes',
  {
    routeId: varchar('route_id', { length: 64 }).primaryKey(),
    destinationId: varchar('destination_id', { length: 32 })
      .notNull()
      .references(() => destinations.destinationId, { onDelete: 'restrict' }),
    trailCorridorId: varchar('trail_corridor_id', { length: 64 }),
    nameEn: varchar('name_en', { length: 200 }).notNull(),
    nameNe: varchar('name_ne', { length: 200 }).notNull(),
    startPointCoords: jsonb('start_point_coords').notNull(),
    endPointCoords: jsonb('end_point_coords').notNull(),
    gpxReferenceUri: text('gpx_reference_uri'),
    distanceKm: numeric('distance_km', { precision: 8, scale: 2 }).notNull(),
    elevationGainM: integer('elevation_gain_m').notNull(),
    elevationLossM: integer('elevation_loss_m').notNull(),
    technicalGrade: varchar('technical_grade', { length: 120 }).notNull(),
    hazardsJson: jsonb('hazards_json').notNull(),
    acclimatizationProfileJson: jsonb('acclimatization_profile_json').notNull(),
    routeVersion: varchar('route_version', { length: 32 }).notNull().default('v1.0'),
    status: destinationCatalogStatusEnum('status').notNull().default('PROPOSED'),
  },
  (table) => [index('idx_destination_routes_dest').on(table.destinationId)]
);

/**
 * Table #19: destination_updates
 */
export const destinationUpdates = pgTable('destination_updates', {
  updateId: varchar('update_id', { length: 64 }).primaryKey(),
  destinationId: varchar('destination_id', { length: 32 })
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'restrict' }),
  proposedByUserId: varchar('proposed_by_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  approvedByDeptUserId: varchar('approved_by_dept_user_id', { length: 64 }).references(
    () => users.id,
    { onDelete: 'restrict' }
  ),
  diffJson: jsonb('diff_json').notNull(),
  sourceCitation: text('source_citation').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('PENDING_DEPT_08'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #20: destination_quality_audits (System #8)
 */
export const destinationQualityAudits = pgTable('destination_quality_audits', {
  auditId: varchar('audit_id', { length: 64 }).primaryKey(),
  destinationId: varchar('destination_id', { length: 32 })
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'restrict' }),
  completenessScore: integer('completeness_score').notNull(),
  verifiedFieldsCount: integer('verified_fields_count').notNull(),
  unverifiedFieldsCount: integer('unverified_fields_count').notNull(),
  lastAuditedAt: timestamp('last_audited_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Table #21: safety_advisories (System #5)
 */
export const safetyAdvisories = pgTable('safety_advisories', {
  advisoryId: varchar('advisory_id', { length: 64 }).primaryKey(),
  destinationId: varchar('destination_id', { length: 32 })
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'restrict' }),
  routeId: varchar('route_id', { length: 64 }).references(() => destinationRoutes.routeId, {
    onDelete: 'restrict',
  }),
  severity: riskLevelEnum('severity').notNull(),
  hazardType: varchar('hazard_type', { length: 120 }).notNull(),
  titleEn: varchar('title_en', { length: 200 }).notNull(),
  titleNe: varchar('title_ne', { length: 200 }).notNull(),
  guidanceText: text('guidance_text').notNull(),
  officialSourceUrl: text('official_source_url').notNull(),
  validFrom: timestamp('valid_from', { withTimezone: true }).notNull().defaultNow(),
  validUntil: timestamp('valid_until', { withTimezone: true }),
});

/**
 * Table #22: trail_condition_reports (NF-02)
 */
export const trailConditionReports = pgTable('trail_condition_reports', {
  reportId: varchar('report_id', { length: 64 }).primaryKey(),
  routeId: varchar('route_id', { length: 64 })
    .notNull()
    .references(() => destinationRoutes.routeId, { onDelete: 'restrict' }),
  reporterUserId: varchar('reporter_user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  conditionType: varchar('condition_type', { length: 64 }).notNull(),
  notes: text('notes').notNull(),
  corroborationCount: integer('corroboration_count').notNull().default(0),
  verificationStatus: trailConditionStatusEnum('verification_status')
    .notNull()
    .default('UNCONFIRMED_FIELD_REPORT'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
