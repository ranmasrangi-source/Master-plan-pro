/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Authoritative Server-Side Security, RBAC/COI Authorization, 5-Pillar ECF Verification,
 * Evidence Forensics (Amendment A4), Business Independence Firewall (System #12),
 * Independent Appeals Guard, and Cryptographic SHA-256 Audit Chain Service.
 *
 * Remediates BUG-01 through BUG-06.
 */

import {
  CONSTITUTIONAL_LOCKS,
  GovernanceDepartmentId,
  PlatformRole,
} from '../types/constitution.ts';
import { WhistleblowerReport } from '../types/governance.ts';
import { AdventureCategoryId, ReviewerQualificationTier } from '../types/taxonomy.ts';
import {
  AppealCaseRecord,
  EcfPathwayClassification,
  EvidenceConfidenceAssessment,
  EvidenceFileRecord,
  EvidencePillarId,
  ForensicAnomalyFlag,
  ReviewerCaseViewDTO,
  ScientificAntiFraudReport,
  VerificationCaseStatus,
} from '../types/verification.ts';

/**
 * Portable synchronous SHA-256 (FIPS 180-4) implementation in pure TypeScript.
 * Works identically in Node.js server runtimes, Edge workers, and browser clients
 * without requiring async WebCrypto or external native bindings.
 */
const SHA256_K: ReadonlyArray<number> = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function computeSha256Hex(message: string): string {
  const utf8 = new TextEncoder().encode(message);
  const bitLength = utf8.length * 8;

  const totalBytes = Math.ceil((utf8.length + 9) / 64) * 64;
  const padded = new Uint8Array(totalBytes);
  padded.set(utf8);
  padded[utf8.length] = 0x80;

  const view = new DataView(padded.buffer);
  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  view.setUint32(totalBytes - 8, highBits, false);
  view.setUint32(totalBytes - 4, lowBits, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < totalBytes; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((word) => word.toString(16).padStart(8, '0'))
    .join('');
}

// ============================================================================
// BUG-01: SERVER-SIDE 21-ROLE RBAC, MFA & CONFLICT-OF-INTEREST (COI) ENGINE
// ============================================================================

export const PRIVILEGED_MFA_REQUIRED_ROLES: ReadonlySet<PlatformRole> = new Set([
  PlatformRole.REVIEWER,
  PlatformRole.SENIOR_REVIEWER,
  PlatformRole.HERITAGE_GUARDIAN,
  PlatformRole.APPEAL_REVIEWER,
  PlatformRole.MODERATOR,
  PlatformRole.FINANCE_OPERATOR,
  PlatformRole.SECURITY_AUDITOR,
  PlatformRole.SYSTEM_ADMIN,
  PlatformRole.GOVERNANCE_MEMBER,
  PlatformRole.FOUNDER,
]);

export interface AuthenticatedActorContext {
  readonly userId: string;
  readonly role: PlatformRole;
  readonly sessionRevoked: boolean;
  readonly mfaVerifiedAtIso: string | null;
  readonly organizationIds: readonly string[];
  readonly qualifiedCategories?: readonly AdventureCategoryId[];
  readonly reviewerTier?: ReviewerQualificationTier | 'HERITAGE_GUARDIAN';
}

export interface AuthorizationOutcome {
  readonly authorized: boolean;
  readonly httpStatus: 200 | 401 | 403;
  readonly errorCode:
    | null
    | 'SESSION_REVOKED'
    | 'MFA_VERIFICATION_REQUIRED'
    | 'ROLE_FORBIDDEN'
    | 'COI_SELF_REVIEW_FORBIDDEN'
    | 'COI_SHARED_ORGANIZATION_CONFLICT'
    | 'COI_COMMERCIAL_BOOKING_CONFLICT'
    | 'REVIEWER_ACCREDITATION_INSUFFICIENT';
  readonly reason: string;
}

export function authorizeReviewerClaimAndAction(params: {
  readonly actor: AuthenticatedActorContext;
  readonly applicantUserId: string;
  readonly applicantOrganizationIds: readonly string[];
  readonly hasCommercialBookingWithApplicant: boolean;
  readonly requiredCategoryId: AdventureCategoryId;
}): AuthorizationOutcome {
  const {
    actor,
    applicantUserId,
    applicantOrganizationIds,
    hasCommercialBookingWithApplicant,
    requiredCategoryId,
  } = params;

  if (actor.sessionRevoked) {
    return {
      authorized: false,
      httpStatus: 401,
      errorCode: 'SESSION_REVOKED',
      reason: 'Actor session has been revoked.',
    };
  }

  if (PRIVILEGED_MFA_REQUIRED_ROLES.has(actor.role) && !actor.mfaVerifiedAtIso) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'MFA_VERIFICATION_REQUIRED',
      reason: `Role ${actor.role} requires active hardware/TOTP MFA verification.`,
    };
  }

  const allowedReviewerRoles = new Set<PlatformRole>([
    PlatformRole.REVIEWER,
    PlatformRole.SENIOR_REVIEWER,
    PlatformRole.HERITAGE_GUARDIAN,
  ]);

  if (!allowedReviewerRoles.has(actor.role)) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'ROLE_FORBIDDEN',
      reason: `Role ${actor.role} is not permitted to perform achievement verification.`,
    };
  }

  if (actor.userId === applicantUserId) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'COI_SELF_REVIEW_FORBIDDEN',
      reason: 'Separation of duties violation: A reviewer can never verify their own submission.',
    };
  }

  const sharesOrg = actor.organizationIds.some((orgId) =>
    applicantOrganizationIds.includes(orgId)
  );
  if (sharesOrg) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'COI_SHARED_ORGANIZATION_CONFLICT',
      reason: 'Conflict of interest: Reviewer shares an organization or club with the applicant.',
    };
  }

  if (hasCommercialBookingWithApplicant) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'COI_COMMERCIAL_BOOKING_CONFLICT',
      reason: 'Conflict of interest: Reviewer has a commercial guide/operator relationship with the applicant.',
    };
  }

  if (
    !actor.qualifiedCategories ||
    !actor.qualifiedCategories.includes(requiredCategoryId)
  ) {
    return {
      authorized: false,
      httpStatus: 403,
      errorCode: 'REVIEWER_ACCREDITATION_INSUFFICIENT',
      reason: `Reviewer is not accredited for adventure category ${requiredCategoryId}.`,
    };
  }

  return {
    authorized: true,
    httpStatus: 200,
    errorCode: null,
    reason: 'Authorized after passing RBAC, MFA, Accreditation, and COI checks.',
  };
}

