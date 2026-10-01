import { useAuth } from '@clerk/react';
import { useQuery } from '@tanstack/react-query';
import { AdminRequestError, useAdminFetch } from '@/lib/admin-fetch';
import type { AdminSession } from '@/lib/admin-session';

export function useAcademyAdmin() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const adminFetch = useAdminFetch();
  const query = useQuery({
    queryKey: ['academy-admin-session', userId],
    enabled: isLoaded && !!isSignedIn,
    staleTime: 60000,
    retry: 1,
    queryFn: async (): Promise<AdminSession | null> => {
      try {
        return await (await adminFetch('/api/admin/me')).json();
      } catch (error) {
        if (error instanceof AdminRequestError && error.status === 403) return null;
        throw error;
      }
    },
  });
  const isAdmin = !!isSignedIn && !!query.data?.roles.some(role => ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(role));
  const label = !isLoaded || (isSignedIn && query.isPending) ? 'Verificando acesso…' : !isSignedIn ? 'Visitante' : query.isError ? 'Acesso não confirmado' : isAdmin ? 'Administrador' : 'Aluno';
  return { ...query, isAdmin, label };
}
