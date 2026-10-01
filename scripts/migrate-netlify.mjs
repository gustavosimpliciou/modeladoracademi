import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { getConnectionOptions } from '../lib/db/src/connection.ts';
import { prepareDatabase } from './prepare-database.mjs';
let pool;
let client;
try {
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL before running the migration.');
  pool = new pg.Pool(getConnectionOptions(process.env.DATABASE_URL, 30000));
  client = await pool.connect();
  const source = await readFile(new URL('../netlify/migrations/0000_supreme_cable.sql', import.meta.url), 'utf8');
  await prepareDatabase(client, source);
  console.log('Academy database schema is ready. Existing records were preserved.');
} catch (error) {
  console.error('Database setup failed:', error.code || 'connection/schema failure');
  console.error('Check the external PostgreSQL connection, SSL and network restrictions. For Supabase, use the Session pooler URL from Connect.');
  process.exitCode = 1;
} finally {
  client?.release();
  await pool?.end();
}
