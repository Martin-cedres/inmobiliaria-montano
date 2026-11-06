import React from 'react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import { HeroExploreButton } from '@/components/HeroExploreButton';

export const HeroSearch: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <section className="relative bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white pt-20 pb-10 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Halo Blur radial de fondo para efecto 3D sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Titular Principal Institucional (SSR puro para LCP ultrarrápido) */}
        <div className="space-y-3">
          <span className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
            <span>Inmobiliaria Montaño • Daniel Montaño</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Inmobiliaria Montaño en San José de Mayo
            <span className="block text-xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300 mt-2 sm:mt-3">
              Casas en Venta, Alquileres, Terrenos y Tasaciones Oficiales
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Compra, venta, alquiler y administración de propiedades en San José de Mayo y todo el departamento. Asesoramiento notarial y bancario directo con Daniel Montaño.
          </p>
        </div>

        {/* Botones de Acción Directa en el Hero (CRO 2-CTA Regla de Oro) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <HeroExploreButton />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-full backdrop-blur-md border border-white/20 transition-all text-xs sm:text-sm flex-shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Contacto Directo</span>
          </a>
        </div>

      </div>
    </section>
  );
};
