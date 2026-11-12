# 08 — DATABASE SCHEMA & DATA GOVERNANCE ARCHITECTURE (ULTIMATE V1.1)

**Document Version:** ULTIMATE V1.1  
**Phase:** PHASE 02 — TECHNICAL ARCHITECTURE & SYSTEM DESIGN  
**Selected Architecture (`FQ-01` & `A5`):** Option A — Hybrid / Repository-Abstracted Relational Schema (80 Numbered Schema Groups / 86 Physical Tables across 10 Bounded Domains, Exceeding 72-Table Baseline)

---

## 1. Schema Design Principles & Data Classification
Every table in the 0 TO 8848 relational schema enforces:
1. **Deterministic Primary & Foreign Keys:** UUIDv4 / prefixed canonical IDs (`DEST-001`, `CAT-12`, `CRED-2026-XXXXXX`) with strict foreign-key referential integrity (`ON DELETE RESTRICT` on audit, verification, and credential tables).
2. **4-Tier Privacy & Data Residency Classification (`CHK-01.16`):**
   - `TIER_1_PUBLIC`: Publicly queryable catalogue & sanitized credential registry.
   - `TIER_2_INTERNAL`: Authenticated community, profile, and marketplace listings.
   - `TIER_3_RESTRICTED_EVIDENCE`: Raw GPX tracks, uncropped summit photos, witness tokens, reviewer notes.
   - `TIER_4_REGULATED_PII`: Passport/citizenship scans, emergency contacts, encrypted whistleblower narratives (`residencyRegion: "NP" | "EU" | "UAE" | "GLOBAL"`).
3. **Immutable Append-Only Ledgers:** `evidenceHashes`, `evidenceAccessLogs`, `credentialLifecycleEvents`, `ecfOverrideAuditLogs`, `auditLogs`, and `securityEvents` forbid `UPDATE` and `DELETE` operations at both the repository interface and database rule levels.

---

## 2. Complete Relational Schema Specification (80 Numbered Schema Groups / 86 Physical Tables, Exceeding 72-Table Baseline)

### Domain 1: Identity, RBAC & Privacy Governance (9 Tables)
1. `users`:
   - `id` (PK), `email` (Unique), `passwordHash`, `emailVerified` (bool), `mfaEnabled` (bool), `mfaSecretEncrypted`, `accountStatus` (`ACTIVE | SUSPENDED | DELETED`), `ageBracket` (`ADULT_18_PLUS | MINOR_13_17`), `residencyRegion` (`NP | EU | UAE | GLOBAL`), `createdAt`, `updatedAt`.
   - *Indexes:* `idx_users_email`, `idx_users_status`.
2. `user_profiles`:
   - `userId` (PK, FK $\rightarrow$ `users.id`), `displayName`, `fullNameEncrypted`, `countryCode`, `preferredLocale` (`en | ne | hi | ar | es | fr | de | zh | ja`), `bio`, `avatarUrl`, `publicProfileVisible` (bool), `showOnLeaderboards` (bool), `shareEvidenceSummaryPublicly` (bool), `lowBandwidthDefault` (bool).
3. `user_sessions`:
   - `sessionId` (PK), `userId` (FK $\rightarrow$ `users.id`), `tokenHash`, `ipHash`, `userAgentSummary`, `mfaVerifiedAt`, `expiresAt`, `revokedAt`, `revocationReason`.
4. `roles`:
   - `roleId` (PK — 21 Roles: the 20 constitutional roles from Section 11 + `heritage_guardian` per `NF-01`), `roleName`, `departmentId` (`DEPT-01..11`), `requiresMfa` (bool), `isPrivileged` (bool).
5. `permissions`:
   - `permissionId` (PK), `resource`, `action` (`CREATE | READ | UPDATE | DELETE | APPROVE | AUDIT`), `description`.
6. `role_assignments`:
   - `assignmentId` (PK), `userId` (FK $\rightarrow$ `users.id`), `roleId` (FK $\rightarrow$ `roles.roleId`), `grantedByProposalId` (FK $\rightarrow$ `governance_proposals.proposalId`), `grantedAt`, `expiresAt`, `revokedAt`.
   - *Constraint:* Privileged roles cannot be self-assigned.
