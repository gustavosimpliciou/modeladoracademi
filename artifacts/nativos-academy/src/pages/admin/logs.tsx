import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminTable, AdminBadge, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminLogCard, AdminSystemLogCard } from '../../components/admin-ui';
import { ScrollText, Activity, AlertTriangle, Info, XCircle, CheckCircle, Clock, User, Settings, Database, HardDrive, Server, Wifi, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, Award, Bell, MessageSquare, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (action !== 'all') params.set('action', action);
    
    fetch(`/api/admin/logs?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setLogs(data.logs || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [page, action]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <AdminPageHeader
        title="Logs"
        subtitle="Registro de ações administrativas"
        actions={
          <AdminButton variant="secondary" icon={ScrollText}>Exportar</AdminButton>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Buscar logs..." className="flex-1" />
        <AdminFilterSelect
          label="Ação"
          value={action}
          onChange={setAction}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'create', label: 'Criar' },
            { value: 'update', label: 'Atualizar' },
            { value: 'delete', label: 'Excluir' },
            { value: 'publish', label: 'Publicar' },
          ]}
        />
      </div>

      {loading ? (
        <AdminLoading />
      ) : logs.length === 0 ? (
        <AdminEmptyState
          icon={ScrollText}
          title="Nenhum log encontrado"
          description="As ações administrativas aparecerão aqui"
        />
      ) : (
        <>
          <div className="space-y-3">
            {logs.map(log => (
              <AdminLogCard key={log.id} log={log} />
            ))}
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={20} />
        </>
      )}
    </div>
  );
}