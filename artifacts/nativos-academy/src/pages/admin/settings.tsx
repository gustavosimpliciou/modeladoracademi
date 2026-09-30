import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminInput, AdminSelect, AdminTextarea, AdminToggle, AdminColorPicker, AdminImageUpload, AdminTabs, AdminToast, AdminBrandSettingsCard, AdminSettingCard, AdminHomeSectionCard } from '../../components/admin-ui';
import { Settings, Palette, Bell, Shield, Database, HardDrive, Server, Wifi, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, Award, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState<string | null>(null);
  const [brand, setBrand] = useState({
    platformName: 'Nativos3D Academy',
    primaryColor: '#ff6a00',
    secondaryColor: '#111111',
    accentColor: '#ff8126',
    supportEmail: 'suporte@nativos3d.com',
    websiteUrl: 'https://nativos3d.com',
  });
  const [settings, setSettings] = useState<any[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setSettings(data.settings || []); setHomeSections(data.homeSections || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveBrand = () => {
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify({ key: 'brand', value: brand, type: 'object', category: 'brand', label: 'Configurações de Marca' }),
    })
      .then(() => setToast('Configurações salvas!'))
      .catch(() => setToast('Erro ao salvar'));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Configurações"
        subtitle="Gerencie as configurações da plataforma"
        actions={
          <AdminButton variant="primary" icon={Settings} onClick={handleSaveBrand}>Salvar</AdminButton>
        }
      />

      <AdminTabs
        tabs={[
          { id: 'general', label: 'Geral' },
          { id: 'brand', label: 'Marca' },
          { id: 'email', label: 'Email' },
          { id: 'notifications', label: 'Notificações' },
          { id: 'security', label: 'Segurança' },
          { id: 'storage', label: 'Storage' },
          { id: 'certificates', label: 'Certificados' },
          { id: 'courses', label: 'Cursos' },
          { id: 'system', label: 'Sistema' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'general' && (
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Informações Gerais</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Nome da Plataforma" value={brand.platformName} onChange={(e: any) => setBrand({ ...brand, platformName: e.target.value })} />
              <AdminInput label="Email de Suporte" value={brand.supportEmail} onChange={(e: any) => setBrand({ ...brand, supportEmail: e.target.value })} type="email" />
              <AdminInput label="Website" value={brand.websiteUrl} onChange={(e: any) => setBrand({ ...brand, websiteUrl: e.target.value })} />
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Configurações de Cursos</h3>
            <div className="space-y-3">
              <AdminToggle checked={true} onChange={() => {}} label="Acesso sequencial" description="Alunos devem completar módulos em ordem" />
              <AdminToggle checked={true} onChange={() => {}} label="Permitir voltar" description="Alunos podem rever módulos anteriores" />
              <AdminToggle checked={false} onChange={() => {}} label="Exigir vídeo" description="Alunos devem assistir vídeos para completar" />
              <AdminToggle checked={false} onChange={() => {}} label="Exigir atividade" description="Alunos devem completar atividades" />
              <AdminToggle checked={true} onChange={() => {}} label="Emitir certificado" description="Gerar certificado ao concluir o curso" />
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === 'brand' && (
        <div className="space-y-6">
          <AdminBrandSettingsCard brand={brand} onEdit={() => {}} />
          
          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Cores</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <AdminColorPicker label="Cor Primária" value={brand.primaryColor} onChange={(color: string) => setBrand({ ...brand, primaryColor: color })} />
              <AdminColorPicker label="Cor Secundária" value={brand.secondaryColor} onChange={(color: string) => setBrand({ ...brand, secondaryColor: color })} />
              <AdminColorPicker label="Cor de Destaque" value={brand.accentColor} onChange={(color: string) => setBrand({ ...brand, accentColor: color })} />
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Imagens</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminImageUpload label="Logo" value="" onChange={() => {}} />
              <AdminImageUpload label="Favicon" value="" onChange={() => {}} />
              <AdminImageUpload label="Imagem de Login" value="" onChange={() => {}} />
              <AdminImageUpload label="Imagem da Home" value="" onChange={() => {}} />
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Redes Sociais</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Instagram" placeholder="https://instagram.com/..." />
              <AdminInput label="YouTube" placeholder="https://youtube.com/..." />
              <AdminInput label="TikTok" placeholder="https://tiktok.com/..." />
              <AdminInput label="LinkedIn" placeholder="https://linkedin.com/..." />
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === 'email' && (
        <AdminEmptyState icon={Bell} title="Configurações de Email" description="Configure templates de email e SMTP" />
      )}

      {activeTab === 'notifications' && (
        <AdminEmptyState icon={Bell} title="Configurações de Notificações" description="Configure notificações push e email" />
      )}

      {activeTab === 'security' && (
        <AdminEmptyState icon={Shield} title="Segurança" description="Configure 2FA, sessões e permissões" />
      )}

      {activeTab === 'storage' && (
        <AdminEmptyState icon={HardDrive} title="Storage" description="Configure armazenamento de arquivos" />
      )}

      {activeTab === 'certificates' && (
        <AdminEmptyState icon={Award} title="Certificados" description="Configure templates de certificados" />
      )}

      {activeTab === 'courses' && (
        <AdminEmptyState icon={Settings} title="Configurações de Cursos" description="Configure padrões de cursos" />
      )}

      {activeTab === 'system' && (
        <AdminEmptyState icon={Server} title="Sistema" description="Configurações do sistema" />
      )}

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}