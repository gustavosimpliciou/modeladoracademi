import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminStatCard, AdminAnalyticsChartCard, AdminAnalyticsTableCard, AdminAnalyticsProgressCard, AdminAnalyticsBadge, AdminAnalyticsTrendIndicator, AdminAnalyticsDateRangePicker, AdminAnalyticsExportButton, AdminAnalyticsRefreshButton, AdminAnalyticsFilterBar, AdminAnalyticsCardGrid, AdminAnalyticsSection, AdminAnalyticsTabs, AdminAnalyticsTooltip, AdminAnalyticsLegend, AdminAnalyticsNoData, AdminAnalyticsSkeleton, AdminAnalyticsError, AdminAnalyticsContainer, AdminAnalyticsHeader, AdminAnalyticsFooter, AdminAnalyticsDivider, AdminAnalyticsSpacer, AdminAnalyticsFlex, AdminAnalyticsGrid, AdminAnalyticsCol, AdminAnalyticsRow, AdminAnalyticsStack, AdminAnalyticsInline, AdminAnalyticsWrap, AdminAnalyticsCenter, AdminAnalyticsBetween, AdminAnalyticsEnd, AdminAnalyticsStart, AdminAnalyticsTop, AdminAnalyticsBottom, AdminAnalyticsMiddle, AdminAnalyticsBaseline, AdminAnalyticsStretch, AdminAnalyticsEvenly, AdminAnalyticsAround, AdminAnalyticsSpaceBetween, AdminAnalyticsSpaceAround, AdminAnalyticsSpaceEvenly, AdminAnalyticsGap, AdminAnalyticsMargin, AdminAnalyticsPadding, AdminAnalyticsWidth, AdminAnalyticsHeight, AdminAnalyticsMaxWidth, AdminAnalyticsMinWidth, AdminAnalyticsMaxHeight, AdminAnalyticsMinHeight, AdminAnalyticsOverflow, AdminAnalyticsOverflowX, AdminAnalyticsOverflowY, AdminAnalyticsPosition, AdminAnalyticsTop as AdminAnalyticsTop2, AdminAnalyticsRight, AdminAnalyticsBottom as AdminAnalyticsBottom2, AdminAnalyticsLeft, AdminAnalyticsZIndex, AdminAnalyticsOpacity, AdminAnalyticsTransform, AdminAnalyticsTransition, AdminAnalyticsAnimation, AdminAnalyticsCursor, AdminAnalyticsUserSelect } from '../../components/admin-ui';
import { BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Users, BookOpen, Play, Clock, Award, Activity, Eye, Target, Zap, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageSquare, Bell, Settings, LogOut, Menu, X, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, GripVertical, Link2, Unlock, Lock, EyeOff, DollarSign, Percent, Database, HardDrive, Server, Wifi, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
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