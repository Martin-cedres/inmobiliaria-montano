'use client';

import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const HeroSearch: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <section className="relative bg-gradient-to-b from-[#350A2F] via-[#4A1143] to-[#5E1754] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#E85D04]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* Badge Header */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold text-amber-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Inmobiliaria Montaño — San José de Mayo</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
          Tu próximo hogar en San José <br className="hidden sm:inline" />
          <span className="text-amber-400 font-extrabold">te está esperando</span>
        </h1>

        {/* Tagline */}
        <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Compromiso real, eficiencia comprobada. Explorá nuestro catálogo de propiedades en alquiler, venta, chacras y proyectos en San José.
        </p>

        {/* Direct WhatsApp Call to Action Button */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black px-6 py-3.5 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all text-xs sm:text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#E85D04]" />
            <span>Consultar por WhatsApp (092 776 715)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
