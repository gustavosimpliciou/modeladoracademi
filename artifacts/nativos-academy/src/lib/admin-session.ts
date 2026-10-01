import { createContext, useContext } from 'react';
export type AdminSession = { user: { name: string; email: string }; roles: string[]; permissions: string[] };
export const AdminSessionContext = createContext<AdminSession | null>(null);
export function useAdminSession() { return useContext(AdminSessionContext); }
