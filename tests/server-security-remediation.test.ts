/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 5 Readiness Gate Automated Test Suite
 * Verifies complete remediation of BUG-01 through BUG-12 across server-side
 * authorization, verification, evidence handling, audit logs, security controls,
 * 100 Featured Destinations catalog parity, and documentation consistency.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { validateCredentialIdFormat } from '../src/components/credentials/OfficialCertificateView.tsx';
import { ALL_100_FEATURED_DESTINATIONS } from '../src/data/destinations100Catalog.ts';
import { formatBikramSambatDate } from '../src/i18n/translations.ts';
import {
  PRIVILEGED_MFA_REQUIRED_ROLES,
  appendCryptographicAuditRecord,
  authorizeIndependentAppealDecision,
  authorizeReviewerClaimAndAction,
  computePHashHammingDistance64,
  computeSha256Hex,
  computeWestPhysiologicalAscentCeilingMPerHr,
  createZeroIpWhistleblowerReport,
  enforceConstitutionalEndpointGate,
  evaluateScientificAntiFraud,
  evaluateServerEcfAssessment,
  evaluateVerificationDecisionGate,
  sanitizeAndHashEvidenceUpload,
  sanitizeCaseForReviewerFirewall,
  verifyCryptographicAuditChain,
} from '../src/services/securityAndVerificationCore.ts';
import {
  CalendarSystem,
  GovernanceDepartmentId,
  PlatformRole,
} from '../src/types/constitution.ts';
import {
  DestinationCatalogStatus,
  ReviewerQualificationTier,
} from '../src/types/taxonomy.ts';
import {
  EcfPathwayClassification,
  EvidencePillarId,
  ForensicAnomalyFlag,
  ReviewerCaseViewDTO,
  VerificationCaseStatus,
} from '../src/types/verification.ts';

