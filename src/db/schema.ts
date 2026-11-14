/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Unified Drizzle ORM Schema Barrel (All 80 Schema Groups / 86 Physical Tables)
 */

export * from './schema/00_enums.ts';
export * from './schema/01_identity_rbac_privacy.ts';
export * from './schema/02_taxonomy_standards.ts';
export * from './schema/03_destinations_routes_safety.ts';
export * from './schema/04_challenges_environment.ts';
export * from './schema/05_applications_evidence_witness.ts';
export * from './schema/06_verification_antifraud_appeals.ts';
export * from './schema/07_badges_credentials_leaderboards.ts';
export * from './schema/08_marketplace_guides_orgs.ts';
export * from './schema/09_commercial_financial_locked.ts';
export * from './schema/10_governance_audit_system_ops.ts';

/**
 * Authoritative ordered list of all 86 physical table names in 7-Tier topological order.
 */
export const ALL_86_PHYSICAL_TABLE_NAMES: readonly string[] = [
  // Tier 0: Root Constitutional, Taxonomic & System Lookup Tables (14)
  'system_settings',
  'policy_versions',
  'translation_strings',
  'aggregated_daily_metrics',
  'backup_verification_logs',
  'continuity_policies',
  'transparency_reports',
  'historical_recognitions',
  'roles',
  'permissions',
  'macro_domains',
  'geographical_regions',
  'organizations',
  'sponsors',
  // Tier 1: Core Identity, Categories, 100 Destinations & Commercial Roots (12)
  'users',
  'adventure_categories',
  'verification_standards',
  'destinations',
  'destination_sources',
  'destination_routes',
  'destination_quality_audits',
  'safety_advisories',
  'challenges',
  'sponsor_campaigns',
  'advertisements',
  'federation_clients',
  // Tier 2: Profiles, Sessions, Governance Proposals, Achievements & Guides (19)
  'user_profiles',
  'user_sessions',
  'governance_proposals',
  'role_assignments',
  'consent_records',
  'privacy_requests',
  'achievements',
  'achievement_eligible_routes',
  'destination_updates',
  'trail_condition_reports',
  'challenge_participants',
  'environmental_campaigns',
  'reviewer_accreditations',
  'calibration_tests',
  'guide_profiles',
  'organization_members',
  'subscriptions',
  'invoices',
  'user_federation_consents',
  // Tier 3: Marketplace, Badges, Community, Whistleblower & Locked Financial Tables (15)
  'badges',
  'guide_qualifications',
  'guide_insurance_records',
  'marketplace_listings',
  'booking_requests',
  'bookings',
  'reviews',
  'complaints',
  'disputes',
  'payment_records',
  'refunds',
  'financial_reconciliations',
  'whistleblower_reports',
  'community_posts',
  'moderation_cases',
  // Tier 4: Achievement Applications, Evidence Custody & Forensics (8)
  'achievement_applications',
  'evidence_files',
  'deletion_requests',
  'environmental_achievements',
  'evidence_confidence_assessments',
  'witness_attestations',
  'offline_sync_receipts',
  'fraud_investigations',
  // Tier 5: Human Verification, Independent Appeals & Credential Registry (10)
  'verification_cases',
  'verification_assignments',
  'reviewer_decisions',
  'appeal_cases',
  'appeal_assignments',
  'credential_registry',
  'certificates',
  'public_credentials',
  'portable_credential_exports',
  'leaderboard_snapshots',
  // Tier 6: Immutable Append-Only Ledgers, Security Incidents & AI Audit Logs (8)
  'evidence_hashes',
  'evidence_access_logs',
  'ecf_override_audit_logs',
  'credential_lifecycle_events',
  'audit_logs',
  'security_incidents',
  'security_events',
  'ai_audit_logs',
] as const;

export const IMMUTABLE_APPEND_ONLY_TABLES: readonly string[] = [
  'evidence_hashes',
  'evidence_access_logs',
  'ecf_override_audit_logs',
  'credential_lifecycle_events',
  'audit_logs',
  'security_events',
] as const;