// ============================================================================
// BUG-02: SERVER-SIDE 5-PILLAR ECF ENGINE & HUMAN VERIFICATION GATE
// ============================================================================

export function evaluateServerEcfAssessment(params: {
  readonly assessmentId: string;
  readonly applicationId: string;
  readonly pil01VisualScore: number;
  readonly pil02TelemetryScore: number;
  readonly pil03DocumentaryScore: number;
  readonly pil04WitnessScore: number;
  readonly pil05ChronologyScore: number;
  readonly requiredThreshold?: number;
  readonly computedAtIso?: string;
}): EvidenceConfidenceAssessment {
  const pil01 = Math.max(0, Math.min(40, params.pil01VisualScore));
  const pil02 = Math.max(0, Math.min(35, params.pil02TelemetryScore));
  const pil03 = Math.max(0, Math.min(35, params.pil03DocumentaryScore));
  const pil04 = Math.max(0, Math.min(30, params.pil04WitnessScore));
  const pil05 = Math.max(0, Math.min(20, params.pil05ChronologyScore));

  const requiredThreshold = Math.max(75, params.requiredThreshold ?? 75);
  const totalConfidenceScore = pil01 + pil02 + pil03 + pil04 + pil05;

  // Constitutional Rule (Section 14 & Amendment A3): GPS alone never proves an achievement
  const isGpsOnlyBlocked = pil02 > 0 && pil01 === 0 && pil03 === 0 && pil04 === 0;
  const eligibleForApproval = totalConfidenceScore >= requiredThreshold && !isGpsOnlyBlocked;

  let pathwayClassification: EcfPathwayClassification;
  if (isGpsOnlyBlocked) {
    pathwayClassification = EcfPathwayClassification.BLOCKED_GPS_ONLY_INSUFFICIENT;
  } else if (!eligibleForApproval) {
    pathwayClassification = EcfPathwayClassification.BLOCKED_BELOW_THRESHOLD;
  } else if (pil02 === 0) {
    pathwayClassification = EcfPathwayClassification.ALT_NO_GPS_DOCUMENTARY_WITNESS;
  } else {
    pathwayClassification = EcfPathwayClassification.STANDARD_MULTIMODAL;
  }

  return {
    assessmentId: params.assessmentId,
    applicationId: params.applicationId,
    pil01VisualScore: pil01,
    pil02TelemetryScore: pil02,
    pil03DocumentaryScore: pil03,
    pil04WitnessScore: pil04,
    pil05ChronologyScore: pil05,
    totalConfidenceScore,
    requiredThreshold,
    strippedExifPenaltyApplied: 0, // Constitutional invariant: 0 penalty for stripped EXIF
    isGpsOnlyBlocked,
    eligibleForApproval,
    pathwayClassification,
    policyVersion: 'v1.1.0',
    computedAt: params.computedAtIso ?? new Date().toISOString(),
  };
}

