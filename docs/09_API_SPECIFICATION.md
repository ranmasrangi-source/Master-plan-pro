# 09 — REST API SPECIFICATION & SECURITY CONTRACTS (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 02 — TECHNICAL ARCHITECTURE & SYSTEM DESIGN  
**Base URL:** `/api/v1`

---

## 1. Universal API Security & Envelope Standards
1. **Authentication & Session Integrity:** Protected endpoints require `Authorization: Bearer <JWT>` verified server-side against `user_sessions` (checking `revokedAt === null` and `mfaVerifiedAt !== null` for privileged/reviewer roles).
2. **Standard Response Envelope:**
   ```json
   {
     "success": true,
     "data": {},
     "meta": {
       "requestId": "req_20261112_001",
       "policyVersion": "v1.1.0",
       "locale": "en-US"
     }
   }
   ```
3. **Standard Error Envelope:**
   ```json
   {
     "success": false,
     "error": {
       "code": "CONSTITUTIONAL_LOCK_ACTIVE",
       "message": "Payment collection is disabled at initial launch per Section 58 of the Project Constitution.",
       "details": null
     }
   }
   ```

---

## 2. Endpoint Contracts by Bounded Domain

### 2.1 System Health, I18n & Constitutional Status
- `GET /api/v1/health`
  - **Auth:** Public
  - **Response `200 OK`:** Returns `{ status: "HEALTHY", paymentsEnabled: false, blockchainEnabled: false, aiFinalDecisionAllowed: false, databaseAdapter: "HYBRID_RELATIONAL_V1" }`.
- `GET /api/v1/i18n/:locale`
  - **Auth:** Public (`en`, `ne`, `hi`, `ar`, `es`, `fr`, `de`, `zh`, `ja`)
  - **Guard:** Filters for `reviewStatus === "HUMAN_VERIFIED"` on policy/legal strings.

### 2.2 Taxonomy, 100 Destinations, Routes & Safety Intelligence
- `GET /api/v1/categories`
  - **Auth:** Public
  - **Response:** Returns all 6 Macro-Domains (`MD-01..06`) and 24 Adventure Categories (`CAT-01..24`).
