import { useAdminFetch } from '@/lib/admin-fetch';
import { useState, useEffect } from 'react';
import { AdminPageHeader, AdminLoading, AdminStatCard, AdminAnalyticsChartCard, AdminAnalyticsTableCard, AdminAnalyticsDateRangePicker, AdminAnalyticsExportButton, AdminAnalyticsRefreshButton, AdminAnalyticsFilterBar, AdminAnalyticsCardGrid, AdminAnalyticsSection, AdminAnalyticsTabs, AdminAnalyticsNoData, AdminAnalyticsContainer, AdminAnalyticsDivider } from '../../components/admin-ui';
import { Users, BookOpen, Award, Activity } from 'lucide-react';

export function AdminAnalytics() {
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/analytics', {
      headers: {  }
    })
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  const chartData = [
    { label: 'Jan', value: 120 },
    { label: 'Fev', value: 180 },
    { label: 'Mar', value: 250 },
    { label: 'Abr', value: 320 },
    { label: 'Mai', value: 400 },
    { label: 'Jun', value: 480 },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        subtitle="Métricas e relatórios da plataforma"
        actions={
          <>
            <AdminAnalyticsExportButton onExport={() => {}} />
            <AdminAnalyticsRefreshButton onRefresh={() => {}} />
          </>
        }
      />

      <AdminAnalyticsFilterBar>
        <AdminAnalyticsDateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
        />
      </AdminAnalyticsFilterBar>

      <AdminAnalyticsTabs
        tabs={[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'courses', label: 'Cursos' },
          { id: 'lessons', label: 'Aulas' },
          { id: 'students', label: 'Alunos' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <AdminAnalyticsContainer>
          <AdminAnalyticsSection title="Estatísticas Gerais">
            <AdminAnalyticsCardGrid cols={4}>
              <AdminStatCard label="Total de Alunos" value={data?.stats?.totalStudents || 0} icon={Users} trend="up" change="+12%" />
              <AdminStatCard label="Alunos Ativos" value={data?.stats?.activeStudents || 0} icon={Activity} trend="up" change="+8%" />
              <AdminStatCard label="Cursos Publicados" value={data?.stats?.publishedCourses || 0} icon={BookOpen} trend="up" change="+3" />
              <AdminStatCard label="Certificados" value={data?.stats?.issuedCertificates || 0} icon={Award} trend="up" change="+15" />
            </AdminAnalyticsCardGrid>
          </AdminAnalyticsSection>

          <AdminAnalyticsDivider />

          <AdminAnalyticsSection title="Novos Alunos">
            <AdminAnalyticsChartCard title="Últimos 6 meses" data={chartData} type="bar" />
          </AdminAnalyticsSection>

          <AdminAnalyticsDivider />

          <AdminAnalyticsSection title="Cursos Mais Acessados">
            <AdminAnalyticsTableCard
              title="Top 5 Cursos"
              columns={[
                { key: 'title', label: 'Curso' },
                { key: 'enrolledCount', label: 'Alunos' },
                { key: 'completionRate', label: 'Conclusão' },
              ]}
              data={[
                { title: 'Modelagem 3D', enrolledCount: 245, completionRate: '68%' },
                { title: 'Design de Produto', enrolledCount: 189, completionRate: '72%' },
                { title: 'TypeScript Avançado', enrolledCount: 156, completionRate: '55%' },
              ]}
            />
          </AdminAnalyticsSection>
        </AdminAnalyticsContainer>
      )}

      {activeTab === 'courses' && (
        <AdminAnalyticsNoData message="Selecione um curso para ver métricas detalhadas" />
      )}

      {activeTab === 'lessons' && (
        <AdminAnalyticsNoData message="Selecione uma aula para ver métricas detalhadas" />
      )}

      {activeTab === 'students' && (
        <AdminAnalyticsNoData message="Selecione um aluno para ver métricas detalhadas" />
      )}
    </div>
  );
}