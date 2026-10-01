import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { additiveStatements } from './netlify-schema.mjs';

if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL in Netlify, including the Builds scope.');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query("SELECT pg_advisory_xact_lock(hashtext('nativos-academy-schema'))");
  const source = await readFile(new URL('../netlify/migrations/0000_supreme_cable.sql', import.meta.url), 'utf8');
  for (const statement of additiveStatements(source)) await client.query(statement);
  await client.query('COMMIT');
  console.log('Academy database schema is ready. Existing records were preserved.');
} catch (error) {
  await client.query('ROLLBACK');
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
