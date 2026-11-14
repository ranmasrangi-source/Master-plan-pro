/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Domain 9 — Commercial, Sponsorship & Financial Governance (Tables #61 to #68)
 * Strictly Airgapped from Domain 6 (Verification) & Domain 7 (Credentials/Leaderboards)
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { adPlacementZoneEnum, subscriptionPlanTierEnum } from './00_enums.ts';
import { users } from './01_identity_rbac_privacy.ts';
import { organizations } from './08_marketplace_guides_orgs.ts';

/**
 * Table #61: sponsors
 */
export const sponsors = pgTable('sponsors', {
  sponsorId: varchar('sponsor_id', { length: 64 }).primaryKey(),
  legalEntityName: varchar('legal_entity_name', { length: 200 }).notNull().unique(),
  identityVerified: boolean('identity_verified').notNull().default(false),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('INACTIVE_LOCKED'),
});

/**
 * Table #62: sponsor_campaigns (System #12 Mandatory 'SPONSORED' disclosure)
 */
export const sponsorCampaigns = pgTable(
  'sponsor_campaigns',
  {
    campaignId: varchar('campaign_id', { length: 64 }).primaryKey(),
    sponsorId: varchar('sponsor_id', { length: 64 })
      .notNull()
      .references(() => sponsors.sponsorId, { onDelete: 'restrict' }),
    title: varchar('title', { length: 200 }).notNull(),
    mandatorySponsoredLabel: varchar('mandatory_sponsored_label', { length: 32 })
      .notNull()
      .default('SPONSORED'),
    prohibitedCategoryCheckPassed: boolean('prohibited_category_check_passed')
      .notNull()
      .default(false),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    status: varchar('status', { length: 32 }).notNull().default('DRAFT'),
  },
  (table) => [
    check(
      'chk_sponsor_campaigns_mandatory_label',
      sql`${table.mandatorySponsoredLabel} = 'SPONSORED'`
    ),
  ]
);

/**
 * Table #63: advertisements (Never allowed on Verification/Certificate views)
 */
export const advertisements = pgTable(
  'advertisements',
  {
    adId: varchar('ad_id', { length: 64 }).primaryKey(),
    campaignId: varchar('campaign_id', { length: 64 })
      .notNull()
      .references(() => sponsorCampaigns.campaignId, { onDelete: 'restrict' }),
    placementZone: adPlacementZoneEnum('placement_zone').notNull(),
    disclosureLabel: varchar('disclosure_label', { length: 32 })
      .notNull()
      .default('SPONSORED'),
    status: varchar('status', { length: 32 }).notNull().default('DRAFT'),
  },
  (table) => [
    check('chk_advertisements_disclosure_label', sql`${table.disclosureLabel} = 'SPONSORED'`),
  ]
);

/**
 * Table #64: subscriptions (Constitutional Lock: verificationPriorityMultiplier = 1.00)
 */
export const subscriptions = pgTable(
  'subscriptions',
  {
    subscriptionId: varchar('subscription_id', { length: 64 }).primaryKey(),
    userIdOrOrgId: varchar('user_id_or_org_id', { length: 64 }).notNull(),
    subscriberUserId: varchar('subscriber_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'restrict',
    }),
    subscriberOrgId: varchar('subscriber_org_id', { length: 64 }).references(
      () => organizations.orgId,
      { onDelete: 'restrict' }
    ),
    planTier: subscriptionPlanTierEnum('plan_tier').notNull().default('FREE_STANDARD'),
    verificationPriorityMultiplier: numeric('verification_priority_multiplier', {
      precision: 4,
      scale: 2,
    })
      .notNull()
      .default('1.00'),
    status: varchar('status', { length: 32 }).notNull().default('FREE_ACTIVE'),
  },
  (table) => [
    check(
      'chk_subscriptions_zero_verification_influence',
      sql`${table.verificationPriorityMultiplier} = 1.00`
    ),
  ]
);

/**
 * Table #65: invoices (Constitutional Lock: status = 'DRAFT_LOCKED')
 */
export const invoices = pgTable(
  'invoices',
  {
    invoiceId: varchar('invoice_id', { length: 64 }).primaryKey(),
    accountId: varchar('account_id', { length: 64 }).notNull(),
    amountUsd: numeric('amount_usd', { precision: 10, scale: 2 }).notNull().default('0.00'),
    taxAmountUsd: numeric('tax_amount_usd', { precision: 10, scale: 2 })
      .notNull()
      .default('0.00'),
    status: varchar('status', { length: 32 }).notNull().default('DRAFT_LOCKED'),
  },
  (table) => [
    check('chk_invoices_locked_by_constitution', sql`${table.status} = 'DRAFT_LOCKED'`),
  ]
);

/**
 * Table #66: payment_records (Constitutional Lock: gatewayStatus = 'DISABLED_BY_CONSTITUTION')
 */
export const paymentRecords = pgTable(
  'payment_records',
  {
    paymentId: varchar('payment_id', { length: 64 }).primaryKey(),
    invoiceId: varchar('invoice_id', { length: 64 })
      .notNull()
      .references(() => invoices.invoiceId, { onDelete: 'restrict' }),
    gatewayStatus: varchar('gateway_status', { length: 48 })
      .notNull()
      .default('DISABLED_BY_CONSTITUTION'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_payment_records_disabled_by_constitution',
      sql`${table.gatewayStatus} = 'DISABLED_BY_CONSTITUTION'`
    ),
  ]
);

/**
 * Table #67: refunds
 */
export const refunds = pgTable('refunds', {
  refundId: varchar('refund_id', { length: 64 }).primaryKey(),
  paymentId: varchar('payment_id', { length: 64 })
    .notNull()
    .references(() => paymentRecords.paymentId, { onDelete: 'restrict' }),
  amountUsd: numeric('amount_usd', { precision: 10, scale: 2 }).notNull().default('0.00'),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('DISABLED_BY_CONSTITUTION'),
});

/**
 * Table #68: financial_reconciliations (Double-entry balanced ledger check)
 */
export const financialReconciliations = pgTable(
  'financial_reconciliations',
  {
    reconciliationId: varchar('reconciliation_id', { length: 64 }).primaryKey(),
    periodKey: varchar('period_key', { length: 32 }).notNull().unique(),
    debitTotalUsd: numeric('debit_total_usd', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    creditTotalUsd: numeric('credit_total_usd', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    isBalanced: boolean('is_balanced').notNull().default(true),
    auditedByUserId: varchar('audited_by_user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'chk_financial_reconciliations_double_entry_balance',
      sql`${table.debitTotalUsd} = ${table.creditTotalUsd} AND ${table.isBalanced} = TRUE`
    ),
  ]
);
