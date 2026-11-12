# 16 — OFFICIAL DESIGN SYSTEM, UI/UX & ACCESSIBILITY GUIDELINES (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 04 — BRAND, UI/UX & DESIGN SYSTEM  
**Compliance Baseline:** WCAG 2.2 Level AA + Low-Bandwidth Expedition Mode (`System #20`) + Bilingual `EN / नेपाली` (`CHK-01.15`) + RTL (`ar`)

---

## 1. Visual Identity & Color Architecture (Section 63)

### 1.1 Official Brand Palette (60-30-10 Allocation)
- **60% Dominant Canvas — Obsidian Black (`#0A0A0A`):** Deep mountain night canvas providing stark museum-grade contrast for credentials, maps, and documentary photography.
- **30% Structural Surfaces — Basalt Slate (`#121212` / `#18181B`) & Hairline Borders (`rgba(201, 168, 106, 0.18)`):** Flat, single-elevation containers separated by 1px hairline borders and generous whitespace (`2rem–3rem`).
- **10% Institutional Accent — Metallic Gold (`#C9A86A`), Highlight Gold (`#FFD700`), and Summit White (`#FFFFFF`):** Reserved strictly for primary interactive affordances, verified credential seals, and active navigation indicators.

### 1.2 WCAG 2.2 AA Contrast Verification
| Foreground Element | Hex Code | Background Surface | Contrast Ratio | WCAG 2.2 Standard |
| :--- | :---: | :---: | :---: | :---: |
| Summit White Text | `#FFFFFF` | Obsidian Black (`#0A0A0A`) | **19.85 : 1** | **AAA / AA Pass** ($\ge 4.5:1$) |
| Metallic Gold Heading / Border | `#C9A86A` | Obsidian Black (`#0A0A0A`) | **8.42 : 1** | **AAA / AA Pass** ($\ge 4.5:1$) |
| Highlight Gold Focus / Seal | `#FFD700` | Obsidian Black (`#0A0A0A`) | **13.92 : 1** | **AAA / AA Pass** ($\ge 4.5:1$) |
| Accessible Secondary Stone Text | `#B5B5B5` | Basalt Surface (`#121212`) | **8.95 : 1** | **AAA / AA Pass** ($\ge 4.5:1$) |
| Obsidian Text on Metallic Gold CTA | `#0A0A0A` | Metallic Gold (`#C9A86A`) | **8.42 : 1** | **AAA / AA Pass** ($\ge 4.5:1$) |

---

## 2. Typographic Hierarchy & Script Support
1. **Institutional Display Face (`Cinzel`):** Used for primary headings, official certificate titles, and 3D mountain shield badge inscriptions (`text-wrap: balance`).
2. **Primary Body & UI Face (`Plus Jakarta Sans` / `Inter` fallback):** High-legibility sans-serif for dense destination tables, verification evidence checklists, and policies (`65–75ch` reading measure).
3. **Nepali & Devanagari Face (`Noto Sans Devanagari` — `CHK-01.15`):** Rendered seamlessly for all Nepali (`नेपाली`) destination names, Bikram Sambat (`वि.सं.`) dates, and bilingual UI navigation.
4. **Telemetry & Hash Monospace (`JetBrains Mono` with `tabular-nums`):** Enforced on all elevations (`8,848.86m`), coordinates, SHA-256 digests, and 5-Pillar ECF scores.

---

## 3. Navigation & Anti-Slop Layout Discipline
1. **3-Zone Top Bar Contract:**
   - **Zone 1:** Single-line `0 TO 8848` wordmark (`whitespace-nowrap shrink-0`).
   - **Zone 2:** 5 single-line navigation links (`Destinations`, `Categories`, `Verification`, `Credentials`, `All 42 Pages`).
   - **Zone 3:** 1 primary CTA button (`Verify Credential`).
2. **Operational Utility Ribbon (Below Header):** Houses the **Language & Script Switcher** (`English`, `नेपाली`, `العربية RTL`), **Low-Bandwidth Base-Camp Mode Toggle** (`System #20`), and **42-Page Directory Trigger**.
3. **Zero Static Pill Enclosures:** Categories, elevations, coordinates, and source confidence tags are displayed as clean unboxed typography separated by `·` or `/`.

---

## 4. Accessibility (WCAG 2.2 AA) & Low-Bandwidth Expedition Mode
1. **Non-Map Tabular Alternatives:** Every route elevation profile and geospatial map includes a synchronous, screen-reader-accessible `<table>` listing waypoint names, coordinates, elevations, cumulative distance, and objective hazards.
2. **Low-Bandwidth Base-Camp Mode (`System #20`):** When toggled on (or auto-detected via `Save-Data` header), the UI disables high-resolution photography and 3D metallic gradients, switching to `<15 KB` wireframe vector badges and tabular data views suitable for satellite comms at base camp.
3. **Keyboard & Reduced Motion:** Full `:focus-visible` gold focus rings (`2px solid #FFD700`), skip-to-content link, and `@media (prefers-reduced-motion: reduce)` support.
