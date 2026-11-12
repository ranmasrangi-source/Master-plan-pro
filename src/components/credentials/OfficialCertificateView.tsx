/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: Official Verifiable Achievement Certificate Component (Sections 32 & 33)
 *
 * AUD-03 REMEDIATION:
 * - Removes fake VALID responses for arbitrary regex-matching Credential IDs.
 * - Unknown Credential IDs (even when matching /^0TO8848-CRED-\d{4}-\d{6}$/) return
 *   status: 'NOT_FOUND' (HTTP 404) with record: null and render a 404 Not Found state.
 * - Sample credentials are never displayed as real achievements or marked VALID:
 *   the single Phase 04 UI layout fixture (0TO8848-CRED-2026-000108) is explicitly
 *   classified as status: 'DESIGN_PREVIEW_ONLY' (isRealAchievement: false) with
 *   canonical SHA-256 digests computed via computeSha256Hex().
 */

import React from 'react';
import { formatBikramSambatDate } from '../../i18n/translations.ts';
import { computeSha256Hex } from '../../services/securityAndVerificationCore.ts';

export interface OfficialCertificateViewProps {
  readonly certificateId?: string;
  readonly credentialId: string;
  readonly adventurerDisplayName?: string;
  readonly achievementTitleEn?: string;
  readonly achievementTitleNe?: string;
  readonly destinationNameEn?: string;
  readonly destinationNameNe?: string;
  readonly routeNameEn?: string;
  readonly elevationMeters?: number;
  readonly completionDateIso?: string;
  readonly approvalDateIso?: string;
  readonly currentCredentialHash?: string;
  readonly previousEventHash?: string;
  readonly reviewerTierUsed?: string;
}

export const OFFICIAL_CREDENTIAL_ID_REGEX = /^0TO8848-CRED-\d{4}-\d{6}$/;

export const CREDENTIAL_PREVIEW_GENESIS_HASH: string = computeSha256Hex(
  '0TO8848_CREDENTIAL_PREVIEW_GENESIS_V1_1_PHASE04'
);

export type CredentialPortalLookupStatus =
  | 'DESIGN_PREVIEW_ONLY'
  | 'NOT_FOUND'
  | 'INVALID_FORMAT';

export interface CredentialPreviewFixtureRecord {
  readonly certificateId: string;
  readonly credentialId: string;
  readonly isRealAchievement: false;
  readonly statusLabel: 'DESIGN PREVIEW ONLY · NOT AN ISSUED ACHIEVEMENT';
  readonly recipientPlaceholderLabel: string;
  readonly achievementTitleEn: string;
  readonly achievementTitleNe: string;
  readonly destinationNameEn: string;
  readonly destinationNameNe: string;
  readonly routeNameEn: string;
  readonly elevationMeters: number;
  readonly completionDateIso: string;
  readonly approvalDateIso: string;
  readonly reviewerTierUsed: string;
  readonly policyVersion: 'v1.1.0';
  readonly previousEventHash: string;
  readonly currentCredentialHash: string;
}

export interface CredentialPortalLookupResult {
  readonly queriedInput: string;
  readonly normalizedCredentialId: string;
  readonly isFormatValid: boolean;
  readonly status: CredentialPortalLookupStatus;
  readonly httpStatus: 200 | 400 | 404;
  readonly isRealAchievement: false;
  readonly statusMessage: string;
  readonly record: CredentialPreviewFixtureRecord | null;
}

export function validateCredentialIdFormat(rawCredentialId: string): {
  readonly isValid: boolean;
  readonly normalizedId: string;
} {
  const trimmed = rawCredentialId.trim().toUpperCase();
  const isValid = OFFICIAL_CREDENTIAL_ID_REGEX.test(trimmed);
  return {
    isValid,
    normalizedId: isValid ? trimmed : 'INVALID-CREDENTIAL-ID',
  };
}

export function computeCanonicalCertificatePreviewHash(input: {
  readonly certificateId: string;
  readonly credentialId: string;
  readonly recipientPlaceholderLabel: string;
  readonly destinationId: string;
  readonly routeNameEn: string;
  readonly elevationMeters: number;
  readonly completionDateIso: string;
  readonly approvalDateIso: string;
  readonly reviewerTierUsed: string;
  readonly policyVersion: string;
  readonly previousEventHash: string;
}): string {
  const canonicalPayload = [
    input.certificateId,
    input.credentialId,
    'IS_REAL_ACHIEVEMENT:false',
    input.recipientPlaceholderLabel,
    input.destinationId,
    input.routeNameEn,
    input.elevationMeters.toFixed(2),
    input.completionDateIso,
    input.approvalDateIso,
    input.reviewerTierUsed,
    input.policyVersion,
    input.previousEventHash,
  ].join('|');
  return computeSha256Hex(canonicalPayload);
}

