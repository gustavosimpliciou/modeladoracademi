import { json, handleOptions, getBody } from "./_utils.js";
import { db } from "@workspace/db";
import { usersTable, rolesTable } from "@workspace/db/schema";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export default async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = getBody(event);
    const { type, data } = body;

    const email = data?.email_addresses?.[0]?.email_address;
    const clerkId = data?.id;
    const firstName = data?.first_name;
    const lastName = data?.last_name;
    const imageUrl = data?.image_url;

    if (!email || !clerkId) {
      return json({ error: "Missing required fields" }, 400);
    }

    const name = [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0];

    let roleId = null;
    const [defaultRole] = await db.select().from(rolesTable).where(eq(rolesTable.name, "STUDENT")).limit(1);
    if (defaultRole) roleId = defaultRole.id;

    if (email === "nativos3d.adm@gmail.com") {
      const [superAdminRole] = await db.select().from(rolesTable).where(eq(rolesTable.name, "SUPER_ADMIN")).limit(1);
      if (superAdminRole) roleId = superAdminRole.id;
    }

    switch (type) {
      case "user.created":
      case "user.updated": {
        await db.insert(usersTable).values({
          clerkId,
          email,
          name,
          firstName,
          lastName,
          imageUrl,
          roleId,
          isActive: true,
        }).onConflictDoUpdate({
          target: usersTable.clerkId,
          set: {
            email,
            name,
            firstName,
            lastName,
            imageUrl,
            roleId,
            updatedAt: new Date(),
          },
        });
        break;
      }
      case "user.deleted": {
        await db.delete(usersTable).where(eq(usersTable.clerkId, clerkId));
        break;
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return json({ error: "Internal server error" }, 500);
  }
};

function eq(column, value) {
  return { column, value, operator: "=" };
}