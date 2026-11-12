/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Automated Secret Scanner & Constitutional Lock Verifier (Phase 03)
 * Scans source and documentation files for accidental secret leakage and verifies
 * that constitutional launch locks remain strictly enforced.
 */

import fs from 'node:fs';
import path from 'node:path';
import { CONSTITUTIONAL_LOCKS } from '../src/types/constitution.ts';

const WORKSPACE_ROOT = process.cwd();
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.aistudio']);

interface ScanViolation {
  readonly file: string;
  readonly line: number;
  readonly ruleId: string;
  readonly description: string;
}

const SECRET_PATTERNS: ReadonlyArray<{
  readonly ruleId: string;
  readonly description: string;
  readonly regex: RegExp;
}> = [
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
    description: 'Hardcoded Private Cryptographic Key Block (BEGIN PRIVATE KEY)',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    ruleId: 'SEC-SCAN-004',
    description: 'Hardcoded AWS Access Key ID (AKIA...)',
    regex: /AKIA[0-9A-Z]{16}/,
  },
  {
    ruleId: 'SEC-SCAN-005',
    description: 'Hardcoded GitHub Personal Access Token (ghp_ / github_pat_)',
    regex: /(?:ghp_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z_]{82})/,
  },
];

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
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    lines.forEach((lineText, idx) => {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(lineText)) {
          violations.push({
            file: relPath,
            line: idx + 1,
            ruleId: pattern.ruleId,
            description: pattern.description,
          });
        }
      }
    });
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
    violations,
    constitutionalLocksIntact,
  };
}

// Execute CLI report when invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runRepositorySecurityScan();
  console.log(`[0 TO 8848 Security Scanner] Scanned ${result.scannedFilesCount} repository files.`);
  console.log(
    `[0 TO 8848 Security Scanner] Constitutional Locks Verified: ${result.constitutionalLocksIntact}`
  );
  if (result.violations.length > 0) {
    console.error('[0 TO 8848 Security Scanner] FAIL — Violations detected:', result.violations);
    process.exit(1);
  }
  console.log('[0 TO 8848 Security Scanner] PASS — 0 secret leaks, 0 constitutional violations.');
}
