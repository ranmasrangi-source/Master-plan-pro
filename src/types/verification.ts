/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Verification, Evidence Confidence Framework (ECF), Scientific Anti-Fraud,
 * Independent Appeals & Business Independence Firewall DTO Types (Amendments A3 & A4)
 */

import { CalendarSystem } from './constitution.ts';
import { AdventureCategoryId, ReviewerQualificationTier } from './taxonomy.ts';

export enum EvidencePillarId {
  PIL_01_VISUAL_MEDIA = 'PIL-01', // Max 40 pts
  PIL_02_GEOSPATIAL_TELEMETRY = 'PIL-02', // Max 35 pts
  PIL_03_OFFICIAL_DOCUMENTARY = 'PIL-03', // Max 35 pts
  PIL_04_INDEPENDENT_WITNESS = 'PIL-04', // Max 30 pts
  PIL_05_CHRONOLOGICAL_PLAUSIBILITY = 'PIL-05', // Max 20 pts
}

export enum EcfPathwayClassification {
  STANDARD_MULTIMODAL = 'STANDARD_MULTIMODAL',
  ALT_NO_GPS_DOCUMENTARY_WITNESS = 'ALT_NO_GPS_DOCUMENTARY_WITNESS',
  BLOCKED_GPS_ONLY_INSUFFICIENT = 'BLOCKED_GPS_ONLY_INSUFFICIENT',
  BLOCKED_BELOW_THRESHOLD = 'BLOCKED_BELOW_THRESHOLD',
  DUAL_SENIOR_OVERRIDDEN = 'DUAL_SENIOR_OVERRIDDEN',
}

/**
 * System #1 & Amendment A3: Evidence Confidence Assessment (0–160 Raw Points, >= 75 Threshold)
 */
export interface EvidenceConfidenceAssessment {
  readonly assessmentId: string;
  readonly applicationId: string;
  readonly pil01VisualScore: number; // 0..40
  readonly pil02TelemetryScore: number; // 0..35
  readonly pil03DocumentaryScore: number; // 0..35
  readonly pil04WitnessScore: number; // 0..30
  readonly pil05ChronologyScore: number; // 0..20
  readonly totalConfidenceScore: number; // Sum 0..160
  readonly requiredThreshold: number; // Default 75
  readonly strippedExifPenaltyApplied: 0; // Constitutional invariant: 0 penalty for stripped EXIF
  readonly isGpsOnlyBlocked: boolean; // True if pil02 > 0 and pil01 == 0 && pil03 == 0 && pil04 == 0
  readonly eligibleForApproval: boolean;
  readonly pathwayClassification: EcfPathwayClassification;
  readonly policyVersion: string;
  readonly computedAt: string;
}

/**
 * Amendment A3: Exceptional Dual-Senior ECF Override Audit Record
 */
export interface EcfOverrideAuditRecord {
  readonly overrideId: string;
  readonly applicationId: string;
  readonly computedEcfScore: number;
  readonly requiredThreshold: number;
  readonly missingPillarReason: string;
  readonly compensatingEvidenceSummary: string;
  readonly primarySeniorReviewerId: string;
  readonly coSigningSeniorReviewerId: string;
  readonly verificationLeadApprovalId: string;
  readonly policyVersion: string;
  readonly prevAuditHash: string;
  readonly overrideEventHash: string;
  readonly timestamp: string;
}

/**
 * Section 27: 13-Point Evidence Chain of Custody Record
 */
export interface EvidenceFileRecord {
  readonly evidenceId: string;
  readonly applicationId: string;
  readonly uploaderUserId: string;
  readonly pillar: EvidencePillarId;
  readonly fileType: 'PHOTO' | 'VIDEO' | 'GPX' | 'PERMIT_DOCUMENT' | 'HUT_LOGBOOK';
  readonly storageUri: string;
  readonly sizeBytes: number;
  readonly sha256Hex: string; // 256-bit cryptographic digest
  readonly pHash64Hex: string | null; // 64-bit DCT perceptual hash (Amendment A4)
  readonly pHashMirror64Hex: string | null; // Mirror-flip perceptual hash
  readonly exifPresent: boolean;
  readonly residentialGeozoneMasked: boolean; // 1.0 km start/end privacy trim
  readonly rawBinaryDeletedPostApproval: boolean; // System #17
  readonly uploadedAt: string;
}

/**
 * Amendment A4: Scientific Anti-Fraud Forensics Evaluation
 * Risk scores are investigation signals only — never automatic proof of guilt.
 */
