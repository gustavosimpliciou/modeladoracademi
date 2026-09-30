import { json, handleOptions, getQuery } from "./_utils.js";

const mockLessons = {
  "lesson-2-2": {
    id: "lesson-2-2",
    title: "Entrevistas com usuários",
    duration: "22 min",
    position: 2,
    type: "video",
    status: "in_progress",
    completed: false,
    videoPosition: 450,
    videoDuration: 1320,
    courseId: "curso-01",
    courseTitle: "Fundamentos do Design de Produto",
    moduleTitle: "Pesquisa e Descoberta",
    description: "Aprenda a conduzir entrevistas eficazes para descobrir necessidades reais dos usuários. Cobrimos roteiro, técnicas de escuta ativa e como evitar viés de confirmação.",
    highlights: [
      "Estrutura de roteiro de entrevista",
      "Perguntas abertas vs fechadas",
      "Técnicas de escuta ativa",
      "Como registrar insights"
    ],
    materials: [
      { id: "mat-1", name: "Template de Roteiro de Entrevista", type: "PDF", size: "245 KB", url: "#" },
      { id: "mat-2", name: "Checklist de Preparação", type: "PDF", size: "180 KB", url: "#" },
      { id: "mat-3", name: "Planilha de Análise de Insights", type: "XLSX", size: "320 KB", url: "#" }
    ],
    nextLessonId: "lesson-2-3"
  },
  "lesson-1-1": {
    id: "lesson-1-1",
    title: "O que é Design de Produto",
    duration: "12 min",
    position: 1,
    type: "video",
    status: "completed",
    completed: true,
    videoPosition: 0,
    videoDuration: 720,
    courseId: "curso-01",
    courseTitle: "Fundamentos do Design de Produto",
    moduleTitle: "Introdução ao Design de Produto",
    description: "Visão geral do que é design de produto, diferença para UX/UI e o papel do product designer em times modernos.",
    highlights: [
      "Definição de Product Design",
      "Diferença UX / UI / Product Design",
      "Papel no time de produto"
    ],
    materials: [
      { id: "mat-4", name: "Glossário de Termos", type: "PDF", size: "150 KB", url: "#" }
    ],
    nextLessonId: "lesson-1-2"
  }
};

export default async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  
  const lessonId = getQuery(event, "lessonId");
  const lesson = mockLessons[lessonId] || mockLessons["lesson-2-2"];
  
  if (!lesson) {
    return json({ error: "Lesson not found" }, 404);
  }
  
  return json(lesson);
};