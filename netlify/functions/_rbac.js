// Netlify Function RBAC Middleware
import { json, handleOptions, getBody } from "./_utils.js";
import { db } from "@workspace/db";
import { usersTable, rolesTable, userRolesTable, rolePermissionsTable, permissionsTable } from "@workspace/db/schema";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export async function getUserFromEvent(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  
  try {
    const response = await fetch("https://api.clerk.com/v1/me", {
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
      },
    });
    
    if (!response.ok) return null;
    
    const clerkUser = await response.json();
    const clerkId = clerkUser.id;
    
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function getUserPermissions(userId) {
  if (!userId) return [];
  
  const userRoles = await db.select({
    roleId: userRolesTable.roleId,
    roleName: rolesTable.name,
    permissions: rolePermissionsTable.permissionId,
  })
  .from(userRolesTable)
  .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
  .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
  .where(eq(userRolesTable.userId, userId));

  return userRoles.map(r => r.permissions).flat();
}

export function hasPermission(userPermissions, requiredPermission) {
  return userPermissions.includes(requiredPermission);
}

export function requirePermission(requiredPermission) {
  return async (event, context) => {
    const user = await getUserFromEvent(event);
    if (!user) {
      return json({ error: "Unauthorized" }, 401);
    }
    
    const permissions = await getUserPermissions(user.id);
    if (!hasPermission(permissions, requiredPermission)) {
      return json({ error: "Forbidden: Insufficient permissions" }, 403);
    }
    
    return { user, permissions };
  };
}

export function requireRole(...allowedRoles) {
  return async (event, context) => {
    const user = await getUserFromEvent(event);
    if (!user) {
      return json({ error: "Unauthorized" }, 401);
    }
    
    const userRoles = await db.select({
      roleName: rolesTable.name,
    })
    .from(userRolesTable)
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .where(eq(userRolesTable.userId, user.id));

    const roleNames = userRoles.map(r => r.roleName);
    const hasRole = allowedRoles.some(role => roleNames.includes(role));
    
    if (!hasRole) {
      return json({ error: "Forbidden: Role required" }, 403);
    }
    
    return { user, roles: roleNames };
  };
}

function eq(column, value) {
  return { column, value, operator: "=" };
}

export const PERMISSIONS = {
  COURSES_VIEW: "courses.view",
  COURSES_CREATE: "courses.create",
  COURSES_EDIT: "courses.edit",
  COURSES_DELETE: "courses.delete",
  COURSES_PUBLISH: "courses.publish",
  MODULES_MANAGE: "modules.manage",
  LESSONS_MANAGE: "lessons.manage",
  VIDEOS_MANAGE: "videos.manage",
  ACTIVITIES_MANAGE: "activities.manage",
  QUIZZES_MANAGE: "quizzes.manage",
  STUDENTS_VIEW: "students.view",
  STUDENTS_MANAGE: "students.manage",
  CERTIFICATES_MANAGE: "certificates.manage",
  ANALYTICS_VIEW: "analytics.view",
  SETTINGS_MANAGE: "settings.manage",
  USERS_MANAGE: "users.manage",
  LOGS_VIEW: "logs.view",
  MEDIA_MANAGE: "media.manage",
  BANNERS_MANAGE: "banners.manage",
  CATEGORIES_MANAGE: "categories.manage",
  INSTRUCTORS_MANAGE: "instructors.manage",
  NOTIFICATIONS_SEND: "notifications.send",
  ANALYTICS_EXPORT: "analytics.export",
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
};