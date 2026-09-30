import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminTable, AdminBadge, AdminModal, AdminInput, AdminSelect, AdminTextarea, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminConfirmDialog, AdminToast, AdminStudentCard, AdminUserAvatar, AdminStatusDot } from '../../components/admin-ui';
import { Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Copy, MoreVertical, Users, UserCheck, UserX, UserPlus, GraduationCap, Award, Bell, MessageSquare, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    roleId: 'student',
  });

  const fetchStudents = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    
    fetch(`/api/admin/students?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setStudents(data.students || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [page, search, status]);

  const handleCreate = () => {
    fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setShowModal(false); setToast('Aluno criado com sucesso!'); fetchStudents(); })
      .catch(() => setToast('Erro ao criar aluno'));
  };

  const handleBlock = (student: any) => {
    fetch(`/api/admin/users/${student.id}/block`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setToast(student.isActive ? 'Aluno bloqueado!' : 'Aluno desbloqueado!'); fetchStudents(); })
      .catch(() => setToast('Erro ao atualizar'));
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <AdminPageHeader
        title="Alunos"
        subtitle="Gerencie todos os alunos da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Aluno</AdminButton>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Buscar alunos..." className="flex-1" />
        <AdminFilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativos' },
            { value: 'inactive', label: 'Inativos' },
          ]}
        />
      </div>

      {loading ? (
        <AdminLoading />
      ) : students.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="Nenhum aluno encontrado"
          description="Adicione alunos para começar"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Adicionar Aluno</AdminButton>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {students.map(student => (
              <AdminStudentCard
                key={student.id}
                student={student}
                onView={() => {}}
                onEdit={() => { setSelectedStudent(student); setForm(student); setShowModal(true); }}
                onBlock={() => handleBlock(student)}
              />
            ))}
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={12} />
        </>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedStudent ? 'Editar Aluno' : 'Novo Aluno'} size="lg">
        <div className="space-y-4">
          <AdminInput label="Nome" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
          <AdminInput label="Email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" type="email" />
          <AdminSelect label="Role" value={form.roleId} onChange={(e: any) => setForm({ ...form, roleId: e.target.value })} options={[
            { value: 'student', label: 'Aluno' },
            { value: 'instructor', label: 'Instrutor' },
            { value: 'admin', label: 'Admin' },
          ]} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={UserPlus} onClick={handleCreate}>
              {selectedStudent ? 'Salvar' : 'Criar Aluno'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}