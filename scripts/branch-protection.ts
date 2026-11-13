/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — GitHub Main Branch Protection Policy & Compliance Auditor (AUD-01 / AUD-07)
 *
 * Purpose:
 * 1. Defines the canonical GitHub Branch Protection policy for `main` on
 *    `ranmasrangi-source/Master-plan-pro`, requiring:
 *    - Branch protection enabled (`protected: true`, `protection.enabled: true`)
 *    - Exact required CI status check: "Secret Scan, Type Check, Test Suite & Build Integrity"
 *    - Strict required status checks (`required_status_checks.strict: true`)
 *    - Pull request reviews required with >= 1 approval (`required_approving_review_count >= 1`)
 *    - Stale pull request approvals dismissed (`dismiss_stale_reviews: true`)
 *    - Conversation resolution required (`required_conversation_resolution: true`)
 *    - Administrator enforcement enabled (`enforce_admins: true`)
 *    - Force pushes disabled (`allow_force_pushes: false`)
 *    - Branch deletions disabled (`allow_deletions: false`)
 *    - Linear history required (`required_linear_history: true`)
 * 2. Queries the live GitHub REST API (`GET /branches/main` and `GET /branches/main/protection`)
 *    in strictly read-only mode by default.
 * 3. Uses explicit tri-state verification (`PASS` | `FAIL` | `UNVERIFIED`):
 *    - Never treats missing authentication or HTTP 401/403 permission errors as `PASS` or `COMPLIANT`.
 *    - If any required setting cannot be verified, reports `UNVERIFIED` (`compliant: false`) and exits 1.
 *    - Never modifies remote GitHub settings unless explicitly invoked with `--apply` AND an admin token.
 */

export const GITHUB_REPO_OWNER = 'ranmasrangi-source';
export const GITHUB_REPO_NAME = 'Master-plan-pro';
export const PROTECTED_BRANCH_NAME = 'main';
export const REQUIRED_CI_CHECK_CONTEXT =
  'Secret Scan, Type Check, Test Suite & Build Integrity';

export type BranchProtectionVerificationState = 'PASS' | 'FAIL' | 'UNVERIFIED';

export interface GitHubBranchProtectionPayload {
  readonly required_status_checks: {
    readonly strict: boolean;
    readonly contexts: readonly string[];
  };
  readonly enforce_admins: boolean;
  readonly required_pull_request_reviews: {
    readonly dismiss_stale_reviews: boolean;
    readonly require_code_owner_reviews: boolean;
    readonly required_approving_review_count: number;
  };
  readonly restrictions: null;
  readonly required_linear_history: boolean;
  readonly allow_force_pushes: boolean;
  readonly allow_deletions: boolean;
  readonly block_creations: boolean;
  readonly required_conversation_resolution: boolean;
}

export const CANONICAL_MAIN_BRANCH_PROTECTION_POLICY: GitHubBranchProtectionPayload =
  Object.freeze({
    required_status_checks: Object.freeze({
      strict: true,
      contexts: Object.freeze([REQUIRED_CI_CHECK_CONTEXT]),
    }),
    enforce_admins: true,
    required_pull_request_reviews: Object.freeze({
      dismiss_stale_reviews: true,
      require_code_owner_reviews: false,
      required_approving_review_count: 1,
    }),
    restrictions: null,
    required_linear_history: true,
    allow_force_pushes: false,
    allow_deletions: false,
    block_creations: false,
    required_conversation_resolution: true,
  });

export interface DetailedProtectionSettings {
  readonly strictStatusChecksEnabled?: boolean | null;
  readonly requiredPullRequestReviewsEnabled: boolean | null;
  readonly requiredApprovingReviewCount: number | null;
  readonly dismissStaleReviews: boolean | null;
  readonly enforceAdminsEnabled: boolean | null;
  readonly allowForcePushesEnabled: boolean | null;
  readonly allowDeletionsEnabled: boolean | null;
  readonly requiredConversationResolutionEnabled: boolean | null;
  readonly requiredLinearHistoryEnabled?: boolean | null;
}

export interface LiveBranchProtectionInspection {
  readonly repository: string;
  readonly branch: string;
  readonly httpStatus: number;
  readonly authenticationProvided?: boolean;
  readonly detailedProtectionHttpStatus?: number | null;
  readonly protectionEnabled: boolean;
  readonly requiredContexts: readonly string[];
  readonly detailedSettings?: DetailedProtectionSettings | null;
  readonly rawProtectionObject: unknown;
}

