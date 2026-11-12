## 0 TO 8848 — Pull Request & Constitutional Compliance Checklist

### 1. Phase & Requirement Traceability
- **Phase Number (01–21):** `PHASE __`
- **Requirement IDs Addressed (`REQ-*`):** 
- **Bug IDs Resolved (if applicable):** 

### 2. Mandatory Constitutional & Security Verification
- [ ] **Earned, Never Bought:** Does this change preserve 100% free standard badges, certificates, and public verification?
- [ ] **Business Independence Firewall:** Are commercial/sponsor fields completely isolated from `ReviewerCaseViewDTO`, `AppealCaseRecord`, and `LeaderboardEntry`?
- [ ] **Launch Locks Intact:** Are `PAYMENTS_ENABLED === false`, `BLOCKCHAIN_ENABLED === false`, and `AI_FINAL_DECISION_ALLOWED === false` preserved?
- [ ] **Strict TypeScript & Linting:** Does `npm run lint` (`tsc --noEmit` in strict mode) pass with zero errors?
- [ ] **Secret Scan:** Does `npm run security:scan` pass with zero leaked secrets?
- [ ] **Real Test Evidence:** Are automated tests added/updated and passing via `npm test`?
