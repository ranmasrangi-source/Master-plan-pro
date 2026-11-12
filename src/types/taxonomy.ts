/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Ontological Taxonomy Types (Amendments A2, A6, A7 & CHK-01.14–01.18)
 */

/**
 * Amendment A2: Exactly 6 Mutually Exclusive Macro-Domains (MD-01 to MD-06).
 * Every Adventure Category (CAT-01..CAT-24) maps to one and only one MacroDomainId.
 */
export enum MacroDomainId {
  MD_01_TERRESTRIAL_TRAILS = 'MD-01',
  MD_02_TECHNICAL_ROCK_BIG_WALL = 'MD-02',
  MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING = 'MD-03',
  MD_04_SNOW_ICE_GLACIER_WINTER = 'MD-04',
  MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN = 'MD-05',
  MD_06_INCLUSIVE_PARA_AND_ECOLOGICAL_STEWARDSHIP = 'MD-06',
}

/**
 * All 24 Adventure Categories (CAT-01 to CAT-24)
 */
export type AdventureCategoryId =
  | 'CAT-01'
  | 'CAT-02'
  | 'CAT-03'
  | 'CAT-04'
  | 'CAT-05'
  | 'CAT-06'
  | 'CAT-07'
  | 'CAT-08'
  | 'CAT-09'
  | 'CAT-10'
  | 'CAT-11'
  | 'CAT-12'
  | 'CAT-13'
  | 'CAT-14'
  | 'CAT-15'
  | 'CAT-16'
  | 'CAT-17'
  | 'CAT-18'
  | 'CAT-19'
  | 'CAT-20'
  | 'CAT-21'
  | 'CAT-22'
  | 'CAT-23'
  | 'CAT-24';

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export enum ReviewerQualificationTier {
  L1_TRAIL_STEWARDSHIP = 'L1',
  L2_TECHNICAL_HIGH_ALTITUDE = 'L2',
  L3_SENIOR_ALPINE_EXPEDITION = 'L3',
  DUAL_L3_SENIOR_EXPEDITION = 'DUAL_L3',
  DUAL_L4_SOVEREIGN_8000M_POLAR = 'DUAL_L4',
}

export interface AdventureCategory {
  readonly categoryId: AdventureCategoryId;
  readonly macroDomainId: MacroDomainId; // Bijective 1:N mapping (Amendment A2)
  readonly nameEn: string;
  readonly nameNe: string; // Nepali Devanagari (CHK-01.15)
  readonly descriptionEn: string;
  readonly difficultyScale: string;
  readonly riskLevel: RiskLevel;
  readonly requiredEquipmentAndSafety: readonly string[];
  readonly requiredSkills: readonly string[];
  readonly minReviewerTier: ReviewerQualificationTier;
  readonly minEcfScoreThreshold: number; // Always >= 75
  readonly badgeEligible: boolean;
  readonly certificateEligible: boolean;
  readonly competitiveLeaderboardEligible: boolean; // false for CAT-24 Civic Stewardship
}

/**
 * Amendment A7 Ontological Separation:
 * Region -> Destination -> Sub-Feature/Waypoint -> Trail/Corridor -> Route -> Achievement
 */
export enum DestinationEntityType {
  MOUNTAIN_MASSIF = 'MOUNTAIN_MASSIF',
  ALPINE_PEAK = 'ALPINE_PEAK',
  TREKKING_PEAK = 'TREKKING_PEAK',
  VOLCANO = 'VOLCANO',
  CORRIDOR_TRAIL = 'CORRIDOR_TRAIL',
  CANYON_SYSTEM = 'CANYON_SYSTEM',
  POLAR_PLATEAU = 'POLAR_PLATEAU',
}

/**
 * Amendment A6: Data-Hygiene Enums
 */
export enum AuthoritativeSourceType {
  GOVT_SURVEY_MINISTRY = 'GOVT_SURVEY_MINISTRY',
  NATIONAL_PARK_AUTHORITY = 'NATIONAL_PARK_AUTHORITY',
  OFFICIAL_ALPINE_FEDERATION = 'OFFICIAL_ALPINE_FEDERATION',
  ARCHIVAL_DATABASE = 'ARCHIVAL_DATABASE',
}

export enum DataConfidenceLevel {
  HIGH_AUTHORITATIVE = 'HIGH_AUTHORITATIVE',
  MEDIUM_SECONDARY = 'MEDIUM_SECONDARY',
  LOW_PENDING_FIELD_CHECK = 'LOW_PENDING_FIELD_CHECK',
}