7. `consent_records`:
   - `consentId` (PK), `userId` (FK $\rightarrow$ `users.id`), `policyVersion` (FK $\rightarrow$ `policy_versions.versionId`), `purposeKey`, `granted` (bool), `guardianVerified` (bool for minors), `recordedAt`.
8. `privacy_requests`:
   - `requestId` (PK), `userId` (FK $\rightarrow$ `users.id`), `requestType` (`DATA_EXPORT | CORRECTION | RESTRICT_PROCESSING`), `status`, `exportDownloadHash`, `createdAt`, `completedAt`.
9. `deletion_requests`:
   - `deletionId` (PK), `userId` (FK $\rightarrow$ `users.id`), `scope` (`RAW_EVIDENCE_ONLY | FULL_ACCOUNT_ANONYMIZATION`), `targetEvidenceId` (Nullable FK), `legalHoldActive` (bool), `status`, `requestedAt`, `executedAt`.

### Domain 2: Adventure Taxonomy & Verification Standards (5 Tables)
10. `macro_domains` (Amendment A2):
    - `domainId` (PK: `MD-01`..`MD-06`), `nameEn`, `nameNe`, `description`.
11. `adventure_categories` (Amendment A2):
    - `categoryId` (PK: `CAT-01`..`CAT-24`), `macroDomainId` (NOT NULL FK $\rightarrow$ `macro_domains.domainId`), `nameEn`, `nameNe`, `difficultySystem`, `riskLevel` (`LOW | MODERATE | HIGH | EXTREME`), `requiredSkillsJson`, `safetyRequirementsJson`, `minReviewerTier` (`L1 | L2 | L3 | DUAL_L3 | DUAL_L4`), `minEcfThreshold` (int $\ge 75$), `badgeEligible` (bool), `competitiveRankEligible` (bool).
12. `achievements`:
    - `achievementId` (PK), `categoryId` (FK $\rightarrow$ `adventure_categories.categoryId`), `destinationId` (Nullable FK $\rightarrow$ `destinations.destinationId`), `archetype` (`TYPE_A | TYPE_B | TYPE_C | TYPE_D | TYPE_E | TYPE_F`), `titleEn`, `titleNe`, `completionCriteriaJson`, `basePoints` (int), `difficultyMultiplier` (numeric), `altitudeRemotenessFactor` (numeric), `requiresHeritageGuardian` (bool), `effectivePolicyVersion`.
13. `achievement_eligible_routes`:
    - `id` (PK), `achievementId` (FK $\rightarrow$ `achievements.achievementId`), `routeId` (FK $\rightarrow$ `destination_routes.routeId`).
14. `verification_standards`:
    - `standardId` (PK), `categoryId` (FK $\rightarrow$ `adventure_categories.categoryId`), `pillarWeightsJson`, `minTotalConfidence` (default `75`), `allowGpsFreePathway` (bool, default `true`), `allowStrippedExif` (bool, default `true`), `requiresDualSenior` (bool), `policyVersion`.

### Domain 3: Global Destinations, Routes & Safety Intelligence (8 Tables)
15. `geographical_regions`:
    - `regionId` (PK: `REG-*`), `continent`, `nameEn`, `nameNe`, `parentRegionId`.
16. `destinations` (100 Featured Destinations — Amendment A6 & CHK-01.14–01.18):
    - `destinationId` (PK: `DEST-001`..`DEST-100`), `regionId` (FK $\rightarrow$ `geographical_regions.regionId`), `entityType`, `nameEn`, `nameNe`, `altNamesJson`, `countryCodesJson`, `latitude` (numeric), `longitude` (numeric), `elevationMeters` (numeric), `primaryCategoryId` (FK), `difficultySummary`, `permitRequirements`, `sourceUrl` (NOT NULL), `sourceType`, `lastVerifiedDate`, `confidence` (`HIGH_AUTHORITATIVE | MEDIUM_SECONDARY | LOW_PENDING_FIELD_CHECK`), `unverifiedFieldsJson`, `geopoliticalFlag` (`NONE | TRANSBOUNDARY_DUAL_JURISDICTION | RESTRICTED_BORDER_PERMIT | DISPUTED_OR_MILITARY_NOC_ZONE`), `emergencySarProtocolJson` (SAR agency, phone, heli ceiling, trauma center, nonRescueDisclaimer), `seasonalRiskMatrixJson` (12 months `LOW | MEDIUM | HIGH | EXTREME_CLOSURE`), `verificationStatus` (Default `'PROPOSED'`).
