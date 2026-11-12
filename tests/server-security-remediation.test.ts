/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 5 Readiness Gate Automated Test Suite
 * Verifies complete remediation of BUG-01 through BUG-12 across:
 * 1. Core security & verification engines (securityAndVerificationCore.ts)
 * 2. Persistent relational database operations on disk (FileBackedRelationalRepository.ts)
 * 3. Live Express HTTP /api/v1/* backend endpoints (server.ts & apiRouter.ts)
 * 4. CI Lockfile parity (package-lock.json + npm ci, no bun.lock)
 * 5. Complete documentation & Phase/Gate status reconciliation
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AddressInfo } from 'node:net';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createAppServer } from '../server.ts';
import { FileBackedRelationalRepository } from '../src/adapters/FileBackedRelationalRepository.ts';
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

  it('BUG-04: Enforces FIPS 180-4 SHA-256 Cryptographic Audit Hash Chaining & Zero-IP Whistleblower Vault', () => {
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

    const tamperedChain = [
      { ...fullChain[0], action: 'TAMPERED_ACTION' },
      fullChain[1],
    ];
    assert.equal(verifyCryptographicAuditChain(tamperedChain), false);

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

  it('BUG-07, BUG-08, BUG-09, BUG-10, BUG-12: Verifies 100 Runtime Destinations, Lockfile/CI Parity, Date/Credential Validators & Doc Parity', () => {
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

    // Lockfile & CI Workflow Parity Check
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
    const ciWorkflow = fs.readFileSync(
      path.resolve(process.cwd(), '.github/workflows/ci-security-gate.yml'),
      'utf8'
    );
    assert.ok(ciWorkflow.includes('run: npm ci'), 'CI workflow must use deterministic npm ci');
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

    const masterPlanDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/01_MASTER_PLAN.md'),
      'utf8'
    );
    assert.ok(masterPlanDoc.includes('80 Numbered Schema Groups / 86 Physical Tables'));
    assert.ok(masterPlanDoc.includes('GATE 04 AWAITING FOUNDER APPROVAL'));

    const reqDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/02_REQUIREMENTS.md'),
      'utf8'
    );
    assert.ok(reqDoc.includes('80 Schema Groups / 86 Physical Tables'));

    const acceptanceDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/23_PHASE_ACCEPTANCE.md'),
      'utf8'
    );
    assert.ok(acceptanceDoc.includes('AWAITING FOUNDER APPROVAL (NOT AUTOMATICALLY ACCEPTED)'));
    assert.ok(acceptanceDoc.includes('Phase 05 Status:** `NOT STARTED'));
  });

  it('BACKEND-DB-E2E: Proves Security & Verification Logic is Connected to Real Express /api/v1/* Endpoints & Persistent Disk Database', async () => {
    const testDbPath = path.resolve(
      process.cwd(),
      'data',
      `test_e2e_${process.pid}_${Date.now()}.json`
    );

    try {
      const { app } = await createAppServer(testDbPath);
      const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
      });
      const port = (server.address() as AddressInfo).port;
      const baseUrl = `http://127.0.0.1:${port}/api/v1`;

      try {
        // 1. GET /api/v1/health — Verify persistent DB creation, 100 destinations, 86 tables, and hash chains
        const healthRes = await fetch(`${baseUrl}/health`);
        assert.equal(healthRes.status, 200);
        const healthJson = (await healthRes.json()) as {
          ok: boolean;
          schemaCounts: {
            numberedSchemaGroups: number;
            physicalTables: number;
            rolesCount: number;
            categoriesCount: number;
            featuredDestinationsCount: number;
          };
          integrity: { auditChainIntact: boolean; credentialChainIntact: boolean };
        };
        assert.equal(healthJson.ok, true);
        assert.equal(healthJson.schemaCounts.numberedSchemaGroups, 80);
        assert.equal(healthJson.schemaCounts.physicalTables, 86);
        assert.equal(healthJson.schemaCounts.rolesCount, 21);
        assert.equal(healthJson.schemaCounts.categoriesCount, 24);
        assert.equal(healthJson.schemaCounts.featuredDestinationsCount, 100);
        assert.equal(healthJson.integrity.auditChainIntact, true);
        assert.equal(healthJson.integrity.credentialChainIntact, true);

        // 2. POST /api/v1/payments/checkout — Verify Constitutional HTTP 403 Gate + Persistent Audit Logging
        const payRes = await fetch(`${baseUrl}/payments/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountUsd: 99 }),
        });
        assert.equal(payRes.status, 403);
        const payJson = (await payRes.json()) as { errorCode: string };
        assert.equal(payJson.errorCode, 'PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION');

        // 3. POST /api/v1/verification/cases/CASE-2026-000201/claim — COI Block when commercial guide attempts claim
        const coiClaimRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/claim`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'USR-GUIDE-COMMERCIAL-99',
              role: PlatformRole.SENIOR_REVIEWER,
              mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
              organizationIds: [],
              qualifiedCategories: ['CAT-12'],
            }),
          }
        );
        assert.equal(coiClaimRes.status, 403);
        const coiClaimJson = (await coiClaimRes.json()) as {
          authorization: { errorCode: string };
        };
        assert.equal(
          coiClaimJson.authorization.errorCode,
          'COI_COMMERCIAL_BOOKING_CONFLICT'
        );

        // 4. POST /api/v1/verification/cases/CASE-2026-000201/claim — Valid Senior Reviewer Claim + Business Firewall Stripping
        const validClaimRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/claim`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'USR-SNR-PEMBA',
              role: PlatformRole.SENIOR_REVIEWER,
              mfaVerifiedAtIso: '2026-11-12T08:00:00Z',
              organizationIds: ['ORG-INDEPENDENT'],
            }),
          }
        );
        assert.equal(validClaimRes.status, 200);
        const validClaimJson = (await validClaimRes.json()) as {
          ok: boolean;
          strippedCommercialFieldsCount: number;
          sanitizedCase: Record<string, unknown>;
        };
        assert.equal(validClaimJson.ok, true);
        assert.equal(validClaimJson.strippedCommercialFieldsCount, 7);
        assert.equal('sponsorId' in validClaimJson.sanitizedCase, false);
        assert.equal('marketplaceBookingId' in validClaimJson.sanitizedCase, false);

        // 5. POST /api/v1/verification/cases/CASE-2026-000201/evidence — Block XXE GPX & Accept Valid GPX with 1.0km Mask
        const xxeEvRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evidence`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              evidenceId: 'EV-XXE-99',
              uploaderUserId: 'USR-ADV-DAWA-02',
              pillar: EvidencePillarId.PIL_02_GEOSPATIAL_TELEMETRY,
              fileType: 'GPX',
              rawContentString: '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><gpx/>',
            }),
          }
        );
        assert.equal(xxeEvRes.status, 400);

        const validEvRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evidence`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              evidenceId: 'EV-VALID-GPX-201',
              uploaderUserId: 'USR-ADV-DAWA-02',
              pillar: EvidencePillarId.PIL_02_GEOSPATIAL_TELEMETRY,
              fileType: 'GPX',
              rawContentString: '<gpx><trk><name>Kangchenjunga Approach</name></trk></gpx>',
              trackPoints: [
                { latitude: 27.5, longitude: 88.0, elevationMeters: 1800, distanceFromStartKm: 0.4 },
                { latitude: 27.6, longitude: 88.1, elevationMeters: 5200, distanceFromStartKm: 12.0 },
                { latitude: 27.5, longitude: 88.0, elevationMeters: 1805, distanceFromStartKm: 24.8 },
              ],
            }),
          }
        );
        assert.equal(validEvRes.status, 201);
        const validEvJson = (await validEvRes.json()) as {
          maskedTrackPointsCount: number;
          persistedRecord: { sha256Hex: string; residentialGeozoneMasked: boolean };
        };
        assert.equal(validEvJson.maskedTrackPointsCount, 1);
        assert.equal(validEvJson.persistedRecord.residentialGeozoneMasked, true);
        assert.match(validEvJson.persistedRecord.sha256Hex, /^[0-9a-f]{64}$/);

        // 6. POST /api/v1/verification/cases/CASE-2026-000201/evaluate — Block AI Final Approval (403), then Complete Dual-Senior + Heritage Guardian Approval & Persist New Credential
        const aiEvalRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evaluate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actorType: 'AI_ASSISTANT',
              actorUserId: 'AI-AGENT',
              actorRole: PlatformRole.REVIEWER,
              decision: 'APPROVE',
              pil01VisualScore: 35,
              pil02TelemetryScore: 0,
              pil03DocumentaryScore: 30,
              pil04WitnessScore: 30,
              pil05ChronologyScore: 20,
            }),
          }
        );
        assert.equal(aiEvalRes.status, 403);

        // First Senior Reviewer approves -> AWAITING_SECOND_SENIOR_REVIEWER
        const snr1Res = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evaluate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actorType: 'HUMAN_REVIEWER',
              actorUserId: 'USR-SNR-PEMBA',
              actorRole: PlatformRole.SENIOR_REVIEWER,
              decision: 'APPROVE',
              pil01VisualScore: 35,
              pil02TelemetryScore: 0,
              pil03DocumentaryScore: 30,
              pil04WitnessScore: 30,
              pil05ChronologyScore: 20,
            }),
          }
        );
        const snr1Json = (await snr1Res.json()) as { resultingStatus: string };
        assert.equal(
          snr1Json.resultingStatus,
          VerificationCaseStatus.AWAITING_SECOND_SENIOR_REVIEWER
        );

        // Second Senior Reviewer approves -> AWAITING_HERITAGE_GUARDIAN (since DEST-003 Kangchenjunga requires Heritage Guardian)
        const snr2Res = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evaluate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actorType: 'HUMAN_REVIEWER',
              actorUserId: 'USR-SNR-ELENA',
              actorRole: PlatformRole.SENIOR_REVIEWER,
              decision: 'APPROVE',
              pil01VisualScore: 35,
              pil02TelemetryScore: 0,
              pil03DocumentaryScore: 30,
              pil04WitnessScore: 30,
              pil05ChronologyScore: 20,
            }),
          }
        );
        const snr2Json = (await snr2Res.json()) as { resultingStatus: string };
        assert.equal(snr2Json.resultingStatus, VerificationCaseStatus.AWAITING_HERITAGE_GUARDIAN);

        // Heritage Guardian attests sacred summit protocol -> APPROVED + Free Credential Issued & Persisted!
        const hgRes = await fetch(
          `${baseUrl}/verification/cases/CASE-2026-000201/evaluate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actorType: 'HUMAN_REVIEWER',
              actorUserId: 'USR-HG-MINGMA',
              actorRole: PlatformRole.HERITAGE_GUARDIAN,
              decision: 'HERITAGE_ATTEST',
              pil01VisualScore: 35,
              pil02TelemetryScore: 0,
              pil03DocumentaryScore: 30,
              pil04WitnessScore: 30,
              pil05ChronologyScore: 20,
            }),
          }
        );
        const hgJson = (await hgRes.json()) as {
          resultingStatus: string;
          issuedCredential: { credentialId: string };
        };
        assert.equal(hgJson.resultingStatus, VerificationCaseStatus.APPROVED);
        assert.ok(hgJson.issuedCredential.credentialId.startsWith('0TO8848-CRED-2026-'));

        // 7. POST /api/v1/appeals/APL-2026-000012/decide — Block Original Reviewer (403) & Allow Independent Appeal Reviewer (200)
        const blockedAppealRes = await fetch(`${baseUrl}/appeals/APL-2026-000012/decide`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actorUserId: 'USR-SNR-PEMBA', // Excluded original reviewer!
            actorRole: PlatformRole.APPEAL_REVIEWER,
            decision: 'UPHELD_APPROVED',
            reasonedOutcome: 'Attempted self-override',
          }),
        });
        assert.equal(blockedAppealRes.status, 403);

        const validAppealRes = await fetch(`${baseUrl}/appeals/APL-2026-000012/decide`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actorUserId: 'USR-APPEAL-INDEP-01',
            actorRole: PlatformRole.APPEAL_REVIEWER,
            decision: 'UPHELD_APPROVED',
            reasonedOutcome: 'Verified DoT liaison officer summit certificate.',
          }),
        });
        assert.equal(validAppealRes.status, 200);

        // 8. POST & GET /api/v1/whistleblower/reports — Zero-IP Persistence & system_admin Isolation
        const wbPostRes = await fetch(`${baseUrl}/whistleblower/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportId: 'WB-E2E-001',
            oneTimeReceiptToken: 'SECRET-RECEIPT-TOKEN',
            category: 'SPONSOR_INTERFERENCE',
            encryptedNarrative: 'PGP-ENCRYPTED-REPORT',
          }),
        });
        assert.equal(wbPostRes.status, 201);

        const sysAdminWbGet = await fetch(`${baseUrl}/whistleblower/reports`, {
          headers: { 'x-actor-role': PlatformRole.SYSTEM_ADMIN },
        });
        assert.equal(sysAdminWbGet.status, 403);

        // 9. Instantiate a brand-new FileBackedRelationalRepository pointing to the same testDbPath to prove real disk persistence across process restarts!
        const freshRepoFromDisk = new FileBackedRelationalRepository(testDbPath);
        const persistedAudit = await freshRepoFromDisk.getCryptographicAuditLogs();
        assert.equal(persistedAudit.chainIntact, true);
        assert.ok(
          persistedAudit.logs.length >= 10,
          `Expected >= 10 persisted audit logs on disk, found ${persistedAudit.logs.length}`
        );

        const persistedCredChain = await freshRepoFromDisk.verifyRegistryHashChain();
        assert.equal(persistedCredChain.intact, true);
        assert.equal(persistedCredChain.verifiedCount, 2);
      } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
      }
    } finally {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    }
  });
});
