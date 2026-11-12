# 05 — VERIFICATION STANDARDS & SCIENTIFIC ANTI-FRAUD SPECIFICATION (ULTIMATE V1.1 — AMENDED PER A3 & A4)

**Document Version:** ULTIMATE V1.1 (Incorporating Binding Amendments A3 & A4)  
**Status:** PHASE 01 SPECIFICATION — APPROVED IN PRINCIPLE (Per Founder Decision FQ-03)

---

## 1. Evidence Confidence Framework (ECF) Scoring Matrix
Every achievement application is evaluated across **5 Independent Evidence Pillars** (Maximum Raw Sum = `160 Points`, with **Minimum Eligibility Threshold = `75 Points`** plus mandatory human reviewer decision):

| Pillar ID | Evidence Pillar Name | Max Points | Scoring Breakdown Criteria |
| :--- | :--- | :---: | :--- |
| **PIL-01** | **Visual & Contextual Media** | **40** | • Approach/start landmark photo (`+10`)<br>• Intermediate route/camp progression photos (`+10`)<br>• True summit / endpoint photo with recognizable horizon/topography (`+15`)<br>• Continuous unedited summit panorama video or raw camera sequence (`+5`) |
| **PIL-02** | **Geospatial & Barometric Telemetry** | **35** | • Continuous GPX/FIT/TCX GNSS track matching route polygon (`+20`)<br>• Barometric altimeter / DEM elevation profile consistency within $\pm 35\text{m}$ (`+10`)<br>• Verified two-way satellite communicator telemetry (Garmin inReach / SPOT / Zoleo share feed) (`+5`) |
| **PIL-03** | **Official Documentary & Regulatory Records** | **35** | • Official government/ministry climbing permit or national park entry permit (`+20`)<br>• Liaison officer log, park checkpoint stamp, or alpine hut register book scan (`+10`)<br>• Accredited mountaineering federation / ministry summit certificate (`+5`) |
| **PIL-04** | **Independent Human Corroboration** | **30** | • Token-verified attestation from a licensed `Professional Guide` / Expedition Leader (`+20`)<br>• Token-verified attestation from $\ge 1$ independent summit/route witness (`+10`)<br>• Heritage Guardian cultural protocol attestation where applicable (`NF-01`) |
| **PIL-05** | **Chronological & Meteorological Plausibility** | **20** | • Coherent multi-waypoint timestamp progression matching physiological ascent rates (`+10`)<br>• Historical weather window & solar shadow azimuth consistency (`+10`) |
| **TOTAL** | **Maximum Possible Raw ECF Score** | **160** | **Minimum Passing Threshold for Human Approval = `75 Points`** |

---

## 2. Binding Amendment A3 — Worked Mathematical Examples & Override Audit Trail

### Worked Example 1: GPS-Only Submission (Must Fail Eligibility `< 75 Points`)
- **Scenario:** An applicant submits a valid, unbroken GPX track file (`RTE-016A` Imja Tse / Island Peak, 6,165m) that matches the route geometry and DEM elevation profile, with coherent timestamps, **but provides zero photos, zero climbing permits, and zero witness attestations.**
- **Pillar-by-Pillar Calculation:**
  - `PIL-01 (Visual Media)`: `0 / 40` (No photos or videos uploaded)
  - `PIL-02 (Geospatial Telemetry)`: `20 (GPX track) + 10 (Barometric/DEM match) + 0 (No sat feed) = 30 / 35`
  - `PIL-03 (Official Documentary)`: `0 / 35` (No NMA/DoT permit or checkpoint stamp uploaded)
  - `PIL-04 (Independent Witness)`: `0 / 30` (No guide or witness attestation)
  - `PIL-05 (Chronological Plausibility)`: `10 (Track timestamps coherent) + 0 (No visual weather match) = 10 / 20`
- **Total ECF Score:**
  $$\text{ECF}_{\text{total}} = 0 + 30 + 0 + 0 + 10 = \mathbf{40\text{ Points}} \quad (< 75\text{ Threshold})$$
- **System Outcome:** **AUTOMATIC HOLD (`STATUS: MORE_EVIDENCE_REQUIRED`)**. The system blocks any reviewer from clicking `APPROVE` because `40 < 75` and `PIL-01 == 0`. This mathematically enforces Section 14: *"GPS alone must never automatically prove a completed achievement."*

### Worked Example 2: GPS-Free & EXIF-Stripped Submission via Alternative Pathway (`>= 75 Points`)
- **Scenario:** A Nepali climber summits Mera Peak (`DEST-017`, 6,476m). At `-28°C` on the summit glacier, their phone/GPS watch battery dies (zero GPX track), and their summit photographs were backed up via a messaging app that stripped all EXIF metadata. However, the climber submits:
  1. Three clear photos (Base Camp, High Camp, and True Summit showing Everest/Lhotse/Makalu horizon) (`PIL-01`).
  2. Official Nepal Mountaineering Association (NMA) climbing permit + Makalu Barun National Park checkpoint stamp (`PIL-03`).
  3. Token-verified attestation from their NMA-licensed climbing guide + one independent rope-team witness (`PIL-04`).
  4. Coherent 4-day camp log matching historical weather and solar shadow angle at 06:30 NPT (`PIL-05`).