export function evaluateVerificationDecisionGate(params: {
  readonly actorType: 'HUMAN_REVIEWER' | 'AI_ASSISTANT';
  readonly ecfAssessment: EvidenceConfidenceAssessment;
  readonly requiresDualSenior: boolean;
  readonly requiresHeritageGuardian: boolean;
  readonly seniorApprovalsUserIds: readonly string[];
  readonly seniorRejectionsUserIds: readonly string[];
  readonly heritageGuardianApproved: boolean;
}): {
  readonly resultingStatus: VerificationCaseStatus;
  readonly errorCode: string | null;
} {
  if (
    params.actorType === 'AI_ASSISTANT' ||
    CONSTITUTIONAL_LOCKS.AI_FINAL_DECISION_ALLOWED !== false
  ) {
    return {
      resultingStatus: VerificationCaseStatus.IN_REVIEW,
      errorCode: 'CONSTITUTIONAL_VIOLATION_AI_FINAL_DECISION_FORBIDDEN',
    };
  }

  if (!params.ecfAssessment.eligibleForApproval) {
    return {
      resultingStatus: VerificationCaseStatus.MORE_EVIDENCE_REQUIRED,
      errorCode: 'ECF_THRESHOLD_OR_CORROBORATION_UNMET',
    };
  }

  const distinctApprovers = new Set(params.seniorApprovalsUserIds);
  const distinctRejecters = new Set(params.seniorRejectionsUserIds);

  if (distinctApprovers.size > 0 && distinctRejecters.size > 0) {
    return {
      resultingStatus: VerificationCaseStatus.ESCALATED_SPLIT_DECISION,
      errorCode: null,
    };
  }

  if (params.requiresDualSenior && distinctApprovers.size < 2) {
    return {
      resultingStatus: VerificationCaseStatus.AWAITING_SECOND_SENIOR_REVIEWER,
      errorCode: null,
    };
  }

  if (params.requiresHeritageGuardian && !params.heritageGuardianApproved) {
    return {
      resultingStatus: VerificationCaseStatus.AWAITING_HERITAGE_GUARDIAN,
      errorCode: null,
    };
  }

  if (distinctApprovers.size >= 1) {
    return {
      resultingStatus: VerificationCaseStatus.APPROVED,
      errorCode: null,
    };
  }

  return {
    resultingStatus: VerificationCaseStatus.REJECTED,
    errorCode: null,
  };
}

// ============================================================================
// BUG-03: SERVER-SIDE EVIDENCE HANDLING, XXE/EXECUTABLE SANITIZER, 1.0 KM
// GEOZONE MASKING & SCIENTIFIC ANTI-FRAUD ENGINE (AMENDMENT A4)
// ============================================================================

export interface GpxTrackPoint {
  readonly latitude: number;
  readonly longitude: number;
  readonly elevationMeters: number;
  readonly distanceFromStartKm: number;
}

export function sanitizeAndHashEvidenceUpload(params: {
  readonly evidenceId: string;
  readonly applicationId: string;
  readonly uploaderUserId: string;
  readonly pillar: EvidencePillarId;
  readonly fileType: 'PHOTO' | 'VIDEO' | 'GPX' | 'PERMIT_DOCUMENT' | 'HUT_LOGBOOK';
  readonly rawContentString: string;
  readonly trackPoints?: ReadonlyArray<GpxTrackPoint>;
}): {
  readonly accepted: boolean;
  readonly rejectionCode: null | 'XXE_PAYLOAD_DETECTED' | 'DISGUISED_EXECUTABLE_DETECTED';
  readonly sha256Hex: string | null;
  readonly maskedTrackPoints: ReadonlyArray<GpxTrackPoint>;
  readonly residentialGeozoneMasked: boolean;
} {
  const { rawContentString, fileType, trackPoints = [] } = params;

  // 1. Block disguised native executables (MZ PE / ELF headers)
  if (rawContentString.startsWith('MZ') || rawContentString.startsWith('\x7fELF')) {
    return {
      accepted: false,
      rejectionCode: 'DISGUISED_EXECUTABLE_DETECTED',
      sha256Hex: null,
      maskedTrackPoints: [],
      residentialGeozoneMasked: false,
    };
  }

  // 2. Block XML External Entity (XXE) injection in GPX / XML uploads
  if (
    fileType === 'GPX' &&
    (/<!ENTITY/i.test(rawContentString) || /<!DOCTYPE[^>]+SYSTEM/i.test(rawContentString))
  ) {
    return {
      accepted: false,
      rejectionCode: 'XXE_PAYLOAD_DETECTED',
      sha256Hex: null,
      maskedTrackPoints: [],
      residentialGeozoneMasked: false,
    };
  }

  // 3. Apply 1.0 km residential start/end geozone privacy trim on GPX tracks
  let maskedTrackPoints = trackPoints;
  let residentialGeozoneMasked = false;
  if (fileType === 'GPX' && trackPoints.length > 0) {
    const totalDistKm = trackPoints[trackPoints.length - 1].distanceFromStartKm;
    maskedTrackPoints = trackPoints.filter(
      (pt) => pt.distanceFromStartKm >= 1.0 && pt.distanceFromStartKm <= totalDistKm - 1.0
    );
    residentialGeozoneMasked = true;
  }

  const sha256Hex = computeSha256Hex(rawContentString);

  return {
    accepted: true,
    rejectionCode: null,
    sha256Hex,
    maskedTrackPoints,
    residentialGeozoneMasked,
  };
}

/**
 * Amendment A4: West's High-Altitude Exercise Physiology VO2max Decay Formula
 * V_max(h, dt) = V_ref * Phi(h) * (dt)^(-0.07)
 */
export function computeWestPhysiologicalAscentCeilingMPerHr(
  elevationMeters: number,
  durationHours: number,
  vRefSeaLevelMPerHr: number = 1400
): number {
  const hKm = Math.max(0, elevationMeters / 1000);
  // Barometric VO2max retention factor Phi(h) calibrated to West's Mount Everest physiology data
  const phiH = Math.max(0.15, 1 - 0.095 * Math.max(0, hKm - 1.5));
  const dtFactor = Math.pow(Math.max(0.5, durationHours), -0.07);
  return Number((vRefSeaLevelMPerHr * phiH * dtFactor).toFixed(2));
}

