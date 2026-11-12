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
// BUG-04: CRYPTOGRAPHIC SHA-256 AUDIT CHAIN & ZERO-IP WHISTLEBLOWER VAULT
// ============================================================================

export interface CryptographicAuditRecord {
  readonly auditId: string;
  readonly actorUserId: string;
  readonly actorRole: PlatformRole;
  readonly departmentId: GovernanceDepartmentId;
  readonly action: string;
  readonly targetEntityId: string;
  readonly timestampIso: string;
  readonly prevAuditHash: string;
  readonly currentAuditHash: string;
}

export function appendCryptographicAuditRecord(
  chain: ReadonlyArray<CryptographicAuditRecord>,
  entry: Omit<CryptographicAuditRecord, 'prevAuditHash' | 'currentAuditHash'>
): ReadonlyArray<CryptographicAuditRecord> {
  const prevAuditHash =
    chain.length === 0
      ? computeSha256Hex('0TO8848_GENESIS_AUDIT_BLOCK_V1_1')
      : chain[chain.length - 1].currentAuditHash;

  const canonicalPayload = [
    prevAuditHash,
    entry.auditId,
    entry.actorUserId,
    entry.actorRole,
    entry.departmentId,
    entry.action,
    entry.targetEntityId,
    entry.timestampIso,
  ].join('|');

  const currentAuditHash = computeSha256Hex(canonicalPayload);

  return [
    ...chain,
    {
      ...entry,
      prevAuditHash,
      currentAuditHash,
    },
  ];
}

export function verifyCryptographicAuditChain(
  chain: ReadonlyArray<CryptographicAuditRecord>
): boolean {
  for (let i = 0; i < chain.length; i++) {
    const rec = chain[i];
    const expectedPrev =
      i === 0
        ? computeSha256Hex('0TO8848_GENESIS_AUDIT_BLOCK_V1_1')
        : chain[i - 1].currentAuditHash;
    if (rec.prevAuditHash !== expectedPrev) {
      return false;
    }
    const expectedCurrent = computeSha256Hex(
      [
        rec.prevAuditHash,
        rec.auditId,
        rec.actorUserId,
        rec.actorRole,
        rec.departmentId,
        rec.action,
        rec.targetEntityId,
        rec.timestampIso,
      ].join('|')
    );
    if (rec.currentAuditHash !== expectedCurrent) {
      return false;
    }
  }
  return true;
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
// BUG-05: RUNTIME BUSINESS INDEPENDENCE FIREWALL & INDEPENDENT APPEALS GUARD
// ============================================================================

const FORBIDDEN_COMMERCIAL_KEYS: ReadonlyArray<string> = [
  'sponsorId',
  'sponsorCampaignId',
  'subscriptionTier',
  'paidMemberStatus',
  'lifetimeSpendUsd',
  'marketplaceBookingId',
  'priorityQueuePaid',
];

export function sanitizeCaseForReviewerFirewall(
  rawPayload: Record<string, unknown> & ReviewerCaseViewDTO
): {
  readonly sanitizedDto: ReviewerCaseViewDTO;
  readonly strippedCommercialFieldsCount: number;
} {
  const clone: Record<string, unknown> = { ...rawPayload };
  let strippedCommercialFieldsCount = 0;

  for (const key of FORBIDDEN_COMMERCIAL_KEYS) {
    if (key in clone) {
      delete clone[key];
      strippedCommercialFieldsCount += 1;
    }
  }

  return {
    sanitizedDto: clone as unknown as ReviewerCaseViewDTO,
    strippedCommercialFieldsCount,
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
// ============================================================================

export function enforceConstitutionalEndpointGate(requestPath: string): {
  readonly blocked: boolean;
  readonly httpStatus: 200 | 403;
  readonly errorCode:
    | null
    | 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION'
    | 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION';
} {
  const normalized = requestPath.trim().toLowerCase();
  if (
    normalized.startsWith('/api/v1/payments') &&
    CONSTITUTIONAL_LOCKS.PAYMENTS_ENABLED === false
  ) {
    return {
      blocked: true,
      httpStatus: 403,
      errorCode: 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION',
    };
  }
  if (
    normalized.startsWith('/api/v1/blockchain') &&
    CONSTITUTIONAL_LOCKS.BLOCKCHAIN_ENABLED === false
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
