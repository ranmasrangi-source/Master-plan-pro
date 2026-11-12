# 07 — SYSTEM ARCHITECTURE & SERVICE BOUNDARIES (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 02 — TECHNICAL ARCHITECTURE & SYSTEM DESIGN  
**Architecture Selection:** Option A — Hybrid / Repository-Abstracted Relational Architecture (Confirmed per `FQ-01` & Weighted Matrix `A5`)

---

## 1. Architectural Principles & Constitutional Invariants

1. **Authoritative Server & Database Core:** All state transitions affecting recognition, evidence hashes, reviewer assignments, appeals, credentials, and leaderboards execute exclusively on the server through ACID repository transactions (`IDatabaseRepository`). Client UI state is untrusted.
2. **Business Independence Firewall (System #12):** The Verification, Appeal, and Leaderboard domains are strictly airgapped from the Commercial domain (Marketplace, Subscriptions, Sponsorships). At both the TypeScript compiler level (`ReviewerCaseViewDTO` with `never` commercial properties) and runtime serializer level, reviewers are blinded to commercial status.
3. **Vendor Independence & 48-Hour Exit Architecture (System #13):** Domain services (`src/services/*`) depend strictly on vendor-neutral interfaces (`IDatabaseRepository`, `IStorageProvider`, `IAiAssistantProvider`), never directly on proprietary cloud SDKs.
4. **Hard-Locked Launch Controls:**
   - `PAYMENTS_ENABLED = false` (Enforced at configuration, middleware, and repository layers).
   - `BLOCKCHAIN_ENABLED = false` (Enforced at configuration, middleware, and adapter layers).
   - `AI_FINAL_DECISION_ALLOWED = false` (AI service accounts lack write permissions on `verificationCases`, `appealCases`, and `credentialRegistry`).

---

## 2. Logical Service Boundaries (25 Bounded Services)

```text
+---------------------------------------------------------------------------------------------------+
|                        PRESENTATION & CLIENT LAYER (React 19 + Vite + PWA)                        |
|  - 42 Public Website Routes  - Adventurer Vault  - Reviewer & Appeal Workspaces                   |
|  - WCAG 2.2 AA Accessible Maps + Tabular Alt     - Low-Bandwidth (<50KB) & Offline IndexedDB Sync |
|  - Bilingual EN + Nepali (Devanagari) + RTL (ar) - 3D Metallic Badge & QR Certificate Renderer    |
+---------------------------------------------------------------------------------------------------+
                                                 |
                                   HTTPS / TLS 1.3 + Bearer JWT
                                                 v
+---------------------------------------------------------------------------------------------------+
|                   SECURITY & CONSTITUTIONAL GATEWAY MIDDLEWARE (Express / Node)                   |
|  [1] Rate Limiter & Security Headers  [2] JWT & Session Validator  [3] 20-Role RBAC + MFA Guard   |
|  [4] Conflict-of-Interest (COI) Guard [5] Business Firewall Filter [6] Payment/Blockchain Locks   |
+---------------------------------------------------------------------------------------------------+
         |                                       |                                       |
         v                                       v                                       v
+---------------------------------+   +-----------------------------------+   +---------------------+
| PILLAR A: RECOGNITION CORE      |   | GOVERNANCE, SECURITY & AUDIT CORE |   | PILLAR B & C:       |
| (AIRGAPPED FROM COMMERCIAL)     |   |                                   |   | MARKETPLACE & NET   |
| - Taxonomic & Category Service  |   | - 11-Dept Governance Quorum Svc   |   | - Guide & License   |
| - Destination & Route Service   |   | - Whistleblower Zero-IP Vault     |   | - Marketplace Svc   |
| - Safety & Acclimatization Svc  |   | - Reviewer Accreditation & Calib  |   | - Organization &    |
| - Application & Custody Service |   | - Security Incident Intelligence  |   |   Federation API    |
| - 5-Pillar ECF Scoring Engine   |   | - Privacy, Retention & Erasure    |   | - Sponsor & Ad Svc  |
| - Witness & Anti-Collusion Svc  |   | - k-Anonymity (k>=5) Analytics    |   |   (Airgapped)       |
| - Scientific Anti-Fraud Engine  |   | - DR Backup & Hash Chain Verifier |   | - Community & LNT   |
| - Human Verification Engine     |   | - BS <-> Gregorian Date Converter |   | - Legends Archive   |
| - Independent Appeal Service    |   | - Governed Assistive AI Adapter   |   | - Financial Ledger  |
| - Credential Registry & W3C VC  |   +-----------------------------------+   |   (Payments Locked) |
| - Verified Leaderboard Engine   |                                           +---------------------+
+---------------------------------+
         |                                       |                                       |
         +---------------------------------------+---------------------------------------+
                                                 |
                                                 v
+---------------------------------------------------------------------------------------------------+
|               VENDOR-INDEPENDENT ABSTRACTION LAYER (/src/adapters/IDatabaseRepository)            |
|  - ACID Transactions  - Sovereign Residency Tagging (NP / EU / UAE / GLOBAL)  - Portable Snapshots|
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Data Flow Specifications

### 3.1 Evidence Ingestion & Chain-of-Custody Data Flow
1. Adventurer uploads file (Photo, Video, GPX/FIT, or Permit PDF/Scan) via `POST /api/v1/applications/:id/evidence`.
2. **Magic-Byte & XXE Sanitizer:** Rejects disguised executables or XML external entity payloads.
3. **Cryptographic Digest:** Server computes `SHA-256` binary digest (`crypto.createHash('sha256')`) before writing to `IStorageProvider`.
4. **Geospatial & Visual Forensics:**
   - For GPX: Masks 1.0 km residential start/end geozone (unless inside public trailhead polygon), interpolates Copernicus GLO-30 DEM elevation to compute $E_{\text{RMSE}}$, and checks West's physiological ascent envelope $V_{\max}(h, \Delta t)$.
   - For Images: Extracts EXIF (without penalizing stripped EXIF), computes 64-bit DCT `pHash` ($H_{\text{norm}}$ and $H_{\text{mirror}}$), and checks Hamming distance $D_H$ against historical uploads.
5. **Custody Record:** Appends immutable entry to `evidenceHashes` and `evidenceAccessLogs`.
6. **ECF Computation:** Recomputes 5-Pillar Evidence Confidence Score (`PIL-01` to `PIL-05`). If `PIL-01 == 0` (GPS-only) or $\text{ECF} < 75$, status locks to `MORE_EVIDENCE_REQUIRED`.

### 3.2 Conflict-Checked Human Verification & Dual-Senior Flow
1. Accredited Reviewer requests case assignment via `POST /api/v1/verification/:caseId/claim`.
2. **COI Engine Verification:** Queries `IDatabaseRepository` to confirm:
   - `reviewerId !== applicantId`
   - Zero shared membership in `organizationMembers`
   - Zero shared transactions in `bookingRequests`
   - Zero direct witness links in `witnessAttestations`
   - Active accreditation in `reviewerAccreditations` covering `application.categoryId` at the required tier (`L1..L4`).
3. **Sanitized Projection:** Server returns `ReviewerCaseViewDTO` (commercial/sponsor fields physically stripped).
4. **Decision & Dual-Senior Gate:**
   - Standard Categories (`CAT-01..10`, `13..19`, `21..24`): 1 accredited Reviewer/Senior Reviewer decision + random QA sampling (`10%–25%`).
   - Elite Categories (`CAT-11`, `CAT-12`, `CAT-20`): Requires **2 independent Senior Reviewers (`L3/L4`)** plus **Heritage Guardian (`NF-01`)** cultural sign-off where sacred protocols apply. Split decisions automatically escalate to `Verification Department Lead`.

### 3.3 Independent Appeal Flow
1. Rejected applicant files appeal within 60 days via `POST /api/v1/appeals`.
2. Server populates `appealCases.excludedReviewerIds` with all reviewers and senior reviewers who touched the original `verificationCase`.
3. `Appeal Reviewer` (from `DEPT-04`) is assigned only after passing `!(reviewerId in excludedReviewerIds)` and full COI checks.

---

## 4. Threat Model & Failure Handling Summary

| Failure / Threat Mode | Detection Mechanism | Fail-Safe Behaviour |
| :--- | :--- | :--- |
| **Database Connection / Transaction Failure** | ACID rollback in `IDatabaseRepository.withTransaction()` | Fails closed; zero partial credential issuance; returns structured `503` retryable error |
| **Hash Chain Mismatch in `credentialRegistry`** | Background `verifyRegistryHashChain()` integrity job | Raises `SEV-1` `securityIncident`, locks mutated credential to `UNDER_INVESTIGATION` |
| **Slow / Satellite Network at Base Camp** | `Save-Data` header or user Low-Bandwidth toggle (`System #20`) | Switches to `<15 KB` JSON lite responses, disables 3D WebGL shaders, queues drafts in IndexedDB |
| **Assistive AI Provider Outage or Timeout** | 4,000ms circuit breaker in `IAiAssistantProvider` | Gracefully degrades to manual human workflow; verification pipeline continues uninterrupted |
| **Founder / Admin Key Compromise or Incapacity** | Quorum proposal monitor (`System #14`) | Blocks unilateral constitutional/role mutations; enforces 72h cooling time-lock & multi-sig co-sign |
