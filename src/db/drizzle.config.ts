/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 05: Drizzle Kit Configuration (PostgreSQL Dialect)
 */

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const sqlHost = process.env.SQL_HOST || '127.0.0.1';
const sqlDbName = process.env.SQL_DB_NAME || 'zero_to_8848';
const user = process.env.SQL_ADMIN_USER || 'postgres';
const password = process.env.SQL_ADMIN_PASSWORD || '';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: false,
  },
  verbose: true,
});
