import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { additiveStatements } from './netlify-schema.mjs';
import { PGlite } from '@electric-sql/pglite';

await mkdir('work', { recursive: true });
const database = new PGlite();
const source = await readFile('netlify/migrations/0000_supreme_cable.sql', 'utf8');
// Upgrade a populated historical course table, then repeat the migration.
await database.exec(`CREATE TABLE academy_courses (id text PRIMARY KEY, title text NOT NULL); INSERT INTO academy_courses VALUES ('legacy', 'Curso existente');`);
for (let pass = 0; pass < 2; pass++) for (const sql of additiveStatements(source)) await database.exec(sql);
assert.equal((await database.query('SELECT title FROM academy_courses WHERE id = $1', ['legacy'])).rows[0].title, 'Curso existente');
await database.exec(`DELETE FROM academy_courses WHERE id = 'legacy'`);
globalThis.__academyTestDb = database;
process.env.CLERK_SECRET_KEY = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/academy';
process.env.ADMIN_EMAIL = 'nativos3d.adm@gmail.com';
process.env.URL = 'https://academy.example';
await build({
  stdin: { contents: `export { handler as admin } from './netlify/functions/admin-api.js'; export { handler as webhook } from './netlify/functions/clerk-webhook.js';`, resolveDir: process.cwd() },
  outfile: 'work/netlify-test-bundle.mjs', bundle: true, format: 'esm', platform: 'node', loader: { '.sql': 'text' }, external: ['drizzle-orm', 'drizzle-orm/*', '@clerk/backend/webhooks'],
  plugins: [{ name: 'test-boundaries', setup(builder) {
    builder.onResolve({ filter: /^@workspace\/db(?:\/schema)?$/ }, () => ({ path: 'database', namespace: 'test' }));
    builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: `import { drizzle } from 'drizzle-orm/pglite'; import * as schema from './lib/db/src/schema/index.ts'; export * from './lib/db/src/schema/index.ts'; export const db = drizzle(globalThis.__academyTestDb, { schema }); export const pool = { async connect() { if (globalThis.__academyTestOffline) throw new Error("Connection timeout"); globalThis.__academyTestConnections = (globalThis.__academyTestConnections || 0) + 1; return { query: (sql, args) => globalThis.__academyTestDb.query(sql, args), release() {} }; } };`, loader: 'ts', resolveDir: process.cwd() }));
    builder.onResolve({ filter: /^@clerk\/backend$/ }, () => ({ path: 'clerk', namespace: 'clerk-test' }));
    builder.onLoad({ filter: /.*/, namespace: 'clerk-test' }, () => ({ contents: `
      export async function verifyToken(token, options) {
        if (!['admin', 'student', 'unverified'].includes(token)) throw new Error('Invalid signature');
        if (!options.authorizedParties.includes('https://academy.example')) throw new Error('Origin not checked');
        return { sub: token === 'unverified' ? 'unverified' : token, sid: 'session-test' };
      }
      export function createClerkClient() { return { users: { async getUser(id) { return { id, firstName: id, primaryEmailAddressId: 'email', emailAddresses: [{ id: 'email', emailAddress: id === 'student' ? 'student@example.com' : 'nativos3d.adm@gmail.com', verification: { status: id === 'unverified' ? 'unverified' : 'verified' } }] }; } } }; }
    ` }));
  } }]
});
const { admin, webhook } = await import('../work/netlify-test-bundle.mjs');
const event = (path, token, method = 'GET', body) => ({ path, httpMethod: method, headers: token ? { authorization: `Bearer ${token}` } : {}, body: body ? JSON.stringify(body) : null });
for (const invalidUrl of ['', 'https://project.supabase.co', 'not-a-url']) {
  process.env.DATABASE_URL = invalidUrl;
  const response = await admin(event('/api/admin/me', 'admin'));
  assert.equal(response.statusCode, 503);
  assert.equal(JSON.parse(response.body).code, 'DATABASE_CONFIGURATION_INVALID');
}
assert.equal((await admin(event('/api/admin/me', undefined, 'OPTIONS'))).statusCode, 200);
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/academy';
assert.equal((await admin(event('/api/admin/me'))).statusCode, 401);
assert.equal((await admin(event('/api/admin/me', 'forged'))).statusCode, 401);
assert.equal((await admin(event('/api/admin/me', 'unverified'))).statusCode, 401);
globalThis.__academyTestOffline = true;
assert.equal((await admin(event('/api/admin/me', 'admin'))).statusCode, 503);
globalThis.__academyTestOffline = false;
assert.equal((await admin(event('/api/admin/me', 'student'))).statusCode, 403);
assert.equal((await admin(event('/api/admin/dashboard', 'student'))).statusCode, 403);
const me = await admin(event('/api/admin/me', 'admin'));
assert.equal(me.statusCode, 200);
assert.deepEqual(JSON.parse(me.body).roles, ['SUPER_ADMIN']);
assert.equal((await admin(event('/.netlify/functions/admin-api/me', 'admin'))).statusCode, 200);
assert.equal((await database.query(`SELECT count(*)::int AS count FROM user_roles WHERE role_id = 'SUPER_ADMIN'`)).rows[0].count, 1);
const created = await admin(event('/api/admin/courses', 'admin', 'POST', { title: 'Curso teste', slug: 'curso-teste', description: 'Teste', category: '3D', level: 'Iniciante', duration: '1h' }));
assert.equal(created.statusCode, 201, created.body);
const courses = await admin(event('/api/admin/courses', 'admin'));
assert.equal(courses.statusCode, 200, courses.body);
assert.equal(JSON.parse(courses.body).courses.length, 1);
assert.equal((await admin(event('/api/admin/dashboard', 'admin'))).statusCode, 200);
const setting = { key: 'brand', value: { platformName: 'Teste' }, type: 'object', category: 'brand', label: 'Marca' };
assert.equal((await admin(event('/api/admin/settings', 'admin', 'PUT', setting))).statusCode, 200);
assert.equal((await admin(event('/api/admin/settings', 'admin', 'PUT', setting))).statusCode, 200);
assert.equal(JSON.parse((await admin(event('/api/admin/settings', 'admin'))).body).settings[0].value.platformName, 'Teste');
assert.equal(globalThis.__academyTestConnections, 1);
assert.equal((await database.query('SELECT count(*)::int AS count FROM academy_schema_migrations')).rows[0].count, 1);
const adminId = JSON.parse(me.body).user.id;
await database.query('UPDATE users SET is_active = false WHERE id = $1', [adminId]);
assert.equal((await admin(event('/api/admin/me', 'admin'))).statusCode, 401);
process.env.CLERK_WEBHOOK_SECRET = 'whsec_dGVzdA==';
assert.equal((await webhook({ httpMethod: 'POST', headers: {}, body: '{"type":"user.created"}' })).statusCode, 400);
await database.close();
console.log('Passed: additive/idempotent schema, preserved records, denied invalid/unverified/ordinary sessions, admin bootstrap, course creation, dashboard, settings, blocked users and unsigned webhook.');