17. `destination_sources`:
    - `sourceId` (PK), `destinationId` (FK $\rightarrow$ `destinations.destinationId`), `authorityName`, `documentTitle`, `sourceUrl`, `sourceType`, `verifiedAt`.
18. `destination_routes` (Strictly Separated from Destinations):
    - `routeId` (PK: `RTE-*`), `destinationId` (FK $\rightarrow$ `destinations.destinationId`), `trailCorridorId` (Nullable), `nameEn`, `nameNe`, `startPointCoords`, `endPointCoords`, `gpxReferenceUri`, `distanceKm`, `elevationGainM`, `elevationLossM`, `technicalGrade`, `hazardsJson`, `acclimatizationProfileJson` (`NF-04`), `routeVersion`, `status` (`PROPOSED | VERIFIED | CLOSED`).
19. `destination_updates`:
    - `updateId` (PK), `destinationId` (FK), `proposedByUserId` (FK), `approvedByDeptUserId` (Nullable FK), `diffJson`, `sourceCitation`, `status`, `createdAt`.
20. `destination_quality_audits` (System #8):
    - `auditId` (PK), `destinationId` (FK), `completenessScore`, `verifiedFieldsCount`, `unverifiedFieldsCount`, `lastAuditedAt`.
21. `safety_advisories` (System #5):
    - `advisoryId` (PK), `destinationId` (FK), `routeId` (Nullable FK), `severity`, `hazardType`, `titleEn`, `titleNe`, `guidanceText`, `officialSourceUrl`, `validFrom`, `validUntil`.
22. `trail_condition_reports` (`NF-02`):
    - `reportId` (PK), `routeId` (FK), `reporterUserId` (FK), `conditionType`, `notes`, `corroborationCount`, `verificationStatus` (`UNCONFIRMED | CORROBORATED | EXPIRED`), `expiresAt`.

### Domain 4: Challenges & Environmental Registry (4 Tables)
23. `challenges`:
    - `challengeId` (PK), `titleEn`, `titleNe`, `challengeType`, `targetMetric`, `safetyRulesJson`, `startAt`, `endAt`, `status`.
24. `challenge_participants`:
    - `id` (PK), `challengeId` (FK), `userId` (FK), `verifiedProgress`, `completedAt`.
25. `environmental_campaigns`:
    - `campaignId` (PK), `destinationId` (FK), `organizerOrgId` (Nullable FK), `title`, `startAt`, `endAt`.
26. `environmental_achievements` (System #11 & `NF-05`):
    - `envAchievementId` (PK), `userId` (FK), `destinationId` (FK), `campaignId` (Nullable FK), `wasteRemovedKg`, `stewardshipHours`, `lntScore` (`0–100`), `receiptEvidenceId` (FK), `verifiedByReviewerId` (FK), `status` (`PENDING | APPROVED | REJECTED`).

### Domain 5: Achievement Applications, Evidence Custody & Witness Engine (8 Tables)
27. `achievement_applications`:
    - `applicationId` (PK), `applicantUserId` (FK $\rightarrow$ `users.id`), `categoryId` (FK), `achievementId` (FK), `destinationId` (FK), `routeId` (FK), `attemptStartDate`, `attemptCompletionDate`, `dateCalendarSystem` (`GREGORIAN_AD | BIKRAM_SAMBAT_BS`), `originalBsDateString` (`FQ-07`), `supplementalOxygenUsed` (bool), `lntSelfScore` (`NF-05`), `applicantDeclarationSigned` (bool), `status` (`DRAFT | SUBMITTED | MORE_EVIDENCE_REQUIRED | IN_REVIEW | ESCALATED_DUAL_SENIOR | UNDER_INVESTIGATION | APPROVED | REJECTED | WITHDRAWN`), `policyVersion`, `submittedAt`.
28. `evidence_files`:
    - `evidenceId` (PK), `applicationId` (FK $\rightarrow$ `achievement_applications.applicationId`), `uploaderUserId` (FK), `evidencePillar` (`PIL_01_VISUAL | PIL_02_TELEMETRY | PIL_03_DOCUMENTARY | PIL_04_WITNESS | PIL_05_CHRONOLOGY`), `fileType` (`PHOTO | VIDEO | GPX | PERMIT_PDF | LOGBOOK`), `storageUri`, `sizeBytes`, `exifSummaryJson` (Nullable — missing EXIF allowed), `gpxDemRmseMeters` (Nullable numeric — Amendment A4), `rawBinaryDeletedPostApproval` (bool — System #17), `uploadedAt`.
29. `evidence_hashes` (**Immutable Append-Only**):
    - `hashRecordId` (PK), `evidenceId` (FK $\rightarrow$ `evidence_files.evidenceId`), `sha256Hex` (CHAR(64) NOT NULL), `pHash64Hex` (CHAR(16) Nullable — Amendment A4), `pHashMirror64Hex` (CHAR(16) Nullable), `dHash64Hex` (CHAR(16) Nullable), `computedAt`.
30. `evidence_access_logs` (**Immutable Append-Only**):
    - `accessLogId` (PK), `evidenceId` (FK), `actorUserId` (FK), `actorRole`, `actionType` (`UPLOAD | HASH_VERIFY | REVIEWER_VIEW | APPEAL_VIEW | POST_APPROVAL_RAW_PURGE`), `sha256VerifiedMatch` (bool), `timestamp`.
31. `evidence_confidence_assessments` (System #1 & Amendment A3):
    - `assessmentId` (PK), `applicationId` (FK), `pil01VisualScore` (`0–40`), `pil02TelemetryScore` (`0–35`), `pil03DocumentaryScore` (`0–35`), `pil04WitnessScore` (`0–30`), `pil05ChronologyScore` (`0–20`), `totalConfidenceScore` (`0–160`), `requiredThreshold` (default `75`), `isGpsOnlyBlocked` (bool), `pathwayClassification` (`STANDARD_MULTIMODAL | ALT_NO_GPS_DOCUMENTARY_WITNESS | BLOCKED_INSUFFICIENT | SENIOR_OVERRIDE`), `computedAt`.
32. `ecf_override_audit_logs` (**Immutable Append-Only** — Amendment A3):
    - `overrideId` (PK), `applicationId` (FK), `computedEcfScore`, `requiredThreshold`, `missingPillarReason`, `compensatingEvidenceSummary`, `primarySeniorReviewerId` (FK), `coSigningSeniorReviewerId` (FK), `verificationLeadApprovalId` (FK), `prevAuditHash`, `overrideEventHash`, `timestamp`.
33. `witness_attestations` (System #2):
    - `attestationId` (PK), `applicationId` (FK), `applicantUserId` (FK), `witnessUserId` (Nullable FK), `witnessLicenseOrIdRef`, `relationshipType` (`LICENSED_GUIDE | ROPE_PARTNER | INDEPENDENT_BYSTANDER | HERITAGE_GUARDIAN`), `coiAndPerjurySigned` (bool), `verificationTokenHash`, `ipDeviceDistinctFromApplicant` (bool), `status` (`INVITED | CONFIRMED | FLAGGED_RING | REJECTED`), `attestedAt`.
34. `offline_sync_receipts` (System #20):
    - `syncId` (PK), `userId` (FK), `clientDraftId`, `serverApplicationId` (FK), `syncedAt`.

### Domain 6: Human Verification, Anti-Fraud & Independent Appeals (8 Tables)
35. `reviewer_accreditations` (System #7 & `NF-01`):
    - `accreditationId` (PK), `reviewerUserId` (FK $\rightarrow$ `users.id`), `reviewerTier` (`L1 | L2 | L3 | L4 | HERITAGE_GUARDIAN`), `qualifiedCategoryIdsJson`, `qualifiedSacredDestinationIdsJson`, `calibrationAccuracyScore` (`0–100`), `lastAssessedAt`, `expiresAt`, `status` (`ACTIVE | SUSPENDED_CALIBRATION | EXPIRED`).
36. `calibration_tests`:
    - `testId` (PK), `reviewerUserId` (FK), `seedCaseId`, `expectedOutcome`, `reviewerSubmittedOutcome`, `passed` (bool), `completedAt`.
37. `verification_cases`:
    - `caseId` (PK), `applicationId` (Unique FK $\rightarrow$ `achievement_applications.applicationId`), `requiredReviewerTier`, `requiresDualSenior` (bool), `requiresHeritageGuardian` (bool), `assignedReviewerIdsJson`, `approvedSeniorCount` (int), `heritageGuardianApproved` (Nullable bool), `fraudInvestigationPriorityScore` (`0–100`), `status`, `createdAt`, `resolvedAt`.
38. `verification_assignments`:
    - `assignmentId` (PK), `caseId` (FK $\rightarrow$ `verification_cases.caseId`), `reviewerUserId` (FK), `reviewerSlot` (`PRIMARY | SECOND_SENIOR | HERITAGE_GUARDIAN | LEAD_ESCALATION`), `coiCheckPassed` (bool), `coiDeclarationSignedAt`, `assignedAt`.
39. `reviewer_decisions`:
    - `decisionId` (PK), `caseId` (FK), `reviewerUserId` (FK), `decision` (`APPROVE | REJECT | REQUEST_MORE_EVIDENCE | ESCALATE_FRAUD`), `documentedReasons`, `policyVersion`, `decidedAt`.
40. `fraud_investigations` (Amendment A4):
    - `investigationId` (PK), `applicationId` (FK), `demRmseValue`, `maxAscentRateObserved`, `westPhysiologicalLimit`, `minPHashHammingDistance`, `matchedEvidenceId` (Nullable FK), `forensicFlagsJson`, `priorityScore` (`0–100`), `investigatorReviewerId` (Nullable FK), `resolutionOutcome`, `createdAt`.
41. `appeal_cases`:
    - `appealId` (PK), `applicationId` (FK), `originalCaseId` (FK $\rightarrow$ `verification_cases.caseId`), `appellantUserId` (FK), `excludedReviewerIdsJson` (NOT NULL — lists all original reviewers), `appealGrounds`, `newEvidenceIdsJson`, `status` (`OPEN | IN_APPEAL_REVIEW | UPHELD_APPROVED | DISMISSED_REJECTED`), `filedAt`, `decidedAt`.
42. `appeal_assignments`:
    - `appealAssignmentId` (PK), `appealId` (FK $\rightarrow$ `appeal_cases.appealId`), `appealReviewerUserId` (FK), `verifiedNotInExcludedList` (bool), `coiCheckPassed` (bool), `decision`, `reasonedOutcome`, `policyVersion`, `decidedAt`.

### Domain 7: Badges, Certificates, Integrity Registry & Leaderboards (7 Tables)
43. `badges`:
    - `badgeId` (PK), `destinationId` (Nullable FK), `achievementId` (FK), `nameEn`, `nameNe`, `shieldDesignSpecJson` (`#0A0A0A` black, `#C9A86A` gold, 3D relief), `isFreeStandard` (bool, default `true`).
44. `credential_registry` (**Hash-Chained Authoritative Ledger** — System #3):
    - `credentialId` (PK: `0TO8848-CRED-YYYY-XXXXXX`), `subjectUserId` (NOT NULL FK — **Immutable Non-Transferable**), `applicationId` (Unique FK), `verificationCaseId` (FK), `achievementId` (FK), `destinationId` (FK), `routeId` (FK), `badgeId` (FK), `completionDate`, `issuedAt`, `issuingAuthority` (`"0 TO 8848 Verification Department"`), `status` (`VALID | REVOKED | SUSPENDED_INVESTIGATION | CORRECTED`), `previousEventHash` (CHAR(64)), `currentCredentialHash` (CHAR(64)), `policyVersion`.
45. `credential_lifecycle_events` (**Immutable Append-Only**):
    - `eventId` (PK), `credentialId` (FK $\rightarrow$ `credential_registry.credentialId`), `eventType` (`ISSUED | CORRECTED | SUSPENDED | REINSTATED | REVOKED`), `reason`, `authorizedByQuorumOrCaseId`, `prevHash`, `eventHash`, `occurredAt`.
46. `certificates`:
    - `certificateId` (PK), `credentialId` (Unique FK $\rightarrow$ `credential_registry.credentialId`), `qrVerificationUrl`, `ed25519Signature`, `pdfTemplateVersion`, `issuedAt`.
47. `public_credentials` (**Zero-PII Sanitized Projection Table**):
    - `credentialId` (PK, FK), `publicDisplayName` (respecting user consent), `achievementTitleEn`, `achievementTitleNe`, `destinationNameEn`, `destinationNameNe`, `routeNameEn`, `elevationMeters`, `completionDate`, `issuedAt`, `status`, `revocationNotice` (Nullable), `currentCredentialHash`, `replay3dOptIn` (bool — `NF-03`).
    - *Security Constraint:* Contains **zero** raw GPX coordinates, passport numbers, or private contact fields.
48. `portable_credential_exports` (System #10):
    - `exportId` (PK), `credentialId` (FK), `format` (`W3C_VC_JSONLD | OPENBADGES_V3`), `detachedSignature`, `exportedAt`.
49. `leaderboard_snapshots`:
    - `snapshotId` (PK), `boardScope` (`GLOBAL | COUNTRY | REGION | DESTINATION | CATEGORY | ANNUAL`), `scopeKey`, `userId` (FK), `verifiedCredentialsCount`, `totalScore`, `algorithmVersion`, `computedAt`.

### Domain 8: Marketplace, Guides & Organizations (11 Tables)
50. `guide_profiles`:
    - `guideId` (PK), `userId` (Unique FK), `companyOrgId` (Nullable FK), `licenseNumber`, `licensingBody` (`NMA | IFMGA | DoT_NP | TANAPA | KWS | ASEGUIM`), `verificationStatus` (`UNVERIFIED | VERIFIED | SUSPENDED`), `languagesJson`, `serviceRegionsJson`, `lntEndorsed` (bool).
51. `guide_qualifications`:
    - `qualificationId` (PK), `guideId` (FK), `certificateTitle`, `issuingAuthority`, `documentVaultUri`, `verifiedByStaffId` (Nullable FK), `expiresAt`.
52. `guide_insurance_records`:
    - `insuranceId` (PK), `guideId` (FK), `providerName`, `policyNumberHash`, `coverageMaxAltitudeM`, `validUntil`, `verifiedStatus`.
53. `marketplace_listings`:
    - `listingId` (PK), `guideOrOrgId` (FK), `destinationId` (FK), `routeId` (FK), `title`, `durationDays`, `priceDisplayUsd`, `maxClientRatio`, `cancellationPolicy`, `status`.
54. `booking_requests`:
    - `bookingRequestId` (PK), `listingId` (FK), `adventurerUserId` (FK), `guideUserId` (FK), `requestedDates`, `status` (`INQUIRY_ONLY_PAYMENTS_LOCKED | ACCEPTED | CANCELLED`), `createdAt`.
55. `bookings`:
    - `bookingId` (PK), `bookingRequestId` (FK), `commissionRateDisclosed`, `paymentExecutionLocked` (bool, default `true`), `status`.
56. `reviews`:
    - `reviewId` (PK), `bookingId` (FK), `authorUserId` (FK), `safetyRating` (`1–5`), `ethicsLntRating` (`1–5`), `comment`, `createdAt`.
57. `complaints`:
    - `complaintId` (PK), `targetEntityType`, `targetEntityId`, `reporterUserId` (FK), `severity`, `description`, `status`.
58. `disputes`:
    - `disputeId` (PK), `bookingId` (FK), `reason`, `resolutionNotes`, `resolvedByStaffId` (Nullable FK), `status`.
59. `organizations`:
    - `orgId` (PK), `orgType` (`GUIDE_COMPANY | TOUR_OPERATOR | ALPINE_CLUB | FEDERATION | DESTINATION_PARTNER | NGO`), `legalName`, `registrationJurisdiction`, `verificationStatus`, `createdAt`.
60. `organization_members`:
    - `membershipId` (PK), `orgId` (FK $\rightarrow$ `organizations.orgId`), `userId` (FK $\rightarrow$ `users.id`), `orgRole` (`MEMBER | ADMIN | EXPEDITION_LEADER`), `joinedAt`.

### Domain 9: Commercial, Sponsorship & Financial Governance (8 Tables — Strictly Airgapped from Domain 6 & 7)
61. `sponsors`:
    - `sponsorId` (PK), `legalEntityName`, `identityVerified` (bool), `contactEmail`, `status`.
62. `sponsor_campaigns`:
    - `campaignId` (PK), `sponsorId` (FK), `title`, `MandatorySponsoredLabel` (Literal `'SPONSORED'`), `prohibitedCategoryCheckPassed` (bool), `startAt`, `endAt`, `status`.
63. `advertisements`:
    - `adId` (PK), `campaignId` (FK), `placementZone` (`PUBLIC_DESTINATION_SIDEBAR | COMMUNITY_FEED` — **Never allowed on Verification/Certificate views**), `disclosureLabel`, `status`.
64. `subscriptions`:
    - `subscriptionId` (PK), `userIdOrOrgId`, `planTier` (`FREE_STANDARD | PRO_CONVENIENCE_LOCKED | ORG_SAAS_LOCKED`), `verificationPriorityMultiplier` (Constant `1.0` — zero influence), `status`.
65. `invoices`:
    - `invoiceId` (PK), `accountId`, `amountUsd`, `taxAmountUsd`, `status` (`DRAFT_LOCKED`).
66. `payment_records`:
    - `paymentId` (PK), `invoiceId` (FK), `gatewayStatus` (`DISABLED_BY_CONSTITUTION`), `createdAt`.
67. `refunds`:
    - `refundId` (PK), `paymentId` (FK), `amountUsd`, `reason`, `status`.
68. `financial_reconciliations`:
    - `reconciliationId` (PK), `periodKey`, `debitTotalUsd`, `creditTotalUsd`, `isBalanced` (bool), `auditedByUserId` (FK), `createdAt`.

### Domain 10: Governance, Whistleblower, Audit, Federation & System Operations (12 Numbered Schema Groups / 18 Physical Tables — Total 80 Numbered Schema Groups / 86 Physical Tables, Exceeding 72-Table Baseline)
69. `governance_proposals` (System #14):
    - `proposalId` (PK), `actionType`, `proposedByUserId` (FK), `coSignedByUserIdsJson`, `quorumMet` (bool), `timelockExpiresAt` (+72h), `executedAt`, `status`.
70. `continuity_policies` (System #14):
    - `policyId` (PK), `founderLastHeartbeatAt`, `inactivityThresholdDays`, `designatedQuorumRolesJson`.
71. `whistleblower_reports` (System #4 — Zero-IP Isolated Vault):
    - `reportId` (PK), `receiptCodeHash` (Unique), `category`, `encryptedNarrative`, `assignedInternalAuditorId` (Nullable FK), `status`, `createdAt` *(Zero IP or User-Agent columns)*.
72. `transparency_reports` (System #6):
    - `reportId` (PK), `periodKey`, `applicationsReviewedCount`, `approvedCount`, `rejectedCount`, `appealsUpheldCount`, `revocationsCount`, `generatedAt`.
73. `federation_clients` (System #9):
    - `clientId` (PK), `orgId` (FK), `apiKeyHash`, `allowedScopesJson` (Read-only `["credential:read"]`), `status`.
74. `user_federation_consents`:
    - `consentId` (PK), `userId` (FK), `orgId` (FK), `grantedAt`, `revokedAt`.
75. `community_posts`:
    - `postId` (PK), `authorUserId` (FK), `postType` (`STORY | EXPEDITION_REPORT | SAFETY_NOTICE`), `content`, `moderationStatus`, `createdAt`.
76. `moderation_cases`:
    - `modCaseId` (PK), `targetType`, `targetId`, `reason`, `moderatorUserId` (FK), `actionTaken`, `createdAt`.
77. `historical_recognitions` (Legends & Memorial — Section 25):
    - `legendId` (PK), `honoreeNameEn`, `honoreeNameNe`, `achievementSummary`, `historicalDate`, `authoritativeSourcesJson`, `familyRepresentativeConsentNotes`, `approvedByEditorialPanel` (bool), `excludedFromCompetitiveLeaderboards` (Constant `true`).
78. `audit_logs` (**Immutable Hash-Chained System Audit**):
    - `auditId` (PK), `actorUserId`, `actorRole`, `departmentId`, `action`, `targetEntityType`, `targetEntityId`, `metadataJson`, `prevAuditHash`, `currentAuditHash`, `timestamp`.
79. `security_incidents` & `security_events` (System #15):
    - `incidentId` (PK), `severity` (`SEV_1 | SEV_2 | SEV_3 | SEV_4`), `category`, `containmentAction`, `regulatoryNoticeRequired` (bool), `status`, `detectedAt`, `resolvedAt`.
80. `system_settings`, `policy_versions`, `translation_strings`, `aggregated_daily_metrics`, `backup_verification_logs`, `ai_audit_logs`:
    - Authoritative configuration and operational tables enforcing `PAYMENTS_ENABLED = false`, `BLOCKCHAIN_ENABLED = false`, $k \ge 5$ analytics, and human-verified translation statuses.
