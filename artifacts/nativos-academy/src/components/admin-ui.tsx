import { useAdminSession } from '@/lib/admin-session';
import { useState, type ReactNode, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, Layers, Play, HelpCircle, FileText, Users, GraduationCap, Award, Image, FolderOpen, Tag, Bell, BarChart3, Palette, Settings, ScrollText, Menu, X, LogOut, ChevronDown, Search, Plus, Video, ClipboardList, Upload, MessageSquare, Shield, Database, HardDrive, Activity, Trash2, Edit, Eye, MoreVertical, Check, AlertTriangle, Info, TrendingUp, Clock, Star, Download, Filter, RefreshCw, Save, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, GripVertical, Copy, ExternalLink, Link2, Unlock, Lock, EyeOff, Calendar, Target, Zap, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageCircle, Cog, ChevronUp, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useClerk } from '@clerk/react';

const adminNav = [
  { section: 'Principal' },
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Conteúdo' },
  { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  { href: '/admin/construtor', label: 'Construtor de Cursos', icon: Layers },
  { href: '/admin/midia', label: 'Biblioteca de Mídia', icon: Image },
  { section: 'Avaliação' },
  { href: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
  { section: 'Pessoas' },
  { href: '/admin/alunos', label: 'Alunos', icon: Users },
  { href: '/admin/instrutores', label: 'Instrutores', icon: GraduationCap },
  { section: 'Engajamento' },
  { section: 'Dados' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
  { section: 'Sistema' },
  { href: '/admin/personalizacao', label: 'Personalização', icon: Palette },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { signOut, user } = useClerk();
  const session = useAdminSession();

  const isActive = (href: string) => {
    if (href === '/admin') return location === '/admin';
    return location.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ redirectUrl: `${import.meta.env.BASE_URL}sign-in` });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#111111] border-r border-[#222222] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-[#222222] px-5">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff6a00]">
                <span className="font-display text-xl font-bold italic">N</span>
              </div>
              <div>
                <span className="block font-display text-sm font-bold tracking-wider">NATIVOS</span>
                <span className="block font-mono text-[9px] tracking-[0.2em] text-[#ff6a00]">ADMIN</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {adminNav.map((item, index) => {
              if (item.section !== undefined) {
                return (
                  <div key={index} className="mb-2 mt-4 first:mt-0">
                    <span className="block px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
                      {item.section}
                    </span>
                  </div>
                );
              }
              if (!item.href || !item.icon) return null;
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active ? 'bg-[#ff6a00] text-white shadow-[0_4px_12px_rgba(255,106,0,0.3)]' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#222222] p-4">
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#1a1a1a]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6a00]/20 text-[#ff6a00]">
                  <span className="text-sm font-bold">{user?.firstName?.[0] || user?.primaryEmailAddress?.emailAddress?.[0] || 'U'}</span>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium text-white">{user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Admin'}</span>
                  <span className="block text-[11px] text-gray-500">{session?.roles.join(", ") || "Admin"}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-[#222222] bg-[#1a1a1a] p-1 shadow-xl">
                  <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#222222] bg-[#0a0a0a]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white lg:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-2 sm:flex">
              <Search size={16} className="text-gray-500" />
              <input type="text" placeholder="Buscar..." className="w-48 bg-transparent text-sm text-white placeholder-gray-500 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff6a00]" />
            </button>
            <Link href="/" className="rounded-lg border border-[#222222] px-3 py-1.5 text-sm text-gray-400 hover:bg-[#1a1a1a] hover:text-white">Ver site</Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-[#222222] bg-[#111111] ${className}`}>{children}</div>;
}

export function AdminButton({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md' | 'lg'; icon?: React.ComponentType<{ size?: number; className?: string }>; onClick?: () => void; disabled?: boolean; className?: string; }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/50 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = { primary: 'bg-[#ff6a00] text-white hover:bg-[#ff8126] shadow-[0_4px_12px_rgba(255,106,0,0.3)]', secondary: 'border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#222] hover:border-[#444]', danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20', ghost: 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white' };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />}{children}</button>;
}

export function AdminInput({ label, error, className = '', ...props }: { label?: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <input {...props} className={`w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]/50 ${error ? 'border-red-500' : ''}`} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AdminSelect({ label, options, className = '', ...props }: { label?: string; options: { value: string; label: string }[]; className?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <select {...props} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]/50">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
    </div>
  );
}

export function AdminTextarea({ label, className = '', ...props }: { label?: string; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <textarea {...props} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]/50" />
    </div>
  );
}

export function AdminTable({ columns, data, onRowClick, emptyMessage = 'Nenhum registro encontrado' }: { columns: { key: string; label: string; render?: (value: any, row: any) => ReactNode }[]; data: any[]; onRowClick?: (row: any) => void; emptyMessage?: string; }) {
  if (data.length === 0) return <div className="flex flex-col items-center justify-center py-16 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a]"><Database size={24} className="text-gray-600" /></div><p className="text-sm text-gray-500">{emptyMessage}</p></div>;
  return (
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[#222222]">{columns.map(col => <th key={col.key} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{col.label}</th>)}</tr></thead><tbody className="divide-y divide-[#1a1a1a]">{data.map((row, i) => <tr key={i} onClick={() => onRowClick?.(row)} className={`${onRowClick ? 'cursor-pointer hover:bg-[#1a1a1a]' : ''} transition`}>{columns.map(col => <td key={col.key} className="px-4 py-3 text-sm text-gray-300">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>)}</tr>)}</tbody></table></div>
  );
}

export function AdminModal({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} rounded-xl border border-[#333] bg-[#111111] shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-[#222222] px-6 py-4"><h2 className="font-display text-lg font-bold text-white">{title}</h2><button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><X size={20} /></button></div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function AdminTabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; }) {
  return <div className="mb-6 flex gap-1 rounded-lg border border-[#222222] bg-[#0a0a0a] p-1">{tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={`rounded-md px-4 py-2 text-sm font-medium transition ${active === tab.id ? 'bg-[#ff6a00] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}>{tab.label}</button>)}</div>;
}

export function AdminStatCard({ label, value, change, icon: Icon, trend }: { label: string; value: string | number; change?: string; icon: React.ComponentType<{ size?: number; className?: string }>; trend?: 'up' | 'down' | 'neutral'; }) {
  return (
    <AdminCard className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-400">{label}</p><p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>{change && <p className={`mt-1 flex items-center gap-1 text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>{trend === 'up' && <TrendingUp size={12} />}{trend === 'down' && <TrendingUp size={12} className="rotate-180" />}{change}</p>}</div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff6a00]/10"><Icon size={24} className="text-[#ff6a00]" /></div></div></AdminCard>
  );
}

export function AdminEmptyState({ icon: Icon, title, description, action }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; description?: string; action?: ReactNode; }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a]"><Icon size={24} className="text-gray-600" /></div><h3 className="font-display text-lg font-bold text-white">{title}</h3>{description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}

export function AdminLoading() {
  return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff6a00] border-t-transparent" /></div>;
}

export function AdminConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', danger = true }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; danger?: boolean; }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[#333] bg-[#111111] p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10"><AlertTriangle size={24} className="text-red-400" /></div>
        <h2 className="font-display text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-gray-400">{message}</p>
        <div className="mt-6 flex gap-3"><AdminButton variant="secondary" onClick={onClose} className="flex-1">Cancelar</AdminButton><AdminButton variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }} className="flex-1">{confirmLabel}</AdminButton></div>
      </div>
    </div>
  );
}

export function AdminToast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'warning' | 'info'; onClose: () => void; }) {
  const icons = { success: Check, error: X, warning: AlertTriangle, info: Info };
  const colors = { success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', error: 'border-red-500/30 bg-red-500/10 text-red-400', warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400', info: 'border-blue-500/30 bg-blue-500/10 text-blue-400' };
  const Icon = icons[type];
  return <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-xl ${colors[type]}`}><Icon size={18} /><span className="text-sm font-medium text-white">{message}</span><button onClick={onClose} className="ml-2 text-gray-400 hover:text-white"><X size={16} /></button></div>;
}

export function AdminPagination({ page, totalPages, onPageChange, total, limit }: { page: number; totalPages: number; onPageChange: (page: number) => void; total: number; limit: number; }) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return <div className="flex items-center justify-between border-t border-[#222222] px-4 py-3"><p className="text-sm text-gray-500">Mostrando {start}-{end} de {total}</p><div className="flex items-center gap-2"><button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="rounded-lg border border-[#333] p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"><ChevronLeft size={16} /></button><span className="text-sm text-gray-400">{page} / {totalPages}</span><button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="rounded-lg border border-[#333] p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"><ChevronRight size={16} /></button></div></div>;
}

export function AdminSearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string; }) {
  return <div className={`relative ${className}`}><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#ff6a00]" /></div>;
}

export function AdminFilterSelect({ label, options, value, onChange, className = '' }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; className?: string; }) {
  return <div className={className}><label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ff6a00]">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>;
}

export function AdminBadge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; }) {
  const variants = { default: 'bg-[#1a1a1a] text-gray-400 border-[#333]', success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', danger: 'bg-red-500/10 text-red-400 border-red-500/20', info: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>{children}</span>;
}

export function AdminToggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label?: string; description?: string; }) {
  return <label className="flex cursor-pointer items-center gap-3"><div onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#ff6a00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} /></div>{description && <span className="text-xs text-gray-500">{description}</span>}{label && <span className="text-sm text-gray-300">{label}</span>}</label>;
}

export function AdminProgressBar({ value, max = 100, label }: { value: number; max?: number; label?: string; }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return <div>{label && <div className="mb-1 flex items-center justify-between text-xs"><span className="text-gray-400">{label}</span><span className="text-gray-500">{percent.toFixed(0)}%</span></div>}<div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]"><div className="h-full rounded-full bg-[#ff6a00] transition-all duration-500" style={{ width: `${percent}%` }} /></div></div>;
}

export function AdminStatusDot({ status }: { status: 'active' | 'inactive' | 'pending' | 'error'; }) {
  const colors = { active: 'bg-emerald-400', inactive: 'bg-gray-500', pending: 'bg-yellow-400', error: 'bg-red-400' };
  return <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${colors[status]}`} /><span className="text-sm capitalize text-gray-400">{status}</span></span>;
}

export function AdminUserAvatar({ name, imageUrl, size = 'md' }: { name: string; imageUrl?: string; size?: 'sm' | 'md' | 'lg'; }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  if (imageUrl) return <img src={imageUrl} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-[#ff6a00]/20 font-bold text-[#ff6a00]`}>{name?.[0]?.toUpperCase() || 'U'}</div>;
}

export function AdminCourseCard({ course, onEdit, onDelete, onDuplicate, onPublish }: { course: any; onEdit?: () => void; onDelete?: () => void; onDuplicate?: () => void; onPublish?: () => void; }) {
  const statusColors = { draft: 'warning', published: 'success', archived: 'default' } as const;
  return (
    <AdminCard className="overflow-hidden">
      <div className="relative h-40">{course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[#1a1a1a]"><BookOpen size={32} className="text-gray-600" /></div>}<div className="absolute right-3 top-3"><AdminBadge variant={statusColors[course.status as keyof typeof statusColors] || 'default'}>{course.status}</AdminBadge></div></div>
      <div className="p-4"><h3 className="font-display text-lg font-bold text-white">{course.title}</h3><p className="mt-1 line-clamp-2 text-sm text-gray-400">{course.description}</p><div className="mt-3 flex items-center gap-4 text-xs text-gray-500"><span className="flex items-center gap-1"><Layers size={12} />{course.modules || 0} módulos</span><span className="flex items-center gap-1"><Play size={12} />{course.lessons || 0} aulas</span><span className="flex items-center gap-1"><Users size={12} />{course.enrolledCount || 0} alunos</span></div><div className="mt-4 flex items-center gap-2">{onEdit && <AdminButton variant="secondary" size="sm" icon={Edit} onClick={onEdit}>Editar</AdminButton>}{onPublish && <AdminButton variant="primary" size="sm" icon={Eye} onClick={onPublish}>{course.status === 'published' ? 'Despublicar' : 'Publicar'}</AdminButton>}{onDuplicate && <AdminButton variant="ghost" size="sm" icon={Copy} onClick={onDuplicate}>Duplicar</AdminButton>}{onDelete && <AdminButton variant="danger" size="sm" icon={Trash2} onClick={onDelete}>Excluir</AdminButton>}</div></div>
    </AdminCard>
  );
}

export function AdminModuleCard({ module, onEdit, onDelete, onAddLesson }: { module: any; onEdit?: () => void; onDelete?: () => void; onAddLesson?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10"><FolderOpen size={20} className="text-[#ff6a00]" /></div><div><h4 className="font-medium text-white">{module.title}</h4><p className="mt-0.5 text-sm text-gray-500">{module.description}</p><div className="mt-2 flex items-center gap-3 text-xs text-gray-500"><span>{module.lessonCount || 0} aulas</span><span>{module.progress || 0}% completo</span></div></div></div><div className="flex items-center gap-1">{onAddLesson && <button onClick={onAddLesson} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Plus size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminLessonCard({ lesson, onEdit, onDelete, onPreview }: { lesson: any; onEdit?: () => void; onDelete?: () => void; onPreview?: () => void; }) {
  const statusColors = { completed: 'success', in_progress: 'warning', available: 'info', locked: 'default' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]"><Play size={14} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{lesson.title}</h4><p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{lesson.description}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={statusColors[lesson.status as keyof typeof statusColors] || 'default'}>{lesson.status}</AdminBadge><span className="text-xs text-gray-500">{lesson.duration}</span><span className="text-xs text-gray-500">{lesson.type}</span></div></div></div><div className="flex items-center gap-1">{onPreview && <button onClick={onPreview} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminQuizCard({ quiz, onEdit, onDelete, onPreview }: { quiz: any; onEdit?: () => void; onDelete?: () => void; onPreview?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10"><HelpCircle size={20} className="text-[#ff6a00]" /></div><div><h4 className="font-medium text-white">{quiz.title}</h4><p className="mt-0.5 text-sm text-gray-500">{quiz.description}</p><div className="mt-2 flex items-center gap-3 text-xs text-gray-500"><span>{quiz.questionCount || 0} questões</span><span>Nota mínima: {quiz.minScore || 70}%</span><span>{quiz.maxAttempts || 3} tentativas</span></div></div></div><div className="flex items-center gap-1">{onPreview && <button onClick={onPreview} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminStudentCard({ student, onView, onEdit, onBlock }: { student: any; onView?: () => void; onEdit?: () => void; onBlock?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><AdminUserAvatar name={student.name} imageUrl={student.imageUrl} /><div><h4 className="font-medium text-white">{student.name}</h4><p className="mt-0.5 text-sm text-gray-500">{student.email}</p><div className="mt-2 flex items-center gap-3"><AdminStatusDot status={student.isActive ? 'active' : 'inactive'} /><span className="text-xs text-gray-500">{student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onBlock && <button onClick={onBlock} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">{student.isActive ? <Lock size={16} /> : <Unlock size={16} />}</button>}</div></div>
    </AdminCard>
  );
}

export function AdminInstructorCard({ instructor, onEdit, onDelete, onAssign }: { instructor: any; onEdit?: () => void; onDelete?: () => void; onAssign?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><AdminUserAvatar name={instructor.name} imageUrl={instructor.photo} /><div><h4 className="font-medium text-white">{instructor.name}</h4><p className="mt-0.5 text-sm text-gray-500">{instructor.bio}</p><div className="mt-2 flex items-center gap-3 text-xs text-gray-500"><span>{instructor.courseCount || 0} cursos</span><span>{instructor.studentCount || 0} alunos</span>{instructor.rating > 0 && <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" />{instructor.rating}</span>}</div></div></div><div className="flex items-center gap-1">{onAssign && <button onClick={onAssign} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Users size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminCertificateCard({ certificate, onView, onRevoke, onDownload }: { certificate: any; onView?: () => void; onRevoke?: () => void; onDownload?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10"><Award size={20} className="text-[#ff6a00]" /></div><div><h4 className="font-medium text-white">{certificate.courseTitle || 'Certificado'}</h4><p className="mt-0.5 text-sm text-gray-500">{certificate.userName || 'Aluno'}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={certificate.revokedAt ? 'danger' : 'success'}>{certificate.revokedAt ? 'Revogado' : 'Válido'}</AdminBadge><span className="text-xs text-gray-500">{certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onDownload && <button onClick={onDownload} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Download size={16} /></button>}{onRevoke && !certificate.revokedAt && <button onClick={onRevoke} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><X size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminNotificationCard({ notification, onView, onDelete }: { notification: any; onView?: () => void; onDelete?: () => void; }) {
  const typeColors = { info: 'info', warning: 'warning', news: 'info', course: 'success', quiz: 'warning', certificate: 'success' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><Bell size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{notification.title}</h4><p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{notification.message}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={typeColors[notification.type as keyof typeof typeColors] || 'default'}>{notification.type}</AdminBadge><span className="text-xs text-gray-500">{notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminBannerCard({ banner, onEdit, onDelete, onToggle }: { banner: any; onEdit?: () => void; onDelete?: () => void; onToggle?: () => void; }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="relative h-32">{banner.imageUrl ? <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[#1a1a1a]"><Image size={32} className="text-gray-600" /></div>}<div className="absolute right-3 top-3"><AdminBadge variant={banner.status === 'active' ? 'success' : 'default'}>{banner.status}</AdminBadge></div></div>
      <div className="p-4"><h4 className="font-medium text-white">{banner.title}</h4><p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{banner.description}</p><div className="mt-3 flex items-center gap-2">{onToggle && <AdminButton variant="secondary" size="sm" icon={banner.status === 'active' ? Unlock : Lock} onClick={onToggle}>{banner.status === 'active' ? 'Desativar' : 'Ativar'}</AdminButton>}{onEdit && <AdminButton variant="ghost" size="sm" icon={Edit} onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" size="sm" icon={Trash2} onClick={onDelete}>Excluir</AdminButton>}</div></div>
    </AdminCard>
  );
}

export function AdminCategoryCard({ category, onEdit, onDelete, onToggle }: { category: any; onEdit?: () => void; onDelete?: () => void; onToggle?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10"><Tag size={20} className="text-[#ff6a00]" /></div><div><h4 className="font-medium text-white">{category.name}</h4><p className="mt-0.5 text-sm text-gray-500">{category.description}</p><div className="mt-2 flex items-center gap-3 text-xs text-gray-500"><span>{category.courseCount || 0} cursos</span><AdminStatusDot status={category.isActive ? 'active' : 'inactive'} /></div></div></div><div className="flex items-center gap-1">{onToggle && <button onClick={onToggle} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white">{category.isActive ? <Unlock size={16} /> : <Lock size={16} />}</button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminLogCard({ log }: { log: any }) {
  const actionColors = { create: 'success', update: 'info', delete: 'danger', publish: 'success', unpublish: 'warning', duplicate: 'info', upload: 'success', login: 'info', logout: 'default' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]"><Activity size={16} className="text-gray-400" /></div><div className="flex-1"><div className="flex items-center gap-2"><span className="font-medium text-white">{log.userName || 'Sistema'}</span><AdminBadge variant={actionColors[log.action as keyof typeof actionColors] || 'default'}>{log.action}</AdminBadge></div><p className="mt-1 text-sm text-gray-400">{log.action} {log.resourceType} {log.resourceId && <code className="text-xs text-gray-500">#{log.resourceId}</code>}</p><p className="mt-1 text-xs text-gray-600">{log.createdAt ? new Date(log.createdAt).toLocaleString('pt-BR') : '-'}</p></div></div>
    </AdminCard>
  );
}

export function AdminMediaCard({ media, onView, onDelete, onCopy }: { media: any; onView?: () => void; onDelete?: () => void; onCopy?: () => void; }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="relative h-32">{media.type === 'image' && media.url ? <img src={media.url} alt={media.fileName} className="h-full w-full object-cover" /> : media.type === 'video' && media.url ? <video src={media.url} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[#1a1a1a]"><FileText size={32} className="text-gray-600" /></div>}<div className="absolute right-2 top-2"><AdminBadge variant="default">{media.type}</AdminBadge></div></div>
      <div className="p-3"><h4 className="truncate text-sm font-medium text-white">{media.fileName}</h4><p className="mt-0.5 text-xs text-gray-500">{(media.size / 1024 / 1024).toFixed(2)} MB • {media.createdAt ? new Date(media.createdAt).toLocaleDateString('pt-BR') : '-'}</p><div className="mt-2 flex items-center gap-1">{onView && <button onClick={onView} className="rounded p-1.5 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={14} /></button>}{onCopy && <button onClick={onCopy} className="rounded p-1.5 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Copy size={14} /></button>}{onDelete && <button onClick={onDelete} className="rounded p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={14} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminSubmissionCard({ submission, onView, onGrade, onDelete }: { submission: any; onView?: () => void; onGrade?: () => void; onDelete?: () => void; }) {
  const statusColors = { submitted: 'warning', graded: 'success', returned: 'danger' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><Upload size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{submission.userName || 'Aluno'}</h4><p className="mt-0.5 text-sm text-gray-500">{submission.assignmentTitle || 'Atividade'}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={statusColors[submission.status as keyof typeof statusColors] || 'default'}>{submission.status}</AdminBadge>{submission.score !== null && submission.score !== undefined && <span className="text-xs text-gray-500">Nota: {submission.score}/{submission.maxScore || 100}</span>}<span className="text-xs text-gray-500">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onGrade && <button onClick={onGrade} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminQuizAttemptCard({ attempt, onView, onGrade }: { attempt: any; onView?: () => void; onGrade?: () => void; }) {
  const statusColors = { in_progress: 'warning', completed: 'success', graded: 'success', failed: 'danger' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><HelpCircle size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{attempt.userName || 'Aluno'}</h4><p className="mt-0.5 text-sm text-gray-500">{attempt.quizTitle || 'Quiz'}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={statusColors[attempt.status as keyof typeof statusColors] || 'default'}>{attempt.status}</AdminBadge>{attempt.percentage !== undefined && <span className="text-xs text-gray-500">{attempt.percentage.toFixed(0)}%</span>}<span className="text-xs text-gray-500">{attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onGrade && <button onClick={onGrade} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminEnrollmentCard({ enrollment, onView, onEdit, onDelete }: { enrollment: any; onView?: () => void; onEdit?: () => void; onDelete?: () => void; }) {
  const statusColors = { active: 'success', completed: 'success', expired: 'warning', cancelled: 'danger', pending: 'warning' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><GraduationCap size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{enrollment.userName || 'Aluno'}</h4><p className="mt-0.5 text-sm text-gray-500">{enrollment.courseTitle || 'Curso'}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={statusColors[enrollment.status as keyof typeof statusColors] || 'default'}>{enrollment.status}</AdminBadge><span className="text-xs text-gray-500">{enrollment.progress || 0}% completo</span><span className="text-xs text-gray-500">{enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminUserCard({ user, onView, onEdit, onBlock, onDelete }: { user: any; onView?: () => void; onEdit?: () => void; onBlock?: () => void; onDelete?: () => void; }) {
  const roleColors = { SUPER_ADMIN: 'danger', ADMIN: 'warning', INSTRUCTOR: 'info', STUDENT: 'default' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><AdminUserAvatar name={user.name} imageUrl={user.imageUrl} /><div><h4 className="font-medium text-white">{user.name}</h4><p className="mt-0.5 text-sm text-gray-500">{user.email}</p><div className="mt-2 flex items-center gap-3">{user.roleName && <AdminBadge variant={roleColors[user.roleName as keyof typeof roleColors] || 'default'}>{user.roleName}</AdminBadge>}<AdminStatusDot status={user.isActive ? 'active' : 'inactive'} /><span className="text-xs text-gray-500">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}</span></div></div></div><div className="flex items-center gap-1">{onView && <button onClick={onView} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Eye size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onBlock && <button onClick={onBlock} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">{user.isActive ? <Lock size={16} /> : <Unlock size={16} />}</button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminRoleCard({ role, onEdit, onDelete, onAssign }: { role: any; onEdit?: () => void; onDelete?: () => void; onAssign?: () => void; }) {
  const roleColors = { SUPER_ADMIN: 'danger', ADMIN: 'warning', INSTRUCTOR: 'info', STUDENT: 'default' } as const;
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><Shield size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{role.name}</h4><p className="mt-0.5 text-sm text-gray-500">{role.description}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant={roleColors[role.name as keyof typeof roleColors] || 'default'}>{role.name}</AdminBadge><span className="text-xs text-gray-500">{role.permissions?.length || 0} permissões</span>{role.isSystem && <AdminBadge variant="warning">Sistema</AdminBadge>}</div></div></div><div className="flex items-center gap-1">{onAssign && <button onClick={onAssign} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Users size={16} /></button>}{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && !role.isSystem && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminPermissionCard({ permission, onEdit, onDelete }: { permission: any; onEdit?: () => void; onDelete?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><Shield size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{permission.name}</h4><p className="mt-0.5 text-sm text-gray-500">{permission.description}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant="default">{permission.category}</AdminBadge></div></div></div><div className="flex items-center gap-1">{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white"><Edit size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminTrashItemCard({ item, onRestore, onDelete }: { item: any; onRestore?: () => void; onDelete?: () => void; }) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]"><Trash2 size={20} className="text-gray-400" /></div><div><h4 className="font-medium text-white">{item.title || item.name || 'Item'}</h4><p className="mt-0.5 text-sm text-gray-500">{item.resourceType || 'Desconhecido'}</p><div className="mt-2 flex items-center gap-3"><AdminBadge variant="danger">Excluído</AdminBadge><span className="text-xs text-gray-500">{item.deletedAt ? new Date(item.deletedAt).toLocaleDateString('pt-BR') : '-'}</span></div></div></div><div className="flex items-center gap-1">{onRestore && <button onClick={onRestore} className="rounded-lg p-2 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400"><RefreshCw size={16} /></button>}{onDelete && <button onClick={onDelete} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>}</div></div>
    </AdminCard>
  );
}

export function AdminDragDropList({ items, onReorder, renderItem }: { items: any[]; onReorder: (items: any[]) => void; renderItem: (item: any, index: number) => ReactNode; }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    onReorder(newItems);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id || index} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 rounded-lg border border-[#222222] bg-[#111111] p-3 ${draggedIndex === index ? 'opacity-50 border-[#ff6a00]' : ''} cursor-move transition`}>
          <GripVertical size={16} className="text-gray-600" />
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export function AdminQuickActions({ actions }: { actions: { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; onClick: () => void }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <button key={i} onClick={action.onClick} className="flex items-center gap-3 rounded-xl border border-[#222222] bg-[#111111] p-4 text-left transition hover:border-[#ff6a00]/50 hover:bg-[#1a1a1a]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10"><Icon size={20} className="text-[#ff6a00]" /></div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AdminTaskList({ tasks }: { tasks: { id: string; label: string; count: number; icon: React.ComponentType<{ size?: number; className?: string }>; onClick: () => void }[] }) {
  return (
    <AdminCard className="p-5">
      <h3 className="mb-4 font-display text-lg font-bold text-white">Você precisa revisar</h3>
      <div className="space-y-3">
        {tasks.map(task => {
          const Icon = task.icon;
          return (
            <button key={task.id} onClick={task.onClick} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[#1a1a1a]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6a00]/10"><Icon size={16} className="text-[#ff6a00]" /></div>
              <span className="flex-1 text-sm text-gray-300">{task.label}</span>
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#ff6a00] px-2 text-xs font-bold text-white">{task.count}</span>
            </button>
          );
        })}
      </div>
    </AdminCard>
  );
}

export function AdminAlertList({ alerts }: { alerts: { id: string; type: 'error' | 'warning' | 'info'; message: string }[] }) {
  const icons = { error: AlertTriangle, warning: AlertTriangle, info: Info };
  const colors = { error: 'border-red-500/30 bg-red-500/10 text-red-400', warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400', info: 'border-blue-500/30 bg-blue-500/10 text-blue-400' };
  return (
    <div className="space-y-2">
      {alerts.map(alert => {
        const Icon = icons[alert.type];
        return <div key={alert.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${colors[alert.type]}`}><Icon size={18} /><span className="text-sm text-white">{alert.message}</span></div>;
      })}
    </div>
  );
}

export function AdminImageUpload({ value, onChange, label = 'Imagem', accept = 'image/*', preview = true }: { value?: string; onChange: (url: string) => void; label?: string; accept?: string; preview?: boolean; }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };
  const handleFile = async (file: File) => {
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    onChange(url);
    setIsUploading(false);
  };
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      {value && preview ? (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-[#333]">
          <img src={value} alt="" className="h-32 w-full object-cover" />
          <button onClick={() => onChange('')} className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80"><X size={14} /></button>
        </div>
      ) : null}
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${isDragging ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-[#333] hover:border-[#444]'}`}>
        {isUploading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff6a00] border-t-transparent" /> : (<><Upload size={24} className="mb-2 text-gray-500" /><p className="text-sm text-gray-400">Arraste e solte ou</p><label className="mt-2 cursor-pointer text-sm text-[#ff6a00] hover:underline">selecione um arquivo<input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" /></label></>)}
      </div>
    </div>
  );
}

export function AdminColorPicker({ value, onChange, label }: { value: string; onChange: (color: string) => void; label?: string; }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-[#333] bg-transparent" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff6a00]" />
      </div>
    </div>
  );
}

export function AdminVideoUpload({ value, onChange, label = 'Vídeo' }: { value?: string; onChange: (url: string) => void; label?: string; }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };
  const handleFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(prev => { if (prev >= 100) { clearInterval(interval); return 100; } return prev + 10; }), 200);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const url = URL.createObjectURL(file);
    onChange(url);
    setIsUploading(false);
    setProgress(0);
  };
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      {value ? (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-[#333]">
          <video src={value} className="h-32 w-full object-cover" />
          <button onClick={() => onChange('')} className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80"><X size={14} /></button>
        </div>
      ) : null}
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${isDragging ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-[#333] hover:border-[#444]'}`}>
        {isUploading ? (
          <div className="w-full max-w-xs"><div className="mb-2 flex items-center justify-between text-xs"><span className="text-gray-400">Enviando...</span><span className="text-[#ff6a00]">{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]"><div className="h-full rounded-full bg-[#ff6a00] transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>
        ) : (<><Video size={24} className="mb-2 text-gray-500" /><p className="text-sm text-gray-400">Arraste e solte ou</p><label className="mt-2 cursor-pointer text-sm text-[#ff6a00] hover:underline">selecione um vídeo<input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" /></label></>)}
      </div>
    </div>
  );
}

export function AdminFileUpload({ value, onChange, label = 'Arquivo', accept = '*/*', maxSize }: { value?: string; onChange: (file: File | null) => void; label?: string; accept?: string; maxSize?: number; }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };
  const handleFile = async (file: File) => {
    if (maxSize && file.size > maxSize) { alert(`Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`); return; }
    setIsUploading(true);
    setFileName(file.name);
    onChange(file);
    setIsUploading(false);
  };
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      {value && fileName ? (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
          <FileText size={20} className="text-[#ff6a00]" />
          <span className="flex-1 truncate text-sm text-white">{fileName}</span>
          <button onClick={() => { onChange(null); setFileName(''); }} className="text-gray-400 hover:text-red-400"><X size={16} /></button>
        </div>
      ) : null}
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${isDragging ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-[#333] hover:border-[#444]'}`}>
        {isUploading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff6a00] border-t-transparent" /> : (<><Upload size={24} className="mb-2 text-gray-500" /><p className="text-sm text-gray-400">Arraste e solte ou</p><label className="mt-2 cursor-pointer text-sm text-[#ff6a00] hover:underline">selecione um arquivo<input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" /></label>{maxSize && <p className="mt-1 text-xs text-gray-500">Máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>}</>)}
      </div>
    </div>
  );
}

export function AdminLinkInput({ value, onChange, label, placeholder }: { value: string; onChange: (value: string) => void; label?: string; placeholder?: string; }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative"><Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#ff6a00]" /></div>
    </div>
  );
}

export function AdminNumberInput({ value, onChange, label, min, max, step }: { value: number; onChange: (value: number) => void; label?: string; min?: number; max?: number; step?: number; }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value))} min={min} max={max} step={step} className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#ff6a00]" />
    </div>
  );
}

export function AdminSliderInput({ value, onChange, label, min = 0, max = 100, step = 1 }: { value: number; onChange: (value: number) => void; label?: string; min?: number; max?: number; step?: number; }) {
  return (
    <div>
      {label && <div className="mb-1.5 flex items-center justify-between"><label className="text-sm font-medium text-gray-300">{label}</label><span className="text-sm text-[#ff6a00]">{value}</span></div>}
      <input type="range" value={value} onChange={(e) => onChange(parseFloat(e.target.value))} min={min} max={max} step={step} className="w-full accent-[#ff6a00]" />
    </div>
  );
}

export function AdminSwitchInput({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string; }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#222222] bg-[#111111] p-4">
      <div><p className="text-sm font-medium text-white">{label}</p>{description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}</div>
      <div onClick={() => onChange(!checked)} className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${checked ? 'bg-[#ff6a00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} /></div>
    </div>
  );
}

export function AdminInfoBox({ title, children, variant = 'info' }: { title: string; children: ReactNode; variant?: 'info' | 'warning' | 'success' | 'error'; }) {
  const variants = { info: 'border-blue-500/30 bg-blue-500/10', warning: 'border-yellow-500/30 bg-yellow-500/10', success: 'border-emerald-500/30 bg-emerald-500/10', error: 'border-red-500/30 bg-red-500/10' };
  const icons = { info: Info, warning: AlertTriangle, success: Check, error: X };
  const Icon = icons[variant];
  return <div className={`rounded-lg border p-4 ${variants[variant]}`}><div className="flex items-start gap-3"><Icon size={18} className="mt-0.5 shrink-0" /><div><p className="text-sm font-medium text-white">{title}</p><div className="mt-1 text-sm text-gray-400">{children}</div></div></div></div>;
}

export function AdminCopyButton({ text, label = 'Copiar' }: { text: string; label?: string; }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-[#222] hover:text-white">{copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}{copied ? 'Copiado!' : label}</button>;
}

export function AdminExternalLink({ href, children }: { href: string; children: ReactNode; }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#ff6a00] hover:underline">{children}<ExternalLink size={12} /></a>;
}

export function AdminAnalyticsChartCard({ title, data, type = 'line' }: { title: string; data: any[]; type?: 'line' | 'bar' | 'pie'; }) {
  return (
    <AdminCard className="p-5">
      <h3 className="mb-4 font-display text-lg font-bold text-white">{title}</h3>
      <div className="flex h-48 items-end gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t bg-[#ff6a00] transition-all" style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }} />
            <span className="text-[10px] text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

export function AdminAnalyticsTableCard({ title, columns, data }: { title: string; columns: { key: string; label: string }[]; data: any[]; }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="border-b border-[#222222] px-5 py-4"><h3 className="font-display text-lg font-bold text-white">{title}</h3></div>
      <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[#222222]">{columns.map(col => <th key={col.key} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{col.label}</th>)}</tr></thead><tbody className="divide-y divide-[#1a1a1a]">{data.map((row, i) => <tr key={i} className="hover:bg-[#1a1a1a]">{columns.map(col => <td key={col.key} className="px-5 py-3 text-sm text-gray-300">{row[col.key]}</td>)}</tr>)}</tbody></table></div>
    </AdminCard>
  );
}

export function AdminAnalyticsProgressCard({ label, value, max = 100, color = '#ff6a00' }: { label: string; value: number; max?: number; color?: string; }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm"><span className="text-gray-400">{label}</span><span className="text-white">{percent.toFixed(0)}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} /></div>
    </div>
  );
}

export function AdminAnalyticsBadge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; }) {
  const variants = { default: 'bg-[#1a1a1a] text-gray-400 border-[#333]', success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', danger: 'bg-red-500/10 text-red-400 border-red-500/20', info: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>{children}</span>;
}

export function AdminAnalyticsTrendIndicator({ value, trend }: { value: string; trend: 'up' | 'down' | 'neutral'; }) {
  return <span className={`inline-flex items-center gap-1 text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>{trend === 'up' && <TrendingUp size={12} />}{trend === 'down' && <TrendingUp size={12} className="rotate-180" />}{value}</span>;
}

export function AdminAnalyticsDateRangePicker({ startDate, endDate, onChange }: { startDate: string; endDate: string; onChange: (start: string, end: string) => void; }) {
  return (
    <div className="flex items-center gap-3">
      <input type="date" value={startDate} onChange={(e) => onChange(e.target.value, endDate)} className="rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ff6a00] [color-scheme:dark]" />
      <span className="text-gray-500">até</span>
      <input type="date" value={endDate} onChange={(e) => onChange(startDate, e.target.value)} className="rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ff6a00] [color-scheme:dark]" />
    </div>
  );
}

export function AdminAnalyticsExportButton({ onExport, label = 'Exportar' }: { onExport: () => void; label?: string; }) {
  return <AdminButton variant="secondary" icon={Download} onClick={onExport}>{label}</AdminButton>;
}

export function AdminAnalyticsRefreshButton({ onRefresh, label = 'Atualizar' }: { onRefresh: () => void; label?: string; }) {
  return <AdminButton variant="ghost" icon={RefreshCw} onClick={onRefresh}>{label}</AdminButton>;
}

export function AdminAnalyticsFilterBar({ children }: { children: ReactNode; }) {
  return <div className="mb-6 flex flex-wrap items-center gap-3">{children}</div>;
}

export function AdminAnalyticsCardGrid({ children, cols = 4 }: { children: ReactNode; cols?: 2 | 3 | 4; }) {
  const gridCols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };
  return <div className={`grid gap-4 ${gridCols[cols]}`}>{children}</div>;
}

export function AdminAnalyticsSection({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode; }) {
  return <div className="mb-8"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-bold text-white">{title}</h2>{actions}</div>{children}</div>;
}

export function AdminAnalyticsTabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; }) {
  return <div className="mb-6 flex gap-1 rounded-lg border border-[#222222] bg-[#0a0a0a] p-1">{tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={`rounded-md px-4 py-2 text-sm font-medium transition ${active === tab.id ? 'bg-[#ff6a00] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}>{tab.label}</button>)}</div>;
}

export function AdminAnalyticsTooltip({ content, children }: { content: string; children: ReactNode; }) {
  return <div className="group relative">{children}<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">{content}</div></div>;
}

export function AdminAnalyticsLegend({ items }: { items: { label: string; color: string }[]; }) {
  return <div className="flex flex-wrap items-center gap-4">{items.map((item, i) => <div key={i} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs text-gray-400">{item.label}</span></div>)}</div>;
}

export function AdminAnalyticsNoData({ message = 'Nenhum dado para exibir' }: { message?: string; }) {
  return <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#333] py-12 text-center"><BarChart3 size={32} className="mb-3 text-gray-600" /><p className="text-sm text-gray-500">{message}</p></div>;
}

export function AdminAnalyticsSkeleton() {
  return <div className="animate-pulse"><div className="mb-4 h-6 w-48 rounded bg-[#1a1a1a]" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-[#1a1a1a]" />)}</div></div>;
}

export function AdminAnalyticsError({ message, onRetry }: { message: string; onRetry?: () => void; }) {
  return <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-12 text-center"><AlertTriangle size={32} className="mb-3 text-red-400" /><p className="text-sm text-red-400">{message}</p>{onRetry && <button onClick={onRetry} className="mt-4 text-sm text-[#ff6a00] hover:underline">Tentar novamente</button>}</div>;
}

export function AdminAnalyticsContainer({ children }: { children: ReactNode; }) {
  return <div className="space-y-6">{children}</div>;
}

export function AdminAnalyticsHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode; }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-bold text-white">{title}</h1>{subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}</div>{actions && <div className="flex items-center gap-3">{actions}</div>}</div>;
}

export function AdminAnalyticsFooter({ children }: { children: ReactNode; }) {
  return <div className="mt-8 border-t border-[#222222] pt-6">{children}</div>;
}

export function AdminAnalyticsDivider() {
  return <div className="my-8 border-t border-[#222222]" />;
}

export function AdminAnalyticsSpacer({ height = 24 }: { height?: number; }) {
  return <div style={{ height }} />;
}

export function AdminAnalyticsFlex({ children, gap = 16, align = 'center' }: { children: ReactNode; gap?: number; align?: 'start' | 'center' | 'end'; }) {
  return <div className={`flex items-${align} gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsGrid({ children, cols = 12, gap = 16 }: { children: ReactNode; cols?: number; gap?: number; }) {
  return <div className={`grid grid-cols-${cols} gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsCol({ children, span = 12 }: { children: ReactNode; span?: number; }) {
  return <div className={`col-span-${span}`}>{children}</div>;
}

export function AdminAnalyticsRow({ children, gap = 16 }: { children: ReactNode; gap?: number; }) {
  return <div className={`flex gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsStack({ children, gap = 16 }: { children: ReactNode; gap?: number; }) {
  return <div className={`space-y-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsInline({ children, gap = 8 }: { children: ReactNode; gap?: number; }) {
  return <div className={`inline-flex items-center gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsWrap({ children, gap = 8 }: { children: ReactNode; gap?: number; }) {
  return <div className={`flex flex-wrap items-center gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsCenter({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-center">{children}</div>;
}

export function AdminAnalyticsBetween({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function AdminAnalyticsEnd({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-end">{children}</div>;
}

export function AdminAnalyticsStart({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-start">{children}</div>;
}

export function AdminAnalyticsMiddle({ children }: { children: ReactNode; }) {
  return <div className="flex items-center">{children}</div>;
}

export function AdminAnalyticsBaseline({ children }: { children: ReactNode; }) {
  return <div className="flex items-baseline">{children}</div>;
}

export function AdminAnalyticsStretch({ children }: { children: ReactNode; }) {
  return <div className="flex items-stretch">{children}</div>;
}

export function AdminAnalyticsEvenly({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-evenly">{children}</div>;
}

export function AdminAnalyticsAround({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-around">{children}</div>;
}

export function AdminAnalyticsSpaceBetween({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function AdminAnalyticsSpaceAround({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-around">{children}</div>;
}

export function AdminAnalyticsSpaceEvenly({ children }: { children: ReactNode; }) {
  return <div className="flex items-center justify-evenly">{children}</div>;
}

export function AdminAnalyticsGap({ children, gap = 8 }: { children: ReactNode; gap?: number; }) {
  return <div className={`gap-${gap / 4}`}>{children}</div>;
}

export function AdminAnalyticsMargin({ children, margin = 0 }: { children: ReactNode; margin?: number; }) {
  return <div className={`m-${margin / 4}`}>{children}</div>;
}

export function AdminAnalyticsPadding({ children, padding = 0 }: { children: ReactNode; padding?: number; }) {
  return <div className={`p-${padding / 4}`}>{children}</div>;
}

export function AdminAnalyticsWidth({ children, width = 'auto' }: { children: ReactNode; width?: string | number; }) {
  return <div style={{ width }}>{children}</div>;
}

export function AdminAnalyticsHeight({ children, height = 'auto' }: { children: ReactNode; height?: string | number; }) {
  return <div style={{ height }}>{children}</div>;
}

export function AdminAnalyticsMaxWidth({ children, maxWidth = '100%' }: { children: ReactNode; maxWidth?: string | number; }) {
  return <div style={{ maxWidth }}>{children}</div>;
}

export function AdminAnalyticsMinWidth({ children, minWidth = '0' }: { children: ReactNode; minWidth?: string | number; }) {
  return <div style={{ minWidth }}>{children}</div>;
}

export function AdminAnalyticsMaxHeight({ children, maxHeight = 'none' }: { children: ReactNode; maxHeight?: string | number; }) {
  return <div style={{ maxHeight }}>{children}</div>;
}

export function AdminAnalyticsMinHeight({ children, minHeight = '0' }: { children: ReactNode; minHeight?: string | number; }) {
  return <div style={{ minHeight }}>{children}</div>;
}

export function AdminAnalyticsOverflow({ children, overflow = 'visible' }: { children: ReactNode; overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'; }) {
  return <div style={{ overflow }}>{children}</div>;
}

export function AdminAnalyticsOverflowX({ children, overflowX = 'visible' }: { children: ReactNode; overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'; }) {
  return <div style={{ overflowX }}>{children}</div>;
}

export function AdminAnalyticsOverflowY({ children, overflowY = 'visible' }: { children: ReactNode; overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'; }) {
  return <div style={{ overflowY }}>{children}</div>;
}

export function AdminAnalyticsPosition({ children, position = 'static' }: { children: ReactNode; position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'; }) {
  return <div style={{ position }}>{children}</div>;
}

export function AdminAnalyticsTop({ children, top = 'auto' }: { children: ReactNode; top?: string | number; }) {
  return <div style={{ top }}>{children}</div>;
}

export function AdminAnalyticsRight({ children, right = 'auto' }: { children: ReactNode; right?: string | number; }) {
  return <div style={{ right }}>{children}</div>;
}

export function AdminAnalyticsBottom({ children, bottom = 'auto' }: { children: ReactNode; bottom?: string | number; }) {
  return <div style={{ bottom }}>{children}</div>;
}

export function AdminAnalyticsLeft({ children, left = 'auto' }: { children: ReactNode; left?: string | number; }) {
  return <div style={{ left }}>{children}</div>;
}

export function AdminAnalyticsZIndex({ children, zIndex = 'auto' }: { children: ReactNode; zIndex?: string | number; }) {
  return <div style={{ zIndex }}>{children}</div>;
}

export function AdminAnalyticsOpacity({ children, opacity = 1 }: { children: ReactNode; opacity?: number; }) {
  return <div style={{ opacity }}>{children}</div>;
}

export function AdminAnalyticsTransform({ children, transform = 'none' }: { children: ReactNode; transform?: string; }) {
  return <div style={{ transform }}>{children}</div>;
}

export function AdminAnalyticsTransition({ children, transition = 'none' }: { children: ReactNode; transition?: string; }) {
  return <div style={{ transition }}>{children}</div>;
}

export function AdminAnalyticsAnimation({ children, animation = 'none' }: { children: ReactNode; animation?: string; }) {
  return <div style={{ animation }}>{children}</div>;
}

export function AdminAnalyticsCursor({ children, cursor = 'auto' }: { children: ReactNode; cursor?: 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'help' | 'not-allowed'; }) {
  return <div style={{ cursor }}>{children}</div>;
}

export function AdminAnalyticsUserSelect({ children, userSelect = 'auto' }: { children: ReactNode; userSelect?: 'auto' | 'none' | 'text' | 'all'; }) {
  return <div style={{ userSelect }}>{children}</div>;
}
export function AdminBrandSettingsCard({ brand, onEdit }: { brand: { platformName?: string; supportEmail?: string; websiteUrl?: string }; onEdit: () => void }) {
 return <AdminCard className="p-6"><h3 className="font-bold">{brand.platformName}</h3><p>{brand.supportEmail}</p><p>{brand.websiteUrl}</p><AdminButton onClick={onEdit}>Editar marca</AdminButton></AdminCard>;
}
export function AdminHomeSectionCard({ section, onEdit, onDelete, onToggle }: { section: any; onEdit?: () => void; onDelete?: () => void; onToggle?: () => void }) {
 return <AdminCard className="p-4"><h3>{section.title || section.type}</h3>{onToggle && <AdminButton onClick={onToggle}>{section.isActive ? "Desativar" : "Ativar"}</AdminButton>}<p>{section.description}</p>{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}</AdminCard>;
}

export function AdminAnnouncementCard({ announcement, onEdit, onDelete, onSend }: { announcement: any; onEdit?: () => void; onDelete?: () => void; onSend?: () => void }) { return <AdminCard className="p-4"><h3>{announcement.title}</h3><p>{announcement.message}</p>{onSend && <AdminButton onClick={onSend}>Enviar</AdminButton>}{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}</AdminCard>; }
export function AdminVideoCard({ video, onEdit, onDelete, onView }: { video: any; onEdit?: () => void; onDelete?: () => void; onView?: () => void }) { return <AdminCard className="p-4"><h3>{video.title || video.fileName}</h3><p>{video.status}</p>{onView && <AdminButton onClick={onView}>Visualizar</AdminButton>}{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}</AdminCard>; }

export function AdminNotificationTemplateCard({ template, onEdit, onDelete, onSend }: { template: any; onEdit?: () => void; onDelete?: () => void; onSend?: () => void }) { return <AdminCard className="p-4"><h3>{template.name || template.title}</h3><p>{template.message}</p>{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}{onSend && <AdminButton onClick={onSend}>Enviar</AdminButton>}</AdminCard>; }
export function AdminQuestionBankCard({ question, onEdit, onDelete }: { question: any; onEdit?: () => void; onDelete?: () => void }) { return <AdminCard className="p-4"><h3>{question.question || question.title}</h3><p>{question.type}</p>{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}</AdminCard>; }
export function AdminActivityCard({ activity, onEdit, onDelete }: { activity: any; onEdit?: () => void; onDelete?: () => void }) { return <AdminCard className="p-4"><h3>{activity.title}</h3><p>{activity.description}</p>{onEdit && <AdminButton onClick={onEdit}>Editar</AdminButton>}{onDelete && <AdminButton variant="danger" onClick={onDelete}>Excluir</AdminButton>}</AdminCard>; }