- `GET /api/v1/destinations`
  - **Query Params:** `?region=REG-MAHALANGUR&category=CAT-12&status=PROPOSED&lite=true`
  - **Response:** Returns the 100 Featured Destinations (`DEST-001..100`) with bilingual names (`nameEn`, `nameNe`), data-hygiene fields (`source_url`, `source_type`, `last_verified_date`, `confidence`, `unverified_fields`), `geopoliticalFlag` (`CHK-01.14`), `emergencySarProtocol` (`CHK-01.17`), and `seasonalRiskMatrix` (`CHK-01.18`). When `lite=true` (System #20), payload is compressed to `<15 KB`.
- `GET /api/v1/destinations/:destinationId/routes`
  - **Auth:** Public
  - **Response:** Returns separated `destinationRoutes` (`RTE-*`), elevation profiles, tabular accessible elevation points, and `NF-04` acclimatization guidance.
- `POST /api/v1/routes/:routeId/conditions` (`NF-02` Live Trail Conditions)
  - **Auth:** `verified_adventurer` | `professional_guide` | `destination_partner`
  - **Guard:** Initializes report as `UNCONFIRMED` with TTL expiry until corroborated by $\ge 2$ verified users or a licensed guide.

### 2.3 Achievement Applications, Evidence Custody, ECF & Witness Verification
- `POST /api/v1/applications`
  - **Auth:** `registered_adventurer`
  - **Body:** `{ achievementId, destinationId, routeId, attemptStartDate, attemptCompletionDate, dateCalendarSystem: "GREGORIAN_AD" | "BIKRAM_SAMBAT_BS", originalBsDateString, supplementalOxygenUsed, lntSelfScore, applicantDeclarationSigned: true }`
  - **Server Action:** Converts Bikram Sambat (`वि.सं.`) dates deterministically (`FQ-07`), validates route-to-achievement mapping, creates `achievementApplications` record.
- `POST /api/v1/applications/:applicationId/evidence`
  - **Auth:** Owner (`applicantUserId`)
  - **Server Action:**
    1. Validates MIME/magic-bytes and strips XXE from GPX XML.
    2. Masks 1.0 km residential start/end coordinates on GPX tracks.
    3. Computes `SHA-256` file digest + 64-bit DCT `pHash` ($H_{\text{norm}}$ and $H_{\text{mirror}}$) + Copernicus GLO-30 DEM $E_{\text{RMSE}}$ + West's ascent rate check $V_{\max}(h, \Delta t)$.
    4. Writes immutable `evidence_hashes` and `evidence_access_logs` entries.
    5. Computes 5-Pillar **Evidence Confidence Framework (`ECF`)** score (`0–160`). If `PIL-01 == 0` (GPS-only) or `totalConfidenceScore < 75`, sets application status to `MORE_EVIDENCE_REQUIRED`.
- `POST /api/v1/applications/:applicationId/witness-invite` & `POST /api/v1/witness/attest/:token`
  - **Auth:** Applicant (invite) / Witness token holder (attest)
  - **Security Control:** Blocks self-attestation (`witnessUserId === applicantUserId`), checks IP/device distinctness, and runs circular witness ring detection (`witnessEdges`).

### 2.4 Independent Human Verification & Business Firewall
- `GET /api/v1/verification/cases/:caseId`
  - **Auth:** `reviewer` | `senior_reviewer` | `heritage_guardian` (with active MFA)
  - **Business Independence Firewall:** Returns strictly typed `ReviewerCaseViewDTO`, which strips all commercial, subscription, marketplace, and sponsor fields.
- `POST /api/v1/verification/cases/:caseId/claim`
  - **Auth:** Accredited Reviewer
  - **Server COI Check:** Rejects with `403 COI_CONFLICT_DETECTED` if reviewer is applicant, shares an organization, has a marketplace booking with applicant, or has expired category accreditation (`System #7`).
- `POST /api/v1/verification/cases/:caseId/decide`
  - **Auth:** Assigned Reviewer(s)
  - **Dual-Senior & Heritage Guardian Gate:**
    - For `CAT-11`, `CAT-12`, `CAT-20`: Requires **2 independent `L3/L4` Senior Reviewer approvals** before status transitions to `APPROVED`. Split decisions transition to `ESCALATED_LEAD_REVIEW`.
    - For sacred destinations (`DEST-003` Kangchenjunga, `DEST-027` Kailash, `DEST-094` Aoraki): Enforces `NF-01` **Heritage Guardian** cultural compliance check (`FQ-09`).
- `POST /api/v1/verification/cases/:caseId/ecf-override`
  - **Auth:** Requires **2 Senior Reviewers + Verification Department Lead** co-signature.
  - **Guard:** Cannot override `PIL-02` GPS-only cases; writes hash-chained record to `ecf_override_audit_logs` (Amendment A3).

### 2.5 Independent Appeals
- `POST /api/v1/appeals`
  - **Auth:** `applicantUserId` (within 60 days of rejection)
- `POST /api/v1/appeals/:appealId/decide`
  - **Auth:** `appeal_reviewer` (`DEPT-04`)
  - **Hard Constitutional Guard:** Server verifies `!(request.user.id in appealCase.excludedReviewerIds)`. If an original reviewer attempts to claim or decide an appeal, the server rejects with `403 APPEAL_INDEPENDENCE_VIOLATION` and logs a `security_event`.

### 2.6 Badges, Certificates, Integrity Registry & Portability
- `GET /api/v1/credentials/verify/:credentialId`
  - **Auth:** Public (Zero-PII Portal)
  - **Response:** Queries `public_credentials` and `credential_registry` hash chain; returns validity status, badge spec, achievement, destination, completion date, issuer, and revocation history. Never exposes raw GPX tracks or identity documents.
- `GET /api/v1/credentials/:credentialId/export?format=w3c-vc|openbadge`
  - **Auth:** Credential owner or public verifier
  - **Response:** Returns cryptographically signed W3C Verifiable Credential JSON-LD (`v1.1`) or OpenBadges 3.0 payload (`System #10`).

### 2.7 Whistleblower Vault, Governance Quorum & Constitutional Locks
- `POST /api/v1/integrity/whistleblow`
  - **Auth:** Anonymous / Public or Authenticated
  - **Privacy Guard:** Middleware strips caller IP address, cookies, and session headers before writing encrypted payload to `whistleblower_reports` (`System #4`). Returns one-time anonymous tracking receipt code.
- `POST /api/v1/governance/proposals` & `POST /api/v1/governance/proposals/:id/cosign`
  - **Auth:** `founder` | `governance_member`
  - **Guard:** Enforces multi-signature quorum and 72-hour time-lock before executing policy or privileged role changes (`System #14`).
- `ALL /api/v1/payments/*`
  - **Constitutional Lock:** Always returns `HTTP 403 Locked` (`code: "PAYMENT_COLLECTION_DISABLED_BY_CONSTITUTION"`).
- `ALL /api/v1/blockchain/*`
  - **Constitutional Lock:** Always returns `HTTP 403 Locked` (`code: "BLOCKCHAIN_MODULE_DISABLED_BY_CONSTITUTION"`).