- **Pillar-by-Pillar Calculation:**
  - `PIL-01 (Visual Media)`: `10 (Start/BC) + 10 (High Camp) + 15 (Summit horizon match) + 0 = 35 / 40` *(0 penalty for stripped EXIF)*
  - `PIL-02 (Geospatial Telemetry)`: `0 / 35` *(No GPX track available)*
  - `PIL-03 (Official Documentary)`: `20 (NMA Permit) + 10 (Park checkpoint record) + 0 = 30 / 35`
  - `PIL-04 (Independent Witness)`: `20 (Licensed Guide token attestation) + 10 (Independent climber witness) = 30 / 30`
  - `PIL-05 (Chronological Plausibility)`: `10 (Camp log timeline) + 10 (Solar shadow & weather match) = 20 / 20`
- **Total ECF Score:**
  $$\text{ECF}_{\text{total}} = 35 + 0 + 30 + 30 + 20 = \mathbf{115\text{ Points}} \quad (\ge 75\text{ Threshold})$$
- **System Outcome:** **ELIGIBLE FOR HUMAN VERIFICATION APPROVAL (`Pathway: ALT_NO_GPS_DOCUMENTARY_WITNESS`)**. Assigned to an L3 Senior Alpine Reviewer for final human verification and approval.

### Worked Example 3: Exceptional Reviewer Override & Immutable Audit Trail
- **When Permitted:** What if a historical/archival ascent or extraordinary rescue-interrupted summit scores `68–74 Points` (just below `75`) due to a missing park stamp in an unstaffed wilderness range, yet possesses overwhelming visual and witness proof?
- **Strict Override Governance Rule:**
  1. A regular `L1/L2 Reviewer` **cannot** override the 75-point threshold.
  2. An override requires **Dual Senior Reviewer Co-Sign (`2x L3/L4`)** plus **Verification Department Lead sign-off**.
  3. Even with an override, **`PIL-02` (GPS-only) can NEVER be overridden**—at least two non-GPS pillars must be present.
  4. **Mandatory Audit Schema (`ecfOverrideAuditLogs`):**
     ```json
     {
       "overrideId": "OVR-2026-00042",
       "applicationId": "APP-2026-09112",
       "computedEcfScore": 70,
       "requiredThreshold": 75,
       "missingPillarReason": "Unstaffed remote trailhead in Cordillera Huayhuash; no official government stamp issued in 2024",
       "compensatingEvidenceSummary": "Verified raw summit photos + barometric GPX + 2 independent witness attestations",
       "primarySeniorReviewerId": "USR-REV-L3-019",
       "coSigningSeniorReviewerId": "USR-REV-L3-044",
       "verificationLeadApprovalId": "USR-DEPT03-LEAD",
       "policyVersion": "v1.1.0",
       "prevAuditHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
       "overrideEventHash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
       "timestamp": "2026-11-12T08:30:00Z"
     }
     ```

---

## 3. Binding Amendment A4 — Scientific Anti-Fraud Technical Specification

### 3.1 Digital Elevation Model (DEM) Source & Cross-Check Specification
- **Primary Authoritative DEM Dataset:** **Copernicus DEM GLO-30 (30-meter / 1 arc-second horizontal resolution)** provided via public AWS/ESA Registry of Open Data GeoTIFF tiles, supplemented by **NASA SRTM GL1 (30m)** between $60^\circ\text{N}$ and $56^\circ\text{S}$ and **ArcticDEM / REMA (8m–32m)** for polar regions (`DEST-099`, `DEST-100`).
- **Elevation Verification Formula:**
  For every $i$-th trackpoint $(\phi_i, \lambda_i, h_{\text{gpx}, i})$ in an uploaded GPX track ($i = 1 \dots N$), the server interpolates terrain elevation $h_{\text{DEM}}(\phi_i, \lambda_i)$ using bilinear interpolation across the 4 surrounding 30m grid cells and computes the Root Mean Square Elevation Residual ($E_{\text{RMSE}}$):
  $$E_{\text{RMSE}} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} \left( h_{\text{gpx}, i} - h_{\text{DEM}}(\phi_i, \lambda_i) - \Delta_{\text{geoid}} \right)^2}$$
  - **Normal Barometric/GNSS Track:** $2.5\text{m} \le E_{\text{RMSE}} \le 45.0\text{m}$ (natural barometric drift & cliff gradient variance).
  - **Synthetic Route-Planner Track Flag (`SYNTHETIC_DEM_CLAMP_FLAG`):** If $E_{\text{RMSE}} < 0.3\text{m}$ across $>500$ points, the GPX elevation was artificially snapped to a digital map DEM rather than recorded by a real physical sensor in the field.
  - **Altitude Spoofing / Offset Flag (`ELEVATION_MISMATCH_FLAG`):** If $E_{\text{RMSE}} > 120.0\text{m}$ or $\max(h_{\text{gpx}}) - h_{\text{summit}} > 150\text{m}$, the track does not match the vertical topography of the claimed destination.

