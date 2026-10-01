import { createClerkClient, verifyToken } from "@clerk/backend";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, usersTable, rolesTable, userRolesTable, rolePermissionsTable, permissionsTable } from "@workspace/db";

export async function authenticate(event) {
  if (!process.env.CLERK_SECRET_KEY) throw new Error("CLERK_SECRET_KEY is required");
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const bearer = headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  const cookie = headers.cookie?.split(";").map(v => v.trim()).find(v => v.startsWith("__session="))?.slice(10);
  const token = bearer || cookie;
  if (!token) return null;
  const origins = [process.env.URL, process.env.DEPLOY_PRIME_URL, ...(process.env.CLERK_AUTHORIZED_PARTIES || "").split(",")].filter(Boolean);
  let claims;
  try {
    claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY, ...(origins.length ? { authorizedParties: origins } : {}) });
  } catch { return null; }
  if (!claims.sub || !claims.sid) return null;
  const clerkUser = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(claims.sub);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId);
  if (!email || email.verification?.status !== "verified") return null;
  const adminEmail = (process.env.ADMIN_EMAIL || "nativos3d.adm@gmail.com").trim().toLowerCase();
  const isBootstrapAdmin = email.emailAddress.toLowerCase() === adminEmail;
  const roleName = isBootstrapAdmin ? "SUPER_ADMIN" : "STUDENT";
  await db.insert(rolesTable).values({ id: roleName, name: roleName, isSystem: true }).onConflictDoNothing();
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.name, roleName));
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, claims.sub));
  if (existing && !existing.isActive) return null;
  const values = { clerkId: claims.sub, email: email.emailAddress, name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" "), firstName: clerkUser.firstName, lastName: clerkUser.lastName, imageUrl: clerkUser.imageUrl };
  const [user] = await db.insert(usersTable).values({ ...values, id: randomUUID(), roleId: role.id }).onConflictDoUpdate({ target: usersTable.clerkId, set: { ...values, ...(isBootstrapAdmin ? { roleId: role.id } : {}), updatedAt: new Date() } }).returning();
  if (isBootstrapAdmin || !existing) await db.insert(userRolesTable).values({ id: randomUUID(), userId: user.id, roleId: role.id }).onConflictDoNothing();
  const assigned = await db.select({ name: rolesTable.name }).from(userRolesTable).innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id)).where(eq(userRolesTable.userId, user.id));
  const grants = await db.select({ name: permissionsTable.name }).from(userRolesTable).innerJoin(rolePermissionsTable, eq(userRolesTable.roleId, rolePermissionsTable.roleId)).innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id)).where(eq(userRolesTable.userId, user.id));
  return { user, roles: [...new Set(assigned.map(r => r.name))], permissions: [...new Set(grants.map(p => p.name))] };
}
