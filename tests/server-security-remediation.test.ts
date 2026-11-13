/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 5 Readiness Gate & Post-CI Audit Remediation Test Suite
 * Verifies complete remediation of BUG-01 through BUG-12 and AUD-03 through AUD-06
 * within the approved Phase 01–04 scope across:
 * 1. Core security & verification engines (securityAndVerificationCore.ts)
 * 2. Phase 02 vendor-independent adapter interfaces (IDatabaseRepository.ts, etc.)
 * 3. CI Lockfile parity & dependency vulnerability audit (package-lock.json + npm ci + npm audit)
 * 4. 100 Featured Destinations catalog parity & Phase/Gate status reconciliation
 * 5. AUD-03 (Credential Verification Portal), AUD-04 (Cryptographic Audit Chain),
 *    AUD-05 (Deep Allowlist Reviewer Firewall), and AUD-06 (CI Dependency Audit)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  CREDENTIAL_PREVIEW_GENESIS_HASH,
  lookupCredentialVerificationPortal,
  validateCredentialIdFormat,
} from '../src/components/credentials/OfficialCertificateView.tsx';
import { ALL_100_FEATURED_DESTINATIONS } from '../src/data/destinations100Catalog.ts';
import { formatBikramSambatDate } from '../src/i18n/translations.ts';
import {
  GENESIS_AUDIT_BLOCK_HASH,
  PRIVILEGED_MFA_REQUIRED_ROLES,
  appendCryptographicAuditRecord,
  authorizeIndependentAppealDecision,
  authorizeReviewerClaimAndAction,
  computeCanonicalAuditRecordHash,
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
  verifyCryptographicAuditChainDetailed,
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

describe('0 TO 8848 — Phase 5 Readiness Gate & Post-CI Audit Remediation Suite (BUG-01..12 & AUD-03..06)', () => {
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

    const validGpx = sanitizeAndHashEvidenceUpload({
      evidenceId: 'EV-003',
      applicationId: 'APP-001',
      uploaderUserId: 'USR-ADV-01',
      pillar: EvidencePillarId.PIL_02_GEOSPATIAL_TELEMETRY,
      fileType: 'GPX',
      rawContentString: '<gpx version="1.1"><trk><name>Everest Ascent</name></trk></gpx>',
      trackPoints: [
        { latitude: 27.68, longitude: 86.73, elevationMeters: 2860, distanceFromStartKm: 0.2 },
        { latitude: 27.8, longitude: 86.71, elevationMeters: 3440, distanceFromStartKm: 5.0 },
        { latitude: 27.9881, longitude: 86.925, elevationMeters: 8848, distanceFromStartKm: 18.0 },
        { latitude: 27.6805, longitude: 86.7305, elevationMeters: 2865, distanceFromStartKm: 19.5 },
      ],
    });
    assert.equal(validGpx.accepted, true);
    assert.ok(validGpx.sha256Hex && /^[0-9a-f]{64}$/.test(validGpx.sha256Hex));
    assert.equal(validGpx.residentialGeozoneMasked, true);
    assert.equal(validGpx.maskedTrackPoints.length, 2);

    const westCeilingAt8000m = computeWestPhysiologicalAscentCeilingMPerHr(8000, 8.0);
    assert.ok(westCeilingAt8000m > 350 && westCeilingAt8000m < 550);

    const hammingDist = computePHashHammingDistance64('f8c492a17b3e60d5', 'f8c492a17b3e60d4');
    assert.equal(hammingDist, 1);

    const fraudCheck = evaluateScientificAntiFraud({
      investigationId: 'INV-2026-001',
      applicationId: 'APP-2026-001',
      demRmseMeters: 0.12,
      trackPointsCount: 600,
      observedAscentRateMPerHr: 950,
      elevationMeters: 8000,
      ascentDurationHours: 8.0,
      uploadedPHash64Hex: 'f8c492a17b3e60d5',
      historicalPHashes: [{ evidenceId: 'EV-HIST-01', pHash64Hex: 'f8c492a17b3e60d4' }],
      hasCircularWitnessCycle: true,
    });
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.HIGH_VISUAL_DUPLICATE_FLAG));
    assert.ok(fraudCheck.flags.includes(ForensicAnomalyFlag.RECIPROCAL_WITNESS_RING_FLAG));
  });

  it('BUG-04 & AUD-04: Enforces FIPS 180-4 SHA-256 Cryptographic Audit Hash Chaining (Genesis, Sequence, PrevHash, CurrentHash & Tamper Detection)', () => {
    assert.equal(
      computeSha256Hex('abc'),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    assert.ok(/^[0-9a-f]{64}$/.test(GENESIS_AUDIT_BLOCK_HASH));
    assert.equal(/^0+$/.test(GENESIS_AUDIT_BLOCK_HASH), false);

    // Negative check: empty chain must not validate
    const emptyCheck = verifyCryptographicAuditChainDetailed([]);
    assert.equal(emptyCheck.intact, false);
    assert.equal(emptyCheck.failureReason, 'EMPTY_CHAIN');

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
    const detailedValid = verifyCryptographicAuditChainDetailed(fullChain);
    assert.equal(detailedValid.intact, true);
    assert.equal(detailedValid.verifiedCount, 2);
    assert.equal(detailedValid.failureReason, null);

    // Negative check 1: Tamper with payload field (action)
    const tamperedPayloadChain = [
      { ...fullChain[0], action: 'TAMPERED_ACTION' },
      fullChain[1],
    ];
    const payloadCheck = verifyCryptographicAuditChainDetailed(tamperedPayloadChain);
    assert.equal(payloadCheck.intact, false);
    assert.equal(payloadCheck.failedAuditId, 'AUD-001');
    assert.equal(payloadCheck.failureReason, 'PAYLOAD_TAMPERED_HASH_MISMATCH');

    // Negative check 2: Tamper with genesis prevAuditHash
    const tamperedGenesisChain = [
      {
        ...fullChain[0],
        prevAuditHash: '0000000000000000000000000000000000000000000000000000000000000000',
      },
      fullChain[1],
    ];
    const genesisCheck = verifyCryptographicAuditChainDetailed(tamperedGenesisChain);
    assert.equal(genesisCheck.intact, false);
    assert.equal(genesisCheck.failedAuditId, 'AUD-001');
    assert.equal(genesisCheck.failureReason, 'GENESIS_HASH_MISMATCH');

    // Negative check 3: Sequence gap / reorder
    const tamperedSequenceChain = [
      fullChain[0],
      { ...fullChain[1], sequenceNumber: 99 },
    ];
    const seqCheck = verifyCryptographicAuditChainDetailed(tamperedSequenceChain);
    assert.equal(seqCheck.intact, false);
    assert.equal(seqCheck.failedAuditId, 'AUD-002');
    assert.equal(seqCheck.failureReason, 'SEQUENCE_GAP_OR_REORDER');

    // Negative check 4: Broken prevAuditHash link between record 0 and record 1
    const brokenPrevLinkChain = [
      fullChain[0],
      {
        ...fullChain[1],
        prevAuditHash: computeSha256Hex('FORGED_PREV_HASH'),
      },
    ];
    const linkCheck = verifyCryptographicAuditChainDetailed(brokenPrevLinkChain);
    assert.equal(linkCheck.intact, false);
    assert.equal(linkCheck.failedAuditId, 'AUD-002');
    assert.equal(linkCheck.failureReason, 'PREV_HASH_LINK_BROKEN');

    // Negative check 5: Duplicate auditId
    const duplicateIdRec = {
      ...fullChain[1],
      auditId: 'AUD-001',
    };
    const duplicateIdChain = [
      fullChain[0],
      {
        ...duplicateIdRec,
        currentAuditHash: computeCanonicalAuditRecordHash(duplicateIdRec),
      },
    ];
    const dupCheck = verifyCryptographicAuditChainDetailed(duplicateIdChain);
    assert.equal(dupCheck.intact, false);
    assert.equal(dupCheck.failedAuditId, 'AUD-001');
    assert.equal(dupCheck.failureReason, 'DUPLICATE_AUDIT_ID');

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

  it('BUG-05 & AUD-05: Enforces Deep Explicit Allowlist Projection on Reviewer Firewall (Top-Level + Nested Commercial Leakage Blocked)', () => {
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

    // Inject BOTH top-level commercial fields AND arbitrary nested sponsor/advertiser/VIP fields
    // inside evidenceFiles[0], ecfAssessment, and antiFraudReport to test AUD-05 deep allowlist projection.
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
      evidenceFiles: [
        {
          evidenceId: 'EV-777-01',
          applicationId: 'APP-2026-777',
          pillar: EvidencePillarId.PIL_01_VISUAL_MEDIA,
          fileType: 'PHOTO' as const,
          sha256Hash: computeSha256Hex('summit-photo-01'),
          perceptualHash64: 'f8c492a17b3e60d5',
          exifPresent: true,
          residentialGeozoneMasked: true,
          uploadedAt: '2026-05-20T10:00:00Z',
          nestedSponsorBannerUrl: 'https://sponsor.example/banner.png',
          advertiserAccountTier: 'PLATINUM_BRAND',
        },
      ],
      ecfAssessment: {
        ...ecf,
        vipFastTrackOverride: true,
        sponsorFundedExpeditionGrantUsd: 25000,
      },
      antiFraudReport: {
        ...antiFraud,
        commercialPartnerExemptionAttempt: 'BLOCKED',
      },
      status: VerificationCaseStatus.IN_REVIEW,
      policyVersion: 'v1.1.0',
      // Top-level commercial / sponsor / subscription fields (including novel keys not in old 7-key denylist)
      sponsorId: 'SPON-01',
      sponsorCampaignId: 'SPON-ALPINE-GEAR',
      subscriptionTier: 'PRO_CONVENIENCE',
      paidMemberStatus: true,
      lifetimeSpendUsd: 4500,
      marketplaceBookingId: 'BKG-991122',
      priorityQueuePaid: true,
      advertiserDealId: 'ADV-DEAL-2026-88',
      brandAmbassadorContract: { brand: 'ApexGear', annualRetainerUsd: 50000 },
    } as unknown as Record<string, unknown> & ReviewerCaseViewDTO;

    const firewallResult = sanitizeCaseForReviewerFirewall(rawDatabaseCaseRecord);
    assert.equal(firewallResult.sanitizedDto.caseId, 'CASE-2026-777');

    // 9 top-level non-allowlisted fields + nested commercial properties stripped by recursive allowlist projection = 16 stripped fields
    assert.equal(firewallResult.strippedCommercialFieldsCount, 16);
    assert.ok(firewallResult.strippedFieldPaths.includes('sponsorId'));
    assert.ok(firewallResult.strippedFieldPaths.includes('advertiserDealId'));
    assert.ok(firewallResult.strippedFieldPaths.includes('brandAmbassadorContract'));
    assert.ok(
      firewallResult.strippedFieldPaths.includes('evidenceFiles[0].nestedSponsorBannerUrl')
    );
    assert.ok(
      firewallResult.strippedFieldPaths.includes('evidenceFiles[0].advertiserAccountTier')
    );
    assert.ok(firewallResult.strippedFieldPaths.includes('ecfAssessment.vipFastTrackOverride'));
    assert.ok(
      firewallResult.strippedFieldPaths.includes('ecfAssessment.sponsorFundedExpeditionGrantUsd')
    );
    assert.ok(
      firewallResult.strippedFieldPaths.includes(
        'antiFraudReport.commercialPartnerExemptionAttempt'
      )
    );

    // Negative assertions: ensure zero commercial or unapproved keys exist at any nesting level
    assert.equal('sponsorId' in firewallResult.sanitizedDto, false);
    assert.equal('advertiserDealId' in firewallResult.sanitizedDto, false);
    assert.equal('brandAmbassadorContract' in firewallResult.sanitizedDto, false);
    assert.equal(
      'nestedSponsorBannerUrl' in
        (firewallResult.sanitizedDto.evidenceFiles[0] as unknown as Record<string, unknown>),
      false
    );
    assert.equal(
      'vipFastTrackOverride' in
        (firewallResult.sanitizedDto.ecfAssessment as unknown as Record<string, unknown>),
      false
    );
    assert.equal(
      'commercialPartnerExemptionAttempt' in
        (firewallResult.sanitizedDto.antiFraudReport as unknown as Record<string, unknown>),
      false
    );

    // Ensure returned projections are deeply frozen at runtime
    assert.equal(Object.isFrozen(firewallResult.sanitizedDto), true);
    assert.equal(Object.isFrozen(firewallResult.sanitizedDto.evidenceFiles), true);
    assert.equal(Object.isFrozen(firewallResult.sanitizedDto.evidenceFiles[0]), true);
    assert.equal(Object.isFrozen(firewallResult.sanitizedDto.ecfAssessment), true);
    assert.equal(Object.isFrozen(firewallResult.sanitizedDto.antiFraudReport), true);

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

    const validAppealPanel = authorizeIndependentAppealDecision({
      appealCase,
      actorUserId: 'USR-APPEAL-PANEL-09',
      actorRole: PlatformRole.APPEAL_REVIEWER,
    });
    assert.equal(validAppealPanel.allowed, true);
  });

  it('AUD-03: Credential Verification Portal rejects unknown Credential IDs with 404 NOT_FOUND and never returns fake VALID status', () => {
    // 1. Unknown credential ID matching valid format must return 404 NOT_FOUND and null record
    const unknownLookup = lookupCredentialVerificationPortal('0TO8848-CRED-2026-999999');
    assert.equal(unknownLookup.isFormatValid, true);
    assert.equal(unknownLookup.status, 'NOT_FOUND');
    assert.equal(unknownLookup.httpStatus, 404);
    assert.equal(unknownLookup.isRealAchievement, false);
    assert.equal(unknownLookup.record, null);

    // 2. Malformed credential ID must return 400 INVALID_FORMAT and null record
    const invalidLookup = lookupCredentialVerificationPortal('0TO8848-CRED-2026-DROP_TABLE');
    assert.equal(invalidLookup.isFormatValid, false);
    assert.equal(invalidLookup.status, 'INVALID_FORMAT');
    assert.equal(invalidLookup.httpStatus, 400);
    assert.equal(invalidLookup.isRealAchievement, false);
    assert.equal(invalidLookup.record, null);

    // 3. Phase 04 UI Design Spec Fixture (0TO8848-CRED-2026-000108) must explicitly report
    // DESIGN_PREVIEW_ONLY (never VALID), isRealAchievement: false, and carry a real canonical SHA-256 digest
    const previewFixture = lookupCredentialVerificationPortal('0TO8848-CRED-2026-000108');
    assert.equal(previewFixture.status, 'DESIGN_PREVIEW_ONLY');
    assert.equal(previewFixture.isRealAchievement, false);
    assert.ok(previewFixture.record !== null);
    assert.equal(previewFixture.record.isRealAchievement, false);
    assert.equal(
      previewFixture.record.statusLabel,
      'DESIGN PREVIEW ONLY · NOT AN ISSUED ACHIEVEMENT'
    );
    // Must not use SHA256("test") or SHA256("")
    assert.notEqual(
      previewFixture.record.currentCredentialHash,
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    );
    assert.notEqual(
      previewFixture.record.previousEventHash,
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    assert.equal(previewFixture.record.previousEventHash, CREDENTIAL_PREVIEW_GENESIS_HASH);
    assert.ok(/^[0-9a-f]{64}$/.test(previewFixture.record.currentCredentialHash));
  });

  it('BUG-06: Enforces Constitutional HTTP 403 Gate on Payment & Blockchain Endpoints (Including Alias Prefixes & Path Traversal)', () => {
    const paymentGate = enforceConstitutionalEndpointGate('/api/v1/payments/checkout');
    assert.equal(paymentGate.blocked, true);
    assert.equal(paymentGate.httpStatus, 403);
    assert.equal(paymentGate.errorCode, 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION');

    const billingAliasGate = enforceConstitutionalEndpointGate(
      '/api/v1/public/../billing/invoices?currency=USD'
    );
    assert.equal(billingAliasGate.blocked, true);
    assert.equal(billingAliasGate.httpStatus, 403);
    assert.equal(billingAliasGate.errorCode, 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION');

    const blockchainGate = enforceConstitutionalEndpointGate('/api/v1/blockchain/anchor');
    assert.equal(blockchainGate.blocked, true);
    assert.equal(blockchainGate.httpStatus, 403);
    assert.equal(blockchainGate.errorCode, 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION');

    const web3NftAliasGate = enforceConstitutionalEndpointGate('/api/v1/nft/mint-soulbound');
    assert.equal(web3NftAliasGate.blocked, true);
    assert.equal(web3NftAliasGate.httpStatus, 403);
    assert.equal(web3NftAliasGate.errorCode, 'BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION');

    const publicVerifyGate = enforceConstitutionalEndpointGate(
      '/api/v1/credentials/verify/0TO8848-CRED-2026-000108'
    );
    assert.equal(publicVerifyGate.blocked, false);
    assert.equal(publicVerifyGate.httpStatus, 200);
  });

  it('BUG-07, BUG-08, BUG-09, BUG-10, BUG-12, AUD-06 & AUD-10: Verifies 100 Runtime Destinations, Lockfile/CI Parity, Dependency Vulnerability Audit, Date/Credential Validators & Doc Parity', () => {
    assert.equal(ALL_100_FEATURED_DESTINATIONS.length, 100);
    assert.equal(ALL_100_FEATURED_DESTINATIONS[0].destinationId, 'DEST-001');
    assert.equal(ALL_100_FEATURED_DESTINATIONS[99].destinationId, 'DEST-100');
    for (let i = 0; i < 100; i++) {
      const expectedId = `DEST-${String(i + 1).padStart(3, '0')}`;
      const dest = ALL_100_FEATURED_DESTINATIONS[i];
      assert.equal(dest.destinationId, expectedId);
      assert.equal(dest.status, DestinationCatalogStatus.PROPOSED);
      assert.ok(dest.separatedRouteIds.length >= 1);
      assert.ok(dest.source_url.startsWith('https://'));
      assert.ok(dest.unverified_fields.length >= 3);
      assert.ok(
        dest.unverified_fields.includes('nearest_trauma_center_field_verification'),
        `${expectedId} must explicitly mark nearest_trauma_center_field_verification in unverified_fields`
      );
      assert.ok(
        dest.emergencyRescueProtocol.nearestTraumaOrHyperbaricCenter.includes('UNVERIFIED'),
        `${expectedId} trauma center field must carry explicit UNVERIFIED notice until Phase 09 field verification`
      );
      assert.equal(dest.emergencyRescueProtocol.nonRescuePlatformDisclaimer, true);
    }

    // Lockfile & CI Workflow Parity + AUD-06 Dependency Security Audit Check
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'package-lock.json')),
      true,
      'package-lock.json must exist for deterministic npm ci'
    );
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'bun.lock')),
      false,
      'Conflicting bun.lock must not exist'
    );
    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { scripts?: Record<string, string> };
    assert.equal(
      pkgJson.scripts?.['security:audit'],
      'npm audit --audit-level=low',
      'AUD-06: package.json must define strict npm audit script without error suppression'
    );

    const ciWorkflow = fs.readFileSync(
      path.resolve(process.cwd(), '.github/workflows/ci-security-gate.yml'),
      'utf8'
    );
    assert.ok(ciWorkflow.includes('run: npm ci'), 'CI workflow must use deterministic npm ci');
    assert.ok(
      ciWorkflow.includes('run: npm run security:audit'),
      'AUD-06: CI workflow must execute npm run security:audit without hiding failures'
    );
    assert.ok(
      ciWorkflow.includes("cache-dependency-path: 'package-lock.json'"),
      'CI workflow must reference package-lock.json'
    );

    // Date & Credential Validators
    assert.equal(formatBikramSambatDate('2026-02-30').isValidDate, false);
    assert.equal(formatBikramSambatDate('2026-13-01').isValidDate, false);
    assert.equal(formatBikramSambatDate('2026-01-15').isValidDate, true);
    assert.ok(formatBikramSambatDate('2026-01-15').bikramSambatEn.startsWith('2082-10-'));
    assert.equal(validateCredentialIdFormat('0TO8848-CRED-2026-000108').isValid, true);
    assert.equal(validateCredentialIdFormat('0TO8848-CRED-2026-DROP_TABLE').isValid, false);

    // Documentation consistency checks across all reconciled docs
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

    // Verify Phase 02 vendor-independent adapter interfaces exist while Phase 05+ backend implementation remains unstarted
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'src/adapters/IDatabaseRepository.ts')),
      true,
      'Phase 02 IDatabaseRepository interface contract must exist'
    );
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'src/adapters/IStorageProvider.ts')),
      true,
      'Phase 02 IStorageProvider interface contract must exist'
    );
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'src/adapters/IAiAssistantProvider.ts')),
      true,
      'Phase 02 IAiAssistantProvider interface contract must exist'
    );
    assert.equal(
      fs.existsSync(path.resolve(process.cwd(), 'server.ts')),
      false,
      'Phase 05+ backend server.ts must not be prematurely created during Phase 01-04'
    );
    assert.equal(
      fs.existsSync(
        path.resolve(process.cwd(), 'src/adapters/FileBackedRelationalRepository.ts')
      ),
      false,
      'Phase 05+ concrete database repository must not be prematurely created during Phase 01-04'
    );
  });
});
