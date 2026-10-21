'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, PhoneCall, Sparkles, Home, Trees } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import { trackWhatsappClick } from '@/utils/telemetry';

interface OwnerCaptureBannerProps {
  variant?: 'home' | 'property-detail';
  currentCity?: string;
  className?: string;
}

export const OwnerCaptureBanner: React.FC<OwnerCaptureBannerProps> = ({
  variant = 'home',
  currentCity = 'San José de Mayo',
  className = '',
}) => {
  const whatsappUrl = buildGeneralWhatsAppLink('vender');

  const handleWhatsappClick = () => {
    trackWhatsappClick({
      buttonPosition: 'owner_lead',
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
  };

  if (variant === 'property-detail') {
    return (
      <section
        aria-label="Captación de propiedades"
        className={`bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/20 overflow-hidden relative ${className}`}
      >
        {/* Glow de fondo */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
          {/* Imagen Flyer 1:1 Cuadrada */}
          <div className="relative w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0">
            <Image
              src="/images/se-precisan-propiedades-1x1.jpg"
              alt="Se precisan propiedades para la venta en San José — Inmobiliaria Montaño"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 176px, 208px"
              priority={false}
            />
          </div>

          {/* Contenido Textual */}
          <div className="space-y-3.5 text-left flex-grow">
            <div className="inline-flex items-center space-x-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clientes Concretos en Espera</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              ¿Tenés una propiedad para vender en <span className="text-amber-300">{currentCity}</span>?
            </h3>

            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-xl">
              Compradores calificados están buscando activamente <strong>Casas, Terrenos, Solares y Chacras</strong> en esta zona. Tasamos profesionalmente y publicamos tu inmueble con máxima difusión.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-purple-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>0 costo inicial de tasación</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Comisión solo contra venta firmada</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/vender-propiedad-san-jose"
                className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                <span>Conocer Cómo Vender mi Propiedad</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsappClick}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Hablar con Daniel Montaño</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant 'home' (Full-width banner de alto impacto para la portada)
  return (
    <section
      aria-label="Captación destacada de propiedades para propietarios"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}
    >
      <div className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-3xl sm:rounded-[2rem] p-6 sm:p-10 lg:p-12 shadow-2xl border border-purple-400/20 relative overflow-hidden">
        {/* Glow estético en esquina */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Columna Izquierda: Copy persuasivo */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Oportunidad para Propietarios en San José</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              ¡Se precisan propiedades <br className="hidden sm:inline" />
              <span className="text-amber-300">para la venta</span> en San José!
            </h2>

            <p className="text-sm sm:text-base text-purple-100 font-normal leading-relaxed max-w-2xl">
              Contamos con una cartera activa de compradores concretos esperando adquirir <strong>casas, solares, terrenos y chacras</strong> en San José de Mayo y zonas aledañas.
            </p>

            {/* Micro-puntos de valor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-purple-100">
              <div className="flex items-start space-x-2.5">
                <Home className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Casas y Apartamentos:</strong> Alta demanda en Centro, Colón y Molino.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Trees className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Terrenos y Chacras:</strong> Búsqueda activa de solares y fracciones.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Tasación profesional:</strong> Fijamos el precio real de mercado.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Seguridad notarial:</strong> Blindaje legal con Daniel Montaño.
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/vender-propiedad-san-jose"
                className="inline-flex items-center space-x-2.5 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer"
              >
                <span>Publicar mi Inmueble con Montaño</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsappClick}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Flyer Oficial 4:3 */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 transform hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/se-precisan-propiedades-4x3.jpg"
                alt="¡Se precisan propiedades para la venta! Clientes concretos esperando — Inmobiliaria Montaño"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