/**
 * Computes Hamming distance (0..64 bits) between two 16-hex-character (64-bit) perceptual hashes.
 */
export function computePHashHammingDistance64(hexA: string, hexB: string): number {
  const cleanA = hexA.trim().toLowerCase().padStart(16, '0').slice(0, 16);
  const cleanB = hexB.trim().toLowerCase().padStart(16, '0').slice(0, 16);
  let bitDiffCount = 0;
  for (let i = 0; i < 16; i++) {
    const nibbleXor = parseInt(cleanA[i], 16) ^ parseInt(cleanB[i], 16);
    let n = nibbleXor;
    while (n > 0) {
      bitDiffCount += n & 1;
      n >>= 1;
    }
  }
  return bitDiffCount;
}

export function evaluateScientificAntiFraud(params: {
  readonly investigationId: string;
  readonly applicationId: string;
  readonly demRmseMeters: number | null;
  readonly trackPointsCount: number;
  readonly observedAscentRateMPerHr: number | null;
  readonly elevationMeters: number;
  readonly ascentDurationHours: number;
  readonly uploadedPHash64Hex: string | null;
  readonly historicalPHashes: ReadonlyArray<{ readonly evidenceId: string; readonly pHash64Hex: string }>;
  readonly hasCircularWitnessCycle: boolean;
  readonly computedAtIso?: string;
}): ScientificAntiFraudReport {
  const flags: ForensicAnomalyFlag[] = [];

  // 1. Copernicus GLO-30 DEM RMSE checks (Amendment A4)
  if (params.demRmseMeters !== null) {
    if (params.demRmseMeters < 0.3 && params.trackPointsCount >= 500) {
      flags.push(ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG);
    } else if (params.demRmseMeters > 120.0) {
      flags.push(ForensicAnomalyFlag.ELEVATION_MISMATCH_FLAG);
    }
  }

  // 2. West High-Altitude VO2max Physiological Ascent Ceiling check (Amendment A4)
  const westCeiling = computeWestPhysiologicalAscentCeilingMPerHr(
    params.elevationMeters,
    params.ascentDurationHours
  );
  if (
    params.observedAscentRateMPerHr !== null &&
    params.observedAscentRateMPerHr > westCeiling
  ) {
    flags.push(ForensicAnomalyFlag.KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE);
  }

  // 3. 64-bit DCT Perceptual Hash (pHash) Hamming distance check (Amendment A4)
  let minDistance: number | null = null;
  let matchedEvidenceId: string | null = null;
  if (params.uploadedPHash64Hex && params.historicalPHashes.length > 0) {
    for (const hist of params.historicalPHashes) {
      const dist = computePHashHammingDistance64(
        params.uploadedPHash64Hex,
        hist.pHash64Hex
      );
      if (minDistance === null || dist < minDistance) {
        minDistance = dist;
        matchedEvidenceId = hist.evidenceId;
      }
    }
    if (minDistance !== null) {
      if (minDistance === 0) {
        flags.push(ForensicAnomalyFlag.CRITICAL_EXACT_DUPLICATE_FLAG);
      } else if (minDistance <= 6) {
        flags.push(ForensicAnomalyFlag.HIGH_VISUAL_DUPLICATE_FLAG);
      } else if (minDistance <= 12) {
        flags.push(ForensicAnomalyFlag.MODERATE_SIMILARITY_REVIEW_FLAG);
      }
    }
  }

  // 4. Reciprocal Witness Ring Check
  if (params.hasCircularWitnessCycle) {
    flags.push(ForensicAnomalyFlag.RECIPROCAL_WITNESS_RING_FLAG);
  }

  const investigationPriorityScore = Math.min(100, flags.length * 30);

  return {
    investigationId: params.investigationId,
    applicationId: params.applicationId,
    demDatasetUsed: 'COPERNICUS_GLO_30',
    demRmseMeters: params.demRmseMeters,
    maxObservedAscentRateMPerHr: params.observedAscentRateMPerHr,
    westPhysiologicalCeilingMPerHr: westCeiling,
    minPHashHammingDistanceBits: minDistance,
    matchedHistoricalEvidenceId: matchedEvidenceId,
    flags,
    investigationPriorityScore,
    computedAt: params.computedAtIso ?? new Date().toISOString(),
  };
}

// ============================================================================
// BUG-04 & AUD-04: CRYPTOGRAPHIC SHA-256 AUDIT CHAIN & ZERO-IP WHISTLEBLOWER
// ============================================================================

export const GENESIS_AUDIT_BLOCK_HASH: string = computeSha256Hex(
  '0TO8848_GENESIS_AUDIT_BLOCK_V1_1'
);

export interface CryptographicAuditRecord {
  readonly auditId: string;
  readonly sequenceNumber?: number;
  readonly actorUserId: string;
  readonly actorRole: PlatformRole;
  readonly departmentId: GovernanceDepartmentId;
  readonly action: string;
  readonly targetEntityId: string;
  readonly timestampIso: string;
  readonly prevAuditHash: string;
  readonly currentAuditHash: string;
}

