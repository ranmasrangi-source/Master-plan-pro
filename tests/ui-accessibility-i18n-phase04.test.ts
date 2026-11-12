/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 04 Automated Design System, Accessibility (WCAG 2.2 AA),
 * Bilingual (EN/NE) & RTL (AR) I18n, and 42-Page Public Website Verification Suite
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateCredentialIdFormat } from '../src/components/credentials/OfficialCertificateView.tsx';
import { EVEREST_SOUTH_COL_WAYPOINTS } from '../src/components/geospatial/AccessibleRouteProfile.tsx';
import {
  INITIAL_SECURITY_AUDIT_LOGS,
  INITIAL_SECURITY_TIME_SERIES,
  appendChainedSecurityAuditEvent,
  verifyAuditChainIntegrity,
} from '../src/components/security/SecurityIncidentIntelligence.tsx';
import {
  ADVENTURE_CATEGORIES_24,
  FEATURED_DESTINATIONS_SHOWCASE,
  MACRO_DOMAINS_SUMMARY,
  PUBLIC_WEBSITE_42_PAGES,
  formatGeoCoordinates,
} from '../src/data/designSystemCatalog.ts';
import { TRANSLATIONS, formatBikramSambatDate, toDevanagariNumerals } from '../src/i18n/translations.ts';

