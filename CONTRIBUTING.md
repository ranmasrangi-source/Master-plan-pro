# Contributing & Engineering Governance (`CONTRIBUTING.md`)

## 1. Sequential 21-Phase Discipline
0 TO 8848 is engineered under a strict **21-Phase Development Roadmap**. Contributors and AI engineering teams must never skip, merge, or silently reorder phases, and must wait for explicit Founder Gate approval between phases.

## 2. Code Quality & Security Requirements (Section 69)
- **TypeScript Strict Mode:** `"strict": true` is enforced in `tsconfig.json`. Every PR must pass `npm run lint` (`tsc --noEmit`) with zero errors.
- **Zero Exposed Secrets:** Never commit API keys, private keys, or credentials. Run `npm run security:scan` before every commit.
- **Vendor Independence:** Domain services in `/src/services/*` must program against `/src/adapters/*` interfaces (`IDatabaseRepository`, `IStorageProvider`, `IAiAssistantProvider`).
- **Real Test Evidence:** Every feature and security control must include automated tests in `/tests/*.test.ts` verified via `npm test`. Never fabricate test output.