const PHASE04_DESIGN_PREVIEW_CREDENTIAL_ID = '0TO8848-CRED-2026-000108';

const PHASE04_DESIGN_PREVIEW_FIXTURE: CredentialPreviewFixtureRecord = (() => {
  const base = {
    certificateId: '0TO8848-CERT-2026-000108-PREVIEW',
    credentialId: PHASE04_DESIGN_PREVIEW_CREDENTIAL_ID,
    recipientPlaceholderLabel: '[UNISSUED PHASE 04 TYPOGRAPHY & QR SPEC FIXTURE]',
    destinationId: 'DEST-001',
    achievementTitleEn: 'Mount Everest (Sagarmatha) Summit — Southeast Ridge (UI Spec Template)',
    achievementTitleNe: 'सगरमाथा चुचुरो आरोहण — दक्षिणपूर्वी रिज (नमुना ढाँचा मात्र)',
    destinationNameEn: 'Mount Everest / Sagarmatha',
    destinationNameNe: 'सगरमाथा / चोमोलुङमा',
    routeNameEn: 'RTE-001A: South Col — Southeast Ridge',
    elevationMeters: 8848.86,
    completionDateIso: '2026-05-19',
    approvalDateIso: '2026-05-24',
    reviewerTierUsed: 'DUAL L4 SENIOR REVIEWERS (2x) + HERITAGE GUARDIAN',
    policyVersion: 'v1.1.0' as const,
    previousEventHash: CREDENTIAL_PREVIEW_GENESIS_HASH,
  };

  const currentCredentialHash = computeCanonicalCertificatePreviewHash(base);

  return Object.freeze({
    certificateId: base.certificateId,
    credentialId: base.credentialId,
    isRealAchievement: false as const,
    statusLabel: 'DESIGN PREVIEW ONLY · NOT AN ISSUED ACHIEVEMENT' as const,
    recipientPlaceholderLabel: base.recipientPlaceholderLabel,
    achievementTitleEn: base.achievementTitleEn,
    achievementTitleNe: base.achievementTitleNe,
    destinationNameEn: base.destinationNameEn,
    destinationNameNe: base.destinationNameNe,
    routeNameEn: base.routeNameEn,
    elevationMeters: base.elevationMeters,
    completionDateIso: base.completionDateIso,
    approvalDateIso: base.approvalDateIso,
    reviewerTierUsed: base.reviewerTierUsed,
    policyVersion: base.policyVersion,
    previousEventHash: base.previousEventHash,
    currentCredentialHash,
  });
})();

/**
 * AUD-03 Remediation: Deterministic Credential Verification Portal Lookup
 * - Never returns a fake VALID status in Phase 04 (live credential issuance belongs to Phase 09+).
 * - Returns HTTP 400 INVALID_FORMAT for malformed IDs.
 * - Returns HTTP 404 NOT_FOUND for any unknown valid-format Credential ID.
 * - Returns HTTP 200 DESIGN_PREVIEW_ONLY (isRealAchievement: false) ONLY for the documented
 *   Phase 04 UI specification fixture ID (0TO8848-CRED-2026-000108).
 */
export function lookupCredentialVerificationPortal(
  rawCredentialId: string
): CredentialPortalLookupResult {
  const validation = validateCredentialIdFormat(rawCredentialId);
  if (!validation.isValid) {
    return {
      queriedInput: rawCredentialId,
      normalizedCredentialId: validation.normalizedId,
      isFormatValid: false,
      status: 'INVALID_FORMAT',
      httpStatus: 400,
      isRealAchievement: false,
      statusMessage: '400 · INVALID CREDENTIAL ID FORMAT (EXPECTED 0TO8848-CRED-YYYY-NNNNNN)',
      record: null,
    };
  }

  if (validation.normalizedId === PHASE04_DESIGN_PREVIEW_CREDENTIAL_ID) {
    return {
      queriedInput: rawCredentialId,
      normalizedCredentialId: validation.normalizedId,
      isFormatValid: true,
      status: 'DESIGN_PREVIEW_ONLY',
      httpStatus: 200,
      isRealAchievement: false,
      statusMessage: 'PHASE 04 DESIGN SPEC FIXTURE ONLY · NOT A LIVE ISSUED CREDENTIAL',
      record: PHASE04_DESIGN_PREVIEW_FIXTURE,
    };
  }

  return {
    queriedInput: rawCredentialId,
    normalizedCredentialId: validation.normalizedId,
    isFormatValid: true,
    status: 'NOT_FOUND',
    httpStatus: 404,
    isRealAchievement: false,
    statusMessage: `404 · CREDENTIAL NOT FOUND IN PHASE 04 REGISTRY (${validation.normalizedId})`,
    record: null,
  };
}

