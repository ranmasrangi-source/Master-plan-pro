# 02 — COMPLETE PRODUCT REQUIREMENTS & TRACEABILITY MATRIX (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1 (Incorporating CHK-01.14 to CHK-01.18 and NF-01 to NF-05)  
**Status:** PHASE 01 BASELINE — AWAITING GATE 01 SIGN-OFF

---

## 1. Mandatory New Compliance & Operational Requirements (`CHK-01.14` to `CHK-01.18`)

### CHK-01.14: Geopolitical Sensitivity Flag (`geopoliticalSensitivityFlag`)
- **Requirement (`REQ-GEO-014`):** Every Destination and Route record must carry a structured `geopoliticalSensitivity` object:
  - `isSensitiveBorderOrDisputedZone: boolean`
  - `jurisdictionDisplayPolicy: "DUAL_NAMED_NEUTRAL" | "STANDARD_ISO"`
  - `specialPermitOrEscortNotice: string`
  - `activeAdvisoryLevel: "NONE" | "BORDER_PERMIT_REQUIRED" | "RESTRICTED_MILITARY_ZONE" | "CLOSED_TO_FOREIGN_ACCESS"`
- **Neutrality Principle:** As an international recognition institution founded in Nepal, 0 TO 8848 displays internationally recognized dual/transboundary jurisdictions neutrally (e.g., `Nepal / China (Tibet Autonomous Region)` for Everest/Cho Oyu/Makalu/Lhotse; `Pakistan / China` for K2/Broad Peak/Gasherbrum; `India / Nepal` for Kangchenjunga; `Argentina / Chile` for Fitz Roy/Ojos del Salado) without taking political stances, while warning adventurers of border-crossing prohibitions.

### CHK-01.15: Bilingual Content Plan (Nepali `ne-NP` + English `en-US`) for Phase 09
- **Requirement (`REQ-I18N-015`):** Because 0 TO 8848 is *"BUILT IN NEPAL. MADE FOR THE WORLD,"* Phase 09 (Global Destinations & Routes) must ship with full **Bilingual English + Nepali (`नेपाली` in Noto Sans Devanagari)** support for:
  1. All platform navigation, constitutional headers, and verification status badges.
  2. Complete bilingual metadata (Official Nepali Devanagari name, transliteration, local indigenous name, permit authority, and safety notices) for all Nepalese & Himalayan destinations (`DEST-001` through `DEST-024`) and bilingual primary labels (`nameEn`, `nameNe`) across all 100 destinations.
  3. All Nepali strings must pass `HUMAN_VERIFIED` linguistic review before publication.

### CHK-01.16: Data Residency & Nepal Data Protection Compliance Addendum
- **Requirement (`REQ-PRV-016`):** Comply with **Nepal's Individual Privacy Act, 2075 (2018)**, **Individual Privacy Regulation, 2077 (2020)**, and **Electronic Transactions Act, 2063 (2006)** alongside EU GDPR and UAE PDPL:
  - Explicit informed consent required before collecting citizenship numbers, passport scans, or climbing permits.
  - Logical data residency tagging (`dataResidencyRegion: "NP" | "EU" | "UAE" | "GLOBAL"`) with encrypted sovereign backup replicas and strict cross-border transfer safeguards.

### CHK-01.17: Emergency Contact & Rescue Protocol Per Destination
- **Requirement (`REQ-SAF-017`):** Every Destination record (`DEST-001` to `DEST-100`) must include a structured `emergencyRescueProtocol` object containing:
  - `primarySearchAndRescueAgency` (e.g., *Himalayan Rescue Association (HRA) / Tourist Police Nepal*, *PGHM Chamonix*, *Air Zermatt*, *NPS Denali SAR*)
  - `emergencyPhoneNumbers[]` (Local SAR dispatch + international satellite emergency numbers)
  - `nearestHyperbaricOrTraumaCenter` (Location + coordinates)
  - `helicopterEvacuationCeilingMeters` (Maximum safe rotorcraft operational altitude)
  - `mandatoryEvacuationInsuranceMinimumUSD`
  - `nonRescuePlatformDisclaimer` (Mandatory notice that 0 TO 8848 does not dispatch rescue aircraft).

