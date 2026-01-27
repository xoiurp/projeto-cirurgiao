import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, BookOpen, Video } from 'lucide-react';
import { Module } from '@/lib/types/course.types';

interface ModuleCardProps {
  module: Module;
  courseId: string;
  moduleIndex: number;
  completedVideos: number;
  totalVideos: number;
  progressPercentage: number;
}

export function ModuleCard({ 
  module, 
  courseId, 
  moduleIndex, 
  completedVideos, 
  totalVideos,
  progressPercentage 
}: ModuleCardProps) {
  const isCompleted = progressPercentage === 100;
  const isStarted = progressPercentage > 0;

  return (
    <Card className="group relative overflow-hidden bg-white border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full rounded-lg !p-0 !gap-0">
      {/* Borda superior colorida - aparece no hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      <Link href={`/student/courses/${courseId}/modules/${module.id}`} className="flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          {(module.thumbnailHorizontal || module.thumbnailVertical || module.thumbnail) ? (
            <Image
              src={module.thumbnailHorizontal || module.thumbnailVertical || module.thumbnail || ''}
              alt={module.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Número do módulo */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 md:px-3 md:py-1.5 rounded-full font-bold text-xs md:text-sm shadow-sm border border-gray-200">
            Módulo {moduleIndex + 1}
          </div>

          {/* Badge de status */}
          {isCompleted && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded font-semibold text-[10px] md:text-xs uppercase tracking-wide flex items-center gap-0.5 md:gap-1 shadow-sm">
              <CheckCircle2 className="h-2.5 w-2.5 md:h-3 md:w-3" />
              <span className="hidden sm:inline">Concluído</span>
            </div>
          )}
          {isStarted && !isCompleted && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded font-semibold text-[10px] md:text-xs uppercase tracking-wide flex items-center gap-0.5 md:gap-1 shadow-sm">
              <Play className="h-2.5 w-2.5 md:h-3 md:w-3 hidden sm:block" />
              {Math.round(progressPercentage)}%
            </div>
          )}
        </div>

        <CardContent className="p-3 md:p-4 flex-1 flex flex-col bg-white">
          {/* Título */}
          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {module.title}
          </h3>

          {/* Descrição - oculta em mobile muito pequeno */}
          {module.description && (
            <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2 hidden sm:block">
              {module.description}
            </p>
          )}

          <div className="flex-1" />

          {/* Informações do módulo */}
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <span>{totalVideos} <span className="hidden sm:inline">aulas</span></span>
            </div>
          </div>

          {/* Seção de progresso */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-gray-600">
                {completedVideos}/{totalVideos} <span className="hidden sm:inline">concluídas</span>
              </span>
              <span className="font-semibold text-gray-900">{Math.round(progressPercentage)}%</span>
            </div>
            {/* Progress bar com gradiente premium */}
            <div className="h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{width: `${progressPercentage}%`}}
              />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}