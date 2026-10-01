import { useAdminFetch } from '@/lib/admin-fetch';
import { useState, useEffect } from 'react';
import { AdminPageHeader, AdminStatCard, AdminCard, AdminButton, AdminLoading, AdminTaskList, AdminAlertList, AdminBadge } from '../../components/admin-ui';
import { Users, BookOpen, ClipboardList, Award, Activity, Edit, RefreshCw, Download, FileText } from 'lucide-react';

export function AdminDashboard() {
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    adminFetch('/api/admin/dashboard', {
      headers: {  }
    })
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [adminFetch, attempt]);

  if (loading) return <AdminLoading />;
  if (error) return <div role="alert" className="p-6"><p>{error}</p><AdminButton onClick={() => setAttempt(v => v + 1)}>Tentar novamente</AdminButton></div>;

  const stats = data?.stats || {};

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Visão geral da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={RefreshCw} onClick={() => setAttempt(v => v + 1)}>Atualizar</AdminButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total de Alunos" value={stats.totalStudents || 0} icon={Users} />
        <AdminStatCard label="Alunos Ativos" value={stats.activeStudents || 0} icon={Activity} />
        <AdminStatCard label="Cursos Publicados" value={stats.publishedCourses || 0} icon={BookOpen} />
        <AdminStatCard label="Certificados Emitidos" value={stats.issuedCertificates || 0} icon={Award} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCard className="p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Cursos Mais Acessados</h3>
            <div className="space-y-3">
              {(data?.topCourses || []).map((course: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#1a1a1a]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6a00]/10">
                    <BookOpen size={16} className="text-[#ff6a00]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.enrolledCount || 0} alunos</p>
                  </div>
                  <AdminBadge variant="default">#{i + 1}</AdminBadge>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminTaskList
            tasks={[
              { id: '1', label: 'Atividades pendentes', count: stats.pendingActivities || 0, icon: ClipboardList, onClick: () => {} },
              { id: '2', label: 'Provas realizadas', count: stats.completedQuizzes || 0, icon: FileText, onClick: () => {} },
              { id: '3', label: 'Cursos em rascunho', count: stats.draftCourses || 0, icon: Edit, onClick: () => {} },
            ]}
          />

          <AdminAlertList
            alerts={[]}
          />
        </div>
      </div>

      <div className="mt-8">
        <AdminCard className="p-5">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Atividade Recente</h3>
          <div className="space-y-3">
            {(data?.recentActivity || []).map((activity: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#1a1a1a]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]">
                  <Activity size={16} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.createdAt ? new Date(activity.createdAt).toLocaleString('pt-BR') : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}