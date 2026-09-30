const mockActivityFeed = [
  {
    id: "evt-1",
    type: "lesson_completed",
    title: "Concluiu: Entrevistas com usuários",
    course: "Fundamentos do Design de Produto",
    time: "2h atrás"
  },
  {
    id: "evt-2",
    type: "course_started",
    title: "Iniciou: Fundamentos do Design de Produto",
    course: "Fundamentos do Design de Produto",
    time: "1 dia atrás"
  },
  {
    id: "evt-3",
    type: "course_completed",
    title: "Concluiu: Estratégia de Produto na Prática",
    course: "Estratégia de Produto na Prática",
    time: "3 dias atrás"
  }
];

export default async (req, res) => {
  res.status(200).json(mockActivityFeed);
};