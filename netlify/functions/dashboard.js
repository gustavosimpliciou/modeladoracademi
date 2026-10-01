import { json, handleOptions } from "./_utils.js";

const mockCourses = [
  {
    id: "curso-01",
    slug: "fundamentos-design-produto",
    title: "Fundamentos do Design de Produto",
    description: "Aprenda o processo completo: pesquisa, ideação, prototipação e validação. Do zero ao portfólio.",
    category: "Design",
    level: "Iniciante",
    duration: "12h 30min",
    modules: 4,
    lessons: 18,
    progress: 35,
    thumbnail: "/course-design.jpg",
    status: "in_progress",
    currentModule: "Módulo 2: Pesquisa e Descoberta",
    currentLesson: "Entrevistas com usuários"
  },
  {
    id: "curso-02",
    slug: "estrategia-produto",
    title: "Estratégia de Produto na Prática",
    description: "Framework para decisões de produto: discovery, priorização, métricas e roadmap.",
    category: "Estratégia",
    level: "Intermediário",
    duration: "8h 15min",
    modules: 3,
    lessons: 12,
    progress: 100,
    thumbnail: "/course-strategy.jpg",
    status: "completed",
    currentModule: null,
    currentLesson: null
  },
  {
    id: "curso-03",
    slug: "typescript-avancado",
    title: "TypeScript Avançado para React",
    description: "Tipos avançados, generics, utility types e padrões para aplicações escaláveis.",
    category: "Tecnologia",
    level: "Avançado",
    duration: "6h 45min",
    modules: 3,
    lessons: 14,
    progress: 0,
    thumbnail: "/course-ts.jpg",
    status: "not_started",
    currentModule: null,
    currentLesson: null
  }
];

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  
  const featured = mockCourses[0];
  
  const dashboard = {
    user: {
      name: "Gustavo Simplício",
      role: "Aluno",
      initials: "GS",
      avatarUrl: null,
    },
    featuredCourse: {
      id: featured.id,
      slug: featured.slug,
      title: featured.title,
      description: featured.description,
      category: featured.category,
      level: featured.level,
      duration: featured.duration,
      modules: featured.modules,
      lessons: featured.lessons,
      progress: featured.progress,
      thumbnail: featured.thumbnail,
      status: featured.status,
      currentModule: featured.currentModule,
      currentLesson: featured.currentLesson
    },
    stats: [
      { label: "Horas estudadas", value: "4h 32min", caption: "nesta jornada", icon: "clock", trend: "+12% este mês" },
      { label: "Em andamento", value: String(mockCourses.filter(c => c.status === "in_progress").length), caption: "cursos ativos", icon: "book", trend: null },
      { label: "Concluídos", value: String(mockCourses.filter(c => c.status === "completed").length), caption: "cursos finalizados", icon: "check", trend: null },
      { label: "Certificados", value: "0", caption: "conquistas disponíveis", icon: "award", trend: null },
    ],
    courses: mockCourses.map(c => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      category: c.category,
      level: c.level,
      duration: c.duration,
      modules: c.modules,
      lessons: c.lessons,
      progress: c.progress,
      thumbnail: c.thumbnail,
      status: c.status,
      currentModule: c.currentModule,
      currentLesson: c.currentLesson
    }))
  };

  return json(dashboard);
};