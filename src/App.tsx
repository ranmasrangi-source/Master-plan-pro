/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: Brand, UI/UX, WCAG 2.2 AA Design System, Bilingual (EN/NE) & RTL (AR) Interface,
 * Low-Bandwidth Expedition Mode, 3D Badges, QR Certificates & 42-Page Public Website Shell
 */

import React, { useEffect, useState } from 'react';
import { DestinationBadge3D } from './components/credentials/DestinationBadge3D.tsx';
import {
  OfficialCertificateView,
  validateCredentialIdFormat,
} from './components/credentials/OfficialCertificateView.tsx';
import { AccessibleRouteProfile } from './components/geospatial/AccessibleRouteProfile.tsx';
import { SecurityIncidentIntelligence } from './components/security/SecurityIncidentIntelligence.tsx';
import {
  ADVENTURE_CATEGORIES_24,
  ALL_100_FEATURED_DESTINATIONS,
  FEATURED_DESTINATIONS_SHOWCASE,
  GENERATED_BRAND_IMAGES,
  MACRO_DOMAINS_SUMMARY,
  PUBLIC_WEBSITE_42_PAGES,
  PublicPageSpec,
  formatGeoCoordinates,
} from './data/designSystemCatalog.ts';
import { TRANSLATIONS, formatBikramSambatDate } from './i18n/translations.ts';
import { CONSTITUTIONAL_LOCKS } from './types/constitution.ts';
import { FeaturedDestination, MacroDomainId } from './types/taxonomy.ts';

type ActiveLocale = 'en' | 'ne' | 'ar';

interface EcfPreset {
  readonly id: 'EXAMPLE_1_GPS_ONLY' | 'EXAMPLE_2_NO_GPS_ALT' | 'CUSTOM';
  readonly label: string;
  readonly pil01Visual: number;
  readonly pil02Telemetry: number;
  readonly pil03Documentary: number;
  readonly pil04Witness: number;
  readonly pil05Chronology: number;
}

const ECF_PRESETS: Record<'EXAMPLE_1_GPS_ONLY' | 'EXAMPLE_2_NO_GPS_ALT', EcfPreset> = {
  EXAMPLE_1_GPS_ONLY: {
    id: 'EXAMPLE_1_GPS_ONLY',
    label: 'Amendment A3 Worked Example 1: GPS-Only Submission (40 pts < 75 — Hold)',
    pil01Visual: 0,
    pil02Telemetry: 30,
    pil03Documentary: 0,
    pil04Witness: 0,
    pil05Chronology: 10,
  },
  EXAMPLE_2_NO_GPS_ALT: {
    id: 'EXAMPLE_2_NO_GPS_ALT',
    label: 'Amendment A3 Worked Example 2: No-GPS + Stripped EXIF + Permit + Witness (115 pts >= 75 — Pass)',
    pil01Visual: 35,
    pil02Telemetry: 0,
    pil03Documentary: 30,
    pil04Witness: 30,
    pil05Chronology: 20,
  },
};