### 3.2 Physiological Altitude-Calibrated Ascent Rate Formula
Instead of an arbitrary flat speed limit, maximum plausible human vertical ascent velocity $V_{\text{max}}(h, \Delta t)$ (in vertical meters per hour) at mean elevation $h$ (in meters above sea level) over duration $\Delta t$ (in hours) is calibrated using **West's High-Altitude Exercise Physiology $\text{VO}_2\max$ Decay Model** and **Riegel's Endurance Fatigue Exponent**:

$$V_{\text{max}}(h, \Delta t) = V_{\text{ref}} \cdot \Phi(h) \cdot (\Delta t)^{-0.07}$$

Where:
1. **Sea-Level Reference Vertical Ceiling ($V_{\text{ref}}$):**
   - `CAT-15 / CAT-16` (Elite Skimo / Vertical Trail Running): $V_{\text{ref}} = 2,100\text{ m/hr}$
   - `CAT-01..CAT-10` (Loaded Trekking / Alpine Climbing): $V_{\text{ref}} = 1,250\text{ m/hr}$
2. **Barometric Hypoxia Decay Factor ($\Phi(h)$):**
   $$\Phi(h) = \begin{cases} 1.00 & \text{if } h \le 1,500\text{m} \\ \max\left(0.15,\; 1.00 - 0.095 \left(\frac{h - 1500}{1000}\right) - 0.008 \left(\frac{h - 1500}{1000}\right)^2 \right) & \text{if } h > 1,500\text{m} \end{cases}$$
   - *Calibration Check at Key Elevations (for 1-hour sustained effort, $\Delta t = 1$):*
     - At **$1,500\text{m}$ (Alps Valley / Vertical KM):** $\Phi(1500) = 1.00 \implies V_{\text{max}} = 2,100\text{ m/hr}$ (Endurance) / $1,250\text{ m/hr}$ (Trekking).
     - At **$5,000\text{m}$ (Khumbu / Andean Base Camp):** $\Phi(5000) = 1 - 0.3325 - 0.098 = 0.5695 \implies V_{\text{max}} \approx 712\text{ m/hr}$ (Loaded Climb).
     - At **$8,000\text{m}$ (Everest South Col to Summit):** $\Phi(8000) = 1 - 0.6175 - 0.338 = 0.15 \text{ (floor)} \implies V_{\text{max}} \approx 187\text{ m/hr}$ (With O2 multiplier $\times 1.45 \approx 272\text{ m/hr}$).
3. **Action on Exceedance:** Any segment exceeding $1.25 \times V_{\text{max}}(h, \Delta t)$ flags `KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE` for human review (checking for helicopter lift, motorized vehicle segment, or GPS multipath glitch).

### 3.3 Perceptual Image Hashing (`pHash`) Library, Bit-Length & Hamming Distance Thresholds
- **Algorithm & Bit-Length:** **64-bit Discrete Cosine Transform (DCT) Perceptual Hash (`pHash`)** paired with **64-bit Difference Gradient Hash (`dHash`)** and **256-bit Cryptographic File Hash (`SHA-256`)**.
- **Implementation Architecture:** Pure TypeScript/Node.js server-side implementation (`sharp` / canvas 32×32 grayscale luminance downsample $\rightarrow$ 2D DCT matrix $\rightarrow$ top-left 8×8 low-frequency coefficients excluding DC component $\rightarrow$ 64-bit binary median signature stored as a 16-character hex string + binary `BIT(64)` column).
- **Hamming Distance ($D_H$) Decision Thresholds (Out of 64 Bits):**
  $$D_H(H_A, H_B) = \text{popcount}(H_A \oplus H_B)$$
  - **$D_H = 0$ AND $\text{SHA-256}_A = \text{SHA-256}_B$:** **Exact Binary Duplicate** (`CRITICAL_EXACT_DUPLICATE_FLAG`).
  - **$0 \le D_H \le 6$ (Similarity $\ge 90.6\%$):** **Near-Identical Re-encoded / Cropped / Resized / Watermarked Copy** (`HIGH_VISUAL_DUPLICATE_FLAG` — e.g., screenshot or WhatsApp-compressed copy of an existing summit photo).
  - **$7 \le D_H \le 12$ (Similarity $81.2\%\text{–}89.1\%$):** **Moderate Visual Similarity** (`MODERATE_SIMILARITY_REVIEW_FLAG` — side-by-side comparison shown to Reviewer to distinguish same-day burst shots from edited photos).
  - **$D_H \ge 13$:** Visually distinct image (`PASS`).
- **Mirror-Flip Defense:** Every uploaded image is hashed in both normal orientation ($H_{\text{norm}}$) and horizontal mirror flip ($H_{\text{mirror}}$) so horizontally flipped stolen summit photos are caught immediately.
