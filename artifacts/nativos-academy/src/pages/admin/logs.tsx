import { useAdminFetch } from '@/lib/admin-fetch';
import { useState, useEffect } from 'react';
import { AdminPageHeader, AdminButton, AdminLoading, AdminEmptyState, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminLogCard } from '../../components/admin-ui';
import { ScrollText } from 'lucide-react';

export function AdminLogs() {
  const adminFetch = useAdminFetch();
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
    
    adminFetch(`/api/admin/logs?${params}`, {
      headers: {  }
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