export function computeCanonicalAuditRecordHash(
  entry: Omit<CryptographicAuditRecord, 'currentAuditHash'>
): string {
  const canonicalPayload = [
    entry.prevAuditHash,
    entry.auditId,
    entry.sequenceNumber !== undefined ? String(entry.sequenceNumber) : '',
    entry.actorUserId,
    entry.actorRole,
    entry.departmentId,
    entry.action,
    entry.targetEntityId,
    entry.timestampIso,
  ].join('|');

  return computeSha256Hex(canonicalPayload);
}

export function appendCryptographicAuditRecord(
  chain: ReadonlyArray<CryptographicAuditRecord>,
  entry: Omit<CryptographicAuditRecord, 'prevAuditHash' | 'currentAuditHash'>
): ReadonlyArray<CryptographicAuditRecord> {
  const prevAuditHash =
    chain.length === 0
      ? GENESIS_AUDIT_BLOCK_HASH
      : chain[chain.length - 1].currentAuditHash;

  const sequenceNumber =
    entry.sequenceNumber !== undefined
      ? entry.sequenceNumber
      : chain.length === 0
      ? 1
      : (chain[chain.length - 1].sequenceNumber ?? chain.length) + 1;

  const recordWithoutCurrentHash: Omit<CryptographicAuditRecord, 'currentAuditHash'> = {
    ...entry,
    sequenceNumber,
    prevAuditHash,
  };

  const currentAuditHash = computeCanonicalAuditRecordHash(recordWithoutCurrentHash);

  return [
    ...chain,
    Object.freeze({
      ...recordWithoutCurrentHash,
      currentAuditHash,
    }),
  ];
}

export interface AuditChainVerificationReport {
  readonly intact: boolean;
  readonly verifiedCount: number;
  readonly failureReason:
    | null
    | 'EMPTY_CHAIN'
    | 'GENESIS_HASH_MISMATCH'
    | 'SEQUENCE_GAP_OR_REORDER'
    | 'DUPLICATE_AUDIT_ID'
    | 'PREV_HASH_LINK_BROKEN'
    | 'PAYLOAD_TAMPERED_HASH_MISMATCH';
  readonly failedAuditId: string | null;
}

export function verifyCryptographicAuditChainDetailed(
  chain: ReadonlyArray<CryptographicAuditRecord>
): AuditChainVerificationReport {
  if (chain.length === 0) {
    return {
      intact: false,
      verifiedCount: 0,
      failureReason: 'EMPTY_CHAIN',
      failedAuditId: null,
    };
  }

  const seenAuditIds = new Set<string>();

  for (let i = 0; i < chain.length; i++) {
    const rec = chain[i];

    if (seenAuditIds.has(rec.auditId)) {
      return {
        intact: false,
        verifiedCount: i,
        failureReason: 'DUPLICATE_AUDIT_ID',
        failedAuditId: rec.auditId,
      };
    }
    seenAuditIds.add(rec.auditId);

    // 1. Verify Genesis or Previous Hash Link
    if (i === 0) {
      if (rec.prevAuditHash !== GENESIS_AUDIT_BLOCK_HASH) {
        return {
          intact: false,
          verifiedCount: 0,
          failureReason: 'GENESIS_HASH_MISMATCH',
          failedAuditId: rec.auditId,
        };
      }
    } else {
      if (rec.prevAuditHash !== chain[i - 1].currentAuditHash) {
        return {
          intact: false,
          verifiedCount: i,
          failureReason: 'PREV_HASH_LINK_BROKEN',
          failedAuditId: rec.auditId,
        };
      }
    }

    // 2. Verify Monotonic Sequence Continuity
    if (rec.sequenceNumber !== undefined) {
      const expectedSeq =
        i === 0
          ? rec.sequenceNumber
          : (chain[i - 1].sequenceNumber ?? i) + 1;
      if (i === 0 && rec.sequenceNumber < 1) {
        return {
          intact: false,
          verifiedCount: i,
          failureReason: 'SEQUENCE_GAP_OR_REORDER',
          failedAuditId: rec.auditId,
        };
      }
      if (i > 0 && rec.sequenceNumber !== expectedSeq) {
        return {
          intact: false,
          verifiedCount: i,
          failureReason: 'SEQUENCE_GAP_OR_REORDER',
          failedAuditId: rec.auditId,
        };
      }
    }

    // 3. Recompute Current Hash from Canonical Payload
    const expectedCurrent = computeCanonicalAuditRecordHash(rec);
    if (rec.currentAuditHash !== expectedCurrent) {
      return {
        intact: false,
        verifiedCount: i,
        failureReason: 'PAYLOAD_TAMPERED_HASH_MISMATCH',
        failedAuditId: rec.auditId,
      };
    }
  }

  return {
    intact: true,
    verifiedCount: chain.length,
    failureReason: null,
    failedAuditId: null,
  };
}

export function verifyCryptographicAuditChain(
  chain: ReadonlyArray<CryptographicAuditRecord>
): boolean {
  return verifyCryptographicAuditChainDetailed(chain).intact;
}

