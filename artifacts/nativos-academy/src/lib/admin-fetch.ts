import { useCallback } from 'react';
import { useAuth } from '@clerk/react';

export class AdminRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function useAdminFetch() {
  const { getToken } = useAuth();
  return useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await getToken();
    if (!token) throw new Error('Entre novamente para acessar o painel.');
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, '')}${url}`, { ...options, headers });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new AdminRequestError(body.error || `Erro na operação (${response.status})`, response.status);
    }
    return response;
  }, [getToken]);
}
