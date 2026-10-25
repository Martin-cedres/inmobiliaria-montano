'use client';

import React from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Mail, MapPin, Home, Key, Trees, Warehouse, Landmark, Calculator, ShieldCheck, Lock, Building2, TrendingUp, Clock } from 'lucide-react';
import { MONTAÑO_OFFICIAL_EMAIL, buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import { trackWhatsappClick } from '@/utils/telemetry';

interface FooterProps {
  onSelectCategoryFilter?: (category: string, operation?: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const generalWhatsappUrl = buildGeneralWhatsAppLink('general');
  const notarialWhatsappUrl = buildGeneralWhatsAppLink('notarial');

  return (
    <footer id="contacto" className="bg-[#191024] text-slate-200 border-t border-[#2D1D42] scroll-mt-28 sm:scroll-mt-32">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            {/* Official Brand Logo (PNG Transparente + Tipografía de Marca) */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Inmobiliaria Montaño Logo"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md"
              />
              <div className="flex flex-col text-left justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-[#E85D04]">
                  Inmobiliaria
                </span>
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  MONTAÑO
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Compromiso real, eficiencia comprobada. Tu referencia inmobiliaria en el departamento de San José. Asesoramiento honesto y profesional en ventas, alquileres y tasaciones.
            </p>

            <a
              href="https://share.google/6I1gbffV5ZTS5heXV"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-200 hover:text-[#E85D04] font-bold transition-colors pt-1 group"
              title="Ver ficha oficial y opiniones en Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
              <span>Calle 25 de Mayo 338, San José de Mayo — Google Maps</span>
            </a>
          </div>

          {/* Column 2: Búsquedas Frecuentes (URLs Pre-filtradas de Catálogo) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Búsquedas Frecuentes</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/casas-en-venta-san-jose-de-mayo"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Home className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Casas en Venta en San José de Mayo</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/alquileres-san-jose-de-mayo"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Key className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Alquileres en San José</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terrenos-y-chacras-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Terrenos en Venta en San José</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terrenos-y-chacras-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Trees className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Chacras y Campos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/locales-comerciales-y-galpones-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Warehouse className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Locales y Galpones</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/casas-aptas-para-banco-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Landmark className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Casas Aptas para Banco</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/inversiones-inmobiliarias-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Inversiones & Renta</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Servicios & Propietarios (WhatsApp Contextualizado) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Servicios & Propietarios</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/tasaciones-san-jose-de-mayo"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Calculator className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Tasación Profesional</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/vender-propiedad-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Home className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Vender mi Propiedad</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/alquilar-mi-propiedad-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Key className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Alquilar y Administrar</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/proyectos-y-viviendas-modulares-san-jose"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Building2 className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Proyectos & Módulos</span>
                </Link>
              </li>
              <li>
                <a
                  href={notarialWhatsappUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  onClick={() => {
                    trackWhatsappClick({
                      buttonPosition: 'footer',
                      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
                    });
                  }}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Asesoramiento Notarial</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto Directo y Datos Oficiales (NAP) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contacto Directo</h4>
            <address className="not-italic space-y-2.5 text-xs text-slate-200">
              <div className="font-bold text-white">
                Inmobiliaria Montaño <span className="text-purple-300 font-normal text-[11px] block sm:inline">(Director: Daniel Montaño)</span>
              </div>

              {/* Dirección Física Oficial */}
              <div className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-purple-300 flex-shrink-0 mt-0.5" />
                <span>Calle 25 de Mayo 338, CP 80000, San José de Mayo, Departamento de San José, Uruguay</span>
              </div>

              {/* Horario de Atención */}
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
                <span>Lunes a Viernes de 09:00 a 18:00 hs</span>
              </div>

              {/* WhatsApp Directo */}
              <a
                href={generalWhatsappUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => {
                  trackWhatsappClick({
                    buttonPosition: 'footer',
                    pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
                  });
                }}
                className="flex items-center space-x-2.5 text-slate-200 hover:text-[#E85D04] transition-colors font-bold group pt-0.5"
              >
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
                <span>092 776 715 (+598 92 776 715)</span>
              </a>

              {/* Email Interactivo mailto */}
              <a
                href={`mailto:${MONTAÑO_OFFICIAL_EMAIL}`}
                className="flex items-center space-x-2.5 text-slate-200 hover:text-[#E85D04] transition-colors font-semibold group"
                title="Enviar correo electrónico"
              >
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="truncate">{MONTAÑO_OFFICIAL_EMAIL}</span>
              </a>

              {/* Ubicación Interactiva Google Maps */}
              <a
                href="https://share.google/6I1gbffV5ZTS5heXV"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[11px] text-purple-300 hover:text-[#E85D04] transition-colors font-medium pt-1"
                title="Ver ubicación, teléfono y opiniones en Google Maps"
              >
                <span>Ficha oficial en Google Business Profile →</span>
              </a>
            </address>
          </div>

        </div>

        {/* Enlazado Interno Estratégico (Guías de Autoridad y Cobertura Local) */}
        <div className="mt-10 pt-6 border-t border-[#2D1D42]/80">
          <p className="text-[11px] font-black uppercase tracking-wider text-purple-300/80 mb-3">
            Guías Inmobiliarias & Cobertura Departamental San José
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
            <Link
              href="/inmobiliaria-san-jose"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Inmobiliaria en San José
            </Link>
            <span className="text-purple-400/40 hidden sm:inline">•</span>
            <Link
              href="/guia-tasacion-inmobiliaria-san-jose"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Guía de Tasación Profesional
            </Link>
            <span className="text-purple-400/40 hidden sm:inline">•</span>
            <Link
              href="/guia-compra-propiedad-credito-bancario-uruguay"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Guía Compra con Crédito Bancario
            </Link>
            <span className="text-purple-400/40 hidden sm:inline">•</span>
            <Link
              href="/estadisticas-inmobiliarias-san-jose"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Estadísticas del Mercado San José
            </Link>
            <span className="text-purple-400/40 hidden sm:inline">•</span>
            <Link
              href="/tasaciones-san-jose-de-mayo"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Tasaciones Profesionales
            </Link>
            <span className="text-purple-400/40 hidden sm:inline">•</span>
            <Link
              href="/vender-propiedad-san-jose"
              className="hover:text-[#E85D04] transition-colors font-medium"
            >
              Publicar & Vender mi Propiedad
            </Link>
          </div>
        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="mt-8 pt-6 border-t border-[#2D1D42] text-center text-xs text-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 pr-0 sm:pr-24 lg:pr-28">
          <div className="flex items-center space-x-2">
            <p>© {new Date().getFullYear()} Inmobiliaria Montaño. Todos los derechos reservados. San José de Mayo, Uruguay.</p>
            <Link
              href="/admin"
              className="text-slate-400 hover:text-[#E85D04] transition-colors p-1"
              title="Acceso Administración Interna"
            >
              <Lock className="w-3 h-3" />
            </Link>
          </div>

          <div data-nosnippet>
            <p className="flex items-center space-x-1 flex-wrap justify-center sm:justify-end text-slate-300">
              <span>¿Te interesa un sitio o proyecto web como este?</span>
              <a
                href="https://wa.me/59891090705?text=Hola,%20vi%20la%20web%20de%20Inmobiliaria%20Monta%C3%B1o,%20me%20interesa%20desarrollar%20un%20proyecto%20web%20a%20medida"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-[#E85D04] font-bold hover:underline hover:text-amber-400 transition-colors ml-1"
              >
                Consultá por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
