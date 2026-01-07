'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Clock, TrendingUp, PlayCircle, GraduationCap } from 'lucide-react';

/**
 * Página de dashboard do administrador - Estilo Coursera
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, isLoading } = useAuthStore();

  useEffect(() => {
    // Aguarda a hidratação e o carregamento antes de verificar autenticação
    if (hasHydrated && !isLoading && !isAuthenticated) {
      console.log('🔴 [Dashboard] Usuário não autenticado, redirecionando para login');
      router.push('/login');
    }
  }, [hasHydrated, isLoading, isAuthenticated, router]);

  // Aguarda hidratação e carregamento antes de renderizar
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary-500))] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado após hidratação, não renderiza nada (o useEffect vai redirecionar)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <AdminHeader />

      {/* Main Content */}
      <main className="ml-60 mt-16 p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, {user.name}! Aqui está um resumo da sua plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total de Alunos"
            value="1,234"
            icon={Users}
            trend={{ value: 12.5, label: 'vs mês anterior' }}
            color="primary"
          />
          <StatCard
            title="Cursos Ativos"
            value="24"
            icon={BookOpen}
            trend={{ value: 8.2, label: 'vs mês anterior' }}
            color="success"
          />
          <StatCard
            title="Horas de Conteúdo"
            value="342h"
            icon={Clock}
            color="warning"
          />
          <StatCard
            title="Taxa de Conclusão"
            value="87%"
            icon={TrendingUp}
            trend={{ value: 5.1, label: 'vs mês anterior' }}
            color="secondary"
          />
        </div>

        {/* Charts and Tables Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Enrollment Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Matrículas nos Últimos 6 Meses</CardTitle>
              <CardDescription>
                Crescimento de matrículas por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-linear-to-br from-[rgb(var(--primary-500)/0.1)] to-[rgb(var(--accent-500)/0.1)] rounded-lg">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4 text-[rgb(var(--primary-500))]" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gráfico de matrículas será implementado aqui
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimas ações na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: 'João Silva',
                    action: 'concluiu o curso',
                    target: 'Tecidos Moles na Prática',
                    time: '2 minutos atrás',
                  },
                  {
                    user: 'Maria Santos',
                    action: 'iniciou o módulo',
                    target: 'Introdução às Cirurgias',
                    time: '15 minutos atrás',
                  },
                  {
                    user: 'Pedro Costa',
                    action: 'assistiu ao vídeo',
                    target: 'Técnicas de Sutura',
                    time: '1 hora atrás',
                  },
                  {
                    user: 'Ana Paula',
                    action: 'se matriculou em',
                    target: 'Top 10 Cirurgias',
                    time: '2 horas atrás',
                  },
                  {
                    user: 'Carlos Lima',
                    action: 'concluiu o vídeo',
                    target: 'Anestesia em Pequenos Animais',
                    time: '3 horas atrás',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-[rgb(var(--primary-500)/0.1)] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-[rgb(var(--primary-500))]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {activity.action}
                        </span>{' '}
                        <span className="font-medium text-[rgb(var(--primary-600))]">
                          {activity.target}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cursos Mais Acessados</CardTitle>
            <CardDescription>
              Cursos com maior engajamento esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="pb-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Alunos
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Progresso Médio
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Taxa de Conclusão
                    </th>
                    <th className="pb-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Aulas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {[
                    {
                      name: 'Tecidos Moles na Prática',
                      students: 456,
                      progress: 68,
                      completion: 82,
                      lessons: 150,
                    },
                    {
                      name: 'Top 10 Cirurgias de Rotina',
                      students: 342,
                      progress: 72,
                      completion: 88,
                      lessons: 45,
                    },
                    {
                      name: 'Plataforma Completa',
                      students: 289,
                      progress: 45,
                      completion: 65,
                      lessons: 200,
                    },
                    {
                      name: 'Pós-graduação em Cirurgias',
                      students: 147,
                      progress: 38,
                      completion: 58,
                      lessons: 300,
                    },
                  ].map((course, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {course.name}
                      </td>
                      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                        {course.students}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[rgb(var(--primary-500))] rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {course.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgb(var(--accent-500)/0.1)] text-[rgb(var(--accent-600))]">
                          {course.completion}%
                        </span>
                      </td>
                      <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {course.lessons}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
