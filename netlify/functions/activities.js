const mockActivities = [
  {
    id: "act-1",
    title: "Projeto: Research Plan Completo",
    course: "Fundamentos do Design de Produto",
    module: "Pesquisa e Descoberta",
    status: "in_progress",
    dueDate: "2024-02-15",
    type: "assignment"
  },
  {
    id: "act-2",
    title: "Quiz: Double Diamond",
    course: "Fundamentos do Design de Produto",
    module: "Introdução ao Design de Produto",
    status: "completed",
    dueDate: "2024-01-20",
    type: "quiz"
  },
  {
    id: "act-3",
    title: "Entregável: Mapa de Jornada",
    course: "Fundamentos do Design de Produto",
    module: "Pesquisa e Descoberta",
    status: "not_started",
    dueDate: "2024-02-28",
    type: "assignment"
  },
  {
    id: "act-4",
    title: "Desafio: Priorização RICE",
    course: "Estratégia de Produto na Prática",
    module: "Priorização e Roadmap",
    status: "completed",
    dueDate: "2024-01-10",
    type: "challenge"
  }
];

export default async (req, res) => {
  res.status(200).json(mockActivities);
};