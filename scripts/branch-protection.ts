/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — GitHub Main Branch Protection Policy & Provisioning Script (AUD-01)
 *
 * Purpose:
 * 1. Defines the canonical GitHub Branch Protection policy for `main` on
 *    `ranmasrangi-source/Master-plan-pro`, requiring the CI status check
 *    "Secret Scan, Type Check, Test Suite & Build Integrity" to pass before merging.
 * 2. Queries the live GitHub REST API to inspect whether branch protection is enabled.
 * 3. When invoked with `--apply` and a repository admin token (`GITHUB_ADMIN_TOKEN`),
 *    provisions the branch protection rule via `PUT /repos/:owner/:repo/branches/:branch/protection`.
 *
 * Note on Environment Limitation:
 * Unauthenticated callers (or default read-only CI tokens) cannot mutate GitHub branch
 * protection rules. If `GITHUB_ADMIN_TOKEN` is not present in the environment, this tool
 * reports the live remote protection status honestly and outputs the exact `gh api` / `curl`
 * command for the repository owner (`ranmasrangi-source`) to execute.
 */

export const GITHUB_REPO_OWNER = 'ranmasrangi-source';
export const GITHUB_REPO_NAME = 'Master-plan-pro';
export const PROTECTED_BRANCH_NAME = 'main';
export const REQUIRED_CI_CHECK_CONTEXT =
  'Secret Scan, Type Check, Test Suite & Build Integrity';

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

export interface LiveBranchProtectionInspection {
  readonly repository: string;
  readonly branch: string;
  readonly httpStatus: number;
  readonly protectionEnabled: boolean;
  readonly requiredContexts: readonly string[];
  readonly rawProtectionObject: unknown;
}

export async function inspectRemoteBranchProtection(
  owner: string = GITHUB_REPO_OWNER,
  repo: string = GITHUB_REPO_NAME,
  branch: string = PROTECTED_BRANCH_NAME,
  token?: string
): Promise<LiveBranchProtectionInspection> {
  const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': '0to8848-branch-protection-auditor',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  const data = (await res.json()) as {
    protection?: {
      enabled?: boolean;
      required_status_checks?: {
        contexts?: string[];
        checks?: Array<{ context: string }>;
      };
    };
  };

  const protectionEnabled = Boolean(data?.protection?.enabled);
  const contextsFromChecks =
    data?.protection?.required_status_checks?.checks?.map((c) => c.context) ?? [];
  const legacyContexts = data?.protection?.required_status_checks?.contexts ?? [];
  const requiredContexts = Array.from(new Set([...legacyContexts, ...contextsFromChecks]));

  return {
    repository: `${owner}/${repo}`,
    branch,
    httpStatus: res.status,
    protectionEnabled,
    requiredContexts,
    rawProtectionObject: data?.protection ?? null,
  };
}

export interface BranchProtectionComplianceResult {
  readonly compliant: boolean;
  readonly protectionEnabled: boolean;
  readonly requiredCheckPresent: boolean;
  readonly failedChecks: readonly string[];
}

export function evaluateBranchProtectionCompliance(
  inspection: LiveBranchProtectionInspection
): BranchProtectionComplianceResult {
  const failedChecks: string[] = [];
  if (!inspection.protectionEnabled) {
    failedChecks.push('PROTECTION_DISABLED_ON_REMOTE_MAIN');
  }
  const requiredCheckPresent = inspection.requiredContexts.includes(
    REQUIRED_CI_CHECK_CONTEXT
  );
  if (!requiredCheckPresent) {
    failedChecks.push(
      `MISSING_REQUIRED_STATUS_CHECK:${REQUIRED_CI_CHECK_CONTEXT}`
    );
  }
  return {
    compliant: failedChecks.length === 0,
    protectionEnabled: inspection.protectionEnabled,
    requiredCheckPresent,
    failedChecks,
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
  const requireEnabled = process.argv.includes('--require-enabled');
  const adminToken =
    process.env.GITHUB_ADMIN_TOKEN || process.env.BRANCH_PROTECTION_ADMIN_TOKEN || '';

  (async () => {
    if (shouldApply) {
      if (!adminToken) {
        console.error(
          '[0 TO 8848 Branch Protection] Cannot apply remotely: GITHUB_ADMIN_TOKEN / BRANCH_PROTECTION_ADMIN_TOKEN is not set in environment.'
        );
        process.exit(1);
      }
      const applied = await applyRemoteBranchProtection(adminToken);
      console.log(
        `[0 TO 8848 Branch Protection] PUT /branches/main/protection HTTP ${applied.httpStatus} (success=${applied.success})`
      );
      if (!applied.success) {
        console.error(JSON.stringify(applied.responseBody, null, 2));
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
      `[0 TO 8848 Branch Protection] Live Remote protection.enabled: ${status.protectionEnabled}`
    );
    console.log(
      `[0 TO 8848 Branch Protection] Required Status Checks: ${JSON.stringify(status.requiredContexts)}`
    );
    console.log(
      `[0 TO 8848 Branch Protection] AUD-07 Compliance Status: ${
        compliance.compliant
          ? 'COMPLIANT (PASS)'
          : `NON-COMPLIANT (${compliance.failedChecks.join(', ')})`
      }`
    );

    if (!compliance.compliant) {
      if (requireEnabled || shouldApply) {
        console.error(
          `[0 TO 8848 Branch Protection] FAIL: Mandatory branch protection requirements are not satisfied: ${compliance.failedChecks.join(', ')}`
        );
        process.exit(1);
      } else {
        console.warn(
          '[0 TO 8848 Branch Protection] PERMISSION LIMITATION NOTICE: Unauthenticated / read-only CI token cannot mutate GitHub branch protection settings. Repository owner (ranmasrangi-source) must configure secrets.BRANCH_PROTECTION_ADMIN_TOKEN or run `GITHUB_ADMIN_TOKEN=<pat> npm run security:branch-protection -- --apply`.'
        );
      }
    }
  })().catch((err) => {
    console.error('[0 TO 8848 Branch Protection] Error:', err);
    process.exit(1);
  });
}

