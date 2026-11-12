/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Constitutional Types, Roles, Governance Departments & Hard Launch Locks
 */

/**
 * Hard-locked constitutional invariants (Sections 6, 7, 51, 52, 58).
 * These literal types enforce at compile-time that commercial payments,
 * blockchain minting, and AI-only final approvals are disabled.
 */
export interface ConstitutionalSystemLocks {
  readonly PAYMENTS_ENABLED: false;
  readonly BLOCKCHAIN_ENABLED: false;
  readonly AI_FINAL_DECISION_ALLOWED: false;
  readonly STANDARD_BADGE_PRICE_USD: 0;
  readonly STANDARD_CERTIFICATE_PRICE_USD: 0;
  readonly PUBLIC_VERIFICATION_PRICE_USD: 0;
  readonly SPONSOR_VERIFICATION_INFLUENCE_MULTIPLIER: 0;
}

export const CONSTITUTIONAL_LOCKS: ConstitutionalSystemLocks = {
  PAYMENTS_ENABLED: false,
  BLOCKCHAIN_ENABLED: false,
  AI_FINAL_DECISION_ALLOWED: false,
  STANDARD_BADGE_PRICE_USD: 0,
  STANDARD_CERTIFICATE_PRICE_USD: 0,
  PUBLIC_VERIFICATION_PRICE_USD: 0,
  SPONSOR_VERIFICATION_INFLUENCE_MULTIPLIER: 0,
} as const;

/**
 * All 21 Platform Roles:
 * - Roles 1..20 from Master Plan Section 11
 * - Role 21: 'heritage_guardian' added per Founder Directive NF-01 & FQ-09
 */
export enum PlatformRole {
  PUBLIC_VISITOR = 'public_visitor',
  REGISTERED_ADVENTURER = 'registered_adventurer',
  VERIFIED_ADVENTURER = 'verified_adventurer',
  PROFESSIONAL_GUIDE = 'professional_guide',
  GUIDE_COMPANY = 'guide_company',
  TOUR_OPERATOR = 'tour_operator',
  ORGANIZATION_MEMBER = 'organization_member',
  ORGANIZATION_ADMIN = 'organization_admin',
  DESTINATION_PARTNER = 'destination_partner',
  SPONSOR = 'sponsor',
  REVIEWER = 'reviewer',
  SENIOR_REVIEWER = 'senior_reviewer',
  HERITAGE_GUARDIAN = 'heritage_guardian',
  APPEAL_REVIEWER = 'appeal_reviewer',
  MODERATOR = 'moderator',
  CUSTOMER_SUPPORT = 'customer_support',
  FINANCE_OPERATOR = 'finance_operator',
  SECURITY_AUDITOR = 'security_auditor',
  SYSTEM_ADMIN = 'system_admin',
  GOVERNANCE_MEMBER = 'governance_member',
  FOUNDER = 'founder',
}

/**
 * 11 Independent Operational Departments (Section 8 + Internal Audit)
 */
export enum GovernanceDepartmentId {
  DEPT_01_FOUNDER_OFFICE = 'DEPT-01',
  DEPT_02_GOVERNANCE_COMMITTEE = 'DEPT-02',
  DEPT_03_VERIFICATION = 'DEPT-03',
  DEPT_04_APPEAL_REVIEW = 'DEPT-04',
  DEPT_05_SECURITY = 'DEPT-05',
  DEPT_06_FINANCE = 'DEPT-06',
  DEPT_07_OPERATIONS = 'DEPT-07',
  DEPT_08_DESTINATION = 'DEPT-08',
  DEPT_09_MARKETPLACE = 'DEPT-09',
  DEPT_10_COMMUNITY = 'DEPT-10',
  DEPT_11_INTERNAL_AUDIT = 'DEPT-11',
}

/**
 * 4-Tier Data Privacy & Residency Classification (Section 47 & CHK-01.16)
 */
export enum DataPrivacyTier {
  TIER_1_PUBLIC = 'TIER_1_PUBLIC',
  TIER_2_INTERNAL = 'TIER_2_INTERNAL',
  TIER_3_RESTRICTED_EVIDENCE = 'TIER_3_RESTRICTED_EVIDENCE',
  TIER_4_REGULATED_PII = 'TIER_4_REGULATED_PII',
}

export enum DataResidencyRegion {
  NEPAL = 'NP',
  EUROPEAN_UNION = 'EU',
  UAE = 'UAE',
  GLOBAL = 'GLOBAL',
}

/**
 * Supported Locales (Section 66 & CHK-01.15 Bilingual English + Nepali priority)
 */
export type SupportedLocale =
  | 'en'
  | 'ne'
  | 'hi'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'zh'
  | 'ja';

export enum CalendarSystem {
  GREGORIAN_AD = 'GREGORIAN_AD',
  BIKRAM_SAMBAT_BS = 'BIKRAM_SAMBAT_BS',
}

/**
 * Mandatory 21 Development Phases Status Enum (Section 76)
 */
export enum PhaseExecutionStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  IN_PROGRESS = 'IN PROGRESS',
  AWAITING_FOUNDER_APPROVAL = 'AWAITING FOUNDER APPROVAL',
}
