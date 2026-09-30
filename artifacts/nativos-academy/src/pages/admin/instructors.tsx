import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminInput, AdminSelect, AdminTextarea, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminConfirmDialog, AdminToast, AdminInstructorCard, AdminCategoryCard, AdminBannerCard, AdminCertificateCard, AdminNotificationCard, AdminAnnouncementCard, AdminNotificationTemplateCard, AdminUserCard, AdminRoleCard, AdminPermissionCard, AdminTrashItemCard, AdminEnrollmentCard, AdminInstructorAssignmentCard, AdminSubmissionCard, AdminQuizAttemptCard, AdminQuestionBankCard, AdminQuestionCard, AdminActivityCard, AdminAssignmentCard, AdminVideoCard, AdminTrashCard, AdminSystemLogCard, AdminLogCard, AdminSettingCard, AdminBrandSettingsCard, AdminHomeSectionCard, AdminAnalyticsChartCard, AdminAnalyticsTableCard, AdminAnalyticsProgressCard, AdminAnalyticsBadge, AdminAnalyticsTrendIndicator, AdminAnalyticsDateRangePicker, AdminAnalyticsExportButton, AdminAnalyticsRefreshButton, AdminAnalyticsFilterBar, AdminAnalyticsCardGrid, AdminAnalyticsSection, AdminAnalyticsTabs, AdminAnalyticsTooltip, AdminAnalyticsLegend, AdminAnalyticsNoData, AdminAnalyticsSkeleton, AdminAnalyticsError, AdminAnalyticsContainer, AdminAnalyticsHeader, AdminAnalyticsFooter, AdminAnalyticsDivider, AdminAnalyticsSpacer, AdminAnalyticsFlex, AdminAnalyticsGrid, AdminAnalyticsCol, AdminAnalyticsRow, AdminAnalyticsStack, AdminAnalyticsInline, AdminAnalyticsWrap, AdminAnalyticsCenter, AdminAnalyticsBetween, AdminAnalyticsEnd, AdminAnalyticsStart, AdminAnalyticsTop, AdminAnalyticsBottom, AdminAnalyticsMiddle, AdminAnalyticsBaseline, AdminAnalyticsStretch, AdminAnalyticsEvenly, AdminAnalyticsAround, AdminAnalyticsSpaceBetween, AdminAnalyticsSpaceAround, AdminAnalyticsSpaceEvenly, AdminAnalyticsGap, AdminAnalyticsMargin, AdminAnalyticsPadding, AdminAnalyticsWidth, AdminAnalyticsHeight, AdminAnalyticsMaxWidth, AdminAnalyticsMinWidth, AdminAnalyticsMaxHeight, AdminAnalyticsMinHeight, AdminAnalyticsOverflow, AdminAnalyticsOverflowX, AdminAnalyticsOverflowY, AdminAnalyticsPosition, AdminAnalyticsTop as AdminAnalyticsTop2, AdminAnalyticsRight, AdminAnalyticsBottom as AdminAnalyticsBottom2, AdminAnalyticsLeft, AdminAnalyticsZIndex, AdminAnalyticsOpacity, AdminAnalyticsTransform, AdminAnalyticsTransition, AdminAnalyticsAnimation, AdminAnalyticsCursor, AdminAnalyticsUserSelect } from '../../components/admin-ui';
import { GraduationCap, Tag, Image, Award, Bell, MessageSquare, Users, Shield, Trash2, Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Copy, MoreVertical, CheckCircle, XCircle, AlertTriangle, Info, Clock, Star, TrendingUp, Activity, Calendar, Target, Zap, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminInstructors() {
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    email: '',
    bio: '',
    shortBio: '',
    specialties: [],
  });

  const fetchInstructors = () => {
    setLoading(true);
    fetch('/api/admin/instructors', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setInstructors(data.instructors || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchInstructors(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Instrutor criado com sucesso!'); fetchInstructors(); })
      .catch(() => setToast('Erro ao criar instrutor'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Instrutores"
        subtitle="Gerencie os instrutores da plataforma"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Instrutor</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : instructors.length === 0 ? (
        <AdminEmptyState
          icon={GraduationCap}
          title="Nenhum instrutor encontrado"
          description="Adicione instrutores para começar"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Adicionar Instrutor</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map(instructor => (
            <AdminInstructorCard
              key={instructor.id}
              instructor={instructor}
              onEdit={() => {}}
              onDelete={() => {}}
              onAssign={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Instrutor" size="lg">
        <div className="space-y-4">
          <AdminInput label="Nome" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
          <AdminInput label="Slug" value={form.slug} onChange={(e: any) => setForm({ ...form, slug: e.target.value })} />
          <AdminInput label="Email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} type="email" />
          <AdminTextarea label="Bio" value={form.bio} onChange={(e: any) => setForm({ ...form, bio: e.target.value })} rows={4} />
          <AdminTextarea label="Bio Curta" value={form.shortBio} onChange={(e: any) => setForm({ ...form, shortBio: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Instrutor</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminBanners() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    buttonText: '',
    position: 'hero',
    startDate: '',
    endDate: '',
  });

  const fetchBanners = () => {
    setLoading(true);
    fetch('/api/admin/banners', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setBanners(data.banners || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Banner criado com sucesso!'); fetchBanners(); })
      .catch(() => setToast('Erro ao criar banner'));
  };

  const handleToggle = (banner: any) => {
    fetch(`/api/admin/banners/${banner.id}/toggle`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setToast('Banner atualizado!'); fetchBanners(); })
      .catch(() => setToast('Erro ao atualizar'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        subtitle="Gerencie banners da plataforma"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Banner</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : banners.length === 0 ? (
        <AdminEmptyState
          icon={Image}
          title="Nenhum banner encontrado"
          description="Crie banners para promover conteúdo"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Banner</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map(banner => (
            <AdminBannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggle={() => handleToggle(banner)}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Banner" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} rows={3} />
          <AdminImageUpload label="Imagem" value={form.imageUrl} onChange={(url: string) => setForm({ ...form, imageUrl: url })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="URL do Link" value={form.linkUrl} onChange={(e: any) => setForm({ ...form, linkUrl: e.target.value })} />
            <AdminInput label="Texto do Botão" value={form.buttonText} onChange={(e: any) => setForm({ ...form, buttonText: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Data Início" type="date" value={form.startDate} onChange={(e: any) => setForm({ ...form, startDate: e.target.value })} />
            <AdminInput label="Data Fim" type="date" value={form.endDate} onChange={(e: any) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Banner</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    color: '#ff6a00',
  });

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setCategories(data.categories || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Categoria criada com sucesso!'); fetchCategories(); })
      .catch(() => setToast('Erro ao criar categoria'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Categorias"
        subtitle="Gerencie categorias de cursos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Categoria</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : categories.length === 0 ? (
        <AdminEmptyState
          icon={Tag}
          title="Nenhuma categoria encontrada"
          description="Crie categorias para organizar cursos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Categoria</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <AdminCategoryCard
              key={category.id}
              category={category}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggle={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Categoria" size="lg">
        <div className="space-y-4">
          <AdminInput label="Nome" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
          <AdminInput label="Slug" value={form.slug} onChange={(e: any) => setForm({ ...form, slug: e.target.value })} />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} rows={3} />
          <AdminImageUpload label="Imagem" value={form.image} onChange={(url: string) => setForm({ ...form, image: url })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Ícone" value={form.icon} onChange={(e: any) => setForm({ ...form, icon: e.target.value })} />
            <AdminColorPicker label="Cor" value={form.color} onChange={(color: string) => setForm({ ...form, color })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Categoria</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminCertificates() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchCertificates = () => {
    setLoading(true);
    fetch('/api/admin/certificates', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setCertificates(data.certificates || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCertificates(); }, []);

  return (
    <div>
      <AdminPageHeader
        title="Certificados"
        subtitle="Gerencie certificados emitidos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Template</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : certificates.length === 0 ? (
        <AdminEmptyState
          icon={Award}
          title="Nenhum certificado encontrado"
          description="Configure templates de certificados"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Template</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map(certificate => (
            <AdminCertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={() => {}}
              onRevoke={() => {}}
              onDownload={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Template de Certificado" size="xl">
        <div className="space-y-4">
          <AdminInput label="Nome do Template" placeholder="Template Padrão" />
          <AdminImageUpload label="Logo" value="" onChange={() => {}} />
          <AdminImageUpload label="Imagem de Fundo" value="" onChange={() => {}} />
          <AdminImageUpload label="Assinatura" value="" onChange={() => {}} />
          <AdminInput label="Nome da Instituição" defaultValue="Nativos3D Academy" />
          <AdminTextarea label="Texto do Certificado" rows={4} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminColorPicker label="Cor Primária" value="#ff6a00" onChange={() => {}} />
            <AdminColorPicker label="Cor do Texto" value="#ffffff" onChange={() => {}} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus}>Criar Template</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'info',
  });

  const fetchNotifications = () => {
    setLoading(true);
    fetch('/api/admin/notifications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setNotifications(data.notifications || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = () => {
    fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Notificação enviada!'); fetchNotifications(); })
      .catch(() => setToast('Erro ao enviar'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Notificações"
        subtitle="Envie notificações para alunos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Notificação</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : notifications.length === 0 ? (
        <AdminEmptyState
          icon={Bell}
          title="Nenhuma notificação"
          description="Envie notificações para os alunos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Enviar Notificação</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notifications.map(notification => (
            <AdminNotificationCard
              key={notification.id}
              notification={notification}
              onView={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Notificação" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Mensagem" value={form.message} onChange={(e: any) => setForm({ ...form, message: e.target.value })} rows={4} />
          <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
            { value: 'info', label: 'Info' },
            { value: 'warning', label: 'Aviso' },
            { value: 'news', label: 'Novidade' },
            { value: 'course', label: 'Curso' },
            { value: 'quiz', label: 'Prova' },
            { value: 'certificate', label: 'Certificado' },
          ]} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Send} onClick={handleSend}>Enviar</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    roleId: 'student',
  });

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setUsers(data.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Usuário criado com sucesso!'); fetchUsers(); })
      .catch(() => setToast('Erro ao criar usuário'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Usuários"
        subtitle="Gerencie usuários e permissões"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Usuário</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : users.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="Nenhum usuário encontrado"
          description="Adicione usuários e gerencie permissões"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Adicionar Usuário</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map(user => (
            <AdminUserCard
              key={user.id}
              user={user}
              onView={() => {}}
              onEdit={() => {}}
              onBlock={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Usuário" size="lg">
        <div className="space-y-4">
          <AdminInput label="Nome" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
          <AdminInput label="Email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} type="email" />
          <AdminSelect label="Role" value={form.roleId} onChange={(e: any) => setForm({ ...form, roleId: e.target.value })} options={[
            { value: 'student', label: 'Aluno' },
            { value: 'instructor', label: 'Instrutor' },
            { value: 'admin', label: 'Admin' },
            { value: 'super_admin', label: 'Super Admin' },
          ]} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Usuário</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminTrash() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch trash items
    setLoading(false);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Lixeira"
        subtitle="Itens excluídos podem ser restaurados"
      />

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmptyState
          icon={Trash2}
          title="Lixeira vazia"
          description="Itens excluídos aparecerão aqui"
        />
      ) : (
        <div classNamegrid gap-4>
          {items.map(item => (
            <AdminTrashItemCard
              key={item.id}
              item={item}
              onRestore={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminActivities() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructions: '',
    courseId: '',
    moduleId: '',
    lessonId: '',
    dueDate: '',
    maxScore: 100,
    type: 'exercise',
    submissionType: 'upload',
  });

  const fetchActivities = () => {
    setLoading(true);
    fetch('/api/admin/assignments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setActivities(data.assignments || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Atividade criada com sucesso!'); fetchActivities(); })
      .catch(() => setToast('Erro ao criar atividade'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Atividades"
        subtitle="Gerencie atividades e trabalhos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Atividade</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : activities.length === 0 ? (
        <AdminEmptyState
          icon={ClipboardList}
          title="Nenhuma atividade encontrada"
          description="Crie atividades para os alunos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Atividade</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map(activity => (
            <AdminActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Atividade" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} rows={3} />
          <AdminTextarea label="Instruções" value={form.instructions} onChange={(e: any) => setForm({ ...form, instructions: e.target.value })} rows={4} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Nota Máxima" type="number" value={form.maxScore} onChange={(e: any) => setForm({ ...form, maxScore: parseInt(e.target.value) })} />
            <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
              { value: 'exercise', label: 'Exercício' },
              { value: 'project', label: 'Projeto' },
              { value: 'upload', label: 'Upload' },
              { value: 'text', label: 'Texto' },
              { value: 'practice', label: 'Prática' },
              { value: 'challenge', label: 'Desafio' },
            ]} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Atividade</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminVideos() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch videos
    setLoading(false);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Vídeos"
        subtitle="Gerencie vídeos da plataforma"
      />

      {loading ? (
        <AdminLoading />
      ) : videos.length === 0 ? (
        <AdminEmptyState
          icon={Video}
          title="Nenhum vídeo encontrado"
          description="Vídeos aparecerão aqui"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map(video => (
            <AdminVideoCard
              key={video.id}
              video={video}
              onView={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminModules() {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    image: '',
  });

  const fetchModules = () => {
    setLoading(true);
    // TODO: Fetch modules
    setLoading(false);
  };

  useEffect(() => { fetchModules(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Módulo criado com sucesso!'); fetchModules(); })
      .catch(() => setToast('Erro ao criar módulo'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Módulos"
        subtitle="Gerencie módulos dos cursos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Módulo</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : modules.length === 0 ? (
        <AdminEmptyState
          icon={Layers}
          title="Nenhum módulo encontrado"
          description="Crie módulos para organizar cursos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Módulo</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(module => (
            <AdminModuleCard
              key={module.id}
              module={module}
              onEdit={() => {}}
              onDelete={() => {}}
              onAddLesson={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Módulo" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} rows={3} />
          <AdminImageUpload label="Imagem" value={form.image} onChange={(url: string) => setForm({ ...form, image: url })} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Módulo</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminLessons() {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    courseId: '',
    moduleId: '',
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    type: 'video',
  });

  const fetchLessons = () => {
    setLoading(true);
    // TODO: Fetch lessons
    setLoading(false);
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Aula criada com sucesso!'); fetchLessons(); })
      .catch(() => setToast('Erro ao criar aula'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Aulas"
        subtitle="Gerencie aulas dos cursos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Aula</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : lessons.length === 0 ? (
        <AdminEmptyState
          icon={Play}
          title="Nenhuma aula encontrada"
          description="Crie aulas para os cursos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Aula</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map(lesson => (
            <AdminLessonCard
              key={lesson.id}
              lesson={lesson}
              onEdit={() => {}}
              onDelete={() => {}}
              onPreview={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Aula" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Descrição" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} rows={3} />
          <AdminVideoUpload label="Vídeo" value={form.videoUrl} onChange={(url: string) => setForm({ ...form, videoUrl: url })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Duração" value={form.duration} onChange={(e: any) => setForm({ ...form, duration: e.target.value })} placeholder="10:30" />
            <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
              { value: 'video', label: 'Vídeo' },
              { value: 'text', label: 'Texto' },
              { value: 'pdf', label: 'PDF' },
              { value: 'project', label: 'Projeto' },
              { value: 'practice', label: 'Prática' },
            ]} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Aula</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminSubmissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('/api/admin/submissions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setSubmissions(data.submissions || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSubmissions(); }, []);

  return (
    <div>
      <AdminPageHeader
        title="Submissões"
        subtitle="Gerencie submissões de atividades"
      />

      {loading ? (
        <AdminLoading />
      ) : submissions.length === 0 ? (
        <AdminEmptyState
          icon={Upload}
          title="Nenhuma submissão"
          description="As submissões dos alunos aparecerão aqui"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map(submission => (
            <AdminSubmissionCard
              key={submission.id}
              submission={submission}
              onView={() => {}}
              onGrade={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminEnrollments() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    userId: '',
    courseId: '',
    accessType: 'enrolled',
  });

  const fetchEnrollments = () => {
    setLoading(true);
    // TODO: Fetch enrollments
    setLoading(false);
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Aluno matriculado com sucesso!'); fetchEnrollments(); })
      .catch(() => setToast('Erro ao matricular'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Matrículas"
        subtitle="Gerencie matrículas de alunos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Matrícula</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : enrollments.length === 0 ? (
        <AdminEmptyState
          icon={GraduationCap}
          title="Nenhuma matrícula"
          description="Matricule alunos em cursos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Matricular Aluno</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map(enrollment => (
            <AdminEnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Matrícula" size="lg">
        <div className="space-y-4">
          <AdminInput label="ID do Aluno" value={form.userId} onChange={(e: any) => setForm({ ...form, userId: e.target.value })} />
          <AdminInput label="ID do Curso" value={form.courseId} onChange={(e: any) => setForm({ ...form, courseId: e.target.value })} />
          <AdminSelect label="Tipo de Acesso" value={form.accessType} onChange={(e: any) => setForm({ ...form, accessType: e.target.value })} options={[
            { value: 'enrolled', label: 'Matriculado' },
            { value: 'audit', label: 'Auditoria' },
            { value: 'manual', label: 'Manual' },
            { value: 'trial', label: 'Trial' },
          ]} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Matricular</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    sendAt: '',
  });

  const fetchAnnouncements = () => {
    setLoading(true);
    // TODO: Fetch announcements
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = () => {
    fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(() => { setShowModal(false); setToast('Comunicado criado com sucesso!'); fetchAnnouncements(); })
      .catch(() => setToast('Erro ao criar comunicado'));
  };

  return (
    <div>
      <AdminPageHeader
        title="Comunicados"
        subtitle="Envie comunicados para alunos"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo Comunicado</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : announcements.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title="Nenhum comunicado"
          description="Envie comunicados para os alunos"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Comunicado</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map(announcement => (
            <AdminAnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={() => {}}
              onDelete={() => {}}
              onSend={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Comunicado" size="lg">
        <div className="space-y-4">
          <AdminInput label="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <AdminTextarea label="Mensagem" value={form.message} onChange={(e: any) => setForm({ ...form, message: e.target.value })} rows={4} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Aviso' },
              { value: 'news', label: 'Novidade' },
              { value: 'course', label: 'Curso' },
            ]} />
            <AdminSelect label="Destino" value={form.targetAudience} onChange={(e: any) => setForm({ ...form, targetAudience: e.target.value })} options={[
              { value: 'all', label: 'Todos' },
              { value: 'course', label: 'Curso Específico' },
              { value: 'module', label: 'Módulo' },
              { value: 'students', label: 'Alunos Selecionados' },
            ]} />
          </div>
          <AdminInput label="Agendar Envio (opcional)" type="datetime-local" value={form.sendAt} onChange={(e: any) => setForm({ ...form, sendAt: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Send} onClick={handleCreate}>Criar Comunicado</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminNotificationTemplates() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch templates
    setLoading(false);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Templates de Notificação"
        subtitle="Gerencie templates de email e notificação"
      />

      {loading ? (
        <AdminLoading />
      ) : templates.length === 0 ? (
        <AdminEmptyState
          icon={Mail}
          title="Nenhum template"
          description="Crie templates de notificação"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <AdminNotificationTemplateCard
              key={template.id}
              template={template}
              onEdit={() => {}}
              onDelete={() => {}}
              onSend={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminRoles() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch roles and permissions
    setLoading(false);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Roles e Permissões"
        subtitle="Gerencie roles e permissões do sistema"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-white">Roles</h3>
          {loading ? (
            <AdminLoading />
          ) : roles.length === 0 ? (
            <AdminEmptyState icon={Shield} title="Nenhuma role" description="Crie roles para o sistema" />
          ) : (
            <div className="space-y-3">
              {roles.map(role => (
                <AdminRoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onAssign={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-white">Permissões</h3>
          {loading ? (
            <AdminLoading />
          ) : permissions.length === 0 ? (
            <AdminEmptyState icon={Key} title="Nenhuma permissão" description="Crie permissões para o sistema" />
          ) : (
            <div className="space-y-3">
              {permissions.map(permission => (
                <AdminPermissionCard
                  key={permission.id}
                  permission={permission}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminSystemLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch system logs
    setLoading(false);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Logs do Sistema"
        subtitle="Logs e eventos do sistema"
      />

      {loading ? (
        <AdminLoading />
      ) : logs.length === 0 ? (
        <AdminEmptyState
          icon={Activity}
          title="Nenhum log"
          description="Logs do sistema aparecerão aqui"
        />
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <AdminSystemLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminQuestionBank() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: '',
    category: '',
    difficulty: 'medium',
    type: 'multiple_choice',
    options: [],
    correctAnswer: '',
  });

  useEffect(() => {
    // TODO: Fetch question bank
    setLoading(false);
  }, []);

  const handleCreate = () => {
    // TODO: Create question
    setShowModal(false);
    setToast('Pergunta criada com sucesso!');
  };

  return (
    <div>
      <AdminPageHeader
        title="Banco de Questões"
        subtitle="Crie perguntas reutilizáveis"
        actions={
          <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Nova Pergunta</AdminButton>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : questions.length === 0 ? (
        <AdminEmptyState
          icon={Database}
          title="Nenhuma pergunta"
          description="Crie perguntas para reutilizar em quizzes"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Criar Pergunta</AdminButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map(question => (
            <AdminQuestionBankCard
              key={question.id}
              question={question}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Pergunta" size="lg">
        <div className="space-y-4">
          <AdminTextarea label="Pergunta" value={form.question} onChange={(e: any) => setForm({ ...form, question: e.target.value })} rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Categoria" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} />
            <AdminSelect label="Dificuldade" value={form.difficulty} onChange={(e: any) => setForm({ ...form, difficulty: e.target.value })} options={[
              { value: 'easy', label: 'Fácil' },
              { value: 'medium', label: 'Média' },
              { value: 'hard', label: 'Difícil' },
            ]} />
          </div>
          <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
            { value: 'multiple_choice', label: 'Múltipla Escolha' },
            { value: 'true_false', label: 'Verdadeiro/Falso' },
            { value: 'short_answer', label: 'Resposta Curta' },
            { value: 'essay', label: 'Dissertativa' },
          ]} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={handleCreate}>Criar Pergunta</AdminButton>
          </div>
        </div>
      </AdminModal>

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export function AdminQuizResults() {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);

  const fetchAttempts = () => {
    setLoading(true);
    fetch('/api/admin/quiz-attempts', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setAttempts(data.attempts || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAttempts(); }, []);

  return (
    <div>
      <AdminPageHeader
        title="Resultados de Quizzes"
        subtitle="Visualize e corrija tentativas de quizzes"
      />

      {loading ? (
        <AdminLoading />
      ) : attempts.length === 0 ? (
        <AdminEmptyState
          icon={ClipboardList}
          title="Nenhuma tentativa"
          description="As tentativas de quizzes aparecerão aqui"
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
      )}
    </div>
  );
}

export function AdminCourseAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Analytics do Curso"
        subtitle="Métricas detalhadas do curso"
      />

      <AdminAnalyticsContainer>
        <AdminAnalyticsSection title="Estatísticas do Curso">
          <AdminAnalyticsCardGrid cols={4}>
            <AdminStatCard label="Alunos Matriculados" value={data?.stats?.totalStudents || 0} icon={Users} />
            <AdminStatCard label="Alunos Ativos" value={data?.stats?.activeStudents || 0} icon={Activity} />
            <AdminStatCard label="Taxa de Conclusão" value="68%" icon={Target} trend="up" change="+5%" />
            <AdminStatCard label="Tempo Médio" value="4h 32min" icon={Clock} />
          </AdminAnalyticsCardGrid>
        </AdminAnalyticsSection>

        <AdminAnalyticsDivider />

        <AdminAnalyticsSection title="Progresso dos Alunos">
          <AdminAnalyticsTableCard
            title="Alunos com Maior Progresso"
            columns={[
              { key: 'name', label: 'Aluno' },
              { key: 'progress', label: 'Progresso' },
              { key: 'lastAccess', label: 'Último Acesso' },
            ]}
            data={[
              { name: 'João Silva', progress: '85%', lastAccess: 'Hoje' },
              { name: 'Maria Santos', progress: '72%', lastAccess: 'Ontem' },
              { name: 'Pedro Costa', progress: '68%', lastAccess: '2 dias atrás' },
            ]}
          />
        </AdminAnalyticsSection>
      </AdminAnalyticsContainer>
    </div>
  );
}

export function AdminLessonAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch lesson analytics
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Analytics da Aula"
        subtitle="Métricas detalhadas da aula"
      />

      <AdminAnalyticsContainer>
        <AdminAnalyticsSection title="Estatísticas da Aula">
          <AdminAnalyticsCardGrid cols={4}>
            <AdminStatCard label="Visualizações" value={1245} icon={Eye} />
            <AdminStatCard label="Alunos que Começaram" value={892} icon={Play} />
            <AdminStatCard label="Alunos que Terminaram" value={678} icon={CheckCircle} />
            <AdminStatCard label="Tempo Médio" value="12:34" icon={Clock} />
          </AdminAnalyticsCardGrid>
        </AdminAnalyticsSection>

        <AdminAnalyticsDivider />

        <AdminAnalyticsSection title="Taxa de Abandono">
          <AdminCard className="p-5">
            <AdminAnalyticsProgressCard label="Abandono" value={32} color="#ef4444" />
          </AdminCard>
        </AdminAnalyticsSection>
      </AdminAnalyticsContainer>
    </div>
  );
}

export function AdminStudentProgress() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch student progress
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Progresso do Aluno"
        subtitle="Acompanhe o progresso do aluno"
      />

      <AdminAnalyticsContainer>
        <AdminAnalyticsSection title="Progresso Geral">
          <AdminCard className="p-5">
            <AdminAnalyticsProgressCard label="Curso" value={67} />
          </AdminCard>
        </AdminAnalyticsSection>

        <AdminAnalyticsDivider />

        <AdminAnalyticsSection title="Módulos">
          <AdminCard className="p-5">
            <div className="space-y-4">
              <AdminAnalyticsProgressCard label="Módulo 1: Introdução" value={100} color="#10b981" />
              <AdminAnalyticsProgressCard label="Módulo 2: Modelagem Básica" value={60} />
              <AdminAnalyticsProgressCard label="Módulo 3: Texturização" value={0} color="#6b7280" />
            </div>
          </AdminCard>
        </AdminAnalyticsSection>
      </AdminAnalyticsContainer>
    </div>
  );
}

export function AdminCertificateEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch certificate template
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Certificado"
        subtitle="Configure o template de certificado"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Configurações</h3>
          <div className="space-y-4">
            <AdminInput label="Nome da Instituição" defaultValue="Nativos3D Academy" />
            <AdminImageUpload label="Logo" value="" onChange={() => {}} />
            <AdminImageUpload label="Imagem de Fundo" value="" onChange={() => {}} />
            <AdminImageUpload label="Assinatura" value="" onChange={() => {}} />
            <AdminTextarea label="Texto do Certificado" rows={4} />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminColorPicker label="Cor Primária" value="#ff6a00" onChange={() => {}} />
              <AdminColorPicker label="Cor do Texto" value="#ffffff" onChange={() => {}} />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Preview</h3>
          <div className="aspect-[1.414/1] rounded-lg border border-[#333] bg-[#1a1a1a] p-8">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-[#ff6a00]/20" />
              <h2 className="font-display text-2xl font-bold text-white">Certificado de Conclusão</h2>
              <p className="mt-2 text-sm text-gray-400">Certificamos que</p>
              <p className="mt-1 font-display text-xl font-bold text-[#ff6a00]">Nome do Aluno</p>
              <p className="mt-2 text-sm text-gray-400">concluiu com êxito o curso</p>
              <p className="mt-1 font-display text-lg font-bold text-white">Modelagem 3D e Preparação para Impressão</p>
              <p className="mt-4 text-xs text-gray-500">Carga horária: 4h 32min</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function AdminEmailTemplates() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch email templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Templates de Email"
        subtitle="Configure templates de email"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Boas-vindas', 'Recuperação de Senha', 'Curso Iniciado', 'Curso Concluído', 'Certificado', 'Atividade Corrigida', 'Nova Aula'].map((name, i) => (
          <AdminCard key={i} className="p-4">
            <h4 className="font-medium text-white">{name}</h4>
            <p className="mt-1 text-sm text-gray-500">Template de email</p>
            <div className="mt-3 flex items-center gap-2">
              <AdminButton variant="secondary" size="sm" icon={Edit}>Editar</AdminButton>
              <AdminButton variant="ghost" size="sm" icon={Send}>Testar</AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

export function AdminStorageSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch storage settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Configurações de Storage"
        subtitle="Configure armazenamento de arquivos"
      />

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Armazenamento</h3>
          <div className="space-y-4">
            <AdminSelect label="Provedor" value="supabase" onChange={() => {}} options={[
              { value: 'supabase', label: 'Supabase Storage' },
              { value: 's3', label: 'AWS S3' },
              { value: 'gcs', label: 'Google Cloud Storage' },
              { value: 'azure', label: 'Azure Blob Storage' },
            ]} />
            <AdminInput label="Bucket" defaultValue="nativos3d-assets" />
            <AdminInput label="Região" defaultValue="us-east-1" />
            <AdminToggle checked={true} onChange={() => {}} label="CDN Habilitado" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Limites</h3>
          <div className="space-y-4">
            <AdminInput label="Tamanho Máximo de Upload (MB)" type="number" defaultValue="100" />
            <AdminInput label="Tamanho Máximo de Vídeo (MB)" type="number" defaultValue="500" />
            <AdminInput label="Tamanho Máximo de Arquivo 3D (MB)" type="number" defaultValue="50" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function AdminSecuritySettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch security settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Configurações de Segurança"
        subtitle="Configure segurança do sistema"
      />

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Autenticação</h3>
          <div className="space-y-3">
            <AdminToggle checked={true} onChange={() => {}} label="2FA para Super Admin" description="Exigir autenticação de dois fatores" />
            <AdminToggle checked={true} onChange={() => {}} label="Sessões Seguras" description="Forçar HTTPS para sessões" />
            <AdminToggle checked={false} onChange={() => {}} label="Restrição por IP" description="Restringir acesso por IP" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Sessões</h3>
          <div className="space-y-4">
            <AdminInput label="Tempo de Expiração da Sessão (horas)" type="number" defaultValue="24" />
            <AdminInput label="Máximo de Sessões Simultâneas" type="number" defaultValue="5" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function AdminCourseSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch course settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Configurações de Cursos"
        subtitle="Configure padrões de cursos"
      />

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Padrões de Cursos</h3>
          <div className="space-y-3">
            <AdminToggle checked={true} onChange={() => {}} label="Acesso sequencial" />
            <AdminToggle checked={true} onChange={() => {}} label="Permitir voltar" />
            <AdminToggle checked={false} onChange={() => {}} label="Exigir vídeo" />
            <AdminToggle checked={false} onChange={() => {}} label="Exigir atividade" />
            <AdminToggle checked={true} onChange={() => {}} label="Emitir certificado" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function AdminSystemSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch system settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Configurações do Sistema"
        subtitle="Configurações gerais do sistema"
      />

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Manutenção</h3>
          <div className="space-y-3">
            <AdminToggle checked={false} onChange={() => {}} label="Modo Manutenção" description="Desabilitar acesso ao site" />
            <AdminToggle checked={true} onChange={() => {}} label="Logs Detalhados" description="Registrar logs detalhados" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function AdminFaqEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch FAQ
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de FAQ"
        subtitle="Edite perguntas frequentes"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhuma pergunta"
        description="Adicione perguntas frequentes"
        action={<AdminButton variant="primary" icon={Plus}>Adicionar Pergunta</AdminButton>}
      />
    </div>
  );
}

export function AdminCategoryEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch categories
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Categorias"
        subtitle="Gerencie categorias de cursos"
      />

      <AdminEmptyState
        icon={Tag}
        title="Nenhuma categoria"
        description="Crie categorias para organizar cursos"
        action={<AdminButton variant="primary" icon={Plus}>Criar Categoria</AdminButton>}
      />
    </div>
  );
}

export function AdminBannerEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch banners
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Banners"
        subtitle="Gerencie banners da plataforma"
      />

      <AdminEmptyState
        icon={Image}
        title="Nenhum banner"
        description="Crie banners para promover conteúdo"
        action={<AdminButton variant="primary" icon={Plus}>Criar Banner</AdminButton>}
      />
    </div>
  );
}

export function AdminHomeEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch home sections
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Home"
        subtitle="Edite seções da página inicial"
      />

      <AdminEmptyState
        icon={LayoutDashboard}
        title="Nenhuma seção"
        description="Configure seções da home"
        action={<AdminButton variant="primary" icon={Plus}>Adicionar Seção</AdminButton>}
      />
    </div>
  );
}

export function AdminTrashEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch trash items
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Lixeira"
        subtitle="Itens excluídos"
      />

      <AdminEmptyState
        icon={Trash2}
        title="Lixeira vazia"
        description="Itens excluídos aparecerão aqui"
      />
    </div>
  );
}

export function AdminLogViewer() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch logs
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Visualizador de Logs"
        subtitle="Logs do sistema"
      />

      <AdminEmptyState
        icon={Activity}
        title="Nenhum log"
        description="Logs aparecerão aqui"
      />
    </div>
  );
}

export function AdminSettingsEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Configurações"
        subtitle="Configurações gerais"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações aparecerão aqui"
      />
    </div>
  );
}

export function AdminBrandEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch brand settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Marca"
        subtitle="Configurações de marca"
      />

      <AdminEmptyState
        icon={Palette}
        title="Nenhuma configuração"
        description="Configurações de marca aparecerão aqui"
      />
    </div>
  );
}

export function AdminUserEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch users
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Usuários"
        subtitle="Gerencie usuários"
      />

      <AdminEmptyState
        icon={Users}
        title="Nenhum usuário"
        description="Usuários aparecerão aqui"
      />
    </div>
  );
}

export function AdminRoleEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch roles
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Roles"
        subtitle="Gerencie roles"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma role"
        description="Roles aparecerão aqui"
      />
    </div>
  );
}

export function AdminPermissionEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch permissions
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Permissões"
        subtitle="Gerencie permissões"
      />

      <AdminEmptyState
        icon={Key}
        title="Nenhuma permissão"
        description="Permissões aparecerão aqui"
      />
    </div>
  );
}

export function AdminNotificationEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notifications
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Notificações"
        subtitle="Gerencie notificações"
      />

      <AdminEmptyState
        icon={Bell}
        title="Nenhuma notificação"
        description="Notificações aparecerão aqui"
      />
    </div>
  );
}

export function AdminAnnouncementEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch announcements
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Comunicados"
        subtitle="Gerencie comunicados"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhum comunicado"
        description="Comunicados aparecerão aqui"
      />
    </div>
  );
}

export function AdminTemplateEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Templates"
        subtitle="Gerencie templates"
      />

      <AdminEmptyState
        icon={FileText}
        title="Nenhum template"
        description="Templates aparecerão aqui"
      />
    </div>
  );
}

export function AdminEmailEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch email templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Email"
        subtitle="Templates de email"
      />

      <AdminEmptyState
        icon={Mail}
        title="Nenhum template"
        description="Templates de email aparecerão aqui"
      />
    </div>
  );
}

export function AdminStorageEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch storage settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Storage"
        subtitle="Configurações de storage"
      />

      <AdminEmptyState
        icon={HardDrive}
        title="Nenhuma configuração"
        description="Configurações de storage aparecerão aqui"
      />
    </div>
  );
}

export function AdminSecurityEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch security settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Segurança"
        subtitle="Configurações de segurança"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma configuração"
        description="Configurações de segurança aparecerão aqui"
      />
    </div>
  );
}

export function AdminCourseEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch course settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor de Cursos"
        subtitle="Configurações de cursos"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações de cursos aparecerão aqui"
      />
    </div>
  );
}

export function AdminSystemEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch system settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Editor do Sistema"
        subtitle="Configurações do sistema"
      />

      <AdminEmptyState
        icon={Server}
        title="Nenhuma configuração"
        description="Configurações do sistema aparecerão aqui"
      />
    </div>
  );
}

export function AdminFaqManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch FAQ
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de FAQ"
        subtitle="Perguntas frequentes"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhuma pergunta"
        description="Perguntas frequentes aparecerão aqui"
      />
    </div>
  );
}

export function AdminCategoryManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch categories
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Categorias"
        subtitle="Categorias de cursos"
      />

      <AdminEmptyState
        icon={Tag}
        title="Nenhuma categoria"
        description="Categorias aparecerão aqui"
      />
    </div>
  );
}

export function AdminBannerManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch banners
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Banners"
        subtitle="Banners da plataforma"
      />

      <AdminEmptyState
        icon={Image}
        title="Nenhum banner"
        description="Banners aparecerão aqui"
      />
    </div>
  );
}

export function AdminHomeManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch home sections
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Home"
        subtitle="Seções da página inicial"
      />

      <AdminEmptyState
        icon={LayoutDashboard}
        title="Nenhuma seção"
        description="Seções da home aparecerão aqui"
      />
    </div>
  );
}

export function AdminTrashManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch trash items
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Lixeira"
        subtitle="Itens excluídos"
      />

      <AdminEmptyState
        icon={Trash2}
        title="Lixeira vazia"
        description="Itens excluídos aparecerão aqui"
      />
    </div>
  );
}

export function AdminLogManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch logs
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Logs"
        subtitle="Logs do sistema"
      />

      <AdminEmptyState
        icon={Activity}
        title="Nenhum log"
        description="Logs aparecerão aqui"
      />
    </div>
  );
}

export function AdminSettingsManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Configurações"
        subtitle="Configurações gerais"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações aparecerão aqui"
      />
    </div>
  );
}

export function AdminBrandManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch brand settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Marca"
        subtitle="Configurações de marca"
      />

      <AdminEmptyState
        icon={Palette}
        title="Nenhuma configuração"
        description="Configurações de marca aparecerão aqui"
      />
    </div>
  );
}

export function AdminUserManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch users
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Usuários"
        subtitle="Usuários do sistema"
      />

      <AdminEmptyState
        icon={Users}
        title="Nenhum usuário"
        description="Usuários aparecerão aqui"
      />
    </div>
  );
}

export function AdminRoleManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch roles
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Roles"
        subtitle="Roles do sistema"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma role"
        description="Roles aparecerão aqui"
      />
    </div>
  );
}

export function AdminPermissionManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch permissions
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Permissões"
        subtitle="Permissões do sistema"
      />

      <AdminEmptyState
        icon={Key}
        title="Nenhuma permissão"
        description="Permissões aparecerão aqui"
      />
    </div>
  );
}

export function AdminNotificationManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notifications
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Notificações"
        subtitle="Notificações do sistema"
      />

      <AdminEmptyState
        icon={Bell}
        title="Nenhuma notificação"
        description="Notificações aparecerão aqui"
      />
    </div>
  );
}

export function AdminAnnouncementManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch announcements
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Comunicados"
        subtitle="Comunicados do sistema"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhum comunicado"
        description="Comunicados aparecerão aqui"
      />
    </div>
  );
}

export function AdminTemplateManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Templates"
        subtitle="Templates do sistema"
      />

      <AdminEmptyState
        icon={FileText}
        title="Nenhum template"
        description="Templates aparecerão aqui"
      />
    </div>
  );
}

export function AdminEmailManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch email templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Email"
        subtitle="Templates de email"
      />

      <AdminEmptyState
        icon={Mail}
        title="Nenhum template"
        description="Templates de email aparecerão aqui"
      />
    </div>
  );
}

export function AdminStorageManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch storage settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Storage"
        subtitle="Configurações de storage"
      />

      <AdminEmptyState
        icon={HardDrive}
        title="Nenhuma configuração"
        description="Configurações de storage aparecerão aqui"
      />
    </div>
  );
}

