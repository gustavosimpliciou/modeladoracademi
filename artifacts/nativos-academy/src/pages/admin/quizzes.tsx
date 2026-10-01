import { useAdminFetch } from '@/lib/admin-fetch';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminPageHeader, AdminButton, AdminLoading, AdminEmptyState, AdminModal, AdminInput, AdminSelect, AdminTextarea, AdminConfirmDialog, AdminToast, AdminQuizCard, AdminQuizAttemptCard } from '../../components/admin-ui';
import { Plus, Download, HelpCircle, ClipboardList, Database } from 'lucide-react';

export function AdminQuizzes() {
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    courseId: '',
    moduleId: '',
    lessonId: '',
    timeLimit: 30,
    minScore: 70,
    maxAttempts: 3,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showResultsImmediately: true,
    showCorrectAnswers: false,
    isRequired: false,
  });

  const fetchQuizzes = () => {
    setLoading(true);
    adminFetch('/api/admin/quizzes', {
      headers: {  }
    })
      .then(res => res.json())
      .then(data => { setQuizzes(data.quizzes || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchAttempts = () => {
    adminFetch('/api/admin/quiz-attempts', {
      headers: {  }
    })
      .then(res => res.json())
      .then(data => { setAttempts(data.attempts || []); })
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'quizzes') fetchQuizzes();
    if (activeTab === 'attempts') fetchAttempts();
  }, [activeTab]);

  const handleCreate = () => {
    adminFetch('/api/admin/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',  },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setShowModal(false); setToast('Quiz criado com sucesso!'); fetchQuizzes(); })
      .catch(() => setToast('Erro ao criar quiz'));
  };

  const handleDelete = () => {
    if (!selectedQuiz) return;
    adminFetch(`/api/admin/quizzes/${selectedQuiz.id}`, {
      method: 'DELETE',
      headers: {  },
    })
      .then(() => { setShowDelete(false); setToast('Quiz excluído!'); fetchQuizzes(); })
      .catch(() => setToast('Erro ao excluir'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Quizzes"
        subtitle="Gerencie quizzes e provas da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Quiz</AdminButton>
          </>
        }
      />

      <div className="mb-6 flex gap-1 rounded-lg border border-[#222222] bg-[#0a0a0a] p-1">
        {[
          { id: 'quizzes', label: 'Quizzes' },
          { id: 'attempts', label: 'Tentativas' },
          { id: 'questions', label: 'Banco de Questões' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-[#ff6a00] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'quizzes' && (
        loading ? (
          <AdminLoading />
        ) : quizzes.length === 0 ? (
          <AdminEmptyState
            icon={HelpCircle}
            title="Nenhum quiz encontrado"
            description="Crie quizzes para avaliar os alunos"
            action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Quiz</AdminButton>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map(quiz => (
              <AdminQuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={() => { setSelectedQuiz(quiz); setForm(quiz); setShowModal(true); }}
                onDelete={() => { setSelectedQuiz(quiz); setShowDelete(true); }}
                onPreview={() => {}}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'attempts' && (
        loading ? (
          <AdminLoading />
        ) : attempts.length === 0 ? (
          <AdminEmptyState
            icon={ClipboardList}
            title="Nenhuma tentativa"
            description="As tentativas dos alunos aparecerão aqui"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {attempts.map(attempt => (
              <AdminQuizAttemptCard
                key={attempt.id}
                attempt={attempt}
                onView={() => {}}
                onGrade={() => {}}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'questions' && (
        <AdminEmptyState
          icon={Database}
          title="Banco de Questões"
          description="Crie perguntas reutilizáveis para diferentes quizzes"
          action={<AdminButton variant="primary" icon={Plus}>Criar Pergunta</AdminButton>}
        />
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedQuiz ? 'Editar Quiz' : 'Novo Quiz'} size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} placeholder="Nome do quiz" />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do quiz" rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Tempo Limite (min)" type="number" value={form.timeLimit} onChange={(e: any) => setForm({ ...form, timeLimit: parseInt(e.target.value) })} />
            <AdminInput label="Nota Mínima (%)" type="number" value={form.minScore} onChange={(e: any) => setForm({ ...form, minScore: parseInt(e.target.value) })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Máx. Tentativas" type="number" value={form.maxAttempts} onChange={(e: any) => setForm({ ...form, maxAttempts: parseInt(e.target.value) })} />
            <AdminSelect label="Curso" value={form.courseId} onChange={(e: any) => setForm({ ...form, courseId: e.target.value })} options={[
              { value: '', label: 'Selecione' },
              { value: 'course-1', label: 'Modelagem 3D' },
            ]} />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.shuffleQuestions} onChange={(e: any) => setForm({ ...form, shuffleQuestions: e.target.checked })} className="accent-[#ff6a00]" />
              <span className="text-sm text-gray-300">Embaralhar perguntas</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.shuffleAnswers} onChange={(e: any) => setForm({ ...form, shuffleAnswers: e.target.checked })} className="accent-[#ff6a00]" />
              <span className="text-sm text-gray-300">Embaralhar respostas</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.showResultsImmediately} onChange={(e: any) => setForm({ ...form, showResultsImmediately: e.target.checked })} className="accent-[#ff6a00]" />
              <span className="text-sm text-gray-300">Mostrar resultado imediatamente</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.isRequired} onChange={(e: any) => setForm({ ...form, isRequired: e.target.checked })} className="accent-[#ff6a00]" />
              <span className="text-sm text-gray-300">Obrigatório</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Save} onClick={handleCreate}>
              {selectedQuiz ? 'Salvar' : 'Criar Quiz'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Excluir Quiz"
        message={`Tem certeza que deseja excluir o quiz "${selectedQuiz?.title}"?`}
        confirmLabel="Excluir"
      />

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}