describe('PHASE 04 — Brand, UI/UX, WCAG 2.2 AA, I18n (EN/NE/AR) & 42 Public Pages', () => {
  it('UI-TEST-01 (incl. BUG-04-03): All 42 Mandatory Public Website Pages (Section 19.1 to 19.42) are strictly typed with EN and Nepali Devanagari titles', () => {
    assert.equal(
      PUBLIC_WEBSITE_42_PAGES.length,
      42,
      'Expected exactly 42 Public Website Pages per Section 19'
    );
    const numbers = PUBLIC_WEBSITE_42_PAGES.map((p) => p.pageNumber);
    for (let i = 1; i <= 42; i++) {
      assert.ok(numbers.includes(i), `Missing public page number ${i}`);
      const page = PUBLIC_WEBSITE_42_PAGES.find((p) => p.pageNumber === i)!;
      assert.ok(page.titleEn.length > 0, `Page ${i} missing English title`);
      assert.ok(page.titleNe.length > 0, `Page ${i} missing Nepali title`);
      assert.ok(page.summaryEn.length > 0, `Page ${i} missing summaryEn`);
      assert.equal(
        'summaryGroupNote' in (page as unknown as Record<string, unknown>),
        false,
        `Page ${i} must not contain extraneous untyped properties`
      );
    }
  });

  it('TAX-TEST-01 (Amendment A2): All 24 Adventure Categories map bijectively to the 6 Macro-Domains (MD-01..MD-06)', () => {
    assert.equal(MACRO_DOMAINS_SUMMARY.length, 6, 'Expected 6 Macro-Domains');
    assert.equal(ADVENTURE_CATEGORIES_24.length, 24, 'Expected 24 Adventure Categories');

    const assignedFromDomains = MACRO_DOMAINS_SUMMARY.flatMap((d) => d.categoryIds);
    assert.equal(assignedFromDomains.length, 24, 'Sum of domain category lists must equal 24');
    assert.equal(new Set(assignedFromDomains).size, 24, 'Zero duplicate category assignments allowed');

    for (const cat of ADVENTURE_CATEGORIES_24) {
      assert.ok(cat.minEcfScoreThreshold >= 75, `${cat.categoryId} ECF threshold must be >= 75`);
      assert.ok(cat.nameNe.length > 0, `${cat.categoryId} must include Nepali Devanagari name`);
    }
  });

  it('I18N-TEST-01 & BUG-04-05 (FQ-07): Human-verified translations (EN, NE Devanagari, AR RTL) and strict Bikram Sambat (वि.सं.) calendar boundary validation', () => {
    assert.equal(TRANSLATIONS.en.direction, 'ltr');
    assert.equal(TRANSLATIONS.ne.direction, 'ltr');
    assert.equal(TRANSLATIONS.ar.direction, 'rtl');
    assert.equal(TRANSLATIONS.ne.reviewStatus, 'HUMAN_VERIFIED');

    const devanagari8848 = toDevanagariNumerals(8848);
    assert.equal(devanagari8848, '८८४८');

    // Valid post-New Year date (May 19, 2026 -> 2083 BS Month 02 Jestha)
    const bsConverted = formatBikramSambatDate('2026-05-19');
    assert.equal(bsConverted.isValidDate, true);
    assert.equal(bsConverted.gregorianIso, '2026-05-19');
    assert.equal(bsConverted.bikramSambatEn, '2083-02-06 BS');
    assert.ok(bsConverted.bikramSambatDevanagari.includes('२०८३'), 'Expected Devanagari BS year २०८३');

    // Pre-New Year April date (April 10, 2026 -> 2082 BS Month 12 Chaitra)
    const bsPreNewYear = formatBikramSambatDate('2026-04-10');
    assert.equal(bsPreNewYear.isValidDate, true);
    assert.equal(bsPreNewYear.bikramSambatEn, '2082-12-27 BS');

    // Invalid calendar dates (Month 13, Feb 30) must be rejected cleanly
    const invalidMonth = formatBikramSambatDate('2026-13-10');
    assert.equal(invalidMonth.isValidDate, false);
    const invalidFebDay = formatBikramSambatDate('2026-02-30');
    assert.equal(invalidFebDay.isValidDate, false);
  });

  it('A11Y-TEST-01, DEST-TEST-04 & BUG-04-04: Featured Destinations carry A6 data-hygiene fields, accurate N/S E/W hemisphere coordinates, SAR protocols, and Accessible Waypoints', () => {
    for (const dest of FEATURED_DESTINATIONS_SHOWCASE) {
      assert.equal(dest.status, 'PROPOSED', 'All initial destinations must be marked PROPOSED');
      assert.ok(dest.source_url.startsWith('https://'), `${dest.destinationId} missing valid source_url`);
      assert.ok(dest.unverified_fields.length > 0, `${dest.destinationId} must explicitly disclose unverified_fields`);
      assert.equal(dest.emergencyRescueProtocol.nonRescuePlatformDisclaimer, true);
    }

    // Verify Southern & Western hemisphere coordinate formatting for DEST-081 (Monte Fitz Roy)
    const fitzRoy = FEATURED_DESTINATIONS_SHOWCASE.find((d) => d.destinationId === 'DEST-081')!;
    assert.equal(fitzRoy.coordinates.latitude, -49.2714);
    assert.equal(
      formatGeoCoordinates(fitzRoy.coordinates.latitude, fitzRoy.coordinates.longitude),
      '49.2714° S, 73.0433° W'
    );

    assert.equal(EVEREST_SOUTH_COL_WAYPOINTS.length, 7);
    assert.equal(EVEREST_SOUTH_COL_WAYPOINTS[6].elevationMeters, 8848.86);
  });

  it('SEC-INT-TEST-01 & BUG-04-01: Security Incident Intelligence audit logs maintain intact SHA-256 hash chain across rapid consecutive event injections', () => {
    assert.ok(INITIAL_SECURITY_AUDIT_LOGS.length >= 8, 'Expected at least 8 initial security audit log records');
    assert.equal(INITIAL_SECURITY_TIME_SERIES.length, 7, 'Expected 7 24-hour time-series windows for Recharts analysis');

    const initialVerification = verifyAuditChainIntegrity(INITIAL_SECURITY_AUDIT_LOGS);
    assert.equal(initialVerification.isIntact, true, 'Initial security audit log SHA-256 hash chain must be 100% intact');

    // Simulate 5 rapid consecutive security trigger injections and verify zero duplicate IDs and 100% hash chain continuity
    let logs = INITIAL_SECURITY_AUDIT_LOGS;
    for (let seq = 942; seq < 947; seq++) {
      const step = appendChainedSecurityAuditEvent(logs, seq);
      logs = step.nextLogs;
    }
    const postInjectionVerification = verifyAuditChainIntegrity(logs);
    assert.equal(postInjectionVerification.isIntact, true, 'Post-injection SHA-256 hash chain must remain 100% intact');
    const uniqueEventIds = new Set(logs.map((l) => l.eventId));
    assert.equal(uniqueEventIds.size, logs.length, 'Every audit event ID must be strictly unique');
  });

  it('CRED-VAL-TEST-01 & BUG-04-02: Official Certificate Credential ID validator enforces canonical format and rejects injection strings', () => {
    const valid = validateCredentialIdFormat('0TO8848-CRED-2026-000108');
    assert.equal(valid.isValid, true);
    assert.equal(valid.normalizedId, '0TO8848-CRED-2026-000108');

    const malformed = validateCredentialIdFormat('../../admin?override=true');
    assert.equal(malformed.isValid, false);
    assert.equal(malformed.normalizedId, 'INVALID-CREDENTIAL-ID');
  });
});