export function AdminSecurityManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch security settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Segurança"
        subtitle="Configurações de segurança"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma configuração"
        description="Configurações de segurança aparecerão aqui"
      />
    </div>
  );
}

export function AdminCourseManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch course settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador de Cursos"
        subtitle="Configurações de cursos"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações de cursos aparecerão aqui"
      />
    </div>
  );
}

export function AdminSystemManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch system settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gerenciador do Sistema"
        subtitle="Configurações do sistema"
      />

      <AdminEmptyState
        icon={Server}
        title="Nenhuma configuração"
        description="Configurações do sistema aparecerão aqui"
      />
    </div>
  );
}

export function AdminFaqAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch FAQ
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de FAQ"
        subtitle="Perguntas frequentes"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhuma pergunta"
        description="Perguntas frequentes aparecerão aqui"
      />
    </div>
  );
}

export function AdminCategoryAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch categories
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Categorias"
        subtitle="Categorias de cursos"
      />

      <AdminEmptyState
        icon={Tag}
        title="Nenhuma categoria"
        description="Categorias aparecerão aqui"
      />
    </div>
  );
}

export function AdminBannerAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch banners
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Banners"
        subtitle="Banners da plataforma"
      />

      <AdminEmptyState
        icon={Image}
        title="Nenhum banner"
        description="Banners aparecerão aqui"
      />
    </div>
  );
}

