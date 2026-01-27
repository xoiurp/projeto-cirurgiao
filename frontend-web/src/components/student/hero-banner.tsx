'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  locations?: string[];
}

export function HeroBanner({
  title = "A Nova Turma De Pós-Graduação Em Cirurgias Está Oficialmente Aberta.",
  subtitle = "18 meses de prática real, duplas por mesa e mentoria direta para formar cirurgiões confiantes.",
  ctaText = "Quero Conhecer A Pós-Graduação!",
  ctaLink = "#",
  locations = [
    "Porto Alegre - RS",
    "Manaus - AM",
    "São José Do Rio Preto - SP",
    "Brasília - DF",
    "Belo Horizonte - MG"
  ]
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl">
      {/* Container principal */}
      <div className="relative grid md:grid-cols-2 gap-8 p-6 md:p-10 lg:p-12">
        {/* Coluna Esquerda - Conteúdo */}
        <div className="flex flex-col justify-center space-y-6 z-10">
          {/* Título */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>

          {/* Subtítulo */}
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Coluna Direita - Logo C */}
        <div className="relative flex items-center justify-center -mb-16 md:-mb-20 lg:-mb-24 z-10">
          {/* Logo C com imagem de fundo - sem efeitos, com margem negativa para sobrepor a barra */}
          <div className="relative w-full max-w-md aspect-square">
            <img
              src="/arte-C.png"
              alt="Projeto Cirurgião"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Barra Inferior - Localizações */}
      <div 
        className="relative z-0 px-6 md:px-10 lg:px-12 py-6 md:py-8 overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(47, 128, 237, 0.7), rgba(0, 61, 166, 0.7)),
            url('/faixa-bg.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="flex flex-col gap-2 relative z-10">
          {/* Título da seção */}
          <h3 className="text-white font-bold text-lg md:text-xl">
            EXPANDINDO HORIZONTES EM 2026
          </h3>

          {/* Localizações */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white text-sm md:text-base">
            {locations.map((location, index) => (
              <span key={index} className="whitespace-nowrap">
                {location}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent pointer-events-none" />
    </div>
  );
}