'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  BookOpen,
  Users,
  Folders,
  Video,
  Settings,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Cursos',
    href: '/dashboard/courses',
    icon: BookOpen,
  },
  {
    title: 'Alunos',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Módulos',
    href: '/dashboard/modules',
    icon: Folders,
  },
  {
    title: 'Vídeos',
    href: '/dashboard/videos',
    icon: Video,
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-[rgb(var(--border))] bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[rgb(var(--border))] px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-[rgb(var(--primary-500))]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Projeto
            </span>
            <span className="text-xs font-semibold text-[rgb(var(--primary-500))]">
              Cirurgião
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[rgb(var(--primary-500)/0.1)] text-[rgb(var(--primary-600))] border-l-2 border-[rgb(var(--primary-500))]'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive
                    ? 'text-[rgb(var(--primary-500))]'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