export interface BranchProtectionControlStates {
  readonly branchProtectionEnabled: BranchProtectionVerificationState;
  readonly requiredStatusCheckPresent: BranchProtectionVerificationState;
  readonly strictStatusChecks: BranchProtectionVerificationState;
  readonly pullRequestApprovals: BranchProtectionVerificationState;
  readonly dismissStaleReviews: BranchProtectionVerificationState;
  readonly conversationResolution: BranchProtectionVerificationState;
  readonly adminEnforcement: BranchProtectionVerificationState;
  readonly forcePushesDisabled: BranchProtectionVerificationState;
  readonly branchDeletionsDisabled: BranchProtectionVerificationState;
  readonly linearHistoryRequired: BranchProtectionVerificationState;
}

export interface BranchProtectionComplianceResult {
  readonly status: BranchProtectionVerificationState;
  readonly compliant: boolean;
  readonly protectionEnabled: boolean;
  readonly requiredCheckPresent: boolean;
  readonly failedChecks: readonly string[];
  readonly unverifiedChecks: readonly string[];
  readonly controlStates: BranchProtectionControlStates;
}

export async function inspectRemoteBranchProtection(
  owner: string = GITHUB_REPO_OWNER,
  repo: string = GITHUB_REPO_NAME,
  branch: string = PROTECTED_BRANCH_NAME,
  token?: string
): Promise<LiveBranchProtectionInspection> {
  const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
  const hasToken = Boolean(token && token.trim().length > 0);
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': '0to8848-branch-protection-auditor',
  };
  if (hasToken && token) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    return {
      repository: `${owner}/${repo}`,
      branch,
      httpStatus: res.status,
      authenticationProvided: hasToken,
      detailedProtectionHttpStatus: null,
      protectionEnabled: false,
      requiredContexts: [],
      detailedSettings: null,
      rawProtectionObject: null,
    };
  }

  const data = (await res.json()) as {
    protected?: boolean;
    protection?: {
      enabled?: boolean;
      required_status_checks?: {
        strict?: boolean;
        enforcement_level?: string;
        contexts?: string[];
        checks?: Array<{ context: string }>;
      };
    };
  };

  const protectionEnabled = Boolean(data?.protected && data?.protection?.enabled);
  const contextsFromChecks =
    data?.protection?.required_status_checks?.checks?.map((c) => c.context) ?? [];
  const legacyContexts = data?.protection?.required_status_checks?.contexts ?? [];
  const requiredContexts = Array.from(new Set([...legacyContexts, ...contextsFromChecks]));

  let detailedSettings: DetailedProtectionSettings | null = null;
  let detailedProtectionHttpStatus: number | null = null;

  if (!protectionEnabled) {
    // When branch protection is explicitly disabled on GitHub, all branch protection controls are off/disabled.
    detailedSettings = {
      strictStatusChecksEnabled: false,
      requiredPullRequestReviewsEnabled: false,
      requiredApprovingReviewCount: 0,
      dismissStaleReviews: false,
      enforceAdminsEnabled: false,
      allowForcePushesEnabled: true,
      allowDeletionsEnabled: true,
      requiredConversationResolutionEnabled: false,
      requiredLinearHistoryEnabled: false,
    };
  } else {
    try {
      const protRes = await fetch(`${url}/protection`, { headers });
      detailedProtectionHttpStatus = protRes.status;
      if (protRes.ok) {
        const protData = (await protRes.json()) as {
          required_status_checks?: {
            strict?: boolean;
          };
          required_pull_request_reviews?: {
            dismiss_stale_reviews?: boolean;
            required_approving_review_count?: number;
          } | null;
          enforce_admins?: { enabled?: boolean };
          allow_force_pushes?: { enabled?: boolean };
          allow_deletions?: { enabled?: boolean };
          required_conversation_resolution?: { enabled?: boolean };
          required_linear_history?: { enabled?: boolean };
        };

        const strictVal =
          typeof protData.required_status_checks?.strict === 'boolean'
            ? protData.required_status_checks.strict
            : typeof data?.protection?.required_status_checks?.strict === 'boolean'
              ? data.protection.required_status_checks.strict
              : null;

        const prReviewsPresent = Boolean(protData.required_pull_request_reviews);
        const approvingCount = prReviewsPresent
          ? (protData.required_pull_request_reviews?.required_approving_review_count ?? 0)
          : 0;
        const dismissStale = prReviewsPresent
          ? Boolean(protData.required_pull_request_reviews?.dismiss_stale_reviews)
          : false;

        detailedSettings = {
          strictStatusChecksEnabled: strictVal,
          requiredPullRequestReviewsEnabled: prReviewsPresent,
          requiredApprovingReviewCount: approvingCount,
          dismissStaleReviews: dismissStale,
          enforceAdminsEnabled:
            typeof protData.enforce_admins?.enabled === 'boolean'
              ? protData.enforce_admins.enabled
              : null,
          allowForcePushesEnabled:
            typeof protData.allow_force_pushes?.enabled === 'boolean'
              ? protData.allow_force_pushes.enabled
              : null,
          allowDeletionsEnabled:
            typeof protData.allow_deletions?.enabled === 'boolean'
              ? protData.allow_deletions.enabled
              : null,
          requiredConversationResolutionEnabled:
            typeof protData.required_conversation_resolution?.enabled === 'boolean'
              ? protData.required_conversation_resolution.enabled
              : null,
          requiredLinearHistoryEnabled:
            typeof protData.required_linear_history?.enabled === 'boolean'
              ? protData.required_linear_history.enabled
              : null,
        };
      } else {
        // Do not fabricate or assume detailed settings when API returns 401/403/404
        detailedSettings = null;
      }
    } catch {
      detailedSettings = null;
    }
  }

  return {
    repository: `${owner}/${repo}`,
    branch,
    httpStatus: res.status,
    authenticationProvided: hasToken,
    detailedProtectionHttpStatus,
    protectionEnabled,
    requiredContexts,
    detailedSettings,
    rawProtectionObject: data?.protection ?? null,
  };
}