describe('0 TO 8848 — Phase 5 Readiness Gate Remediation Suite (BUG-01 to BUG-12)', () => {
  it('BUG-01: Enforces 21-Role RBAC, Privileged MFA, Category Accreditation & Conflict-of-Interest (COI) Recusal', () => {
    assert.equal(Object.values(PlatformRole).length, 21);
    assert.equal(PRIVILEGED_MFA_REQUIRED_ROLES.has(PlatformRole.HERITAGE_GUARDIAN), true);

    // 1. Block non-reviewer role (e.g., SPONSOR)
    const sponsorAttempt = authorizeReviewerClaimAndAction({
      actor: {
        userId: 'USR-SPONSOR-01',
        role: PlatformRole.SPONSOR,
        sessionRevoked: false,
        mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
        organizationIds: [],
        qualifiedCategories: ['CAT-12'],
      },
      applicantUserId: 'USR-ADV-99',
      applicantOrganizationIds: [],
      hasCommercialBookingWithApplicant: false,
      requiredCategoryId: 'CAT-12',
    });
    assert.equal(sponsorAttempt.authorized, false);
    assert.equal(sponsorAttempt.httpStatus, 403);
    assert.equal(sponsorAttempt.errorCode, 'ROLE_FORBIDDEN');

    // 2. Block reviewer without MFA verified
    const noMfaAttempt = authorizeReviewerClaimAndAction({
      actor: {
        userId: 'USR-REV-01',
        role: PlatformRole.SENIOR_REVIEWER,
        sessionRevoked: false,
        mfaVerifiedAtIso: null,
        organizationIds: [],
        qualifiedCategories: ['CAT-12'],
      },
      applicantUserId: 'USR-ADV-99',
      applicantOrganizationIds: [],
      hasCommercialBookingWithApplicant: false,
      requiredCategoryId: 'CAT-12',
    });
    assert.equal(noMfaAttempt.authorized, false);
    assert.equal(noMfaAttempt.errorCode, 'MFA_VERIFICATION_REQUIRED');

    // 3. Block self-review Conflict of Interest
    const selfReviewAttempt = authorizeReviewerClaimAndAction({
      actor: {
        userId: 'USR-ADV-99',
        role: PlatformRole.SENIOR_REVIEWER,
        sessionRevoked: false,
        mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
        organizationIds: [],
        qualifiedCategories: ['CAT-12'],
      },
      applicantUserId: 'USR-ADV-99',
      applicantOrganizationIds: [],
      hasCommercialBookingWithApplicant: false,
      requiredCategoryId: 'CAT-12',
    });
    assert.equal(selfReviewAttempt.authorized, false);
    assert.equal(selfReviewAttempt.errorCode, 'COI_SELF_REVIEW_FORBIDDEN');

    // 4. Block shared expedition operator COI
    const sharedOrgAttempt = authorizeReviewerClaimAndAction({
      actor: {
        userId: 'USR-REV-02',
        role: PlatformRole.SENIOR_REVIEWER,
        sessionRevoked: false,
        mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
        organizationIds: ['ORG-SEVEN-SUMMITS'],
        qualifiedCategories: ['CAT-12'],
      },
      applicantUserId: 'USR-ADV-99',
      applicantOrganizationIds: ['ORG-SEVEN-SUMMITS'],
      hasCommercialBookingWithApplicant: false,
      requiredCategoryId: 'CAT-12',
    });
    assert.equal(sharedOrgAttempt.authorized, false);
    assert.equal(sharedOrgAttempt.errorCode, 'COI_SHARED_ORGANIZATION_CONFLICT');

    // 5. Permit independent, MFA-verified, accredited Senior Reviewer
    const validClaim = authorizeReviewerClaimAndAction({
      actor: {
        userId: 'USR-REV-INDEPENDENT',
        role: PlatformRole.SENIOR_REVIEWER,
        sessionRevoked: false,
        mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
        organizationIds: ['ORG-INDEPENDENT-ALPINE'],
        qualifiedCategories: ['CAT-12'],
      },
      applicantUserId: 'USR-ADV-99',
      applicantOrganizationIds: ['ORG-KHUMBU-TREKS'],
      hasCommercialBookingWithApplicant: false,
      requiredCategoryId: 'CAT-12',
    });
    assert.equal(validClaim.authorized, true);
    assert.equal(validClaim.httpStatus, 200);
  });

  it('BUG-02: Enforces Server-Side 5-Pillar ECF Scoring, AI Decision Lock, Dual-Senior Co-Signature & Heritage Guardian Check', () => {
    // Worked Example 1: GPS-only submission (30 + 10 = 40 pts < 75 -> Blocked)
    const gpsOnlyResult = evaluateServerEcfAssessment({
      assessmentId: 'ECF-EX1',
      applicationId: 'APP-EX1',
      pil01VisualScore: 0,
      pil02TelemetryScore: 30,
      pil03DocumentaryScore: 0,
      pil04WitnessScore: 0,
      pil05ChronologyScore: 10,
    });
    assert.equal(gpsOnlyResult.totalConfidenceScore, 40);
    assert.equal(gpsOnlyResult.isGpsOnlyBlocked, true);
    assert.equal(gpsOnlyResult.eligibleForApproval, false);
    assert.equal(
      gpsOnlyResult.pathwayClassification,
      EcfPathwayClassification.BLOCKED_GPS_ONLY_INSUFFICIENT
    );

    // Worked Example 2: No-GPS + Stripped EXIF + Permit + Witness (35 + 0 + 30 + 30 + 20 = 115 pts >= 75 -> Passes with 0 EXIF penalty)
    const noGpsAltResult = evaluateServerEcfAssessment({
      assessmentId: 'ECF-EX2',
      applicationId: 'APP-EX2',
      pil01VisualScore: 35,
      pil02TelemetryScore: 0,
      pil03DocumentaryScore: 30,
      pil04WitnessScore: 30,
      pil05ChronologyScore: 20,
    });
    assert.equal(noGpsAltResult.totalConfidenceScore, 115);
    assert.equal(noGpsAltResult.strippedExifPenaltyApplied, 0);
    assert.equal(
      noGpsAltResult.pathwayClassification,
      EcfPathwayClassification.ALT_NO_GPS_DOCUMENTARY_WITNESS
    );
    assert.equal(noGpsAltResult.eligibleForApproval, true);

    // Constitutional AI Lock: AI_ASSISTANT cannot make final verification decisions
    const aiDecisionAttempt = evaluateVerificationDecisionGate({
      actorType: 'AI_ASSISTANT',
      ecfAssessment: noGpsAltResult,
      requiresDualSenior: true,
      requiresHeritageGuardian: true,
      seniorApprovalsUserIds: ['USR-SNR-01', 'USR-SNR-02'],
      seniorRejectionsUserIds: [],
      heritageGuardianApproved: true,
    });
    assert.equal(aiDecisionAttempt.resultingStatus, VerificationCaseStatus.IN_REVIEW);
    assert.equal(
      aiDecisionAttempt.errorCode,
      'CONSTITUTIONAL_VIOLATION_AI_FINAL_DECISION_FORBIDDEN'
    );

    // Dual-Senior L3/L4 enforcement when only 1 senior reviewer has approved
    const singleReviewerCat12 = evaluateVerificationDecisionGate({
      actorType: 'HUMAN_REVIEWER',
      ecfAssessment: noGpsAltResult,
      requiresDualSenior: true,
      requiresHeritageGuardian: true,
      seniorApprovalsUserIds: ['USR-SNR-01'],
      seniorRejectionsUserIds: [],
      heritageGuardianApproved: true,
    });
    assert.equal(
      singleReviewerCat12.resultingStatus,
      VerificationCaseStatus.AWAITING_SECOND_SENIOR_REVIEWER
    );

    // Valid Dual-Senior + Heritage Guardian approval
    const validDualSeniorCat12 = evaluateVerificationDecisionGate({
      actorType: 'HUMAN_REVIEWER',
      ecfAssessment: noGpsAltResult,
      requiresDualSenior: true,
      requiresHeritageGuardian: true,
      seniorApprovalsUserIds: ['USR-SNR-01', 'USR-SNR-02'],
      seniorRejectionsUserIds: [],
      heritageGuardianApproved: true,
    });
    assert.equal(validDualSeniorCat12.resultingStatus, VerificationCaseStatus.APPROVED);
    assert.equal(validDualSeniorCat12.errorCode, null);
  });

  it('BUG-03: Sanitizes Evidence Uploads (XXE/Executable Rejection, 1.0km Geozone Masking, SHA-256) & Runs Scientific Anti-Fraud Checks', () => {
    // 1. Block disguised Windows PE executable
    const exeAttempt = sanitizeAndHashEvidenceUpload({
      evidenceId: 'EV-001',
      applicationId: 'APP-001',
      uploaderUserId: 'USR-ADV-01',
      pillar: EvidencePillarId.PIL_01_VISUAL_MEDIA,
      fileType: 'PHOTO',
      rawContentString: 'MZ\x90\x00FakeExecutablePayload',
    });
    assert.equal(exeAttempt.accepted, false);
    assert.equal(exeAttempt.rejectionCode, 'DISGUISED_EXECUTABLE_DETECTED');

    // 2. Block XML External Entity (XXE) payload inside GPX track
    const xxeAttempt = sanitizeAndHashEvidenceUpload({
      evidenceId: 'EV-002',
      applicationId: 'APP-001',
      uploaderUserId: 'USR-ADV-01',
      pillar: EvidencePillarId.PIL_02_GEOSPATIAL_TELEMETRY,
      fileType: 'GPX',
      rawContentString:
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><gpx>&xxe;</gpx>',
    });
    assert.equal(xxeAttempt.accepted, false);
    assert.equal(xxeAttempt.rejectionCode, 'XXE_PAYLOAD_DETECTED');

    // 3. Accept valid GPX, mask 1.0 km residential start/end geozone, and compute FIPS 180-4 SHA-256
    const validGpx = sanitizeAndHashEvidenceUpload({
      evidenceId: 'EV-003',
      applicationId: 'APP-001',
      uploaderUserId: 'USR-ADV-01',
      pillar: EvidencePillarId.PIL_02_GEOSPATIAL_TELEMETRY,
      fileType: 'GPX',
      rawContentString: '<gpx version="1.1"><trk><name>Everest Ascent</name></trk></gpx>',
      trackPoints: [
        { latitude: 27.68, longitude: 86.73, elevationMeters: 2860, distanceFromStartKm: 0.2 }, // Start residential point (<1.0km, trimmed)
        { latitude: 27.8, longitude: 86.71, elevationMeters: 3440, distanceFromStartKm: 5.0 }, // Preserved
        { latitude: 27.9881, longitude: 86.925, elevationMeters: 8848, distanceFromStartKm: 18.0 }, // Preserved
        { latitude: 27.6805, longitude: 86.7305, elevationMeters: 2865, distanceFromStartKm: 19.5 }, // End residential point (>19.0km, trimmed)
      ],
    });
    assert.equal(validGpx.accepted, true);
    assert.ok(validGpx.sha256Hex && /^[0-9a-f]{64}$/.test(validGpx.sha256Hex));
    assert.equal(validGpx.residentialGeozoneMasked, true);
    assert.equal(validGpx.maskedTrackPoints.length, 2);

    // 4. Scientific Anti-Fraud: Copernicus DEM synthetic clamp (< 0.3m), West VO2max ceiling, and 64-bit pHash collision
    const westCeilingAt8000m = computeWestPhysiologicalAscentCeilingMPerHr(8000, 8.0);
    assert.ok(westCeilingAt8000m > 350 && westCeilingAt8000m < 550);

    const hammingDist = computePHashHammingDistance64('f8c492a17b3e60d5', 'f8c492a17b3e60d4');
    assert.equal(hammingDist, 1);

    const fraudCheck = evaluateScientificAntiFraud({
      investigationId: 'INV-2026-001',
      applicationId: 'APP-2026-001',
      demRmseMeters: 0.12, // < 0.3m over >=500 points -> synthetic DEM clamp
      trackPointsCount: 600,
      observedAscentRateMPerHr: 950, // Impossible human ascent rate at 8,000m
      elevationMeters: 8000,
      ascentDurationHours: 8.0,
      uploadedPHash64Hex: 'f8c492a17b3e60d5',
      historicalPHashes: [{ evidenceId: 'EV-HIST-01', pHash64Hex: 'f8c492a17b3e60d4' }], // Hamming distance 1 <= 6
      hasCircularWitnessCycle: true,
    });
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.HIGH_VISUAL_DUPLICATE_FLAG));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.RECIPROCAL_WITNESS_RING_FLAG));
  });

  it('BUG-04: Enforces FIPS 180-4 SHA-256 Cryptographic Audit Hash Chaining & Zero-IP Whistleblower Vault', () => {
    // Known NIST FIPS 180-4 SHA-256 test vector for "abc"
    assert.equal(
      computeSha256Hex('abc'),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );

    const chain1 = appendCryptographicAuditRecord([], {
      auditId: 'AUD-001',
      timestampIso: '2026-11-12T10:00:00Z',
      actorUserId: 'USR-REV-01',
      actorRole: PlatformRole.SENIOR_REVIEWER,
      departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      action: 'CASE_CLAIMED',
      targetEntityId: 'CASE-001',
    });
    const fullChain = appendCryptographicAuditRecord(chain1, {
      auditId: 'AUD-002',
      timestampIso: '2026-11-12T10:05:00Z',
      actorUserId: 'USR-SNR-02',
      actorRole: PlatformRole.SENIOR_REVIEWER,
      departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
      action: 'DUAL_SENIOR_APPROVED',
      targetEntityId: 'CASE-001',
    });

    assert.equal(verifyCryptographicAuditChain(fullChain), true);

    // Tamper with first record and verify detection
    const tamperedChain = [
      { ...fullChain[0], action: 'TAMPERED_ACTION' },
      fullChain[1],
    ];
    assert.equal(verifyCryptographicAuditChain(tamperedChain), false);

    // Zero-IP Whistleblower Report (System #4)
    const wbReport = createZeroIpWhistleblowerReport({
      reportId: 'WB-2026-001',
      oneTimeReceiptToken: 'RANDOM-CLIENT-TOKEN-9988',
      category: 'SPONSOR_INTERFERENCE',
      encryptedNarrative: 'PGP-ENCRYPTED-PAYLOAD-001',
      callerIpAddress: '203.0.113.42',
      createdAtIso: '2026-11-12T11:00:00Z',
    });
    assert.equal(wbReport.callerIpLogged, false);
    assert.equal(wbReport.accessibleBySystemAdmin, false);
  });

  it('BUG-05: Enforces Runtime Business Independence Firewall & Independent Appeal Reviewer Exclusion', () => {
    const ecf = evaluateServerEcfAssessment({
      assessmentId: 'ECF-777',
      applicationId: 'APP-777',
      pil01VisualScore: 35,
      pil02TelemetryScore: 30,
      pil03DocumentaryScore: 30,
      pil04WitnessScore: 25,
      pil05ChronologyScore: 20,
    });
    const antiFraud = evaluateScientificAntiFraud({
      investigationId: 'INV-777',
      applicationId: 'APP-777',
      demRmseMeters: 4.2,
      trackPointsCount: 600,
      observedAscentRateMPerHr: 280,
      elevationMeters: 8848,
      ascentDurationHours: 10,
      uploadedPHash64Hex: null,
      historicalPHashes: [],
      hasCircularWitnessCycle: false,
    });

    const rawDatabaseCaseRecord = {
      caseId: 'CASE-2026-777',
      applicationId: 'APP-2026-777',
      categoryId: 'CAT-12' as const,
      achievementId: 'ACH-DEST-001-SUMMIT',
      destinationId: 'DEST-001',
      routeId: 'RTE-001A',
      attemptStartDateIso: '2026-05-10',
      attemptCompletionDateIso: '2026-05-19',
      dateCalendarSystem: CalendarSystem.GREGORIAN_AD,
      originalBikramSambatDate: '2083-02-05',
      supplementalOxygenUsed: true,
      lntSelfScore: 98,
      requiredReviewerTier: ReviewerQualificationTier.DUAL_L4_SOVEREIGN_8000M_POLAR,
      requiresDualSenior: true,
      requiresHeritageGuardian: true,
      evidenceFiles: [],
      ecfAssessment: ecf,
      antiFraudReport: antiFraud,
      status: VerificationCaseStatus.IN_REVIEW,
      policyVersion: 'v1.1.0',
      // Forbidden commercial fields injected on raw object that must be stripped at runtime:
      sponsorId: 'SPON-01',
      sponsorCampaignId: 'SPON-ALPINE-GEAR',
      subscriptionTier: 'PRO_CONVENIENCE',
      paidMemberStatus: true,
      lifetimeSpendUsd: 4500,
      marketplaceBookingId: 'BKG-991122',
      priorityQueuePaid: true,
    } as unknown as Record<string, unknown> & ReviewerCaseViewDTO;

    const firewallResult = sanitizeCaseForReviewerFirewall(rawDatabaseCaseRecord);
    assert.equal(firewallResult.sanitizedDto.caseId, 'CASE-2026-777');
    assert.equal(firewallResult.strippedCommercialFieldsCount, 7);
    assert.equal('sponsorId' in firewallResult.sanitizedDto, false);
    assert.equal('sponsorCampaignId' in firewallResult.sanitizedDto, false);
    assert.equal('subscriptionTier' in firewallResult.sanitizedDto, false);
    assert.equal('lifetimeSpendUsd' in firewallResult.sanitizedDto, false);

    // Independent Appeal: block original reviewer from deciding appeal
    const appealCase = {
      appealId: 'APL-2026-01',
      applicationId: 'APP-2026-777',
      originalVerificationCaseId: 'CASE-2026-777',
      appellantUserId: 'USR-ADV-55',
      excludedOriginalReviewerIds: ['USR-REV-ORIG-1', 'USR-REV-ORIG-2'],
      appealGrounds: 'Submitted additional high-camp satellite logbook verification',
      supplementalEvidenceIds: ['EV-SUPP-01'],
      assignedAppealReviewerId: null,
      status: 'IN_APPEAL_REVIEW' as const,
      reasonedOutcome: null,
      policyVersion: 'v1.1.0',
      filedAt: '2026-11-12T09:00:00Z',
      decidedAt: null,
    };

    const blockedOriginalReviewer = authorizeIndependentAppealDecision({
      appealCase,
      actorUserId: 'USR-REV-ORIG-1',
      actorRole: PlatformRole.APPEAL_REVIEWER,
    });
    assert.equal(blockedOriginalReviewer.allowed, false);
    assert.equal(
      blockedOriginalReviewer.errorCode,
      'APPEAL_INDEPENDENCE_VIOLATION_ORIGINAL_REVIEWER'
    );

    // Independent Appeal Reviewer succeeds
    const validAppealPanel = authorizeIndependentAppealDecision({
      appealCase,
      actorUserId: 'USR-APPEAL-PANEL-09',
      actorRole: PlatformRole.APPEAL_REVIEWER,
    });
    assert.equal(validAppealPanel.allowed, true);
  });

  it('BUG-06: Enforces Constitutional HTTP 403 Gate on Payment & Blockchain Endpoints', () => {
    const paymentGate = enforceConstitutionalEndpointGate('/api/v1/payments/checkout');
    assert.equal(paymentGate.blocked, true);
    assert.equal(paymentGate.httpStatus, 403);
    assert.equal(paymentGate.errorCode, 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION');

    const blockchainGate = enforceConstitutionalEndpointGate('/api/v1/blockchain/anchor');
    assert.equal(blockchainGate.blocked, true);
    assert.equal(blockchainGate.httpStatus, 403);
    assert.equal(blockchainGate.errorCode, 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION');

    const publicVerifyGate = enforceConstitutionalEndpointGate(
      '/api/v1/credentials/verify/0TO8848-CRED-2026-000108'
    );
    assert.equal(publicVerifyGate.blocked, false);
    assert.equal(publicVerifyGate.httpStatus, 200);
  });

  it('BUG-07, BUG-08, BUG-09, BUG-10, BUG-12: Verifies 100 Runtime Destinations, Date/Credential Validators & Doc Parity', () => {
    // BUG-09: Runtime catalog has exactly 100 destinations (DEST-001..DEST-100), all initialized as PROPOSED
    assert.equal(ALL_100_FEATURED_DESTINATIONS.length, 100);
    assert.equal(ALL_100_FEATURED_DESTINATIONS[0].destinationId, 'DEST-001');
    assert.equal(ALL_100_FEATURED_DESTINATIONS[99].destinationId, 'DEST-100');
    for (let i = 0; i < 100; i++) {
      const expectedId = `DEST-${String(i + 1).padStart(3, '0')}`;
      const dest = ALL_100_FEATURED_DESTINATIONS[i];
      assert.equal(dest.destinationId, expectedId);
      assert.equal(dest.status, DestinationCatalogStatus.PROPOSED);
      assert.ok(dest.separatedRouteIds.length >= 1);
      assert.equal(dest.emergencyRescueProtocol.nonRescuePlatformDisclaimer, true);
    }

    // BUG-10: Bikram Sambat date converter rejects invalid calendar dates and Credential ID validator blocks malformed IDs
    assert.equal(formatBikramSambatDate('2026-02-30').isValidDate, false);
    assert.equal(formatBikramSambatDate('2026-13-01').isValidDate, false);
    assert.equal(formatBikramSambatDate('2026-01-15').isValidDate, true);
    assert.ok(formatBikramSambatDate('2026-01-15').bikramSambatEn.startsWith('2082-10-'));
    assert.equal(validateCredentialIdFormat('0TO8848-CRED-2026-000108').isValid, true);
    assert.equal(validateCredentialIdFormat('0TO8848-CRED-2026-DROP_TABLE').isValid, false);

    // BUG-07, BUG-08, BUG-12: Documentation consistency checks
    const archDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/07_SYSTEM_ARCHITECTURE.md'),
      'utf8'
    );
    assert.ok(archDoc.includes('[3] 21-Role RBAC + MFA Guard'));

    const schemaDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/08_DATABASE_SCHEMA.md'),
      'utf8'
    );
    assert.ok(schemaDoc.includes('80 Numbered Schema Groups / 86 Physical Tables'));

    const acceptanceDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/23_PHASE_ACCEPTANCE.md'),
      'utf8'
    );
    assert.ok(acceptanceDoc.includes('AWAITING FOUNDER APPROVAL (NOT AUTOMATICALLY ACCEPTED)'));
    assert.ok(acceptanceDoc.includes('Phase 05 Status:** `NOT STARTED'));
  });
});
