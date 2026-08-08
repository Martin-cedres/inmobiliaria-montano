'use client';

import React from 'react';
import { Building2, MessageCircle, ArrowDown } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const HeroSearch: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <section
      className="relative text-white py-12 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/hero-bg.webp')` }}
    >
      {/* Capa de Superposición Corporativa (Gradient Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d0b28]/85 via-[#43123c]/80 to-[#5e1754]/85 backdrop-blur-[1px]" />

      {/* Glow Sutil de Fondo (Radial Blur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-[#e85d04]/20 via-purple-600/15 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-4 sm:space-y-6">
        
        {/* Logo Integrado Sin Caja Rígida (Fondo Transparente en Desktop) */}
        <div className="hidden sm:inline-block mb-1 group">
          <img
            src="/logo.png"
            alt="Inmobiliaria Montaño"
            className="h-24 sm:h-28 w-auto object-contain mx-auto filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Headline en Blanco Puro y Ámbar Dorado Claro Sólido */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
          Tu próxima propiedad <br className="hidden sm:inline" />
          <span className="text-amber-300 block sm:inline mt-1 sm:mt-0">
            te está esperando
          </span>
        </h1>

        {/* Subtítulo Oficial con Buena Respiración */}
        <p className="text-slate-200 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed px-2 drop-shadow-xs">
          Compromiso real y eficiencia comprobada. Explorá nuestro catálogo en San José y la región: casas, terrenos, campos y proyectos.
        </p>

        {/* Action Buttons: Explorar Catálogo vs Contacto Directo */}
        <div className="pt-3 flex flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#catalogo"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 bg-[#e85d04] hover:bg-[#ff7518] active:scale-95 text-white font-extrabold px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-full shadow-lg text-xs sm:text-sm border border-orange-400/30 transition-all"
          >
            <Building2 className="w-4 h-4 text-amber-200" />
            <span>Explorar Propiedades</span>
            <ArrowDown className="w-3.5 h-3.5 hidden sm:inline-block animate-bounce" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-full backdrop-blur-md border border-white/20 transition-all text-xs sm:text-sm flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Contacto Directo</span>
          </a>
        </div>

      </div>
    </section>
  );
};
