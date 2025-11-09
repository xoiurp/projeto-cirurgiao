'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de autenticação que carrega o usuário ao iniciar a aplicação
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    // Carrega dados do usuário ao montar o componente
    loadUser();
  }, [loadUser]);

  return <>{children}</>;
}
