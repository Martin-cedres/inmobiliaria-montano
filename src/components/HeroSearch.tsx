'use client';

import React from 'react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Building2, ArrowDown } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const HeroSearch: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <section className="relative bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white pt-20 pb-10 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Halo Blur radial de fondo para efecto 3D sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Titular Principal Institucional */}
        <div className="space-y-3">
          <span className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
            <span>Inmobiliaria Montaño • San José de Mayo</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Tu próxima propiedad <span className="text-amber-300">te está esperando.</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Ventas, alquileres, terrenos y chacras en San José de Mayo. Tasaciones profesionales, transacciones seguras y atención directa con Daniel Montaño.
          </p>
        </div>

        {/* Botones de Acción Directa en el Hero (60-30-10 Regla Visual) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <a
            href="#catalogo"
            className="inline-flex items-center justify-center space-x-2.5 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base flex-shrink-0"
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
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Contacto Directo</span>
          </a>
        </div>

      </div>
    </section>
  );
};
