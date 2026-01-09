'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { Loader2 } from 'lucide-react';

/**
 * Layout compartilhado para todas as páginas admin
 * Inclui sidebar e header automaticamente
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, isLoading } = useAuthStore();

  useEffect(() => {
    // Aguarda a hidratação e o carregamento antes de verificar autenticação
    if (hasHydrated && !isLoading && !isAuthenticated) {
      console.log('🔴 [Admin Layout] Usuário não autenticado, redirecionando para login');
      router.push('/login');
    }
    
    // Verificar se é admin
    if (hasHydrated && !isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      console.log('🔴 [Admin Layout] Usuário não é admin, redirecionando');
      router.push('/student/my-courses');
    }
  }, [hasHydrated, isLoading, isAuthenticated, user, router]);

  // Aguarda hidratação e carregamento antes de renderizar
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[rgb(var(--primary-500))] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado após hidratação, não renderiza nada (o useEffect vai redirecionar)
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <AdminHeader />
      
      {/* Main Content Area - com margin para sidebar e header */}
      <main className="ml-60 mt-16 p-8">
        {children}
      </main>
    </div>
  );
}