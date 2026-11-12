/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Guide Marketplace, Organizations, Federation API & Airgapped Sponsorship Types
 */

export enum GuideVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED_LICENSED = 'VERIFIED_LICENSED',
  SUSPENDED_SAFETY_HOLD = 'SUSPENDED_SAFETY_HOLD',
}

export interface GuideProfile {
  readonly guideId: string;
  readonly userId: string;
  readonly fullName: string;
  readonly licensingAuthority: 'NMA' | 'IFMGA_UIAGM' | 'DOT_NEPAL' | 'TANAPA' | 'KWS' | 'ASEGUIM' | 'OTHER';
  readonly licenseNumber: string;
  readonly verificationStatus: GuideVerificationStatus; // Never invented; defaults to UNVERIFIED
  readonly maxCertifiedAltitudeMeters: number;
  readonly languages: readonly string[];
  readonly serviceRegionIds: readonly string[];
  readonly insuranceVerified: boolean;
  readonly leaveNoTraceScoreAvg: number; // NF-05
}

export interface MarketplaceBookingRequest {
  readonly bookingRequestId: string;
  readonly listingId: string;
  readonly adventurerUserId: string;
  readonly guideId: string;
  readonly requestedStartDateIso: string;
  readonly requestedEndDateIso: string;
  readonly paymentCollectionLocked: true; // Section 58: Payments disabled at launch
  readonly status: 'INQUIRY_SUBMITTED' | 'ACCEPTED_BY_GUIDE' | 'CANCELLED' | 'DISPUTED';
}

export interface OrganizationAccount {
  readonly orgId: string;
  readonly legalName: string;
  readonly orgType:
    | 'GUIDE_COMPANY'
    | 'TOUR_OPERATOR'
    | 'ALPINE_CLUB'
    | 'MOUNTAINEERING_FEDERATION'
    | 'DESTINATION_PARTNER'
    | 'NON_PROFIT';
  readonly countryCode: string;
  readonly legalIdentityVerified: boolean;
  readonly canSelfApproveMemberAchievements: false; // Section 22 & 16 constitutional lock
}

/**
 * System #9: Read-Only Federation Credential Verification Client
 */
export interface FederationApiClient {
  readonly clientId: string;
  readonly orgId: string;
  readonly allowedScopes: readonly ['credential:read']; // Strictly read-only
  readonly writeAccessAllowed: false;
  readonly status: 'ACTIVE' | 'REVOKED';
}

/**
 * Section 23 & System #12: Sponsorship & Advertising (Airgapped from Verification)
 */
export interface SponsorCampaign {
  readonly campaignId: string;
  readonly sponsorId: string;
  readonly sponsorLegalName: string;
  readonly campaignTitle: string;
  readonly mandatoryDisclosureLabel: 'SPONSORED'; // Non-removable disclosure
  readonly allowedPlacementZones: readonly ('PUBLIC_DESTINATION_SIDEBAR' | 'COMMUNITY_CHALLENGE_BANNER')[];
  readonly canAccessVerificationOrLeaderboardTables: false;
  readonly status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED';
}
