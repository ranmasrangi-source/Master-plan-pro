# 04 — ACHIEVEMENT CATALOGUE (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Catalogue Status:** `APPROVED FOR PHASE 01 DOCUMENTATION` (Per Founder Decision FQ-02)

---

## 1. Multi-Achievement Per Destination Architecture
In accordance with the Ontological Glossary (`docs/00_PROJECT_CONSTITUTION.md`), an **Achievement (`ACH-*`)** is distinct from a **Destination (`DEST-*`)** and a **Route (`RTE-*`)**. Every Featured Destination can host multiple distinct Achievements across **6 Standardized Achievement Archetypes (`TYPE-A` through `TYPE-F`)**:

| Archetype | Name | Recognition Scope | Example on `DEST-001` (Mount Everest / Sagarmatha) | Verification Tier | Base Points |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TYPE-A** | **Approach / Base Camp / High Pass** | Reaching the official Base Camp, sanctuary, or primary trekking pass of a massif | `ACH-001-A`: *Everest South Base Camp Trek Completion (5,364m via Khumbu Trail)* | L2 High-Altitude Reviewer (`CAT-04`) | 300 |
| **TYPE-B** | **Standard Route Summit / Traverse** | Reaching the true summit or completing the primary trail via the normal/standard route | `ACH-001-B`: *Mount Everest Summit via Southeast Ridge (`RTE-001A`) or Northeast Ridge (`RTE-001B`)* | Dual L4 Senior Reviewers (`CAT-12`) | 2,500 |
| **TYPE-C** | **Technical / Alternative Route** | Completing a recognized high-difficulty technical face, ridge, or couloir route | `ACH-001-C`: *Mount Everest Summit via West Ridge or Kangshung Face* | Dual L4 Senior Reviewers (`CAT-12`) | 3,200 |
| **TYPE-D** | **Pure Alpine / No-O2 / Winter Style** | Completing a high-altitude summit without supplemental oxygen (`No-O2`) or in calendar winter | `ACH-001-D`: *Mount Everest Summit without Supplemental Oxygen (`No-O2` Verified)* | Dual L4 Senior Reviewers + Telemetry Audit | 3,500 |
| **TYPE-E** | **Enchainment / Full Massif Link-Up** | Continuous single-push traverse linking multiple major summits or full continental trail | `ACH-001-E`: *Everest (8,848.86m) – Lhotse (8,516m) Continuous Traverse* | Dual L4 Senior Reviewers (`CAT-12`) | 3,500 |
| **TYPE-F** | **Heritage & Environmental Stewardship** | Verified mountain clean-up, Leave No Trace pack-out (`NF-05`), or cultural preservation | `ACH-001-F`: *Khumbu Glacier & Base Camp Verified Clean-Up Stewardship (`CAT-24`)* | L1 Stewardship / Heritage Guardian (`NF-01`) | 0 (Civic Badge) |

---

## 2. Elevation Progression Ladder ("The 0 TO 8848 Milestones")
In addition to destination-specific achievements, the platform recognizes progressive altitude milestones from sea level (`0m`) to the roof of the world (`8,848.86m`):

1. `ACH-LADDER-0000`: **Sea-to-Trail Initiate** (First verified adventure achievement at any elevation $\ge 0\text{m}$)
2. `ACH-LADDER-1000`: **1,000m Upland Explorer** (Verified completion $\ge 1,000\text{m}$)
3. `ACH-LADDER-2500`: **2,500m Mountain Trekkers' Crest** (Verified completion $\ge 2,500\text{m}$)
4. `ACH-LADDER-4000`: **4,000m Alpine Threshold** (Verified completion $\ge 4,000\text{m}$)
5. `ACH-LADDER-5000`: **5,000m High-Himalayan & Andean Horizon** (Verified completion $\ge 5,000\text{m}$)
6. `ACH-LADDER-6000`: **6,000m Glaciated Thin-Air Tier** (Verified completion $\ge 6,000\text{m}$)
7. `ACH-LADDER-7000`: **7,000m Expedition Vanguard** (Verified completion $\ge 7,000\text{m}$)
8. `ACH-LADDER-8000`: **8,000m Death-Zone Sovereign** (Verified summit of any of the 14 Eight-Thousanders $\ge 8,000\text{m}$)
9. `ACH-LADDER-8848`: **8,848.86m Apex of the Earth (Sagarmatha / Chomolungma)** (Verified summit of Mount Everest)

---

## 3. Transparent Leaderboard Scoring Methodology
$$\text{Verified Achievement Points} = \text{Archetype Base Points} \times M_{\text{difficulty}} \times M_{\text{altitude/remoteness}} \times D_{\text{repeat}}$$

Where:
- $M_{\text{difficulty}} \in [1.00, 2.00]$ is derived deterministically from the route's published technical grade.
- $M_{\text{altitude/remoteness}} \in [1.00, 1.50]$ reflects objective physiological hypoxia and SAR remoteness.
- $D_{\text{repeat}}$ is the repeat-ascent diminishing return factor:
  - 1st verified completion of a specific route: $D_{\text{repeat}} = 1.00$ ($100\%$ points).
  - 2nd verified completion of the same route (different season/year): $D_{\text{repeat}} = 0.25$ ($25\%$ points).
  - 3rd+ verified completion of the same route: $D_{\text{repeat}} = 0.00$ (Logged in personal expedition history and completion count, but adds $0$ leaderboard points to prevent local trail grinding).
- **Constitutional Invariant:** Subscriptions, sponsorships, marketplace bookings, and `TYPE-F` environmental badges have a hardcoded multiplier of **`0.00`** in competitive leaderboard calculations.
