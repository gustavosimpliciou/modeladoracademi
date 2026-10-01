import { pool } from '@workspace/db';
import source from '../migrations/0000_supreme_cable.sql';
import { prepareDatabase } from '../../scripts/prepare-database.mjs';

let ready;
export function ensureDatabase() {
  if (!ready) ready = initialize().catch(error => { ready = undefined; throw error; });
  return ready;
}
async function initialize() {
  let client;
  try {
    client = await pool.connect();
    await prepareDatabase(client, source);
  } catch (cause) {
    console.error('Academy database initialization failed:', cause.message);
    const error = new Error('Banco indisponível. Verifique a conexão externa DATABASE_URL nas variáveis Functions do Netlify.');
    error.code = 'DATABASE_UNAVAILABLE';
    throw error;
  } finally { client?.release(); }
}