export enum DestinationCatalogStatus {
  PROPOSED = 'PROPOSED',
  VERIFIED = 'VERIFIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * CHK-01.14: Geopolitical Sensitivity Flag
 */
export enum GeopoliticalSensitivityFlag {
  NONE = 'NONE',
  TRANSBOUNDARY_DUAL_JURISDICTION = 'TRANSBOUNDARY_DUAL_JURISDICTION',
  RESTRICTED_BORDER_PERMIT = 'RESTRICTED_BORDER_PERMIT',
  DISPUTED_OR_MILITARY_NOC_ZONE = 'DISPUTED_OR_MILITARY_NOC_ZONE',
}

/**
 * CHK-01.17: Emergency Contact & Rescue Protocol per Destination
 */
export interface EmergencyRescueProtocol {
  readonly primarySarAgency: string;
  readonly emergencyPhoneNumbers: readonly string[];
  readonly nearestTraumaOrHyperbaricCenter: string;
  readonly helicopterEvacuationCeilingMeters: number | null;
  readonly mandatoryInsuranceMinimumUsd: number;
  readonly nonRescuePlatformDisclaimer: true; // Constitutional safety requirement (Section 62)
}

/**
 * CHK-01.18: Seasonal Risk Rating per Month
 */
export enum MonthlyRiskRating {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXTREME_CLOSURE = 'EXTREME_CLOSURE',
}

export interface SeasonalRiskMatrix {
  readonly jan: MonthlyRiskRating;
  readonly feb: MonthlyRiskRating;
  readonly mar: MonthlyRiskRating;
  readonly apr: MonthlyRiskRating;
  readonly may: MonthlyRiskRating;
  readonly jun: MonthlyRiskRating;
  readonly jul: MonthlyRiskRating;
  readonly aug: MonthlyRiskRating;
  readonly sep: MonthlyRiskRating;
  readonly oct: MonthlyRiskRating;
  readonly nov: MonthlyRiskRating;
  readonly dec: MonthlyRiskRating;
  readonly seasonalSummaryNotes: string;
}

/**
 * Complete Featured Destination Record (35 Core Attributes + A6 Data Hygiene + CHK-01.14..01.18)
 */
export interface FeaturedDestination {
  readonly destinationId: string; // DEST-001 .. DEST-100
  readonly regionId: string; // REG-*
  readonly entityType: DestinationEntityType;
  readonly nameEn: string;
  readonly nameNe: string; // नेपाली Devanagari (CHK-01.15)
  readonly indigenousOrAltNames: readonly string[];
  readonly countryCodes: readonly string[];
  readonly jurisdictionDisplay: string;
  readonly coordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };
  readonly elevationMeters: number;
  readonly primaryCategoryId: AdventureCategoryId;
  readonly difficultySummary: string;
  readonly permitRequirements: string;
  readonly environmentalRestrictions: string;
  readonly culturalConsiderations: string;
  readonly requiresHeritageGuardianCheck: boolean; // NF-01
  readonly separatedRouteIds: readonly string[]; // RTE-*
  readonly associatedBadgeId: string;
  // Amendment A6 Mandatory Data-Hygiene Columns:
  readonly source_url: string;
  readonly source_type: AuthoritativeSourceType;
  readonly last_verified_date: string; // ISO-8601 YYYY-MM-DD
  readonly confidence: DataConfidenceLevel;
  readonly unverified_fields: readonly string[];
  // CHK-01.14, CHK-01.17, CHK-01.18:
  readonly geopoliticalFlag: GeopoliticalSensitivityFlag;
  readonly emergencyRescueProtocol: EmergencyRescueProtocol;
  readonly seasonalRiskMatrix: SeasonalRiskMatrix;
  // Initialized to PROPOSED per Directive V1.1 §5 & FQ-04:
  readonly status: DestinationCatalogStatus;
}

/**
 * Separated Route Record (Section 17 & Amendment A7)
 */
export interface DestinationRoute {
  readonly routeId: string; // RTE-*
  readonly destinationId: string; // DEST-*
  readonly trailCorridorId: string | null; // TRL-*
  readonly nameEn: string;
  readonly nameNe: string;
  readonly startPoint: { readonly name: string; readonly lat: number; readonly lon: number; readonly elevM: number };
  readonly endPoint: { readonly name: string; readonly lat: number; readonly lon: number; readonly elevM: number };
  readonly distanceKm: number;
  readonly elevationGainMeters: number;
  readonly elevationLossMeters: number;
  readonly estimatedDurationDays: number;
  readonly technicalDifficulty: string;
  readonly objectiveHazards: readonly string[];
  readonly gpxReferenceUri: string | null;
  readonly recommendedAcclimatizationDays: number; // NF-04
  readonly routeVersion: string;
  readonly sourceUrl: string;
  readonly lastReviewedDate: string;
  readonly status: DestinationCatalogStatus;
}

/**
 * Multi-Archetype Achievement Definition (Section 13 & Directive 3.5)
 */
export enum AchievementArchetype {
  TYPE_A_APPROACH_BASE_CAMP = 'TYPE_A',
  TYPE_B_STANDARD_SUMMIT_TRAVERSE = 'TYPE_B',
  TYPE_C_TECHNICAL_ALTERNATIVE_ROUTE = 'TYPE_C',
  TYPE_D_PURE_STYLE_NO_O2_WINTER = 'TYPE_D',
  TYPE_E_FULL_ENCHAINMENT_LINKUP = 'TYPE_E',
  TYPE_F_HERITAGE_ENVIRONMENTAL_STEWARDSHIP = 'TYPE_F',
}

export interface AchievementDefinition {
  readonly achievementId: string; // ACH-*
  readonly categoryId: AdventureCategoryId;
  readonly destinationId: string | null;
  readonly eligibleRouteIds: readonly string[];
  readonly archetype: AchievementArchetype;
  readonly titleEn: string;
  readonly titleNe: string;
  readonly descriptionEn: string;
  readonly completionCriteria: string;
  readonly basePoints: number; // 0 for TYPE_F civic stewardship
  readonly difficultyMultiplier: number;
  readonly altitudeRemotenessFactor: number;
  readonly minReviewerTier: ReviewerQualificationTier;
  readonly requiresHeritageGuardian: boolean; // NF-01
  readonly effectivePolicyVersion: string;
}
