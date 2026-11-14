/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02 / Phase 05: Vendor-Independent Database Repository Interface (FQ-01 Option A & System #13)
 */

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
  AchievementDefinition,
  AdventureCategory,
  DestinationRoute,
  FeaturedDestination,
} from '../types/taxonomy.ts';
import {
  AppealCaseRecord,
  EcfOverrideAuditRecord,
  ReviewerCaseViewDTO,
} from '../types/verification.ts';

export interface ITransactionContext {
  readonly transactionId: string;
  readonly startedAtIso: string;
  readonly internalTxClient?: unknown;
}

export interface PortableInstitutionalSnapshot {
  readonly snapshotId: string;
  readonly schemaVersion: string;
  readonly exportedAtIso: string;
  readonly sha256ManifestHash: string;
  readonly totalRecordsCount: number;
  readonly encryptedPayloadBase64: string;
}

export interface EncryptedUserProfileInput {
  readonly userId: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly displayName: string;
  readonly fullNamePlaintext: string;
  readonly mfaSecretPlaintext?: string | null;
  readonly countryCode: string;
  readonly preferredLocale?: 'en' | 'ne' | 'ar';
  readonly residencyRegion: 'NP' | 'EU' | 'UAE' | 'GLOBAL';
}

export interface DecryptedUserProfileRecord {
  readonly userId: string;
  readonly email: string;
  readonly displayName: string;
  readonly fullNamePlaintext: string;
  readonly fullNameCiphertext: string;
  readonly mfaSecretPlaintext: string | null;
  readonly mfaSecretCiphertext: string | null;
  readonly countryCode: string;
  readonly preferredLocale: 'en' | 'ne' | 'ar';
  readonly residencyRegion: 'NP' | 'EU' | 'UAE' | 'GLOBAL';
  readonly privacyTier: 'TIER_4_REGULATED_PII';
}

/**
 * Vendor-neutral repository contract.
 * Domain services interact exclusively with IDatabaseRepository so the backing engine
 * (PostgreSQL + Drizzle ORM via node-postgres Pool, or InMemoryRelationalRepository)
 * can be swapped within 48 hours without changing domain service code.
 */
export interface IDatabaseRepository {
  /**
   * Executes a callback inside an ACID transaction.
   */
  withTransaction<T>(fn: (tx: ITransactionContext) => Promise<T>): Promise<T>;

  // Identity & Automatic TIER_4_REGULATED_PII Envelope Encryption Boundary (BUG-05)
  upsertUserWithEncryptedProfilePii(
    input: EncryptedUserProfileInput,
    tx?: ITransactionContext
  ): Promise<{
    readonly userId: string;
    readonly fullNameCiphertext: string;
    readonly mfaSecretCiphertext: string | null;
    readonly residencyRegion: 'NP' | 'EU' | 'UAE' | 'GLOBAL';
  }>;
  getUserWithDecryptedProfilePii(userId: string): Promise<DecryptedUserProfileRecord | null>;

  // Taxonomy & 100 Destinations
  getAdventureCategories(): Promise<readonly AdventureCategory[]>;
  getFeaturedDestinations(filter?: {
    readonly regionId?: string;
    readonly categoryId?: string;
    readonly status?: string;
  }): Promise<readonly FeaturedDestination[]>;
  getDestinationById(destinationId: string): Promise<FeaturedDestination | null>;
  getRoutesByDestination(destinationId: string): Promise<readonly DestinationRoute[]>;
  getAchievementsByDestination(destinationId: string): Promise<readonly AchievementDefinition[]>;

  // Verification & COI Checks (Airgapped via ReviewerCaseViewDTO)
  getReviewerAccreditation(reviewerUserId: string): Promise<ReviewerAccreditation | null>;
  verifyNoConflictOfInterest(params: {
    readonly reviewerUserId: string;
    readonly applicantUserId: string;
    readonly applicationId: string;
  }): Promise<{ readonly passed: boolean; readonly conflictReason: string | null }>;
  getSanitizedCaseForReviewer(caseId: string): Promise<ReviewerCaseViewDTO | null>;
  recordEcfOverride(record: EcfOverrideAuditRecord, tx?: ITransactionContext): Promise<void>;

  // Independent Appeals
  getAppealCaseById(appealId: string): Promise<AppealCaseRecord | null>;

  // Credential Integrity Registry & Public Portal
  getPublicCredentialVerification(
    credentialId: string
  ): Promise<PublicCredentialVerificationDTO | null>;
  appendCredentialRegistryRecord(
    record: CredentialRegistryRecord,
    tx: ITransactionContext
  ): Promise<void>;
  verifyRegistryHashChain(): Promise<{
    readonly intact: boolean;
    readonly verifiedCount: number;
    readonly brokenAtCredentialId: string | null;
  }>;

  // Leaderboards & Transparency
  getVerifiedLeaderboard(params: {
    readonly scope: 'GLOBAL' | 'COUNTRY' | 'CATEGORY' | 'DESTINATION';
    readonly scopeKey?: string;
    readonly limit?: number;
  }): Promise<readonly LeaderboardEntry[]>;
  getTrustTransparencySnapshot(): Promise<TrustTransparencySnapshot>;

  // Governance, Whistleblower & DR Portability
  submitWhistleblowerReport(
    report: WhistleblowerReport
  ): Promise<{ readonly receiptCodeHash: string }>;
  createGovernanceProposal(proposal: GovernanceQuorumProposal): Promise<void>;
  exportPortableSnapshot(): Promise<PortableInstitutionalSnapshot>;
  restoreAndVerifyPortableSnapshot(snapshot: PortableInstitutionalSnapshot): Promise<{
    readonly restoredRecordsCount: number;
    readonly manifestVerified: boolean;
    readonly hashChainIntact: boolean;
  }>;
}
