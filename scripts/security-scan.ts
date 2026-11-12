/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Controlled Pattern Secret Scanner & Constitutional Lock Verifier (Phase 03 / AUD-04)
 *
 * SCOPE & HONEST LIMITATION DISCLOSURE (AUD-04):
 * - This tool is a deterministic, regex-based pattern scanner covering 10 high-confidence
 *   credential formats (Google/Gemini keys, Stripe live keys, PEM/OpenSSH/PGP private key headers,
 *   AWS access key IDs, GitHub PATs, GitHub OAuth/App tokens, Slack tokens, OpenAI/Anthropic keys,
 *   database connection URIs with embedded passwords, and hardcoded JWT bearer literals) plus
 *   compile-time/runtime verification of `CONSTITUTIONAL_LOCKS`.
 * - It scans tracked workspace source/documentation files in the current working tree.
 * - It does NOT claim complete secret detection: it does not perform Shannon entropy analysis,
 *   arbitrary custom password detection, binary steganography inspection, or full git commit
 *   history scanning.
 */

import fs from 'node:fs';
import path from 'node:path';
import { CONSTITUTIONAL_LOCKS } from '../src/types/constitution.ts';

const WORKSPACE_ROOT = process.cwd();
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.aistudio']);

export interface ScanViolation {
  readonly file: string;
  readonly line: number;
  readonly ruleId: string;
  readonly description: string;
}

export interface SecretPatternRule {
  readonly ruleId: string;
  readonly description: string;
  readonly regex: RegExp;
}

export const SECRET_PATTERNS: ReadonlyArray<SecretPatternRule> = Object.freeze([
  {
    ruleId: 'SEC-SCAN-001',
    description: 'Hardcoded Google Cloud / Gemini API Key (AIza...)',
    regex: /AIza[0-9A-Za-z\-_]{35}/,
  },
  {
    ruleId: 'SEC-SCAN-002',
    description: 'Hardcoded Stripe Live Secret or Restricted Key (sk_live_ / rk_live_)',
    regex: /(?:sk|rk)_live_[0-9a-zA-Z]{24,}/,
  },
  {
    ruleId: 'SEC-SCAN-003',
    description: 'Hardcoded Private Cryptographic Key Block (BEGIN ... PRIVATE KEY)',
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY(?: BLOCK)?-----/,
  },
  {
    ruleId: 'SEC-SCAN-004',
    description: 'Hardcoded AWS Access Key ID (AKIA... / ASIA...)',
    regex: /(?:AKIA|ASIA)[0-9A-Z]{16}/,
  },
  {
    ruleId: 'SEC-SCAN-005',
    description: 'Hardcoded GitHub Personal Access Token (ghp_ / github_pat_)',
    regex: /(?:ghp_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z_]{82})/,
  },
  {
    ruleId: 'SEC-SCAN-006',
    description: 'Hardcoded GitHub OAuth / App / Refresh Token (gho_ / ghu_ / ghs_ / ghr_)',
    regex: /(?:gho|ghu|ghs|ghr)_[0-9a-zA-Z]{36}/,
  },
  {
    ruleId: 'SEC-SCAN-007',
    description: 'Hardcoded Slack Bot / User / Workspace Token (xoxb- / xoxp- / xoxa- / xoxr- / xoxs-)',
    regex: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,}/,
  },
  {
    ruleId: 'SEC-SCAN-008',
    description: 'Hardcoded OpenAI / Anthropic API Secret Key (sk-proj-... / sk-ant-api03-...)',
    regex: /sk-(?:proj-|ant-api03-)[A-Za-z0-9\-_]{32,}/,
  },
  {
    ruleId: 'SEC-SCAN-009',
    description: 'Database Connection URI with Embedded Password (postgres:// / mongodb:// / redis://)',
    regex: /(?:postgres(?:ql)?|mongodb(?:\+srv)?|redis):\/\/[^:\s/"']+:[^@\s/"']{4,}@[^\s/"']+/,
  },
  {
    ruleId: 'SEC-SCAN-010',
    description: 'Hardcoded JSON Web Token (JWT) Bearer Literal (eyJ...eyJ...)',
    regex: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{16,}/,
  },
]);

export function scanTextForSecretViolations(
  content: string,
  virtualFilePath: string = 'in-memory-input.txt'
): readonly ScanViolation[] {
  const violations: ScanViolation[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((lineText, idx) => {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(lineText)) {
        violations.push({
          file: virtualFilePath,
          line: idx + 1,
          ruleId: pattern.ruleId,
          description: pattern.description,
        });
      }
    }
  });

  return violations;
}

function collectFiles(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, acc);
    } else if (entry.isFile()) {
      acc.push(fullPath);
    }
  }
  return acc;
}

export function runRepositorySecurityScan(): {
  readonly scannedFilesCount: number;
  readonly rulesCount: number;
  readonly violations: readonly ScanViolation[];
  readonly constitutionalLocksIntact: boolean;
} {
  const files = collectFiles(WORKSPACE_ROOT);
  const violations: ScanViolation[] = [];

  for (const filePath of files) {
    const relPath = path.relative(WORKSPACE_ROOT, filePath);
    // Skip binary assets if any
    if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|pdf)$/i.test(relPath)) {
      continue;
    }
    // Skip test files that intentionally construct synthetic dummy strings to test the scanner itself
    if (relPath.replace(/\\/g, '/') === 'tests/infrastructure-phase03.test.ts') {
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileViolations = scanTextForSecretViolations(content, relPath);
    violations.push(...fileViolations);
  }

  const constitutionalLocksIntact =
    CONSTITUTIONAL_LOCKS.PAYMENTS_ENABLED === false &&
    CONSTITUTIONAL_LOCKS.BLOCKCHAIN_ENABLED === false &&
    CONSTITUTIONAL_LOCKS.AI_FINAL_DECISION_ALLOWED === false &&
    CONSTITUTIONAL_LOCKS.STANDARD_BADGE_PRICE_USD === 0 &&
    CONSTITUTIONAL_LOCKS.STANDARD_CERTIFICATE_PRICE_USD === 0 &&
    CONSTITUTIONAL_LOCKS.PUBLIC_VERIFICATION_PRICE_USD === 0 &&
    CONSTITUTIONAL_LOCKS.SPONSOR_VERIFICATION_INFLUENCE_MULTIPLIER === 0;

  if (!constitutionalLocksIntact) {
    violations.push({
      file: 'src/types/constitution.ts',
      line: 1,
      ruleId: 'CONST-LOCK-001',
      description: 'Constitutional launch lock invariant violated!',
    });
  }

  return {
    scannedFilesCount: files.length,
    rulesCount: SECRET_PATTERNS.length,
    violations,
    constitutionalLocksIntact,
  };
}

// Execute CLI report when invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runRepositorySecurityScan();
  console.log(
    `[0 TO 8848 Security Scanner] Scanned ${result.scannedFilesCount} repository files against ${result.rulesCount} pattern rules (SEC-SCAN-001..010).`
  );
  console.log(
    `[0 TO 8848 Security Scanner] Scope Note: Pattern-based scanner only (not a complete or entropy-based secret detector).`
  );
  console.log(
    `[0 TO 8848 Security Scanner] Constitutional Locks Verified: ${result.constitutionalLocksIntact}`
  );
  if (result.violations.length > 0) {
    console.error('[0 TO 8848 Security Scanner] FAIL — Violations detected:', result.violations);
    process.exit(1);
  }
  console.log('[0 TO 8848 Security Scanner] PASS — 0 pattern matches, 0 constitutional violations.');
}