export function AdminHomeAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch home sections
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Home"
        subtitle="Seções da página inicial"
      />

      <AdminEmptyState
        icon={LayoutDashboard}
        title="Nenhuma seção"
        description="Seções da home aparecerão aqui"
      />
    </div>
  );
}

export function AdminTrashAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch trash items
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Lixeira"
        subtitle="Itens excluídos"
      />

      <AdminEmptyState
        icon={Trash2}
        title="Lixeira vazia"
        description="Itens excluídos aparecerão aqui"
      />
    </div>
  );
}

export function AdminLogAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch logs
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Logs"
        subtitle="Logs do sistema"
      />

      <AdminEmptyState
        icon={Activity}
        title="Nenhum log"
        description="Logs aparecerão aqui"
      />
    </div>
  );
}

export function AdminSettingsAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Configurações"
        subtitle="Configurações gerais"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações aparecerão aqui"
      />
    </div>
  );
}

export function AdminBrandAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch brand settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Marca"
        subtitle="Configurações de marca"
      />

      <AdminEmptyState
        icon={Palette}
        title="Nenhuma configuração"
        description="Configurações de marca aparecerão aqui"
      />
    </div>
  );
}

export function AdminUserAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch users
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Usuários"
        subtitle="Usuários do sistema"
      />

      <AdminEmptyState
        icon={Users}
        title="Nenhum usuário"
        description="Usuários aparecerão aqui"
      />
    </div>
  );
}

