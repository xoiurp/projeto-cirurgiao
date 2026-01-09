'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Clock, TrendingUp, PlayCircle, GraduationCap, Loader2 } from 'lucide-react';
import { coursesService } from '@/lib/api/courses.service';
import { Course } from '@/lib/types/course.types';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalHours: number;
  completionRate: number;
}

interface RecentActivity {
  user: string;
  action: string;
  target: string;
  time: string;
}

/**
 * Página de dashboard do administrador
 * Centraliza estatísticas e visão geral da plataforma
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Estados para dados reais
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalHours: 0,
    completionRate: 0,
  });

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Buscar cursos
      const response = await coursesService.findAll();
      const coursesData = response.data || [];
      setCourses(coursesData);
      
      // Calcular estatísticas baseadas nos dados reais
      const totalCourses = coursesData.length;
      const totalStudents = coursesData.reduce((acc: number, course: Course) => acc + (course._count?.enrollments || 0), 0);
      
      // Calcular horas totais de conteúdo (aproximado)
      let totalMinutes = 0;
      coursesData.forEach((course: Course) => {
        course.modules?.forEach((module) => {
          module.videos?.forEach((video) => {
            totalMinutes += video.duration || 0;
          });
        });
      });
      const totalHours = Math.round(totalMinutes / 60);
      
      setStats({
        totalStudents,
        totalCourses,
        totalHours,
        completionRate: 0, // TODO: Implementar cálculo real
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Atividades recentes (mock por enquanto - TODO: implementar com dados reais)
  const recentActivities: RecentActivity[] = [
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
  ];

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, {user?.name}! Aqui está um resumo da sua plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total de Alunos"
            value={loadingData ? '...' : stats.totalStudents.toLocaleString()}
            icon={Users}
            trend={{ value: 12.5, label: 'vs mês anterior' }}
            color="primary"
          />
          <StatCard
            title="Cursos Ativos"
            value={loadingData ? '...' : stats.totalCourses.toString()}
            icon={BookOpen}
            trend={{ value: 8.2, label: 'vs mês anterior' }}
            color="success"
          />
          <StatCard
            title="Horas de Conteúdo"
            value={loadingData ? '...' : `${stats.totalHours}h`}
            icon={Clock}
            color="warning"
          />
          <StatCard
            title="Taxa de Conclusão"
            value={loadingData ? '...' : `${stats.completionRate}%`}
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
                {recentActivities.map((activity, index) => (
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
            <CardTitle>Cursos Cadastrados</CardTitle>
            <CardDescription>
              {loadingData ? 'Carregando...' : `${courses.length} cursos na plataforma`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary-500))]" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Nenhum curso cadastrado ainda</p>
                <button 
                  onClick={() => router.push('/admin/courses/new')}
                  className="mt-4 px-4 py-2 bg-[rgb(var(--primary-500))] text-white rounded-lg hover:bg-[rgb(var(--primary-600))] transition-colors"
                >
                  Criar Primeiro Curso
                </button>
              </div>
            ) : (
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
                        Módulos
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {course._count?.enrollments || 0}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {course._count?.modules || 0}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {course.isPublished ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                            className="text-sm text-[rgb(var(--primary-500))] hover:text-[rgb(var(--primary-600))] font-medium"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
    </>
  );
}
