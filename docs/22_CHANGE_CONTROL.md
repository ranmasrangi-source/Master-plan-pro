# 22 — CHANGE CONTROL, RELEASE GOVERNANCE & 21-PHASE MASTER ROADMAP (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 03 / PHASE 04 — DEVELOPMENT INFRASTRUCTURE, GOVERNANCE & ROADMAP CLARITY

---

## 1. Phase-Gated Change Control
1. **No Unapproved Phase Advancement:** Every phase (`PHASE 01` through `PHASE 21`) requires a formal Phase Report (Section 77) and explicit Founder Gate authorization (`Gate 01` through `Gate 21`) before the next phase commences.
2. **Requirements Traceability:** No requirement in `/docs/02_REQUIREMENTS.md` may be silently removed or downgraded. Any proposed adjustment to a category, achievement criterion, verification standard, or destination attribute must be logged with a `policyVersion` increment (`v1.1.0` $\rightarrow$ `v1.2.0`).

---

## 2. Authoritative 21-Phase Master Execution Roadmap (Section 76 & RTM Alignment)

To eliminate any ambiguity across documentation, tests, and UI disclosures (`AUD-03`), the table below records the canonical **21 Sequential Development Phases (`PHASE 01` to `PHASE 21`)** of the **0 TO 8848** Master Project Plan, cross-referenced to `/docs/01_MASTER_PLAN.md` and `/docs/02_REQUIREMENTS.md`:

| Phase ID | Gate ID | Authoritative Phase Title | Core Approved Scope & RTM Mapping (`docs/02_REQUIREMENTS.md`) | Current Status |
| :---: | :---: | :--- | :--- | :---: |
| **PHASE 01** | `Gate 01` | Master Requirements & Blueprint | Project Constitution (`00`), Master Plan & Financial Worksheets (`01`, `REQ-FIN-A1`, `REQ-DB-A5`), Requirements (`02`), 24 Categories (`03`, `REQ-TAX-A2`), Achievements (`04`), Verification Standards (`05`, `REQ-ECF-A3`, `REQ-FRD-A4`), 100 Destinations (`06`, `REQ-DEST-A6`). | **`PASS`** |
| **PHASE 02** | `Gate 02` | Technical Architecture & System Design | 25 Service Boundaries (`07`), 80 Schema Groups / 86 Physical Tables (`08`), `/api/v1/*` REST Contracts (`09`), TypeScript Domain & Vendor-Independent Adapter Interfaces (`src/types/*`, `src/adapters/*`). | **`PASS`** |
| **PHASE 03** | `Gate 03` | Development Infrastructure & GitHub | Repository setup, CI/CD Security & Constitutional Gate (`.github/workflows/ci-security-gate.yml`), Controlled Pattern Secret Scanner (`scripts/security-scan.ts`), Testing/Deployment/DR/Change Control (`17`, `18`, `19`, `22`, `23`). | **`PASS`** |
| **PHASE 04** | `Gate 04` | Brand, UI/UX & Design System | Obsidian & Gold Design System (`16`), WCAG 2.2 AA components, Bilingual (`EN`/`NE`) & RTL (`AR`) UI dictionary + Bikram Sambat validator, 3D/Vector Badges, Certificate Spec Preview, 42 Public Website Pages shell, 100-Destination runtime catalog, Pure TS Security/Verification Core (`src/services/securityAndVerificationCore.ts`). | **`AWAITING FOUNDER APPROVAL`** |
| **PHASE 05** | `Gate 05` | Database Schema, Persistence & Core Data Layer | Relational SQL engine (`PostgreSQL` / Drizzle ORM) implementation of the 80 schema groups / 86 physical tables (`REQ-DB-A5`, `REQ-PRV-016`), concrete `IDatabaseRepository`, and backend server bootstrap (`server.ts`). | **`NOT STARTED (BLOCKED)`** |
| **PHASE 06** | `Gate 06` | Authentication, 21-Role RBAC, MFA & Session Security | Live server-side authentication, mandatory TOTP/WebAuthn MFA enforcement for privileged roles, session revocation middleware, and live HTTP RBAC/COI guards. | **`NOT STARTED`** |
| **PHASE 07** | `Gate 07` | Public Website Pages (42 Pages) & Multilingual Content | Full server-backed routing, SEO metadata, and content delivery for all 42 mandatory public website pages (`Section 19.1–19.42`). | **`NOT STARTED`** |
| **PHASE 08** | `Gate 08` | User Profiles, Consent Management & Privacy Enclave | Adventurer profiles, explicit consent ledger, and Nepal Individual Privacy Act 2075 BS / GDPR / UAE PDPL residency tagging (`REQ-PRV-016`). | **`NOT STARTED`** |
| **PHASE 09** | `Gate 09` | Global Destinations (`DEST-001..100`), Routes & Safety | Field-by-field validation of the 100 `PROPOSED` destinations (`REQ-DEST-A6`), separated route geometries, geopolitical flags (`REQ-GEO-014`), bilingual `EN/NE` content (`REQ-I18N-015`), SAR protocols (`REQ-SAF-017`), seasonal risk matrices (`REQ-SAF-018`), and Acclimatization Advisor API (`REQ-NF-04`). | **`NOT STARTED`** |
| **PHASE 10** | `Gate 10` | Guide Marketplace, Tour Operators & Organizations | License-verified guides, guide companies, tour operators, organization rosters, and commercial booking COI records. | **`NOT STARTED`** |
| **PHASE 11** | `Gate 11` | Adventure Categories (`CAT-01..24`), Achievements & Evidence Upload | Server-side application intake (`REQ-TAX-A2`), multipart binary evidence upload pipeline, isolated object storage (`IStorageProvider`), EXIF/GPX stream parsing, and 1.0 km residential geozone masking. | **`NOT STARTED`** |
| **PHASE 12** | `Gate 12` | Independent Verification Engine, 5-Pillar ECF, Anti-Fraud & Appeals | Live reviewer workspace, server-side 5-Pillar ECF persistence (`REQ-ECF-A3`), Copernicus DEM / West physiology / 64-bit pHash forensics (`REQ-FRD-A4`), Heritage Guardian attestation (`REQ-NF-01`), Dual-Senior co-signing, and independent Department 04 Appeal workflows. | **`NOT STARTED`** |
| **PHASE 13** | `Gate 13` | Badges, Verifiable Certificates, Credential Registry & Public Portal | Live issuance of free standard 3D badges and printable QR certificates (`REQ-CONST-01`), append-only hash-chained Credential Integrity Registry, zero-PII public lookup API, and 3D Achievement Replay (`REQ-NF-03`). | **`NOT STARTED`** |
| **PHASE 14** | `Gate 14` | Global Adventure Network, Community & Stewardship | Expedition logs, moderated TTL-expiring Live Trail Conditions (`REQ-NF-02`), and Leave No Trace (`LNT`) environmental stewardship scoring (`REQ-NF-05`). | **`NOT STARTED`** |
| **PHASE 15** | `Gate 15` | Leaderboards, Meritorious Ranking & Legends / Memorial Archive | Verified-only merit leaderboards (zero paid boost) and separate non-competitive Legends & Memorial archive. | **`NOT STARTED`** |
| **PHASE 16** | `Gate 16` | Governance Quorum, Internal Audit, Whistleblower Vault & Transparency | Multi-signature governance quorum with 72h cooling time-lock (`System #14`), zero-IP whistleblower vault persistence (`DEPT-11`), and public transparency metrics. | **`NOT STARTED`** |
| **PHASE 17** | `Gate 17` | Financial Governance, Double-Entry Ledger & Locked Billing Readiness | Double-entry financial reconciliation ledger (`REQ-FIN-A1`) and HTTP 403 payment lock middleware (`PAYMENTS_ENABLED = false` until external penetration test `FIN-B02` and legal readiness). | **`NOT STARTED`** |
| **PHASE 18** | `Gate 18` | Locked Optional Soulbound Blockchain Readiness & Audit Gate | Non-transferable ERC-5192 adapter interface and HTTP 403 blockchain lock middleware (`BLOCKCHAIN_ENABLED = false` until independent smart contract audit `FIN-B03` and legal readiness). | **`NOT STARTED`** |
| **PHASE 19** | `Gate 19` | Comprehensive QA, Accessibility (WCAG 2.2 AA) & Performance Testing | End-to-end integration tests across all 32 test categories (`docs/17_TESTING_STRATEGY.md`), screen-reader audit, and `<15 KB` low-bandwidth field testing. | **`NOT STARTED`** |
| **PHASE 20** | `Gate 20` | Security Hardening, Penetration Testing, DR & 48h Vendor Exit Drill | External CREST/OSCP security audit readiness, encrypted backup restoration drill, and 48-hour vendor-independent exit verification (`docs/19_DISASTER_RECOVERY.md`). | **`NOT STARTED`** |
| **PHASE 21** | `Gate 21` | Final Pre-Launch Readiness Audit & Founder Launch Authorization | Complete 21-Phase constitutional, legal, security, and operational sign-off by the Founder prior to production launch. | **`NOT STARTED`** |