export default function App() {
  const [locale, setLocale] = useState<ActiveLocale>('en');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<MacroDomainId | 'ALL'>('ALL');
  const [selectedDestination, setSelectedDestination] = useState<FeaturedDestination>(
    FEATURED_DESTINATIONS_SHOWCASE[0]
  );
  const [selectedPublicPage, setSelectedPublicPage] = useState<PublicPageSpec>(
    PUBLIC_WEBSITE_42_PAGES[0]
  );
  const [credentialLookupInput, setCredentialLookupInput] = useState<string>(
    '0TO8848-CRED-2026-000108'
  );

  // Interactive 5-Pillar ECF Calculator State (Amendment A3)
  const [pil01, setPil01] = useState<number>(35);
  const [pil02, setPil02] = useState<number>(0);
  const [pil03, setPil03] = useState<number>(30);
  const [pil04, setPil04] = useState<number>(30);
  const [pil05, setPil05] = useState<number>(20);

  const dict = TRANSLATIONS[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dict.direction;
  }, [locale, dict.direction]);

  const applyEcfPreset = (presetKey: 'EXAMPLE_1_GPS_ONLY' | 'EXAMPLE_2_NO_GPS_ALT') => {
    const preset = ECF_PRESETS[presetKey];
    setPil01(preset.pil01Visual);
    setPil02(preset.pil02Telemetry);
    setPil03(preset.pil03Documentary);
    setPil04(preset.pil04Witness);
    setPil05(preset.pil05Chronology);
  };

  const totalEcfScore = pil01 + pil02 + pil03 + pil04 + pil05;
  const isGpsOnlyBlocked = pil02 > 0 && pil01 === 0 && pil03 === 0 && pil04 === 0;
  const isEcfEligible = totalEcfScore >= 75 && !isGpsOnlyBlocked;

  const filteredCategories =
    selectedDomain === 'ALL'
      ? ADVENTURE_CATEGORIES_24
      : ADVENTURE_CATEGORIES_24.filter((c) => c.macroDomainId === selectedDomain);

  const todayBs = formatBikramSambatDate('2026-11-12');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* WCAG 2.2 AA Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FFD700] focus:text-[#0A0A0A] focus:font-semibold focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Strict 3-Zone Top Bar Contract (frontend-design Section 2) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-neutral-800 bg-[#0A0A0A]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-xl font-bold tracking-wider text-[#C9A86A] font-display whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFD700]"
        >
          0 TO 8848
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300"
        >
          <a
            href="#destinations-section"
            className="hover:text-[#FFD700] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {dict.nav.destinations}
          </a>
          <a
            href="#categories-section"
            className="hover:text-[#FFD700] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {dict.nav.categories}
          </a>
          <a
            href="#ecf-verification-section"
            className="hover:text-[#FFD700] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {dict.nav.verification}
          </a>
          <a
            href="#credentials-section"
            className="hover:text-[#FFD700] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {dict.nav.credentials}
          </a>
          <a
            href="#public-42-pages-section"
            className="hover:text-[#FFD700] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {dict.nav.directory42}
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <a
            href="#credentials-section"
            className="px-4 py-2 text-xs font-semibold text-[#0A0A0A] bg-[#C9A86A] hover:bg-[#FFD700] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
          >
            {dict.nav.verifyCta}
          </a>
        </div>
      </header>

      {/* Mobile Viewport Navigation Strip (< 768px) — Fixes BUG-04-08 */}
      <nav
        aria-label="Mobile Primary Navigation"
        className="flex md:hidden items-center gap-4 overflow-x-auto px-6 py-2.5 bg-[#0A0A0A] border-b border-neutral-800 text-xs font-medium text-neutral-300"
      >
        <a href="#destinations-section" className="hover:text-[#FFD700] whitespace-nowrap shrink-0">
          {dict.nav.destinations}
        </a>
        <a href="#categories-section" className="hover:text-[#FFD700] whitespace-nowrap shrink-0">
          {dict.nav.categories}
        </a>
        <a href="#ecf-verification-section" className="hover:text-[#FFD700] whitespace-nowrap shrink-0">
          {dict.nav.verification}
        </a>
        <a href="#credentials-section" className="hover:text-[#FFD700] whitespace-nowrap shrink-0">
          {dict.nav.credentials}
        </a>
        <a href="#public-42-pages-section" className="hover:text-[#FFD700] whitespace-nowrap shrink-0">
          {dict.nav.directory42}
        </a>
      </nav>

      {/* Institutional Operational Utility Ribbon (Below Header — Locale, Low-Bandwidth Mode & Constitutional Locks) */}
      <div
        role="region"
        aria-label="Operational Controls and Constitutional Guarantee Bar"
        className="px-6 lg:px-12 py-2.5 bg-[#121212] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <div className="flex flex-wrap items-center gap-2 text-neutral-300">
          <span className="text-[#C9A86A] font-medium">{dict.utility.freeGuaranteeNotice}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-neutral-400">
            {todayBs.gregorianIso} ({todayBs.bikramSambatDevanagari})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Bilingual & RTL Switcher (EN / नेपाली / العربية) */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-lg border border-neutral-800">
            {(['en', 'ne', 'ar'] as const).map((locKey) => (
              <button
                key={locKey}
                type="button"
                onClick={() => setLocale(locKey)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  locale === locKey
                    ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {TRANSLATIONS[locKey].localeLabel}
              </button>
            ))}
          </div>

          {/* System #20: Low-Bandwidth Base-Camp Mode Toggle */}
          <button
            type="button"
            onClick={() => setLowBandwidthMode((prev) => !prev)}
            aria-pressed={lowBandwidthMode}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              lowBandwidthMode
                ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700] font-semibold'
                : 'bg-[#0A0A0A] text-neutral-300 border-neutral-700 hover:border-[#C9A86A]'
            }`}
          >
            {dict.utility.lowBandwidthLabel}:{' '}
            {lowBandwidthMode ? dict.utility.lowBandwidthActive : dict.utility.standardModeActive}
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-[1360px] w-full mx-auto px-6 lg:px-12 py-10 space-y-20">
        {/* SECTION 1: INSTITUTIONAL HERO */}
        <section aria-labelledby="hero-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#121212] border border-neutral-800 rounded-xl p-8 lg:p-10">
            <div className="space-y-5">
              <p className="text-xs tracking-widest uppercase text-[#C9A86A] font-medium">
                {dict.hero.originKicker}
              </p>
              <h1
                id="hero-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display leading-tight"
              >
                {dict.hero.primaryTagline}
              </h1>
              <p className="text-sm sm:text-base font-medium text-[#FFD700] tracking-wide">
                {dict.hero.secondaryTagline}
              </p>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                {dict.hero.description}
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-800 space-y-4">
              <p className="text-xs font-semibold tracking-wider text-white">
                CONSTITUTIONAL MANDATE: <span className="text-[#FFD700]">{dict.hero.constitutionalRule}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#destinations-section"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#C9A86A] text-[#0A0A0A] hover:bg-[#FFD700] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {dict.hero.exploreDestinationsBtn}
                </a>
                <a
                  href="#ecf-verification-section"
                  className="px-5 py-2.5 text-xs font-medium bg-[#0A0A0A] text-white border border-neutral-700 hover:border-[#C9A86A] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {dict.hero.inspectVerificationBtn}
                </a>
                <a
                  href="#security-intelligence-section"
                  className="px-5 py-2.5 text-xs font-medium bg-[#0A0A0A] text-[#FFD700] border border-[#C9A86A]/60 hover:border-[#FFD700] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Security Incident Intelligence
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Documentary Photography or Low-Bandwidth Telemetry Card */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-neutral-800 bg-[#121212] min-h-[340px] flex flex-col justify-end">
            {!lowBandwidthMode ? (
              <>
                <img
                  src={GENERATED_BRAND_IMAGES.everestHero}
                  alt="Mount Everest (Sagarmatha) and Lhotse massif illuminated by golden hour alpenglow in the Khumbu Himalaya of Nepal"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-6 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
                  <p className="text-xs font-mono text-[#FFD700] tabular-nums">
                    DEST-001 · 27.9881° N, 86.9250° E · 8,848.86 m
                  </p>
                  <p className="text-lg font-display font-semibold text-white mt-1">
                    Mount Everest / Sagarmatha (सगरमाथा / चोमोलुङमा)
                  </p>
                  <p className="text-xs text-neutral-300 mt-1">
                    Mahalangur Himal · Nepal / Tibet · Status: PROPOSED (Survey of Nepal Verified)
                  </p>
                </div>
              </>
            ) : (
              <div className="p-8 space-y-4 font-mono text-xs">
                <p className="text-[#FFD700] font-semibold">
                  [LOW-BANDWIDTH BASE-CAMP MODE ACTIVE — HIGH-RES PHOTOGRAPHY SUPPRESSED]
                </p>
                <p className="text-neutral-300">
                  Featured Anchor: DEST-001 · Mount Everest / Sagarmatha (सगरमाथा)
                </p>
                <p className="text-neutral-400 tabular-nums">
                  Coordinates: 27.9881° N, 86.9250° E · Official Elevation: 8,848.86 m
                </p>
                <p className="text-neutral-400">
                  SAR Protocol: HRA Pheriche / Nepal Tourist Police (1144) · Heli Ceiling: 6,400 m
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Full-Width Institutional Architecture Metrics Bar */}
        <section
          aria-label="Constitutional Architecture Baselines"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
            <div className="text-xs text-neutral-400">FEATURED GLOBAL DESTINATIONS</div>
            <div className="text-2xl font-bold text-[#FFD700] font-mono tabular-nums mt-1">
              100 Destinations
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              All 100 initialized as PROPOSED · Separated Routes
            </div>
          </div>
          <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
            <div className="text-xs text-neutral-400">TAXONOMY PARTITION (AMENDMENT A2)</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              6 Domains · 24 Categories
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Bijective 1:N mapping · 6 Achievement Archetypes
            </div>
          </div>
          <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
            <div className="text-xs text-neutral-400">EVIDENCE CONFIDENCE (AMENDMENT A3)</div>
            <div className="text-2xl font-bold text-[#C9A86A] font-mono tabular-nums mt-1">
              ≥ 75 / 160 ECF Pts
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              GPS-only blocked (40 pts) · No-GPS pathway supported
            </div>
          </div>
          <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
            <div className="text-xs text-neutral-400">STANDARD BADGE & CERTIFICATE FEE</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
              ${CONSTITUTIONAL_LOCKS.STANDARD_BADGE_PRICE_USD}.00 USD
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Payments: Disabled · Blockchain: Disabled
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURED DESTINATIONS, DATA HYGIENE (A6), SAR (CHK-01.17) & SEASONAL RISK (CHK-01.18) */}
        <section id="destinations-section" aria-labelledby="destinations-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
                01. GLOBAL DESTINATION & ROUTE INTELLIGENCE (STATUS: PROPOSED)
              </p>
              <h2 id="destinations-heading" className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
                Featured Destinations & Data-Hygiene Inspector
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Includes Amendment A6 Hygiene Columns · CHK-01.14 Geopolitics · CHK-01.17 SAR · CHK-01.18 Risk
            </p>
          </div>

          {/* Interactive Destination Selector Tabs + Complete 100-Destination Registry Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#121212] p-3 rounded-xl border border-neutral-800">
            <div className="flex flex-wrap items-center gap-2">
              {FEATURED_DESTINATIONS_SHOWCASE.map((dest) => {
                const isSelected = selectedDestination.destinationId === dest.destinationId;
                return (
                  <button
                    key={dest.destinationId}
                    type="button"
                    onClick={() => setSelectedDestination(dest)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    {dest.destinationId} · {dest.nameEn} ({dest.elevationMeters}m)
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="all-100-destinations-select"
                className="text-xs font-mono text-[#C9A86A] whitespace-nowrap"
              >
                All {ALL_100_FEATURED_DESTINATIONS.length} Destinations:
              </label>
              <select
                id="all-100-destinations-select"
                aria-label="Inspect any of the 100 Featured Destinations (DEST-001 to DEST-100)"
                value={selectedDestination.destinationId}
                onChange={(e) => {
                  const found = ALL_100_FEATURED_DESTINATIONS.find(
                    (d) => d.destinationId === e.target.value
                  );
                  if (found) {
                    setSelectedDestination(found);
                  }
                }}
                className="bg-[#0A0A0A] border border-neutral-700 focus:border-[#FFD700] rounded-lg px-3 py-2 text-xs text-white font-mono"
              >
                {ALL_100_FEATURED_DESTINATIONS.map((dest) => (
                  <option key={dest.destinationId} value={dest.destinationId}>
                    {dest.destinationId} — {dest.nameEn} ({dest.elevationMeters}m · {dest.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Destination Comprehensive Dossier Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#121212] border border-neutral-800 rounded-xl p-6 lg:p-8">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="text-xs font-mono text-[#C9A86A] tabular-nums">
                  {selectedDestination.destinationId} · {selectedDestination.regionId} · {selectedDestination.entityType} · STATUS: {selectedDestination.status}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
                  {selectedDestination.nameEn}
                </h3>
                <p className="text-lg text-[#FFD700] mt-0.5">
                  {selectedDestination.nameNe} · {selectedDestination.elevationMeters.toLocaleString('en-US')} m
                </p>
                <p className="text-xs text-neutral-400 font-mono tabular-nums mt-2">
                  Jurisdiction: {selectedDestination.jurisdictionDisplay} · Coordinates:{' '}
                  {formatGeoCoordinates(
                    selectedDestination.coordinates.latitude,
                    selectedDestination.coordinates.longitude
                  )}{' '}
                  · Primary Category: {selectedDestination.primaryCategoryId}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs">
                <div>
                  <dt className="text-neutral-400 font-mono">PERMIT & REGULATORY REQUIREMENT</dt>
                  <dd className="text-neutral-200 mt-1 leading-relaxed">{selectedDestination.permitRequirements}</dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-mono">CULTURAL & HERITAGE GUARDIAN (NF-01)</dt>
                  <dd className="text-neutral-200 mt-1 leading-relaxed">
                    {selectedDestination.culturalConsiderations} (Heritage Guardian Check:{' '}
                    <span className="font-mono text-[#FFD700]">
                      {selectedDestination.requiresHeritageGuardianCheck ? 'REQUIRED' : 'STANDARD'}
                    </span>
                    )
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-mono">EMERGENCY SAR PROTOCOL (CHK-01.17)</dt>
                  <dd className="text-neutral-200 mt-1 leading-relaxed">
                    Agency: {selectedDestination.emergencyRescueProtocol.primarySarAgency} · Phones:{' '}
                    <span className="font-mono">{selectedDestination.emergencyRescueProtocol.emergencyPhoneNumbers.join(', ')}</span> · Heli Ceiling:{' '}
                    <span className="font-mono">
                      {selectedDestination.emergencyRescueProtocol.helicopterEvacuationCeilingMeters
                        ? `${selectedDestination.emergencyRescueProtocol.helicopterEvacuationCeilingMeters} m`
                        : 'Ground SAR Only'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-mono">AMENDMENT A6 DATA-HYGIENE AUDIT</dt>
                  <dd className="text-neutral-200 mt-1 leading-relaxed font-mono">
                    Source: {selectedDestination.source_url} ({selectedDestination.source_type}) · Verified: {selectedDestination.last_verified_date} · Confidence: {selectedDestination.confidence} · Unverified Fields: [{selectedDestination.unverified_fields.join(', ')}]
                  </dd>
                </div>
              </dl>

              {/* CHK-01.18: 12-Month Seasonal Risk Matrix */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-neutral-400">
                    CHK-01.18: 12-MONTH SEASONAL RISK MATRIX (LOW / MEDIUM / HIGH / EXTREME_CLOSURE)
                  </span>
                  <span className="font-mono text-[#C9A86A]">
                    Geopolitical Flag: {selectedDestination.geopoliticalFlag}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 text-center font-mono text-xs">
                  {(
                    [
                      ['JAN', selectedDestination.seasonalRiskMatrix.jan],
                      ['FEB', selectedDestination.seasonalRiskMatrix.feb],
                      ['MAR', selectedDestination.seasonalRiskMatrix.mar],
                      ['APR', selectedDestination.seasonalRiskMatrix.apr],
                      ['MAY', selectedDestination.seasonalRiskMatrix.may],
                      ['JUN', selectedDestination.seasonalRiskMatrix.jun],
                      ['JUL', selectedDestination.seasonalRiskMatrix.jul],
                      ['AUG', selectedDestination.seasonalRiskMatrix.aug],
                      ['SEP', selectedDestination.seasonalRiskMatrix.sep],
                      ['OCT', selectedDestination.seasonalRiskMatrix.oct],
                      ['NOV', selectedDestination.seasonalRiskMatrix.nov],
                      ['DEC', selectedDestination.seasonalRiskMatrix.dec],
                    ] as const
                  ).map(([monthLabel, rating]) => (
                    <div
                      key={monthLabel}
                      className="p-2 rounded bg-[#0A0A0A] border border-neutral-800"
                    >
                      <div className="text-neutral-400 text-[10px]">{monthLabel}</div>
                      <div
                        className={`mt-1 font-semibold text-[11px] ${
                          rating === 'LOW'
                            ? 'text-emerald-400'
                            : rating === 'MEDIUM'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {rating}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  {selectedDestination.seasonalRiskMatrix.seasonalSummaryNotes}
                </p>
              </div>
            </div>

            {/* Right Column: Live 3D Metallic Shield Badge for Selected Destination */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <DestinationBadge3D
                badgeId={selectedDestination.associatedBadgeId}
                destinationId={selectedDestination.destinationId}
                destinationNameEn={selectedDestination.nameEn}
                destinationNameNe={selectedDestination.nameNe}
                elevationMeters={selectedDestination.elevationMeters}
                categoryCode={selectedDestination.primaryCategoryId}
                credentialStatus="PROPOSED_PREVIEW"
                lowBandwidthMode={lowBandwidthMode}
              />
            </div>
          </div>

          {/* Accessible Route Profile & Tabular Alternative — Synchronized with Selected Destination (Fixes BUG-04-07) */}
          <AccessibleRouteProfile
            routeId={selectedDestination.separatedRouteIds[0]}
            routeNameEn={`${selectedDestination.nameEn} — Primary Verified Ascent Corridor (${selectedDestination.separatedRouteIds[0]})`}
            summitElevationMeters={selectedDestination.elevationMeters}
          />
        </section>

        {/* SECTION 3: 6 MACRO-DOMAINS (MD-01..06) & 24 ADVENTURE CATEGORIES (AMENDMENT A2) */}
        <section id="categories-section" aria-labelledby="categories-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
                02. GLOBAL ADVENTURE TAXONOMY (AMENDMENT A2 BIJECTIVE PARTITION)
              </p>
              <h2 id="categories-heading" className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
                6 Macro-Domains & 24 Adventure Categories
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-[#121212] p-1.5 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedDomain('ALL')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedDomain === 'ALL'
                    ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                All 24 Categories
              </button>
              {MACRO_DOMAINS_SUMMARY.map((md) => (
                <button
                  key={md.domainId}
                  type="button"
                  onClick={() => setSelectedDomain(md.domainId)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedDomain === md.domainId
                      ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {md.domainId} ({md.categoryIds.length})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-[#121212] border border-neutral-800 rounded-xl p-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                  <th scope="col" className="py-3 pr-4">CAT ID</th>
                  <th scope="col" className="py-3 px-4">MACRO-DOMAIN</th>
                  <th scope="col" className="py-3 px-4">CATEGORY NAME (EN / नेपाली)</th>
                  <th scope="col" className="py-3 px-4">DIFFICULTY SYSTEM</th>
                  <th scope="col" className="py-3 px-4">RISK LEVEL</th>
                  <th scope="col" className="py-3 px-4">MIN REVIEWER TIER</th>
                  <th scope="col" className="py-3 pl-4 text-right">MIN ECF SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredCategories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-[#FFD700] whitespace-nowrap">
                      {cat.categoryId}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#C9A86A] whitespace-nowrap">
                      {cat.macroDomainId}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-white">
                      {cat.nameEn} <span className="text-neutral-400">· {cat.nameNe}</span>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-300 font-mono">
                      {cat.difficultyScale}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-neutral-300">
                      {cat.riskLevel}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#C9A86A]">
                      {cat.minReviewerTier}
                    </td>
                    <td className="py-2.5 pl-4 text-right font-mono tabular-nums text-white">
                      ≥ {cat.minEcfScoreThreshold} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE 5-PILLAR EVIDENCE CONFIDENCE FRAMEWORK (ECF) SIMULATOR (AMENDMENT A3) */}
        <section id="ecf-verification-section" aria-labelledby="ecf-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
                03. EVIDENCE CONFIDENCE FRAMEWORK & SCIENTIFIC ANTI-FRAUD (AMENDMENTS A3 & A4)
              </p>
              <h2 id="ecf-heading" className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
                5-Pillar Evidence Confidence Calculator & Worked Examples
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyEcfPreset('EXAMPLE_1_GPS_ONLY')}
                className="px-3 py-1.5 rounded-lg bg-[#121212] border border-neutral-700 hover:border-[#FFD700] text-xs font-medium text-neutral-200 transition-colors whitespace-nowrap shrink-0"
              >
                Load A3 Example 1: GPS-Only (40 pts — Blocked)
              </button>
              <button
                type="button"
                onClick={() => applyEcfPreset('EXAMPLE_2_NO_GPS_ALT')}
                className="px-3 py-1.5 rounded-lg bg-[#C9A86A] text-[#0A0A0A] hover:bg-[#FFD700] text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Load A3 Example 2: No-GPS + Stripped EXIF (115 pts — Eligible)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#121212] border border-neutral-800 rounded-xl p-6 lg:p-8">
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  id: 'pil01',
                  label: 'PIL-01: Visual & Contextual Media (Start, Camp & Summit Photos — 0 Penalty for Stripped EXIF)',
                  value: pil01,
                  max: 40,
                  setter: setPil01,
                },
                {
                  id: 'pil02',
                  label: 'PIL-02: Geospatial & Barometric Telemetry (GPX / FIT / Satellite Tracker + Copernicus DEM Check)',
                  value: pil02,
                  max: 35,
                  setter: setPil02,
                },
                {
                  id: 'pil03',
                  label: 'PIL-03: Official Documentary & Regulatory Records (DoT/NMA Permit, Park Stamp, Hut Register)',
                  value: pil03,
                  max: 35,
                  setter: setPil03,
                },
                {
                  id: 'pil04',
                  label: 'PIL-04: Independent Human Corroboration (Token-Verified Guide, Witness, or Heritage Guardian)',
                  value: pil04,
                  max: 30,
                  setter: setPil04,
                },
                {
                  id: 'pil05',
                  label: 'PIL-05: Chronological & Meteorological Plausibility (West VO2max Ascent Rate & Solar Shadow Match)',
                  value: pil05,
                  max: 20,
                  setter: setPil05,
                },
              ].map((p) => (
                <div key={p.id} className="p-3.5 bg-[#0A0A0A] border border-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label htmlFor={p.id} className="font-medium text-neutral-200">
                      {p.label}
                    </label>
                    <span className="font-mono tabular-nums text-[#FFD700]">
                      {p.value} / {p.max} pts
                    </span>
                  </div>
                  <input
                    id={p.id}
                    type="range"
                    min={0}
                    max={p.max}
                    step={5}
                    value={p.value}
                    onChange={(e) => p.setter(Number(e.target.value))}
                    className="w-full accent-[#C9A86A] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between bg-[#0A0A0A] border border-neutral-800 rounded-xl p-6">
              <div className="space-y-4">
                <div className="text-xs font-mono text-neutral-400">
                  COMPUTED 5-PILLAR EVIDENCE CONFIDENCE SCORE
                </div>
                <div className="text-4xl font-bold font-mono tabular-nums text-[#FFD700]">
                  {totalEcfScore} <span className="text-lg text-neutral-400">/ 160 pts</span>
                </div>
                <div className="text-xs font-mono">
                  Required Eligibility Threshold: <span className="text-white">≥ 75 pts</span> · Stripped EXIF Fraud Penalty:{' '}
                  <span className="text-emerald-400">0 pts</span>
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs">
                  <div className="font-semibold text-white">
                    VERIFICATION GATE OUTCOME:{' '}
                    <span className={isEcfEligible ? 'text-emerald-400' : 'text-amber-400'}>
                      {isGpsOnlyBlocked
                        ? 'HOLD — GPS ALONE NEVER PROVES AN ACHIEVEMENT (SECTION 14)'
                        : isEcfEligible
                        ? 'ELIGIBLE FOR INDEPENDENT HUMAN REVIEWER APPROVAL'
                        : 'MORE EVIDENCE REQUIRED (< 75 THRESHOLD)'}
                    </span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    {pil02 === 0 && isEcfEligible
                      ? 'Alternative Pathway Active (ALT_NO_GPS_DOCUMENTARY_WITNESS): Validated via Official Permit + Landmark Photos + Token-Verified Witness without requiring a GPS track.'
                      : 'Evaluated under Policy Version v1.1.0. Dual Senior Reviewer Override requires 2x L3/L4 + Verification Dept Lead hash-chained audit record.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400 space-y-1">
                <div>• DEM Cross-Check: Copernicus GLO-30 (30m RMSE)</div>
                <div>• Ascent Ceiling: V_max(h, dt) = V_ref · Φ(h) · dt^(-0.07)</div>
                <div>• Image Deduplication: 64-bit DCT pHash (D_H ≤ 6 Flag)</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: OFFICIAL CERTIFICATE & PUBLIC VERIFICATION PORTAL PREVIEW */}
        <section id="credentials-section" aria-labelledby="credentials-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
                04. CREDENTIAL INTEGRITY REGISTRY & PUBLIC VERIFICATION PORTAL
              </p>
              <h2 id="credentials-heading" className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
                Verifiable Digital Certificate & Zero-PII Lookup
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="credential-lookup-input" className="sr-only">
                Credential ID Lookup
              </label>
              <input
                id="credential-lookup-input"
                type="text"
                value={credentialLookupInput}
                onChange={(e) => setCredentialLookupInput(e.target.value)}
                aria-invalid={!validateCredentialIdFormat(credentialLookupInput).isValid}
                className="px-3 py-1.5 bg-[#121212] border border-neutral-700 rounded-lg text-xs font-mono text-white w-64"
                placeholder="0TO8848-CRED-2026-000108"
              />
              <span
                className={`text-xs font-mono whitespace-nowrap ${
                  validateCredentialIdFormat(credentialLookupInput).isValid
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {validateCredentialIdFormat(credentialLookupInput).isValid
                  ? 'ZERO-PII PORTAL READY'
                  : 'INVALID ID FORMAT'}
              </span>
            </div>
          </div>

          <OfficialCertificateView
            certificateId="0TO8848-CERT-2026-000108"
            credentialId={credentialLookupInput}
            adventurerDisplayName="Pasang Dawa Sherpa (Sample Architecture Preview)"
            achievementTitleEn="Mount Everest (Sagarmatha) Summit — Southeast Ridge"
            achievementTitleNe="सगरमाथा चुचुरो आरोहण — दक्षिणपूर्वी रिज"
            destinationNameEn="Mount Everest / Sagarmatha"
            destinationNameNe="सगरमाथा / चोमोलुङमा"
            routeNameEn="RTE-001A: South Col — Southeast Ridge"
            elevationMeters={8848.86}
            completionDateIso="2026-05-19"
            approvalDateIso="2026-05-24"
            currentCredentialHash="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
            previousEventHash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            reviewerTierUsed="DUAL L4 SENIOR REVIEWERS (2x) + HERITAGE GUARDIAN"
          />
        </section>

        {/* SECTION 6: SECURITY INCIDENT INTELLIGENCE & REAL-TIME AUDIT TELEMETRY (RECHARTS) */}
        <SecurityIncidentIntelligence lowBandwidthMode={lowBandwidthMode} />

        {/* SECTION 7: ALL 42 MANDATORY PUBLIC WEBSITE PAGES DIRECTORY & INSPECTOR (SECTION 19) */}
        <section id="public-42-pages-section" aria-labelledby="pages-42-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
                06. COMPLETE PUBLIC WEBSITE ARCHITECTURE (SECTION 19.1 TO 19.42)
              </p>
              <h2 id="pages-42-heading" className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
                All 42 Required Public Website Pages Inspector
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Select any of the 42 pages below to inspect its bilingual title, constitutional rule, and module scope
            </p>
          </div>

          {/* Active Page View Panel */}
          <div className="p-6 bg-[#121212] border border-[#C9A86A]/40 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#FFD700] tabular-nums">
                PAGE {String(selectedPublicPage.pageNumber).padStart(2, '0')} OF 42 · /{selectedPublicPage.slug} · {selectedPublicPage.sectionGroup}
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                {selectedPublicPage.titleEn} <span className="text-[#C9A86A] font-normal">({selectedPublicPage.titleNe})</span>
              </h3>
              <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
                {selectedPublicPage.summaryEn}
              </p>
            </div>
            <div className="lg:text-right shrink-0">
              <div className="text-xs font-mono text-neutral-400">CONSTITUTIONAL SAFEGUARD</div>
              <div className="text-xs font-medium text-[#C9A86A] mt-1">
                {selectedPublicPage.constitutionalRuleNote}
              </div>
            </div>
          </div>

          {/* Grid of All 42 Public Website Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PUBLIC_WEBSITE_42_PAGES.map((pg) => {
              const isSelected = selectedPublicPage.pageNumber === pg.pageNumber;
              return (
                <button
                  key={pg.pageNumber}
                  type="button"
                  onClick={() => setSelectedPublicPage(pg)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'bg-[#C9A86A] text-[#0A0A0A] border-[#FFD700] font-semibold'
                      : 'bg-[#121212] text-neutral-300 border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <div className="text-[11px] font-mono tabular-nums opacity-75">
                    #{String(pg.pageNumber).padStart(2, '0')} · /{pg.slug}
                  </div>
                  <div className="text-xs font-medium mt-1 truncate">{pg.titleEn}</div>
                  <div className="text-[11px] opacity-80 truncate">{pg.titleNe}</div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Quiet Institutional Footer (Zero Ornamental Telemetry Tickers) */}
      <footer className="border-t border-neutral-800 bg-[#0A0A0A] px-6 lg:px-12 py-8 text-xs text-neutral-400">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-display font-semibold text-[#C9A86A]">0 TO 8848</span> · BUILT IN NEPAL. MADE FOR THE WORLD. · EXPLORE. ACHIEVE. PROVE.
          </div>
          <div className="font-mono">
            {dict.utility.paymentsLockedNotice}
          </div>
        </div>
      </footer>
    </div>
  );
}
