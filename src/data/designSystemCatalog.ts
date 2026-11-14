/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: 42 Public Website Pages Registry, 6 Macro-Domains, 24 Categories & Featured Destinations
 */

import {
  AdventureCategory,
  AuthoritativeSourceType,
  DataConfidenceLevel,
  DestinationCatalogStatus,
  DestinationEntityType,
  FeaturedDestination,
  GeopoliticalSensitivityFlag,
  MacroDomainId,
  MonthlyRiskRating,
  ReviewerQualificationTier,
  RiskLevel,
} from '../types/taxonomy.ts';
import { ALL_100_FEATURED_DESTINATIONS } from './destinations100Catalog.ts';

export { ALL_100_FEATURED_DESTINATIONS };

export const GENERATED_BRAND_IMAGES = {
  everestHero: new URL(
    '../assets/images/everest_sagarmatha_hero_1794479895134.jpg',
    import.meta.url
  ).href,
  alpineRidge: new URL(
    '../assets/images/alpine_ridge_expedition_1794479897714.jpg',
    import.meta.url
  ).href,
  patagoniaSpires: new URL(
    '../assets/images/patagonia_granite_spires_1794479897456.jpg',
    import.meta.url
  ).href,
} as const;


export interface PublicPageSpec {
  readonly pageNumber: number; // 1..42 (Section 19)
  readonly slug: string;
  readonly titleEn: string;
  readonly titleNe: string;
  readonly sectionGroup:
    | 'INSTITUTIONAL_IDENTITY'
    | 'RECOGNITION_AND_CATALOGUES'
    | 'MARKETPLACE_AND_PARTNERS'
    | 'SAFETY_AND_COMMUNITY'
    | 'GOVERNANCE_LEGAL_PRIVACY';
  readonly summaryEn: string;
  readonly constitutionalRuleNote: string;
}

/**
 * All 42 Mandatory Public Website Pages (Master Plan Section 19.1 to 19.42)
 * Zero fake testimonials, zero fake statistics, zero unconfirmed partnerships.
 */
