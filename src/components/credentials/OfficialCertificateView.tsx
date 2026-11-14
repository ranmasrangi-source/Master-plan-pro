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
import {
  computeSha256Hex,
  encodeCanonicalHashFields,
} from '../../services/securityAndVerificationCore.ts';

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
  const canonicalPayload = encodeCanonicalHashFields([
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
  ]);
  return computeSha256Hex(canonicalPayload);
}

// ============================================================================
// BUG-07 REMEDIATION: ISO/IEC 18004 QR CODE VERSION 4-L (33x33) ENCODER & DECODER
// Encodes the public verification URL in Byte Mode with GF(256) Reed-Solomon ECC.
// ============================================================================

const QR_V4_SIZE = 33; // Version 4 = 4*4 + 17 = 33x33 modules
const QR_V4_DATA_CODEWORDS = 80;
const QR_V4_ECC_CODEWORDS = 20;
const QR_FORMAT_BITS_L_MASK0 = 0x77c4; // BCH(15,5) format bits for ECC Level L (01) + Mask 0 (000)

function createGf256Tables(): {
  readonly exp: ReadonlyArray<number>;
  readonly log: ReadonlyArray<number>;
} {
  const exp = new Array<number>(512).fill(0);
  const log = new Array<number>(256).fill(0);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d; // QR primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
    }
  }
  for (let i = 255; i < 512; i++) {
    exp[i] = exp[i - 255];
  }
  return { exp, log };
}

const GF256 = createGf256Tables();

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF256.exp[GF256.log[a] + GF256.log[b]];
}

function computeReedSolomonEcc(
  dataCodewords: ReadonlyArray<number>,
  eccCount: number
): ReadonlyArray<number> {
  // Build generator polynomial g(x) = (x - alpha^0)(x - alpha^1)...(x - alpha^(eccCount-1))
  let gen = [1];
  for (let i = 0; i < eccCount; i++) {
    const nextGen = new Array<number>(gen.length + 1).fill(0);
    const root = GF256.exp[i];
    for (let j = 0; j < gen.length; j++) {
      nextGen[j] ^= gen[j];
      nextGen[j + 1] ^= gfMultiply(gen[j], root);
    }
    gen = nextGen;
  }

  const remainder = new Array<number>(eccCount).fill(0);
  for (const byte of dataCodewords) {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    if (factor !== 0) {
      for (let j = 0; j < eccCount; j++) {
        remainder[j] ^= gfMultiply(gen[j + 1], factor);
      }
    }
  }
  return remainder;
}

