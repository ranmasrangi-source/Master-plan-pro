/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 03 & Independent Audit Verification Suite (AUD-01, AUD-03, AUD-04)
 * Executed via Node 22 built-in test runner: `npm test`
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  CANONICAL_MAIN_BRANCH_PROTECTION_POLICY,
  REQUIRED_CI_CHECK_CONTEXT,
} from '../scripts/branch-protection.ts';
import {
  SECRET_PATTERNS,
  runRepositorySecurityScan,
  scanTextForSecretViolations,
} from '../scripts/security-scan.ts';
import {
  CONSTITUTIONAL_LOCKS,
  GovernanceDepartmentId,
  PlatformRole,
} from '../src/types/constitution.ts';
import { MacroDomainId } from '../src/types/taxonomy.ts';

const WORKSPACE_ROOT = process.cwd();

describe('PHASE 03 — Development Infrastructure, Security Scan, Branch Protection & 21-Phase Roadmap', () => {
  it('INFRA-TEST-01 & AUD-04: Controlled 10-rule pattern secret scanner detects synthetic tokens (SEC-SCAN-001..010) and reports zero violations across repository', () => {
    const scanResult = runRepositorySecurityScan();
    assert.ok(scanResult.scannedFilesCount >= 20, 'Expected at least 20 repository files scanned');
    assert.equal(scanResult.rulesCount, 10, 'Expected 10 controlled pattern rules (SEC-SCAN-001..010)');
    assert.equal(
      scanResult.violations.length,
      0,
      `Expected 0 security scan violations, found: ${JSON.stringify(scanResult.violations)}`
    );
    assert.equal(scanResult.constitutionalLocksIntact, true);

    // Dynamically construct synthetic test strings so no literal secret pattern appears in source
    const syntheticSamples: ReadonlyArray<{ readonly ruleId: string; readonly sample: string }> = [
      { ruleId: 'SEC-SCAN-001', sample: ['AIza', 'A'.repeat(35)].join('') },
      { ruleId: 'SEC-SCAN-002', sample: ['sk', 'live', '1'.repeat(26)].join('_') },
      { ruleId: 'SEC-SCAN-003', sample: ['-----BEGIN RSA ', 'PRIVATE KEY-----'].join('') },
      { ruleId: 'SEC-SCAN-004', sample: ['AKIA', 'B'.repeat(16)].join('') },
      { ruleId: 'SEC-SCAN-005', sample: ['ghp', 'C'.repeat(36)].join('_') },
      { ruleId: 'SEC-SCAN-006', sample: ['ghs', 'D'.repeat(36)].join('_') },
      {
        ruleId: 'SEC-SCAN-007',
        sample: ['xoxb', '12345678901', '12345678901', 'E'.repeat(24)].join('-'),
      },
      { ruleId: 'SEC-SCAN-008', sample: ['sk-proj-', 'F'.repeat(34)].join('') },
      {
        ruleId: 'SEC-SCAN-009',
        sample: ['postgresql://', 'admin', ':', 'Sup3rS3cret', '@db.internal:5432/prod'].join(''),
      },
      {
        ruleId: 'SEC-SCAN-010',
        sample: ['eyJhbGciOiJIUzI1NiJ9', 'eyJzdWIiOiIxMjM0NTY3ODkwIn0', 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'].join('.'),
      },
    ];

    assert.equal(SECRET_PATTERNS.length, 10);
    for (const item of syntheticSamples) {
      const detected = scanTextForSecretViolations(item.sample, 'synthetic-test.txt');
      assert.ok(
        detected.some((v) => v.ruleId === item.ruleId),
        `Expected rule ${item.ruleId} to detect synthetic sample`
      );
    }
  });

  it('INFRA-TEST-02: Constitutional locks enforce free standard recognition and disable payments/blockchain/AI-final-approval', () => {
    assert.equal(CONSTITUTIONAL_LOCKS.PAYMENTS_ENABLED, false);
    assert.equal(CONSTITUTIONAL_LOCKS.BLOCKCHAIN_ENABLED, false);
    assert.equal(CONSTITUTIONAL_LOCKS.AI_FINAL_DECISION_ALLOWED, false);
    assert.equal(CONSTITUTIONAL_LOCKS.STANDARD_BADGE_PRICE_USD, 0);
    assert.equal(CONSTITUTIONAL_LOCKS.STANDARD_CERTIFICATE_PRICE_USD, 0);
    assert.equal(CONSTITUTIONAL_LOCKS.PUBLIC_VERIFICATION_PRICE_USD, 0);
    assert.equal(CONSTITUTIONAL_LOCKS.SPONSOR_VERIFICATION_INFLUENCE_MULTIPLIER, 0);
  });

  it('INFRA-TEST-03: All 21 Platform Roles (including Heritage Guardian NF-01) and 11 Governance Departments are defined', () => {
    const roles = Object.values(PlatformRole);
    assert.equal(roles.length, 21, 'Expected exactly 21 Platform Roles');
    assert.ok(roles.includes(PlatformRole.HERITAGE_GUARDIAN));
    assert.ok(roles.includes(PlatformRole.FOUNDER));

    const departments = Object.values(GovernanceDepartmentId);
    assert.equal(departments.length, 11, 'Expected 11 Governance Departments');
    assert.equal(
      Object.values(MacroDomainId).length,
      6,
      'Expected exactly 6 Macro-Domains (MD-01..MD-06)'
    );
  });

  it('INFRA-TEST-04 & AUD-03: All governance & architecture documents exist and docs/22_CHANGE_CONTROL.md defines all 21 sequential phases (PHASE 01 to PHASE 21)', () => {
    const requiredDocs = [
      'docs/00_PROJECT_CONSTITUTION.md',
      'docs/01_MASTER_PLAN.md',
      'docs/02_REQUIREMENTS.md',
      'docs/03_ADVENTURE_CATEGORIES.md',
      'docs/04_ACHIEVEMENT_CATALOGUE.md',
      'docs/05_VERIFICATION_STANDARDS.md',
      'docs/06_DESTINATION_CATALOGUE.md',
      'docs/07_SYSTEM_ARCHITECTURE.md',
      'docs/08_DATABASE_SCHEMA.md',
      'docs/09_API_SPECIFICATION.md',
      'docs/16_UI_UX_GUIDELINES.md',
      'docs/17_TESTING_STRATEGY.md',
      'docs/18_DEPLOYMENT_GUIDE.md',
      'docs/19_DISASTER_RECOVERY.md',
      'docs/22_CHANGE_CONTROL.md',
      'docs/23_PHASE_ACCEPTANCE.md',
      'README.md',
      'SECURITY.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
    ];

    for (const relDoc of requiredDocs) {
      const fullPath = path.join(WORKSPACE_ROOT, relDoc);
      assert.ok(fs.existsSync(fullPath), `Missing mandatory document: ${relDoc}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 200, `Document ${relDoc} is unexpectedly small (${stat.size} bytes)`);
    }

    // AUD-03: Verify all 21 sequential phases (PHASE 01 through PHASE 21) and gates (Gate 01 through Gate 21)
    const changeControlContent = fs.readFileSync(
      path.join(WORKSPACE_ROOT, 'docs/22_CHANGE_CONTROL.md'),
      'utf-8'
    );
    for (let p = 1; p <= 21; p++) {
      const phaseNum = String(p).padStart(2, '0');
      assert.ok(
        changeControlContent.includes(`**PHASE ${phaseNum}**`),
        `docs/22_CHANGE_CONTROL.md is missing authoritative definition for PHASE ${phaseNum}`
      );
      assert.ok(
        changeControlContent.includes(`\`Gate ${phaseNum}\``),
        `docs/22_CHANGE_CONTROL.md is missing Gate ${phaseNum}`
      );
    }
  });

  it('INFRA-TEST-05 & AUD-01: Destination Catalogue contains all 100 Featured Destinations (DEST-001 to DEST-100) and Branch Protection Policy requires CI gate', () => {
    const catalogueContent = fs.readFileSync(
      path.join(WORKSPACE_ROOT, 'docs/06_DESTINATION_CATALOGUE.md'),
      'utf-8'
    );
    for (let i = 1; i <= 100; i++) {
      const id = `DEST-${String(i).padStart(3, '0')}`;
      assert.ok(
        catalogueContent.includes(`**${id}**`),
        `Destination Catalogue is missing ${id}`
      );
    }

    // AUD-01: Verify canonical main branch protection policy contract
    assert.equal(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.required_status_checks.strict, true);
    assert.ok(
      CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.required_status_checks.contexts.includes(
        REQUIRED_CI_CHECK_CONTEXT
      )
    );
    assert.equal(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.enforce_admins, true);
    assert.equal(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.allow_force_pushes, false);
    assert.equal(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.allow_deletions, false);
    assert.equal(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY.required_conversation_resolution, true);
  });
});
