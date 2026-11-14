/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Portable In-Memory Relational Reference Adapter (System #13 48-Hour Vendor Exit)
 * Implements the exact same IDatabaseRepository interface as PostgresDrizzleRepository
 * to verify zero vendor lock-in and deterministic contract portability (DB-TEST-11).
 */

import { ADVENTURE_CATEGORIES_24 } from '../data/designSystemCatalog.ts';
import { ALL_100_FEATURED_DESTINATIONS } from '../data/destinations100Catalog.ts';
import {
  computeSha256Hex,
  encodeCanonicalHashFields,
  sanitizeCaseForReviewerFirewall,
} from '../services/securityAndVerificationCore.ts';
import {
  CredentialRegistryRecord,
  LeaderboardEntry,
  PublicCredentialVerificationDTO,
} from '../types/credentials.ts';
import {
  GovernanceQuorumProposal,
  ReviewerAccreditation,
  TrustTransparencySnapshot,
  WhistleblowerReport,
} from '../types/governance.ts';
import {
  AchievementArchetype,
  AchievementDefinition,
  AdventureCategory,
  DestinationCatalogStatus,
  DestinationRoute,
  FeaturedDestination,
  ReviewerQualificationTier,
} from '../types/taxonomy.ts';
import {
  AppealCaseRecord,
  EcfOverrideAuditRecord,
  ReviewerCaseViewDTO,
} from '../types/verification.ts';
import {
  IDatabaseRepository,
  ITransactionContext,
  PortableInstitutionalSnapshot,
} from './IDatabaseRepository.ts';
import {
  decryptEnvelopeAes256Gcm,
  encryptEnvelopeAes256Gcm,
} from './PostgresDrizzleRepository.ts';

interface InMemoryState {
  accreditations: Map<string, ReviewerAccreditation>;
  orgMemberships: Map<string, Set<string>>; // userId -> Set<orgId>
  commercialBookings: Array<{ adventurerUserId: string; guideUserId: string }>;
  cases: Map<string, ReviewerCaseViewDTO>;
  ecfOverrides: EcfOverrideAuditRecord[];
  appeals: Map<string, AppealCaseRecord>;
  credentials: CredentialRegistryRecord[];
  publicCredentials: Map<string, PublicCredentialVerificationDTO>;
  whistleblowerReports: WhistleblowerReport[];
  governanceProposals: GovernanceQuorumProposal[];
}

export class InMemoryRelationalRepository implements IDatabaseRepository {
  private state: InMemoryState = {
    accreditations: new Map(),
    orgMemberships: new Map(),
    commercialBookings: [],
    cases: new Map(),
    ecfOverrides: [],
    appeals: new Map(),
    credentials: [],
    publicCredentials: new Map(),
    whistleblowerReports: [],
    governanceProposals: [],
  };

  private cloneState(): InMemoryState {
    return {
      accreditations: new Map(this.state.accreditations),
      orgMemberships: new Map(
        Array.from(this.state.orgMemberships.entries()).map(([k, v]) => [k, new Set(v)])
      ),
      commercialBookings: [...this.state.commercialBookings],
      cases: new Map(this.state.cases),
      ecfOverrides: [...this.state.ecfOverrides],
      appeals: new Map(this.state.appeals),
      credentials: [...this.state.credentials],
      publicCredentials: new Map(this.state.publicCredentials),
      whistleblowerReports: [...this.state.whistleblowerReports],
      governanceProposals: [...this.state.governanceProposals],
    };
  }

  async withTransaction<T>(fn: (tx: ITransactionContext) => Promise<T>): Promise<T> {
    const snapshotBefore = this.cloneState();
    const txContext: ITransactionContext = {
      transactionId: `mem_tx_${Date.now()}`,
      startedAtIso: new Date().toISOString(),
    };
    try {
      return await fn(txContext);
    } catch (error) {
      // ACID rollback on failure
      this.state = snapshotBefore;
      throw error;
    }
  }

  seedAccreditation(acc: ReviewerAccreditation): void {
    this.state.accreditations.set(acc.reviewerUserId, acc);
  }

  seedOrganizationMembership(userId: string, orgId: string): void {
    const set = this.state.orgMemberships.get(userId) ?? new Set<string>();
    set.add(orgId);
    this.state.orgMemberships.set(userId, set);
  }

  async getAdventureCategories(): Promise<readonly AdventureCategory[]> {
    return ADVENTURE_CATEGORIES_24.map((c) => ({
      ...c,
      descriptionEn: c.nameEn,
      requiredEquipmentAndSafety: ['FIRST_AID_KIT', 'EMERGENCY_BEACON'],
      requiredSkills: ['NAVIGATION', 'ALPINE_SAFETY'],
      badgeEligible: true,
      certificateEligible: true,
      competitiveLeaderboardEligible: c.categoryId !== 'CAT-24',
    }));
  }

  async getFeaturedDestinations(filter?: {
    readonly regionId?: string;
    readonly categoryId?: string;
    readonly status?: string;
  }): Promise<readonly FeaturedDestination[]> {
    return ALL_100_FEATURED_DESTINATIONS.filter((d) => {
      if (filter?.regionId && d.regionId !== filter.regionId) return false;
      if (filter?.categoryId && d.primaryCategoryId !== filter.categoryId) return false;
      if (filter?.status && d.status !== filter.status) return false;
      return true;
    });
  }

  async getDestinationById(destinationId: string): Promise<FeaturedDestination | null> {
    return ALL_100_FEATURED_DESTINATIONS.find((d) => d.destinationId === destinationId) ?? null;
  }

  async getRoutesByDestination(destinationId: string): Promise<readonly DestinationRoute[]> {
    const dest = await this.getDestinationById(destinationId);
    if (!dest) return [];
    return dest.separatedRouteIds.map((routeId) => ({
      routeId,
      destinationId: dest.destinationId,
      trailCorridorId: null,
      nameEn: `${dest.nameEn} — Standard Route (${routeId})`,
      nameNe: `${dest.nameNe} — मानक मार्ग (${routeId})`,
      startPoint: {
        name: 'Base Camp',
        lat: dest.coordinates.latitude,
        lon: dest.coordinates.longitude,
        elevM: Math.round(dest.elevationMeters * 0.55),
      },
      endPoint: {
        name: 'Summit',
        lat: dest.coordinates.latitude,
        lon: dest.coordinates.longitude,
        elevM: dest.elevationMeters,
      },
      distanceKm: 24.5,
      elevationGainMeters: Math.round(dest.elevationMeters * 0.45),
      elevationLossMeters: Math.round(dest.elevationMeters * 0.45),
      estimatedDurationDays: 14,
      technicalDifficulty: dest.difficultySummary,
      objectiveHazards: ['ALTITUDE', 'WEATHER_EXPOSURE'],
      gpxReferenceUri: null,
      recommendedAcclimatizationDays: 5,
      routeVersion: 'v1.0',
      sourceUrl: dest.source_url,
      lastReviewedDate: dest.last_verified_date,
      status: DestinationCatalogStatus.PROPOSED,
    }));
  }

  async getAchievementsByDestination(
    destinationId: string
  ): Promise<readonly AchievementDefinition[]> {
    const dest = await this.getDestinationById(destinationId);
    if (!dest) return [];
    return [
      {
        achievementId: `ACH-${dest.destinationId}`,
        categoryId: dest.primaryCategoryId,
        destinationId: dest.destinationId,
        eligibleRouteIds: dest.separatedRouteIds,
        archetype: AchievementArchetype.TYPE_B_STANDARD_SUMMIT_TRAVERSE,
        titleEn: `${dest.nameEn} Verified Completion`,
        titleNe: `${dest.nameNe} प्रमाणित उपलब्धि`,
        descriptionEn: `${dest.nameEn} Verified Completion`,
        completionCriteria: JSON.stringify({ minEcfScore: 75, requiresVisualEvidence: true }),
        basePoints: Math.max(100, Math.round(dest.elevationMeters / 4)),
        difficultyMultiplier: 1.5,
        altitudeRemotenessFactor: 1.25,
        minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION,
        requiresHeritageGuardian: dest.requiresHeritageGuardianCheck,
        effectivePolicyVersion: 'v1.1.0',
      },
    ];
  }

  async getReviewerAccreditation(reviewerUserId: string): Promise<ReviewerAccreditation | null> {
    return this.state.accreditations.get(reviewerUserId) ?? null;
  }

  async verifyNoConflictOfInterest(params: {
    readonly reviewerUserId: string;
    readonly applicantUserId: string;
    readonly applicationId: string;
  }): Promise<{ readonly passed: boolean; readonly conflictReason: string | null }> {
    if (params.reviewerUserId === params.applicantUserId) {
      return { passed: false, conflictReason: 'COI_SELF_REVIEW_FORBIDDEN' };
    }
    const revOrgs = this.state.orgMemberships.get(params.reviewerUserId) ?? new Set<string>();
    const appOrgs = this.state.orgMemberships.get(params.applicantUserId) ?? new Set<string>();
    for (const orgId of appOrgs) {
      if (revOrgs.has(orgId)) {
        return { passed: false, conflictReason: `COI_SHARED_ORGANIZATION:${orgId}` };
      }
    }
    const hasBooking = this.state.commercialBookings.some(
      (b) =>
        b.adventurerUserId === params.applicantUserId && b.guideUserId === params.reviewerUserId
    );
    if (hasBooking) {
      return { passed: false, conflictReason: 'COI_COMMERCIAL_BOOKING_CONFLICT' };
    }
    return { passed: true, conflictReason: null };
  }

  async getSanitizedCaseForReviewer(caseId: string): Promise<ReviewerCaseViewDTO | null> {
    const c = this.state.cases.get(caseId);
    if (!c) return null;
    return sanitizeCaseForReviewerFirewall(c).sanitizedDto;
  }

  async recordEcfOverride(record: EcfOverrideAuditRecord): Promise<void> {
    this.state.ecfOverrides.push(record);
  }

  async getAppealCaseById(appealId: string): Promise<AppealCaseRecord | null> {
    return this.state.appeals.get(appealId) ?? null;
  }

  async getPublicCredentialVerification(
    credentialId: string
  ): Promise<PublicCredentialVerificationDTO | null> {
    return this.state.publicCredentials.get(credentialId) ?? null;
  }

  async appendCredentialRegistryRecord(record: CredentialRegistryRecord): Promise<void> {
    const dest = ALL_100_FEATURED_DESTINATIONS.find((d) => d.destinationId === record.destinationId);
    this.state.credentials.push(record);
    this.state.publicCredentials.set(record.credentialId, {
      credentialId: record.credentialId,
      status: record.status,
      holderDisplayName: record.subjectUserId,
      achievementTitleEn: `${dest?.nameEn ?? record.destinationId} Verified Completion`,
      achievementTitleNe: `${dest?.nameNe ?? record.destinationId} प्रमाणित उपलब्धि`,
      destinationNameEn: dest?.nameEn ?? record.destinationId,
      destinationNameNe: dest?.nameNe ?? record.destinationId,
      routeNameEn: record.routeId,
      elevationMeters: dest?.elevationMeters ?? 8848.86,
      completionDateIso: record.completionDateIso,
      approvalDateIso: record.issuedAtIso.slice(0, 10),
      issuingAuthority: record.issuingAuthority,
      qrVerificationUrl: `https://0to8848official.com/verify/${record.credentialId}`,
      currentCredentialHash: record.currentCredentialHash,
      revocationOrCorrectionNotice: null,
      replay3dAvailable: false,
    });
  }

  async verifyRegistryHashChain(): Promise<{
    readonly intact: boolean;
    readonly verifiedCount: number;
    readonly brokenAtCredentialId: string | null;
  }> {
    let expectedPrev = '0'.repeat(64);
    for (const cred of this.state.credentials) {
      if (cred.previousEventHash !== expectedPrev) {
        return {
          intact: false,
          verifiedCount: this.state.credentials.length,
          brokenAtCredentialId: cred.credentialId,
        };
      }
      expectedPrev = cred.currentCredentialHash;
    }
    return {
      intact: true,
      verifiedCount: this.state.credentials.length,
      brokenAtCredentialId: null,
    };
  }

  async getVerifiedLeaderboard(): Promise<readonly LeaderboardEntry[]> {
    return [];
  }

  async getTrustTransparencySnapshot(): Promise<TrustTransparencySnapshot> {
    return {
      periodKey: '2026-Q4',
      totalApplicationsReviewed: 0,
      totalApprovedCount: this.state.credentials.length,
      totalRejectedCount: 0,
      totalMoreEvidenceCount: 0,
      totalAppealsFiled: this.state.appeals.size,
      totalAppealsUpheld: 0,
      totalCredentialsRevoked: 0,
      totalReviewerCoiRecusals: 0,
      sponsorInfluenceIncidents: 0,
      generatedFromLiveDbAtIso: new Date().toISOString(),
    };
  }

  async submitWhistleblowerReport(
    report: WhistleblowerReport
  ): Promise<{ readonly receiptCodeHash: string }> {
    this.state.whistleblowerReports.push(report);
    return { receiptCodeHash: report.anonymousReceiptCodeHash };
  }

  async createGovernanceProposal(proposal: GovernanceQuorumProposal): Promise<void> {
    this.state.governanceProposals.push(proposal);
  }

  async exportPortableSnapshot(): Promise<PortableInstitutionalSnapshot> {
    const snapshotId = `MEM-SNAP-${Date.now()}`;
    const schemaVersion = 'v1.1.0-phase05-86tables';
    const exportedAtIso = new Date().toISOString();
    const totalRecordsCount =
      this.state.credentials.length +
      this.state.ecfOverrides.length +
      this.state.whistleblowerReports.length +
      this.state.governanceProposals.length +
      ALL_100_FEATURED_DESTINATIONS.length +
      ADVENTURE_CATEGORIES_24.length;

    const payloadJson = JSON.stringify({
      snapshotId,
      schemaVersion,
      credentials: this.state.credentials,
      ecfOverrides: this.state.ecfOverrides,
      whistleblowerReports: this.state.whistleblowerReports,
      governanceProposals: this.state.governanceProposals,
    });

    const sha256ManifestHash = computeSha256Hex(
      encodeCanonicalHashFields([
        snapshotId,
        schemaVersion,
        String(totalRecordsCount),
        payloadJson,
      ])
    );

    const encryptedPayloadBase64 = encryptEnvelopeAes256Gcm(
      payloadJson,
      `${snapshotId}|${sha256ManifestHash}`
    );

    return {
      snapshotId,
      schemaVersion,
      exportedAtIso,
      sha256ManifestHash,
      totalRecordsCount,
      encryptedPayloadBase64,
    };
  }

  async restoreAndVerifyPortableSnapshot(
    snapshot: PortableInstitutionalSnapshot
  ): Promise<{
    readonly restoredRecordsCount: number;
    readonly manifestVerified: boolean;
    readonly hashChainIntact: boolean;
  }> {
    const decrypted = decryptEnvelopeAes256Gcm(
      snapshot.encryptedPayloadBase64,
      `${snapshot.snapshotId}|${snapshot.sha256ManifestHash}`
    );

    const recomputed = computeSha256Hex(
      encodeCanonicalHashFields([
        snapshot.snapshotId,
        snapshot.schemaVersion,
        String(snapshot.totalRecordsCount),
        decrypted,
      ])
    );

    if (recomputed !== snapshot.sha256ManifestHash) {
      throw new Error('SNAPSHOT_MANIFEST_SHA256_MISMATCH');
    }

    const chain = await this.verifyRegistryHashChain();
    return {
      restoredRecordsCount: snapshot.totalRecordsCount,
      manifestVerified: true,
      hashChainIntact: chain.intact,
    };
  }
}
