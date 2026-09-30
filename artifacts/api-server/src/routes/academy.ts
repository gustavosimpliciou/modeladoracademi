import { Router, type IRouter } from "express";
import { and, asc, eq, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  academyActivitiesTable,
  academyActivityEventsTable,
  academyCoursesTable,
  academyLessonsTable,
  academyModulesTable,
} from "@workspace/db";
import {
  GetActivityFeedResponse,
  GetCourseParams,
  GetCourseResponse,
  GetDashboardResponse,
  GetLessonParams,
  GetLessonResponse,
  ListActivitiesResponse,
  ListCoursesQueryParams,
  ListCoursesResponse,
  UpdateLessonProgressBody,
  UpdateLessonProgressParams,
  UpdateLessonProgressResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function courseSummary(course: typeof academyCoursesTable.$inferSelect) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    duration: course.duration,
    modules: course.modules,
    lessons: course.lessons,
    progress: course.progress,
    thumbnail: course.thumbnail,
    status: course.status,
    currentModule: course.currentModule,
    currentLesson: course.currentLesson,
  };
}

function lessonResponse(lesson: typeof academyLessonsTable.$inferSelect) {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    position: lesson.position,
    type: lesson.type,
    status: lesson.status,
    completed: lesson.completed === 1,
    videoPosition: lesson.videoPosition,
    videoDuration: lesson.videoDuration,
  };
}

router.get("/dashboard", async (_req, res): Promise<void> => {
  const courses = await db.select().from(academyCoursesTable).orderBy(asc(academyCoursesTable.createdAt));
  const featured = courses[0];

  if (!featured) {
    res.status(404).json({ error: "No courses available" });
    return;
  }

  const dashboard = {
    user: {
      name: "Gustavo Simplício",
      role: "Aluno",
      initials: "GS",
      avatarUrl: null,
    },
    featuredCourse: courseSummary(featured),
    stats: [
      { label: "Horas estudadas", value: "4h 32min", caption: "nesta jornada", icon: "clock", trend: "+12% este mês" },
      { label: "Em andamento", value: String(courses.filter((course) => course.status === "in_progress").length), caption: "cursos ativos", icon: "book", trend: null },
      { label: "Concluídos", value: String(courses.filter((course) => course.status === "completed").length), caption: "cursos finalizados", icon: "check", trend: null },
      { label: "Certificados", value: "0", caption: "conquistas disponíveis", icon: "award", trend: null },
    ],
    courses: courses.map(courseSummary),
  };

  res.json(GetDashboardResponse.parse(dashboard));
});

router.get("/activity-feed", async (_req, res): Promise<void> => {
  const events = await db.select().from(academyActivityEventsTable);
  res.json(GetActivityFeedResponse.parse(events));
});

router.get("/courses", async (req, res): Promise<void> => {
  const parsed = ListCoursesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, status } = parsed.data;
  let courses = await db.select().from(academyCoursesTable).orderBy(asc(academyCoursesTable.createdAt));

  if (search) {
    const query = search.toLowerCase();
    courses = courses.filter((course) =>
      `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query),
    );
  }
  if (status && status !== "all") {
    courses = courses.filter((course) => course.status === status);
  }

  res.json(ListCoursesResponse.parse(courses.map(courseSummary)));
});

router.get("/courses/:courseId", async (req, res): Promise<void> => {
  const parsed = GetCourseParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [course] = await db
    .select()
    .from(academyCoursesTable)
    .where(or(eq(academyCoursesTable.id, parsed.data.courseId), eq(academyCoursesTable.slug, parsed.data.courseId)));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const modules = await db
    .select()
    .from(academyModulesTable)
    .where(eq(academyModulesTable.courseId, course.id))
    .orderBy(asc(academyModulesTable.position));
  const lessons = await db
    .select()
    .from(academyLessonsTable)
    .where(eq(academyLessonsTable.courseId, course.id))
    .orderBy(asc(academyLessonsTable.position));

  const data = {
    ...courseSummary(course),
    instructor: course.instructor,
    instructorRole: course.instructorRole,
    objectives: course.objectives,
    requirements: course.requirements,
    modulesDetail: modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      position: module.position,
      lessonCount: module.lessonCount,
      completedLessons: module.completedLessons,
      progress: module.progress,
      status: module.status,
      lessons: lessons.filter((lesson) => lesson.moduleId === module.id).map(lessonResponse),
    })),
  };

  res.json(GetCourseResponse.parse(data));
});

router.get("/courses/:courseId/lessons/:lessonId", async (req, res): Promise<void> => {
  const parsed = GetLessonParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(academyLessonsTable)
    .where(and(eq(academyLessonsTable.id, parsed.data.lessonId), eq(academyLessonsTable.courseId, parsed.data.courseId)));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const [course] = await db.select().from(academyCoursesTable).where(eq(academyCoursesTable.id, lesson.courseId));
  const [module] = await db.select().from(academyModulesTable).where(eq(academyModulesTable.id, lesson.moduleId));
  if (!course || !module) {
    res.status(404).json({ error: "Lesson context not found" });
    return;
  }

  const data = {
    ...lessonResponse(lesson),
    courseId: course.id,
    courseTitle: course.title,
    moduleTitle: module.title,
    description: lesson.description,
    highlights: lesson.highlights,
    materials: lesson.materials,
    nextLessonId: lesson.nextLessonId,
  };
  res.json(GetLessonResponse.parse(data));
});

router.patch("/progress/:lessonId", async (req, res): Promise<void> => {
  const params = UpdateLessonProgressParams.safeParse(req.params);
  const body = UpdateLessonProgressBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(academyLessonsTable)
    .where(eq(academyLessonsTable.id, params.data.lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  await db
    .update(academyLessonsTable)
    .set({
      videoPosition: body.data.position,
      completed: body.data.completed ? 1 : 0,
      status: body.data.completed ? "completed" : "in_progress",
    })
    .where(eq(academyLessonsTable.id, lesson.id));

  const courseLessons = await db
    .select()
    .from(academyLessonsTable)
    .where(eq(academyLessonsTable.courseId, lesson.courseId));
  const completedLessons = courseLessons.filter((item) => item.id === lesson.id ? body.data.completed : item.completed === 1).length;
  const courseProgress = Math.round((completedLessons / Math.max(courseLessons.length, 1)) * 100);

  await db
    .update(academyCoursesTable)
    .set({ progress: courseProgress })
    .where(eq(academyCoursesTable.id, lesson.courseId));

  const moduleLessons = courseLessons.filter((item) => item.moduleId === lesson.moduleId);
  const moduleCompleted = moduleLessons.filter((item) => item.id === lesson.id ? body.data.completed : item.completed === 1).length;
  await db
    .update(academyModulesTable)
    .set({
      completedLessons: moduleCompleted,
      progress: Math.round((moduleCompleted / Math.max(moduleLessons.length, 1)) * 100),
      status: moduleCompleted === moduleLessons.length ? "completed" : "in_progress",
    })
    .where(eq(academyModulesTable.id, lesson.moduleId));

  res.json(UpdateLessonProgressResponse.parse({
    lessonId: lesson.id,
    position: body.data.position,
    completed: body.data.completed,
    courseProgress,
  }));
});

router.get("/activities", async (_req, res): Promise<void> => {
  const activities = await db.select().from(academyActivitiesTable);
  res.json(ListActivitiesResponse.parse(activities));
});

export default router;