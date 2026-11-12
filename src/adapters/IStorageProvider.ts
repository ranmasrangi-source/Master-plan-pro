/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 02: Vendor-Independent Evidence Storage Provider Interface (System #13 & #17)
 */

export interface StoredEvidenceObjectMetadata {
  readonly storageUri: string;
  readonly sha256Hex: string;
  readonly sizeBytes: number;
  readonly mimeType: string;
  readonly storedAtIso: string;
}

/**
 * Abstracts binary object storage (S3 / GCS / R2 / Local Vault)
 * Enforces write-once immutability on original evidence and cryptographic hash verification on read.
 */
export interface IStorageProvider {
  /**
   * Stores an immutable evidence binary and verifies its SHA-256 digest matches expectedSha256Hex.
   */
  putImmutableEvidence(params: {
    readonly evidenceId: string;
    readonly payload: Uint8Array;
    readonly mimeType: string;
    readonly expectedSha256Hex: string;
  }): Promise<StoredEvidenceObjectMetadata>;

  /**
   * Reads an evidence binary and re-verifies its SHA-256 hash against the custody log.
   */
  getVerifiedEvidence(params: {
    readonly storageUri: string;
    readonly expectedSha256Hex: string;
  }): Promise<{ readonly payload: Uint8Array; readonly hashVerified: boolean }>;

  /**
   * System #17: Post-verification raw binary erasure (requested by user after credential approval,
   * provided no fraud legal hold is active), while preserving the SHA-256 hash in the database.
   */
  purgeRawBinaryPostVerification(params: {
    readonly storageUri: string;
    readonly authorizedDeletionRequestId: string;
    readonly legalHoldActive: false;
  }): Promise<{ readonly purgedAtIso: string }>;
}
