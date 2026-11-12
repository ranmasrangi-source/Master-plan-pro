# 01 — MASTER PLAN & TECHNICAL BLUEPRINT (ULTIMATE V1.1 — AMENDED)

**Document Version:** ULTIMATE V1.1 (Amended per Founder Directives A1–A7, FQ-01–05, CHK-01.14–01.18, NF-01–05)  
**Status:** PHASE 01 SPECIFICATION — AWAITING GATE 01 SIGN-OFF

---

## 1. Confirmed Founder Decisions (FQ-01 to FQ-05)
- **FQ-01 (Database Architecture):** **APPROVED — Option A (Hybrid / Repository-Abstracted Relational Architecture)** using strict TypeScript repository interfaces (`IDatabaseRepository`) backed by a relational SQL engine (PostgreSQL / SQLite-compatible via Drizzle ORM) for ACID referential integrity across all 72 entities, conflict-of-interest joins, and double-entry financial/credential ledgers, with vendor-agnostic portability.
- **FQ-02 (24 Adventure Categories & 6 Archetypes):** **APPROVED FOR DOCUMENTATION** — Incorporating Binding Amendment A2 (Strict 1:1 Macro-Domain Partition `MD-01` to `MD-06` where `CAT-23` and `CAT-24` are assigned to dedicated Macro-Domains or strict orthogonal modifiers so every `CAT-01..CAT-24` maps to **exactly one** parent Macro-Domain).
- **FQ-03 (Evidence Confidence Framework):** **APPROVED IN PRINCIPLE** — Incorporating Binding Amendment A3 (Worked mathematical examples for GPS-only failure $<75$, GPS-free Permit+Chronology+Witness approval $\ge 75$, and Reviewer Override Audit Trail).
- **FQ-04 (100 Featured Destinations Roster):** **APPROVED TO LOCK AS `PROPOSED`** — Incorporating Binding Amendment A6 (Data-hygiene columns: `source_url`, `source_type`, `last_verified_date`, `confidence`, `unverified_fields`), Amendment A7 (Glossary), and Checklist Items `CHK-01.14` to `CHK-01.18`.
- **FQ-05 (Execution Scope):** **DIRECTIVE A ONLY** — Phase 01 documentation file creation only (`/docs/*`). Zero Phase 02+ code or infrastructure changes until Gate 01 sign-off.

---

## 2. Binding Amendment A5 — Weighted Database Architecture Scoring Matrix
To document the objective engineering justification for **FQ-01 (Option A: Hybrid / Repository-Abstracted Relational Architecture)** over Pure NoSQL (Cloud Firestore) and Unabstracted Direct SQL, the following weighted decision matrix is locked into the Master Plan:

| Evaluation Criterion | Weight (%) | Option A: Hybrid Repository-Abstracted Relational (Selected) | Option B: Pure Cloud Firestore (Document NoSQL) | Option C: Unabstracted Direct Cloud SQL | Weighted Calculation Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Referential Integrity & Multi-Entity Joins (72 Entities)** | 20% | **9.5 / 10** (1.90) | **5.5 / 10** (1.10) | **9.5 / 10** (1.90) | Enforces FK constraints across Regions $\rightarrow$ Destinations $\rightarrow$ Routes $\rightarrow$ Cases |
| **2. Conflict-of-Interest (COI) & Graph Ring Queries** | 20% | **9.5 / 10** (1.90) | **5.0 / 10** (1.00) | **9.0 / 10** (1.80) | Relational joins detect shared orgs, bookings, and reciprocal witness rings atomically |
| **3. Append-Only Audit & Double-Entry Ledger Integrity** | 15% | **9.5 / 10** (1.425) | **7.0 / 10** (1.05) | **9.5 / 10** (1.425) | ACID transactions prevent partial writes between `verificationCases` and `credentialRegistry` |
| **4. Vendor Independence & 48h Exit Portability (System #13)** | 15% | **10.0 / 10** (1.50) | **4.0 / 10** (0.60) | **7.0 / 10** (1.05) | `IDatabaseRepository` allows swapping Postgres, SQLite/libSQL, or Firestore adapters |
| **5. Cost Efficiency within USD 1,000–3,000 Budget** | 15% | **9.5 / 10** (1.425) | **9.0 / 10** (1.35) | **7.5 / 10** (1.125) | Zero-idle-cost scale-to-zero / embedded relational test mode + low-cost production |
| **6. Offline / Low-Bandwidth Sync & Real-Time Support** | 15% | **9.0 / 10** (1.35) | **9.5 / 10** (1.425) | **7.0 / 10** (1.05) | Combines REST `/api/v1/*` lite endpoints with IndexedDB offline queue |
| **TOTAL WEIGHTED SCORE (Out of 10.00)** | **100%** | **9.500 / 10.00** | **6.525 / 10.00** | **8.350 / 10.00** | **Exact Math Verified:** Option A = `1.90+1.90+1.425+1.50+1.425+1.35 = 9.500` |

---

## 3. Binding Amendment A1 — Financial Worksheet, Table B Subtotals & Budget Reconciliation

### 3.1 Table A: Core 12-Month Technical & Initial Operational Worksheet (Within USD 1,000–3,000 Cap)

| WBS Code | Expense Line Item | Billing Cadence | Conservative (USD) | Base (USD) | Optimistic (USD) | Exact Formula / Basis |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| **FIN-A01** | Official Domain (`0to8848official.com`) + DNSSEC | Annual | $20.00 | $35.00 | $50.00 | $20/yr standard renewal; $35–$50 with registry lock |
| **FIN-A02** | Compute & Database Hosting (Scale-to-Zero) | Monthly $\times 12$ | $180.00 | $420.00 | $840.00 | Cons: `$15×12=$180`; Base: `$35×12=$420`; Opt: `$70×12=$840` |
| **FIN-A03** | Evidence Object Storage & CDN Egress | Monthly $\times 12$ | $120.00 | $300.00 | $600.00 | Cons: `$10×12=$120`; Base: `$25×12=$300`; Opt: `$50×12=$600` |
| **FIN-A04** | Assistive AI API Quota (Hard Cap Rate-Limited) | Monthly $\times 12$ | $60.00 | $180.00 | $360.00 | Cons: `$5×12=$60`; Base: `$15×12=$180`; Opt: `$30×12=$360` |
| **FIN-A05** | Encrypted Daily Backups, CI/CD & Monitoring | Monthly $\times 12$ | $60.00 | $140.00 | $250.00 | Cold storage snapshots + GitHub Actions minutes |
| **FIN-A06** | Transactional Email & MFA Telemetry | Annual | $40.00 | $125.00 | $250.00 | TOTP App MFA ($0) + transactional email blocks |
| **Subtotal A-Tech** | **Technology & Infrastructure Subtotal** | **12 Months** | **$480.00** | **$1,200.00** | **$2,350.00** | `20+180+120+60+60+40 = $480`; `35+420+300+180+140+125 = $1,200`; `50+840+600+360+250+250 = $2,350` |
| **FIN-A07** | Nepal Local Initial Legal & IP Filing Reserve | One-Time | $550.00 | $800.00 | $600.00 | Nepal OCR company registration + DoI trademark filing |
| **FIN-A08** | Grassroots Launch & Mountaineering Club Outreach | Annual | $150.00 | $450.00 | $0.00 | Held to `$0.00` in Opt scenario to enforce strict `<$3,000` ceiling |
| **Subtotal A-Ops** | **Legal & Initial Operations Subtotal** | **12 Months** | **$700.00** | **$1,250.00** | **$600.00** | `550+150 = $700`; `800+450 = $1,250`; `600+0 = $600` |
| **TOTAL TABLE A** | **Total Initial Budget Allocation (Cap: $3,000)** | **12 Months** | **$1,180.00** | **$2,450.00** | **$2,950.00** | `480+700 = $1,180.00`; `1200+1250 = $2,450.00`; `2350+600 = $2,950.00` |
| **Remaining Reserve** | **Unallocated Buffer vs. $3,000.00 Max Ceiling** | — | **+$1,820.00** | **+$550.00** | **+$50.00** | `3000 - 1180 = $1,820`; `3000 - 2450 = $550`; `3000 - 2950 = $50` |

### 3.2 Table B: Deferred Post-Launch / Seed-Stage Expansion Expenses (Outside Initial USD 1,000–3,000 Budget)

| WBS Code | Deferred Expansion Item | Minimum Estimate (USD) | Midpoint Estimate (USD) | Upper Estimate (USD) | Mandatory Activation Trigger |
| :--- | :--- | ---: | ---: | ---: | :--- |
| **FIN-B01** | UAE Free Zone Incorporation & Licensing (IFZA/RAKEZ) | $3,500.00 | $5,000.00 | $6,500.00 | Required before UAE HQ domicile & UAE merchant banking |
| **FIN-B02** | External CREST/OSCP Application Penetration Test | $4,000.00 | $8,000.00 | $12,000.00 | Required before enabling live card payments (`Phase 17+`) |
| **FIN-B03** | Independent Smart Contract Security Audit (ERC-5192) | $5,000.00 | $10,000.00 | $15,000.00 | Required before enabling optional Soulbound minting (`Phase 18+`) |
| **FIN-B04** | Full-Time Salaried Engineering, Support & Legal Retainer | $24,000.00 | $72,000.00 | $120,000.00 | Triggered only when post-activation net revenue exceeds `$6,000/mo` |
| **TOTAL TABLE B** | **Deferred Post-Launch Expansion Subtotal** | **$36,500.00** | **$95,000.00** | **$153,500.00** | **Exact Sums:** Min = `3500+4000+5000+24000 = $36,500.00`; Mid = `5000+8000+10000+72000 = $95,000.00`; Max = `6500+12000+15000+120000 = $153,500.00` |

### 3.3 Consolidated Reconciliation Note (Table A + Table B)
- **Phase 01–21 Build & Initial Launch Commitment (Table A):** Strictly bounded between **`$1,180.00`** and **`$2,950.00`**, leaving **`$50.00` to `$1,820.00`** in unspent reserve below the Founder's **`$3,000.00`** ceiling.
- **Deferred Commercial & Global Scaling Commitment (Table B):** **`$36,500.00` (Min) / `$95,000.00` (Mid) / `$153,500.00` (Max)** is explicitly ring-fenced and **cannot** be incurred during Phases 01–21 without separate post-launch revenue self-funding or formal Founder capital authorization.
- **Combined Full-Lifecycle Enterprise Total (Table A + Table B):**
  - **Minimum / Conservative Combined:** `$1,180.00 + $36,500.00 = $37,680.00`
  - **Base / Midpoint Combined:** `$2,450.00 + $95,000.00 = $97,450.00`
  - **Maximum / Optimistic Combined:** `$2,950.00 + $153,500.00 = $156,450.00`

---

## 4. Proposed New Features (`NF-01` to `NF-05` — Status: `PROPOSED`)

### NF-01: Heritage Guardian Multi-Tier Verification (`STATUS: PROPOSED`)
- **Concept:** Recognizes indigenous, local mountain community, and traditional custodian stewards (e.g., Khumbu Sherpa elders, Mustang cultural councils, Ngāi Tahu iwi representatives, Andean community elders) as accredited **Heritage Guardians (`Role 21 / Specialized Senior Accreditation`)** for culturally sacred or heritage-sensitive destinations.
- **Verification Authority:** Heritage Guardians verify cultural compliance (e.g., respect for Kangchenjunga sacred summit step, Aoraki Topuni protocol, Mount Kailash Kora-only non-summit rule) and provide authoritative local attestation in Pillar 4 of the ECF. They cannot unilaterally approve technical achievement claims without standard Reviewer/Senior Reviewer co-sign-off, nor can commercial sponsors influence them.

### NF-02: Trail Condition Live Reporting (`STATUS: PROPOSED`)
- **Concept:** Crowd-sourced, reviewer-moderated field condition reports submitted by verified adventurers and licensed guides (`BRIDGE_WASHED_OUT`, `CREVASSE_LADDER_SHIFT`, `FIXED_ROPE_INSTALLED`, `WATER_SOURCE_DRY`, `LANDSLIDE_REROUTE`).
- **Safety Governance:** Reports are tagged `UNCONFIRMED_FIELD_REPORT` until corroborated by $\ge 2$ independent verified users or a licensed guide/Destination Partner, and automatically expire after a configurable TTL (7–30 days).

### NF-03: Achievement Replay — 3D Route Reconstruction (`STATUS: PROPOSED`)
- **Concept:** Interactive 3D terrain and elevation-time replay of an approved achievement using the adventurer's verified GPX track draped over open DEM terrain tiles, synchronized with geo-tagged checkpoint photos.
- **Privacy & Bandwidth Controls:** Residential start/end geozones are automatically trimmed (1.0 km buffer); the adventurer must explicitly opt in to public replay visibility; automatically disabled in Low-Bandwidth Base-Camp Mode (`System #20`) in favor of a `<15 KB` 2D SVG elevation profile and data table.

### NF-04: Altitude Acclimatization Advisor (`STATUS: PROPOSED`)
- **Concept:** Educational, rule-based pre-expedition planning tool comparing a proposed route's daily sleeping elevation profile against international wilderness medicine guidelines (UIAA MedCom / WMS consensus: e.g., $\le 500\text{m}$ sleeping gain per day above $3,000\text{m}$ with a rest day every $3\text{–}4\text{ days}$).
- **Legal & Medical Boundary:** Strictly deterministic educational planning tool (no generative AI medical diagnosis); displays mandatory disclaimer that it is **not medical advice** and does not replace pulse oximetry, Lake Louise AMS scoring, or qualified expedition physicians.

### NF-05: Leave No Trace (LNT) Scoring & Stewardship Index (`STATUS: PROPOSED`)
- **Concept:** Quantitative Environmental Responsibility index (`0–100`) recorded on expeditions and applications based on verified waste pack-out logs (e.g., SPCC Khumbu waste deposit compliance), human waste bag usage in glaciated zones, permit adherence, and campfire compliance.
- **Recognition Rule:** High LNT scores unlock **Environmental Stewardship Badges (`CAT-24`)** and highlight ethical guides in the Marketplace, but never substitute for summit completion criteria or purchase competitive leaderboard rank.
