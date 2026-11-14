/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Phase 04 Automated Design System, Accessibility (WCAG 2.2 AA),
 * Bilingual (EN/NE) & RTL (AR) I18n, 42-Page Public Website, and AUD-03/AUD-04 UI Verification Suite
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {
  decodeQrCodeMatrixPayload,
  generateQrCodeMatrix,
  lookupCredentialVerificationPortal,
  validateCredentialIdFormat,
} from '../src/components/credentials/OfficialCertificateView.tsx';
import {
  DESTINATION_ROUTE_WAYPOINTS_BY_ID,
  EVEREST_SOUTH_COL_WAYPOINTS,
  getWaypointsForDestinationRoute,
} from '../src/components/geospatial/AccessibleRouteProfile.tsx';
import {
  INITIAL_SECURITY_AUDIT_LOGS,
  INITIAL_SECURITY_TIME_SERIES,
  IS_DEMONSTRATION_SECURITY_TELEMETRY,
  IS_LIVE_PRODUCTION_INCIDENT_FEED,
  SECURITY_AUDIT_GENESIS_HASH,
  SECURITY_TELEMETRY_DISCLOSURE_BANNER,
  appendChainedSecurityAuditEvent,
  computeSecurityAuditEventPayloadHash,
  verifyAuditChainIntegrity,
} from '../src/components/security/SecurityIncidentIntelligence.tsx';
import {
  ADVENTURE_CATEGORIES_24,
  FEATURED_DESTINATIONS_SHOWCASE,
  GENERATED_BRAND_IMAGES,
  MACRO_DOMAINS_SUMMARY,
  PUBLIC_WEBSITE_42_PAGES,
  formatGeoCoordinates,
} from '../src/data/designSystemCatalog.ts';
import {
  TRANSLATIONS,
  formatBikramSambatDate,
  getCurrentBikramSambatDate,
  getCurrentUtcIsoDateString,
  toDevanagariNumerals,
} from '../src/i18n/translations.ts';

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

    // Dynamic UTC date & Bikram Sambat conversion check
    const fixedRefDate = new Date('2026-11-13T18:30:00Z');
    assert.equal(getCurrentUtcIsoDateString(fixedRefDate), '2026-11-13');
    const dynamicBs = getCurrentBikramSambatDate(fixedRefDate);
    assert.equal(dynamicBs.isValidDate, true);
    assert.equal(dynamicBs.gregorianIso, '2026-11-13');
    assert.ok(dynamicBs.bikramSambatDevanagari.startsWith('वि.सं.'));

    const runtimeNowBs = getCurrentBikramSambatDate();
    assert.equal(runtimeNowBs.isValidDate, true);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(runtimeNowBs.gregorianIso));
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

  it('SEC-INT-TEST-01, BUG-04-01 & AUD-04: Security Incident Intelligence audit logs recompute canonical SHA-256 hashes, eliminate zero-padded fake hashes, detect tampering, and explicitly label simulated telemetry', () => {
    assert.equal(IS_DEMONSTRATION_SECURITY_TELEMETRY, true);
    assert.equal(IS_LIVE_PRODUCTION_INCIDENT_FEED, false);
    assert.ok(
      SECURITY_TELEMETRY_DISCLOSURE_BANNER.includes('SIMULATED SEED EVENTS ONLY'),
      'Security telemetry disclosure banner must explicitly state SIMULATED SEED EVENTS ONLY'
    );
    assert.ok(INITIAL_SECURITY_AUDIT_LOGS.length >= 8, 'Expected at least 8 initial security audit log records');
    assert.equal(INITIAL_SECURITY_TIME_SERIES.length, 7, 'Expected 7 24-hour time-series windows for Recharts analysis');

    // AUD-04 Check 1: Zero placeholder hashes (0000...) anywhere in INITIAL_SECURITY_AUDIT_LOGS
    for (const event of INITIAL_SECURITY_AUDIT_LOGS) {
      assert.equal(
        event.currentEventHash.startsWith('000000'),
        false,
        `Event ${event.eventId} must not use fake zero-padded currentEventHash`
      );
      assert.equal(
        event.prevAuditHash.startsWith('000000'),
        false,
        `Event ${event.eventId} must not use fake zero-padded prevAuditHash`
      );
      assert.equal(
        event.currentEventHash,
        computeSecurityAuditEventPayloadHash(event),
        `Event ${event.eventId} currentEventHash must match canonical SHA-256 payload digest`
      );
    }
    const oldestGenesisEvent =
      INITIAL_SECURITY_AUDIT_LOGS[INITIAL_SECURITY_AUDIT_LOGS.length - 1];
    assert.equal(oldestGenesisEvent.prevAuditHash, SECURITY_AUDIT_GENESIS_HASH);

    const initialVerification = verifyAuditChainIntegrity(INITIAL_SECURITY_AUDIT_LOGS);
    assert.equal(initialVerification.isIntact, true, 'Initial security audit log SHA-256 hash chain must be 100% intact');
    assert.equal(initialVerification.failureReason, null);

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

    // AUD-04 Negative Test 1: Tamper with an event summary without recomputing hash chain
    const tamperedSummaryLogs = INITIAL_SECURITY_AUDIT_LOGS.map((evt, idx) =>
      idx === 3 ? { ...evt, summary: 'FORGED SUMMARY PAYLOAD' } : evt
    );
    const tamperedSummaryResult = verifyAuditChainIntegrity(tamperedSummaryLogs);
    assert.equal(tamperedSummaryResult.isIntact, false);
    assert.equal(tamperedSummaryResult.failedEventId, INITIAL_SECURITY_AUDIT_LOGS[3].eventId);
    assert.equal(tamperedSummaryResult.failureReason, 'PAYLOAD_TAMPERED_HASH_MISMATCH');

    // AUD-04 Negative Test 2: Tamper with genesis prevAuditHash (oldest event in descending list)
    const genesisIdx = INITIAL_SECURITY_AUDIT_LOGS.length - 1;
    const tamperedGenesisLogs = INITIAL_SECURITY_AUDIT_LOGS.map((evt, idx) =>
      idx === genesisIdx
        ? {
            ...evt,
            prevAuditHash: '0000000000000000000000000000000000000000000000000000000000094100',
          }
        : evt
    );
    const tamperedGenesisResult = verifyAuditChainIntegrity(tamperedGenesisLogs);
    assert.equal(tamperedGenesisResult.isIntact, false);
    assert.equal(
      tamperedGenesisResult.failedEventId,
      INITIAL_SECURITY_AUDIT_LOGS[genesisIdx].eventId
    );
    assert.equal(tamperedGenesisResult.failureReason, 'GENESIS_HASH_MISMATCH');

    // AUD-04 Negative Test 3: Tamper with sequenceNumber continuity (changing 939 -> 9999 creates gap at 940)
    const tamperedSeqLogs = INITIAL_SECURITY_AUDIT_LOGS.map((evt, idx) =>
      idx === 2 ? { ...evt, sequenceNumber: 9999 } : evt
    );
    const tamperedSeqResult = verifyAuditChainIntegrity(tamperedSeqLogs);
    assert.equal(tamperedSeqResult.isIntact, false);
    assert.equal(tamperedSeqResult.failedEventId, 'SEC-AUD-2026-0940');
    assert.equal(tamperedSeqResult.failureReason, 'SEQUENCE_DISCONTINUITY');
  });

  it('CRED-VAL-TEST-01, BUG-04-02 & AUD-03: Official Certificate Credential ID validator and portal lookup reject unknown IDs with 404 NOT_FOUND', () => {
    const valid = validateCredentialIdFormat('0TO8848-CRED-2026-000108');
    assert.equal(valid.isValid, true);
    assert.equal(valid.normalizedId, '0TO8848-CRED-2026-000108');

    const malformed = validateCredentialIdFormat('../../admin?override=true');
    assert.equal(malformed.isValid, false);
    assert.equal(malformed.normalizedId, 'INVALID-CREDENTIAL-ID');

    const unknownPortalLookup = lookupCredentialVerificationPortal('0TO8848-CRED-2026-000999');
    assert.equal(unknownPortalLookup.status, 'NOT_FOUND');
    assert.equal(unknownPortalLookup.httpStatus, 404);
    assert.equal(unknownPortalLookup.record, null);
  });

  it('REGRESSION BUG-06, BUG-07, BUG-08, BUG-10, BUG-11 & BUG-12: BS Calendar Continuity, Scannable QR Matrix Round-Trip, Destination-Specific Route Profiles, Asset Resolution, and Doc Consistency', () => {
    // BUG-06: Verify consecutive Gregorian days across 31-day months and February leap/non-leap boundaries never produce duplicate or skipped Bikram Sambat dates
    const may31 = formatBikramSambatDate('2026-05-31');
    const jun01 = formatBikramSambatDate('2026-06-01');
    assert.notEqual(
      may31.bikramSambatEn,
      jun01.bikramSambatEn,
      'Consecutive Gregorian dates (2026-05-31 and 2026-06-01) must never map to the same Bikram Sambat date'
    );
    assert.equal(may31.bikramSambatEn, '2083-02-18 BS');
    assert.equal(jun01.bikramSambatEn, '2083-02-19 BS');

    const feb28 = formatBikramSambatDate('2026-02-28');
    const mar01 = formatBikramSambatDate('2026-03-01');
    assert.equal(feb28.bikramSambatEn, '2082-11-16 BS');
    assert.equal(mar01.bikramSambatEn, '2082-11-17 BS');

    // Leap year Feb 29 check (2024-02-29 is valid; 2026-02-29 is invalid)
    assert.equal(formatBikramSambatDate('2024-02-29').isValidDate, true);
    assert.equal(formatBikramSambatDate('2026-02-29').isValidDate, false);

    // BUG-07: Verify ISO/IEC 18004 Version 4-L (33x33) QR matrix encodes and decodes the exact verification URL
    const expectedVerifyUrl = 'https://0to8848official.com/verify/0TO8848-CRED-2026-000108';
    const qrMatrix = generateQrCodeMatrix(expectedVerifyUrl);
    assert.equal(qrMatrix.length, 33, 'Version 4 QR matrix must have 33 rows');
    assert.equal(qrMatrix[0].length, 33, 'Version 4 QR matrix must have 33 columns');
    // Top-left 7x7 finder pattern outer corners and center must be dark (true)
    assert.equal(qrMatrix[0][0], true);
    assert.equal(qrMatrix[0][6], true);
    assert.equal(qrMatrix[3][3], true);
    assert.equal(qrMatrix[1][1], false);
    const decodedUrl = decodeQrCodeMatrixPayload(qrMatrix);
    assert.equal(
      decodedUrl,
      expectedVerifyUrl,
      'Decoded QR matrix payload must match the exact public verification URL'
    );

    // BUG-08: Verify destination route profiles return distinct, accurate waypoints for Everest, Kangchenjunga, Island Peak, Matterhorn, and Fitz Roy
    const everestWpts = getWaypointsForDestinationRoute({
      destinationId: 'DEST-001',
      routeId: 'RTE-001A',
      routeNameEn: 'Everest South Col',
      summitElevationMeters: 8848.86,
    });
    const matterhornWpts = getWaypointsForDestinationRoute({
      destinationId: 'DEST-032',
      routeId: 'RTE-032A',
      routeNameEn: 'Matterhorn Hörnli Ridge',
      summitElevationMeters: 4478,
    });
    const fitzRoyWpts = getWaypointsForDestinationRoute({
      destinationId: 'DEST-081',
      routeId: 'RTE-081A',
      routeNameEn: 'Fitz Roy Franco-Argentine',
      summitElevationMeters: 3405,
    });
    assert.equal(everestWpts[everestWpts.length - 1].elevationMeters, 8848.86);
    assert.equal(matterhornWpts[matterhornWpts.length - 1].elevationMeters, 4478);
    assert.ok(matterhornWpts[0].nameEn.includes('Zermatt'));
    assert.equal(fitzRoyWpts[fitzRoyWpts.length - 1].elevationMeters, 3405);
    assert.ok(fitzRoyWpts[0].nameEn.includes('El Chaltén'));
    assert.equal(Object.keys(DESTINATION_ROUTE_WAYPOINTS_BY_ID).length, 5);

    // BUG-10: Verify low-bandwidth mode labels do not make unverified "<15 KB" claims
    assert.equal(TRANSLATIONS.en.utility.lowBandwidthActive.includes('<15 KB'), false);
    assert.equal(TRANSLATIONS.ne.utility.lowBandwidthActive.includes('<15 KB'), false);

    // BUG-11: Verify GENERATED_BRAND_IMAGES resolves via new URL(..., import.meta.url).href rather than raw "/src/assets/..." string literal
    assert.equal(GENERATED_BRAND_IMAGES.everestHero.startsWith('/src/assets/'), false);
    assert.equal(GENERATED_BRAND_IMAGES.alpineRidge.startsWith('/src/assets/'), false);
    assert.equal(GENERATED_BRAND_IMAGES.patagoniaSpires.startsWith('/src/assets/'), false);

    // BUG-12: Verify docs/00_PROJECT_CONSTITUTION.md and docs/01_MASTER_PLAN.md do not claim "AWAITING GATE 01 SIGN-OFF"
    const constitutionDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/00_PROJECT_CONSTITUTION.md'),
      'utf8'
    );
    const masterPlanDoc = fs.readFileSync(
      path.resolve(process.cwd(), 'docs/01_MASTER_PLAN.md'),
      'utf8'
    );
    assert.equal(constitutionDoc.includes('AWAITING GATE 01 SIGN-OFF'), false);
    assert.equal(masterPlanDoc.includes('AWAITING GATE 01 SIGN-OFF'), false);
    assert.ok(constitutionDoc.includes('GATE 04 AWAITING FOUNDER APPROVAL'));
    assert.ok(masterPlanDoc.includes('GATE 04 AWAITING FOUNDER APPROVAL'));
  });
});
