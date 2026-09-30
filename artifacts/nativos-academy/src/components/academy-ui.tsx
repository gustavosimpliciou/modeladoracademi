import { Link, useLocation } from 'wouter';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Cog,
  FileText,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Play,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import { useState, type ReactNode, useRef, useEffect } from 'react';
import { useClerk } from '@clerk/react';

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" data-testid="link-brand">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/.16)]">
        <span className="font-display text-2xl font-bold italic leading-none">N</span>
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-tl-sm bg-accent" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[19px] font-bold tracking-[.08em] text-foreground">NATIVOS</span>
          <span className="mt-0.5 block font-mono-ui text-[7px] font-bold tracking-[.36em] text-primary">ACADEMY</span>
        </span>
      )}
    </Link>
  );
}

const navigation = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/cursos', label: 'Meus cursos', icon: BookOpen },
  { href: '/atividades', label: 'Atividades', icon: Target },
];

export function AppShell({ children, userName = 'Gustavo Simplício', userInitials = 'GS' }: { children: ReactNode; userName?: string; userInitials?: string }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  return (
    <div className="noise min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[245px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <Mark />
          <button onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden" aria-label="Fechar menu" data-testid="button-close-menu"><X size={18} /></button>
        </div>
        <div className="mt-9 px-2 font-mono-ui text-[9px] uppercase tracking-[.22em] text-muted-foreground">Seu espaço</div>
        <nav className="mt-3 flex flex-col gap-1" aria-label="Navegação principal">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === '/dashboard' ? location === href || location === '/' : location.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground shadow-[0_9px_25px_hsl(var(--primary)/.16)]' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replace(/\s/g, '-')}`}>
                <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 px-2 font-mono-ui text-[9px] uppercase tracking-[.22em] text-muted-foreground">Recursos</div>
        <nav className="mt-3 flex flex-col gap-1">
          <Link href="/cursos" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground" data-testid="link-nav-biblioteca"><Sparkles size={17} /> Biblioteca</Link>
          <button className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground" data-testid="button-support"><LifeBuoy size={17} /> Suporte</button>
        </nav>
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <div className="relative">
            <button onClick={() => setSidebarMenuOpen(!sidebarMenuOpen)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2" data-testid="button-sidebar-user-menu">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-secondary font-mono-ui text-[11px] text-primary" data-testid="avatar-user">{userInitials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-foreground" data-testid="text-sidebar-user">{userName}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">Aluno</span>
              </span>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${sidebarMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {sidebarMenuOpen && <UserMenu userName={userName} userInitials={userInitials} onClose={() => setSidebarMenuOpen(false)} />}
          </div>
          <div className="mt-3 flex items-center gap-2 px-2">
            <span className="font-display text-sm font-bold italic text-primary">N</span>
            <span className="text-[9px] uppercase tracking-[.11em] text-muted-foreground">Aprenda no seu ritmo.</span>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" data-testid="button-menu-overlay" />}
      <div className="lg:pl-[245px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden" aria-label="Abrir menu" data-testid="button-open-menu"><Menu size={20} /></button>
            <button onClick={() => setSearchOpen(!searchOpen)} className={`flex h-10 items-center gap-3 rounded-lg border border-border bg-card px-3 text-left text-xs text-muted-foreground transition hover:border-primary/50 sm:w-[390px] ${searchOpen ? 'border-primary/70' : ''}`} data-testid="button-search">
              <Search size={16} />
              <span className="hidden sm:block">Buscar cursos, módulos ou tópicos...</span>
              <kbd className="ml-auto hidden rounded border border-border bg-secondary px-1.5 py-0.5 font-mono-ui text-[9px] sm:block">⌘ K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Notificações" data-testid="button-notifications"><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" /><Sparkles size={17} /></button>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="relative">
              <button onClick={() => setHeaderMenuOpen(!headerMenuOpen)} className="flex items-center gap-2 rounded-lg py-1.5 pl-2 pr-1 hover:bg-secondary" data-testid="button-header-user-menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-secondary font-mono-ui text-[10px] text-primary">{userInitials}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${headerMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {headerMenuOpen && <UserMenu userName={userName} userInitials={userInitials} onClose={() => setHeaderMenuOpen(false)} />}
            </div>
          </div>
        </header>
        {searchOpen && (
          <div className="absolute right-4 top-[74px] z-30 w-[min(390px,calc(100%-2rem))] rounded-xl border border-border bg-card p-3 shadow-card animate-rise">
            <div className="flex items-center gap-3 border-b border-border px-2 pb-3"><Search size={16} className="text-primary" /><input autoFocus placeholder="Digite para buscar..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" data-testid="input-global-search" /></div>
            <p className="px-2 pt-3 text-xs text-muted-foreground">Encontre uma aula, curso ou material.</p>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 font-mono-ui text-[10px] uppercase tracking-[.22em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-[44px]">{title}</h1>
        {detail && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, className = '', accent = false }: { value: number; className?: string; accent?: boolean }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return <div className={`h-1.5 overflow-hidden rounded-full bg-secondary ${className}`}><div className={`h-full rounded-full transition-all duration-700 ${accent ? 'orange-rule' : 'bg-primary'}`} style={{ width: `${safeValue}%` }} /></div>;
}

export function StatusPill({ status }: { status: string }) {
  const labels: Record<string, string> = { in_progress: 'Em andamento', completed: 'Concluído', not_started: 'Não iniciado', available: 'Disponível', locked: 'Bloqueado', pending: 'Pendente', done: 'Concluído' };
  const positive = status === 'completed' || status === 'done';
  const active = status === 'in_progress' || status === 'available';
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.08em] ${positive ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : active ? 'border-primary/25 bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}><span className={`h-1.5 w-1.5 rounded-full ${positive ? 'bg-emerald-400' : active ? 'bg-primary' : 'bg-muted-foreground'}`} />{labels[status] ?? status}</span>;
}

export function CourseArtwork({ course, large = false }: { course: { title: string; category?: string; thumbnail?: string }; large?: boolean }) {
  const thumb = course.thumbnail;
  return (
    <div className={`relative isolate overflow-hidden bg-[#151515] ${large ? 'min-h-[230px]' : 'h-40'}`}>
      {thumb ? <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-screen" /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(255,107,22,.65),transparent_30%),linear-gradient(120deg,#131313_5%,#25211e_58%,#f05b16_140%)]" />
      <div className="absolute -right-8 -top-14 h-48 w-48 rounded-full border-[18px] border-primary/20" />
      <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full border border-accent/30" />
      <div className="absolute bottom-4 left-5 max-w-[75%]"><span className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-primary-foreground/70">{course.category ?? 'Nativos Academy'}</span><span className="mt-1 block font-display text-2xl font-semibold leading-none text-white">{course.title}</span></div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-secondary ${className}`} />;
}

export function QueryState({ loading, error, onRetry, children, empty, emptyTitle = 'Nada por aqui ainda.' }: { loading: boolean; error: unknown; onRetry: () => void; children: ReactNode; empty?: boolean; emptyTitle?: string }) {
  if (loading) return <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-44" /><Skeleton className="h-44" /></div>;
  if (error) return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"><p className="font-display text-2xl">Não foi possível carregar</p><p className="mt-2 text-sm text-muted-foreground">Tente novamente em alguns instantes.</p><button onClick={onRetry} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110" data-testid="button-retry">Tentar novamente</button></div>;
  if (empty) return <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center"><BookOpen className="mx-auto text-primary" size={25} /><p className="mt-4 font-display text-2xl">{emptyTitle}</p><p className="mt-1 text-sm text-muted-foreground">Quando houver novidades, elas aparecem aqui.</p></div>;
  return <>{children}</>;
}

export function StatCard({ label, value, caption, icon, trend }: { label: string; value: string; caption: string; icon?: string; trend?: string | null }) {
  const Icon = icon === 'trophy' ? Trophy : icon === 'clock' ? Clock3 : icon === 'target' ? Target : BookOpen;
  return <div className="rounded-xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,.12)]"><div className="flex items-start justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary"><Icon size={17} /></span>{trend && <span className="font-mono-ui text-[10px] text-emerald-300">{trend}</span>}</div><p className="mt-5 font-display text-3xl font-semibold">{value}</p><p className="mt-1 text-xs font-medium text-foreground">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{caption}</p></div>;
}

export function IconType({ type }: { type: string }) {
  if (type.toLowerCase().includes('audio')) return <Headphones size={16} />;
  if (type.toLowerCase().includes('pdf') || type.toLowerCase().includes('material')) return <FileText size={16} />;
  return <Play size={16} />;
}

export function EmptyResults({ query }: { query: string }) {
  return <div className="col-span-full rounded-xl border border-dashed border-border bg-card/30 px-5 py-16 text-center"><Search className="mx-auto text-primary" size={24} /><h3 className="mt-4 font-display text-2xl">Nenhum curso encontrado</h3><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Não achamos resultados para “{query}”. Experimente outro termo.</p></div>;
}

export function CTAButton({ href, children, secondary = false, onClick, className: customClassName = '' }: { href?: string; children: ReactNode; secondary?: boolean; onClick?: () => void; className?: string }) {
  const className = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${secondary ? 'border border-border bg-secondary text-foreground hover:border-primary/40' : 'bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/.18)] hover:brightness-110'} ${customClassName}`;
  if (href) return <Link href={href} onClick={onClick} className={className} data-testid={`link-cta-${href.replace(/\W/g, '-')}`}>{children}<ArrowRight size={15} /></Link>;
  return <button onClick={onClick} className={className} data-testid="button-cta">{children}<ArrowRight size={15} /></button>;
}

function UserMenu({ userName, userInitials, onClose }: { userName: string; userInitials: string; onClose: () => void }) {
  const { signOut } = useClerk();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSignOut = async () => {
    onClose();
    await signOut({ redirectUrl: '/sign-in' });
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div ref={menuRef} className="absolute right-4 top-full mt-2 w-56 origin-top-right rounded-xl border border-border bg-card p-2 shadow-card animate-rise" onClick={(e) => e.stopPropagation()}>
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{userName}</p>
          <p className="text-[11px] text-muted-foreground">Aluno</p>
        </div>
        <button onClick={() => { onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Cog size={16} /> Configurações
        </button>
        <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );
}