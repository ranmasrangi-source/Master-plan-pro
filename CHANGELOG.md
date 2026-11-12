# Changelog (`CHANGELOG.md`)

All notable architectural, documentation, and implementation changes across the 21 Development Phases of **0 TO 8848** are recorded in this file.

## [1.1.0-phase03] — 2026-11-12
### Added (Phase 03 — Development Infrastructure & GitHub)
- Enabled TypeScript strict mode (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`) in `/tsconfig.json`.
- Added native Node 22 + `tsx` automated test runner (`npm test`) and secret/constitutional scanner (`npm run security:scan`) in `/package.json`.
- Created `/scripts/security-scan.ts` and `/tests/infrastructure-phase03.test.ts`.
- Created GitHub Actions CI & Security Gate workflow (`/.github/workflows/ci-security-gate.yml`), `CODEOWNERS`, and PR template.
- Created `/docs/17_TESTING_STRATEGY.md`, `/docs/18_DEPLOYMENT_GUIDE.md`, `/docs/22_CHANGE_CONTROL.md`, `README.md`, `SECURITY.md`, and `CONTRIBUTING.md`.

## [1.1.0-phase02] — 2026-11-12
### Added (Phase 02 — Technical Architecture & System Design)
- Created `/docs/07_SYSTEM_ARCHITECTURE.md`, `/docs/08_DATABASE_SCHEMA.md` (80 tables), `/docs/09_API_SPECIFICATION.md`, and `/docs/19_DISASTER_RECOVERY.md`.
- Created strict TypeScript domain contracts (`/src/types/constitution.ts`, `taxonomy.ts`, `verification.ts`, `credentials.ts`, `marketplace.ts`, `governance.ts`) and vendor-independent adapter interfaces (`/src/adapters/*`).

## [1.1.0-phase01] — 2026-11-12
### Added (Phase 01 — Master Requirements & Blueprint)
- Created `/docs/00_PROJECT_CONSTITUTION.md` through `/docs/06_DESTINATION_CATALOGUE.md` and `/docs/23_PHASE_ACCEPTANCE.md` incorporating Binding Amendments `A1`–`A7`, `CHK-01.14`–`01.18`, and `NF-01`–`05`.
