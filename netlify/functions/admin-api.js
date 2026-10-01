import { authenticate } from './_auth.js';
import { randomUUID } from 'node:crypto';
import { json, handleOptions, getQuery, getBody } from "./_utils.js";
import { db } from "@workspace/db";
import { 
  academyCoursesTable, academyModulesTable, academyLessonsTable,
  quizzesTable, questionsTable, questionBankTable, quizAttemptsTable,
  certificatesTable, certificateTemplatesTable,
  mediaTable, mediaFoldersTable,
  assignmentsTable, assignmentSubmissionsTable,
  bannersTable, categoriesTable, instructorsTable, instructorCoursesTable,
  notificationsTable, notificationTemplatesTable, announcementsTable,
  courseAnalyticsTable, lessonAnalyticsTable, userActivityTable, quizAnalyticsTable,
  adminLogsTable, systemLogsTable,
  settingsTable, brandSettingsTable, homePageSectionsTable,
  enrollmentsTable, moduleProgressTable, lessonProgressTable,
  usersTable, rolesTable, userRolesTable, rolePermissionsTable, permissionsTable,
  activitySubmissionsTable, academyActivitiesTable, academyActivityEventsTable
} from "@workspace/db/schema";
import { eq, and, or, desc, asc, sql, count, avg, sum, gte, lte } from "drizzle-orm";