export function AdminRoleAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch roles
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Roles"
        subtitle="Roles do sistema"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma role"
        description="Roles aparecerão aqui"
      />
    </div>
  );
}

export function AdminPermissionAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch permissions
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Permissões"
        subtitle="Permissões do sistema"
      />

      <AdminEmptyState
        icon={Key}
        title="Nenhuma permissão"
        description="Permissões aparecerão aqui"
      />
    </div>
  );
}

export function AdminNotificationAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notifications
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Notificações"
        subtitle="Notificações do sistema"
      />

      <AdminEmptyState
        icon={Bell}
        title="Nenhuma notificação"
        description="Notificações aparecerão aqui"
      />
    </div>
  );
}

export function AdminAnnouncementAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch announcements
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Comunicados"
        subtitle="Comunicados do sistema"
      />

      <AdminEmptyState
        icon={MessageSquare}
        title="Nenhum comunicado"
        description="Comunicados aparecerão aqui"
      />
    </div>
  );
}

export function AdminTemplateAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Templates"
        subtitle="Templates do sistema"
      />

      <AdminEmptyState
        icon={FileText}
        title="Nenhum template"
        description="Templates aparecerão aqui"
      />
    </div>
  );
}

export function AdminEmailAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch email templates
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Email"
        subtitle="Templates de email"
      />

      <AdminEmptyState
        icon={Mail}
        title="Nenhum template"
        description="Templates de email aparecerão aqui"
      />
    </div>
  );
}

export function AdminStorageAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch storage settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Storage"
        subtitle="Configurações de storage"
      />

      <AdminEmptyState
        icon={HardDrive}
        title="Nenhuma configuração"
        description="Configurações de storage aparecerão aqui"
      />
    </div>
  );
}

export function AdminSecurityAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch security settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Segurança"
        subtitle="Configurações de segurança"
      />

      <AdminEmptyState
        icon={Shield}
        title="Nenhuma configuração"
        description="Configurações de segurança aparecerão aqui"
      />
    </div>
  );
}

export function AdminCourseAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch course settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração de Cursos"
        subtitle="Configurações de cursos"
      />

      <AdminEmptyState
        icon={Settings}
        title="Nenhuma configuração"
        description="Configurações de cursos aparecerão aqui"
      />
    </div>
  );
}

export function AdminSystemAdmin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch system settings
    setLoading(false);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Administração do Sistema"
        subtitle="Configurações do sistema"
      />

      <AdminEmptyState
        icon={Server}
        title="Nenhuma configuração"
        description="Configurações do sistema aparecerão aqui"
      />
    </div>
  );
}