/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Governance Quorum, Whistleblower Vault, Trust Transparency,
 * Reviewer Accreditation, Privacy Analytics & Proposed Features (NF-01..NF-05)
 */

import { GovernanceDepartmentId, PlatformRole } from './constitution.ts';
import { AdventureCategoryId, ReviewerQualificationTier } from './taxonomy.ts';

/**
 * System #4: Independent Audit & Zero-IP Whistleblower Report
 */
export interface WhistleblowerReport {
  readonly reportId: string;
  readonly anonymousReceiptCodeHash: string;
  readonly category:
    | 'FAKE_ACHIEVEMENT_CLAIM'
    | 'REVIEWER_CONFLICT_OR_BRIBERY'
    | 'SPONSOR_INTERFERENCE'
    | 'ADMIN_PRIVILEGE_ABUSE'
    | 'SAFETY_HAZARD_COVERUP';
  readonly encryptedNarrative: string;
  readonly assignedInternalAuditorId: string | null;
  readonly accessibleBySystemAdmin: false; // Strictly isolated to DEPT-11 Internal Audit & Governance
  readonly callerIpLogged: false; // Zero-IP guarantee
  readonly status: 'SUBMITTED' | 'UNDER_AUDIT' | 'RESOLVED_ACTION_TAKEN' | 'DISMISSED_WITH_REASON';
  readonly createdAtIso: string;
}

/**
 * System #6: Public Trust Transparency Dashboard Metrics
 */
export interface TrustTransparencySnapshot {
  readonly periodKey: string;
  readonly totalApplicationsReviewed: number;
  readonly totalApprovedCount: number;
  readonly totalRejectedCount: number;
  readonly totalMoreEvidenceCount: number;
  readonly totalAppealsFiled: number;
  readonly totalAppealsUpheld: number;
  readonly totalCredentialsRevoked: number;
  readonly totalReviewerCoiRecusals: number;
  readonly sponsorInfluenceIncidents: 0;
  readonly generatedFromLiveDbAtIso: string;
}

/**
 * System #7 & NF-01: Reviewer & Heritage Guardian Accreditation Record
 */
export interface ReviewerAccreditation {
  readonly accreditationId: string;
  readonly reviewerUserId: string;
  readonly role: PlatformRole.REVIEWER | PlatformRole.SENIOR_REVIEWER | PlatformRole.HERITAGE_GUARDIAN;
  readonly tier: ReviewerQualificationTier | 'HERITAGE_GUARDIAN';
  readonly qualifiedCategoryIds: readonly AdventureCategoryId[];
  readonly sacredGuardianDestinationIds: readonly string[]; // NF-01 & FQ-09
  readonly calibrationAccuracyScore: number; // 0..100
  readonly lastCalibrationDateIso: string;
  readonly accreditationExpiresAtIso: string;
  readonly status: 'ACTIVE' | 'SUSPENDED_RECALIBRATION_REQUIRED' | 'EXPIRED';
}

/**
 * System #14: Founder Succession & Multi-Sig Quorum Governance Proposal
 */
export interface GovernanceQuorumProposal {
  readonly proposalId: string;
  readonly departmentId: GovernanceDepartmentId;
  readonly actionType:
    | 'POLICY_VERSION_UPDATE'
    | 'PRIVILEGED_ROLE_ASSIGNMENT'
    | 'CREDENTIAL_REVOCATION'
    | 'CONTINUITY_DELEGATION';
  readonly proposedByUserId: string;
  readonly coSignedByUserIds: readonly string[];
  readonly requiredQuorumCount: number;
  readonly timelockExpiresAtIso: string; // +72 hours mandatory cooling period
  readonly executedAtIso: string | null;
  readonly status: 'PENDING_QUORUM' | 'TIMELOCK_ACTIVE' | 'EXECUTED' | 'REJECTED';
}

/**
 * System #16: Privacy-Preserving k-Anonymity Analytics Bucket (k >= 5)
 */
export interface PrivacyPreservingMetricBucket {
  readonly dateBucket: string;
  readonly metricKey: string;
  readonly dimensionKey: string;
  readonly count: number; // Suppressed if < 5
  readonly kAnonymityFloorEnforced: 5;
}

/**
 * NF-02: Live Trail Condition Report
 */
export interface TrailConditionReport {
  readonly reportId: string;
  readonly routeId: string;
  readonly reporterUserId: string;
  readonly conditionType:
    | 'BRIDGE_WASHED_OUT'
    | 'CREVASSE_LADDER_SHIFT'
    | 'FIXED_ROPE_INSTALLED'
    | 'LANDSLIDE_REROUTE'
    | 'AVALANCHE_DEBRIS'
    | 'ALL_CLEAR';
  readonly summary: string;
  readonly corroborationCount: number;
  readonly status: 'UNCONFIRMED_FIELD_REPORT' | 'CORROBORATED' | 'EXPIRED';
  readonly expiresAtIso: string;
}

/**
 * NF-04: Rule-Based Altitude Acclimatization Assessment
 */
export interface AcclimatizationScheduleCheck {
  readonly routeId: string;
  readonly maxElevationMeters: number;
  readonly proposedSleepingElevationsMeters: readonly number[];
  readonly maxDailySleepingGainAbove3000m: number;
  readonly compliesWithWmsUiaaGuidelines: boolean; // <= 500m/day sleeping gain + rest day every 3-4 days
  readonly warningMessages: readonly string[];
  readonly nonMedicalAdviceDisclaimer: true;
}