### CHK-01.18: Seasonal Risk Rating (`LOW | MEDIUM | HIGH | EXTREME_CLOSURE`)
- **Requirement (`REQ-SAF-018`):** Every Destination and Route record must define a **12-Month Seasonal Risk Matrix (`Jan` through `Dec`)** rating each month as:
  - `LOW` (Optimal primary climbing/trekking window; stable weather expected)
  - `MEDIUM` (Shoulder season; increased cold, wind, or early/late precipitation)
  - `HIGH` (Monsoon, heavy winter snow/avalanche cycle, or extreme Patagonian/polar winds; senior technical experience required)
  - `EXTREME_CLOSURE` (Official park closure or life-threatening cyclone/monsoon/winter conditions).

---

## 2. Master 10-Column Requirements Traceability Matrix (RTM — Updated V1.1)

| Req ID | Source Section | Module | Phase | Target File Path | DB Entity | API Route | Security / Trust Control | Test ID | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-CONST-01** | V1.0 §6–7 | Constitution | 01, 13 | `docs/00_PROJECT_CONSTITUTION.md` | `credentialRegistry` | `GET /api/v1/finance/pricing` | Earned never bought; free standard badges/certs | `PAY-TEST-02` | `Phase 01 Doc Created` |
| **REQ-FIN-A1** | V1.1 Amend A1 | Finance Blueprint | 01, 17 | `docs/01_MASTER_PLAN.md` | `financialReconciliations` | `GET /api/v1/finance/pricing` | Verified Table A ($1,180–$2,950) & Table B ($36.5k–$153.5k) | `FIN-TEST-01` | `Phase 01 Doc Created` |
| **REQ-TAX-A2** | V1.1 Amend A2 | Category Catalogue | 01, 11 | `docs/03_ADVENTURE_CATEGORIES.md` | `adventureCategories` | `GET /api/v1/categories` | Bijective 1:N mapping of `CAT-01..24` to `MD-01..06` | `TAX-TEST-01` | `Phase 01 Doc Created` |
| **REQ-ECF-A3** | V1.1 Amend A3 | Verification Standards | 01, 11, 12 | `docs/05_VERIFICATION_STANDARDS.md` | `evidenceConfidenceAssessments` | `POST /api/v1/verification/:id/evaluate-confidence` | GPS-only $<75$ fails; GPS-free $\ge 75$ passes; override audit trail | `ECF-TEST-01..04` | `Phase 01 Doc Created` |
| **REQ-FRD-A4** | V1.1 Amend A4 | Anti-Fraud Forensics | 01, 12 | `docs/05_VERIFICATION_STANDARDS.md` | `fraudInvestigations` | `POST /api/v1/verification/:id/analyze` | Copernicus GLO-30 DEM, West physiology formula, 64-bit DCT pHash | `FRD-TEST-01..04` | `Phase 01 Doc Created` |
| **REQ-DB-A5** | V1.1 Amend A5 | Database Architecture | 01, 02, 05 | `docs/01_MASTER_PLAN.md` | All 72 Entities | Internal Repository | Option A Hybrid Relational selected (9.50/10 weighted score) | `VND-TEST-01` | `Phase 01 Doc Created` |
| **REQ-DEST-A6** | V1.1 Amend A6 | 100 Destinations | 01, 09 | `docs/06_DESTINATION_CATALOGUE.md` | `destinations`, `destinationSources` | `GET /api/v1/destinations` | Data hygiene columns (`source_url`, `source_type`, `confidence`, etc.) | `DEST-TEST-01..04` | `Phase 01 Doc Created` |
| **REQ-GLS-A7** | V1.1 Amend A7 | Core Ontology | 01, 02 | `docs/00_PROJECT_CONSTITUTION.md` | Schema Constraints | `/api/v1/*` | Strict separation of MD, CAT, REG, DEST, WPT, TRL, RTE, ACT, ACH, CRED | `ONT-TEST-01` | `Phase 01 Doc Created` |
| **REQ-GEO-014** | CHK-01.14 | Geopolitical Flag | 01, 09 | `docs/06_DESTINATION_CATALOGUE.md` | `destinations` | `GET /api/v1/destinations/:id` | Transboundary dual-naming neutrality & border permit flags | `GEO-TEST-01` | `Phase 01 Doc Created` |
| **REQ-I18N-015** | CHK-01.15 | Bilingual (EN + NE) | 01, 04, 09 | `docs/06_DESTINATION_CATALOGUE.md` | `translationStrings`, `destinations` | `GET /api/v1/i18n/ne` | Nepali Devanagari + English bilingual destination & UI support | `I18N-TEST-02` | `Phase 01 Doc Created` |
| **REQ-PRV-016** | CHK-01.16 | Nepal Data Residency | 01, 05, 08 | `docs/02_REQUIREMENTS.md` | `consentRecords`, `users` | `POST /api/v1/privacy/*` | Nepal Individual Privacy Act 2075 + GDPR + UAE PDPL compliance | `PRV-TEST-02` | `Phase 01 Doc Created` |
| **REQ-SAF-017** | CHK-01.17 | Emergency & SAR | 01, 09 | `docs/06_DESTINATION_CATALOGUE.md` | `destinations`, `safetyAdvisories` | `GET /api/v1/destinations/:id/safety` | Per-destination SAR agency, heli ceiling, trauma center & disclaimer | `SAF-TEST-01` | `Phase 01 Doc Created` |
| **REQ-SAF-018** | CHK-01.18 | Seasonal Risk Rating | 01, 09 | `docs/06_DESTINATION_CATALOGUE.md` | `destinations`, `destinationRoutes` | `GET /api/v1/destinations/:id/safety` | Monthly `LOW / MEDIUM / HIGH / EXTREME_CLOSURE` risk matrix | `SAF-TEST-02` | `Phase 01 Doc Created` |
| **REQ-NF-01** | NF-01 | Heritage Guardian | 01, 12 | `docs/01_MASTER_PLAN.md` | `reviewerAccreditations` | `POST /api/v1/verification/:id/heritage-attest` | Indigenous/community cultural stewardship verification tier (`PROPOSED`) | `NF-TEST-01` | `Phase 01 Doc Created` |
| **REQ-NF-02** | NF-02 | Live Trail Conditions | 01, 09, 14 | `docs/01_MASTER_PLAN.md` | `trailConditionReports` | `POST /api/v1/routes/:id/conditions` | Moderated, TTL-expiring field hazard reports (`PROPOSED`) | `NF-TEST-02` | `Phase 01 Doc Created` |
| **REQ-NF-03** | NF-03 | 3D Achievement Replay | 01, 13 | `docs/01_MASTER_PLAN.md` | `publicCredentials` | `GET /api/v1/credentials/:id/replay` | Privacy-trimmed DEM 3D route replay with low-bandwidth fallback (`PROPOSED`) | `NF-TEST-03` | `Phase 01 Doc Created` |
| **REQ-NF-04** | NF-04 | Acclimatization Advisor | 01, 09 | `docs/01_MASTER_PLAN.md` | `destinationRoutes` | `POST /api/v1/safety/acclimatization-check` | WMS/UIAA sleeping altitude gain planner + non-medical disclaimer (`PROPOSED`) | `NF-TEST-04` | `Phase 01 Doc Created` |
| **REQ-NF-05** | NF-05 | Leave No Trace Score | 01, 11, 14 | `docs/01_MASTER_PLAN.md` | `environmentalAchievements` | `POST /api/v1/environmental/lnt-score` | LNT stewardship score (`0–100`), zero competitive rank inflation (`PROPOSED`) | `NF-TEST-05` | `Phase 01 Doc Created` |