export const PUBLIC_WEBSITE_42_PAGES: ReadonlyArray<PublicPageSpec> = [
  { pageNumber: 1, slug: 'home', titleEn: 'Home', titleNe: 'गृहपृष्ठ', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Global Adventure Achievement Recognition Institution founded in Nepal for adventurers worldwide.', constitutionalRuleNote: 'Achievements must be earned, never bought.' },
  { pageNumber: 2, slug: 'about', titleEn: 'About 0 TO 8848', titleNe: 'हाम्रो बारेमा', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Institutional charter, 11-department hybrid governance, and strict separation of recognition from commerce.', constitutionalRuleNote: 'Hybrid Founder + Governance Committee oversight.' },
  { pageNumber: 3, slug: 'mission', titleEn: 'Our Mission', titleNe: 'हाम्रो लक्ष्य', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Recognize genuine adventure achievements through multi-pillar forensic evidence and independent human verification.', constitutionalRuleNote: 'Respects every genuine adventurer regardless of wealth or nationality.' },
  { pageNumber: 4, slug: 'vision', titleEn: 'Our Vision', titleNe: 'हाम्रो दृष्टिकोण', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Become the world’s most trusted global adventure achievement recognition institution.', constitutionalRuleNote: 'Built in Nepal. Made for the World.' },
  { pageNumber: 5, slug: 'our-story', titleEn: 'Our Story', titleNe: 'हाम्रो कथा', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'From sea level (0m) to the apex of Sagarmatha / Mount Everest (8,848.86m): why verifiable recognition matters.', constitutionalRuleNote: 'Origin: Nepal. Future International HQ Target: UAE.' },
  { pageNumber: 6, slug: 'how-it-works', titleEn: 'How It Works', titleNe: 'यो कसरी काम गर्छ', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: '16-step verification lifecycle from evidence ingestion and SHA-256 hashing to human review and free badge issuance.', constitutionalRuleNote: '5-Pillar Evidence Confidence Framework (ECF >= 75 pts).' },
  { pageNumber: 7, slug: 'adventure-categories', titleEn: 'Adventure Categories', titleNe: 'साहसिक विधाहरू', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: '6 mutually exclusive Macro-Domains (MD-01..06) and 24 Adventure Categories (CAT-01..24).', constitutionalRuleNote: 'Unsafe or unlawful stunts are permanently excluded.' },
  { pageNumber: 8, slug: 'achievement-catalogue', titleEn: 'Achievement Catalogue', titleNe: 'उपलब्धि सूची', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Multi-archetype achievements (TYPE-A Approach through TYPE-F Stewardship) and the 0-to-8848 Elevation Ladder.', constitutionalRuleNote: 'Separates Region, Destination, Trail, Route, and Achievement.' },
  { pageNumber: 9, slug: 'featured-destinations', titleEn: '100 Featured Destinations', titleNe: '१०० प्रमुख गन्तव्यहरू', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Source-backed directory of 100 global destinations across Asia, Europe, Americas, Africa, Oceania, and Polar zones.', constitutionalRuleNote: 'All 100 destinations initialized as PROPOSED until field-verified.' },
  { pageNumber: 10, slug: 'destination-explorer', titleEn: 'Destination Explorer', titleNe: 'गन्तव्य अन्वेषक', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Filter destinations by elevation, mountain range, permit requirement, seasonal risk, and geopolitical flag.', constitutionalRuleNote: 'Destination verification is separate from personal achievement verification.' },
  { pageNumber: 11, slug: 'route-explorer', titleEn: 'Route Explorer', titleNe: 'मार्ग अन्वेषक', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Independent technical climbing lines and trekking corridors with Copernicus GLO-30 DEM elevation profiles.', constitutionalRuleNote: 'Includes WCAG 2.2 AA accessible tabular route data.' },
  { pageNumber: 12, slug: 'challenges', titleEn: 'Approved Challenges', titleNe: 'चुनौतीहरू', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Seasonal elevation, distance, and stewardship challenges governed by safe acclimatization rules.', constitutionalRuleNote: 'Challenges never reward reckless speed or unsafe shortcuts.' },
  { pageNumber: 13, slug: 'achievement-verification', titleEn: 'Achievement Verification Standards', titleNe: 'प्रमाणीकरण मापदण्ड', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: '5-Pillar ECF scoring rules, GPS-free alternative pathways, Dual-Senior L3/L4 review, and Heritage Guardian protocol.', constitutionalRuleNote: 'GPS alone never approves; missing EXIF/GPS never auto-rejects.' },
  { pageNumber: 14, slug: 'public-credential-search', titleEn: 'Public Credential Search', titleNe: 'सार्वजनिक प्रमाणपत्र खोजी', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Verify any 0 TO 8848 badge or certificate instantly by Credential ID or QR code with zero PII leakage.', constitutionalRuleNote: 'Backed by the hash-chained Credential Integrity Registry.' },
  { pageNumber: 15, slug: 'leaderboards', titleEn: 'Global Leaderboards', titleNe: 'विश्वव्यापी वरियता', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Transparent difficulty-adjusted rankings across Global, Country, Category, and Destination scopes.', constitutionalRuleNote: 'Zero points from subscriptions, sponsors, or unverified claims.' },
  { pageNumber: 16, slug: 'adventurer-community', titleEn: 'Adventurer Community', titleNe: 'साहसी समुदाय', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Expedition reports, field condition updates (NF-02), and peer witness corroboration.', constitutionalRuleNote: 'Protected by anti-harassment and anti-doxxing moderation.' },
  { pageNumber: 17, slug: 'guides', titleEn: 'Professional Guides', titleNe: 'पेशेवर पथप्रदर्शकहरू', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Directory of mountain and wilderness guides with transparent NMA/IFMGA license verification status.', constitutionalRuleNote: 'Qualifications are never invented; unverified guides are clearly marked.' },
  { pageNumber: 18, slug: 'guide-companies', titleEn: 'Guide Companies', titleNe: 'गाइड कम्पनीहरू', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Registered expedition operators with safety protocols, client ratios, and Leave No Trace commitments.', constitutionalRuleNote: 'Commercial operators cannot auto-approve client achievements.' },
  { pageNumber: 19, slug: 'marketplace', titleEn: 'Adventure Marketplace', titleNe: 'साहसिक बजार', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Explore guided expeditions and submit booking inquiries (payment collection disabled at launch).', constitutionalRuleNote: 'Payment collection hard-locked (PAYMENTS_ENABLED = false).' },
  { pageNumber: 20, slug: 'organizations', titleEn: 'Clubs & Organizations', titleNe: 'संस्था र क्लबहरू', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Alpine clubs, mountaineering federations, universities, and read-only Federation API integrations.', constitutionalRuleNote: 'Organizations cannot self-verify their own members’ achievements.' },
  { pageNumber: 21, slug: 'destination-partners', titleEn: 'Destination Partners', titleNe: 'गन्तव्य साझेदारहरू', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'National parks, conservation authorities, and tourism boards contributing verified route & safety advisories.', constitutionalRuleNote: 'Partner confirmation updates destination metadata only, never personal badges.' },
  { pageNumber: 22, slug: 'sponsors', titleEn: 'Ethical Sponsors', titleNe: 'प्रायोजकहरू', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Clearly disclosed outdoor brands supporting community challenges and environmental clean-ups.', constitutionalRuleNote: 'Enforced by the compile-time Business Independence Firewall.' },
  { pageNumber: 23, slug: 'partnerships', titleEn: 'International Partnerships', titleNe: 'अन्तर्राष्ट्रिय साझेदारी', sectionGroup: 'MARKETPLACE_AND_PARTNERS', summaryEn: 'Framework for collaborating with rescue bodies, alpine federations, and environmental NGOs.', constitutionalRuleNote: 'Zero unconfirmed partnerships are ever displayed as active.' },
  { pageNumber: 24, slug: 'pricing', titleEn: 'Pricing & Free Recognition Guarantee', titleNe: 'मूल्य र निःशुल्क प्रमाणीकरण ग्यारेन्टी', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Core recognition, verification, standard 3D badges, QR certificates, and appeals are 100% Free Forever.', constitutionalRuleNote: 'Future optional convenience tools never affect verification priority.' },
  { pageNumber: 25, slug: 'safety', titleEn: 'Adventure Safety & Rescue Protocols', titleNe: 'सुरक्षा र उद्धार जानकारी', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Per-destination SAR contacts (CHK-01.17), Seasonal Risk Matrices (CHK-01.18), and Acclimatization Advisor (NF-04).', constitutionalRuleNote: '0 TO 8848 is NOT an emergency rescue dispatch service.' },
  { pageNumber: 26, slug: 'environmental-responsibility', titleEn: 'Environmental Responsibility & LNT', titleNe: 'वातावरणीय उत्तरदायित्व', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Leave No Trace scoring (NF-05), glacier waste pack-out verification, and CAT-24 Civic Stewardship Registry.', constitutionalRuleNote: 'Stewardship badges honor impact without inflating competitive rank.' },
  { pageNumber: 27, slug: 'educational-resources', titleEn: 'Educational Resources', titleNe: 'शैक्षिक सामग्री', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'High-altitude acclimatization principles, GPX telemetry integrity guides, and cultural respect protocols.', constitutionalRuleNote: 'Reviewed educational guidance, not medical diagnosis.' },
  { pageNumber: 28, slug: 'legends-and-memorial', titleEn: 'Legends & Memorial Archive', titleNe: 'किंवदन्ती र स्मृति अभिलेख', sectionGroup: 'RECOGNITION_AND_CATALOGUES', summaryEn: 'Dedicated historical recognition archive honoring mountaineering pioneers and fallen adventurers.', constitutionalRuleNote: 'Strictly separated from personal competitive leaderboards.' },
  { pageNumber: 29, slug: 'help-center', titleEn: 'Help Center', titleNe: 'सहायता केन्द्र', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Guides on submitting multi-pillar evidence, GPS-free alternative pathways, and exporting W3C credentials.', constitutionalRuleNote: 'Accessible on mobile and low-bandwidth connections.' },
  { pageNumber: 30, slug: 'faq', titleEn: 'Frequently Asked Questions', titleNe: 'प्रायः सोधिने प्रश्नहरू', sectionGroup: 'SAFETY_AND_COMMUNITY', summaryEn: 'Direct answers on missing EXIF/GPS handling, Dual-Senior review, appeals, and privacy controls.', constitutionalRuleNote: 'Transparent policy version citations on every answer.' },
  { pageNumber: 31, slug: 'contact', titleEn: 'Contact & Departmental Channels', titleNe: 'सम्पर्क', sectionGroup: 'INSTITUTIONAL_IDENTITY', summaryEn: 'Dedicated routing for Verification inquiries, Destination corrections, Media, and Governance.', constitutionalRuleNote: 'Independent departmental routing.' },
  { pageNumber: 32, slug: 'security-disclosure', titleEn: 'Security Disclosure & Whistleblower Vault', titleNe: 'सुरक्षा खुलासा र उजुरी कक्ष', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Vulnerability reporting SLA and anonymous Zero-IP Whistleblower submission channel (System #4).', constitutionalRuleNote: 'Whistleblower reports are isolated from system_admin access.' },
  { pageNumber: 33, slug: 'accessibility', titleEn: 'Accessibility Statement (WCAG 2.2 AA)', titleNe: 'पहुँचयोग्यता नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Keyboard navigation, screen-reader tabular map alternatives, high-contrast tokens, and reduced motion.', constitutionalRuleNote: 'Includes Base-Camp Low-Bandwidth Mode (<15 KB).' },
  { pageNumber: 34, slug: 'privacy-policy', titleEn: 'Privacy Policy', titleNe: 'गोपनीयता नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: '16-stage data lifecycle, 1.0 km residential GPX masking, and post-verification raw evidence deletion.', constitutionalRuleNote: 'Aligned with Nepal Privacy Act 2075, EU GDPR, and UAE PDPL.' },
  { pageNumber: 35, slug: 'terms-and-conditions', titleEn: 'Terms & Conditions', titleNe: 'नियम तथा शर्तहरू', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Platform usage terms, Assumption of Risk & Liability Waiver, and non-transferability of credentials.', constitutionalRuleNote: 'Fraudulent submissions are subject to revocation and audit logging.' },
  { pageNumber: 36, slug: 'cookie-policy', titleEn: 'Cookie & Zero-Ad-Tracker Policy', titleNe: 'कुकी नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Strictly essential session security cookies and cookie-free k-anonymity (k >= 5) operational metrics.', constitutionalRuleNote: 'Zero third-party behavioral ad trackers.' },
  { pageNumber: 37, slug: 'verification-policy', titleEn: 'Official Verification Policy', titleNe: 'आधिकारिक प्रमाणीकरण नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Complete technical and human verification standards (Version v1.1.0): ECF math, Copernicus DEM checks, West physiological ascent model, and Dual-Senior Reviewer rules.', constitutionalRuleNote: 'AI is assistive only and cannot make final verification decisions.' },
  { pageNumber: 38, slug: 'appeals-policy', titleEn: 'Independent Appeals Policy', titleNe: 'पुनरावेदन नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: '60-day appeal window, right to submit supplemental evidence, and mandatory exclusion of original reviewers.', constitutionalRuleNote: 'Original reviewer(s) can never control the final appeal outcome.' },
  { pageNumber: 39, slug: 'community-guidelines', titleEn: 'Community Conduct Guidelines', titleNe: 'सामुदायिक आचारसंहिता', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Standards against harassment, impersonation, doxxing, fake summit claims, and unsafe route encouragement.', constitutionalRuleNote: 'Enforced by DEPT-10 Community Moderation.' },
  { pageNumber: 40, slug: 'refund-and-cancellation-policy', titleEn: 'Refund & Cancellation Policy', titleNe: 'फिर्ता र रद्द गर्ने नीति', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Statutory refund rules prepared for future commercial activation (all payments currently disabled).', constitutionalRuleNote: 'Standard recognition is always $0.00.' },
  { pageNumber: 41, slug: 'legal-notices', titleEn: 'Legal Notices & IP Protection', titleNe: 'कानूनी सूचना', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: '0 TO 8848 trademark, badge shield design ownership, open-source compliance, and jurisdictional notices.', constitutionalRuleNote: 'Origin: Nepal · Target Future HQ: UAE.' },
  { pageNumber: 42, slug: 'data-protection-information', titleEn: 'Data Protection & Residency Portal', titleNe: 'डेटा सुरक्षा र भण्डारण जानकारी', sectionGroup: 'GOVERNANCE_LEGAL_PRIVACY', summaryEn: 'Self-service JSON data export, post-approval raw evidence purge, and Nepal sovereign residency tagging (CHK-01.16).', constitutionalRuleNote: '4-Tier Data Classification enforced.' },
];

/**
 * Representative Featured Destinations with full Amendment A6 Data-Hygiene,
 * CHK-01.14 Geopolitical Flags, CHK-01.17 SAR Protocols, and CHK-01.18 Seasonal Risk Ratings.
 */
export const FEATURED_DESTINATIONS_SHOWCASE: ReadonlyArray<FeaturedDestination> = [
  {
    destinationId: 'DEST-001',
    regionId: 'REG-MAHALANGUR',
    entityType: DestinationEntityType.MOUNTAIN_MASSIF,
    nameEn: 'Mount Everest / Sagarmatha',
    nameNe: 'सगरमाथा / चोमोलुङमा',
    indigenousOrAltNames: ['Sagarmatha', 'Chomolungma', 'Peak XV'],
    countryCodes: ['NP', 'CN'],
    jurisdictionDisplay: 'Nepal / China (Tibet Autonomous Region)',
    coordinates: { latitude: 27.9881, longitude: 86.925 },
    elevationMeters: 8848.86,
    primaryCategoryId: 'CAT-12',
    difficultySummary: 'Extreme Altitude Expedition (IFAS AD+ / 8,848.86m)',
    permitRequirements: 'Department of Tourism (DoT) Nepal Climbing Royalty Permit + Sagarmatha National Park + Khumbu Pasang Lhamu Rural Municipality Permit (or CTMA Permit for North Ridge)',
    environmentalRestrictions: 'Mandatory SPCC 8 kg waste deposit ($4,000 bond) + human waste pack-out bag mandate',
    culturalConsiderations: 'Sacred residence of Miyolangsangma / Sagarmatha; Puja ceremony respect mandatory before entering Khumbu Icefall',
    requiresHeritageGuardianCheck: true,
    separatedRouteIds: ['RTE-001A', 'RTE-001B', 'RTE-001C'],
    associatedBadgeId: 'BDG-DEST-001',
    source_url: 'https://nepalhimalpeakprofile.org',
    source_type: AuthoritativeSourceType.GOVT_SURVEY_MINISTRY,
    last_verified_date: '2026-11-12',
    confidence: DataConfidenceLevel.HIGH_AUTHORITATIVE,
    unverified_fields: ['annual_spcc_rope_fee_2027', 'tibet_north_side_foreign_quota'],
    geopoliticalFlag: GeopoliticalSensitivityFlag.TRANSBOUNDARY_DUAL_JURISDICTION,
    emergencyRescueProtocol: {
      primarySarAgency: 'Himalayan Rescue Association (HRA) Pheriche & Nepal Tourist Police (1144)',
      emergencyPhoneNumbers: ['+977-1-4440292', '1144', '100'],
      nearestTraumaOrHyperbaricCenter: 'HRA Pheriche Aid Post (4,240m) / Khunde Hospital / Kathmandu Grande International',
      helicopterEvacuationCeilingMeters: 6400,
      mandatoryInsuranceMinimumUsd: 100000,
      nonRescuePlatformDisclaimer: true,
    },
    seasonalRiskMatrix: {
      jan: MonthlyRiskRating.HIGH,
      feb: MonthlyRiskRating.HIGH,
      mar: MonthlyRiskRating.MEDIUM,
      apr: MonthlyRiskRating.MEDIUM,
      may: MonthlyRiskRating.LOW,
      jun: MonthlyRiskRating.HIGH,
      jul: MonthlyRiskRating.HIGH,
      aug: MonthlyRiskRating.HIGH,
      sep: MonthlyRiskRating.HIGH,
      oct: MonthlyRiskRating.MEDIUM,
      nov: MonthlyRiskRating.MEDIUM,
      dec: MonthlyRiskRating.HIGH,
      seasonalSummaryNotes: 'Primary summit window: Mid-May (Pre-Monsoon). Post-monsoon October window has high jet-stream winds.',
    },
    status: DestinationCatalogStatus.PROPOSED,
  },
  {
    destinationId: 'DEST-003',
    regionId: 'REG-KANGCHENJUNGA',
    entityType: DestinationEntityType.MOUNTAIN_MASSIF,
    nameEn: 'Kangchenjunga',
    nameNe: 'कञ्चनजङ्घा',
    indigenousOrAltNames: ['Sewalungma (Limbu)', 'Five Treasures of Snow'],
    countryCodes: ['NP', 'IN'],
    jurisdictionDisplay: 'Nepal / India (Sikkim Border)',
    coordinates: { latitude: 27.7025, longitude: 88.1475 },
    elevationMeters: 8586,
    primaryCategoryId: 'CAT-12',
    difficultySummary: 'Extreme Altitude Expedition (8,586m Remote Massif)',
    permitRequirements: 'DoT Nepal Expedition Permit + Kangchenjunga Conservation Area (KCA) Restricted Area Permit',
    environmentalRestrictions: 'Strict Leave No Trace glacier camp pack-out',
    culturalConsiderations: 'Sacred summit protocol (NF-01 Heritage Guardian): Climbers traditionally stop a few feet below the highest snow apex out of religious respect',
    requiresHeritageGuardianCheck: true,
    separatedRouteIds: ['RTE-003A', 'RTE-003B'],
    associatedBadgeId: 'BDG-DEST-003',
    source_url: 'https://nepalhimalpeakprofile.org',
    source_type: AuthoritativeSourceType.GOVT_SURVEY_MINISTRY,
    last_verified_date: '2026-11-12',
    confidence: DataConfidenceLevel.HIGH_AUTHORITATIVE,
    unverified_fields: ['kca_trail_bridge_washouts', 'sikkim_east_side_closure_decree'],
    geopoliticalFlag: GeopoliticalSensitivityFlag.TRANSBOUNDARY_DUAL_JURISDICTION,
    emergencyRescueProtocol: {
      primarySarAgency: 'Nepal Tourist Police & Long-Range Helicopter SAR Kathmandu',
      emergencyPhoneNumbers: ['1144', '+977-1-4247041'],
      nearestTraumaOrHyperbaricCenter: 'Taplejung District Hospital / Kathmandu Trauma Center',
      helicopterEvacuationCeilingMeters: 5800,
      mandatoryInsuranceMinimumUsd: 100000,
      nonRescuePlatformDisclaimer: true,
    },
    seasonalRiskMatrix: {
      jan: MonthlyRiskRating.HIGH,
      feb: MonthlyRiskRating.HIGH,
      mar: MonthlyRiskRating.MEDIUM,
      apr: MonthlyRiskRating.LOW,
      may: MonthlyRiskRating.LOW,
      jun: MonthlyRiskRating.HIGH,
      jul: MonthlyRiskRating.HIGH,
      aug: MonthlyRiskRating.HIGH,
      sep: MonthlyRiskRating.HIGH,
      oct: MonthlyRiskRating.LOW,
      nov: MonthlyRiskRating.MEDIUM,
      dec: MonthlyRiskRating.HIGH,
      seasonalSummaryNotes: 'Pre-monsoon (April–May) and Post-monsoon (October). Heavy eastern monsoon June–September.',
    },
    status: DestinationCatalogStatus.PROPOSED,
  },
  {
    destinationId: 'DEST-016',
    regionId: 'REG-MAHALANGUR',
    entityType: DestinationEntityType.TREKKING_PEAK,
    nameEn: 'Imja Tse / Island Peak',
    nameNe: 'इम्जा छ्यो / आइल्याण्ड पिक',
    indigenousOrAltNames: ['Imja Tse'],
    countryCodes: ['NP'],
    jurisdictionDisplay: 'Nepal (Solukhumbu)',
    coordinates: { latitude: 27.9225, longitude: 86.9361 },
    elevationMeters: 6165,
    primaryCategoryId: 'CAT-09',
    difficultySummary: 'Alpine PD+ (Glacier travel + 45°–55° headwall fixed rope)',
    permitRequirements: 'Nepal Mountaineering Association (NMA) Peak Permit + Sagarmatha National Park Entry',
    environmentalRestrictions: 'Camp waste removal to Chhukung / SPCC',
    culturalConsiderations: 'Respect Khumbu sacred valley mani walls and chortens',
    requiresHeritageGuardianCheck: false,
    separatedRouteIds: ['RTE-016A'],
    associatedBadgeId: 'BDG-DEST-016',
    source_url: 'https://nepalmountaineering.org',
    source_type: AuthoritativeSourceType.OFFICIAL_ALPINE_FEDERATION,
    last_verified_date: '2026-11-12',
    confidence: DataConfidenceLevel.HIGH_AUTHORITATIVE,
    unverified_fields: ['headwall_crevasse_ladder_count_2026'],
    geopoliticalFlag: GeopoliticalSensitivityFlag.NONE,
    emergencyRescueProtocol: {
      primarySarAgency: 'HRA Pheriche Aid Post & Lukla Helicopter SAR',
      emergencyPhoneNumbers: ['+977-1-4440292', '1144'],
      nearestTraumaOrHyperbaricCenter: 'HRA Pheriche Hyperbaric Chamber (4,240m)',
      helicopterEvacuationCeilingMeters: 5600,
      mandatoryInsuranceMinimumUsd: 50000,
      nonRescuePlatformDisclaimer: true,
    },
    seasonalRiskMatrix: {
      jan: MonthlyRiskRating.HIGH,
      feb: MonthlyRiskRating.HIGH,
      mar: MonthlyRiskRating.MEDIUM,
      apr: MonthlyRiskRating.LOW,
      may: MonthlyRiskRating.LOW,
      jun: MonthlyRiskRating.HIGH,
      jul: MonthlyRiskRating.HIGH,
      aug: MonthlyRiskRating.HIGH,
      sep: MonthlyRiskRating.MEDIUM,
      oct: MonthlyRiskRating.LOW,
      nov: MonthlyRiskRating.LOW,
      dec: MonthlyRiskRating.MEDIUM,
      seasonalSummaryNotes: 'Prime trekking peak windows in April–May and October–November.',
    },
    status: DestinationCatalogStatus.PROPOSED,
  },
  {
    destinationId: 'DEST-032',
    regionId: 'REG-ALPS-PENNINE',
    entityType: DestinationEntityType.ALPINE_PEAK,
    nameEn: 'Matterhorn / Monte Cervino',
    nameNe: 'म्याटरहर्न / मोन्ते सेर्भिनो',
    indigenousOrAltNames: ['Monte Cervino', 'Mont Cervin', 'Horu'],
    countryCodes: ['CH', 'IT'],
    jurisdictionDisplay: 'Switzerland (Valais) / Italy (Aosta Valley)',
    coordinates: { latitude: 45.9764, longitude: 7.6586 },
    elevationMeters: 4478,
    primaryCategoryId: 'CAT-10',
    difficultySummary: 'Alpine AD (UIAA III+ sustained exposed scrambling & mixed summit snow)',
    permitRequirements: 'Mandatory Hörnlihütte (CH) or Carrel Hut (IT) reservation; wild camping strictly prohibited by Zermatt municipality',
    environmentalRestrictions: 'Zero bivouac outside designated refuges',
    culturalConsiderations: 'High-consequence alpine rescue heritage; strict turnaround times enforced by guides',
    requiresHeritageGuardianCheck: false,
    separatedRouteIds: ['RTE-032A', 'RTE-032B', 'RTE-032C'],
    associatedBadgeId: 'BDG-DEST-032',
    source_url: 'https://www.sac-cas.ch',
    source_type: AuthoritativeSourceType.OFFICIAL_ALPINE_FEDERATION,
    last_verified_date: '2026-11-12',
    confidence: DataConfidenceLevel.HIGH_AUTHORITATIVE,
    unverified_fields: ['carrel_hut_renovation_reopening_date'],
    geopoliticalFlag: GeopoliticalSensitivityFlag.TRANSBOUNDARY_DUAL_JURISDICTION,
    emergencyRescueProtocol: {
      primarySarAgency: 'Air Zermatt (144) & Soccorso Alpino Valdostano (112)',
      emergencyPhoneNumbers: ['144', '112'],
      nearestTraumaOrHyperbaricCenter: 'Spital Visp / Hôpital du Valais Sion',
      helicopterEvacuationCeilingMeters: 4478,
      mandatoryInsuranceMinimumUsd: 50000,
      nonRescuePlatformDisclaimer: true,
    },
    seasonalRiskMatrix: {
      jan: MonthlyRiskRating.HIGH,
      feb: MonthlyRiskRating.HIGH,
      mar: MonthlyRiskRating.HIGH,
      apr: MonthlyRiskRating.HIGH,
      may: MonthlyRiskRating.HIGH,
      jun: MonthlyRiskRating.MEDIUM,
      jul: MonthlyRiskRating.LOW,
      aug: MonthlyRiskRating.LOW,
      sep: MonthlyRiskRating.LOW,
      oct: MonthlyRiskRating.MEDIUM,
      nov: MonthlyRiskRating.HIGH,
      dec: MonthlyRiskRating.HIGH,
      seasonalSummaryNotes: 'Primary dry rock window July–September; permafrost rockfall risk during extreme summer heatwaves.',
    },
    status: DestinationCatalogStatus.PROPOSED,
  },
  {
    destinationId: 'DEST-081',
    regionId: 'REG-PATAGONIA-SOUTH',
    entityType: DestinationEntityType.ALPINE_PEAK,
    nameEn: 'Monte Fitz Roy / Cerro Chaltén',
    nameNe: 'मोन्ते फिट्ज रोय / सेरो चाल्टेन',
    indigenousOrAltNames: ['Cerro Chaltén (Tehuelche: Smoking Mountain)'],
    countryCodes: ['AR', 'CL'],
    jurisdictionDisplay: 'Argentina (Santa Cruz) / Chile (Magallanes Border Sector)',
    coordinates: { latitude: -49.2714, longitude: -73.0433 },
    elevationMeters: 3405,
    primaryCategoryId: 'CAT-08',
    difficultySummary: 'Technical Alpine Big Wall (TD+ / ED, 6b+ A1 M4 Granite & Ice)',
    permitRequirements: 'APN Los Glaciares National Park Mandatory Free Climbing Registration at El Chaltén Ranger Station',
    environmentalRestrictions: 'Mandatory human waste tube pack-out on all technical camps (Paso Superior / Poincenot)',
    culturalConsiderations: 'Sacred Tehuelche peak; strict patagonian clean-climbing ethics',
    requiresHeritageGuardianCheck: false,
    separatedRouteIds: ['RTE-081A', 'RTE-081B', 'RTE-081C'],
    associatedBadgeId: 'BDG-DEST-081',
    source_url: 'https://www.argentina.gob.ar/parquesnacionales/losglaciares',
    source_type: AuthoritativeSourceType.NATIONAL_PARK_AUTHORITY,
    last_verified_date: '2026-11-12',
    confidence: DataConfidenceLevel.HIGH_AUTHORITATIVE,
    unverified_fields: ['apn_2026_digital_checkin_portal'],
    geopoliticalFlag: GeopoliticalSensitivityFlag.TRANSBOUNDARY_DUAL_JURISDICTION,
    emergencyRescueProtocol: {
      primarySarAgency: 'Comisión de Auxilio de El Chaltén & APN Rangers (Volunteer Ground Rescue — No High-Altitude Helicopter)',
      emergencyPhoneNumbers: ['+54-2962-493004', '103'],
      nearestTraumaOrHyperbaricCenter: 'Puesto Sanitario El Chaltén / Hospital SAMIC El Calafate',
      helicopterEvacuationCeilingMeters: null,
      mandatoryInsuranceMinimumUsd: 75000,
      nonRescuePlatformDisclaimer: true,
    },
    seasonalRiskMatrix: {
      jan: MonthlyRiskRating.LOW,
      feb: MonthlyRiskRating.LOW,
      mar: MonthlyRiskRating.MEDIUM,
      apr: MonthlyRiskRating.HIGH,
      may: MonthlyRiskRating.HIGH,
      jun: MonthlyRiskRating.HIGH,
      jul: MonthlyRiskRating.HIGH,
      aug: MonthlyRiskRating.HIGH,
      sep: MonthlyRiskRating.HIGH,
      oct: MonthlyRiskRating.MEDIUM,
      nov: MonthlyRiskRating.MEDIUM,
      dec: MonthlyRiskRating.LOW,
      seasonalSummaryNotes: 'Austral summer (December–February); notorious Patagonian barometric winds require strict weather window monitoring.',
    },
    status: DestinationCatalogStatus.PROPOSED,
  },
];

/**
 * Macro-Domains (MD-01 to MD-06) with exact bijective Category Partition (Amendment A2)
 */
export const MACRO_DOMAINS_SUMMARY: ReadonlyArray<{
  readonly domainId: MacroDomainId;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly categoryIds: readonly string[];
  readonly summary: string;
}> = [
  {
    domainId: MacroDomainId.MD_01_TERRESTRIAL_TRAILS,
    nameEn: 'Terrestrial Trails & Foot Trekking',
    nameNe: 'पदमार्ग र पैदल यात्रा',
    categoryIds: ['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04'],
    summary: 'Day hikes, multi-day backpacking, long-distance thru-hikes (>=200km), and non-technical high-altitude treks up to 5,800m.',
  },
  {
    domainId: MacroDomainId.MD_02_TECHNICAL_ROCK_BIG_WALL,
    nameEn: 'Technical Rock, Via Ferrata & Big Wall',
    nameNe: 'चट्टान आरोहण र भिया फेराटा',
    categoryIds: ['CAT-05', 'CAT-06', 'CAT-07', 'CAT-08'],
    summary: 'Alpine ridge scrambling, EN-958 Via Ferrata routes, multi-pitch traditional/sport climbing, and Grade V–VI big walls.',
  },
  {
    domainId: MacroDomainId.MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING,
    nameEn: 'Alpine & High-Altitude Mountaineering',
    nameNe: 'अल्पाइन र उच्च हिमाल आरोहण',
    categoryIds: ['CAT-09', 'CAT-10', 'CAT-11', 'CAT-12'],
    summary: 'Glaciated trekking peaks (5,000m–6,499m), classic alpine faces, 6,500m–7,999m expeditions, and the 14 Eight-Thousanders (8,000m+).',
  },
  {
    domainId: MacroDomainId.MD_04_SNOW_ICE_GLACIER_WINTER,
    nameEn: 'Snow, Ice, Glacier & Winter Touring',
    nameNe: 'बरफ, हिमनदी र शीतकालीन स्की',
    categoryIds: ['CAT-13', 'CAT-14', 'CAT-15'],
    summary: 'Waterfall ice and mixed alpine climbs (WI2–WI7 / M3–M12), glaciated high-pass crossings, and ski mountaineering.',
  },
  {
    domainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN,
    nameEn: 'Endurance, Overland, Remote & Subterranean',
    nameNe: 'अल्ट्रा दौड, मरुभूमि, ध्रुवीय र गुफा अभियान',
    categoryIds: ['CAT-16', 'CAT-17', 'CAT-18', 'CAT-19', 'CAT-20', 'CAT-21', 'CAT-22'],
    summary: 'Ultra-trail mountain runs, high-pass bikepacking, packraft wilderness traverses, arid desert crossings, polar ski expeditions, canyoneering, and speleology.',
  },
  {
    domainId: MacroDomainId.MD_06_INCLUSIVE_PARA_AND_ECOLOGICAL_STEWARDSHIP,
    nameEn: 'Inclusive Para-Adventure & Ecological Stewardship',
    nameNe: 'समावेशी पारा-साहस र वातावरणीय संरक्षण',
    categoryIds: ['CAT-23', 'CAT-24'],
    summary: 'Adaptive mountaineering completions and verified Leave No Trace / glacier clean-up stewardship campaigns.',
  },
];

export const ADVENTURE_CATEGORIES_24: ReadonlyArray<
  Pick<AdventureCategory, 'categoryId' | 'macroDomainId' | 'nameEn' | 'nameNe' | 'difficultyScale' | 'riskLevel' | 'minReviewerTier' | 'minEcfScoreThreshold'>
> = [
  { categoryId: 'CAT-01', macroDomainId: MacroDomainId.MD_01_TERRESTRIAL_TRAILS, nameEn: 'Day Hiking & Hill Walking', nameNe: 'एकदिने पदयात्रा', difficultyScale: 'SAC T1–T3', riskLevel: RiskLevel.LOW, minReviewerTier: ReviewerQualificationTier.L1_TRAIL_STEWARDSHIP, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-02', macroDomainId: MacroDomainId.MD_01_TERRESTRIAL_TRAILS, nameEn: 'Multi-Day Trekking & Backpacking', nameNe: 'बहुदिने पदयात्रा', difficultyScale: 'SAC T2–T4', riskLevel: RiskLevel.MODERATE, minReviewerTier: ReviewerQualificationTier.L1_TRAIL_STEWARDSHIP, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-03', macroDomainId: MacroDomainId.MD_01_TERRESTRIAL_TRAILS, nameEn: 'Long-Distance Thru-Hiking (≥200 km)', nameNe: 'लामो दूरीको पदयात्रा', difficultyScale: 'Class I–V Endurance', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-04', macroDomainId: MacroDomainId.MD_01_TERRESTRIAL_TRAILS, nameEn: 'High-Altitude Trekking (3,500m–5,800m)', nameNe: 'उच्च हिमाली पदयात्रा', difficultyScale: 'SAC T3–T5 + Altitude', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-05', macroDomainId: MacroDomainId.MD_02_TECHNICAL_ROCK_BIG_WALL, nameEn: 'Scrambling & Alpine Ridge Walking', nameNe: 'चट्टानी स्क्र्याम्बल', difficultyScale: 'UK Grade 1–3 / YDS 3–4', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-06', macroDomainId: MacroDomainId.MD_02_TECHNICAL_ROCK_BIG_WALL, nameEn: 'Via Ferrata / Klettersteig', nameNe: 'भिया फेराटा', difficultyScale: 'Hüsler K1–K6', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-07', macroDomainId: MacroDomainId.MD_02_TECHNICAL_ROCK_BIG_WALL, nameEn: 'Multi-Pitch Traditional & Sport Climbing', nameNe: 'बहु-पिच चट्टान आरोहण', difficultyScale: 'UIAA IV–XI / YDS 5.6–5.15', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-08', macroDomainId: MacroDomainId.MD_02_TECHNICAL_ROCK_BIG_WALL, nameEn: 'Big Wall & Grade V–VI Climbing', nameNe: 'ठूलो भित्ता आरोहण', difficultyScale: 'Grade V–VI / Aid A1–A5', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 85 },
  { categoryId: 'CAT-09', macroDomainId: MacroDomainId.MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING, nameEn: 'Trekking Peaks (5,000m–6,499m)', nameNe: 'ट्रेकिङ पिक आरोहण', difficultyScale: 'IFAS F / PD / AD', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 85 },
  { categoryId: 'CAT-10', macroDomainId: MacroDomainId.MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING, nameEn: 'Classic Alpine Mountaineering (<5,000m)', nameNe: 'अल्पाइन पर्वतारोहण', difficultyScale: 'IFAS F to ED', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 85 },
  { categoryId: 'CAT-11', macroDomainId: MacroDomainId.MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING, nameEn: 'High-Altitude Mountaineering (6,500m–7,999m)', nameNe: 'उच्च हिमाल आरोहण', difficultyScale: 'IFAS AD to ED+', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.DUAL_L3_SENIOR_EXPEDITION, minEcfScoreThreshold: 90 },
  { categoryId: 'CAT-12', macroDomainId: MacroDomainId.MD_03_ALPINE_HIGH_ALTITUDE_MOUNTAINEERING, nameEn: '8,000m Summit Expeditions (Eight-Thousanders)', nameNe: '८००० मिटर चुचुरो आरोहण', difficultyScale: 'Extreme Altitude 8,000m+', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.DUAL_L4_SOVEREIGN_8000M_POLAR, minEcfScoreThreshold: 95 },
  { categoryId: 'CAT-13', macroDomainId: MacroDomainId.MD_04_SNOW_ICE_GLACIER_WINTER, nameEn: 'Waterfall Ice & Mixed Alpine Climbing', nameNe: 'बरफ र मिश्रित आरोहण', difficultyScale: 'WI2–WI7 / M3–M12', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 85 },
  { categoryId: 'CAT-14', macroDomainId: MacroDomainId.MD_04_SNOW_ICE_GLACIER_WINTER, nameEn: 'Glacier Traverses & High-Pass Crossings', nameNe: 'हिमनदी र उच्च भन्ज्याङ पार', difficultyScale: 'Alpine F–AD', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-15', macroDomainId: MacroDomainId.MD_04_SNOW_ICE_GLACIER_WINTER, nameEn: 'Ski Mountaineering & Backcountry Touring', nameNe: 'स्की पर्वतारोहण', difficultyScale: 'Toponeige S1–S6', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-16', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Trail Running & Ultra-Mountain Endurance', nameNe: 'अल्ट्रा ट्रेल दौड', difficultyScale: 'ITRA Mountain 1–12', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-17', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'High-Pass Cycling & Mountain Bikepacking', nameNe: 'उच्च भन्ज्याङ साइकल यात्रा', difficultyScale: 'Gravel/MTB Grade 1–5', riskLevel: RiskLevel.MODERATE, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-18', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Remote Wilderness & Packraft Traverses', nameNe: 'दुर्गम जंगल र प्याकराफ्ट', difficultyScale: 'Wilderness I–V / WW I–IV', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-19', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Arid & Desert Crossings', nameNe: 'मरुभूमि पार अभियान', difficultyScale: 'Arid Remoteness I–V', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 85 },
  { categoryId: 'CAT-20', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Polar & Icecap Ski Expeditions', nameNe: 'ध्रुवीय स्की अभियान', difficultyScale: 'Polar Class I–V', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.DUAL_L4_SOVEREIGN_8000M_POLAR, minEcfScoreThreshold: 95 },
  { categoryId: 'CAT-21', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Technical Canyoneering / Canyoning', nameNe: 'क्यान्योनिङ', difficultyScale: 'ACA Class 1–4 / V1–V7', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L2_TECHNICAL_HIGH_ALTITUDE, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-22', macroDomainId: MacroDomainId.MD_05_ENDURANCE_OVERLAND_REMOTE_SUBTERRANEAN, nameEn: 'Speleology & Expedition Caving', nameNe: 'गुफा अन्वेषण', difficultyScale: 'Cave Grade 1–5 (SRT)', riskLevel: RiskLevel.EXTREME, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 80 },
  { categoryId: 'CAT-23', macroDomainId: MacroDomainId.MD_06_INCLUSIVE_PARA_AND_ECOLOGICAL_STEWARDSHIP, nameEn: 'Adaptive Adventure & Para-Mountaineering', nameNe: 'अपाङ्गता मैत्री साहसिक आरोहण', difficultyScale: 'Domain Scale + Para Class', riskLevel: RiskLevel.HIGH, minReviewerTier: ReviewerQualificationTier.L3_SENIOR_ALPINE_EXPEDITION, minEcfScoreThreshold: 75 },
  { categoryId: 'CAT-24', macroDomainId: MacroDomainId.MD_06_INCLUSIVE_PARA_AND_ECOLOGICAL_STEWARDSHIP, nameEn: 'Environmental Stewardship & Mountain Clean-Up', nameNe: 'वातावरणीय संरक्षण अभियान', difficultyScale: 'Impact Tier I–III (Civic)', riskLevel: RiskLevel.MODERATE, minReviewerTier: ReviewerQualificationTier.L1_TRAIL_STEWARDSHIP, minEcfScoreThreshold: 75 },
];

/**
 * Formats WGS84 decimal latitude/longitude into accurate N/S and E/W directional notation.
 */
export function formatGeoCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
}