---

## 3. Constitutional & Policy Version Control
- Historical Achievement Applications are always evaluated against the `effectivePolicyVersion` active at the time of application submission (or a more favorable updated alternative evidence pathway if approved by Governance).
- Changes to `/docs/00_PROJECT_CONSTITUTION.md` or `/src/types/constitution.ts` require **Founder + Governance Committee Quorum** and a **72-hour cooling time-lock** (`System #14`).

---

## 4. Current Verified Release Baseline & Pending Founder Decisions (`AUD-07`, `AUD-08` & `AUD-09`)
- **Latest Independently Verified Remote `main` Commit SHA:** `996fa9cd02e7c1d8d55c6c97352f65ef19d268fd` (short SHA `996fa9c`; Git Tree SHA: `e7d58162be76a1b37aa593d2291fa041196de9c1`)
- **Latest Independently Verified Remote GitHub Actions Run ID:** `43401819367` (`https://github.com/ranmasrangi-source/Master-plan-pro/actions/runs/43401819367` — Run `#9`, Job `131806279045`, `completed` / `success`)
- **Strict Non-Zero Exit Enforcement on `AUD-07` (`scripts/branch-protection.ts`):** `npm run security:branch-protection` (Step 6 of `.github/workflows/ci-security-gate.yml`) now unconditionally exits with code `1` whenever remote GitHub `main` branch protection is disabled (`protected: false`) or missing required status checks (`Secret Scan, Type Check, Test Suite & Build Integrity`), PR review requirements, admin enforcement, or force-push/deletion blocks.
- **Pending Founder Decisions Before Phase 05 Can Start:**
  1. **Remote GitHub Branch Protection (`AUD-07`):** Enable `main` branch protection on `ranmasrangi-source/Master-plan-pro` (requiring PR approval and the status check `Secret Scan, Type Check, Test Suite & Build Integrity`, blocking force pushes and deletions, and enforcing admins) via repository owner (`ranmasrangi-source`) admin token (`secrets.BRANCH_PROTECTION_ADMIN_TOKEN`) or GitHub UI settings.
  2. **Gate 04 Written Sign-Off:** Explicit written Founder approval of Gate 04 (`PHASE 04 — BRAND, UI/UX & DESIGN SYSTEM`) prior to commencing `PHASE 05` (`Database Schema, Persistence & Core Data Layer`).