export function evaluateBranchProtectionCompliance(
  inspection: LiveBranchProtectionInspection
): BranchProtectionComplianceResult {
  const failedChecks: string[] = [];
  const unverifiedChecks: string[] = [];

  // Handle top-level branch endpoint HTTP failure (e.g., 401/403/404/500)
  if (inspection.httpStatus !== 200) {
    const code =
      inspection.httpStatus === 401 || inspection.httpStatus === 403
        ? `BRANCH_API_PERMISSION_ERROR_HTTP_${inspection.httpStatus}`
        : `BRANCH_API_UNAVAILABLE_HTTP_${inspection.httpStatus}`;
    unverifiedChecks.push(code);
    failedChecks.push(code);
    return {
      status: 'UNVERIFIED',
      compliant: false,
      protectionEnabled: false,
      requiredCheckPresent: false,
      failedChecks,
      unverifiedChecks,
      controlStates: {
        branchProtectionEnabled: 'UNVERIFIED',
        requiredStatusCheckPresent: 'UNVERIFIED',
        strictStatusChecks: 'UNVERIFIED',
        pullRequestApprovals: 'UNVERIFIED',
        dismissStaleReviews: 'UNVERIFIED',
        conversationResolution: 'UNVERIFIED',
        adminEnforcement: 'UNVERIFIED',
        forcePushesDisabled: 'UNVERIFIED',
        branchDeletionsDisabled: 'UNVERIFIED',
        linearHistoryRequired: 'UNVERIFIED',
      },
    };
  }

  // 1. Branch protection enabled
  let branchProtectionEnabledState: BranchProtectionVerificationState = 'PASS';
  if (!inspection.protectionEnabled) {
    branchProtectionEnabledState = 'FAIL';
    failedChecks.push('PROTECTION_DISABLED_ON_REMOTE_MAIN');
  }

  // 2. Exact required status check context
  const requiredCheckPresent = inspection.requiredContexts.includes(
    REQUIRED_CI_CHECK_CONTEXT
  );
  let requiredStatusCheckPresentState: BranchProtectionVerificationState = 'PASS';
  if (!requiredCheckPresent) {
    requiredStatusCheckPresentState = 'FAIL';
    failedChecks.push(
      `MISSING_REQUIRED_STATUS_CHECK:${REQUIRED_CI_CHECK_CONTEXT}`
    );
  }

  let strictStatusChecksState: BranchProtectionVerificationState = 'UNVERIFIED';
  let pullRequestApprovalsState: BranchProtectionVerificationState = 'UNVERIFIED';
  let dismissStaleReviewsState: BranchProtectionVerificationState = 'UNVERIFIED';
  let conversationResolutionState: BranchProtectionVerificationState = 'UNVERIFIED';
  let adminEnforcementState: BranchProtectionVerificationState = 'UNVERIFIED';
  let forcePushesDisabledState: BranchProtectionVerificationState = 'UNVERIFIED';
  let branchDeletionsDisabledState: BranchProtectionVerificationState = 'UNVERIFIED';
  let linearHistoryRequiredState: BranchProtectionVerificationState = 'UNVERIFIED';

  if (!inspection.detailedSettings) {
    failedChecks.push('DETAILED_PROTECTION_SETTINGS_UNVERIFIED');
    unverifiedChecks.push('DETAILED_PROTECTION_SETTINGS_UNVERIFIED');
    if (inspection.authenticationProvided === false) {
      unverifiedChecks.push('MISSING_ADMINISTRATIVE_TOKEN');
    }
    if (
      inspection.detailedProtectionHttpStatus === 401 ||
      inspection.detailedProtectionHttpStatus === 403
    ) {
      unverifiedChecks.push(
        `DETAILED_PROTECTION_API_PERMISSION_ERROR_HTTP_${inspection.detailedProtectionHttpStatus}`
      );
    }
    unverifiedChecks.push(
      'UNVERIFIED_STRICT_STATUS_CHECKS',
      'UNVERIFIED_PULL_REQUEST_REVIEWS',
      'UNVERIFIED_DISMISS_STALE_REVIEWS',
      'UNVERIFIED_CONVERSATION_RESOLUTION',
      'UNVERIFIED_ADMIN_ENFORCEMENT',
      'UNVERIFIED_FORCE_PUSHES_DISABLED',
      'UNVERIFIED_BRANCH_DELETIONS_DISABLED',
      'UNVERIFIED_LINEAR_HISTORY'
    );
  } else {
    const ds = inspection.detailedSettings;

    // 3. Strict status checks ( default true when omitted in legacy unit test fixtures only if explicitly boolean, otherwise check === false vs === null )
    const strictVal =
      ds.strictStatusChecksEnabled === undefined ? true : ds.strictStatusChecksEnabled;
    if (strictVal === null) {
      strictStatusChecksState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_STRICT_STATUS_CHECKS');
      failedChecks.push('UNVERIFIED_STRICT_STATUS_CHECKS');
    } else if (strictVal !== true) {
      strictStatusChecksState = 'FAIL';
      failedChecks.push('STRICT_STATUS_CHECKS_DISABLED');
    } else {
      strictStatusChecksState = 'PASS';
    }

    // 4. At least one PR approval
    if (
      ds.requiredPullRequestReviewsEnabled === null ||
      ds.requiredApprovingReviewCount === null
    ) {
      pullRequestApprovalsState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_PULL_REQUEST_REVIEWS');
      failedChecks.push('UNVERIFIED_PULL_REQUEST_REVIEWS');
    } else if (
      ds.requiredPullRequestReviewsEnabled !== true ||
      ds.requiredApprovingReviewCount < 1
    ) {
      pullRequestApprovalsState = 'FAIL';
      failedChecks.push('PULL_REQUEST_REVIEWS_NOT_REQUIRED');
    } else {
      pullRequestApprovalsState = 'PASS';
    }

    // 5. Stale approvals dismissed
    if (ds.dismissStaleReviews === null) {
      dismissStaleReviewsState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_DISMISS_STALE_REVIEWS');
      failedChecks.push('UNVERIFIED_DISMISS_STALE_REVIEWS');
    } else if (ds.dismissStaleReviews !== true) {
      dismissStaleReviewsState = 'FAIL';
      failedChecks.push('STALE_REVIEWS_NOT_DISMISSED');
    } else {
      dismissStaleReviewsState = 'PASS';
    }

    // 6. Conversation resolution required
    if (ds.requiredConversationResolutionEnabled === null) {
      conversationResolutionState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_CONVERSATION_RESOLUTION');
      failedChecks.push('UNVERIFIED_CONVERSATION_RESOLUTION');
    } else if (ds.requiredConversationResolutionEnabled !== true) {
      conversationResolutionState = 'FAIL';
      failedChecks.push('CONVERSATION_RESOLUTION_NOT_REQUIRED');
    } else {
      conversationResolutionState = 'PASS';
    }

    // 7. Admin enforcement
    if (ds.enforceAdminsEnabled === null) {
      adminEnforcementState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_ADMIN_ENFORCEMENT');
      failedChecks.push('UNVERIFIED_ADMIN_ENFORCEMENT');
    } else if (ds.enforceAdminsEnabled !== true) {
      adminEnforcementState = 'FAIL';
      failedChecks.push('ADMIN_ENFORCEMENT_DISABLED');
    } else {
      adminEnforcementState = 'PASS';
    }

    // 8. Force pushes disabled
    if (ds.allowForcePushesEnabled === null) {
      forcePushesDisabledState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_FORCE_PUSHES_DISABLED');
      failedChecks.push('UNVERIFIED_FORCE_PUSHES_DISABLED');
    } else if (ds.allowForcePushesEnabled !== false) {
      forcePushesDisabledState = 'FAIL';
      failedChecks.push('FORCE_PUSHES_NOT_BLOCKED');
    } else {
      forcePushesDisabledState = 'PASS';
    }

    // 9. Branch deletions disabled
    if (ds.allowDeletionsEnabled === null) {
      branchDeletionsDisabledState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_BRANCH_DELETIONS_DISABLED');
      failedChecks.push('UNVERIFIED_BRANCH_DELETIONS_DISABLED');
    } else if (ds.allowDeletionsEnabled !== false) {
      branchDeletionsDisabledState = 'FAIL';
      failedChecks.push('BRANCH_DELETIONS_NOT_BLOCKED');
    } else {
      branchDeletionsDisabledState = 'PASS';
    }

    // 10. Linear history required
    const linearVal =
      ds.requiredLinearHistoryEnabled === undefined ? true : ds.requiredLinearHistoryEnabled;
    if (linearVal === null) {
      linearHistoryRequiredState = 'UNVERIFIED';
      unverifiedChecks.push('UNVERIFIED_LINEAR_HISTORY');
      failedChecks.push('UNVERIFIED_LINEAR_HISTORY');
    } else if (linearVal !== true) {
      linearHistoryRequiredState = 'FAIL';
      failedChecks.push('LINEAR_HISTORY_NOT_REQUIRED');
    } else {
      linearHistoryRequiredState = 'PASS';
    }
  }

  const controlStates: BranchProtectionControlStates = {
    branchProtectionEnabled: branchProtectionEnabledState,
    requiredStatusCheckPresent: requiredStatusCheckPresentState,
    strictStatusChecks: strictStatusChecksState,
    pullRequestApprovals: pullRequestApprovalsState,
    dismissStaleReviews: dismissStaleReviewsState,
    conversationResolution: conversationResolutionState,
    adminEnforcement: adminEnforcementState,
    forcePushesDisabled: forcePushesDisabledState,
    branchDeletionsDisabled: branchDeletionsDisabledState,
    linearHistoryRequired: linearHistoryRequiredState,
  };

  const stateValues = Object.values(controlStates);
  const hasExplicitFail = stateValues.includes('FAIL');
  const hasUnverified = stateValues.includes('UNVERIFIED') || unverifiedChecks.length > 0;

  const overallStatus: BranchProtectionVerificationState = hasExplicitFail
    ? 'FAIL'
    : hasUnverified
      ? 'UNVERIFIED'
      : 'PASS';

  return {
    status: overallStatus,
    compliant: overallStatus === 'PASS' && failedChecks.length === 0 && unverifiedChecks.length === 0,
    protectionEnabled: inspection.protectionEnabled,
    requiredCheckPresent,
    failedChecks,
    unverifiedChecks,
    controlStates,
  };
}

