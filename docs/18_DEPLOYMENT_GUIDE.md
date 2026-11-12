# 18 — ENVIRONMENT SEPARATION, CI/CD & DEPLOYMENT GUIDE (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 03 — DEVELOPMENT INFRASTRUCTURE & GITHUB

---

## 1. Environment Separation Architecture (Section 43)
The platform enforces strict logical and credential isolation across three environments:

| Environment | Purpose | Database & Storage Backing | Payment & Blockchain Locks | Access Control |
| :--- | :--- | :--- | :--- | :--- |
| **`development` / `test`** | Local & preview engineering, automated 32-suite testing | Isolated dev/in-memory relational adapter + synthetic fixtures | `PAYMENTS_ENABLED = false`<br>`BLOCKCHAIN_ENABLED = false` | Engineering team |
| **`staging`** | Pre-release QA, Reviewer calibration dry-runs, DR restore drills | Isolated staging database & storage bucket (Zero production PII) | `PAYMENTS_ENABLED = false`<br>`BLOCKCHAIN_ENABLED = false` | QA, Internal Audit, Founder |
| **`production`** | Official `https://0to8848official.com` live recognition platform | Production ACID relational database + encrypted sovereign replicas | `PAYMENTS_ENABLED = false`<br>`BLOCKCHAIN_ENABLED = false` *(Locked at launch)* | Quorum-gated CI/CD deployment only |

---

## 2. Step-by-Step Terminal Commands (Android / Cloud / Desktop Accessible — Section 82)
The Founder can verify or build the entire project from any terminal (including mobile SSH/cloud shell or AI Studio terminal) using four deterministic commands:

1. **Scan for Secrets & Verify Constitutional Locks:**
   ```bash
   npm run security:scan
   ```
2. **Verify Strict TypeScript Types (`tsc --noEmit`):**
   ```bash
   npm run lint
   ```
3. **Run the Automated Test Suite:**
   ```bash
   npm test
   ```
4. **Compile the Production Bundle:**
   ```bash
   npm run build
   ```
