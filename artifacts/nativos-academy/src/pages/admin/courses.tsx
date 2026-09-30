import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminTable, AdminBadge, AdminModal, AdminInput, AdminSelect, AdminTextarea, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminConfirmDialog, AdminToast, AdminCourseCard } from '../components/admin-ui';
import { Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Copy, MoreVertical, BookOpen, Layers, Play, Users, Calendar, Clock, Star, TrendingUp, Activity, CheckCircle, XCircle, AlertTriangle, Info, ChevronLeft, ChevronRight, X, Save, Upload, Image, Video, FileText, Link2, Tag, FolderOpen, Grid, List, SortAsc, SortDesc, ArrowUpDown, SlidersHorizontal, Settings, Database, HardDrive, Server, Wifi, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, Award, Bell, MessageSquare, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquare as MessageSquareIcon, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShieldShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminCourses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    level: 'Iniciante',
    duration: '',
    instructor: '',
    thumbnail: '',
  });

  const fetchCourses = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    
    fetch(`/api/admin/courses?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setCourses(data.courses || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, [page, search, status]);

  const handleCreate = () => {
    fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setShowModal(false); setToast('Curso criado com sucesso!'); fetchCourses(); })
      .catch(() => setToast('Erro ao criar curso'));
  };

  const handleDelete = () => {
    if (!selectedCourse) return;
    fetch(`/api/admin/courses/${selectedCourse.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setShowDelete(false); setToast('Curso excluído!'); fetchCourses(); })
      .catch(() => setToast('Erro ao excluir'));
  };

  const handleDuplicate = (course: any) => {
    fetch(`/api/admin/courses/${course.id}/duplicate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setToast('Curso duplicado!'); fetchCourses(); })
      .catch(() => setToast('Erro ao duplicar'));
  };

  const handlePublish = (course: any) => {
    const action = course.status === 'published' ? 'unpublish' : 'publish';
    fetch(`/api/admin/courses/${course.id}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setToast(`Curso ${action === 'publish' ? 'publicado' : 'despublicado'}!`); fetchCourses(); })
      .catch(() => setToast('Erro ao atualizar'));
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <AdminPageHeader
        title="Cursos"
        subtitle="Gerencie todos os cursos da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Curso</AdminButton>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Buscar cursos..." className="flex-1" />
        <AdminFilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'draft', label: 'Rascunho' },
            { value: 'published', label: 'Publicado' },
            { value: 'archived', label: 'Arquivado' },
          ]}
        />
      </div>

      {loading ? (
        <AdminLoading />
      ) : courses.length === 0 ? (
        <AdminEmptyState
          icon={BookOpen}
          title="Nenhum curso encontrado"
          description="Crie seu primeiro curso para começar"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Curso</AdminButton>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <AdminCourseCard
                key={course.id}
                course={course}
                onEdit={() => { setSelectedCourse(course); setForm(course); setShowModal(true); }}
                onDelete={() => { setSelectedCourse(course); setShowDelete(true); }}
                onDuplicate={() => handleDuplicate(course)}
                onPublish={() => handlePublish(course)}
              />
            ))}
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={12} />
        </>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedCourse ? 'Editar Curso' : 'Novo Curso'} size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} placeholder="Nome do curso" />
          <AdminInput label="Slug" value={form.slug} onChange={(e: any) => setForm({ ...form, slug: e.target.value })} placeholder="slug-do-curso" />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do curso" rows={4} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect label="Categoria" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} options={[
              { value: 'Design', label: 'Design' },
              { value: 'Tecnologia', label: 'Tecnologia' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Negócios', label: 'Negócios' },
            ]} />
            <AdminSelect label="Nível" value={form.level} onChange={(e: any) => setForm({ ...form, level: e.target.value })} options={[
              { value: 'Iniciante', label: 'Iniciante' },
              { value: 'Intermediário', label: 'Intermediário' },
              { value: 'Avançado', label: 'Avançado' },
            ]} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Carga Horária" value={form.duration} onChange={(e: any) => setForm({ ...form, duration: e.target.value })} placeholder="10h 30min" />
            <AdminInput label="Instrutor" value={form.instructor} onChange={(e: any) => setForm({ ...form, instructor: e.target.value })} placeholder="Nome do instrutor" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Save} onClick={handleCreate}>
              {selectedCourse ? 'Salvar' : 'Criar Curso'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Excluir Curso"
        message={`Tem certeza que deseja excluir o curso "${selectedCourse?.title}"? Esta ação moverá o curso para a lixeira.`}
        confirmLabel="Excluir"
      />

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}