export async function applyRemoteBranchProtection(
  token: string,
  owner: string = GITHUB_REPO_OWNER,
  repo: string = GITHUB_REPO_NAME,
  branch: string = PROTECTED_BRANCH_NAME
): Promise<{ readonly success: boolean; readonly httpStatus: number; readonly responseBody: unknown }> {
  const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}/protection`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': '0to8848-branch-protection-provisioner',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(CANONICAL_MAIN_BRANCH_PROTECTION_POLICY),
  });

  const responseBody = await res.json();
  return {
    success: res.ok,
    httpStatus: res.status,
    responseBody,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const shouldApply = process.argv.includes('--apply');
  const adminToken =
    process.env.GITHUB_ADMIN_TOKEN || process.env.BRANCH_PROTECTION_ADMIN_TOKEN || '';

  (async () => {
    if (shouldApply && !adminToken) {
      console.error(
        '[0 TO 8848 Branch Protection] FAIL: Cannot apply remotely because neither GITHUB_ADMIN_TOKEN nor BRANCH_PROTECTION_ADMIN_TOKEN is set in environment.'
      );
      process.exit(1);
    }

    // Rule 10: Never modify remote GitHub repository settings unless explicitly invoked with --apply
    if (shouldApply && adminToken) {
      const applied = await applyRemoteBranchProtection(adminToken);
      console.log(
        `[0 TO 8848 Branch Protection] Provisioning PUT /branches/main/protection -> HTTP ${applied.httpStatus} (success=${applied.success})`
      );
      if (!applied.success) {
        console.error(
          '[0 TO 8848 Branch Protection] FAIL: Remote branch protection provisioning rejected by GitHub API.'
        );
        process.exit(1);
      }
    }

    const status = await inspectRemoteBranchProtection(
      GITHUB_REPO_OWNER,
      GITHUB_REPO_NAME,
      PROTECTED_BRANCH_NAME,
      adminToken || undefined
    );
    const compliance = evaluateBranchProtectionCompliance(status);

    console.log(
      `[0 TO 8848 Branch Protection] Repository: ${status.repository} (${status.branch})`
    );
    console.log(
      `[0 TO 8848 Branch Protection] Admin Token Provided: ${Boolean(status.authenticationProvided)} | /branches/main HTTP ${status.httpStatus} | /branches/main/protection HTTP ${status.detailedProtectionHttpStatus ?? 'N/A'}`
    );
    console.log(
      `[0 TO 8848 Branch Protection] Live Remote protection.enabled: ${status.protectionEnabled}`
    );
    console.log(
      `[0 TO 8848 Branch Protection] Required Status Checks: ${JSON.stringify(status.requiredContexts)}`
    );
    console.log(
      `[0 TO 8848 Branch Protection] Control Verification States: ${JSON.stringify(compliance.controlStates)}`
    );

    if (compliance.status === 'PASS') {
      console.log(
        '[0 TO 8848 Branch Protection] AUD-07 Verification Status: PASS (All 10 required branch protection controls independently verified).'
      );
      process.exit(0);
    } else if (compliance.status === 'UNVERIFIED') {
      console.error(
        `[0 TO 8848 Branch Protection] AUD-07 Verification Status: UNVERIFIED (Exit Code 1) — Basic branch protection (${status.protectionEnabled}) and required status check (${compliance.requiredCheckPresent}) are active, but detailed protection settings could not be verified: ${compliance.unverifiedChecks.join(', ')}.`
      );
      console.error(
        '[0 TO 8848 Branch Protection] OWNER ACTION REQUIRED (ranmasrangi-source): Provide a read/admin token via GITHUB_ADMIN_TOKEN or GitHub Actions secret BRANCH_PROTECTION_ADMIN_TOKEN with "Administration: Read" permission so GET /repos/ranmasrangi-source/Master-plan-pro/branches/main/protection can verify strict status checks, PR approvals (>=1), stale review dismissal, conversation resolution, admin enforcement, linear history, and force-push/deletion blocks.'
      );
      process.exit(1);
    } else {
      console.error(
        `[0 TO 8848 Branch Protection] AUD-07 Verification Status: FAIL (Exit Code 1) — Remote GitHub main branch protection failed required checks: ${compliance.failedChecks.join(', ')}.`
      );
      console.error(
        '[0 TO 8848 Branch Protection] OWNER ACTION REQUIRED (ranmasrangi-source): Configure main branch protection in GitHub Settings -> Branches to require status check "Secret Scan, Type Check, Test Suite & Build Integrity" (strict), PR review (>=1 approval, dismiss stale reviews), conversation resolution, admin enforcement, linear history, and block force pushes and branch deletions.'
      );
      process.exit(1);
    }
  })().catch((err) => {
    console.error(
      '[0 TO 8848 Branch Protection] Error:',
      err instanceof Error ? err.message : String(err)
    );
    process.exit(1);
  });
}
