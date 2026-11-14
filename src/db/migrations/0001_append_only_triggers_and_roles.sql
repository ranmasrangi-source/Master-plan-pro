-- ============================================================================
-- 0 TO 8848 — Global Adventure Achievement Platform
-- Phase 05 Migration 0001: Cross-Domain Foreign Keys, Append-Only Ledger Triggers,
-- Non-Transferable Credential Guards, Governance Quorum Enforcement, and
-- Least-Privilege Departmental PostgreSQL Roles (Explicit SQLSTATE '42501')
-- ============================================================================

-- 1. Cross-Domain Foreign Keys (Resolving 7-Tier DAG Inter-Domain Links)
ALTER TABLE "role_assignments"
  ADD CONSTRAINT "role_assignments_granted_by_proposal_id_fk"
  FOREIGN KEY ("granted_by_proposal_id") REFERENCES "public"."governance_proposals"("proposal_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "consent_records"
  ADD CONSTRAINT "consent_records_policy_version_fk"
  FOREIGN KEY ("policy_version") REFERENCES "public"."policy_versions"("version_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "achievements"
  ADD CONSTRAINT "achievements_destination_id_fk"
  FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "achievements"
  ADD CONSTRAINT "achievements_effective_policy_version_fk"
  FOREIGN KEY ("effective_policy_version") REFERENCES "public"."policy_versions"("version_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "achievement_eligible_routes"
  ADD CONSTRAINT "achievement_eligible_routes_route_id_fk"
  FOREIGN KEY ("route_id") REFERENCES "public"."destination_routes"("route_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "verification_standards"
  ADD CONSTRAINT "verification_standards_policy_version_fk"
  FOREIGN KEY ("policy_version") REFERENCES "public"."policy_versions"("version_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "environmental_campaigns"
  ADD CONSTRAINT "environmental_campaigns_organizer_org_id_fk"
  FOREIGN KEY ("organizer_org_id") REFERENCES "public"."organizations"("org_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "environmental_achievements"
  ADD CONSTRAINT "environmental_achievements_receipt_evidence_id_fk"
  FOREIGN KEY ("receipt_evidence_id") REFERENCES "public"."evidence_files"("evidence_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "deletion_requests"
  ADD CONSTRAINT "deletion_requests_target_evidence_id_fk"
  FOREIGN KEY ("target_evidence_id") REFERENCES "public"."evidence_files"("evidence_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

-- 2. Immutable Append-Only Ledger Protection Trigger (Explicit SQLSTATE '42501')
CREATE OR REPLACE FUNCTION public.prevent_append_only_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'IMMUTABLE_LEDGER_VIOLATION: Table "%" is strictly append-only. % operations are prohibited by the 0 TO 8848 Project Constitution.', TG_TABLE_NAME, TG_OP
    USING ERRCODE = '42501';
END;
$$;

-- Attach BEFORE UPDATE OR DELETE (Row) and BEFORE TRUNCATE (Statement) to all 6 immutable tables:
-- (1) evidence_hashes
DROP TRIGGER IF EXISTS trg_evidence_hashes_no_update_delete ON public.evidence_hashes;
CREATE TRIGGER trg_evidence_hashes_no_update_delete
  BEFORE UPDATE OR DELETE ON public.evidence_hashes
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_evidence_hashes_no_truncate ON public.evidence_hashes;
CREATE TRIGGER trg_evidence_hashes_no_truncate
  BEFORE TRUNCATE ON public.evidence_hashes
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- (2) evidence_access_logs
DROP TRIGGER IF EXISTS trg_evidence_access_logs_no_update_delete ON public.evidence_access_logs;
CREATE TRIGGER trg_evidence_access_logs_no_update_delete
  BEFORE UPDATE OR DELETE ON public.evidence_access_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_evidence_access_logs_no_truncate ON public.evidence_access_logs;
CREATE TRIGGER trg_evidence_access_logs_no_truncate
  BEFORE TRUNCATE ON public.evidence_access_logs
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- (3) ecf_override_audit_logs
DROP TRIGGER IF EXISTS trg_ecf_override_audit_logs_no_update_delete ON public.ecf_override_audit_logs;
CREATE TRIGGER trg_ecf_override_audit_logs_no_update_delete
  BEFORE UPDATE OR DELETE ON public.ecf_override_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_ecf_override_audit_logs_no_truncate ON public.ecf_override_audit_logs;
CREATE TRIGGER trg_ecf_override_audit_logs_no_truncate
  BEFORE TRUNCATE ON public.ecf_override_audit_logs
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- (4) credential_lifecycle_events
DROP TRIGGER IF EXISTS trg_credential_lifecycle_events_no_update_delete ON public.credential_lifecycle_events;
CREATE TRIGGER trg_credential_lifecycle_events_no_update_delete
  BEFORE UPDATE OR DELETE ON public.credential_lifecycle_events
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_credential_lifecycle_events_no_truncate ON public.credential_lifecycle_events;
CREATE TRIGGER trg_credential_lifecycle_events_no_truncate
  BEFORE TRUNCATE ON public.credential_lifecycle_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- (5) audit_logs
DROP TRIGGER IF EXISTS trg_audit_logs_no_update_delete ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_no_update_delete
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_audit_logs_no_truncate ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_no_truncate
  BEFORE TRUNCATE ON public.audit_logs
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- (6) security_events
DROP TRIGGER IF EXISTS trg_security_events_no_update_delete ON public.security_events;
CREATE TRIGGER trg_security_events_no_update_delete
  BEFORE UPDATE OR DELETE ON public.security_events
  FOR EACH ROW EXECUTE FUNCTION public.prevent_append_only_mutation();

DROP TRIGGER IF EXISTS trg_security_events_no_truncate ON public.security_events;
CREATE TRIGGER trg_security_events_no_truncate
  BEFORE TRUNCATE ON public.security_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_append_only_mutation();

-- 3. Non-Transferable Credential & Anti-Deletion Trigger on credential_registry (SQLSTATE '42501')
CREATE OR REPLACE FUNCTION public.enforce_credential_registry_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' OR TG_OP = 'TRUNCATE' THEN
    RAISE EXCEPTION 'CREDENTIAL_LEDGER_DELETE_FORBIDDEN: Credentials in credential_registry cannot be deleted (use status REVOKED with a credential_lifecycle_events record).'
      USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.credential_id <> OLD.credential_id
       OR NEW.subject_user_id <> OLD.subject_user_id
       OR NEW.application_id <> OLD.application_id
       OR NEW.verification_case_id <> OLD.verification_case_id
       OR NEW.achievement_id <> OLD.achievement_id
       OR NEW.destination_id <> OLD.destination_id
       OR NEW.route_id <> OLD.route_id
       OR NEW.badge_id <> OLD.badge_id
       OR NEW.certificate_id <> OLD.certificate_id
       OR NEW.completion_date <> OLD.completion_date THEN
      RAISE EXCEPTION 'NON_TRANSFERABLE_CREDENTIAL_VIOLATION: Credential ownership (subject_user_id) and core achievement provenance fields are permanently non-transferable and immutable.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credential_registry_immutability ON public.credential_registry;
CREATE TRIGGER trg_credential_registry_immutability
  BEFORE UPDATE OR DELETE ON public.credential_registry
  FOR EACH ROW EXECUTE FUNCTION public.enforce_credential_registry_immutability();

DROP TRIGGER IF EXISTS trg_credential_registry_no_truncate ON public.credential_registry;
CREATE TRIGGER trg_credential_registry_no_truncate
  BEFORE TRUNCATE ON public.credential_registry
  FOR EACH STATEMENT EXECUTE FUNCTION public.enforce_credential_registry_immutability();

-- 4. Privileged Role Assignment Governance Proposal & Anti-Self-Promotion Trigger (SQLSTATE '42501')
CREATE OR REPLACE FUNCTION public.enforce_privileged_role_governance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_is_privileged BOOLEAN;
  v_quorum_met BOOLEAN;
  v_proposal_status VARCHAR(32);
BEGIN
  SELECT is_privileged INTO v_is_privileged
  FROM public.roles
  WHERE role_id = NEW.role_id;

  IF v_is_privileged IS TRUE THEN
    IF NEW.granted_by_user_id IS NOT NULL AND NEW.granted_by_user_id = NEW.user_id THEN
      RAISE EXCEPTION 'ROLE_SELF_PROMOTION_FORBIDDEN: Privileged role "%" cannot be self-assigned by user "%".', NEW.role_id, NEW.user_id
        USING ERRCODE = '42501';
    END IF;

    IF NEW.granted_by_proposal_id IS NULL THEN
      RAISE EXCEPTION 'GOVERNANCE_PROPOSAL_REQUIRED: Privileged role "%" assignment requires an approved governance_proposals reference.', NEW.role_id
        USING ERRCODE = '42501';
    END IF;

    SELECT quorum_met, status INTO v_quorum_met, v_proposal_status
    FROM public.governance_proposals
    WHERE proposal_id = NEW.granted_by_proposal_id;

    IF v_quorum_met IS NOT TRUE OR v_proposal_status <> 'EXECUTED' THEN
      RAISE EXCEPTION 'GOVERNANCE_QUORUM_NOT_EXECUTED: Governance proposal "%" must have quorum_met = TRUE and status = EXECUTED before granting privileged role "%".', NEW.granted_by_proposal_id, NEW.role_id
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_role_assignments_governance_check ON public.role_assignments;
CREATE TRIGGER trg_role_assignments_governance_check
  BEFORE INSERT OR UPDATE ON public.role_assignments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_privileged_role_governance();

-- 5. Independent Appeal Exclusion Trigger (Blocks Original Reviewers from Appeal Assignment — SQLSTATE '42501')
CREATE OR REPLACE FUNCTION public.enforce_appeal_reviewer_independence()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_excluded_json JSONB;
  v_appellant_id VARCHAR(64);
BEGIN
  SELECT excluded_reviewer_ids_json, appellant_user_id
  INTO v_excluded_json, v_appellant_id
  FROM public.appeal_cases
  WHERE appeal_id = NEW.appeal_id;

  IF NEW.appeal_reviewer_user_id = v_appellant_id THEN
    RAISE EXCEPTION 'APPEAL_SELF_REVIEW_FORBIDDEN: Appellant "%" cannot be assigned to their own appeal.', NEW.appeal_reviewer_user_id
      USING ERRCODE = '42501';
  END IF;

  IF v_excluded_json IS NOT NULL AND v_excluded_json ? NEW.appeal_reviewer_user_id THEN
    RAISE EXCEPTION 'APPEAL_INDEPENDENCE_VIOLATION: Reviewer "%" participated in the original verification case and is hard-blocked from appeal "%".', NEW.appeal_reviewer_user_id, NEW.appeal_id
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_appeal_assignments_independence ON public.appeal_assignments;
CREATE TRIGGER trg_appeal_assignments_independence
  BEFORE INSERT OR UPDATE ON public.appeal_assignments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_appeal_reviewer_independence();

-- 6. Raw Evidence Post-Approval Purge Legal-Hold Protection Trigger (SQLSTATE '42501')
CREATE OR REPLACE FUNCTION public.enforce_evidence_legal_hold_protection()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_app_status VARCHAR(64);
  v_active_hold_count INTEGER;
BEGIN
  IF NEW.raw_binary_deleted_post_approval IS TRUE AND OLD.raw_binary_deleted_post_approval IS FALSE THEN
    SELECT status:: VARCHAR INTO v_app_status
    FROM public.achievement_applications
    WHERE application_id = NEW.application_id;

    IF v_app_status = 'UNDER_INVESTIGATION' THEN
      RAISE EXCEPTION 'LEGAL_HOLD_ACTIVE_EVIDENCE_PURGE_FORBIDDEN: Cannot purge raw binary for evidence "%" while application "%" is UNDER_INVESTIGATION.', NEW.evidence_id, NEW.application_id
        USING ERRCODE = '42501';
    END IF;

    SELECT COUNT(*) INTO v_active_hold_count
    FROM public.deletion_requests
    WHERE target_evidence_id = NEW.evidence_id
      AND legal_hold_active IS TRUE;

    IF v_active_hold_count > 0 THEN
      RAISE EXCEPTION 'LEGAL_HOLD_ACTIVE_EVIDENCE_PURGE_FORBIDDEN: Cannot purge raw binary for evidence "%" while a deletion_requests legal hold is active.', NEW.evidence_id
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_evidence_files_legal_hold_protection ON public.evidence_files;
CREATE TRIGGER trg_evidence_files_legal_hold_protection
  BEFORE UPDATE ON public.evidence_files
  FOR EACH ROW EXECUTE FUNCTION public.enforce_evidence_legal_hold_protection();

-- 7. Departmental Database Roles, Least-Privilege Grants & Row-Level Isolation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_public_readonly') THEN
    CREATE ROLE app_public_readonly NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_adventurer_role') THEN
    CREATE ROLE app_adventurer_role NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_verification_dept03') THEN
    CREATE ROLE app_verification_dept03 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_appeal_dept04') THEN
    CREATE ROLE app_appeal_dept04 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_security_dept05') THEN
    CREATE ROLE app_security_dept05 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_finance_dept06') THEN
    CREATE ROLE app_finance_dept06 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_system_admin_dept07') THEN
    CREATE ROLE app_system_admin_dept07 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_internal_audit_dept11') THEN
    CREATE ROLE app_internal_audit_dept11 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_ai_assistive_readonly') THEN
    CREATE ROLE app_ai_assistive_readonly NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;

-- Default-deny baseline: Revoke all table privileges from PUBLIC and departmental roles first
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM
  app_public_readonly,
  app_adventurer_role,
  app_verification_dept03,
  app_appeal_dept04,
  app_security_dept05,
  app_finance_dept06,
  app_system_admin_dept07,
  app_internal_audit_dept11,
  app_ai_assistive_readonly;

GRANT USAGE ON SCHEMA public TO
  app_public_readonly,
  app_adventurer_role,
  app_verification_dept03,
  app_appeal_dept04,
  app_security_dept05,
  app_finance_dept06,
  app_system_admin_dept07,
  app_internal_audit_dept11,
  app_ai_assistive_readonly;

-- (A) app_public_readonly: TIER_1_PUBLIC tables only
GRANT SELECT ON
  public.macro_domains,
  public.adventure_categories,
  public.geographical_regions,
  public.destinations,
  public.destination_sources,
  public.destination_routes,
  public.safety_advisories,
  public.badges,
  public.public_credentials,
  public.leaderboard_snapshots,
  public.transparency_reports,
  public.historical_recognitions,
  public.translation_strings,
  public.system_settings,
  public.policy_versions
TO app_public_readonly;

-- (B) app_verification_dept03 (DEPT-03): Verification & Evidence tables ONLY
-- Strictly airgapped (ZERO SELECT/WRITE) from Domain 9 commercial tables (sponsors, subscriptions, invoices, payment_records)
-- and ZERO access to whistleblower_reports
GRANT SELECT ON
  public.users,
  public.macro_domains,
  public.adventure_categories,
  public.achievements,
  public.achievement_eligible_routes,
  public.verification_standards,
  public.destinations,
  public.destination_routes,
  public.organization_members,
  public.booking_requests,
  public.witness_attestations,
  public.reviewer_accreditations,
  public.calibration_tests
TO app_verification_dept03;

GRANT SELECT, INSERT, UPDATE ON
  public.achievement_applications,
  public.evidence_files,
  public.evidence_confidence_assessments,
  public.verification_cases,
  public.verification_assignments,
  public.reviewer_decisions,
  public.fraud_investigations
TO app_verification_dept03;

GRANT SELECT, INSERT ON
  public.evidence_hashes,
  public.evidence_access_logs,
  public.ecf_override_audit_logs,
  public.audit_logs
TO app_verification_dept03;

-- (C) app_appeal_dept04 (DEPT-04): Independent Appeal tables ONLY (Zero access to Domain 9 commercial tables)
GRANT SELECT ON
  public.users,
  public.achievement_applications,
  public.evidence_files,
  public.evidence_hashes,
  public.evidence_confidence_assessments,
  public.verification_cases,
  public.verification_assignments,
  public.reviewer_decisions
TO app_appeal_dept04;

GRANT SELECT, INSERT, UPDATE ON
  public.appeal_cases,
  public.appeal_assignments
TO app_appeal_dept04;

GRANT SELECT, INSERT ON
  public.evidence_access_logs,
  public.audit_logs,
  public.security_events
TO app_appeal_dept04;

-- (D) app_security_dept05 (DEPT-05): Read-only audit monitoring + incident containment (Cannot alter evidence_hashes or credential_registry)
GRANT SELECT ON
  public.audit_logs,
  public.evidence_access_logs,
  public.evidence_hashes,
  public.credential_registry,
  public.credential_lifecycle_events,
  public.user_sessions
TO app_security_dept05;

GRANT SELECT, INSERT, UPDATE ON
  public.security_incidents
TO app_security_dept05;

GRANT SELECT, INSERT ON
  public.security_events,
  public.audit_logs
TO app_security_dept05;

-- (E) app_finance_dept06 (DEPT-06): Finance reconciliation tables ONLY (Zero write access to verification, credentials, or leaderboards)
GRANT SELECT ON
  public.sponsors,
  public.sponsor_campaigns,
  public.advertisements,
  public.subscriptions,
  public.invoices,
  public.payment_records,
  public.refunds
TO app_finance_dept06;

GRANT SELECT, INSERT ON
  public.financial_reconciliations,
  public.audit_logs
TO app_finance_dept06;

-- (F) app_system_admin_dept07 (DEPT-07): Operational administration, EXPLICITLY DENIED access to whistleblower_reports (DEPT-11 Vault)
GRANT SELECT, INSERT, UPDATE ON
  public.system_settings,
  public.aggregated_daily_metrics,
  public.backup_verification_logs
TO app_system_admin_dept07;

GRANT SELECT, INSERT ON
  public.audit_logs
TO app_system_admin_dept07;

REVOKE ALL ON public.whistleblower_reports FROM app_system_admin_dept07;

-- (G) app_internal_audit_dept11 (DEPT-11): Exclusive custodian of whistleblower_reports + full read-only audit access
GRANT SELECT, INSERT, UPDATE ON
  public.whistleblower_reports
TO app_internal_audit_dept11;

GRANT SELECT ON
  public.audit_logs,
  public.security_events,
  public.ecf_override_audit_logs,
  public.credential_Registry,
  public.credential_lifecycle_events,
  public.verification_cases,
  public.appeal_cases
TO app_internal_audit_dept11;

-- (H) app_ai_assistive_readonly: Strictly TIER_1_PUBLIC read + ai_audit_logs insert (ZERO access to PII, evidence, verification, or credentials)
GRANT SELECT ON
  public.macro_domains,
  public.adventure_categories,
  public.destinations,
  public.destination_routes,
  public.translation_strings
TO app_ai_assistive_readonly;

GRANT SELECT, INSERT ON
  public.ai_audit_logs
TO app_ai_assistive_readonly;
