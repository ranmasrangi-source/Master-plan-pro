# 00 — PROJECT CONSTITUTION (ULTIMATE V1.1 — AMENDED)

**Project Name:** 0 TO 8848  
**Official Domain:** https://0to8848official.com  
**Primary Tagline:** EXPLORE. ACHIEVE. PROVE.  
**Secondary Tagline:** YOUR ADVENTURE. YOUR ACHIEVEMENT. YOUR LEGACY.  
**Brand Origin:** BUILT IN NEPAL. MADE FOR THE WORLD.  
**Document Version:** ULTIMATE V1.1 (Incorporating Binding Amendments A1–A7, CHK-01.14–01.18, NF-01–05)  
**Document Status:** PHASE 01 BASELINE APPROVED (GATES 01–03 PASS · CURRENT PROJECT GATE: GATE 04 AWAITING FOUNDER APPROVAL)


---

## 1. Constitutional Identity & Mission
- **Mission:** Build a trusted international platform that recognizes genuine adventure achievements through reliable evidence, independent human verification, and publicly verifiable digital credentials.
- **Vision:** Become one of the world's most trusted global adventure achievement recognition platforms.
- **Origin & Jurisdiction:** Founded in Nepal; designed for global operations with a planned future international headquarters in the UAE (subject to post-launch legal and regulatory readiness).

---

## 2. Non-Negotiable Trust Principle
> **ACHIEVEMENTS MUST BE EARNED, NEVER BOUGHT.**

The following actions are permanently and technically prohibited across all 21 phases:
1. Buying achievements, badges, certificates, or leaderboard positions.
2. Paying for verification approval or priority verification queue jump.
3. Sponsor, advertiser, or subscription tier influence over reviewer decisions.
4. Administrator or Founder fabrication of unverified achievement records.
5. AI-only final approval or rejection of achievement applications.
6. Automatic rejection solely due to missing GPS tracks or stripped EXIF metadata.
7. Automatic approval solely from a GPS/GPX file without corroborating evidence.

---

## 3. Free Standard Recognition Guarantee
Upon independent human verification and approval:
- **Standard 3D Digital Badges:** 100% Free Forever.
- **Standard Verifiable Certificates (with QR & Public URL):** 100% Free Forever.
- **Public Credential Verification Portal:** 100% Free Forever.
- **Independent Appeals:** 100% Free Forever.
- **Non-Transferability:** Every credential is permanently bound to the verified adventurer and cannot be sold, transferred, or reassigned.

---

## 4. Hybrid Governance & Departmental Separation
Policy authority is shared between the **Founder** and the **Governance Committee**, enforced by multi-signature quorum and a 72-hour time-lock for constitutional changes.

| Department ID | Department Name | Core Constitutional Mandate | Firewall / Isolation Rule |
| :--- | :--- | :--- | :--- |
| **DEPT-01** | Founder Office | Vision, strategy, and co-signed constitutional decisions | Cannot fabricate achievements or bypass verification |
| **DEPT-02** | Governance Committee | Policy oversight, quorum co-signing, succession continuity | Enforces 72h cooling period on policy changes |
| **DEPT-03** | Verification Department | Independent human achievement verification & reviewer accreditation | Blinded to commercial/sponsor status (`ReviewerCaseViewDTO`) |
| **DEPT-04** | Appeal Review Team | Independent adjudication of rejected or disputed applications | Original reviewer(s) hard-blocked from appeal decisions |
| **DEPT-05** | Security Department | Cybersecurity, threat response, and incident containment | Read-only audit monitoring; cannot alter evidence hashes |
| **DEPT-06** | Finance Department | Financial governance, double-entry reconciliation, pricing | Zero write access to verification or leaderboard tables |
| **DEPT-07** | Operations Department | Daily platform operations and privacy-preserving analytics | Accesses only $k$-anonymized ($k \ge 5$) metrics |
| **DEPT-08** | Destination Department | Authoritative destination, route, and safety data management | Separated from individual achievement verification |
| **DEPT-09** | Marketplace Department | Guide qualification checks, listings, and booking disputes | Cannot grant achievement badges via booking records |
| **DEPT-10** | Community Department | Moderation, user safety, and environmental campaigns | Cannot alter competitive leaderboard scores |
| **DEPT-11** | Internal Audit | Whistleblower vault, QA sampling, and process compliance | Isolated from `system_admin` interference |

---

## 5. Mandatory Launch Locks
1. **Payment Collection Disabled (`PAYMENTS_ENABLED = false`):** All checkout and payment endpoints return `HTTP 403 Locked` until corporate, tax, banking, and legal readiness are formally authorized.
2. **Blockchain Module Disabled (`BLOCKCHAIN_ENABLED = false`):** All on-chain/soulbound minting endpoints return `HTTP 403 Locked` until legal review and independent smart contract audit are formally authorized.

---

## 6. Authoritative Glossary of Core Platform Entities (Amendment A7)
To prevent ontological conflation across documentation, database schemas, and code, the following 10 terms have strict, non-overlapping definitions:

1. **Macro-Domain (`MD-01` to `MD-06`):** The highest-level taxonomic grouping of adventure disciplines (e.g., `MD-03: Alpine & Expedition Mountaineering`). Every Adventure Category maps to **exactly one** Macro-Domain (1:N strict partition).
2. **Adventure Category (`CAT-01` to `CAT-24`):** A specific adventure discipline defined by terrain, technical skill, equipment, difficulty system, and reviewer qualification tier (e.g., `CAT-12: 8,000m Summit Expeditions`).
3. **Geographical Region (`REG-*`):** A contiguous mountain range, conservation area, or physiographic province (e.g., `REG-HIM-MAHALANGUR: Mahalangur Himal`).
4. **Destination (`DEST-001` to `DEST-100`):** A specific, bounded geographic feature (mountain massif, peak, canyon system, or long-distance corridor) recognized in the 100 Featured Destinations directory (e.g., `DEST-001: Mount Everest / Sagarmatha`).
5. **Sub-Feature / Waypoint (`WPT-*`):** A subordinate geographic point on a Destination (e.g., *South Col (7,906m)*, *Hillary Step*, *Stella Point*).
6. **Trail / Corridor (`TRL-*`):** A linear foot or overland path network that may connect multiple regions or base camps (e.g., `TRL-KHUMBU-EBC: Lukla to Everest South Base Camp Trail`).
7. **Route (`RTE-*`):** A specific, verifiable technical line, aspect, or itinerary used to ascend a Destination or traverse a Trail (e.g., `RTE-001A: Southeast Ridge via South Col` vs. `RTE-001B: Northeast Ridge via North Col`).
8. **Activity (`ACT-*`):** A dated, real-world physical outing performed by an adventurer on a specific Route/Destination.
9. **Achievement (`ACH-*`):** A codified standard of completion (Archetypes `TYPE-A` through `TYPE-F`) linked to a Category and one or more Routes/Destinations under a specific Policy Version.
10. **Credential (`CRED-*`):** The cryptographically signed, non-transferable recognition record (and associated free Standard Badge and Certificate) issued into the `Credential Integrity Registry` only after an Achievement Application passes Human Verification or Appeal.
