import { authenticate } from './_auth.js';
import { json } from './_utils.js';
export { PERMISSIONS, ROLES } from '@workspace/db';
export async function getUserFromEvent(event) { return (await authenticate(event))?.user || null; }
export function hasPermission(permissions, permission) { return permissions.includes(permission); }
export function requirePermission(permission) {
  return async event => {
    const auth = await authenticate(event);
    if (!auth) return json({ error: 'Unauthorized' }, 401);
    if (!auth.roles.includes('SUPER_ADMIN') && !auth.permissions.includes(permission)) return json({ error: 'Forbidden' }, 403);
    return auth;
  };
}
export function requireRole(...roles) {
  return async event => {
    const auth = await authenticate(event);
    if (!auth) return json({ error: 'Unauthorized' }, 401);
    if (!roles.some(role => auth.roles.includes(role))) return json({ error: 'Forbidden' }, 403);
    return auth;
  };
}
