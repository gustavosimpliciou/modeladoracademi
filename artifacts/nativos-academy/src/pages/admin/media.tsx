import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminModal, AdminInput, AdminSelect, AdminTextarea, AdminSearchInput, AdminFilterSelect, AdminPagination, AdminConfirmDialog, AdminToast, AdminMediaCard, AdminImageUpload } from '../../components/admin-ui';
import { Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Copy, MoreVertical, Image, Video, FileText, Upload, FolderOpen, Grid, List, SortAsc, SortDesc, ArrowUpDown, SlidersHorizontal, Settings, Database, HardDrive, Server, Wifi, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, Award, Bell, MessageSquare, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminMediaLibrary() {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    fileName: '',
    type: 'image',
    category: 'images',
    url: '',
  });

  const fetchMedia = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '24' });
    if (search) params.set('search', search);
    if (type !== 'all') params.set('type', type);
    
    fetch(`/api/admin/media?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setMedia(data.media || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMedia(); }, [page, search, type]);

  const handleUpload = () => {
    fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setShowModal(false); setToast('Arquivo enviado com sucesso!'); fetchMedia(); })
      .catch(() => setToast('Erro ao enviar arquivo'));
  };

  const handleDelete = () => {
    if (!selectedMedia) return;
    fetch(`/api/admin/media/${selectedMedia.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
    })
      .then(() => { setShowDelete(false); setToast('Arquivo excluído!'); fetchMedia(); })
      .catch(() => setToast('Erro ao excluir'));
  };

  const totalPages = Math.ceil(total / 24);

  return (
    <div>
      <AdminPageHeader
        title="Biblioteca de Mídia"
        subtitle="Gerencie todos os arquivos da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Upload</AdminButton>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Buscar arquivos..." className="flex-1" />
        <AdminFilterSelect
          label="Tipo"
          value={type}
          onChange={setType}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'image', label: 'Imagens' },
            { value: 'video', label: 'Vídeos' },
            { value: 'document', label: 'Documentos' },
            { value: 'model_3d', label: 'Modelos 3D' },
          ]}
        />
      </div>

      {loading ? (
        <AdminLoading />
      ) : media.length === 0 ? (
        <AdminEmptyState
          icon={Image}
          title="Nenhum arquivo encontrado"
          description="Faça upload de imagens, vídeos, documentos ou modelos 3D"
          action={<AdminButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Upload</AdminButton>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map(item => (
              <AdminMediaCard
                key={item.id}
                media={item}
                onView={() => window.open(item.url, '_blank')}
                onCopy={() => { navigator.clipboard.writeText(item.url); setToast('URL copiada!'); }}
                onDelete={() => { setSelectedMedia(item); setShowDelete(true); }}
              />
            ))}
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={24} />
        </>
      )}

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload de Arquivo" size="lg">
        <div className="space-y-4">
          <AdminImageUpload
            label="Arquivo"
            value={form.url}
            onChange={(url: string) => setForm({ ...form, url })}
            accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : type === 'document' ? '.pdf,.zip' : '*/*'}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect label="Tipo" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={[
              { value: 'image', label: 'Imagem' },
              { value: 'video', label: 'Vídeo' },
              { value: 'document', label: 'Documento' },
              { value: 'model_3d', label: 'Modelo 3D' },
            ]} />
            <AdminSelect label="Categoria" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} options={[
              { value: 'images', label: 'Imagens' },
              { value: 'videos', label: 'Vídeos' },
              { value: 'documents', label: 'Documentos' },
              { value: 'models_3d', label: 'Modelos 3D' },
            ]} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={Upload} onClick={handleUpload}>Enviar</AdminButton>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Excluir Arquivo"
        message={`Tem certeza que deseja excluir "${selectedMedia?.fileName}"?`}
        confirmLabel="Excluir"
      />

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}