'use client';

import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const HeroSearch: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <section className="relative bg-gradient-to-br from-[#2d0b28] via-[#43123c] to-[#5e1754] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      
      {/* Glow Sutil de Fondo (Radial Blur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#e85d04]/15 via-purple-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* Prominent Logo Presentation (Tarjeta Blanca con Bordes Redondeados) */}
        <div className="inline-block mb-3 relative group">
          <div className="p-3 sm:p-5 bg-white rounded-3xl border border-white/50 shadow-2xl group-hover:scale-105 transition-all duration-300">
            <img
              src="/logo.png"
              alt="Inmobiliaria Montaño Logo Oficial"
              className="h-24 sm:h-32 w-auto object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Headline con Text Gradient Corporativo */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
          Tu próximo hogar en San José <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
            te está esperando
          </span>
        </h1>

        {/* Tagline Legible */}
        <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Compromiso real, eficiencia comprobada. Explorá nuestro catálogo exclusivo de propiedades en alquiler, venta, chacras y proyectos en San José.
        </p>

        {/* 10% Accent CTA Button con Glow Sutil */}
        <div className="pt-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 bg-[#e85d04] hover:bg-[#ff7518] active:scale-95 text-white font-black px-7 py-4 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all text-xs sm:text-sm border border-orange-400/30"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#e85d04]" />
            <span>Consultar por WhatsApp (092 776 715)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
