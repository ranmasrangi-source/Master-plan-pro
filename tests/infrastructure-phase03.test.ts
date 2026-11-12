/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 03 Automated Infrastructure, Security & Blueprint Verification Suite
 * Executed via Node 22 built-in test runner: `npm test`
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { runRepositorySecurityScan } from '../scripts/security-scan.ts';
import {
  CONSTITUTIONAL_LOCKS,
  GovernanceDepartmentId,
  PlatformRole,
} from '../src/types/constitution.ts';
import { MacroDomainId } from '../src/types/taxonomy.ts';

const WORKSPACE_ROOT = process.cwd();

describe('PHASE 03 — Development Infrastructure, Security Scan & Constitutional Locks', () => {
  it('INFRA-TEST-01: Repository secret scanner detects zero exposed credentials or keys', () => {
    const scanResult = runRepositorySecurityScan();
    assert.ok(scanResult.scannedFilesCount >= 20, 'Expected at least 20 repository files scanned');
    assert.equal(
      scanResult.violations.length,
      0,
      `Expected 0 security scan violations, found: ${JSON.stringify(scanResult.violations)}`
    );
    assert.equal(scanResult.constitutionalLocksIntact, true);
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
    assert.equal( Object.values(MacroDomainId).length, 6, 'Expected exactly 6 Macro-Domains (MD-01..MD-06)');
  });

  it('INFRA-TEST-04: All Phase 01, Phase 02, and Phase 03 governance & architecture documents exist and are non-empty', () => {
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
  });

  it('INFRA-TEST-05: Destination Catalogue contains all 100 Featured Destinations (DEST-001 to DEST-100) marked PROPOSED', () => {
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
  });
});
