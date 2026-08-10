'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Menu, X, Building2, Phone, Home } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappLink = buildGeneralWhatsAppLink('general');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Destacado de Inmobiliaria Montaño (Mayor Presencia Visual) */}
          <Link href="/" className="flex items-center space-x-2 group py-1 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Inmobiliaria Montaño"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-102 transition-transform duration-300"
            />
          </Link>

          {/* Menú Central Limpio (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link
              href="#catalogo"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Propiedades
            </Link>
            <Link
              href="#tasaciones"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Tasaciones
            </Link>
            <Link
              href="#contacto"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Contacto
            </Link>
          </nav>

          {/* Botón CTA Naranja Institucional (Imán de Captación: Publicar mi Inmueble) */}
          <div className="hidden sm:flex items-center">
            <a
              href="#tasaciones"
              className="bg-[#e85d04] hover:bg-[#ff7518] active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-orange-500/20 transition-all border border-orange-400/20"
            >
              Publicar mi Inmueble
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#5e1754]" /> : <Menu className="w-6 h-6 text-[#5e1754]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm"
          >
            <Home className="w-5 h-5 text-[#5e1754]" />
            <span>Ver Catálogo de Propiedades</span>
          </Link>

          <Link
            href="#tasaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm"
          >
            <Calculator className="w-5 h-5 text-[#e85d04]" />
            <span>Solicitud de Tasación</span>
          </Link>

          <Link
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm"
          >
            <Phone className="w-5 h-5 text-[#5e1754]" />
            <span>Contacto Directo</span>
          </Link>

          <div className="pt-2">
            <a
              href="#tasaciones"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#e85d04] hover:bg-[#ff7518] text-white py-3 rounded-xl font-black text-center shadow-md text-sm block"
            >
              Publicar mi Inmueble
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
