'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Heart, ShieldCheck, Award } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE, MONTAÑO_OFFICIAL_EMAIL, buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const Footer: React.FC = () => {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <footer id="contacto" className="bg-[#191024] text-slate-300 border-t border-[#2D1D42]">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            {/* Official Brand Logo (PNG Transparente) */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Inmobiliaria Montaño Logo"
                className="h-14 w-auto object-contain filter drop-shadow-md"
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Compromiso real, eficiencia comprobada. Tu referencia inmobiliaria en el departamento de San José. Asesoramiento honesto y profesional en ventas, alquileres y tasaciones.
            </p>

            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold pt-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>San José de Mayo, Uruguay</span>
            </div>
          </div>

          {/* Column 2: Categorías Frecuentes */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Búsquedas Frecuentes</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  🏡 Casas en Venta en San José
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  🏢 Alquileres con Garantía ANDA / CGN
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  🌾 Chacras y Campos en San José
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  📦 Galpones y Depósitos Industriales
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  🏛️ Propiedades Aptas Crédito Bancario
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Navegación & Propietarios */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Servicios & Propietarios</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tasaciones" className="hover:text-amber-400 transition-colors text-amber-300 font-semibold">
                  📐 Solicitud de Tasación Profesional
                </a>
              </li>
              <li>
                <a href="#tasaciones" className="hover:text-amber-400 transition-colors">
                  📢 Publicar mi Inmueble con Montaño
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-amber-400 transition-colors">
                  🏗️ Proyectos Residenciales en Pozo
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  💬 Asesoramiento Notarial / Legal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto Directo */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contacto Directo</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors font-bold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+598 92 776 715 (WhatsApp)</span>
              </a>

              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                <span className="truncate">{MONTAÑO_OFFICIAL_EMAIL}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                <span>San José de Mayo, Uruguay</span>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Mensaje Directo</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="mt-12 pt-6 border-t border-[#2D1D42] text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Inmobiliaria Montaño. San José de Mayo, Uruguay. Todos los derechos reservados.</p>
          <p className="flex items-center space-x-1 flex-wrap justify-center">
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
