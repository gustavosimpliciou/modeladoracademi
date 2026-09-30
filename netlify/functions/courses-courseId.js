import { json, handleOptions, getQuery } from "./_utils.js";

const mockCourses = {
  "curso-01": {
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
    currentLesson: "Entrevistas com usuários",
    instructor: "Gustavo Simplício",
    instructorRole: "Product Designer Sênior",
    objectives: [
      "Dominar o processo de design centrado no usuário",
      "Criar protótipos navegáveis e testáveis",
      "Conduzir pesquisas qualitativas e quantitativas",
      "Entregar soluções validadas para o portfólio"
    ],
    requirements: [
      "Conhecimentos básicos de Figma",
      "Curiosidade para resolver problemas reais",
      "Disponibilidade para projetos práticos"
    ],
    modulesDetail: [
      {
        id: "mod-1",
        title: "Introdução ao Design de Produto",
        description: "Conceitos fundamentais e mindset de produto",
        position: 1,
        lessonCount: 4,
        completedLessons: 4,
        progress: 100,
        status: "completed",
        lessons: [
          { id: "lesson-1-1", title: "O que é Design de Produto", duration: "12 min", position: 1, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 720 },
          { id: "lesson-1-2", title: "Processo Double Diamond", duration: "18 min", position: 2, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-1-3", title: "Design Thinking na prática", duration: "15 min", position: 3, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 900 },
          { id: "lesson-1-4", title: "Ferramentas do designer moderno", duration: "20 min", position: 4, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1200 }
        ]
      },
      {
        id: "mod-2",
        title: "Pesquisa e Descoberta",
        description: "Entender o problema antes de criar a solução",
        position: 2,
        lessonCount: 5,
        completedLessons: 1,
        progress: 20,
        status: "in_progress",
        lessons: [
          { id: "lesson-2-1", title: "Planejamento de pesquisa", duration: "18 min", position: 1, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-2-2", title: "Entrevistas com usuários", duration: "22 min", position: 2, type: "video", status: "in_progress", completed: false, videoPosition: 450, videoDuration: 1320 },
          { id: "lesson-2-3", title: "Análise de concorrentes", duration: "16 min", position: 3, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 960 },
          { id: "lesson-2-4", title: "Mapeamento de jornada", duration: "19 min", position: 4, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1140 },
          { id: "lesson-2-5", title: "Definição do problema", duration: "14 min", position: 5, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 840 }
        ]
      },
      {
        id: "mod-3",
        title: "Ideação e Prototipação",
        description: "Gerar e validar ideias rapidamente",
        position: 3,
        lessonCount: 5,
        completedLessons: 0,
        progress: 0,
        status: "available",
        lessons: [
          { id: "lesson-3-1", title: "Técnicas de brainstorming", duration: "15 min", position: 1, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 900 },
          { id: "lesson-3-2", title: "Wireframes de baixa fidelidade", duration: "20 min", position: 2, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 1200 },
          { id: "lesson-3-3", title: "Protótipos no Figma", duration: "25 min", position: 3, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 1500 },
          { id: "lesson-3-4", title: "Testes de usabilidade", duration: "18 min", position: 4, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-3-5", title: "Iteração baseada em feedback", duration: "16 min", position: 5, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 960 }
        ]
      },
      {
        id: "mod-4",
        title: "Validação e Entrega",
        description: "Preparar para desenvolvimento e medir sucesso",
        position: 4,
        lessonCount: 4,
        completedLessons: 0,
        progress: 0,
        status: "available",
        lessons: [
          { id: "lesson-4-1", title: "Handoff para desenvolvedores", duration: "14 min", position: 1, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 840 },
          { id: "lesson-4-2", title: "Design System básico", duration: "22 min", position: 2, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 1320 },
          { id: "lesson-4-3", title: "Métricas de sucesso", duration: "12 min", position: 3, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 720 },
          { id: "lesson-4-4", title: "Projeto final: Case completo", duration: "30 min", position: 4, type: "video", status: "locked", completed: false, videoPosition: 0, videoDuration: 1800 }
        ]
      }
    ]
  },
  "curso-02": {
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
    currentLesson: null,
    instructor: "Marina Santos",
    instructorRole: "Head of Product",
    objectives: [
      "Definir estratégia de produto alinhada ao negócio",
      "Priorizar iniciativas com frameworks comprovados",
      "Criar roadmaps realistas e comunicáveis",
      "Medir sucesso com métricas certas"
    ],
    requirements: [
      "Experiência básica com produtos digitais",
      "Familiaridade com métricas de produto"
    ],
    modulesDetail: [
      {
        id: "mod-5",
        title: "Discovery Contínuo",
        description: "Entender necessidades reais dos usuários",
        position: 1,
        lessonCount: 4,
        completedLessons: 4,
        progress: 100,
        status: "completed",
        lessons: [
          { id: "lesson-5-1", title: "Oportunidades vs Soluções", duration: "18 min", position: 1, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-5-2", title: "Entrevistas de discovery", duration: "22 min", position: 2, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1320 },
          { id: "lesson-5-3", title: "Mapeamento de oportunidades", duration: "16 min", position: 3, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 960 },
          { id: "lesson-5-4", title: "Validação de hipóteses", duration: "20 min", position: 4, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1200 }
        ]
      },
      {
        id: "mod-6",
        title: "Priorização e Roadmap",
        description: "Decidir o que construir e quando",
        position: 2,
        lessonCount: 4,
        completedLessons: 4,
        progress: 100,
        status: "completed",
        lessons: [
          { id: "lesson-6-1", title: "RICE e ICE na prática", duration: "18 min", position: 1, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-6-2", title: "Framework de priorização", duration: "22 min", position: 2, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1320 },
          { id: "lesson-6-3", title: "Roadmaps que funcionam", duration: "16 min", position: 3, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 960 },
          { id: "lesson-6-4", title: "Comunicação com stakeholders", duration: "20 min", position: 4, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1200 }
        ]
      },
      {
        id: "mod-7",
        title: "Métricas e Resultados",
        description: "Medir o que importa e iterar",
        position: 3,
        lessonCount: 4,
        completedLessons: 4,
        progress: 100,
        status: "completed",
        lessons: [
          { id: "lesson-7-1", title: "North Star Metric", duration: "15 min", position: 1, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 900 },
          { id: "lesson-7-2", title: "OKRs para produto", duration: "18 min", position: 2, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-7-3", title: "Análise de cohort", duration: "20 min", position: 3, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 1200 },
          { id: "lesson-7-4", title: "Cultura de experimentação", duration: "16 min", position: 4, type: "video", status: "completed", completed: true, videoPosition: 0, videoDuration: 960 }
        ]
      }
    ]
  },
  "curso-03": {
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
    currentLesson: null,
    instructor: "Rafael Costa",
    instructorRole: "Staff Engineer",
    objectives: [
      "Dominar sistema de tipos avançado do TypeScript",
      "Criar componentes React tipados e reutilizáveis",
      "Aplicar padrões de tipos em código real",
      "Configurar TypeScript para projetos grandes"
    ],
    requirements: [
      "TypeScript intermediário",
      "React com hooks"
    ],
    modulesDetail: [
      {
        id: "mod-8",
        title: "Sistema de Tipos Avançado",
        description: "Generics, conditional types, mapped types",
        position: 1,
        lessonCount: 5,
        completedLessons: 0,
        progress: 0,
        status: "available",
        lessons: [
          { id: "lesson-8-1", title: "Generics na prática", duration: "20 min", position: 1, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1200 },
          { id: "lesson-8-2", title: "Conditional Types", duration: "25 min", position: 2, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1500 },
          { id: "lesson-8-3", title: "Mapped Types e Template Literals", duration: "18 min", position: 3, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-8-4", title: "Utility Types avançados", duration: "15 min", position: 4, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 900 },
          { id: "lesson-8-5", title: "Type inference e narrow", duration: "22 min", position: 5, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1320 }
        ]
      },
      {
        id: "mod-9",
        title: "React com TypeScript",
        description: "Componentes, hooks e context tipados",
        position: 2,
        lessonCount: 5,
        completedLessons: 0,
        progress: 0,
        status: "available",
        lessons: [
          { id: "lesson-9-1", title: "Props e Component Patterns", duration: "20 min", position: 1, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1200 },
          { id: "lesson-9-2", title: "Hooks customizados tipados", duration: "18 min", position: 2, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-9-3", title: "Context e Providers", duration: "16 min", position: 3, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 960 },
          { id: "lesson-9-4", title: "Formulários com Zod + React Hook Form", duration: "25 min", position: 4, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1500 },
          { id: "lesson-9-5", title: "Testes com tipos", duration: "14 min", position: 5, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 840 }
        ]
      },
      {
        id: "mod-10",
        title: "Arquitetura e Escala",
        description: "Padrões para codebases grandes",
        position: 3,
        lessonCount: 4,
        completedLessons: 0,
        progress: 0,
        status: "available",
        lessons: [
          { id: "lesson-10-1", title: "Monorepos e shared types", duration: "18 min", position: 1, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1080 },
          { id: "lesson-10-2", title: "API types com tRPC", duration: "22 min", position: 2, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1320 },
          { id: "lesson-10-3", title: "Performance e bundle size", duration: "16 min", position: 3, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 960 },
          { id: "lesson-10-4", title: "Migração gradual legado", duration: "20 min", position: 4, type: "video", status: "available", completed: false, videoPosition: 0, videoDuration: 1200 }
        ]
      }
    ]
  }
};

export default async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  
  const courseId = getQuery(event, "courseId");
  const course = mockCourses[courseId] || mockCourses["curso-01"];
  
  if (!course) {
    return json({ error: "Course not found" }, 404);
  }
  
  return json(course);
};