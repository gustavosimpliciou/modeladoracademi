import { verifyWebhook } from '@clerk/backend/webhooks';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db, usersTable, rolesTable, userRolesTable } from '@workspace/db';
import { json, handleOptions } from './_utils.js';
import { ensureDatabase } from './_database.js';
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const secret = process.env.CLERK_WEBHOOK_SECRET || process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) return json({ error: 'Webhook signing secret is required' }, 503);
  let webhook;
  try {
    const request = new Request('https://localhost/api/clerk/webhook', { method: 'POST', headers: event.headers, body: event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body });
    webhook = await verifyWebhook(request, { signingSecret: secret });
  } catch { return json({ error: 'Invalid webhook signature' }, 400); }
  try {
    const { type, data } = webhook;
    await ensureDatabase();
    if (type === 'user.deleted') {
      await db.update(usersTable).set({ isActive: false, updatedAt: new Date() }).where(eq(usersTable.clerkId, data.id));
    } else if (type === 'user.created' || type === 'user.updated') {
      const email = data.email_addresses?.find(e => e.id === data.primary_email_address_id);
      if (!email) return json({ error: 'Primary email is required' }, 400);
      const isAdmin = email.verification?.status === 'verified' && email.email_address.toLowerCase() === (process.env.ADMIN_EMAIL || 'nativos3d.adm@gmail.com').trim().toLowerCase();
      const roleName = isAdmin ? 'SUPER_ADMIN' : 'STUDENT';
      await db.insert(rolesTable).values({ id: roleName, name: roleName, isSystem: true }).onConflictDoNothing();
      const [role] = await db.select().from(rolesTable).where(eq(rolesTable.name, roleName));
      const values = { email: email.email_address, name: [data.first_name, data.last_name].filter(Boolean).join(' '), firstName: data.first_name, lastName: data.last_name, imageUrl: data.image_url };
      const [user] = await db.insert(usersTable).values({ ...values, id: randomUUID(), clerkId: data.id, roleId: role.id }).onConflictDoUpdate({ target: usersTable.clerkId, set: { ...values, ...(isAdmin ? { roleId: role.id } : {}), updatedAt: new Date() } }).returning();
      await db.insert(userRolesTable).values({ id: randomUUID(), userId: user.id, roleId: role.id }).onConflictDoNothing();
    }
    return json({ success: true });
  } catch (error) {
    console.error('Clerk webhook error', error);
    return json({ error: 'Internal server error' }, 500);
  }
};