const SUPER_ADMIN_EMAIL = "nativos3d.adm@gmail.com";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  
  const path = event.path.replace(/^\/(?:\.netlify\/functions\/admin-api|api\/admin)/, "");
  const method = event.httpMethod;
  const query = event.queryStringParameters || {};

  
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const auth = await authenticate(event);
    if (!auth) return json({ error: "Sessão inválida. Entre novamente." }, 401);
    const { user, roles: roleNames, permissions } = auth;
    const isSuperAdmin = roleNames.includes("SUPER_ADMIN");
    const hasPerm = (perm) => isSuperAdmin || permissions.includes(perm);
    if (path === "/me" && method === "GET") {
      if (!roleNames.some(r => ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"].includes(r))) return json({ error: "Acesso restrito à administração." }, 403);
      return json({ user: { id: user.id, name: user.name, email: user.email }, roles: roleNames, permissions });
    }
    // Log admin action
    const logAction = async (action, resourceType, resourceId, oldValues, newValues) => {
      await db.insert(adminLogsTable).values({
        id: randomUUID(),
        userId: user.id,
        action,
        resourceType,
        resourceId,
        oldValues,
        newValues,
        ipAddress: event.headers?.["x-forwarded-for"] || event.headers?.["x-real-ip"],
        userAgent: event.headers?.["user-agent"],
      });
    };
    
    // ============ DASHBOARD ============
    if (path === "/dashboard" && method === "GET") {
      if (!hasPerm("analytics.view")) return json({ error: "Forbidden" }, 403);
      
      const [
        totalStudents,
        activeStudents,
        publishedCourses,
        draftCourses,
        totalModules,
        totalLessons,
        pendingActivities,
        completedQuizzes,
        issuedCertificates,
        recentUsers,
        topCourses,
        recentActivity,
      ] = await Promise.all([
        db.select({ count: count() }).from(usersTable).where(eq(usersTable.roleId, "STUDENT")),
        db.select({ count: count() }).from(enrollmentsTable).where(eq(enrollmentsTable.status, "active")),
        db.select({ count: count() }).from(academyCoursesTable).where(eq(academyCoursesTable.status, "published")),
        db.select({ count: count() }).from(academyCoursesTable).where(eq(academyCoursesTable.status, "draft")),
        db.select({ count: count() }).from(academyModulesTable),
        db.select({ count: count() }).from(academyLessonsTable),
        db.select({ count: count() }).from(assignmentSubmissionsTable).where(eq(assignmentSubmissionsTable.status, "submitted")),
        db.select({ count: count() }).from(quizAttemptsTable).where(eq(quizAttemptsTable.status, "completed")),
        db.select({ count: count() }).from(certificatesTable),
        db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(5),
        db.select({
          id: academyCoursesTable.id,
          title: academyCoursesTable.title,
          enrolledCount: count(enrollmentsTable.id),
        })
        .from(academyCoursesTable)
        .leftJoin(enrollmentsTable, eq(academyCoursesTable.id, enrollmentsTable.courseId))
        .groupBy(academyCoursesTable.id)
        .orderBy(desc(count(enrollmentsTable.id)))
        .limit(5),
        db.select().from(userActivityTable).orderBy(desc(userActivityTable.createdAt)).limit(10),
      ]);
      
      return json({
        stats: {
          totalStudents: totalStudents[0]?.count || 0,
          activeStudents: activeStudents[0]?.count || 0,
          publishedCourses: publishedCourses[0]?.count || 0,
          draftCourses: draftCourses[0]?.count || 0,
          totalModules: totalModules[0]?.count || 0,
          totalLessons: totalLessons[0]?.count || 0,
          pendingActivities: pendingActivities[0]?.count || 0,
          completedQuizzes: completedQuizzes[0]?.count || 0,
          issuedCertificates: issuedCertificates[0]?.count || 0,
        },
        recentUsers,
        topCourses,
        recentActivity,
      });
    }
    
    // ============ COURSES ============
    if (path === "/courses" && method === "GET") {
      if (!hasPerm("courses.view")) return json({ error: "Forbidden" }, 403);
      
      const { status, category, search, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (status) conditions.push(eq(academyCoursesTable.status, status));
      if (category) conditions.push(eq(academyCoursesTable.category, category));
      if (search) conditions.push(
        or(
          sql`${academyCoursesTable.title} ILIKE ${'%' + search + '%'}`,
          sql`${academyCoursesTable.description} ILIKE ${'%' + search + '%'}`
        )
      );
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [courses, total] = await Promise.all([
        db.select().from(academyCoursesTable)
          .where(whereClause)
          .orderBy(desc(academyCoursesTable.createdAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(academyCoursesTable).where(whereClause),
      ]);
      
      return json({ courses, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    if (path === "/courses" && method === "POST") {
      if (!hasPerm("courses.create")) return json({ error: "Forbidden" }, 403);
      
      const { title, slug, description, category, level, duration, thumbnail, coverImage, bannerImage, instructor, instructorRole, objectives, requirements, settings, visibility } = body;
      
      const id = `course-${Date.now()}`;
      await db.insert(academyCoursesTable).values({
        id,
        title,
        slug,
        description,
        category,
        level,
        duration,
        thumbnail,
        coverImage,
        bannerImage,
        instructor,
        instructorRole,
        objectives: objectives || [],
        requirements: requirements || [],
        settings: settings || {},
        visibility: visibility || "enrolled_only",
        status: "draft",
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "course", id, null, body);
      
      return json({ id, message: "Course created" }, 201);
    }
    
    // Single course
    const courseMatch = path.match(/^\/courses\/([^/]+)$/);
    if (courseMatch && method === "GET") {
      if (!hasPerm("courses.view")) return json({ error: "Forbidden" }, 403);
      
      const courseId = courseMatch[1];
      const [course] = await db.select().from(academyCoursesTable).where(eq(academyCoursesTable.id, courseId)).limit(1);
      
      if (!course) return json({ error: "Course not found" }, 404);
      
      const modules = await db.select().from(academyModulesTable)
        .where(eq(academyModulesTable.courseId, courseId))
        .orderBy(asc(academyModulesTable.position));
      
      const lessons = await db.select().from(academyLessonsTable)
        .where(eq(academyLessonsTable.courseId, courseId))
        .orderBy(asc(academyLessonsTable.position));
      
      return json({ ...course, modules, lessons });
    }
    
    if (courseMatch && method === "PUT") {
      if (!hasPerm("courses.edit")) return json({ error: "Forbidden" }, 403);
      
      const courseId = courseMatch[1];
      const [oldCourse] = await db.select().from(academyCoursesTable).where(eq(academyCoursesTable.id, courseId)).limit(1);
      
      if (!oldCourse) return json({ error: "Course not found" }, 404);
      
      await db.update(academyCoursesTable)
        .set({ ...body, updatedBy: user.id, updatedAt: new Date() })
        .where(eq(academyCoursesTable.id, courseId));
      
      await logAction("update", "course", courseId, oldCourse, body);
      
      return json({ message: "Course updated" });
    }
    
    if (courseMatch && method === "DELETE") {
      if (!hasPerm("courses.delete")) return json({ error: "Forbidden" }, 403);
      
      const courseId = courseMatch[1];
      const [oldCourse] = await db.select().from(academyCoursesTable).where(eq(academyCoursesTable.id, courseId)).limit(1);
      
      if (!oldCourse) return json({ error: "Course not found" }, 404);
      
      await db.delete(academyCoursesTable).where(eq(academyCoursesTable.id, courseId));
      await logAction("delete", "course", courseId, oldCourse, null);
      
      return json({ message: "Course deleted" });
    }
    
    // Publish/Unpublish
    const publishMatch = path.match(/^\/courses\/([^/]+)\/(publish|unpublish)$/);
    if (publishMatch && method === "POST") {
      if (!hasPerm("courses.publish")) return json({ error: "Forbidden" }, 403);
      
      const courseId = publishMatch[1];
      const action = publishMatch[2];
      const newStatus = action === "publish" ? "published" : "draft";
      
      await db.update(academyCoursesTable)
        .set({ status: newStatus, publishedAt: action === "publish" ? new Date() : null, updatedBy: user.id, updatedAt: new Date() })
        .where(eq(academyCoursesTable.id, courseId));
      
      await logAction(action, "course", courseId, null, { status: newStatus });
      
      return json({ message: `Course ${action}ed` });
    }
    
    // Duplicate course
    const duplicateMatch = path.match(/^\/courses\/([^/]+)\/duplicate$/);
    if (duplicateMatch && method === "POST") {
      if (!hasPerm("courses.create")) return json({ error: "Forbidden" }, 403);
      
      const courseId = duplicateMatch[1];
      const [course] = await db.select().from(academyCoursesTable).where(eq(academyCoursesTable.id, courseId)).limit(1);
      
      if (!course) return json({ error: "Course not found" }, 404);
      
      const newId = `course-${Date.now()}`;
      const newSlug = `${course.slug}-copy`;
      
      await db.insert(academyCoursesTable).values({
        ...course,
        id: newId,
        slug: newSlug,
        title: `${course.title} — Cópia`,
        status: "draft",
        progress: 0,
        modules: 0,
        lessons: 0,
        publishedAt: null,
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      // Duplicate modules
      const modules = await db.select().from(academyModulesTable).where(eq(academyModulesTable.courseId, courseId));
      for (const mod of modules) {
        const newModId = `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await db.insert(academyModulesTable).values({
          ...mod,
          id: newModId,
          courseId: newId,
          lessonCount: 0,
          completedLessons: 0,
          progress: 0,
          createdBy: user.id,
          updatedBy: user.id,
        });
        
        // Duplicate lessons
        const lessons = await db.select().from(academyLessonsTable).where(eq(academyLessonsTable.moduleId, mod.id));
        for (const lesson of lessons) {
          await db.insert(academyLessonsTable).values({
            ...lesson,
            id: `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            courseId: newId,
            moduleId: newModId,
            completed: 0,
            videoPosition: 0,
            createdBy: user.id,
            updatedBy: user.id,
          });
        }
      }
      
      await logAction("duplicate", "course", courseId, null, { newCourseId: newId });
      
      return json({ id: newId, message: "Course duplicated" }, 201);
    }
    
    // ============ MODULES ============
    if (path === "/modules" && method === "POST") {
      if (!hasPerm("modules.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, title, description, image, position, settings } = body;
      const id = `mod-${Date.now()}`;
      
      await db.insert(academyModulesTable).values({
        id,
        courseId,
        title,
        description,
        image,
        position: position || 0,
        settings: settings || {},
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      // Update course module count
      const moduleCount = await db.select({ count: count() }).from(academyModulesTable).where(eq(academyModulesTable.courseId, courseId));
      await db.update(academyCoursesTable)
        .set({ modules: moduleCount[0]?.count || 0, updatedBy: user.id, updatedAt: new Date() })
        .where(eq(academyCoursesTable.id, courseId));
      
      await logAction("create", "module", id, null, body);
      
      return json({ id, message: "Module created" }, 201);
    }
    
    // ============ LESSONS ============
    if (path === "/lessons" && method === "POST") {
      if (!hasPerm("lessons.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, moduleId, title, description, thumbnail, videoUrl, videoProvider, videoId, duration, videoDuration, position, type, status, highlights, materials, contentBlocks, completionSettings } = body;
      const id = `lesson-${Date.now()}`;
      
      await db.insert(academyLessonsTable).values({
        id,
        courseId,
        moduleId,
        title,
        description,
        thumbnail,
        videoUrl,
        videoProvider,
        videoId,
        duration,
        videoDuration: videoDuration || 0,
        position: position || 0,
        type: type || "video",
        status: status || "available",
        highlights: highlights || [],
        materials: materials || [],
        contentBlocks: contentBlocks || [],
        completionSettings: completionSettings || { mode: "video_percent", videoPercent: 90 },
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      // Update module lesson count
      const lessonCount = await db.select({ count: count() }).from(academyLessonsTable).where(eq(academyLessonsTable.moduleId, moduleId));
      await db.update(academyModulesTable)
        .set({ lessonCount: lessonCount[0]?.count || 0, updatedBy: user.id, updatedAt: new Date() })
        .where(eq(academyModulesTable.id, moduleId));
      
      // Update course lesson count
      const courseLessonCount = await db.select({ count: count() }).from(academyLessonsTable).where(eq(academyLessonsTable.courseId, courseId));
      await db.update(academyCoursesTable)
        .set({ lessons: courseLessonCount[0]?.count || 0, updatedBy: user.id, updatedAt: new Date() })
        .where(eq(academyCoursesTable.id, courseId));
      
      await logAction("create", "lesson", id, null, body);
      
      return json({ id, message: "Lesson created" }, 201);
    }
    
    // ============ QUIZZES ============
    if (path === "/quizzes" && method === "GET") {
      if (!hasPerm("quizzes.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, moduleId, lessonId, status } = query;
      let conditions = [];
      if (courseId) conditions.push(eq(quizzesTable.courseId, courseId));
      if (moduleId) conditions.push(eq(quizzesTable.moduleId, moduleId));
      if (lessonId) conditions.push(eq(quizzesTable.lessonId, lessonId));
      if (status) conditions.push(eq(quizzesTable.status, status));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const quizzes = await db.select().from(quizzesTable)
        .where(whereClause)
        .orderBy(desc(quizzesTable.createdAt));
      
      return json({ quizzes });
    }
    
    if (path === "/quizzes" && method === "POST") {
      if (!hasPerm("quizzes.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, moduleId, lessonId, title, description, timeLimit, minScore, maxAttempts, shuffleQuestions, shuffleAnswers, showResultsImmediately, showCorrectAnswers, isRequired, status } = body;
      const id = `quiz-${Date.now()}`;
      
      await db.insert(quizzesTable).values({
        id,
        courseId,
        moduleId,
        lessonId,
        title,
        description,
        timeLimit,
        minScore: minScore || 70,
        maxAttempts: maxAttempts || 3,
        shuffleQuestions: shuffleQuestions || false,
        shuffleAnswers: shuffleAnswers || false,
        showResultsImmediately: showResultsImmediately !== false,
        showCorrectAnswers: showCorrectAnswers || false,
        isRequired: isRequired || false,
        status: status || "draft",
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "quiz", id, null, body);
      
      return json({ id, message: "Quiz created" }, 201);
    }
    
    // ============ QUESTIONS ============
    if (path === "/questions" && method === "POST") {
      if (!hasPerm("quizzes.manage")) return json({ error: "Forbidden" }, 403);
      
      const { quizId, text, type, difficulty, points, explanation, order, options, correctAnswer } = body;
      const id = `q-${Date.now()}`;
      
      await db.insert(questionsTable).values({
        id,
        quizId,
        text,
        type: type || "multiple_choice",
        difficulty: difficulty || "medium",
        points: points || 1,
        explanation,
        order: order || 0,
        options: options || [],
        correctAnswer,
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "question", id, null, body);
      
      return json({ id, message: "Question created" }, 201);
    }
    
    // ============ MEDIA ============
    if (path === "/media" && method === "GET") {
      if (!hasPerm("media.manage")) return json({ error: "Forbidden" }, 403);
      
      const { type, category, folder, search, page = "1", limit = "50" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (type) conditions.push(eq(mediaTable.type, type));
      if (category) conditions.push(eq(mediaTable.category, category));
      if (folder) conditions.push(eq(mediaTable.folder, folder));
      if (search) conditions.push(sql`${mediaTable.fileName} ILIKE ${'%' + search + '%'}`);
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [media, total] = await Promise.all([
        db.select().from(mediaTable)
          .where(whereClause)
          .orderBy(desc(mediaTable.createdAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(mediaTable).where(whereClause),
      ]);
      
      return json({ media, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    if (path === "/media" && method === "POST") {
      if (!hasPerm("media.manage")) return json({ error: "Forbidden" }, 403);
      
      const { fileName, originalName, mimeType, size, url, thumbnailUrl, type, category, width, height, duration, folder, tags, metadata } = body;
      const id = `media-${Date.now()}`;
      
      await db.insert(mediaTable).values({
        id,
        fileName,
        originalName,
        mimeType,
        size,
        url,
        thumbnailUrl,
        type,
        category,
        width,
        height,
        duration,
        uploadedBy: user.id,
        folder: folder || "general",
        tags: tags || [],
        metadata: metadata || {},
      });
      
      await logAction("upload", "media", id, null, body);
      
      return json({ id, message: "Media uploaded" }, 201);
    }
    
    // ============ STUDENTS ============
    if (path === "/students" && method === "GET") {
      if (!hasPerm("students.view")) return json({ error: "Forbidden" }, 403);
      
      const { search, status, courseId, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [eq(usersTable.roleId, "STUDENT")];
      if (search) conditions.push(
        or(
          sql`${usersTable.name} ILIKE ${'%' + search + '%'}`,
          sql`${usersTable.email} ILIKE ${'%' + search + '%'}`
        )
      );
      if (status !== undefined) conditions.push(eq(usersTable.isActive, status === "active"));
      
      const whereClause = and(...conditions);
      
      const [students, total] = await Promise.all([
        db.select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          imageUrl: usersTable.imageUrl,
          isActive: usersTable.isActive,
          lastLoginAt: usersTable.lastLoginAt,
          createdAt: usersTable.createdAt,
        }).from(usersTable)
          .where(whereClause)
          .orderBy(desc(usersTable.createdAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(usersTable).where(whereClause),
      ]);
      
      return json({ students, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    // ============ ANALYTICS ============
    if (path === "/analytics" && method === "GET") {
      if (!hasPerm("analytics.view")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, startDate, endDate } = query;
      
      let conditions = [];
      if (courseId) conditions.push(eq(courseAnalyticsTable.courseId, courseId));
      if (startDate) conditions.push(gte(courseAnalyticsTable.date, new Date(startDate)));
      if (endDate) conditions.push(lte(courseAnalyticsTable.date, new Date(endDate)));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const analytics = await db.select().from(courseAnalyticsTable)
        .where(whereClause)
        .orderBy(desc(courseAnalyticsTable.date));
      
      return json({ analytics });
    }
    
    // ============ LOGS ============
    if (path === "/logs" && method === "GET") {
      if (!hasPerm("logs.view")) return json({ error: "Forbidden" }, 403);
      
      const { userId, action, resourceType, page = "1", limit = "50" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (userId) conditions.push(eq(adminLogsTable.userId, userId));
      if (action) conditions.push(eq(adminLogsTable.action, action));
      if (resourceType) conditions.push(eq(adminLogsTable.resourceType, resourceType));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [logs, total] = await Promise.all([
        db.select().from(adminLogsTable)
          .where(whereClause)
          .orderBy(desc(adminLogsTable.createdAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(adminLogsTable).where(whereClause),
      ]);
      
      return json({ logs, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    // ============ SETTINGS ============
    if (path === "/settings" && method === "GET") {
      if (!hasPerm("settings.manage")) return json({ error: "Forbidden" }, 403);
      
      const settings = await db.select().from(settingsTable);
      const brand = await db.select().from(brandSettingsTable).limit(1);
      const homeSections = await db.select().from(homePageSectionsTable).orderBy(asc(homePageSectionsTable.order));
      
      return json({ settings, brand: brand[0] || null, homeSections });
    }
    
    if (path === "/settings" && method === "PUT") {
      if (!hasPerm("settings.manage")) return json({ error: "Forbidden" }, 403);
      
      const { key, value, type, category, label, description } = body;
      
      await db.insert(settingsTable).values({
        id: randomUUID(),
        key,
        value,
        type,
        category,
        label,
        description,
        updatedBy: user.id,
      }).onConflictDoUpdate({
        target: settingsTable.key,
        set: { value, updatedBy: user.id, updatedAt: new Date() },
      });
      
      await logAction("update", "setting", key, null, body);
      
      return json({ message: "Setting updated" });
    }
    
    // ============ USERS / ROLES ============
    if (path === "/users" && method === "GET") {
      if (!hasPerm("users.manage")) return json({ error: "Forbidden" }, 403);
      
      const { search, role, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (search) conditions.push(
        or(
          sql`${usersTable.name} ILIKE ${'%' + search + '%'}`,
          sql`${usersTable.email} ILIKE ${'%' + search + '%'}`
        )
      );
      if (role) conditions.push(eq(rolesTable.name, role));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [users, total] = await Promise.all([
        db.select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          imageUrl: usersTable.imageUrl,
          isActive: usersTable.isActive,
          lastLoginAt: usersTable.lastLoginAt,
          createdAt: usersTable.createdAt,
          roleName: rolesTable.name,
        })
        .from(usersTable)
        .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
        .leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .where(whereClause)
        .orderBy(desc(usersTable.createdAt))
        .limit(parseInt(limit))
        .offset(offset),
        db.select({ count: count() }).from(usersTable).where(whereClause),
      ]);
      
      return json({ users, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    if (path === "/users" && method === "POST") {
      if (!hasPerm("users.manage")) return json({ error: "Forbidden" }, 403);
      
      const { email, name, roleId } = body;
      const id = `user-${Date.now()}`;
      
      await db.insert(usersTable).values({
        id,
        email,
        name,
        roleId,
        isActive: true,
      });
      
      if (roleId) {
        await db.insert(userRolesTable).values({
          id: `ur-${Date.now()}`,
          userId: id,
          roleId,
          assignedBy: user.id,
        });
      }
      
      await logAction("create", "user", id, null, body);
      
      return json({ id, message: "User created" }, 201);
    }
    
    // ============ BANNERS ============
    if (path === "/banners" && method === "GET") {
      if (!hasPerm("banners.manage")) return json({ error: "Forbidden" }, 403);
      
      const banners = await db.select().from(bannersTable).orderBy(desc(bannersTable.createdAt));
      return json({ banners });
    }
    
    if (path === "/banners" && method === "POST") {
      if (!hasPerm("banners.manage")) return json({ error: "Forbidden" }, 403);
      
      const { title, description, imageUrl, mobileImageUrl, linkUrl, buttonText, buttonUrl, position, startDate, endDate, status, priority, targetAudience, courses } = body;
      const id = `banner-${Date.now()}`;
      
      await db.insert(bannersTable).values({
        id,
        title,
        description,
        imageUrl,
        mobileImageUrl,
        linkUrl,
        buttonText,
        buttonUrl,
        position: position || "hero",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || "active",
        priority: priority || 0,
        targetAudience: targetAudience || "all",
        courses: courses || [],
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "banner", id, null, body);
      
      return json({ id, message: "Banner created" }, 201);
    }
    
    // ============ CATEGORIES ============
    if (path === "/categories" && method === "GET") {
      if (!hasPerm("categories.manage")) return json({ error: "Forbidden" }, 403);
      
      const categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
      return json({ categories });
    }
    
    if (path === "/categories" && method === "POST") {
      if (!hasPerm("categories.manage")) return json({ error: "Forbidden" }, 403);
      
      const { name, slug, description, image, icon, color, parentId, order } = body;
      const id = `cat-${Date.now()}`;
      
      await db.insert(categoriesTable).values({
        id,
        name,
        slug,
        description,
        image,
        icon,
        color: color || "#ff6a00",
        parentId,
        order: order || 0,
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "category", id, null, body);
      
      return json({ id, message: "Category created" }, 201);
    }
    
    // ============ INSTRUCTORS ============
    if (path === "/instructors" && method === "GET") {
      if (!hasPerm("instructors.manage")) return json({ error: "Forbidden" }, 403);
      
      const instructors = await db.select().from(instructorsTable).orderBy(desc(instructorsTable.createdAt));
      return json({ instructors });
    }
    
    if (path === "/instructors" && method === "POST") {
      if (!hasPerm("instructors.manage")) return json({ error: "Forbidden" }, 403);
      
      const { name, slug, email, photo, bio, shortBio, specialties, socialLinks } = body;
      const id = `inst-${Date.now()}`;
      
      await db.insert(instructorsTable).values({
        id,
        name,
        slug,
        email,
        photo,
        bio,
        shortBio,
        specialties: specialties || [],
        socialLinks: socialLinks || {},
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "instructor", id, null, body);
      
      return json({ id, message: "Instructor created" }, 201);
    }
    
    // ============ NOTIFICATIONS ============
    if (path === "/notifications" && method === "POST") {
      if (!hasPerm("notifications.send")) return json({ error: "Forbidden" }, 403);
      
      const { userId, title, message, type, referenceType, referenceId, actionUrl } = body;
      const id = `notif-${Date.now()}`;
      
      await db.insert(notificationsTable).values({
        id,
        userId,
        title,
        message,
        type: type || "info",
        referenceType,
        referenceId,
        actionUrl,
      });
      
      await logAction("create", "notification", id, null, body);
      
      return json({ id, message: "Notification sent" }, 201);
    }
    
    // ============ ANNOUNCEMENTS ============
    if (path === "/announcements" && method === "POST") {
      if (!hasPerm("notifications.send")) return json({ error: "Forbidden" }, 403);
      
      const { title, message, type, targetAudience, targetCourses, targetModules, targetUsers, sendAt } = body;
      const id = `ann-${Date.now()}`;
      
      await db.insert(announcementsTable).values({
        id,
        title,
        message,
        type: type || "info",
        targetAudience: targetAudience || "all",
        targetCourses: targetCourses || [],
        targetModules: targetModules || [],
        targetUsers: targetUsers || [],
        sendAt: sendAt ? new Date(sendAt) : null,
        status: sendAt ? "scheduled" : "draft",
        createdBy: user.id,
      });
      
      await logAction("create", "announcement", id, null, body);
      
      return json({ id, message: "Announcement created" }, 201);
    }
    
    // ============ ENROLLMENTS ============
    if (path === "/enrollments" && method === "POST") {
      if (!hasPerm("students.manage")) return json({ error: "Forbidden" }, 403);
      
      const { userId, courseId, accessType } = body;
      const id = `enr-${Date.now()}`;
      
      await db.insert(enrollmentsTable).values({
        id,
        userId,
        courseId,
        accessType: accessType || "enrolled",
        status: "active",
        enrolledBy: user.id,
      });
      
      await logAction("create", "enrollment", id, null, body);
      
      return json({ id, message: "Student enrolled" }, 201);
    }
    
    // ============ CERTIFICATES ============
    if (path === "/certificates" && method === "GET") {
      if (!hasPerm("certificates.manage")) return json({ error: "Forbidden" }, 403);
      
      const { userId, courseId, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (userId) conditions.push(eq(certificatesTable.userId, userId));
      if (courseId) conditions.push(eq(certificatesTable.courseId, courseId));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [certificates, total] = await Promise.all([
        db.select().from(certificatesTable)
          .where(whereClause)
          .orderBy(desc(certificatesTable.issuedAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(certificatesTable).where(whereClause),
      ]);
      
      return json({ certificates, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    // ============ ASSIGNMENTS ============
    if (path === "/assignments" && method === "GET") {
      if (!hasPerm("activities.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, moduleId, status } = query;
      let conditions = [];
      if (courseId) conditions.push(eq(assignmentsTable.courseId, courseId));
      if (moduleId) conditions.push(eq(assignmentsTable.moduleId, moduleId));
      if (status) conditions.push(eq(assignmentsTable.status, status));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const assignments = await db.select().from(assignmentsTable)
        .where(whereClause)
        .orderBy(desc(assignmentsTable.createdAt));
      
      return json({ assignments });
    }
    
    if (path === "/assignments" && method === "POST") {
      if (!hasPerm("activities.manage")) return json({ error: "Forbidden" }, 403);
      
      const { courseId, moduleId, lessonId, title, description, instructions, dueDate, maxScore, type, submissionType, allowedFileTypes, maxFileSize, isRequired, allowResubmission, maxSubmissions } = body;
      const id = `asgn-${Date.now()}`;
      
      await db.insert(assignmentsTable).values({
        id,
        courseId,
        moduleId,
        lessonId,
        title,
        description,
        instructions,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxScore: maxScore || 100,
        type,
        submissionType: submissionType || "upload",
        allowedFileTypes: allowedFileTypes || [],
        maxFileSize: maxFileSize || 52428800,
        isRequired: isRequired || false,
        allowResubmission: allowResubmission !== false,
        maxSubmissions: maxSubmissions || 3,
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      await logAction("create", "assignment", id, null, body);
      
      return json({ id, message: "Assignment created" }, 201);
    }
    
    // ============ SUBMISSIONS ============
    if (path === "/submissions" && method === "GET") {
      if (!hasPerm("students.view")) return json({ error: "Forbidden" }, 403);
      
      const { assignmentId, userId, status, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (assignmentId) conditions.push(eq(assignmentSubmissionsTable.assignmentId, assignmentId));
      if (userId) conditions.push(eq(assignmentSubmissionsTable.userId, userId));
      if (status) conditions.push(eq(assignmentSubmissionsTable.status, status));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [submissions, total] = await Promise.all([
        db.select().from(assignmentSubmissionsTable)
          .where(whereClause)
          .orderBy(desc(assignmentSubmissionsTable.submittedAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(assignmentSubmissionsTable).where(whereClause),
      ]);
      
      return json({ submissions, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    // ============ QUIZ ATTEMPTS ============
    if (path === "/quiz-attempts" && method === "GET") {
      if (!hasPerm("quizzes.manage")) return json({ error: "Forbidden" }, 403);
      
      const { quizId, userId, status, page = "1", limit = "20" } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let conditions = [];
      if (quizId) conditions.push(eq(quizAttemptsTable.quizId, quizId));
      if (userId) conditions.push(eq(quizAttemptsTable.userId, userId));
      if (status) conditions.push(eq(quizAttemptsTable.status, status));
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [attempts, total] = await Promise.all([
        db.select().from(quizAttemptsTable)
          .where(whereClause)
          .orderBy(desc(quizAttemptsTable.startedAt))
          .limit(parseInt(limit))
          .offset(offset),
        db.select({ count: count() }).from(quizAttemptsTable).where(whereClause),
      ]);
      
      return json({ attempts, total: total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) });
    }
    
    return json({ error: "Not found" }, 404);
    
  } catch (error) {
    console.error("Admin API error:", error);
    if (error.code === 'DATABASE_UNAVAILABLE') return json({ error: error.message }, 503);
    if (error instanceof SyntaxError) return json({ error: "JSON inválido" }, 400);
    return json({ error: "Não foi possível acessar o banco ou concluir a operação. Verifique os logs da função e a configuração do banco." }, 500);
  }
};
