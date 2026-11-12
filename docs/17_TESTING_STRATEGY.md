# 17 — TESTING, AUDITING & QUALITY ASSURANCE STRATEGY (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 03 — DEVELOPMENT INFRASTRUCTURE & GITHUB  
**Test Runner Architecture:** Node 22 Native Test Runner (`node --import tsx --test tests/*.test.ts`) + TypeScript Strict Compiler (`tsc --noEmit`)

---

## 1. Zero-Fabrication Testing Mandate (Section 72)
Every test result reported in any Phase Report (`Phases 01–21`) must be backed by actual command execution output from `npm test`, `npm run lint`, `npm run security:scan`, and `npm run build`. No test may be marked `PASS` without traceable execution evidence.

---

## 2. Mapping of All 32 Required Test Categories (Section 71)

| Test Cat # | Required Test Category | Target Test Suite File | Assigned Phase(s) | Core Assertions |
| :---: | :--- | :--- | :---: | :--- |
| **01** | Unit Tests | `tests/unit-domain.test.ts` | 03–19 | Pure domain math (ECF, DEM RMSE, West physiology, BS calendar conversion) |
| **02** | Integration Tests | `tests/integration-services.test.ts` | 05–19 | End-to-end repository + service workflows |
| **03** | API Tests | `tests/api-security.test.ts` | 06–20 | `/api/v1/*` status codes, envelopes, rate limits, input validation |
| **04** | Authentication Tests | `tests/auth-privacy.test.ts` | 08 | Registration, login, MFA enforcement, session revocation, lockout |
| **05** | Authorization (RBAC) Tests | `tests/security-governance.test.ts` | 07 | All 21 roles verified against least-privilege matrix |
| **06** | Database Permission Tests | `tests/database-permissions.test.ts` | 05 | Default-deny rules, immutable audit/hash tables, no role self-promotion |
| **07** | Storage Permission Tests | `tests/achievement-evidence.test.ts` | 11 | Write-once evidence storage, SHA-256 verification on read |
| **08** | Evidence Validation Tests | `tests/achievement-evidence.test.ts` | 11 | Magic-byte check, XXE block on GPX, residential 1km geozone trim |
| **09** | Achievement Workflow Tests | `tests/achievement-evidence.test.ts` | 11 | Multi-archetype (`TYPE-A..F`) & 0-to-8848 ladder progression |
| **10** | Human Verification Tests | `tests/verification-antifraud-appeals.test.ts` | 12 | COI blocking, Dual-Senior L3/L4 gate on Elite peaks, Heritage Guardian gate |
| **11** | Independent Appeal Tests | `tests/verification-antifraud-appeals.test.ts` | 12 | Original reviewer(s) hard-blocked from appeal decisions |
| **12** | Scientific Anti-Fraud Tests | `tests/verification-antifraud-appeals.test.ts` | 12 | Copernicus DEM $E_{\text{RMSE}}$, West $V_{\max}(h, \Delta t)$, 64-bit DCT `pHash` $D_H \le 6$ |
| **13** | Badge Integrity Tests | `tests/credentials-badges-registry.test.ts` | 13 | 100 destination 3D shields, non-transferability, free standard guarantee |
| **14** | Certificate Verification Tests | `tests/credentials-badges-registry.test.ts` | 13 | QR URL generation, Ed25519 signature verification |
| **15** | Public Credential Portal Tests | `tests/credentials-badges-registry.test.ts` | 13 | Zero-PII & zero raw GPS leak verification (`PublicCredentialVerificationDTO`) |
| **16** | Leaderboard Integrity Tests | `tests/leaderboards-community-legends.test.ts` | 14 | Verified-only counting, diminishing repeat factor, Legends exclusion |
| **17** | Marketplace Safety Tests | `tests/marketplace-safety.test.ts` | 10 | Unverified guide restrictions, license/insurance flags, dispute handling |
| **18** | Organization & Federation Tests | `tests/organizations-federation.test.ts` | 15 | Org self-approval blocked (`403`); read-only Federation API consent check |
| **19** | Sponsor Isolation Tests | `tests/sponsor-isolation-firewall.test.ts` | 16 | Business Independence Firewall (`ReviewerCaseViewDTO`), mandatory `SPONSORED` tag |
| **20** | Financial Reconciliation Tests | `tests/payment-disabled-financial.test.ts` | 17 | Double-entry ledger balance, `$0` standard badge/certificate verification |
| **21** | Payment-Disabled Tests | `tests/payment-disabled-financial.test.ts` | 03, 17 | `PAYMENTS_ENABLED === false` & `HTTP 403 Locked` on checkout |
| **22** | Blockchain-Disabled Tests | `tests/ai-blockchain-governance.test.ts` | 03, 18 | `BLOCKCHAIN_ENABLED === false` & `HTTP 403 Locked` on mint |
| **23** | AI Governance Tests | `tests/ai-blockchain-governance.test.ts` | 18 | `AI_FINAL_DECISION_ALLOWED === false`, audit logging, PII scrub |
| **24** | Privacy & Retention Tests | `tests/auth-privacy.test.ts` | 05, 08 | Post-approval raw binary purge (keeping SHA-256), $k \ge 5$ analytics, GDPR/Nepal export |
| **25** | Accessibility (WCAG 2.2 AA) Tests | `tests/ui-accessibility-i18n.test.ts` | 04, 20 | Tabular elevation alternatives for maps, ARIA landmarks, keyboard nav |
| **26** | Responsive & Low-Bandwidth UI Tests | `tests/ui-accessibility-i18n.test.ts` | 04, 20 | Mobile-first viewports + `<15 KB` Low-Bandwidth Base-Camp Mode |
| **27** | Performance Tests | `tests/full-32-suite-runner.test.ts` | 20 | Sub-100ms ECF/anti-fraud calculation and leaderboard query latency |
| **28** | Load & Concurrency Tests | `tests/full-32-suite-runner.test.ts` | 20 | Concurrent case claims (atomic COI lock prevents double-assignment) |
| **29** | Regression Tests | `tests/infrastructure-phase03.test.ts` | 03–21 | Cumulative regression suite across all completed phases |
| **30** | Backup & Restore Parity Tests | `tests/database-permissions.test.ts` | 05, 20 | Export encrypted snapshot $\rightarrow$ restore $\rightarrow$ verify 100% SHA-256 manifest match |
| **31** | Disaster Recovery & Vendor Exit Tests | `tests/database-permissions.test.ts` | 05, 20 | Adapter swap verification & Founder quorum continuity timelock |
| **32** | Security & Secret Scan Tests | `tests/infrastructure-phase03.test.ts` | 03–21 | `runRepositorySecurityScan()`, whistleblower zero-IP & admin isolation |
