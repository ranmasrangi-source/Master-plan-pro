CREATE TYPE "public"."account_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."achievement_archetype_enum" AS ENUM('TYPE_A', 'TYPE_B', 'TYPE_C', 'TYPE_D', 'TYPE_E', 'TYPE_F');--> statement-breakpoint
CREATE TYPE "public"."ad_placement_zone_enum" AS ENUM('PUBLIC_DESTINATION_SIDEBAR', 'COMMUNITY_FEED', 'COMMUNITY_CHALLENGE_BANNER');--> statement-breakpoint
CREATE TYPE "public"."age_bracket_enum" AS ENUM('ADULT_18_PLUS', 'MINOR_13_17');--> statement-breakpoint
CREATE TYPE "public"."appeal_case_status_enum" AS ENUM('OPEN', 'IN_APPEAL_REVIEW', 'UPHELD_APPROVED', 'DISMISSED_REJECTED');--> statement-breakpoint
CREATE TYPE "public"."application_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'MORE_EVIDENCE_REQUIRED', 'IN_REVIEW', 'ESCALATED_DUAL_SENIOR', 'UNDER_INVESTIGATION', 'APPROVED', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "public"."authoritative_source_type_enum" AS ENUM('GOVT_SURVEY_MINISTRY', 'NATIONAL_PARK_AUTHORITY', 'OFFICIAL_ALPINE_FEDERATION', 'ARCHIVAL_DATABASE');--> statement-breakpoint
CREATE TYPE "public"."calendar_system_enum" AS ENUM('GREGORIAN_AD', 'BIKRAM_SAMBAT_BS');--> statement-breakpoint
CREATE TYPE "public"."credential_lifecycle_event_type_enum" AS ENUM('ISSUED', 'CORRECTED', 'SUSPENDED', 'REINSTATED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."credential_validity_status_enum" AS ENUM('VALID', 'REVOKED', 'SUSPENDED_INVESTIGATION', 'CORRECTED');--> statement-breakpoint
CREATE TYPE "public"."data_confidence_level_enum" AS ENUM('HIGH_AUTHORITATIVE', 'MEDIUM_SECONDARY', 'LOW_PENDING_FIELD_CHECK');--> statement-breakpoint
CREATE TYPE "public"."data_privacy_tier_enum" AS ENUM('TIER_1_PUBLIC', 'TIER_2_INTERNAL', 'TIER_3_RESTRICTED_EVIDENCE', 'TIER_4_REGULATED_PII');--> statement-breakpoint
CREATE TYPE "public"."data_residency_region_enum" AS ENUM('NP', 'EU', 'UAE', 'GLOBAL');--> statement-breakpoint
CREATE TYPE "public"."deletion_scope_enum" AS ENUM('RAW_EVIDENCE_ONLY', 'FULL_ACCOUNT_ANONYMIZATION');--> statement-breakpoint
CREATE TYPE "public"."destination_catalog_status_enum" AS ENUM('PROPOSED', 'VERIFIED', 'UNDER_REVIEW', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."destination_entity_type_enum" AS ENUM('MOUNTAIN_MASSIF', 'ALPINE_PEAK', 'TREKKING_PEAK', 'VOLCANO', 'CORRIDOR_TRAIL', 'CANYON_SYSTEM', 'POLAR_PLATEAU');--> statement-breakpoint
CREATE TYPE "public"."ecf_pathway_classification_enum" AS ENUM('STANDARD_MULTIMODAL', 'ALT_NO_GPS_DOCUMENTARY_WITNESS', 'BLOCKED_GPS_ONLY_INSUFFICIENT', 'BLOCKED_BELOW_THRESHOLD', 'DUAL_SENIOR_OVERRIDDEN');--> statement-breakpoint
CREATE TYPE "public"."evidence_access_action_enum" AS ENUM('UPLOAD', 'HASH_VERIFY', 'REVIEWER_VIEW', 'APPEAL_VIEW', 'POST_APPROVAL_RAW_PURGE');--> statement-breakpoint
CREATE TYPE "public"."evidence_file_type_enum" AS ENUM('PHOTO', 'VIDEO', 'GPX', 'PERMIT_DOCUMENT', 'HUT_LOGBOOK');--> statement-breakpoint
CREATE TYPE "public"."evidence_pillar_enum" AS ENUM('PIL-01', 'PIL-02', 'PIL-03', 'PIL-04', 'PIL-05');--> statement-breakpoint
CREATE TYPE "public"."geopolitical_sensitivity_flag_enum" AS ENUM('NONE', 'TRANSBOUNDARY_DUAL_JURISDICTION', 'RESTRICTED_BORDER_PERMIT', 'DISPUTED_OR_MILITARY_NOC_ZONE');--> statement-breakpoint
CREATE TYPE "public"."governance_department_enum" AS ENUM('DEPT-01', 'DEPT-02', 'DEPT-03', 'DEPT-04', 'DEPT-05', 'DEPT-06', 'DEPT-07', 'DEPT-08', 'DEPT-09', 'DEPT-10', 'DEPT-11');--> statement-breakpoint
CREATE TYPE "public"."guide_verification_status_enum" AS ENUM('UNVERIFIED', 'VERIFIED_LICENSED', 'SUSPENDED_SAFETY_HOLD');--> statement-breakpoint
CREATE TYPE "public"."leaderboard_scope_enum" AS ENUM('GLOBAL', 'COUNTRY', 'REGION', 'DESTINATION', 'CATEGORY', 'ANNUAL');--> statement-breakpoint
CREATE TYPE "public"."organization_type_enum" AS ENUM('GUIDE_COMPANY', 'TOUR_OPERATOR', 'ALPINE_CLUB', 'MOUNTAINEERING_FEDERATION', 'DESTINATION_PARTNER', 'NON_PROFIT');--> statement-breakpoint
CREATE TYPE "public"."permission_action_enum" AS ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'AUDIT');--> statement-breakpoint
CREATE TYPE "public"."platform_role_enum" AS ENUM('public_visitor', 'registered_adventurer', 'verified_adventurer', 'professional_guide', 'guide_company', 'tour_operator', 'organization_member', 'organization_admin', 'destination_partner', 'sponsor', 'reviewer', 'senior_reviewer', 'heritage_guardian', 'appeal_reviewer', 'moderator', 'customer_support', 'finance_operator', 'security_auditor', 'system_admin', 'governance_member', 'founder');--> statement-breakpoint
CREATE TYPE "public"."portable_export_format_enum" AS ENUM('W3C_VC_JSONLD', 'OPENBADGES_V3');--> statement-breakpoint
CREATE TYPE "public"."privacy_request_type_enum" AS ENUM('DATA_EXPORT', 'CORRECTION', 'RESTRICT_PROCESSING');--> statement-breakpoint
CREATE TYPE "public"."reviewer_accreditation_status_enum" AS ENUM('ACTIVE', 'SUSPENDED_RECALIBRATION_REQUIRED', 'SUSPENDED', 'REVOKED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."reviewer_decision_type_enum" AS ENUM('APPROVE', 'REJECT', 'REQUEST_MORE_EVIDENCE', 'ESCALATE_FRAUD');--> statement-breakpoint
CREATE TYPE "public"."reviewer_qualification_tier_enum" AS ENUM('L1', 'L2', 'L3', 'DUAL_L3', 'DUAL_L4', 'HERITAGE_GUARDIAN');--> statement-breakpoint
CREATE TYPE "public"."reviewer_slot_enum" AS ENUM('PRIMARY', 'SECOND_SENIOR', 'HERITAGE_GUARDIAN', 'LEAD_ESCALATION');--> statement-breakpoint
CREATE TYPE "public"."risk_level_enum" AS ENUM('LOW', 'MODERATE', 'HIGH', 'EXTREME');--> statement-breakpoint
CREATE TYPE "public"."security_severity_enum" AS ENUM('SEV_1', 'SEV_2', 'SEV_3', 'SEV_4');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan_tier_enum" AS ENUM('FREE_STANDARD', 'PRO_CONVENIENCE_LOCKED', 'ORG_SAAS_LOCKED');--> statement-breakpoint
CREATE TYPE "public"."supported_locale_enum" AS ENUM('en', 'ne', 'hi', 'ar', 'es', 'fr', 'de', 'zh', 'ja');--> statement-breakpoint
CREATE TYPE "public"."trail_condition_status_enum" AS ENUM('UNCONFIRMED_FIELD_REPORT', 'CORROBORATED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."verification_case_status_enum" AS ENUM('SUBMITTED', 'MORE_EVIDENCE_REQUIRED', 'IN_REVIEW', 'AWAITING_SECOND_SENIOR_REVIEWER', 'AWAITING_HERITAGE_GUARDIAN', 'ESCALATED_SPLIT_DECISION', 'UNDER_INVESTIGATION', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'SUSPENDED_PENDING_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."witness_attestation_status_enum" AS ENUM('INVITED', 'CONFIRMED', 'FLAGGED_RING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."witness_relationship_enum" AS ENUM('LICENSED_GUIDE', 'ROPE_PARTNER', 'INDEPENDENT_BYSTANDER', 'HERITAGE_GUARDIAN');--> statement-breakpoint
CREATE TABLE "consent_records" (
	"consent_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	"purpose_key" varchar(120) NOT NULL,
	"granted" boolean NOT NULL,
	"guardian_verified" boolean DEFAULT false NOT NULL,
	"residency_region" "data_residency_region_enum" DEFAULT 'GLOBAL' NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deletion_requests" (
	"deletion_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"scope" "deletion_scope_enum" NOT NULL,
	"target_evidence_id" varchar(64),
	"legal_hold_active" boolean DEFAULT false NOT NULL,
	"status" varchar(32) DEFAULT 'REQUESTED' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"executed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"permission_id" varchar(64) PRIMARY KEY NOT NULL,
	"resource" varchar(120) NOT NULL,
	"action" "permission_action_enum" NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "privacy_requests" (
	"request_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"request_type" "privacy_request_type_enum" NOT NULL,
	"status" varchar(32) DEFAULT 'PENDING' NOT NULL,
	"export_download_hash" varchar(64),
	"residency_region" "data_residency_region_enum" DEFAULT 'GLOBAL' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "role_assignments" (
	"assignment_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"role_id" "platform_role_enum" NOT NULL,
	"granted_by_user_id" varchar(64),
	"granted_by_proposal_id" varchar(64),
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"role_id" "platform_role_enum" PRIMARY KEY NOT NULL,
	"role_name" varchar(120) NOT NULL,
	"department_id" "governance_department_enum" NOT NULL,
	"requires_mfa" boolean DEFAULT false NOT NULL,
	"is_privileged" boolean DEFAULT false NOT NULL,
	CONSTRAINT "roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" varchar(64) PRIMARY KEY NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"full_name_encrypted" text NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"preferred_locale" "supported_locale_enum" DEFAULT 'en' NOT NULL,
	"bio" text,
	"avatar_url" text,
	"public_profile_visible" boolean DEFAULT true NOT NULL,
	"show_on_leaderboards" boolean DEFAULT true NOT NULL,
	"share_evidence_summary_publicly" boolean DEFAULT false NOT NULL,
	"low_bandwidth_default" boolean DEFAULT false NOT NULL,
	"privacy_tier" "data_privacy_tier_enum" DEFAULT 'TIER_4_REGULATED_PII' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"session_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"user_agent_summary" varchar(255) NOT NULL,
	"mfa_verified_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"revocation_reason" text,
	CONSTRAINT "user_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_secret_encrypted" text,
	"account_status" "account_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"age_bracket" "age_bracket_enum" DEFAULT 'ADULT_18_PLUS' NOT NULL,
	"residency_region" "data_residency_region_enum" DEFAULT 'GLOBAL' NOT NULL,
	"privacy_tier" "data_privacy_tier_enum" DEFAULT 'TIER_4_REGULATED_PII' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "achievement_eligible_routes" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"achievement_id" varchar(64) NOT NULL,
	"route_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"achievement_id" varchar(64) PRIMARY KEY NOT NULL,
	"category_id" varchar(16) NOT NULL,
	"destination_id" varchar(32),
	"archetype" "achievement_archetype_enum" NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ne" varchar(200) NOT NULL,
	"completion_criteria_json" jsonb NOT NULL,
	"base_points" integer DEFAULT 0 NOT NULL,
	"difficulty_multiplier" numeric(6, 2) DEFAULT '1.00' NOT NULL,
	"altitude_remoteness_factor" numeric(6, 2) DEFAULT '1.00' NOT NULL,
	"requires_heritage_guardian" boolean DEFAULT false NOT NULL,
	"effective_policy_version" varchar(32) NOT NULL,
	CONSTRAINT "chk_achievements_base_points_non_negative" CHECK ("achievements"."base_points" >= 0)
);
--> statement-breakpoint
CREATE TABLE "adventure_categories" (
	"category_id" varchar(16) PRIMARY KEY NOT NULL,
	"macro_domain_id" varchar(16) NOT NULL,
	"name_en" varchar(160) NOT NULL,
	"name_ne" varchar(160) NOT NULL,
	"difficulty_system" varchar(120) NOT NULL,
	"risk_level" "risk_level_enum" NOT NULL,
	"required_skills_json" jsonb NOT NULL,
	"safety_requirements_json" jsonb NOT NULL,
	"min_reviewer_tier" "reviewer_qualification_tier_enum" NOT NULL,
	"min_ecf_threshold" integer DEFAULT 75 NOT NULL,
	"badge_eligible" boolean DEFAULT true NOT NULL,
	"competitive_rank_eligible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "adventure_categories_name_en_unique" UNIQUE("name_en"),
	CONSTRAINT "chk_adventure_categories_min_ecf_threshold" CHECK ("adventure_categories"."min_ecf_threshold" >= 75)
);
--> statement-breakpoint
CREATE TABLE "macro_domains" (
	"domain_id" varchar(16) PRIMARY KEY NOT NULL,
	"name_en" varchar(160) NOT NULL,
	"name_ne" varchar(160) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "macro_domains_name_en_unique" UNIQUE("name_en")
);
--> statement-breakpoint
CREATE TABLE "verification_standards" (
	"standard_id" varchar(64) PRIMARY KEY NOT NULL,
	"category_id" varchar(16) NOT NULL,
	"pillar_weights_json" jsonb NOT NULL,
	"min_total_confidence" integer DEFAULT 75 NOT NULL,
	"allow_gps_free_pathway" boolean DEFAULT true NOT NULL,
	"allow_stripped_exif" boolean DEFAULT true NOT NULL,
	"requires_dual_senior" boolean DEFAULT false NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	CONSTRAINT "chk_verification_standards_min_confidence" CHECK ("verification_standards"."min_total_confidence" >= 75),
	CONSTRAINT "chk_verification_standards_gps_free_allowed" CHECK ("verification_standards"."allow_gps_free_pathway" = TRUE),
	CONSTRAINT "chk_verification_standards_stripped_exif_allowed" CHECK ("verification_standards"."allow_stripped_exif" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "destination_quality_audits" (
	"audit_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"completeness_score" integer NOT NULL,
	"verified_fields_count" integer NOT NULL,
	"unverified_fields_count" integer NOT NULL,
	"last_audited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destination_routes" (
	"route_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"trail_corridor_id" varchar(64),
	"name_en" varchar(200) NOT NULL,
	"name_ne" varchar(200) NOT NULL,
	"start_point_coords" jsonb NOT NULL,
	"end_point_coords" jsonb NOT NULL,
	"gpx_reference_uri" text,
	"distance_km" numeric(8, 2) NOT NULL,
	"elevation_gain_m" integer NOT NULL,
	"elevation_loss_m" integer NOT NULL,
	"technical_grade" varchar(120) NOT NULL,
	"hazards_json" jsonb NOT NULL,
	"acclimatization_profile_json" jsonb NOT NULL,
	"route_version" varchar(32) DEFAULT 'v1.0' NOT NULL,
	"status" "destination_catalog_status_enum" DEFAULT 'PROPOSED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destination_sources" (
	"source_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"authority_name" varchar(200) NOT NULL,
	"document_title" text NOT NULL,
	"source_url" text NOT NULL,
	"source_type" "authoritative_source_type_enum" NOT NULL,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destination_updates" (
	"update_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"proposed_by_user_id" varchar(64) NOT NULL,
	"approved_by_dept_user_id" varchar(64),
	"diff_json" jsonb NOT NULL,
	"source_citation" text NOT NULL,
	"status" varchar(32) DEFAULT 'PENDING_DEPT_08' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"destination_id" varchar(32) PRIMARY KEY NOT NULL,
	"region_id" varchar(64) NOT NULL,
	"entity_type" "destination_entity_type_enum" NOT NULL,
	"name_en" varchar(200) NOT NULL,
	"name_ne" varchar(200) NOT NULL,
	"alt_names_json" jsonb NOT NULL,
	"country_codes_json" jsonb NOT NULL,
	"latitude" numeric(9, 6) NOT NULL,
	"longitude" numeric(9, 6) NOT NULL,
	"elevation_meters" numeric(8, 2) NOT NULL,
	"primary_category_id" varchar(16) NOT NULL,
	"difficulty_summary" text NOT NULL,
	"permit_requirements" text NOT NULL,
	"source_url" text NOT NULL,
	"source_type" "authoritative_source_type_enum" NOT NULL,
	"last_verified_date" varchar(10) NOT NULL,
	"confidence" "data_confidence_level_enum" NOT NULL,
	"unverified_fields_json" jsonb NOT NULL,
	"geopolitical_flag" "geopolitical_sensitivity_flag_enum" DEFAULT 'NONE' NOT NULL,
	"emergency_sar_protocol_json" jsonb NOT NULL,
	"seasonal_risk_matrix_json" jsonb NOT NULL,
	"verification_status" "destination_catalog_status_enum" DEFAULT 'PROPOSED' NOT NULL,
	CONSTRAINT "chk_destinations_wgs84_bounds" CHECK ("destinations"."latitude" >= -90 AND "destinations"."latitude" <= 90 AND "destinations"."longitude" >= -180 AND "destinations"."longitude" <= 180)
);
--> statement-breakpoint
CREATE TABLE "geographical_regions" (
	"region_id" varchar(64) PRIMARY KEY NOT NULL,
	"continent" varchar(64) NOT NULL,
	"name_en" varchar(160) NOT NULL,
	"name_ne" varchar(160) NOT NULL,
	"parent_region_id" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "safety_advisories" (
	"advisory_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"route_id" varchar(64),
	"severity" "risk_level_enum" NOT NULL,
	"hazard_type" varchar(120) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ne" varchar(200) NOT NULL,
	"guidance_text" text NOT NULL,
	"official_source_url" text NOT NULL,
	"valid_from" timestamp with time zone DEFAULT now() NOT NULL,
	"valid_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trail_condition_reports" (
	"report_id" varchar(64) PRIMARY KEY NOT NULL,
	"route_id" varchar(64) NOT NULL,
	"reporter_user_id" varchar(64) NOT NULL,
	"condition_type" varchar(64) NOT NULL,
	"notes" text NOT NULL,
	"corroboration_count" integer DEFAULT 0 NOT NULL,
	"verification_status" "trail_condition_status_enum" DEFAULT 'UNCONFIRMED_FIELD_REPORT' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"challenge_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"verified_progress" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"challenge_id" varchar(64) PRIMARY KEY NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ne" varchar(200) NOT NULL,
	"challenge_type" varchar(64) NOT NULL,
	"target_metric" numeric(10, 2) NOT NULL,
	"safety_rules_json" jsonb NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" varchar(32) DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "environmental_achievements" (
	"env_achievement_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"campaign_id" varchar(64),
	"waste_removed_kg" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"stewardship_hours" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"lnt_score" integer NOT NULL,
	"receipt_evidence_id" varchar(64) NOT NULL,
	"verified_by_reviewer_id" varchar(64),
	"status" varchar(32) DEFAULT 'PENDING' NOT NULL,
	CONSTRAINT "chk_environmental_achievements_lnt_range" CHECK ("environmental_achievements"."lnt_score" >= 0 AND "environmental_achievements"."lnt_score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "environmental_campaigns" (
	"campaign_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"organizer_org_id" varchar(64),
	"title" varchar(200) NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievement_applications" (
	"application_id" varchar(64) PRIMARY KEY NOT NULL,
	"applicant_user_id" varchar(64) NOT NULL,
	"category_id" varchar(16) NOT NULL,
	"achievement_id" varchar(64) NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"route_id" varchar(64) NOT NULL,
	"attempt_start_date" varchar(10) NOT NULL,
	"attempt_completion_date" varchar(10) NOT NULL,
	"date_calendar_system" "calendar_system_enum" DEFAULT 'GREGORIAN_AD' NOT NULL,
	"original_bs_date_string" varchar(32),
	"supplemental_oxygen_used" boolean DEFAULT false NOT NULL,
	"lnt_self_score" integer DEFAULT 100 NOT NULL,
	"applicant_declaration_signed" boolean NOT NULL,
	"status" "application_status_enum" DEFAULT 'SUBMITTED' NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_applications_declaration_signed" CHECK ("achievement_applications"."applicant_declaration_signed" = TRUE),
	CONSTRAINT "chk_applications_lnt_score" CHECK ("achievement_applications"."lnt_self_score" >= 0 AND "achievement_applications"."lnt_self_score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "ecf_override_audit_logs" (
	"override_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"computed_ecf_score" integer NOT NULL,
	"required_threshold" integer NOT NULL,
	"missing_pillar_reason" text NOT NULL,
	"compensating_evidence_summary" text NOT NULL,
	"primary_senior_reviewer_id" varchar(64) NOT NULL,
	"co_signing_senior_reviewer_id" varchar(64) NOT NULL,
	"verification_lead_approval_id" varchar(64) NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	"prev_audit_hash" char(64) NOT NULL,
	"override_event_hash" char(64) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ecf_override_audit_logs_override_event_hash_unique" UNIQUE("override_event_hash"),
	CONSTRAINT "chk_ecf_override_distinct_signers" CHECK ("ecf_override_audit_logs"."primary_senior_reviewer_id" <> "ecf_override_audit_logs"."co_signing_senior_reviewer_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_access_logs" (
	"access_log_id" varchar(64) PRIMARY KEY NOT NULL,
	"evidence_id" varchar(64) NOT NULL,
	"actor_user_id" varchar(64) NOT NULL,
	"actor_role" "platform_role_enum" NOT NULL,
	"action_type" "evidence_access_action_enum" NOT NULL,
	"sha256_verified_match" boolean NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_confidence_assessments" (
	"assessment_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"pil01_visual_score" integer NOT NULL,
	"pil02_telemetry_score" integer NOT NULL,
	"pil03_documentary_score" integer NOT NULL,
	"pil04_witness_score" integer NOT NULL,
	"pil05_chronology_score" integer NOT NULL,
	"total_confidence_score" integer NOT NULL,
	"required_threshold" integer DEFAULT 75 NOT NULL,
	"is_gps_only_blocked" boolean NOT NULL,
	"pathway_classification" "ecf_pathway_classification_enum" NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_ecf_pillar_bounds_and_sum" CHECK ("evidence_confidence_assessments"."pil01_visual_score" BETWEEN 0 AND 40 AND "evidence_confidence_assessments"."pil02_telemetry_score" BETWEEN 0 AND 35 AND "evidence_confidence_assessments"."pil03_documentary_score" BETWEEN 0 AND 35 AND "evidence_confidence_assessments"."pil04_witness_score" BETWEEN 0 AND 30 AND "evidence_confidence_assessments"."pil05_chronology_score" BETWEEN 0 AND 20 AND "evidence_confidence_assessments"."total_confidence_score" = ("evidence_confidence_assessments"."pil01_visual_score" + "evidence_confidence_assessments"."pil02_telemetry_score" + "evidence_confidence_assessments"."pil03_documentary_score" + "evidence_confidence_assessments"."pil04_witness_score" + "evidence_confidence_assessments"."pil05_chronology_score"))
);
--> statement-breakpoint
CREATE TABLE "evidence_files" (
	"evidence_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"uploader_user_id" varchar(64) NOT NULL,
	"evidence_pillar" "evidence_pillar_enum" NOT NULL,
	"file_type" "evidence_file_type_enum" NOT NULL,
	"storage_uri" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"exif_summary_json" jsonb,
	"gpx_dem_rmse_meters" numeric(8, 3),
	"residential_geozone_masked" boolean DEFAULT true NOT NULL,
	"raw_binary_deleted_post_approval" boolean DEFAULT false NOT NULL,
	"privacy_tier" "data_privacy_tier_enum" DEFAULT 'TIER_3_RESTRICTED_EVIDENCE' NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_hashes" (
	"hash_record_id" varchar(64) PRIMARY KEY NOT NULL,
	"evidence_id" varchar(64) NOT NULL,
	"sha256_hex" char(64) NOT NULL,
	"p_hash_64_hex" char(16),
	"p_hash_mirror_64_hex" char(16),
	"d_hash_64_hex" char(16),
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offline_sync_receipts" (
	"sync_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"client_draft_id" varchar(64) NOT NULL,
	"server_application_id" varchar(64) NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "witness_attestations" (
	"attestation_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"applicant_user_id" varchar(64) NOT NULL,
	"witness_user_id" varchar(64),
	"witness_license_or_id_ref" varchar(120),
	"relationship_type" "witness_relationship_enum" NOT NULL,
	"coi_and_perjury_signed" boolean NOT NULL,
	"verification_token_hash" char(64) NOT NULL,
	"ip_device_distinct_from_applicant" boolean NOT NULL,
	"status" "witness_attestation_status_enum" DEFAULT 'INVITED' NOT NULL,
	"attested_at" timestamp with time zone,
	CONSTRAINT "chk_witness_no_self_attestation" CHECK ("witness_attestations"."witness_user_id" IS NULL OR "witness_attestations"."witness_user_id" <> "witness_attestations"."applicant_user_id")
);
--> statement-breakpoint
CREATE TABLE "appeal_assignments" (
	"appeal_assignment_id" varchar(64) PRIMARY KEY NOT NULL,
	"appeal_id" varchar(64) NOT NULL,
	"appeal_reviewer_user_id" varchar(64) NOT NULL,
	"verified_not_in_excluded_list" boolean NOT NULL,
	"coi_check_passed" boolean NOT NULL,
	"decision" varchar(32),
	"reasoned_outcome" text,
	"policy_version" varchar(32) NOT NULL,
	"decided_at" timestamp with time zone,
	CONSTRAINT "chk_appeal_assignments_independence" CHECK ("appeal_assignments"."verified_not_in_excluded_list" = TRUE AND "appeal_assignments"."coi_check_passed" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "appeal_cases" (
	"appeal_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"original_case_id" varchar(64) NOT NULL,
	"appellant_user_id" varchar(64) NOT NULL,
	"excluded_reviewer_ids_json" jsonb NOT NULL,
	"appeal_grounds" text NOT NULL,
	"new_evidence_ids_json" jsonb NOT NULL,
	"assigned_appeal_reviewer_id" varchar(64),
	"status" "appeal_case_status_enum" DEFAULT 'OPEN' NOT NULL,
	"filed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "calibration_tests" (
	"test_id" varchar(64) PRIMARY KEY NOT NULL,
	"reviewer_user_id" varchar(64) NOT NULL,
	"seed_case_id" varchar(64) NOT NULL,
	"expected_outcome" varchar(32) NOT NULL,
	"reviewer_submitted_outcome" varchar(32) NOT NULL,
	"passed" boolean NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fraud_investigations" (
	"investigation_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"dem_rmse_value" numeric(8, 3),
	"max_ascent_rate_observed" numeric(8, 2),
	"west_physiological_limit" numeric(8, 2),
	"min_p_hash_hamming_distance" integer,
	"matched_evidence_id" varchar(64),
	"forensic_flags_json" jsonb NOT NULL,
	"priority_score" integer DEFAULT 0 NOT NULL,
	"investigator_reviewer_id" varchar(64),
	"resolution_outcome" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewer_accreditations" (
	"accreditation_id" varchar(64) PRIMARY KEY NOT NULL,
	"reviewer_user_id" varchar(64) NOT NULL,
	"reviewer_tier" "reviewer_qualification_tier_enum" NOT NULL,
	"qualified_category_ids_json" jsonb NOT NULL,
	"qualified_sacred_destination_ids_json" jsonb NOT NULL,
	"calibration_accuracy_score" integer NOT NULL,
	"last_assessed_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" "reviewer_accreditation_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "reviewer_accreditations_reviewer_user_id_unique" UNIQUE("reviewer_user_id"),
	CONSTRAINT "chk_reviewer_calibration_score" CHECK ("reviewer_accreditations"."calibration_accuracy_score" >= 0 AND "reviewer_accreditations"."calibration_accuracy_score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "reviewer_decisions" (
	"decision_id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"reviewer_user_id" varchar(64) NOT NULL,
	"decision" "reviewer_decision_type_enum" NOT NULL,
	"documented_reasons" text NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_assignments" (
	"assignment_id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"reviewer_user_id" varchar(64) NOT NULL,
	"reviewer_slot" "reviewer_slot_enum" NOT NULL,
	"coi_check_passed" boolean NOT NULL,
	"coi_declaration_signed_at" timestamp with time zone NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_verification_assignments_coi_passed" CHECK ("verification_assignments"."coi_check_passed" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "verification_cases" (
	"case_id" varchar(64) PRIMARY KEY NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"required_reviewer_tier" "reviewer_qualification_tier_enum" NOT NULL,
	"requires_dual_senior" boolean DEFAULT false NOT NULL,
	"requires_heritage_guardian" boolean DEFAULT false NOT NULL,
	"assigned_reviewer_ids_json" jsonb NOT NULL,
	"approved_senior_count" integer DEFAULT 0 NOT NULL,
	"heritage_guardian_approved" boolean,
	"fraud_investigation_priority_score" integer DEFAULT 0 NOT NULL,
	"status" "verification_case_status_enum" DEFAULT 'SUBMITTED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "verification_cases_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"badge_id" varchar(64) PRIMARY KEY NOT NULL,
	"destination_id" varchar(32),
	"achievement_id" varchar(64) NOT NULL,
	"name_en" varchar(200) NOT NULL,
	"name_ne" varchar(200) NOT NULL,
	"shield_design_spec_json" jsonb NOT NULL,
	"is_free_standard" boolean DEFAULT true NOT NULL,
	CONSTRAINT "chk_badges_free_standard_forever" CHECK ("badges"."is_free_standard" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"certificate_id" varchar(64) PRIMARY KEY NOT NULL,
	"credential_id" varchar(64) NOT NULL,
	"qr_verification_url" text NOT NULL,
	"ed25519_signature" text NOT NULL,
	"pdf_template_version" varchar(32) DEFAULT 'v1.1' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "credential_lifecycle_events" (
	"event_id" varchar(64) PRIMARY KEY NOT NULL,
	"credential_id" varchar(64) NOT NULL,
	"event_type" "credential_lifecycle_event_type_enum" NOT NULL,
	"reason" text NOT NULL,
	"authorized_by_quorum_or_case_id" varchar(64) NOT NULL,
	"prev_hash" char(64) NOT NULL,
	"event_hash" char(64) NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credential_lifecycle_events_event_hash_unique" UNIQUE("event_hash")
);
--> statement-breakpoint
CREATE TABLE "credential_registry" (
	"credential_id" varchar(64) PRIMARY KEY NOT NULL,
	"subject_user_id" varchar(64) NOT NULL,
	"application_id" varchar(64) NOT NULL,
	"verification_case_id" varchar(64) NOT NULL,
	"achievement_id" varchar(64) NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"route_id" varchar(64) NOT NULL,
	"badge_id" varchar(64) NOT NULL,
	"certificate_id" varchar(64) NOT NULL,
	"completion_date" varchar(10) NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"issuing_authority" varchar(160) DEFAULT '0 TO 8848 Independent Verification Department' NOT NULL,
	"status" "credential_validity_status_enum" DEFAULT 'VALID' NOT NULL,
	"previous_event_hash" char(64) NOT NULL,
	"current_credential_hash" char(64) NOT NULL,
	"policy_version" varchar(32) NOT NULL,
	CONSTRAINT "credential_registry_application_id_unique" UNIQUE("application_id"),
	CONSTRAINT "credential_registry_certificate_id_unique" UNIQUE("certificate_id"),
	CONSTRAINT "credential_registry_current_credential_hash_unique" UNIQUE("current_credential_hash")
);
--> statement-breakpoint
CREATE TABLE "leaderboard_snapshots" (
	"snapshot_id" varchar(64) PRIMARY KEY NOT NULL,
	"board_scope" "leaderboard_scope_enum" NOT NULL,
	"scope_key" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"verified_credentials_count" integer DEFAULT 0 NOT NULL,
	"total_score" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"algorithm_version" varchar(32) DEFAULT 'v1.1' NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portable_credential_exports" (
	"export_id" varchar(64) PRIMARY KEY NOT NULL,
	"credential_id" varchar(64) NOT NULL,
	"format" "portable_export_format_enum" NOT NULL,
	"detached_signature" text NOT NULL,
	"exported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_credentials" (
	"credential_id" varchar(64) PRIMARY KEY NOT NULL,
	"public_display_name" varchar(160) NOT NULL,
	"achievement_title_en" varchar(200) NOT NULL,
	"achievement_title_ne" varchar(200) NOT NULL,
	"destination_name_en" varchar(200) NOT NULL,
	"destination_name_ne" varchar(200) NOT NULL,
	"route_name_en" varchar(200) NOT NULL,
	"elevation_meters" numeric(8, 2) NOT NULL,
	"completion_date" varchar(10) NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "credential_validity_status_enum" DEFAULT 'VALID' NOT NULL,
	"revocation_notice" text,
	"current_credential_hash" char(64) NOT NULL,
	"replay_3d_opt_in" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_requests" (
	"booking_request_id" varchar(64) PRIMARY KEY NOT NULL,
	"listing_id" varchar(64) NOT NULL,
	"adventurer_user_id" varchar(64) NOT NULL,
	"guide_user_id" varchar(64) NOT NULL,
	"requested_dates" varchar(120) NOT NULL,
	"status" varchar(48) DEFAULT 'INQUIRY_ONLY_PAYMENTS_LOCKED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"booking_id" varchar(64) PRIMARY KEY NOT NULL,
	"booking_request_id" varchar(64) NOT NULL,
	"commission_rate_disclosed" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"payment_execution_locked" boolean DEFAULT true NOT NULL,
	"status" varchar(32) DEFAULT 'INQUIRY_RECORDED' NOT NULL,
	CONSTRAINT "chk_bookings_payment_locked" CHECK ("bookings"."payment_execution_locked" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"complaint_id" varchar(64) PRIMARY KEY NOT NULL,
	"target_entity_type" varchar(64) NOT NULL,
	"target_entity_id" varchar(64) NOT NULL,
	"reporter_user_id" varchar(64) NOT NULL,
	"severity" varchar(32) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(32) DEFAULT 'OPEN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"dispute_id" varchar(64) PRIMARY KEY NOT NULL,
	"booking_id" varchar(64) NOT NULL,
	"reason" text NOT NULL,
	"resolution_notes" text,
	"resolved_by_staff_id" varchar(64),
	"status" varchar(32) DEFAULT 'OPEN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_insurance_records" (
	"insurance_id" varchar(64) PRIMARY KEY NOT NULL,
	"guide_id" varchar(64) NOT NULL,
	"provider_name" varchar(200) NOT NULL,
	"policy_number_hash" varchar(64) NOT NULL,
	"coverage_max_altitude_m" integer NOT NULL,
	"valid_until" timestamp with time zone NOT NULL,
	"verified_status" varchar(32) DEFAULT 'UNVERIFIED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_profiles" (
	"guide_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"company_org_id" varchar(64),
	"license_number" varchar(120) NOT NULL,
	"licensing_body" varchar(64) NOT NULL,
	"verification_status" "guide_verification_status_enum" DEFAULT 'UNVERIFIED' NOT NULL,
	"languages_json" jsonb NOT NULL,
	"service_regions_json" jsonb NOT NULL,
	"lnt_endorsed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "guide_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "guide_qualifications" (
	"qualification_id" varchar(64) PRIMARY KEY NOT NULL,
	"guide_id" varchar(64) NOT NULL,
	"certificate_title" varchar(200) NOT NULL,
	"issuing_authority" varchar(200) NOT NULL,
	"document_vault_uri" text NOT NULL,
	"verified_by_staff_id" varchar(64),
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "marketplace_listings" (
	"listing_id" varchar(64) PRIMARY KEY NOT NULL,
	"guide_or_org_id" varchar(64) NOT NULL,
	"destination_id" varchar(32) NOT NULL,
	"route_id" varchar(64) NOT NULL,
	"title" varchar(200) NOT NULL,
	"duration_days" integer NOT NULL,
	"price_display_usd" numeric(10, 2) NOT NULL,
	"max_client_ratio" varchar(32) NOT NULL,
	"cancellation_policy" text NOT NULL,
	"status" varchar(32) DEFAULT 'ACTIVE_INQUIRY_ONLY' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"membership_id" varchar(64) PRIMARY KEY NOT NULL,
	"org_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"org_role" varchar(32) DEFAULT 'MEMBER' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"org_id" varchar(64) PRIMARY KEY NOT NULL,
	"org_type" "organization_type_enum" NOT NULL,
	"legal_name" varchar(200) NOT NULL,
	"registration_jurisdiction" varchar(64) NOT NULL,
	"verification_status" varchar(32) DEFAULT 'UNVERIFIED' NOT NULL,
	"can_self_approve_member_achievements" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_legal_name_unique" UNIQUE("legal_name"),
	CONSTRAINT "chk_organizations_no_self_approval" CHECK ("organizations"."can_self_approve_member_achievements" = FALSE)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" varchar(64) PRIMARY KEY NOT NULL,
	"booking_id" varchar(64) NOT NULL,
	"author_user_id" varchar(64) NOT NULL,
	"safety_rating" integer NOT NULL,
	"ethics_lnt_rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_reviews_ratings_1_to_5" CHECK ("reviews"."safety_rating" BETWEEN 1 AND 5 AND "reviews"."ethics_lnt_rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "advertisements" (
	"ad_id" varchar(64) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(64) NOT NULL,
	"placement_zone" "ad_placement_zone_enum" NOT NULL,
	"disclosure_label" varchar(32) DEFAULT 'SPONSORED' NOT NULL,
	"status" varchar(32) DEFAULT 'DRAFT' NOT NULL,
	CONSTRAINT "chk_advertisements_disclosure_label" CHECK ("advertisements"."disclosure_label" = 'SPONSORED')
);
--> statement-breakpoint
CREATE TABLE "financial_reconciliations" (
	"reconciliation_id" varchar(64) PRIMARY KEY NOT NULL,
	"period_key" varchar(32) NOT NULL,
	"debit_total_usd" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"credit_total_usd" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"is_balanced" boolean DEFAULT true NOT NULL,
	"audited_by_user_id" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "financial_reconciliations_period_key_unique" UNIQUE("period_key"),
	CONSTRAINT "chk_financial_reconciliations_double_entry_balance" CHECK ("financial_reconciliations"."debit_total_usd" = "financial_reconciliations"."credit_total_usd" AND "financial_reconciliations"."is_balanced" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"invoice_id" varchar(64) PRIMARY KEY NOT NULL,
	"account_id" varchar(64) NOT NULL,
	"amount_usd" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"tax_amount_usd" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" varchar(32) DEFAULT 'DRAFT_LOCKED' NOT NULL,
	CONSTRAINT "chk_invoices_locked_by_constitution" CHECK ("invoices"."status" = 'DRAFT_LOCKED')
);
--> statement-breakpoint
CREATE TABLE "payment_records" (
	"payment_id" varchar(64) PRIMARY KEY NOT NULL,
	"invoice_id" varchar(64) NOT NULL,
	"gateway_status" varchar(48) DEFAULT 'DISABLED_BY_CONSTITUTION' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_payment_records_disabled_by_constitution" CHECK ("payment_records"."gateway_status" = 'DISABLED_BY_CONSTITUTION')
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"refund_id" varchar(64) PRIMARY KEY NOT NULL,
	"payment_id" varchar(64) NOT NULL,
	"amount_usd" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(32) DEFAULT 'DISABLED_BY_CONSTITUTION' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_campaigns" (
	"campaign_id" varchar(64) PRIMARY KEY NOT NULL,
	"sponsor_id" varchar(64) NOT NULL,
	"title" varchar(200) NOT NULL,
	"mandatory_sponsored_label" varchar(32) DEFAULT 'SPONSORED' NOT NULL,
	"prohibited_category_check_passed" boolean DEFAULT false NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" varchar(32) DEFAULT 'DRAFT' NOT NULL,
	CONSTRAINT "chk_sponsor_campaigns_mandatory_label" CHECK ("sponsor_campaigns"."mandatory_sponsored_label" = 'SPONSORED')
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"sponsor_id" varchar(64) PRIMARY KEY NOT NULL,
	"legal_entity_name" varchar(200) NOT NULL,
	"identity_verified" boolean DEFAULT false NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"status" varchar(32) DEFAULT 'INACTIVE_LOCKED' NOT NULL,
	CONSTRAINT "sponsors_legal_entity_name_unique" UNIQUE("legal_entity_name")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"subscription_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id_or_org_id" varchar(64) NOT NULL,
	"subscriber_user_id" varchar(64),
	"subscriber_org_id" varchar(64),
	"plan_tier" "subscription_plan_tier_enum" DEFAULT 'FREE_STANDARD' NOT NULL,
	"verification_priority_multiplier" numeric(4, 2) DEFAULT '1.00' NOT NULL,
	"status" varchar(32) DEFAULT 'FREE_ACTIVE' NOT NULL,
	CONSTRAINT "chk_subscriptions_zero_verification_influence" CHECK ("subscriptions"."verification_priority_multiplier" = 1.00)
);
--> statement-breakpoint
CREATE TABLE "aggregated_daily_metrics" (
	"metric_id" varchar(64) PRIMARY KEY NOT NULL,
	"date_bucket" varchar(10) NOT NULL,
	"metric_key" varchar(64) NOT NULL,
	"dimension_key" varchar(64) NOT NULL,
	"metric_count" integer NOT NULL,
	"k_anonymity_floor_enforced" integer DEFAULT 5 NOT NULL,
	CONSTRAINT "chk_aggregated_daily_metrics_k_anonymity_floor" CHECK ("aggregated_daily_metrics"."metric_count" >= 5 AND "aggregated_daily_metrics"."k_anonymity_floor_enforced" >= 5)
);
--> statement-breakpoint
CREATE TABLE "ai_audit_logs" (
	"audit_id" varchar(64) PRIMARY KEY NOT NULL,
	"provider_name" varchar(64) NOT NULL,
	"model_version" varchar(64) NOT NULL,
	"task_type" varchar(64) NOT NULL,
	"input_sha256" char(64) NOT NULL,
	"requires_human_review" boolean DEFAULT true NOT NULL,
	"can_approve_or_reject_achievement" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_ai_audit_logs_constitutional_lock" CHECK ("ai_audit_logs"."requires_human_review" = TRUE AND "ai_audit_logs"."can_approve_or_reject_achievement" = FALSE)
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"audit_id" varchar(64) PRIMARY KEY NOT NULL,
	"sequence_number" integer NOT NULL,
	"actor_user_id" varchar(64),
	"actor_role" "platform_role_enum" NOT NULL,
	"department_id" "governance_department_enum" NOT NULL,
	"action" varchar(120) NOT NULL,
	"target_entity_type" varchar(64) NOT NULL,
	"target_entity_id" varchar(64) NOT NULL,
	"metadata_json" jsonb NOT NULL,
	"prev_audit_hash" char(64) NOT NULL,
	"current_audit_hash" char(64) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_logs_sequence_number_unique" UNIQUE("sequence_number"),
	CONSTRAINT "audit_logs_current_audit_hash_unique" UNIQUE("current_audit_hash")
);
--> statement-breakpoint
CREATE TABLE "backup_verification_logs" (
	"backup_log_id" varchar(64) PRIMARY KEY NOT NULL,
	"snapshot_id" varchar(64) NOT NULL,
	"schema_version" varchar(32) NOT NULL,
	"sha256_manifest_hash" char(64) NOT NULL,
	"total_records_count" integer NOT NULL,
	"residency_region_scope" varchar(16) DEFAULT 'ALL' NOT NULL,
	"restore_verified" boolean DEFAULT false NOT NULL,
	"exported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	CONSTRAINT "backup_verification_logs_snapshot_id_unique" UNIQUE("snapshot_id")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"post_id" varchar(64) PRIMARY KEY NOT NULL,
	"author_user_id" varchar(64) NOT NULL,
	"post_type" varchar(32) NOT NULL,
	"content" text NOT NULL,
	"moderation_status" varchar(32) DEFAULT 'PUBLISHED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "continuity_policies" (
	"policy_id" varchar(64) PRIMARY KEY NOT NULL,
	"founder_last_heartbeat_at" timestamp with time zone NOT NULL,
	"inactivity_threshold_days" integer DEFAULT 30 NOT NULL,
	"designated_quorum_roles_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "federation_clients" (
	"client_id" varchar(64) PRIMARY KEY NOT NULL,
	"org_id" varchar(64) NOT NULL,
	"api_key_hash" char(64) NOT NULL,
	"allowed_scopes_json" jsonb NOT NULL,
	"status" varchar(32) DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "federation_clients_api_key_hash_unique" UNIQUE("api_key_hash")
);
--> statement-breakpoint
CREATE TABLE "governance_proposals" (
	"proposal_id" varchar(64) PRIMARY KEY NOT NULL,
	"department_id" "governance_department_enum" NOT NULL,
	"action_type" varchar(64) NOT NULL,
	"proposed_by_user_id" varchar(64) NOT NULL,
	"co_signed_by_user_ids_json" jsonb NOT NULL,
	"required_quorum_count" integer DEFAULT 2 NOT NULL,
	"quorum_met" boolean DEFAULT false NOT NULL,
	"timelock_expires_at" timestamp with time zone NOT NULL,
	"executed_at" timestamp with time zone,
	"status" varchar(32) DEFAULT 'PENDING_QUORUM' NOT NULL,
	CONSTRAINT "chk_governance_proposals_quorum_floor" CHECK ("governance_proposals"."required_quorum_count" >= 2)
);
--> statement-breakpoint
CREATE TABLE "historical_recognitions" (
	"legend_id" varchar(64) PRIMARY KEY NOT NULL,
	"honoree_name_en" varchar(200) NOT NULL,
	"honoree_name_ne" varchar(200) NOT NULL,
	"achievement_summary" text NOT NULL,
	"historical_date" varchar(32) NOT NULL,
	"authoritative_sources_json" jsonb NOT NULL,
	"family_representative_consent_notes" text NOT NULL,
	"approved_by_editorial_panel" boolean DEFAULT false NOT NULL,
	"excluded_from_competitive_leaderboards" boolean DEFAULT true NOT NULL,
	CONSTRAINT "chk_historical_recognitions_non_competitive" CHECK ("historical_recognitions"."excluded_from_competitive_leaderboards" = TRUE)
);
--> statement-breakpoint
CREATE TABLE "moderation_cases" (
	"mod_case_id" varchar(64) PRIMARY KEY NOT NULL,
	"target_type" varchar(64) NOT NULL,
	"target_id" varchar(64) NOT NULL,
	"reason" text NOT NULL,
	"moderator_user_id" varchar(64) NOT NULL,
	"action_taken" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy_versions" (
	"version_id" varchar(32) PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"approved_by_proposal_id" varchar(64),
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"event_id" varchar(64) PRIMARY KEY NOT NULL,
	"incident_id" varchar(64),
	"severity" "security_severity_enum" NOT NULL,
	"event_type" varchar(64) NOT NULL,
	"actor_user_id" varchar(64),
	"summary" text NOT NULL,
	"prev_event_hash" char(64) NOT NULL,
	"current_event_hash" char(64) NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "security_events_current_event_hash_unique" UNIQUE("current_event_hash")
);
--> statement-breakpoint
CREATE TABLE "security_incidents" (
	"incident_id" varchar(64) PRIMARY KEY NOT NULL,
	"severity" "security_severity_enum" NOT NULL,
	"category" varchar(64) NOT NULL,
	"containment_action" text NOT NULL,
	"regulatory_notice_required" boolean DEFAULT false NOT NULL,
	"status" varchar(32) DEFAULT 'OPEN' NOT NULL,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"setting_key" varchar(64) PRIMARY KEY NOT NULL,
	"setting_value_json" jsonb NOT NULL,
	"is_constitutional_lock" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_strings" (
	"string_id" varchar(64) PRIMARY KEY NOT NULL,
	"locale" "supported_locale_enum" NOT NULL,
	"translation_key" varchar(120) NOT NULL,
	"translated_text" text NOT NULL,
	"review_status" varchar(32) DEFAULT 'HUMAN_VERIFIED' NOT NULL,
	"policy_version" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transparency_reports" (
	"report_id" varchar(64) PRIMARY KEY NOT NULL,
	"period_key" varchar(32) NOT NULL,
	"applications_reviewed_count" integer DEFAULT 0 NOT NULL,
	"approved_count" integer DEFAULT 0 NOT NULL,
	"rejected_count" integer DEFAULT 0 NOT NULL,
	"appeals_upheld_count" integer DEFAULT 0 NOT NULL,
	"revocations_count" integer DEFAULT 0 NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transparency_reports_period_key_unique" UNIQUE("period_key")
);
--> statement-breakpoint
CREATE TABLE "user_federation_consents" (
	"consent_id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"org_id" varchar(64) NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "whistleblower_reports" (
	"report_id" varchar(64) PRIMARY KEY NOT NULL,
	"receipt_code_hash" char(64) NOT NULL,
	"category" varchar(64) NOT NULL,
	"encrypted_narrative" text NOT NULL,
	"assigned_internal_auditor_id" varchar(64),
	"privacy_tier" "data_privacy_tier_enum" DEFAULT 'TIER_4_REGULATED_PII' NOT NULL,
	"status" varchar(32) DEFAULT 'SUBMITTED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whistleblower_reports_receipt_code_hash_unique" UNIQUE("receipt_code_hash")
);
--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deletion_requests" ADD CONSTRAINT "deletion_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "privacy_requests" ADD CONSTRAINT "privacy_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_granted_by_user_id_users_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_eligible_routes" ADD CONSTRAINT "achievement_eligible_routes_achievement_id_achievements_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("achievement_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_category_id_adventure_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."adventure_categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adventure_categories" ADD CONSTRAINT "adventure_categories_macro_domain_id_macro_domains_domain_id_fk" FOREIGN KEY ("macro_domain_id") REFERENCES "public"."macro_domains"("domain_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_standards" ADD CONSTRAINT "verification_standards_category_id_adventure_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."adventure_categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_quality_audits" ADD CONSTRAINT "destination_quality_audits_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_routes" ADD CONSTRAINT "destination_routes_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_sources" ADD CONSTRAINT "destination_sources_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_updates" ADD CONSTRAINT "destination_updates_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_updates" ADD CONSTRAINT "destination_updates_proposed_by_user_id_users_id_fk" FOREIGN KEY ("proposed_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_updates" ADD CONSTRAINT "destination_updates_approved_by_dept_user_id_users_id_fk" FOREIGN KEY ("approved_by_dept_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_region_id_geographical_regions_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."geographical_regions"("region_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_primary_category_id_adventure_categories_category_id_fk" FOREIGN KEY ("primary_category_id") REFERENCES "public"."adventure_categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "geographical_regions" ADD CONSTRAINT "geographical_regions_parent_region_id_geographical_regions_region_id_fk" FOREIGN KEY ("parent_region_id") REFERENCES "public"."geographical_regions"("region_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safety_advisories" ADD CONSTRAINT "safety_advisories_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safety_advisories" ADD CONSTRAINT "safety_advisories_route_id_destination_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_condition_reports" ADD CONSTRAINT "trail_condition_reports_route_id_destination_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_condition_reports" ADD CONSTRAINT "trail_condition_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_achievements" ADD CONSTRAINT "environmental_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_achievements" ADD CONSTRAINT "environmental_achievements_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_achievements" ADD CONSTRAINT "environmental_achievements_campaign_id_environmental_campaigns_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."environmental_campaigns"("campaign_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_achievements" ADD CONSTRAINT "environmental_achievements_verified_by_reviewer_id_users_id_fk" FOREIGN KEY ("verified_by_reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_campaigns" ADD CONSTRAINT "environmental_campaigns_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_applications" ADD CONSTRAINT "achievement_applications_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_applications" ADD CONSTRAINT "achievement_applications_category_id_adventure_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."adventure_categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_applications" ADD CONSTRAINT "achievement_applications_achievement_id_achievements_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("achievement_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_applications" ADD CONSTRAINT "achievement_applications_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_applications" ADD CONSTRAINT "achievement_applications_route_id_destination_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecf_override_audit_logs" ADD CONSTRAINT "ecf_override_audit_logs_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecf_override_audit_logs" ADD CONSTRAINT "ecf_override_audit_logs_primary_senior_reviewer_id_users_id_fk" FOREIGN KEY ("primary_senior_reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecf_override_audit_logs" ADD CONSTRAINT "ecf_override_audit_logs_co_signing_senior_reviewer_id_users_id_fk" FOREIGN KEY ("co_signing_senior_reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecf_override_audit_logs" ADD CONSTRAINT "ecf_override_audit_logs_verification_lead_approval_id_users_id_fk" FOREIGN KEY ("verification_lead_approval_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_access_logs" ADD CONSTRAINT "evidence_access_logs_evidence_id_evidence_files_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_files"("evidence_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_access_logs" ADD CONSTRAINT "evidence_access_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_confidence_assessments" ADD CONSTRAINT "evidence_confidence_assessments_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_files" ADD CONSTRAINT "evidence_files_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_files" ADD CONSTRAINT "evidence_files_uploader_user_id_users_id_fk" FOREIGN KEY ("uploader_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_hashes" ADD CONSTRAINT "evidence_hashes_evidence_id_evidence_files_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_files"("evidence_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offline_sync_receipts" ADD CONSTRAINT "offline_sync_receipts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offline_sync_receipts" ADD CONSTRAINT "offline_sync_receipts_server_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("server_application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "witness_attestations" ADD CONSTRAINT "witness_attestations_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "witness_attestations" ADD CONSTRAINT "witness_attestations_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "witness_attestations" ADD CONSTRAINT "witness_attestations_witness_user_id_users_id_fk" FOREIGN KEY ("witness_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_assignments" ADD CONSTRAINT "appeal_assignments_appeal_id_appeal_cases_appeal_id_fk" FOREIGN KEY ("appeal_id") REFERENCES "public"."appeal_cases"("appeal_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_assignments" ADD CONSTRAINT "appeal_assignments_appeal_reviewer_user_id_users_id_fk" FOREIGN KEY ("appeal_reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_cases" ADD CONSTRAINT "appeal_cases_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_cases" ADD CONSTRAINT "appeal_cases_original_case_id_verification_cases_case_id_fk" FOREIGN KEY ("original_case_id") REFERENCES "public"."verification_cases"("case_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_cases" ADD CONSTRAINT "appeal_cases_appellant_user_id_users_id_fk" FOREIGN KEY ("appellant_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal_cases" ADD CONSTRAINT "appeal_cases_assigned_appeal_reviewer_id_users_id_fk" FOREIGN KEY ("assigned_appeal_reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibration_tests" ADD CONSTRAINT "calibration_tests_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fraud_investigations" ADD CONSTRAINT "fraud_investigations_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fraud_investigations" ADD CONSTRAINT "fraud_investigations_matched_evidence_id_evidence_files_evidence_id_fk" FOREIGN KEY ("matched_evidence_id") REFERENCES "public"."evidence_files"("evidence_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fraud_investigations" ADD CONSTRAINT "fraud_investigations_investigator_reviewer_id_users_id_fk" FOREIGN KEY ("investigator_reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_accreditations" ADD CONSTRAINT "reviewer_accreditations_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_decisions" ADD CONSTRAINT "reviewer_decisions_case_id_verification_cases_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."verification_cases"("case_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_decisions" ADD CONSTRAINT "reviewer_decisions_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_assignments" ADD CONSTRAINT "verification_assignments_case_id_verification_cases_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."verification_cases"("case_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_assignments" ADD CONSTRAINT "verification_assignments_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_cases" ADD CONSTRAINT "verification_cases_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_achievement_id_achievements_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("achievement_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_credential_id_credential_registry_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credential_registry"("credential_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_lifecycle_events" ADD CONSTRAINT "credential_lifecycle_events_credential_id_credential_registry_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credential_registry"("credential_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_subject_user_id_users_id_fk" FOREIGN KEY ("subject_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_application_id_achievement_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."achievement_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_verification_case_id_verification_cases_case_id_fk" FOREIGN KEY ("verification_case_id") REFERENCES "public"."verification_cases"("case_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_achievement_id_achievements_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("achievement_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_route_id_destination_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_registry" ADD CONSTRAINT "credential_registry_badge_id_badges_badge_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("badge_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_snapshots" ADD CONSTRAINT "leaderboard_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portable_credential_exports" ADD CONSTRAINT "portable_credential_exports_credential_id_credential_registry_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credential_registry"("credential_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_credentials" ADD CONSTRAINT "public_credentials_credential_id_credential_registry_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credential_registry"("credential_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_listing_id_marketplace_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."marketplace_listings"("listing_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_adventurer_user_id_users_id_fk" FOREIGN KEY ("adventurer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_guide_user_id_users_id_fk" FOREIGN KEY ("guide_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_request_id_booking_requests_booking_request_id_fk" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("booking_request_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_booking_id_bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("booking_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_resolved_by_staff_id_users_id_fk" FOREIGN KEY ("resolved_by_staff_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_insurance_records" ADD CONSTRAINT "guide_insurance_records_guide_id_guide_profiles_guide_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guide_profiles"("guide_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_profiles" ADD CONSTRAINT "guide_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_profiles" ADD CONSTRAINT "guide_profiles_company_org_id_organizations_org_id_fk" FOREIGN KEY ("company_org_id") REFERENCES "public"."organizations"("org_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_qualifications" ADD CONSTRAINT "guide_qualifications_guide_id_guide_profiles_guide_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guide_profiles"("guide_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_qualifications" ADD CONSTRAINT "guide_qualifications_verified_by_staff_id_users_id_fk" FOREIGN KEY ("verified_by_staff_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_route_id_destination_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_org_id_organizations_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("org_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("booking_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_campaign_id_sponsor_campaigns_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."sponsor_campaigns"("campaign_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_reconciliations" ADD CONSTRAINT "financial_reconciliations_audited_by_user_id_users_id_fk" FOREIGN KEY ("audited_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_invoice_id_invoices_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("invoice_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payment_records_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment_records"("payment_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_campaigns" ADD CONSTRAINT "sponsor_campaigns_sponsor_id_sponsors_sponsor_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("sponsor_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscriber_user_id_users_id_fk" FOREIGN KEY ("subscriber_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscriber_org_id_organizations_org_id_fk" FOREIGN KEY ("subscriber_org_id") REFERENCES "public"."organizations"("org_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_clients" ADD CONSTRAINT "federation_clients_org_id_organizations_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("org_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "governance_proposals" ADD CONSTRAINT "governance_proposals_proposed_by_user_id_users_id_fk" FOREIGN KEY ("proposed_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_cases" ADD CONSTRAINT "moderation_cases_moderator_user_id_users_id_fk" FOREIGN KEY ("moderator_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_incident_id_security_incidents_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."security_incidents"("incident_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_strings" ADD CONSTRAINT "translation_strings_policy_version_policy_versions_version_id_fk" FOREIGN KEY ("policy_version") REFERENCES "public"."policy_versions"("version_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_consents" ADD CONSTRAINT "user_federation_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_consents" ADD CONSTRAINT "user_federation_consents_org_id_organizations_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("org_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whistleblower_reports" ADD CONSTRAINT "whistleblower_reports_assigned_internal_auditor_id_users_id_fk" FOREIGN KEY ("assigned_internal_auditor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_consent_records_user_id" ON "consent_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_deletion_requests_user_id" ON "deletion_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_privacy_requests_user_id" ON "privacy_requests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_role_assignments_user_role" ON "role_assignments" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "idx_role_assignments_user_id" ON "role_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("account_status");--> statement-breakpoint
CREATE INDEX "idx_users_residency" ON "users" USING btree ("residency_region");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_achievement_eligible_routes" ON "achievement_eligible_routes" USING btree ("achievement_id","route_id");--> statement-breakpoint
CREATE INDEX "idx_destination_routes_dest" ON "destination_routes" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "idx_destination_sources_dest" ON "destination_sources" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "idx_destinations_region" ON "destinations" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "idx_destinations_category" ON "destinations" USING btree ("primary_category_id");--> statement-breakpoint
CREATE INDEX "idx_destinations_status" ON "destinations" USING btree ("verification_status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_challenge_participants_challenge_user" ON "challenge_participants" USING btree ("challenge_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_applications_applicant" ON "achievement_applications" USING btree ("applicant_user_id");--> statement-breakpoint
CREATE INDEX "idx_applications_destination" ON "achievement_applications" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "idx_applications_status" ON "achievement_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_evidence_access_logs_evidence" ON "evidence_access_logs" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "idx_evidence_files_application" ON "evidence_files" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "idx_evidence_hashes_sha256" ON "evidence_hashes" USING btree ("sha256_hex");--> statement-breakpoint
CREATE INDEX "idx_evidence_hashes_phash" ON "evidence_hashes" USING btree ("p_hash_64_hex");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_witness_attestation_app_witness" ON "witness_attestations" USING btree ("application_id","witness_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_appeal_assignments_appeal_reviewer" ON "appeal_assignments" USING btree ("appeal_id","appeal_reviewer_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_reviewer_decisions_case_reviewer" ON "reviewer_decisions" USING btree ("case_id","reviewer_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_verification_assignments_case_reviewer" ON "verification_assignments" USING btree ("case_id","reviewer_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_verification_assignments_case_slot" ON "verification_assignments" USING btree ("case_id","reviewer_slot");--> statement-breakpoint
CREATE INDEX "idx_verification_cases_status" ON "verification_cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_credential_lifecycle_credential" ON "credential_lifecycle_events" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "idx_credential_registry_subject" ON "credential_registry" USING btree ("subject_user_id");--> statement-breakpoint
CREATE INDEX "idx_credential_registry_destination" ON "credential_registry" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_snapshots_scope" ON "leaderboard_snapshots" USING btree ("board_scope","scope_key");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_organization_members_org_user" ON "organization_members" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_sequence" ON "audit_logs" USING btree ("sequence_number");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "idx_security_events_incident" ON "security_events" USING btree ("incident_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_translation_strings_locale_key_ver" ON "translation_strings" USING btree ("locale","translation_key","policy_version");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_federation_consents_user_org" ON "user_federation_consents" USING btree ("user_id","org_id");