function buildQrV4FunctionReservedGrid(): {
  readonly modules: boolean[][];
  readonly isFunction: boolean[][];
} {
  const modules: boolean[][] = Array.from({ length: QR_V4_SIZE }, () =>
    new Array<boolean>(QR_V4_SIZE).fill(false)
  );
  const isFunction: boolean[][] = Array.from({ length: QR_V4_SIZE }, () =>
    new Array<boolean>(QR_V4_SIZE).fill(false)
  );

  const setFunctionModule = (r: number, c: number, dark: boolean): void => {
    if (r >= 0 && r < QR_V4_SIZE && c >= 0 && c < QR_V4_SIZE) {
      modules[r][c] = dark;
      isFunction[r][c] = true;
    }
  };

  // 1. Finder patterns + 1-module white separators at (0,0), (0,26), (26,0)
  const placeFinderPattern = (topR: number, leftC: number): void => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = topR + dr;
        const c = leftC + dc;
        if (r < 0 || r >= QR_V4_SIZE || c < 0 || c >= QR_V4_SIZE) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunctionModule(r, c, inOuter && (onBorder || inCore));
      }
    }
  };
  placeFinderPattern(0, 0);
  placeFinderPattern(0, QR_V4_SIZE - 7);
  placeFinderPattern(QR_V4_SIZE - 7, 0);

  // 2. Alignment pattern for Version 4 centered at (26, 26)
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const dist = Math.max(Math.abs(dr), Math.abs(dc));
      setFunctionModule(26 + dr, 26 + dc, dist === 2 || dist === 0);
    }
  }

  // 3. Timing patterns along row 6 and col 6
  for (let i = 8; i < QR_V4_SIZE - 8; i++) {
    if (!isFunction[6][i]) setFunctionModule(6, i, i % 2 === 0);
    if (!isFunction[i][6]) setFunctionModule(i, 6, i % 2 === 0);
  }

  // 4. Dark module at (4*4 + 9, 8) = (25, 8)
  setFunctionModule(25, 8, true);

  // 5. Format information bits (ECC Level L, Mask 0 -> 0x77c4)
  for (let i = 0; i <= 5; i++) {
    setFunctionModule(8, i, ((QR_FORMAT_BITS_L_MASK0 >> i) & 1) === 1);
  }
  setFunctionModule(8, 7, ((QR_FORMAT_BITS_L_MASK0 >> 6) & 1) === 1);
  setFunctionModule(8, 8, ((QR_FORMAT_BITS_L_MASK0 >> 7) & 1) === 1);
  setFunctionModule(7, 8, ((QR_FORMAT_BITS_L_MASK0 >> 8) & 1) === 1);
  for (let i = 9; i < 15; i++) {
    setFunctionModule(14 - i, 8, ((QR_FORMAT_BITS_L_MASK0 >> i) & 1) === 1);
  }
  for (let i = 0; i < 8; i++) {
    setFunctionModule(8, QR_V4_SIZE - 1 - i, ((QR_FORMAT_BITS_L_MASK0 >> i) & 1) === 1);
  }
  for (let i = 8; i < 15; i++) {
    setFunctionModule(QR_V4_SIZE - 15 + i, 8, ((QR_FORMAT_BITS_L_MASK0 >> i) & 1) === 1);
  }

  return { modules, isFunction };
}

/**
 * Generates an ISO/IEC 18004 Version 4-L (33x33) QR Code boolean matrix for the given URL/payload.
 */
export function generateQrCodeMatrix(payload: string): ReadonlyArray<ReadonlyArray<boolean>> {
  const utf8Bytes = Array.from(new TextEncoder().encode(payload.trim()));
  if (utf8Bytes.length === 0 || utf8Bytes.length > 78) {
    throw new RangeError(
      `QR_PAYLOAD_LENGTH_OUT_OF_RANGE: Version 4-L QR supports 1..78 UTF-8 bytes (received ${utf8Bytes.length}).`
    );
  }

  // Build bit stream: Byte Mode indicator (0100) + 8-bit byte count + payload bytes + 0000 terminator
  const bits: number[] = [];
  const pushBits = (val: number, len: number): void => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4); // Byte Mode
  pushBits(utf8Bytes.length, 8);
  for (const b of utf8Bytes) {
    pushBits(b, 8);
  }
  const maxDataBits = QR_V4_DATA_CODEWORDS * 8;
  pushBits(0, Math.min(4, maxDataBits - bits.length));
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    dataCodewords.push(byte);
  }

  let padToggle = 0;
  while (dataCodewords.length < QR_V4_DATA_CODEWORDS) {
    dataCodewords.push(padToggle % 2 === 0 ? 0xec : 0x11);
    padToggle++;
  }

  const eccCodewords = computeReedSolomonEcc(dataCodewords, QR_V4_ECC_CODEWORDS);
  const allCodewords = [...dataCodewords, ...eccCodewords];
  const fullBits: number[] = [];
  for (const cw of allCodewords) {
    for (let b = 7; b >= 0; b--) {
      fullBits.push((cw >> b) & 1);
    }
  }

  const { modules, isFunction } = buildQrV4FunctionReservedGrid();

  // ISO/IEC 18004 upward/downward 2-column zig-zag module placement with Mask 0 ((r + c) % 2 === 0)
  let bitIdx = 0;
  let upward = true;
  for (let rightCol = QR_V4_SIZE - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) {
      rightCol = 5; // Skip vertical timing column 6
    }
    for (let step = 0; step < QR_V4_SIZE; step++) {
      const r = upward ? QR_V4_SIZE - 1 - step : step;
      for (let dc = 0; dc < 2; dc++) {
        const c = rightCol - dc;
        if (!isFunction[r][c]) {
          const dataBit = bitIdx < fullBits.length ? fullBits[bitIdx] === 1 : false;
          bitIdx++;
          const maskBit = (r + c) % 2 === 0;
          modules[r][c] = dataBit !== maskBit;
        }
      }
    }
    upward = !upward;
  }

  return modules.map((row) => Object.freeze([...row]));
}

