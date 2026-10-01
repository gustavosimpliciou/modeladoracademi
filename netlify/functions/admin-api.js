import { json, handleOptions } from './_utils.js';

// Keep database initialization inside the handler so configuration errors
// produce a useful response instead of crashing the Netlify cold start.
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  let databaseUrl;
  try {
    databaseUrl = new URL(process.env.DATABASE_URL || '');
  } catch {
    return databaseConfigurationError();
  }
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) || !databaseUrl.hostname) {
    return databaseConfigurationError();
  }
  try {
    const api = await import('./_admin-api.js');
    return await api.handler(event);
  } catch {
    console.error('Admin API initialization failed. Check server configuration in Netlify Functions.');
    return json({ error: 'Não foi possível iniciar a API administrativa. Consulte os logs da função no Netlify.' }, 503);
  }
};

function databaseConfigurationError() {
  return json({
    code: 'DATABASE_CONFIGURATION_INVALID',
    error: 'DATABASE_URL inválida no Netlify. Use a conexão PostgreSQL do Supabase (Connect → Session pooler), começando com postgresql://, nas variáveis Functions. A URL https:// do projeto não é uma conexão PostgreSQL.',
  }, 503);
}
