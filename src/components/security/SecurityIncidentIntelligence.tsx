/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Security Incident Intelligence Dashboard Component
 *
 * Visualizes real-time hash-chained audit logs, scientific anti-fraud triggers (Amendment A4),
 * Business Independence Firewall blocks (System #12), and Nepal Data Residency (CHK-01.16)
 * telemetry using Recharts graphical analysis.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { computeSha256Hex } from '../../services/securityAndVerificationCore.ts';
import { GovernanceDepartmentId } from '../../types/constitution.ts';
import { ForensicAnomalyFlag } from '../../types/verification.ts';

export type SecurityEventSeverity = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'INFO';

export type SecurityTriggerCode =
  | ForensicAnomalyFlag
  | 'COMMERCIAL_FIREWALL_BLOCK'
  | 'GPS_ONLY_SUBMISSION_HOLD'
  | 'DUAL_SENIOR_ECF_OVERRIDE'
  | 'RBAC_SELF_APPROVAL_BLOCKED'
  | 'NEPAL_ENCLAVE_SYNC_VERIFIED';

export interface SecurityAuditLogEntry {
  readonly eventId: string;
  readonly timestampIso: string;
  readonly timeBucketLabel: string;
  readonly triggerCode: SecurityTriggerCode;
  readonly severity: SecurityEventSeverity;
  readonly departmentId: GovernanceDepartmentId;
  readonly targetResourceId: string;
  readonly summary: string;
  readonly forensicMetricLabel: string;
  readonly prevAuditHash: string;
  readonly currentEventHash: string;
  readonly status: 'CONTAINED' | 'QUEUED_FOR_HUMAN_AUDIT' | 'VERIFIED_IMMUTABLE';
}

export interface SecurityTimeSeriesPoint {
  readonly timeWindow: string;
  readonly auditEventsIngested: number;
  readonly forensicAnomalyTriggers: number;
  readonly firewallBlocks: number;
  readonly threatIndexScore: number;
}

export interface TriggerDistributionPoint {
  readonly triggerShortName: string;
  readonly triggerCode: SecurityTriggerCode;
  readonly count: number;
  readonly severity: SecurityEventSeverity;
}

export const INITIAL_SECURITY_TIME_SERIES: ReadonlyArray<SecurityTimeSeriesPoint> = [
  {
    timeWindow: '00:00 UTC',
    auditEventsIngested: 42,
    forensicAnomalyTriggers: 3,
    firewallBlocks: 1,
    threatIndexScore: 18,
  },
  {
    timeWindow: '04:00 UTC',
    auditEventsIngested: 58,
    forensicAnomalyTriggers: 5,
    firewallBlocks: 2,
    threatIndexScore: 24,
  },
  {
    timeWindow: '08:00 UTC',
    auditEventsIngested: 94,
    forensicAnomalyTriggers: 9,
    firewallBlocks: 4,
    threatIndexScore: 39,
  },
  {
    timeWindow: '12:00 UTC',
    auditEventsIngested: 128,
    forensicAnomalyTriggers: 14,
    firewallBlocks: 5,
    threatIndexScore: 52,
  },
  {
    timeWindow: '16:00 UTC',
    auditEventsIngested: 112,
    forensicAnomalyTriggers: 8,
    firewallBlocks: 3,
    threatIndexScore: 34,
  },
  {
    timeWindow: '20:00 UTC',
    auditEventsIngested: 86,
    forensicAnomalyTriggers: 6,
    firewallBlocks: 2,
    threatIndexScore: 27,
  },
  {
    timeWindow: '24:00 UTC',
    auditEventsIngested: 104,
    forensicAnomalyTriggers: 11,
    firewallBlocks: 4,
    threatIndexScore: 43,
  },
];

export const INITIAL_SECURITY_AUDIT_LOGS: ReadonlyArray<SecurityAuditLogEntry> = [
  {
    eventId: 'SEC-AUD-2026-0941',
    timestampIso: '2026-11-12T10:42:18Z',
    timeBucketLabel: '24:00 UTC',
    triggerCode: ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG,
    severity: 'CRITICAL',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'APP-2026-8841 (DEST-001)',
    summary:
      'Synthetic GPX elevation track detected: Copernicus GLO-30 DEM RMSE = 0.14m (< 0.30m artificial clamp threshold over 820 trackpoints). Routed to Human Anti-Fraud Investigator.',
    forensicMetricLabel: 'E_RMSE = 0.14m (< 0.3m threshold)',
    prevAuditHash: '4a7d1ed414474e4033ac29ccb8653d9b00000000000000000000000000000940',
    currentEventHash: '8f3e2a19c7b6d54e3210fedcba9876543210abcdef1234567890abcdef000941',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
  {
    eventId: 'SEC-AUD-2026-0940',
    timestampIso: '2026-11-12T10:38:04Z',
    timeBucketLabel: '24:00 UTC',
    triggerCode: 'COMMERCIAL_FIREWALL_BLOCK',
    severity: 'HIGH',
    departmentId: GovernanceDepartmentId.DEPT_11_INTERNAL_AUDIT,
    targetResourceId: 'CASE-2026-4410 (Reviewer DTO)',
    summary:
      'System #12 Business Independence Firewall stripped commercial sponsor metadata before rendering ReviewerCaseViewDTO. Zero commercial fields exposed to verification reviewer.',
    forensicMetricLabel: 'ForbiddenCommercialFields = 0 leaked',
    prevAuditHash: '2c9b8a77f6e5d4c3b2a1908f7e6d5c4b3a29182736455463728190abcdef0939',
    currentEventHash: '4a7d1ed414474e4033ac29ccb8653d9b00000000000000000000000000000940',
    status: 'CONTAINED',
  },
  {
    eventId: 'SEC-AUD-2026-0939',
    timestampIso: '2026-11-12T10:31:52Z',
    timeBucketLabel: '20:00 UTC',
    triggerCode: ForensicAnomalyFlag.HIGH_VISUAL_DUPLICATE_FLAG,
    severity: 'HIGH',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'EVID-2026-7719 (DEST-003 Kangchenjunga)',
    summary:
      '64-bit DCT perceptual hash (pHash) matched historical summit photograph EVID-2025-1102 with Hamming distance D_H = 4 bits (<= 6 bit duplicate threshold). Flagged for Senior Reviewer comparison.',
    forensicMetricLabel: '64-bit DCT pHash D_H = 4 bits',
    prevAuditHash: '9b1d4c3e2f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a0938',
    currentEventHash: '2c9b8a77f6e5d4c3b2a1908f7e6d5c4b3a29182736455463728190abcdef0939',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
  {
    eventId: 'SEC-AUD-2026-0938',
    timestampIso: '2026-11-12T10:25:10Z',
    timeBucketLabel: '20:00 UTC',
    triggerCode: ForensicAnomalyFlag.KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE,
    severity: 'ELEVATED',
    departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
    targetResourceId: 'APP-2026-8819 (DEST-004 Lhotse)',
    summary:
      'Observed vertical ascent rate (690 m/hr at 7,900m) exceeded West VO2max High-Altitude physiological ceiling (345 m/hr). Mechanical assist / helicopter segment check triggered.',
    forensicMetricLabel: 'V_obs = 690 m/hr > V_max = 345 m/hr',
    prevAuditHash: '1f2e3d4c5b6a798897a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c60937',
    currentEventHash: '9b1d4c3e2f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a0938',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
  {
    eventId: 'SEC-AUD-2026-0937',
    timestampIso: '2026-11-12T10:19:45Z',
    timeBucketLabel: '16:00 UTC',
    triggerCode: 'GPS_ONLY_SUBMISSION_HOLD',
    severity: 'ELEVATED',
    departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
    targetResourceId: 'APP-2026-8795 (DEST-041 Mont Blanc)',
    summary:
      'Amendment A3 Constitutional Rule enforced: Submission contained GPX telemetry only (PIL-02 = 30 pts, PIL-05 = 10 pts -> Total 40/160 < 75). Automatically held for corroborating evidence.',
    forensicMetricLabel: 'ECF Score = 40 / 160 pts (Blocked)',
    prevAuditHash: '7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b0936',
    currentEventHash: '1f2e3d4c5b6a798897a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c60937',
    status: 'CONTAINED',
  },
  {
    eventId: 'SEC-AUD-2026-0936',
    timestampIso: '2026-11-12T10:12:00Z',
    timeBucketLabel: '16:00 UTC',
    triggerCode: 'DUAL_SENIOR_ECF_OVERRIDE',
    severity: 'INFO',
    departmentId: GovernanceDepartmentId.DEPT_03_VERIFICATION,
    targetResourceId: 'OVR-2026-0041 (DEST-009 Nanga Parbat)',
    summary:
      'Dual Senior Reviewer Override (2x L4 + Verification Dept Lead) cryptographically co-signed for sub-threshold legacy expedition with official alpine club dossier.',
    forensicMetricLabel: '2x L4 + Dept-03 Lead Co-Signed',
    prevAuditHash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f0935',
    currentEventHash: '7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b0936',
    status: 'VERIFIED_IMMUTABLE',
  },
  {
    eventId: 'SEC-AUD-2026-0935',
    timestampIso: '2026-11-12T10:04:33Z',
    timeBucketLabel: '12:00 UTC',
    triggerCode: 'RBAC_SELF_APPROVAL_BLOCKED',
    severity: 'CRITICAL',
    departmentId: GovernanceDepartmentId.DEPT_04_APPEAL_REVIEW,
    targetResourceId: 'USR-REV-0082 -> APP-2026-8750',
    summary:
      'Separation-of-Duties guard blocked reviewer USR-REV-0082 from accessing verification queue for an expedition where they were listed as a rope-team member.',
    forensicMetricLabel: 'COI Recusal Rule Enforced',
    prevAuditHash: '0000000000000000000000000000000000000000000000000000000000000934',
    currentEventHash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f0935',
    status: 'CONTAINED',
  },
  {
    eventId: 'SEC-AUD-2026-0934',
    timestampIso: '2026-11-12T09:55:19Z',
    timeBucketLabel: '12:00 UTC',
    triggerCode: 'NEPAL_ENCLAVE_SYNC_VERIFIED',
    severity: 'INFO',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'NP-KTM-VAULT-01 (CHK-01.16)',
    summary:
      'Nepal Data Protection Act (Individual Privacy Act 2075 BS) citizen PII field-level AES-256-GCM cipher envelope verified prior to global edge replication.',
    forensicMetricLabel: 'AES-256-GCM Envelope Verified',
    prevAuditHash: 'GENESIS_HASH_0TO8848_AUDIT_CHAIN_V1_1_00000000000000000000000000',
    currentEventHash: '0000000000000000000000000000000000000000000000000000000000000934',
    status: 'VERIFIED_IMMUTABLE',
  },
];

const SIMULATED_TRIGGER_TEMPLATES: ReadonlyArray<{
  readonly triggerCode: SecurityTriggerCode;
  readonly severity: SecurityEventSeverity;
  readonly departmentId: GovernanceDepartmentId;
  readonly targetResourceId: string;
  readonly summary: string;
  readonly forensicMetricLabel: string;
  readonly status: 'CONTAINED' | 'QUEUED_FOR_HUMAN_AUDIT' | 'VERIFIED_IMMUTABLE';
}> = [
  {
    triggerCode: ForensicAnomalyFlag.RECIPROCAL_WITNESS_RING_FLAG,
    severity: 'HIGH',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'GRAPH-CLUSTER-19 (3 Circular Accounts)',
    summary:
      'Closed-loop reciprocal witness graph (A -> B -> C -> A) detected within 14-day window. Independent corroboration weight capped pending Senior Reviewer audit.',
    forensicMetricLabel: 'Cycle Length = 3 (Reciprocal Ring)',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
  {
    triggerCode: ForensicAnomalyFlag.ELEVATION_MISMATCH_FLAG,
    severity: 'HIGH',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'APP-2026-8904 (DEST-012 Ama Dablam)',
    summary:
      'GPX barometric altitude diverged from Copernicus GLO-30 DEM by E_RMSE = 164.5m (> 120.0m threshold). Flagged for uncalibrated altimeter vs wrong-ridge inspection.',
    forensicMetricLabel: 'E_RMSE = 164.5m (> 120m limit)',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
  {
    triggerCode: 'COMMERCIAL_FIREWALL_BLOCK',
    severity: 'HIGH',
    departmentId: GovernanceDepartmentId.DEPT_11_INTERNAL_AUDIT,
    targetResourceId: 'API-GATEWAY-REV-DTO',
    summary:
      'Blocked attempt to join sponsor_campaign_id onto verification queue payload. Constitutional Section 30 Business Independence Firewall intact.',
    forensicMetricLabel: 'Sponsor Join Blocked (0 leakage)',
    status: 'CONTAINED',
  },
  {
    triggerCode: ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG,
    severity: 'CRITICAL',
    departmentId: GovernanceDepartmentId.DEPT_05_SECURITY,
    targetResourceId: 'APP-2026-8911 (DEST-002 K2)',
    summary:
      'Zero-noise synthetic DEM interpolation detected on Abruzzi Spur track (E_RMSE = 0.08m over 1,140 points). Escalated to Anti-Fraud & Investigation Department.',
    forensicMetricLabel: 'E_RMSE = 0.08m (Synthetic Clamp)',
    status: 'QUEUED_FOR_HUMAN_AUDIT',
  },
];

function computeDeterministicHexHash(seedInput: string, seqNumber: number): string {
  return computeSha256Hex(`${seedInput}:SEQ:${seqNumber}`);
}

/**
 * Verifies that every audit log entry's `prevAuditHash` matches the chronological predecessor's `currentEventHash`.
 */
export function verifyAuditChainIntegrity(logs: ReadonlyArray<SecurityAuditLogEntry>): {
  readonly isIntact: boolean;
  readonly verifiedLinksCount: number;
} {
  if (logs.length <= 1) {
    return { isIntact: true, verifiedLinksCount: logs.length };
  }
  for (let i = 0; i < logs.length - 1; i++) {
    const newerEntry = logs[i];
    const olderEntry = logs[i + 1];
    if (newerEntry.prevAuditHash !== olderEntry.currentEventHash) {
      return { isIntact: false, verifiedLinksCount: i };
    }
  }
  return { isIntact: true, verifiedLinksCount: logs.length };
}

/**
 * Pure, deterministic state transition that appends a new SHA-256 hash-chained audit event
 * to the head of the audit log list without side effects.
 */
export function appendChainedSecurityAuditEvent(
  currentLogs: ReadonlyArray<SecurityAuditLogEntry>,
  seqNumber: number,
  templateIndex?: number,
  timestampIso: string = new Date().toISOString()
): {
  readonly nextLogs: ReadonlyArray<SecurityAuditLogEntry>;
  readonly createdEntry: SecurityAuditLogEntry;
} {
  const latestEntry = currentLogs[0];
  const idx =
    templateIndex !== undefined
      ? Math.abs(templateIndex) % SIMULATED_TRIGGER_TEMPLATES.length
      : Math.abs(seqNumber) % SIMULATED_TRIGGER_TEMPLATES.length;
  const tpl = SIMULATED_TRIGGER_TEMPLATES[idx];
  const newEventId = `SEC-AUD-2026-0${seqNumber}`;
  const newHash = computeDeterministicHexHash(
    `${latestEntry.currentEventHash}:${newEventId}:${tpl.triggerCode}`,
    seqNumber
  );
  const createdEntry: SecurityAuditLogEntry = {
    eventId: newEventId,
    timestampIso,
    timeBucketLabel: 'LIVE STREAM',
    triggerCode: tpl.triggerCode,
    severity: tpl.severity,
    departmentId: tpl.departmentId,
    targetResourceId: tpl.targetResourceId,
    summary: tpl.summary,
    forensicMetricLabel: tpl.forensicMetricLabel,
    prevAuditHash: latestEntry.currentEventHash,
    currentEventHash: newHash,
    status: tpl.status,
  };
  return {
    nextLogs: [createdEntry, ...currentLogs.slice(0, 19)],
    createdEntry,
  };
}

export interface SecurityIncidentIntelligenceProps {
  readonly lowBandwidthMode?: boolean;
}

export const SecurityIncidentIntelligence: React.FC<SecurityIncidentIntelligenceProps> = ({
  lowBandwidthMode = false,
}) => {
  const [auditLogs, setAuditLogs] = useState<ReadonlyArray<SecurityAuditLogEntry>>(
    INITIAL_SECURITY_AUDIT_LOGS
  );
  const [timeSeries, setTimeSeries] = useState<ReadonlyArray<SecurityTimeSeriesPoint>>(
    INITIAL_SECURITY_TIME_SERIES
  );
  const [severityFilter, setSeverityFilter] = useState<SecurityEventSeverity | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<GovernanceDepartmentId | 'ALL'>('ALL');
  const [liveStreamEnabled, setLiveStreamEnabled] = useState<boolean>(false);
  const sequenceRef = useRef<number>(942);
  const [selectedLogEntry, setSelectedLogEntry] = useState<SecurityAuditLogEntry>(
    INITIAL_SECURITY_AUDIT_LOGS[0]
  );

  const injectSimulatedSecurityEvent = useCallback((templateIndex?: number) => {
    const nextSeq = sequenceRef.current;
    sequenceRef.current += 1;

    setAuditLogs((prevLogs) => {
      const { nextLogs, createdEntry } = appendChainedSecurityAuditEvent(
        prevLogs,
        nextSeq,
        templateIndex
      );
      queueMicrotask(() => setSelectedLogEntry(createdEntry));
      return nextLogs;
    });

    setTimeSeries((prevSeries) => {
      const lastPoint = prevSeries[prevSeries.length - 1];
      const updatedLast: SecurityTimeSeriesPoint = {
        ...lastPoint,
        auditEventsIngested: lastPoint.auditEventsIngested + 4,
        forensicAnomalyTriggers: lastPoint.forensicAnomalyTriggers + 1,
        firewallBlocks:
          lastPoint.firewallBlocks + (nextSeq % 2 === 0 ? 1 : 0),
        threatIndexScore: Math.min(95, lastPoint.threatIndexScore + 3),
      };
      return [...prevSeries.slice(0, -1), updatedLast];
    });
  }, []);

  useEffect(() => {
    if (!liveStreamEnabled) return;
    const timer = window.setInterval(() => {
      injectSimulatedSecurityEvent();
    }, 4500);
    return () => window.clearInterval(timer);
  }, [liveStreamEnabled, injectSimulatedSecurityEvent]);

  const chainIntegrity = useMemo(() => verifyAuditChainIntegrity(auditLogs), [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((entry) => {
      const matchesSeverity = severityFilter === 'ALL' || entry.severity === severityFilter;
      const matchesDept = departmentFilter === 'ALL' || entry.departmentId === departmentFilter;
      return matchesSeverity && matchesDept;
    });
  }, [auditLogs, severityFilter, departmentFilter]);

  const triggerDistributionData: ReadonlyArray<TriggerDistributionPoint> = useMemo(() => {
    const counts = new Map<
      SecurityTriggerCode,
      { shortName: string; count: number; severity: SecurityEventSeverity }
    >([
      [
        ForensicAnomalyFlag.SYNTHETIC_DEM_CLAMP_FLAG,
        { shortName: 'DEM Clamp (<0.3m)', count: 0, severity: 'CRITICAL' },
      ],
      [
        ForensicAnomalyFlag.HIGH_VISUAL_DUPLICATE_FLAG,
        { shortName: 'pHash Dup (≤6b)', count: 0, severity: 'HIGH' },
      ],
      [
        ForensicAnomalyFlag.KINEMATIC_PHYSIOLOGICAL_EXCEEDANCE,
        { shortName: 'VO2max Exceeded', count: 0, severity: 'ELEVATED' },
      ],
      [
        ForensicAnomalyFlag.ELEVATION_MISMATCH_FLAG,
        { shortName: 'DEM RMSE (>120m)', count: 0, severity: 'HIGH' },
      ],
      [
        ForensicAnomalyFlag.RECIPROCAL_WITNESS_RING_FLAG,
        { shortName: 'Witness Ring', count: 0, severity: 'HIGH' },
      ],
      [
        'COMMERCIAL_FIREWALL_BLOCK',
        { shortName: 'Firewall Block', count: 0, severity: 'HIGH' },
      ],
      [
        'GPS_ONLY_SUBMISSION_HOLD',
        { shortName: 'GPS-Only Hold', count: 0, severity: 'ELEVATED' },
      ],
      [
        'RBAC_SELF_APPROVAL_BLOCKED',
        { shortName: 'COI Self-Review', count: 0, severity: 'CRITICAL' },
      ],
    ]);

    for (const entry of auditLogs) {
      const existing = counts.get(entry.triggerCode);
      if (existing) {
        counts.set(entry.triggerCode, {
          ...existing,
          count: existing.count + 1,
        });
      }
    }

    return Array.from(counts.entries()).map(([triggerCode, meta]) => ({
      triggerCode,
      triggerShortName: meta.shortName,
      count: meta.count,
      severity: meta.severity,
    }));
  }, [auditLogs]);

  const criticalCount = useMemo(
    () => auditLogs.filter((l) => l.severity === 'CRITICAL').length,
    [auditLogs]
  );
  const highCount = useMemo(
    () => auditLogs.filter((l) => l.severity === 'HIGH').length,
    [auditLogs]
  );
  const firewallBlockCount = useMemo(
    () => auditLogs.filter((l) => l.triggerCode === 'COMMERCIAL_FIREWALL_BLOCK').length,
    [auditLogs]
  );

  const getSeverityColorHex = (severity: SecurityEventSeverity): string => {
    switch (severity) {
      case 'CRITICAL':
        return '#FB7185'; // Rose-400
      case 'HIGH':
        return '#FFD700'; // Highlight Gold
      case 'ELEVATED':
        return '#C9A86A'; // Metallic Gold
      case 'INFO':
        return '#34D399'; // Emerald-400
    }
  };

  return (
    <section
      id="security-intelligence-section"
      aria-labelledby="security-intelligence-heading"
      className="space-y-6"
    >
      {/* Section Header & Operational Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#C9A86A]">
            05. CYBERSECURITY, FORENSIC ANTI-FRAUD & IMMUTABLE AUDIT LEDGER (DEPT-03 / DEPT-08 / DEPT-11)
          </p>
          <h2
            id="security-intelligence-heading"
            className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1"
          >
            Security Incident Intelligence & Real-Time Audit Telemetry
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setLiveStreamEnabled((prev) => !prev)}
            aria-pressed={liveStreamEnabled}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              liveStreamEnabled
                ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700] font-semibold'
                : 'bg-[#121212] text-neutral-200 border-neutral-700 hover:border-[#C9A86A]'
            }`}
          >
            {liveStreamEnabled ? 'Pause Live Audit Stream' : 'Start Live Audit Stream'}
          </button>

          <button
            type="button"
            onClick={() => injectSimulatedSecurityEvent()}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#C9A86A] text-[#0A0A0A] hover:bg-[#FFD700] transition-colors whitespace-nowrap shrink-0"
          >
            Simulate Forensic Trigger Event
          </button>
        </div>
      </div>

      {/* Top Security & Hash-Chain KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
          <div className="text-xs text-neutral-400 font-mono">SHA-256 AUDIT HASH CHAIN</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {chainIntegrity.isIntact ? '100% INTACT' : 'CHAIN BROKEN'}
          </div>
          <div className="text-xs text-neutral-400 mt-1 font-mono tabular-nums">
            {chainIntegrity.verifiedLinksCount} chained events verified · Append-Only
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
          <div className="text-xs text-neutral-400 font-mono">CRITICAL & HIGH TRIGGERS</div>
          <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums mt-1">
            {criticalCount} Critical · {highCount} High
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Signal-only flags routed to Human Investigators
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
          <div className="text-xs text-neutral-400 font-mono">COMMERCIAL FIREWALL (SYS #12)</div>
          <div className="text-2xl font-bold text-[#FFD700] font-mono tabular-nums mt-1">
            {firewallBlockCount} Blocked · 0 Leaked
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Sponsor & paid fields stripped from Reviewer DTO
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-neutral-800 rounded-xl">
          <div className="text-xs text-neutral-400 font-mono">AI AUTO-REJECT / AUTO-APPROVE</div>
          <div className="text-2xl font-bold text-[#C9A86A] font-mono tabular-nums mt-1">
            0 PERMITTED
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Constitutional Lock: AI_FINAL_DECISION = false
          </div>
        </div>
      </div>

      {/* Graphical Analysis Section (Recharts Dual Chart Grid or Low-Bandwidth Tabular Fallback) */}
      {!lowBandwidthMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: 24-Hour Real-Time Audit Ingestion & Forensic Anomaly Trend (Recharts AreaChart) */}
          <div className="lg:col-span-7 bg-[#121212] border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Real-Time Audit Log Ingestion & Anomaly Trigger Velocity
                </h3>
                <p className="text-xs text-neutral-400">
                  24-Hour rolling telemetry across Verification, Anti-Fraud, and Cybersecurity gates
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-[#C9A86A]">■ Audit Events</span>
                <span className="text-[#FFD700]">■ Anomaly Triggers</span>
                <span className="text-rose-400">■ Threat Index</span>
              </div>
            </div>

            <div className="h-72 w-full" role="img" aria-label="Area chart showing 24-hour audit log ingestion and security anomaly triggers">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[...timeSeries]}
                  margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="auditEventsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A86A" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#C9A86A" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="threatIndexGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FB7185" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FB7185" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="timeWindow"
                    stroke="#A3A3A3"
                    tick={{ fill: '#A3A3A3', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#A3A3A3"
                    tick={{ fill: '#A3A3A3', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0A',
                      borderColor: '#C9A86A',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#FFD700"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Escalation Alert Ceiling (75)',
                      position: 'insideTopRight',
                      fill: '#FFD700',
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="auditEventsIngested"
                    name="Audit Events Ingested"
                    stroke="#C9A86A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#auditEventsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="threatIndexScore"
                    name="Composite Threat Index"
                    stroke="#FB7185"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#threatIndexGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="forensicAnomalyTriggers"
                    name="Forensic Triggers"
                    stroke="#FFD700"
                    strokeWidth={2}
                    fillOpacity={0.15}
                    fill="#FFD700"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Chart: Forensic Anomaly & Security Trigger Distribution (Recharts BarChart) */}
          <div className="lg:col-span-5 bg-[#121212] border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-white font-display">
                Security & Forensic Trigger Distribution (Amendment A4)
              </h3>
              <p className="text-xs text-neutral-400">
                Breakdown by scientific anti-fraud detector and constitutional firewall rule
              </p>
            </div>

            <div className="h-72 w-full" role="img" aria-label="Bar chart showing counts of security and forensic anomaly triggers by category">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...triggerDistributionData]}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 24, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#A3A3A3"
                    tick={{ fill: '#A3A3A3', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="triggerShortName"
                    width={118}
                    stroke="#A3A3A3"
                    tick={{ fill: '#E5E5E5', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0A',
                      borderColor: '#C9A86A',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Trigger Count" radius={[0, 4, 4, 0]}>
                    {triggerDistributionData.map((entry) => (
                      <Cell
                        key={entry.triggerCode}
                        fill={getSeverityColorHex(entry.severity)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-xl font-mono text-xs space-y-2">
          <div className="text-[#FFD700] font-semibold">
            [LOW-BANDWIDTH BASE-CAMP MODE ACTIVE — RECHARTS CANVAS SUPPRESSED FOR SATELLITE LINK SAVING]
          </div>
          <p className="text-neutral-300">
            24h Audit Events: {timeSeries.reduce((acc, p) => acc + p.auditEventsIngested, 0)} · Forensic Triggers:{' '}
            {timeSeries.reduce((acc, p) => acc + p.forensicAnomalyTriggers, 0)} · Firewall Blocks:{' '}
            {timeSeries.reduce((acc, p) => acc + p.firewallBlocks, 0)}
          </p>
        </div>
      )}

      {/* Selected Event Forensic & Cryptographic Hash-Chain Inspector */}
      <div className="p-6 bg-[#121212] border border-[#C9A86A]/40 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-[#FFD700] font-semibold">{selectedLogEntry.eventId}</span>
            <span>·</span>
            <span className="text-[#C9A86A]">{selectedLogEntry.triggerCode}</span>
            <span>·</span>
            <span className="text-neutral-400">{selectedLogEntry.departmentId}</span>
            <span>·</span>
            <span className="text-emerald-400">{selectedLogEntry.status}</span>
          </div>
          <h3 className="text-lg font-semibold text-white font-display">
            Target Resource: {selectedLogEntry.targetResourceId}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {selectedLogEntry.summary}
          </p>
        </div>

        <div className="lg:col-span-5 bg-[#0A0A0A] border border-neutral-800 rounded-lg p-4 font-mono text-xs space-y-1.5">
          <div className="text-neutral-400">
            FORENSIC METRIC: <span className="text-[#FFD700]">{selectedLogEntry.forensicMetricLabel}</span>
          </div>
          <div className="text-neutral-400 truncate" title={selectedLogEntry.prevAuditHash}>
            PREV SHA-256: <span className="text-neutral-300">{selectedLogEntry.prevAuditHash}</span>
          </div>
          <div className="text-neutral-400 truncate" title={selectedLogEntry.currentEventHash}>
            CURR SHA-256: <span className="text-emerald-400">{selectedLogEntry.currentEventHash}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Immutable Real-Time Audit Log Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-neutral-400 mr-2">SEVERITY:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'ELEVATED', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                  severityFilter === sev
                    ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                    : 'bg-[#0A0A0A] text-neutral-300 hover:text-white border border-neutral-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-neutral-400 mr-2">DEPARTMENT:</span>
            {(
              [
                ['ALL', 'ALL DEPTS'],
                [GovernanceDepartmentId.DEPT_05_SECURITY, 'DEPT-05 SECURITY & ANTI-FRAUD'],
                [GovernanceDepartmentId.DEPT_03_VERIFICATION, 'DEPT-03 VERIFICATION'],
                [GovernanceDepartmentId.DEPT_04_APPEAL_REVIEW, 'DEPT-04 APPEAL REVIEW'],
                [GovernanceDepartmentId.DEPT_11_INTERNAL_AUDIT, 'DEPT-11 INTERNAL AUDIT'],
              ] as const
            ).map(([deptValue, deptLabel]) => (
              <button
                key={deptValue}
                type="button"
                onClick={() => setDepartmentFilter(deptValue)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                  departmentFilter === deptValue
                    ? 'bg-[#C9A86A] text-[#0A0A0A] font-semibold'
                    : 'bg-[#0A0A0A] text-neutral-300 hover:text-white border border-neutral-800'
                }`}
              >
                {deptLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                <th scope="col" className="py-3 pr-3">EVENT ID</th>
                <th scope="col" className="py-3 px-3">SEVERITY</th>
                <th scope="col" className="py-3 px-3">TRIGGER CODE</th>
                <th scope="col" className="py-3 px-3">DEPARTMENT</th>
                <th scope="col" className="py-3 px-3">TARGET RESOURCE</th>
                <th scope="col" className="py-3 px-3">FORENSIC TELEMETRY</th>
                <th scope="col" className="py-3 pl-3 text-right">CHAIN HASH (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 font-mono">
              {filteredLogs.map((entry) => {
                const isSelected = selectedLogEntry.eventId === entry.eventId;
                return (
                  <tr
                    key={entry.eventId}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => setSelectedLogEntry(entry)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedLogEntry(entry);
                      }
                    }}
                    className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#FFD700] ${
                      isSelected ? 'bg-neutral-900/90' : 'hover:bg-neutral-900/40'
                    }`}
                  >
                    <td className="py-2.5 pr-3 text-[#FFD700] whitespace-nowrap">
                      {entry.eventId}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={
                          entry.severity === 'CRITICAL'
                            ? 'text-rose-400 font-semibold'
                            : entry.severity === 'HIGH'
                            ? 'text-[#FFD700] font-semibold'
                            : entry.severity === 'ELEVATED'
                            ? 'text-[#C9A86A]'
                            : 'text-emerald-400'
                        }
                      >
                        {entry.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white whitespace-nowrap">
                      {entry.triggerCode}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300 whitespace-nowrap">
                      {entry.departmentId}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300 font-sans">
                      {entry.targetResourceId}
                    </td>
                    <td className="py-2.5 px-3 text-[#C9A86A] whitespace-nowrap">
                      {entry.forensicMetricLabel}
                    </td>
                    <td className="py-2.5 pl-3 text-right text-emerald-400 tabular-nums whitespace-nowrap">
                      {entry.currentEventHash.slice(0, 12)}…{entry.currentEventHash.slice(-6)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
