/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Badges, Certificates, Hash-Chained Credential Registry,
 * W3C Portability & Verified Leaderboard Types
 */

export enum CredentialValidityStatus {
  VALID = 'VALID',
  REVOKED = 'REVOKED',
  SUSPENDED_INVESTIGATION = 'SUSPENDED_INVESTIGATION',
  CORRECTED = 'CORRECTED',
}

/**
 * Section 31: 100 Destination-Specific 3D Metallic Badge Design Specification
 */
export interface DestinationBadgeSpec {
  readonly badgeId: string;
  readonly destinationId: string;
  readonly achievementId: string;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly primaryPalette: {
    readonly obsidianBlack: '#0A0A0A';
    readonly metallicGold: '#C9A86A';
    readonly highlightGold: '#FFD700';
    readonly summitWhite: '#FFFFFF';
  };
  readonly elevationLabelMeters: number;
  readonly shieldMotif: 'MOUNTAIN_SHIELD_3D';
  readonly isFreeStandard: true; // Constitutional invariant: Standard badges are always free
  readonly isTransferable: false; // Constitutional invariant: Non-transferable
}

/**
 * System #3: Authoritative Hash-Chained Credential Integrity Registry Entry
 */
export interface CredentialRegistryRecord {
  readonly credentialId: string; // e.g., 0TO8848-CRED-2026-000108
  readonly subjectUserId: string; // Immutable owner
  readonly applicationId: string;
  readonly verificationCaseId: string;
  readonly achievementId: string;
  readonly destinationId: string;
  readonly routeId: string;
  readonly badgeId: string;
  readonly certificateId: string;
  readonly completionDateIso: string;
  readonly issuedAtIso: string;
  readonly issuingAuthority: '0 TO 8848 Independent Verification Department';
  readonly status: CredentialValidityStatus;
  readonly nonTransferable: true;
  readonly previousEventHash: string; // SHA-256 link to prior registry event
  readonly currentCredentialHash: string; // SHA-256 of canonical credential state
  readonly policyVersion: string;
}

/**
 * Section 33: Public Verification Portal DTO (Strictly Zero-PII & Zero Raw GPS)
 */
export interface ForbiddenPiiOnPublicCredential {
  readonly rawGpxUri?: never;
  readonly rawCoordinatesTrack?: never;
  readonly passportOrIdNumber?: never;
  readonly email?: never;
  readonly phone?: never;
  readonly homeAddress?: never;
}

export interface PublicCredentialVerificationDTO extends ForbiddenPiiOnPublicCredential {
  readonly credentialId: string;
  readonly status: CredentialValidityStatus;
  readonly holderDisplayName: string; // Respects user consent settings
  readonly achievementTitleEn: string;
  readonly achievementTitleNe: string;
  readonly destinationNameEn: string;
  readonly destinationNameNe: string;
  readonly routeNameEn: string;
  readonly elevationMeters: number;
  readonly completionDateIso: string;
  readonly approvalDateIso: string;
  readonly issuingAuthority: string;
  readonly qrVerificationUrl: string;
  readonly currentCredentialHash: string;
  readonly revocationOrCorrectionNotice: string | null;
  readonly replay3dAvailable: boolean; // NF-03 opt-in
}

/**
 * System #10: W3C Verifiable Credential JSON-LD Export Contract
 */
export interface W3cVerifiableCredentialExport {
  readonly '@context': readonly ['https://www.w3.org/2018/credentials/v1'];
  readonly id: string;
  readonly type: readonly ['VerifiableCredential', 'AdventureAchievementCredential'];
  readonly issuer: 'https://0to8848official.com';
  readonly issuanceDate: string;
  readonly credentialSubject: {
    readonly id: string;
    readonly achievementId: string;
    readonly destinationId: string;
    readonly routeId: string;
    readonly elevationMeters: number;
    readonly nonTransferable: true;
  };
  readonly proof: {
    readonly type: 'Ed25519Signature2020';
    readonly created: string;
    readonly verificationMethod: 'https://0to8848official.com/.well-known/did.json#key-1';
    readonly proofPurpose: 'assertionMethod';
    readonly proofValue: string;
  };
}

/**
 * Section 34: Leaderboard Snapshot Record
 * Strictly excludes unverified claims, Legends & Memorial entries, and commercial factors.
 */
export interface LeaderboardEntry {
  readonly rank: number;
  readonly userId: string;
  readonly displayName: string;
  readonly countryCode: string;
  readonly verifiedAchievementsCount: number;
  readonly highestElevationMeters: number;
  readonly totalDifficultyAdjustedPoints: number;
  readonly stewardshipBadgesCount: number; // Displayed with honor, adds 0 competitive points
  readonly algorithmVersion: string;
}
