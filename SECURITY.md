# Security Policy & Vulnerability Disclosure (`SECURITY.md`)

**Project:** 0 TO 8848 (`https://0to8848official.com`)  
**Responsible Department:** `DEPT-05` (Security Department) & `DEPT-11` (Internal Audit)

---

## 1. Supported Versions
| Version | Phase Baseline | Security Support Status |
| :--- | :--- | :--- |
| `ULTIMATE V1.1` | Phases 01–21 | **Active — Protected by Constitutional & CI Gates** |

---

## 2. Reporting a Vulnerability or Integrity Issue
1. **Technical Security Vulnerabilities:** Report suspected XSS, CSRF, SQL/NoSQL injection, broken access control (IDOR), authentication bypass, or cryptographic custody flaws via the platform's **Security Disclosure Channel** or directly to the Security Department.
2. **Fraud, Bribery, or Governance Abuse (`System #4` Whistleblower Vault):** Submit confidential, zero-IP reports via `POST /api/v1/integrity/whistleblow`. Whistleblower submissions are encrypted for `DEPT-11` (Internal Audit) and strictly isolated from `system_admin` accounts.

---

## 3. Remediation Target SLAs (Section 45)
- **Critical (`SEV-1` — Credential forgery, PII leak, auth bypass, hash chain break):** Containment within **4 hours**; patch deployed within **24 hours**.
- **High (`SEV-2` — RBAC escalation, COI bypass, appeal isolation flaw):** Containment within **12 hours**; patch deployed within **72 hours**.
- **Medium (`SEV-3`):** Remediated within **14 calendar days**.
- **Low (`SEV-4`):** Remediated within next scheduled release cycle.
