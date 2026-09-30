import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminInput, AdminSelect, AdminTextarea, AdminToggle, AdminColorPicker, AdminImageUpload, AdminTabs, AdminToast, AdminHomeSectionCard } from '../../components/admin-ui';
import { Palette, LayoutDashboard, Image, Type, Link2, Bell, MessageSquare, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminPersonalization() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<string | null>(null);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [heroSection, setHeroSection] = useState({
    title: 'Conhecimento em movimento.',
    subtitle: 'A academia para quem quer transformar curiosidade em repertório, habilidade e trabalho bem feito.',
    ctaText: 'Explorar a academia',
    ctaUrl: '/sign-up',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setHomeSections(data.homeSections || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = () => {
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` },
      body: JSON.stringify({ key: 'hero', value: heroSection, type: 'object', category: 'home', label: 'Seção Hero' }),
    })
      .then(() => setToast('Configurações salvas!'))
      .catch(() => setToast('Erro ao salvar'));
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Personalização"
        subtitle="Edite textos, imagens e conteúdo da plataforma"
        actions={
          <AdminButton variant="primary" icon={Palette} onClick={handleSave}>Salvar</AdminButton>
        }
      />

      <AdminTabs
        tabs={[
          { id: 'home', label: 'Home' },
          { id: 'banners', label: 'Banners' },
          { id: 'categories', label: 'Categorias' },
          { id: 'faq', label: 'FAQ' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'home' && (
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Seção Hero</h3>
            <div className="space-y-4">
              <AdminInput label="Título" value={heroSection.title} onChange={(e: any) => setHeroSection({ ...heroSection, title: e.target.value })} />
              <AdminTextarea label="Subtítulo" value={heroSection.subtitle} onChange={(e: any) => setHeroSection({ ...heroSection, subtitle: e.target.value })} rows={3} />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Texto do CTA" value={heroSection.ctaText} onChange={(e: any) => setHeroSection({ ...heroSection, ctaText: e.target.value })} />
                <AdminInput label="URL do CTA" value={heroSection.ctaUrl} onChange={(e: any) => setHeroSection({ ...heroSection, ctaUrl: e.target.value })} />
              </div>
              <AdminImageUpload label="Imagem de Fundo" value={heroSection.imageUrl} onChange={(url: string) => setHeroSection({ ...heroSection, imageUrl: url })} />
              <AdminToggle checked={heroSection.isActive} onChange={(checked: boolean) => setHeroSection({ ...heroSection, isActive: checked })} label="Seção ativa" />
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Seções da Home</h3>
            <div className="space-y-3">
              {homeSections.map(section => (
                <AdminHomeSectionCard
                  key={section.id}
                  section={section}
                  onEdit={() => {}}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === 'banners' && (
        <AdminEmptyState icon={Image} title="Banners" description="Gerencie banners da plataforma" />
      )}

      {activeTab === 'categories' && (
        <AdminEmptyState icon={LayoutDashboard} title="Categorias" description="Gerencie categorias de cursos" />
      )}

      {activeTab === 'faq' && (
        <AdminEmptyState icon={MessageSquare} title="FAQ" description="Edite perguntas frequentes" />
      )}

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}