import { additiveStatements } from './netlify-schema.mjs';

export async function prepareDatabase(client, source) {
  await client.query('BEGIN');
  try {
    await client.query("SELECT pg_advisory_xact_lock(hashtext('nativos-academy-schema'))");
    await client.query('CREATE TABLE IF NOT EXISTS academy_schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    const applied = await client.query("SELECT version FROM academy_schema_migrations WHERE version = '0000'");
    if (!applied.rows.length) {
      for (const sql of additiveStatements(source)) await client.query(sql);
      await client.query("INSERT INTO academy_schema_migrations (version) VALUES ('0000')");
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}