export function createZeroIpWhistleblowerReport(params: {
  readonly reportId: string;
  readonly oneTimeReceiptToken: string;
  readonly category: WhistleblowerReport['category'];
  readonly encryptedNarrative: string;
  readonly callerIpAddress?: string; // Explicitly stripped and never stored
  readonly createdAtIso?: string;
}): WhistleblowerReport {
  return {
    reportId: params.reportId,
    anonymousReceiptCodeHash: computeSha256Hex(params.oneTimeReceiptToken),
    category: params.category,
    encryptedNarrative: params.encryptedNarrative,
    assignedInternalAuditorId: null,
    accessibleBySystemAdmin: false, // Hard-isolated to DEPT-11 Internal Audit
    callerIpLogged: false, // Zero-IP guarantee
    status: 'SUBMITTED',
    createdAtIso: params.createdAtIso ?? new Date().toISOString(),
  };
}

// ============================================================================
// BUG-05 & AUD-05: EXPLICIT ALLOWLIST REVIEWER FIREWALL & APPEALS GUARD
// ============================================================================

export const ALLOWED_REVIEWER_CASE_DTO_KEYS: ReadonlySet<keyof ReviewerCaseViewDTO> = new Set<
  keyof ReviewerCaseViewDTO
>([
  'caseId',
  'applicationId',
  'categoryId',
  'achievementId',
  'destinationId',
  'routeId',
  'attemptStartDateIso',
  'attemptCompletionDateIso',
  'dateCalendarSystem',
  'originalBikramSambatDate',
  'supplementalOxygenUsed',
  'lntSelfScore',
  'requiredReviewerTier',
  'requiresDualSenior',
  'requiresHeritageGuardian',
  'evidenceFiles',
  'ecfAssessment',
  'antiFraudReport',
  'status',
  'policyVersion',
]);

export const ALLOWED_EVIDENCE_FILE_KEYS: ReadonlySet<keyof EvidenceFileRecord> = new Set<
  keyof EvidenceFileRecord
>([
  'evidenceId',
  'applicationId',
  'uploaderUserId',
  'pillar',
  'fileType',
  'storageUri',
  'sizeBytes',
  'sha256Hex',
  'pHash64Hex',
  'pHashMirror64Hex',
  'exifPresent',
  'residentialGeozoneMasked',
  'rawBinaryDeletedPostApproval',
  'uploadedAt',
]);

export const ALLOWED_ECF_ASSESSMENT_KEYS: ReadonlySet<keyof EvidenceConfidenceAssessment> =
  new Set<keyof EvidenceConfidenceAssessment>([
    'assessmentId',
    'applicationId',
    'pil01VisualScore',
    'pil02TelemetryScore',
    'pil03DocumentaryScore',
    'pil04WitnessScore',
    'pil05ChronologyScore',
    'totalConfidenceScore',
    'requiredThreshold',
    'strippedExifPenaltyApplied',
    'isGpsOnlyBlocked',
    'eligibleForApproval',
    'pathwayClassification',
    'policyVersion',
    'computedAt',
  ]);

export const ALLOWED_ANTI_FRAUD_REPORT_KEYS: ReadonlySet<keyof ScientificAntiFraudReport> =
  new Set<keyof ScientificAntiFraudReport>([
    'investigationId',
    'applicationId',
    'demDatasetUsed',
    'demRmseMeters',
    'maxObservedAscentRateMPerHr',
    'westPhysiologicalCeilingMPerHr',
    'minPHashHammingDistanceBits',
    'matchedHistoricalEvidenceId',
    'flags',
    'investigationPriorityScore',
    'computedAt',
  ]);

function collectUnallowedKeyPaths(
  obj: unknown,
  allowedKeys: ReadonlySet<string>,
  prefix: string,
  acc: string[]
): void {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return;
  }
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (!allowedKeys.has(key)) {
      acc.push(fullPath);
    }
  }
}

/**
 * AUD-05: Strict Deep Allowlist Projection for ReviewerCaseViewDTO.
 * Rather than relying on a shallow denylist, this function constructs a brand-new,
 * deeply frozen ReviewerCaseViewDTO containing ONLY the explicitly allowlisted fields
 * at the top level and inside `evidenceFiles[]`, `ecfAssessment`, and `antiFraudReport`.
 * Any top-level or nested sponsor, advertiser, subscription, billing, or unknown property
 * is rejected by construction and reported in `strippedFieldPaths`.
 */