/**
 * Decodes the UTF-8 Byte-Mode payload from a Version 4-L (33x33) QR Code matrix,
 * verifying structural integrity and extracting the encoded verification URL.
 */
export function decodeQrCodeMatrixPayload(
  matrix: ReadonlyArray<ReadonlyArray<boolean>>
): string {
  if (matrix.length !== QR_V4_SIZE || matrix.some((r) => r.length !== QR_V4_SIZE)) {
    throw new RangeError('INVALID_QR_MATRIX_DIMENSIONS: Expected 33x33 Version 4 QR matrix.');
  }

  const { isFunction } = buildQrV4FunctionReservedGrid();
  const extractedBits: number[] = [];
  let upward = true;

  for (let rightCol = QR_V4_SIZE - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) {
      rightCol = 5;
    }
    for (let step = 0; step < QR_V4_SIZE; step++) {
      const r = upward ? QR_V4_SIZE - 1 - step : step;
      for (let dc = 0; dc < 2; dc++) {
        const c = rightCol - dc;
        if (!isFunction[r][c]) {
          const maskBit = (r + c) % 2 === 0;
          const unmasked = matrix[r][c] !== maskBit;
          extractedBits.push(unmasked ? 1 : 0);
        }
      }
    }
    upward = !upward;
  }

  const readBits = (offset: number, length: number): number => {
    let val = 0;
    for (let i = 0; i < length; i++) {
      val = (val << 1) | (extractedBits[offset + i] ?? 0);
    }
    return val;
  };

  const modeIndicator = readBits(0, 4);
  if (modeIndicator !== 0b0100) {
    throw new Error(`UNSUPPORTED_QR_MODE: Expected Byte Mode (0b0100), got 0b${modeIndicator.toString(2)}`);
  }

  const byteCount = readBits(4, 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    bytes[i] = readBits(12 + i * 8, 8);
  }

  return new TextDecoder().decode(bytes);
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
 * - Never returns a fake VALID status in Phase 04 (live credential issuance belongs to Phase 13).
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
            persistence are not yet active (scheduled for Phase 13 per REQ-CONST-01 &amp; REQ-NF-03). Only the non-live design
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
  const qrMatrix = generateQrCodeMatrix(publicVerificationUrl);

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
          isRealAchievement: false · Live Issuance Gate: Phase 13
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

        {/* ISO/IEC 18004 Version 4-L (33x33) Scannable SVG QR Verification Matrix (BUG-07) */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
          <div className="p-3 bg-white rounded-lg border border-[#C9A86A]">
            <svg
              viewBox={`0 0 ${QR_V4_SIZE + 8} ${QR_V4_SIZE + 8}`}
              shapeRendering="crispEdges"
              className="w-28 h-28"
              role="img"
              aria-label={`QR Code linking to ${publicVerificationUrl}`}
            >
              <rect width={QR_V4_SIZE + 8} height={QR_V4_SIZE + 8} fill="#FFFFFF" />
              {qrMatrix.map((row, rIdx) =>
                row.map((isDark, cIdx) =>
                  isDark ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx + 4}
                      y={rIdx + 4}
                      width={1}
                      height={1}
                      fill="#0A0A0A"
                    />
                  ) : null
                )
              )}
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
