/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Canonical PostgreSQL Enum Definitions (Reconciled with /src/types/*.ts)
 */

import { pgEnum } from 'drizzle-orm/pg-core';

export const accountStatusEnum = pgEnum('account_status_enum', [
  'ACTIVE',
  'SUSPENDED',
  'DELETED',
]);

export const ageBracketEnum = pgEnum('age_bracket_enum', [
  'ADULT_18_PLUS',
  'MINOR_13_17',
]);

export const dataResidencyRegionEnum = pgEnum('data_residency_region_enum', [
  'NP',
  'EU',
  'UAE',
  'GLOBAL',
]);

export const dataPrivacyTierEnum = pgEnum('data_privacy_tier_enum', [
  'TIER_1_PUBLIC',
  'TIER_2_INTERNAL',
  'TIER_3_RESTRICTED_EVIDENCE',
  'TIER_4_REGULATED_PII',
]);

export const supportedLocaleEnum = pgEnum('supported_locale_enum', [
  'en',
  'ne',
  'hi',
  'ar',
  'es',
  'fr',
  'de',
  'zh',
  'ja',
]);

export const platformRoleEnum = pgEnum('platform_role_enum', [
  'public_visitor',
  'registered_adventurer',
  'verified_adventurer',
  'professional_guide',
  'guide_company',
  'tour_operator',
  'organization_member',
  'organization_admin',
  'destination_partner',
  'sponsor',
  'reviewer',
  'senior_reviewer',
  'heritage_guardian',
  'appeal_reviewer',
  'moderator',
  'customer_support',
  'finance_operator',
  'security_auditor',
  'system_admin',
  'governance_member',
  'founder',
]);

export const governanceDepartmentEnum = pgEnum('governance_department_enum', [
  'DEPT-01',
  'DEPT-02',
  'DEPT-03',
  'DEPT-04',
  'DEPT-05',
  'DEPT-06',
  'DEPT-07',
  'DEPT-08',
  'DEPT-09',
  'DEPT-10',
  'DEPT-11',
]);

export const permissionActionEnum = pgEnum('permission_action_enum', [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'AUDIT',
]);

export const privacyRequestTypeEnum = pgEnum('privacy_request_type_enum', [
  'DATA_EXPORT',
  'CORRECTION',
  'RESTRICT_PROCESSING',
]);

export const deletionScopeEnum = pgEnum('deletion_scope_enum', [
  'RAW_EVIDENCE_ONLY',
  'FULL_ACCOUNT_ANONYMIZATION',
]);

export const riskLevelEnum = pgEnum('risk_level_enum', [
  'LOW',
  'MODERATE',
  'HIGH',
  'EXTREME',
]);

export const reviewerQualificationTierEnum = pgEnum('reviewer_qualification_tier_enum', [
  'L1',
  'L2',
  'L3',
  'DUAL_L3',
  'DUAL_L4',
  'HERITAGE_GUARDIAN',
]);

export const achievementArchetypeEnum = pgEnum('achievement_archetype_enum', [
  'TYPE_A',
  'TYPE_B',
  'TYPE_C',
  'TYPE_D',
  'TYPE_E',
  'TYPE_F',
]);

export const destinationEntityTypeEnum = pgEnum('destination_entity_type_enum', [
  'MOUNTAIN_MASSIF',
  'ALPINE_PEAK',
  'TREKKING_PEAK',
  'VOLCANO',
  'CORRIDOR_TRAIL',
  'CANYON_SYSTEM',
  'POLAR_PLATEAU',
]);

export const authoritativeSourceTypeEnum = pgEnum('authoritative_source_type_enum', [
  'GOVT_SURVEY_MINISTRY',
  'NATIONAL_PARK_AUTHORITY',
  'OFFICIAL_ALPINE_FEDERATION',
  'ARCHIVAL_DATABASE',
]);

export const dataConfidenceLevelEnum = pgEnum('data_confidence_level_enum', [
  'HIGH_AUTHORITATIVE',
  'MEDIUM_SECONDARY',
  'LOW_PENDING_FIELD_CHECK',
]);

export const geopoliticalSensitivityFlagEnum = pgEnum('geopolitical_sensitivity_flag_enum', [
  'NONE',
  'TRANSBOUNDARY_DUAL_JURISDICTION',
  'RESTRICTED_BORDER_PERMIT',
  'DISPUTED_OR_MILITARY_NOC_ZONE',
]);

export const destinationCatalogStatusEnum = pgEnum('destination_catalog_status_enum', [
  'PROPOSED',
  'VERIFIED',
  'UNDER_REVIEW',
  'CLOSED',
]);

export const trailConditionStatusEnum = pgEnum('trail_condition_status_enum', [
  'UNCONFIRMED_FIELD_REPORT',
  'CORROBORATED',
  'EXPIRED',
]);

export const calendarSystemEnum = pgEnum('calendar_system_enum', [
  'GREGORIAN_AD',
  'BIKRAM_SAMBAT_BS',
]);

export const applicationStatusEnum = pgEnum('application_status_enum', [
  'DRAFT',
  'SUBMITTED',
  'MORE_EVIDENCE_REQUIRED',
  'IN_REVIEW',
  'ESCALATED_DUAL_SENIOR',
  'UNDER_INVESTIGATION',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
]);

export const evidencePillarEnum = pgEnum('evidence_pillar_enum', [
  'PIL-01',
  'PIL-02',
  'PIL-03',
  'PIL-04',
  'PIL-05',
]);

export const evidenceFileTypeEnum = pgEnum('evidence_file_type_enum', [
  'PHOTO',
  'VIDEO',
  'GPX',
  'PERMIT_DOCUMENT',
  'HUT_LOGBOOK',
]);

export const evidenceAccessActionEnum = pgEnum('evidence_access_action_enum', [
  'UPLOAD',
  'HASH_VERIFY',
  'REVIEWER_VIEW',
  'APPEAL_VIEW',
  'POST_APPROVAL_RAW_PURGE',
]);

export const ecfPathwayClassificationEnum = pgEnum('ecf_pathway_classification_enum', [
  'STANDARD_MULTIMODAL',
  'ALT_NO_GPS_DOCUMENTARY_WITNESS',
  'BLOCKED_GPS_ONLY_INSUFFICIENT',
  'BLOCKED_BELOW_THRESHOLD',
  'DUAL_SENIOR_OVERRIDDEN',
]);

export const witnessRelationshipEnum = pgEnum('witness_relationship_enum', [
  'LICENSED_GUIDE',
  'ROPE_PARTNER',
  'INDEPENDENT_BYSTANDER',
  'HERITAGE_GUARDIAN',
]);

export const witnessAttestationStatusEnum = pgEnum('witness_attestation_status_enum', [
  'INVITED',
  'CONFIRMED',
  'FLAGGED_RING',
  'REJECTED',
]);

export const reviewerAccreditationStatusEnum = pgEnum('reviewer_accreditation_status_enum', [
  'ACTIVE',
  'SUSPENDED_RECALIBRATION_REQUIRED',
  'SUSPENDED',
  'REVOKED',
  'EXPIRED',
]);

export const verificationCaseStatusEnum = pgEnum('verification_case_status_enum', [
  'SUBMITTED',
  'MORE_EVIDENCE_REQUIRED',
  'IN_REVIEW',
  'AWAITING_SECOND_SENIOR_REVIEWER',
  'AWAITING_HERITAGE_GUARDIAN',
  'ESCALATED_SPLIT_DECISION',
  'UNDER_INVESTIGATION',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
  'SUSPENDED_PENDING_REVIEW',
]);

export const reviewerSlotEnum = pgEnum('reviewer_slot_enum', [
  'PRIMARY',
  'SECOND_SENIOR',
  'HERITAGE_GUARDIAN',
  'LEAD_ESCALATION',
]);

export const reviewerDecisionTypeEnum = pgEnum('reviewer_decision_type_enum', [
  'APPROVE',
  'REJECT',
  'REQUEST_MORE_EVIDENCE',
  'ESCALATE_FRAUD',
]);

export const appealCaseStatusEnum = pgEnum('appeal_case_status_enum', [
  'OPEN',
  'IN_APPEAL_REVIEW',
  'UPHELD_APPROVED',
  'DISMISSED_REJECTED',
]);

export const credentialValidityStatusEnum = pgEnum('credential_validity_status_enum', [
  'VALID',
  'REVOKED',
  'SUSPENDED_INVESTIGATION',
  'CORRECTED',
]);

export const credentialLifecycleEventTypeEnum = pgEnum('credential_lifecycle_event_type_enum', [
  'ISSUED',
  'CORRECTED',
  'SUSPENDED',
  'REINSTATED',
  'REVOKED',
]);

export const portableExportFormatEnum = pgEnum('portable_export_format_enum', [
  'W3C_VC_JSONLD',
  'OPENBADGES_V3',
]);

export const leaderboardScopeEnum = pgEnum('leaderboard_scope_enum', [
  'GLOBAL',
  'COUNTRY',
  'REGION',
  'DESTINATION',
  'CATEGORY',
  'ANNUAL',
]);

export const guideVerificationStatusEnum = pgEnum('guide_verification_status_enum', [
  'UNVERIFIED',
  'VERIFIED_LICENSED',
  'SUSPENDED_SAFETY_HOLD',
]);

export const organizationTypeEnum = pgEnum('organization_type_enum', [
  'GUIDE_COMPANY',
  'TOUR_OPERATOR',
  'ALPINE_CLUB',
  'MOUNTAINEERING_FEDERATION',
  'DESTINATION_PARTNER',
  'NON_PROFIT',
]);

export const adPlacementZoneEnum = pgEnum('ad_placement_zone_enum', [
  'PUBLIC_DESTINATION_SIDEBAR',
  'COMMUNITY_FEED',
  'COMMUNITY_CHALLENGE_BANNER',
]);

export const subscriptionPlanTierEnum = pgEnum('subscription_plan_tier_enum', [
  'FREE_STANDARD',
  'PRO_CONVENIENCE_LOCKED',
  'ORG_SAAS_LOCKED',
]);

export const securitySeverityEnum = pgEnum('security_severity_enum', [
  'SEV_1',
  'SEV_2',
  'SEV_3',
  'SEV_4',
]);
