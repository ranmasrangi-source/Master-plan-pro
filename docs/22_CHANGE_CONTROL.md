# 22 — CHANGE CONTROL & RELEASE GOVERNANCE (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 03 — DEVELOPMENT INFRASTRUCTURE & GITHUB

---

## 1. Phase-Gated Change Control
1. **No Unapproved Phase Advancement:** Every phase (`PHASE 01` through `PHASE 21`) requires a formal Phase Report (Section 77) and explicit Founder Gate authorization before the next phase commences.
2. **Requirements Traceability:** No requirement in `/docs/02_REQUIREMENTS.md` may be silently removed or downgraded. Any proposed adjustment to a category, achievement criterion, verification standard, or destination attribute must be logged with a `policyVersion` increment (`v1.1.0` $\rightarrow$ `v1.2.0`).

---

## 2. Constitutional & Policy Version Control
- Historical Achievement Applications are always evaluated against the `effectivePolicyVersion` active at the time of application submission (or a more favorable updated alternative evidence pathway if approved by Governance).
- Changes to `/docs/00_PROJECT_CONSTITUTION.md` or `/src/types/constitution.ts` require **Founder + Governance Committee Quorum** and a **72-hour cooling time-lock** (`System #14`).
