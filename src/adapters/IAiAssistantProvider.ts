/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Governed Assistive AI Provider Interface (Sections 50–51 & System #13)
 */

export enum ApprovedAiTaskType {
  DESTINATION_INFO_SEARCH = 'DESTINATION_INFO_SEARCH',
  TRANSLATION_DRAFT_ASSIST = 'TRANSLATION_DRAFT_ASSIST',
  EVIDENCE_PRE_CLASSIFICATION = 'EVIDENCE_PRE_CLASSIFICATION',
  ROUTE_CONSISTENCY_SUMMARY = 'ROUTE_CONSISTENCY_SUMMARY',
}

export interface AiAssistanceAuditRecord {
  readonly auditId: string;
  readonly providerName: string;
  readonly modelVersion: string;
  readonly taskType: ApprovedAiTaskType;
  readonly inputSha256: string;
  readonly requiresHumanReview: true; // Constitutional invariant: AI output is assistive only
  readonly canApproveOrRejectAchievement: false; // Section 51 hard restriction
  readonly timestampIso: string;
}

/**
 * Vendor-neutral assistive AI interface.
 * By constitutional mandate (Section 51), implementations of this interface
 * have ZERO methods or permissions to approve/reject achievements, override appeals,
 * mint credentials, or modify leaderboards.
 */
export interface IAiAssistantProvider {
  readonly providerId: string;
  readonly modelVersion: string;

  generateAssistiveDraft(params: {
    readonly taskType: ApprovedAiTaskType;
    readonly promptText: string;
    readonly containsRegulatedPii: false; // Section 48: PII never sent to external AI
  }): Promise<{
    readonly draftText: string;
    readonly aiDisclosureLabel: 'AI-ASSISTED DRAFT — REQUIRES HUMAN VERIFICATION';
    readonly auditRecord: AiAssistanceAuditRecord;
  }>;
}
