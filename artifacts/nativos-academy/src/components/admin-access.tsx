import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { useAdminFetch } from '@/lib/admin-fetch';
import { AdminLayout, AdminLoading } from '@/components/admin-ui';

import { AdminSessionContext, type AdminSession } from '@/lib/admin-session';

export function AdminAccess({ children }: { children: ReactNode }) {
  const adminFetch = useAdminFetch();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');
    adminFetch('/api/admin/me').then(r => r.json()).then(data => { if (active) setSession(data); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [adminFetch, attempt]);
  if (error) return <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"><h1 className="text-xl font-bold">Não foi possível abrir a administração</h1><p role="alert">{error}</p><button onClick={() => setAttempt(v => v + 1)}>Tentar novamente</button><Link href="/dashboard">Voltar para a academia</Link></main>;
  if (!session) return <AdminLoading />;
  return <AdminSessionContext.Provider value={session}><AdminLayout>{children}</AdminLayout></AdminSessionContext.Provider>;
}
