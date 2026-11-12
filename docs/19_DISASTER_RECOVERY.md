# 19 — DISASTER RECOVERY, BUSINESS CONTINUITY & VENDOR EXIT PLAN (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 02 — TECHNICAL ARCHITECTURE & SYSTEM DESIGN  
**Covered Systems:** System #13 (Vendor Independence & Migration), System #14 (Founder Succession & Governance Continuity), System #18 (DR/BC Engine), `FQ-08` (Sovereign Data Residency)

---

## 1. Recovery Objectives (RTO & RPO)

| System Tier | Covered Services & Data | Recovery Point Objective (RPO) | Recovery Time Objective (RTO) | Continuity Mechanism |
| :--- | :--- | :---: | :---: | :--- |
| **Tier 0 — Authoritative Recognition Ledger** | `credential_registry`, `credential_lifecycle_events`, `evidence_hashes`, `audit_logs` | **$\le 15\text{ minutes}$** (Write-Ahead / Continuous Hash Snapshot) | **$\le 1\text{ hour}$** | Append-only hash-chained ledger + multi-region encrypted replica |
| **Tier 1 — Public Verification Portal & Safety Notices** | `/verify/:credentialId`, `public_credentials`, `destinations`, `safety_advisories` | **$\le 1\text{ hour}$** | **$\le 30\text{ minutes}$** | Read-only static/edge fallback mode + detached W3C VC offline signature verification |
| **Tier 2 — Active Verification, Appeals & Auth** | `achievement_applications`, `verification_cases`, `appeal_cases`, `users` | **$\le 1\text{ hour}$** | **$\le 4\text{ hours}$** | Automated daily + hourly incremental encrypted snapshots |
| **Tier 3 — Community, Marketplace & Analytics** | `community_posts`, `marketplace_listings`, `aggregated_daily_metrics` | **$\le 24\text{ hours}$** | **$\le 12\text{ hours}$** | Daily encrypted snapshot restoration |

---

## 2. Encrypted Backup & Sovereign Residency Architecture (`FQ-08` & `CHK-01.16`)
1. **Application-Layer Envelope Encryption:** All backup archives and `TIER_4_REGULATED_PII` records are encrypted using `AES-256-GCM` with authenticated associated data (`AAD` bound to `recordId` and `residencyRegion`).
2. **Jurisdictional Residency Partitioning (`NP | EU | UAE | GLOBAL`):**
   - Records tagged `residencyRegion: "NP"` (Nepalese citizens and Nepal government permits) are logically partitioned so an encrypted sovereign mirror can be synced to a Nepal-domiciled storage node in compliance with **Nepal's Individual Privacy Act, 2075 (2018)**, while global public credential hashes remain verifiable worldwide.
3. **Mandatory Automated Restore Verification (`DR-TEST-01`):**
   - Every backup snapshot records a root SHA-256 manifest (`backup_verification_logs`).
   - A backup is never marked `VERIFIED` until the automated restore verifier loads the snapshot into an isolated ephemeral namespace and confirms 100% row-count and hash-chain parity.

---

## 3. Vendor Dependency Register & 48-Hour Exit Runbook (System #13)

| Service Category | Abstract Interface | Primary Provider | Zero-Lock-In Fallback / Exit Target | Max Migration Time |
| :--- | :--- | :--- | :--- | :---: |
| **Primary Relational Database** | `IDatabaseRepository` (`/src/adapters/IDatabaseRepository.ts`) | PostgreSQL / Relational SQL | Any standard PostgreSQL host (Supabase, Neon, AWS RDS, self-hosted VPS) or SQLite/libSQL | **$\le 12\text{ hours}$** |
| **Evidence Object Storage** | `IStorageProvider` (`/src/adapters/IStorageProvider.ts`) | S3-Compatible / Cloud Object Storage | Cloudflare R2, AWS S3, MinIO self-hosted, or Backblaze B2 (files addressed by `SHA-256` content hash) | **$\le 24\text{ hours}$** |
| **Authentication & JWT** | `IAuthProvider` | Standard OIDC / JWT + Local Password/TOTP | Portable standard bcrypt/Argon2id + RFC 6238 TOTP secrets | **$\le 8\text{ hours}$** |
| **Assistive AI Services** | `IAiAssistantProvider` (`/src/adapters/IAiAssistantProvider.ts`) | Google Gemini API (`@google/genai`) | OpenAI, Anthropic Claude, Open-Weights Llama, or `NullAiProvider` (100% manual human mode) | **$\le 1\text{ hour}$** (Zero downtime via circuit breaker) |

---

## 4. Founder Succession & Expedition Unreachability Continuity Protocol (System #14)
Because the Founder and key leaders may undertake multi-week high-altitude expeditions out of satellite/cellular contact:
1. **Routine Operations Continue Automatically:** Verification (`DEPT-03`), Appeals (`DEPT-04`), Security Containment (`DEPT-05`), and Destination Quality (`DEPT-08`) operate autonomously within constitutional bounds without requiring daily Founder intervention.
2. **Quorum Continuity Delegation:** If `founderLastHeartbeatAt` exceeds the configured threshold (e.g., 30 days during an expedition) and an urgent governance action is required, a **3-of-4 Governance Committee Supermajority** can authorize temporary operational continuity actions, subject to a **72-hour public audit time-lock** and full review upon the Founder's return.
3. **Permanent Constitutional Protection:** Even under emergency continuity, **no quorum or successor can ever enable paid achievement approvals, alter historical `credential_registry` hashes, or delete `audit_logs`**.