export function sanitizeCaseForReviewerFirewall(
  rawPayload: Record<string, unknown> & ReviewerCaseViewDTO
): {
  readonly sanitizedDto: ReviewerCaseViewDTO;
  readonly strippedCommercialFieldsCount: number;
  readonly strippedFieldPaths: readonly string[];
} {
  const strippedFieldPaths: string[] = [];

  // 1. Detect unallowed top-level keys
  collectUnallowedKeyPaths(
    rawPayload,
    ALLOWED_REVIEWER_CASE_DTO_KEYS as ReadonlySet<string>,
    '',
    strippedFieldPaths
  );

  // 2. Project nested evidenceFiles[] via strict allowlist
  const rawEvidenceArray = Array.isArray(rawPayload.evidenceFiles)
    ? rawPayload.evidenceFiles
    : [];
  const projectedEvidenceFiles: EvidenceFileRecord[] = rawEvidenceArray.map((ev, idx) => {
    collectUnallowedKeyPaths(
      ev,
      ALLOWED_EVIDENCE_FILE_KEYS as ReadonlySet<string>,
      `evidenceFiles[${idx}]`,
      strippedFieldPaths
    );
    return Object.freeze({
      evidenceId: String(ev.evidenceId),
      applicationId: String(ev.applicationId),
      uploaderUserId: String(ev.uploaderUserId),
      pillar: ev.pillar,
      fileType: ev.fileType,
      storageUri: String(ev.storageUri),
      sizeBytes: Number(ev.sizeBytes),
      sha256Hex: String(ev.sha256Hex),
      pHash64Hex: ev.pHash64Hex !== null && ev.pHash64Hex !== undefined ? String(ev.pHash64Hex) : null,
      pHashMirror64Hex:
        ev.pHashMirror64Hex !== null && ev.pHashMirror64Hex !== undefined
          ? String(ev.pHashMirror64Hex)
          : null,
      exifPresent: Boolean(ev.exifPresent),
      residentialGeozoneMasked: Boolean(ev.residentialGeozoneMasked),
      rawBinaryDeletedPostApproval: Boolean(ev.rawBinaryDeletedPostApproval),
      uploadedAt: String(ev.uploadedAt),
    });
  });

  // 3. Project nested ecfAssessment via strict allowlist
  const rawEcf = rawPayload.ecfAssessment;
  collectUnallowedKeyPaths(
    rawEcf,
    ALLOWED_ECF_ASSESSMENT_KEYS as ReadonlySet<string>,
    'ecfAssessment',
    strippedFieldPaths
  );
  const projectedEcf: EvidenceConfidenceAssessment = Object.freeze({
    assessmentId: String(rawEcf.assessmentId),
    applicationId: String(rawEcf.applicationId),
    pil01VisualScore: Number(rawEcf.pil01VisualScore),
    pil02TelemetryScore: Number(rawEcf.pil02TelemetryScore),
    pil03DocumentaryScore: Number(rawEcf.pil03DocumentaryScore),
    pil04WitnessScore: Number(rawEcf.pil04WitnessScore),
    pil05ChronologyScore: Number(rawEcf.pil05ChronologyScore),
    totalConfidenceScore: Number(rawEcf.totalConfidenceScore),
    requiredThreshold: Number(rawEcf.requiredThreshold),
    strippedExifPenaltyApplied: 0,
    isGpsOnlyBlocked: Boolean(rawEcf.isGpsOnlyBlocked),
    eligibleForApproval: Boolean(rawEcf.eligibleForApproval),
    pathwayClassification: rawEcf.pathwayClassification,
    policyVersion: String(rawEcf.policyVersion),
    computedAt: String(rawEcf.computedAt),
  });

  // 4. Project nested antiFraudReport via strict allowlist
  const rawFraud = rawPayload.antiFraudReport;
  collectUnallowedKeyPaths(
    rawFraud,
    ALLOWED_ANTI_FRAUD_REPORT_KEYS as ReadonlySet<string>,
    'antiFraudReport',
    strippedFieldPaths
  );
  const projectedFlags: readonly ForensicAnomalyFlag[] = Object.freeze(
    Array.isArray(rawFraud.flags) ? [...rawFraud.flags] : []
  );
  const projectedFraud: ScientificAntiFraudReport = Object.freeze({
    investigationId: String(rawFraud.investigationId),
    applicationId: String(rawFraud.applicationId),
    demDatasetUsed: rawFraud.demDatasetUsed,
    demRmseMeters:
      rawFraud.demRmseMeters !== null && rawFraud.demRmseMeters !== undefined
        ? Number(rawFraud.demRmseMeters)
        : null,
    maxObservedAscentRateMPerHr:
      rawFraud.maxObservedAscentRateMPerHr !== null &&
      rawFraud.maxObservedAscentRateMPerHr !== undefined
        ? Number(rawFraud.maxObservedAscentRateMPerHr)
        : null,
    westPhysiologicalCeilingMPerHr:
      rawFraud.westPhysiologicalCeilingMPerHr !== null &&
      rawFraud.westPhysiologicalCeilingMPerHr !== undefined
        ? Number(rawFraud.westPhysiologicalCeilingMPerHr)
        : null,
    minPHashHammingDistanceBits:
      rawFraud.minPHashHammingDistanceBits !== null &&
      rawFraud.minPHashHammingDistanceBits !== undefined
        ? Number(rawFraud.minPHashHammingDistanceBits)
        : null,
    matchedHistoricalEvidenceId:
      rawFraud.matchedHistoricalEvidenceId !== null &&
      rawFraud.matchedHistoricalEvidenceId !== undefined
        ? String(rawFraud.matchedHistoricalEvidenceId)
        : null,
    flags: projectedFlags,
    investigationPriorityScore: Number(rawFraud.investigationPriorityScore),
    computedAt: String(rawFraud.computedAt),
  });

  // 5. Construct deeply frozen allowlisted ReviewerCaseViewDTO
  const sanitizedDto: ReviewerCaseViewDTO = Object.freeze({
    caseId: String(rawPayload.caseId),
    applicationId: String(rawPayload.applicationId),
    categoryId: rawPayload.categoryId,
    achievementId: String(rawPayload.achievementId),
    destinationId: String(rawPayload.destinationId),
    routeId: String(rawPayload.routeId),
    attemptStartDateIso: String(rawPayload.attemptStartDateIso),
    attemptCompletionDateIso: String(rawPayload.attemptCompletionDateIso),
    dateCalendarSystem: rawPayload.dateCalendarSystem,
    originalBikramSambatDate:
      rawPayload.originalBikramSambatDate !== null &&
      rawPayload.originalBikramSambatDate !== undefined
        ? String(rawPayload.originalBikramSambatDate)
        : null,
    supplementalOxygenUsed: Boolean(rawPayload.supplementalOxygenUsed),
    lntSelfScore: Number(rawPayload.lntSelfScore),
    requiredReviewerTier: rawPayload.requiredReviewerTier,
    requiresDualSenior: Boolean(rawPayload.requiresDualSenior),
    requiresHeritageGuardian: Boolean(rawPayload.requiresHeritageGuardian),
    evidenceFiles: Object.freeze(projectedEvidenceFiles),
    ecfAssessment: projectedEcf,
    antiFraudReport: projectedFraud,
    status: rawPayload.status,
    policyVersion: String(rawPayload.policyVersion),
  });

  return {
    sanitizedDto,
    strippedCommercialFieldsCount: strippedFieldPaths.length,
    strippedFieldPaths: Object.freeze(strippedFieldPaths),
  };
}