export enum ForensicAnomalyFlag {
  SYNTHETIC_DEM_CLAMP_FLAG = 'SYNTHETIC_DEM_CLAMP_FLAG', // E_RMSE < 0.3m over >500 pts
  ELEVATION_MISMATCH_FLAG = 'ELEVATION_MISMATCH_FLAG', // E_RMSE > 120.0m vs Copernicus GLO-30 DEM
  KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE = 'KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE', // Exceeds West VO2max V_max(h, dt)
  CRITICAL_EXACT_DUPLICATE_FLAG = 'CRITICAL_EXACT_DUPLICATE_FLAG', // SHA-256 or pHash D_H == 0
  HIGH_VISUAL_DUPLICATE_FLAG = 'HIGH_VISUAL_DUPLICATE_FLAG', // 64-bit DCT pHash Hamming distance 0 <= D_H <= 6
  MODERATE_SIMILARITY_REVIEW_FLAG = 'MODERATE_SIMILARITY_REVIEW_FLAG', // 7 <= D_H <= 12
  RECIPROCAL_WITNESS_RING_FLAG = 'RECIPROCAL_WITNESS_RING_FLAG', // Circular A <-> B witness graph
}

export interface ScientificAntiFraudReport {
  readonly investigationId: string;
  readonly applicationId: string;
  readonly demDatasetUsed: 'COPERNICUS_GLO_30' | 'ARCTIC_REMA_DEM';
  readonly demRmseMeters: number | null;
  readonly maxObservedAscentRateMPerHr: number | null;
  readonly westPhysiologicalCeilingMPerHr: number | null;
  readonly minPHashHammingDistanceBits: number | null; // 0..64
  readonly matchedHistoricalEvidenceId: string | null;
  readonly flags: readonly ForensicAnomalyFlag[];
  readonly investigationPriorityScore: number; // 0..100 (Signal only; never auto-rejects)
  readonly computedAt: string;
}

/**
 * Section 28: Human Verification Decision Statuses
 */
export enum VerificationCaseStatus {
  SUBMITTED = 'SUBMITTED',
  MORE_EVIDENCE_REQUIRED = 'MORE_EVIDENCE_REQUIRED',
  IN_REVIEW = 'IN_REVIEW',
  AWAITING_SECOND_SENIOR_REVIEWER = 'AWAITING_SECOND_SENIOR_REVIEWER',
  AWAITING_HERITAGE_GUARDIAN = 'AWAITING_HERITAGE_GUARDIAN',
  ESCALATED_SPLIT_DECISION = 'ESCALATED_SPLIT_DECISION',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  SUSPENDED_PENDING_REVIEW = 'SUSPENDED_PENDING_REVIEW',
}

/**
 * System #12: BUSINESS INDEPENDENCE FIREWALL DTO
 * Compile-time guarantee that a Reviewer examining a case is completely blinded to
 * whether the applicant has a paid subscription, sponsor affiliation, or marketplace booking.
 */
export interface ForbiddenCommercialFieldsOnVerification {
  readonly sponsorId?: never;
  readonly sponsorCampaignId?: never;
  readonly subscriptionTier?: never;
  readonly paidMemberStatus?: never;
  readonly lifetimeSpendUsd?: never;
  readonly marketplaceBookingId?: never;
  readonly priorityQueuePaid?: never;
}

export interface ReviewerCaseViewDTO extends ForbiddenCommercialFieldsOnVerification {
  readonly caseId: string;
  readonly applicationId: string;
  readonly categoryId: AdventureCategoryId;
  readonly achievementId: string;
  readonly destinationId: string;
  readonly routeId: string;
  readonly attemptStartDateIso: string;
  readonly attemptCompletionDateIso: string;
  readonly dateCalendarSystem: CalendarSystem;
  readonly originalBikramSambatDate: string | null; // FQ-07 Nepali BS support
  readonly supplementalOxygenUsed: boolean;
  readonly lntSelfScore: number; // NF-05 (0..100)
  readonly requiredReviewerTier: ReviewerQualificationTier;
  readonly requiresDualSenior: boolean;
  readonly requiresHeritageGuardian: boolean;
  readonly evidenceFiles: readonly EvidenceFileRecord[];
  readonly ecfAssessment: EvidenceConfidenceAssessment;
  readonly antiFraudReport: ScientificAntiFraudReport;
  readonly status: VerificationCaseStatus;
  readonly policyVersion: string;
}

/**
 * Section 29: Independent Appeal Case
 * Enforces that originalReviewerIds cannot be assigned to or decide the appeal.
 */
export interface AppealCaseRecord {
  readonly appealId: string;
  readonly applicationId: string;
  readonly originalVerificationCaseId: string;
  readonly appellantUserId: string;
  readonly excludedOriginalReviewerIds: readonly string[]; // Hard-blocked from appeal decisions
  readonly appealGrounds: string;
  readonly supplementalEvidenceIds: readonly string[];
  readonly assignedAppealReviewerId: string | null;
  readonly status: 'OPEN' | 'IN_APPEAL_REVIEW' | 'UPHELD_APPROVED' | 'DISMISSED_REJECTED';
  readonly reasonedOutcome: string | null;
  readonly policyVersion: string;
  readonly filedAt: string;
  readonly decidedAt: string | null;
}
