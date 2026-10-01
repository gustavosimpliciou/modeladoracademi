import type { PoolConfig } from 'pg';

export function getConnectionOptions(connectionString: string, timeout = 10000): PoolConfig {
  const url = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('DATABASE_URL must be a PostgreSQL connection string');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  const urlControlsTls = ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].some(key => url.searchParams.has(key));
  return {
    connectionString,
    connectionTimeoutMillis: timeout,
    idleTimeoutMillis: 10000,
    max: 3,
    ...(urlControlsTls ? {} : { ssl: local ? false : { rejectUnauthorized: true, ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT } : {}) } }),
  };
}