export function authorizeIndependentAppealDecision(params: {
  readonly appealCase: AppealCaseRecord;
  readonly actorUserId: string;
  readonly actorRole: PlatformRole;
}): {
  readonly allowed: boolean;
  readonly errorCode:
    | null
    | 'ROLE_NOT_APPEAL_REVIEWER'
    | 'APPEAL_INDEPENDENCE_VIOLATION_ORIGINAL_REVIEWER'
    | 'APPEAL_SELF_REVIEW_FORBIDDEN';
} {
  if (params.actorRole !== PlatformRole.APPEAL_REVIEWER) {
    return {
      allowed: false,
      errorCode: 'ROLE_NOT_APPEAL_REVIEWER',
    };
  }
  if (params.actorUserId === params.appealCase.appellantUserId) {
    return {
      allowed: false,
      errorCode: 'APPEAL_SELF_REVIEW_FORBIDDEN',
    };
  }
  if (params.appealCase.excludedOriginalReviewerIds.includes(params.actorUserId)) {
    return {
      allowed: false,
      errorCode: 'APPEAL_INDEPENDENCE_VIOLATION_ORIGINAL_REVIEWER',
    };
  }
  return {
    allowed: true,
    errorCode: null,
  };
}

// ============================================================================
// BUG-06: RUNTIME CONSTITUTIONAL LAUNCH LOCK GATE (PAYMENTS & BLOCKCHAIN)
// Note: In Phase 04 this is a pure TypeScript guard helper; live Express/HTTP
// router middleware attachment is scheduled for Phase 05 / Phase 17 / Phase 18.
// ============================================================================

const LOCKED_PAYMENT_ENDPOINT_PREFIXES: ReadonlyArray<string> = [
  '/api/v1/payments',
  '/api/v1/payment',
  '/api/v1/billing',
  '/api/v1/checkout',
  '/api/v1/subscriptions',
  '/api/v1/stripe',
];

const LOCKED_BLOCKCHAIN_ENDPOINT_PREFIXES: ReadonlyArray<string> = [
  '/api/v1/blockchain',
  '/api/v1/web3',
  '/api/v1/nft',
  '/api/v1/mint',
  '/api/v1/soulbound',
];

function normalizeEndpointPath(rawPath: string): string {
  let decoded = rawPath.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep raw trimmed path if malformed percent-encoding is supplied
  }
  const withoutQueryOrHash = decoded.split(/[?#]/)[0] ?? '';
  const rawSegments = withoutQueryOrHash.replace(/\\/g, '/').split('/');
  const resolvedSegments: string[] = [];
  for (const seg of rawSegments) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      resolvedSegments.pop();
      continue;
    }
    resolvedSegments.push(seg.toLowerCase());
  }
  return '/' + resolvedSegments.join('/');
}

function matchesPrefixBoundary(normalizedPath: string, prefix: string): boolean {
  return normalizedPath === prefix || normalizedPath.startsWith(prefix + '/');
}

export function enforceConstitutionalEndpointGate(requestPath: string): {
  readonly blocked: boolean;
  readonly httpStatus: 200 | 403;
  readonly errorCode:
    | null
    | 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION'
    | 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION';
} {
  const normalized = normalizeEndpointPath(requestPath);
  if (
    CONSTITUTIONAL_LOCKS.PAYMENTS_ENABLED === false &&
    LOCKED_PAYMENT_ENDPOINT_PREFIXES.some((prefix) =>
      matchesPrefixBoundary(normalized, prefix)
    )
  ) {
    return {
      blocked: true,
      httpStatus: 403,
      errorCode: 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION',
    };
  }
  if (
    CONSTITUTIONAL_LOCKS.BLOCKCHAIN_ENABLED === false &&
    LOCKED_BLOCKCHAIN_ENDPOINT_PREFIXES.some((prefix) =>
      matchesPrefixBoundary(normalized, prefix)
    )
  ) {
    return {
      blocked: true,
      httpStatus: 403,
      errorCode: 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION',
    };
  }
  return {
    blocked: false,
    httpStatus: 200,
    errorCode: null,
  };
}

