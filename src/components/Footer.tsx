'use client';

import React from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Phone, Mail, MapPin, Award, Home, Key, Trees, Warehouse, Landmark, Calculator, ShieldCheck, Lock, Building2 } from 'lucide-react';
import { MONTAÑO_OFFICIAL_EMAIL, buildGeneralWhatsAppLink } from '@/utils/whatsapp';

interface FooterProps {
  onSelectCategoryFilter?: (category: any, operation?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategoryFilter }) => {
  const generalWhatsappUrl = buildGeneralWhatsAppLink('general');
  const tasacionWhatsappUrl = buildGeneralWhatsAppLink('tasacion');
  const publicarWhatsappUrl = buildGeneralWhatsAppLink('publicar');
  const notarialWhatsappUrl = buildGeneralWhatsAppLink('notarial');

  const handleFilterClick = (category: string, operation?: string) => {
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(category, operation || 'todas');
    }
  };

  return (
    <footer id="contacto" className="bg-[#191024] text-slate-200 border-t border-[#2D1D42] scroll-mt-28 sm:scroll-mt-32">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pb-16">
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
              href="https://maps.google.com/?q=San+Jos%C3%A9+de+Mayo,+Uruguay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-200 hover:text-[#E85D04] font-bold transition-colors pt-1 group"
              title="Abrir ubicación en Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
              <span>San José de Mayo, Uruguay</span>
            </a>
          </div>

          {/* Column 2: Búsquedas Frecuentes (URLs Pre-filtradas de Catálogo) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Búsquedas Frecuentes</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/?category=casa#catalogo"
                  onClick={() => handleFilterClick('casa', 'venta')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Home className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Casas en Venta en San José</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=apartamento#catalogo"
                  onClick={() => handleFilterClick('todos', 'alquiler')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Key className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Alquileres en San José</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=terreno#catalogo"
                  onClick={() => handleFilterClick('terreno')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Terrenos & Solares</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=chacra#catalogo"
                  onClick={() => handleFilterClick('chacra')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Trees className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Chacras y Campos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=deposito#catalogo"
                  onClick={() => handleFilterClick('deposito')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Warehouse className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Galpones y Depósitos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Servicios & Propietarios (WhatsApp Contextualizado) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Servicios & Propietarios</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={tasacionWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Calculator className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Solicitud de Tasación Profesional</span>
                </a>
              </li>
              <li>
                <a
                  href={publicarWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Home className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Publicar mi Inmueble</span>
                </a>
              </li>
              <li>
                <Link
                  href="/?category=proyecto#catalogo"
                  onClick={() => handleFilterClick('proyecto')}
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <Building2 className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Proyectos</span>
                </Link>
              </li>
              <li>
                <a
                  href={notarialWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-[#E85D04] transition-colors flex items-center space-x-2 font-medium group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#E85D04] transition-colors flex-shrink-0" />
                  <span>Asesoramiento Notarial</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto Directo Simplificado e Interactivo */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contacto Directo</h4>
            <div className="space-y-3 text-xs">
              {/* WhatsApp Directo */}
              <a
                href={generalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-slate-200 hover:text-[#E85D04] transition-colors font-bold group"
              >
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
                <span>WhatsApp: 092 776 715</span>
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
                href="https://maps.google.com/?q=San+Jos%C3%A9+de+Mayo,+Uruguay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-slate-200 hover:text-[#E85D04] transition-colors font-semibold group"
                title="Abrir ubicación en Google Maps"
              >
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>San José de Mayo, Uruguay</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="mt-12 pt-6 border-t border-[#2D1D42] text-center text-xs text-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 pr-0 sm:pr-48 lg:pr-56">
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

          <p className="flex items-center space-x-1 flex-wrap justify-center sm:justify-end text-slate-300">
            <span>¿Te interesa un sitio o proyecto web como este?</span>
            <a
              href="https://wa.me/59891090705?text=Hola,%20vi%20la%20web%20de%20Inmobiliaria%20Monta%C3%B1o,%20me%20interesa%20desarrollar%20un%20proyecto%20web%20a%20medida"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E85D04] font-bold hover:underline hover:text-amber-400 transition-colors ml-1"
            >
              Consultá por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