export const OfficialCertificateView: React.FC<OfficialCertificateViewProps> = ({
  credentialId,
}) => {
  const lookup = lookupCredentialVerificationPortal(credentialId);

  if (lookup.status === 'INVALID_FORMAT') {
    return (
      <article
        className="bg-[#0A0A0A] border border-rose-500/50 rounded-xl p-6 lg:p-10 text-white"
        aria-label="Invalid Credential ID Format Notice"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <p className="text-xs tracking-widest uppercase text-rose-400">
              0 TO 8848 · PUBLIC CREDENTIAL VERIFICATION PORTAL · HTTP 400
            </p>
            <h3 className="text-2xl font-semibold text-white mt-1 font-display">
              Malformed Credential Identifier Rejected
            </h3>
          </div>
          <div className="font-mono text-xs text-rose-400">
            STATUS: 400 · INVALID_FORMAT
          </div>
        </div>
        <p className="text-sm text-neutral-300 mt-6 font-mono">
          The queried string <span className="text-rose-300">{credentialId || '(empty)'}</span> does
          not match the canonical 0 TO 8848 credential pattern{' '}
          <span className="text-white">^0TO8848-CRED-\d&#123;4&#125;-\d&#123;6&#125;$</span>. No
          certificate record is rendered.
        </p>
      </article>
    );
  }

  if (lookup.status === 'NOT_FOUND' || lookup.record === null) {
    return (
      <article
        className="bg-[#0A0A0A] border border-amber-500/50 rounded-xl p-6 lg:p-10 text-white"
        aria-label={`Credential ${lookup.normalizedCredentialId} Not Found`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <p className="text-xs tracking-widest uppercase text-amber-400">
              0 TO 8848 · PUBLIC CREDENTIAL VERIFICATION PORTAL · HTTP 404
            </p>
            <h3 className="text-2xl font-semibold text-white mt-1 font-display">
              Credential Not Found (404)
            </h3>
            <p className="text-sm text-neutral-400 mt-0.5">
              प्रमाणपत्र फेला परेन · Zero Fake Validation Policy Enforced
            </p>
          </div>
          <div className="text-left sm:text-right font-mono tabular-nums text-xs">
            <div className="text-neutral-400">
              QUERIED ID: <span className="text-white">{lookup.normalizedCredentialId}</span>
            </div>
            <div className="text-amber-400 mt-1">
              STATUS: NOT_FOUND (HTTP 404)
            </div>
          </div>
        </div>
        <div className="pt-6 space-y-3 text-sm text-neutral-300">
          <p>
            No issued achievement credential exists for{' '}
            <span className="font-mono text-white">{lookup.normalizedCredentialId}</span>.
          </p>
          <p className="text-xs text-neutral-400 font-mono">
            Note: In Phase 04 (Brand &amp; UI/UX Architecture), live credential issuance and database
            persistence are not yet active (scheduled for Phase 09). Only the non-live design
            specification fixture <span className="text-[#C9A86A]">0TO8848-CRED-2026-000108</span>{' '}
            is available for layout inspection.
          </p>
        </div>
      </article>
    );
  }

  const record = lookup.record;
  const completionDates = formatBikramSambatDate(record.completionDateIso);
  const approvalDates = formatBikramSambatDate(record.approvalDateIso);
  const publicVerificationUrl = `https://0to8848official.com/verify/${encodeURIComponent(
    record.credentialId
  )}`;

  return (
    <article
      className="bg-[#0A0A0A] border border-[#C9A86A]/50 rounded-xl p-6 lg:p-10 text-white"
      aria-label={`Phase 04 Design Specification Fixture ${record.certificateId}`}
    >
      {/* AUD-03 Non-Live Design Fixture Disclosure Banner */}
      <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono">
        <span className="text-amber-300 font-semibold">
          PHASE 04 UI DESIGN SPECIFICATION FIXTURE — NOT A REAL ISSUED ACHIEVEMENT
        </span>
        <span className="text-neutral-300">
          isRealAchievement: false · Live Issuance Gate: Phase 09
        </span>
      </div>

      {/* Top Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#C9A86A]">
            0 TO 8848 · INDEPENDENT VERIFICATION DEPARTMENT · NEPAL
          </p>
          <h3 className="text-2xl lg:text-3xl font-semibold text-white mt-1 font-display">
            Certificate Layout Specification (Phase 04 Preview)
          </h3>
          <p className="text-sm text-neutral-400 mt-0.5">
            साहसिक उपलब्धिको प्रमाणपत्र ढाँचा · Earned, Never Bought
          </p>
        </div>
        <div className="text-left sm:text-right font-mono tabular-nums text-xs text-neutral-400">
          <div>
            FIXTURE ID:{' '}
            <span className="text-[#FFD700]">{record.credentialId}</span>
          </div>
          <div className="mt-1">
            SPEC TEMPLATE: <span className="text-white">{record.certificateId}</span>
          </div>
          <div className="mt-1">
            STATUS:{' '}
            <span className="text-amber-400">{record.statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Recipient & Achievement Citation */}
      <div className="py-8 border-b border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            RECIPIENT PLACEHOLDER SLOT (NO REAL PERSON DISPLAYED IN PHASE 04)
          </p>
          <div className="text-2xl lg:text-3xl font-display font-semibold text-[#FFD700]">
            {record.recipientPlaceholderLabel}
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Demonstrates dual-calendar layout, QR verification matrix, and canonical SHA-256 digest
            binding under Policy Version{' '}
            <span className="font-mono text-white">{record.policyVersion}</span> for:
          </p>
          <div className="pt-2">
            <div className="text-xl font-semibold text-white">
              {record.achievementTitleEn}
            </div>
            <div className="text-base text-[#C9A86A] mt-0.5">
              {record.achievementTitleNe}
            </div>
            <div className="text-xs text-neutral-400 mt-2 font-mono tabular-nums">
              {record.destinationNameEn} ({record.destinationNameNe}) · Route: {record.routeNameEn}{' '}
              · Elevation: {record.elevationMeters.toLocaleString('en-US')} m
            </div>
          </div>
        </div>

        {/* Deterministic SVG QR Verification Matrix */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
          <div className="p-3 bg-white rounded-lg border border-[#C9A86A]">
            <svg
              viewBox="0 0 100 100"
              className="w-28 h-28"
              role="img"
              aria-label={`QR Code linking to ${publicVerificationUrl}`}
            >
              <rect width="100" height="100" fill="#FFFFFF" />
              {/* Finder Patterns */}
              <rect x="8" y="8" width="24" height="24" fill="none" stroke="#0A0A0A" strokeWidth="4" />
              <rect x="14" y="14" width="12" height="12" fill="#0A0A0A" />
              <rect x="68" y="8" width="24" height="24" fill="none" stroke="#0A0A0A" strokeWidth="4" />
              <rect x="74" y="14" width="12" height="12" fill="#0A0A0A" />
              <rect x="8" y="68" width="24" height="24" fill="none" stroke="#0A0A0A" strokeWidth="4" />
              <rect x="14" y="74" width="12" height="12" fill="#0A0A0A" />
              {/* Deterministic Data Modules */}
              <rect x="40" y="12" width="6" height="6" fill="#0A0A0A" />
              <rect x="52" y="12" width="6" height="6" fill="#0A0A0A" />
              <rect x="46" y="24" width="6" height="6" fill="#0A0A0A" />
              <rect x="40" y="40" width="20" height="20" fill="#0A0A0A" />
              <text x="50" y="53" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="700">
                8848
              </text>
              <rect x="14" y="44" width="12" height="6" fill="#0A0A0A" />
              <rect x="70" y="44" width="18" height="6" fill="#0A0A0A" />
              <rect x="42" y="70" width="12" height="6" fill="#0A0A0A" />
              <rect x="64" y="68" width="24" height="12" fill="#0A0A0A" />
              <rect x="52" y="82" width="36" height="8" fill="#0A0A0A" />
            </svg>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-2 break-all lg:text-right">
            {publicVerificationUrl}
          </p>
        </div>
      </div>

      {/* Dual Calendar Dates (Gregorian AD + Nepali Bikram Sambat वि.सं. per FQ-07) & Hash Chain */}
      <dl className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        <div>
          <dt className="text-neutral-400">COMPLETION DATE (AD / BS)</dt>
          <dd className="font-mono tabular-nums text-white mt-1">
            {completionDates.gregorianIso} · {completionDates.bikramSambatDevanagari}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-400">APPROVAL DATE (AD / BS)</dt>
          <dd className="font-mono tabular-nums text-white mt-1">
            {approvalDates.gregorianIso} · {approvalDates.bikramSambatDevanagari}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-400">VERIFICATION AUTHORITY TIER</dt>
          <dd className="font-mono text-[#C9A86A] mt-1">{record.reviewerTierUsed}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">STANDARD RECOGNITION FEE</dt>
          <dd className="font-mono text-emerald-400 mt-1">$0.00 USD (Free Forever)</dd>
        </div>
      </dl>

      {/* Cryptographic Registry Hash Chain Proof */}
      <div className="mt-6 pt-4 border-t border-neutral-900 text-xs font-mono tabular-nums text-neutral-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="truncate">
          CANONICAL PAYLOAD SHA-256: <span className="text-neutral-200">{record.currentCredentialHash}</span>
        </div>
        <div className="truncate">
          GENESIS PREV HASH: <span className="text-neutral-400">{record.previousEventHash.slice(0, 24)}…</span>
        </div>
      </div>
    </article>
  );
};
