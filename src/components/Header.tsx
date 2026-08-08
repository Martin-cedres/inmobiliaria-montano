'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Menu, X, Home, Key, Building2, Calculator } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE, buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappLink = buildGeneralWhatsAppLink('general');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Official Brand Logo (Gran Protagonista en Recuadro Rectangular Blanco) */}
          <Link href="/" className="flex items-center space-x-3 group py-1 flex-shrink-0">
            <div className="px-5 sm:px-7 py-2.5 bg-white rounded-2xl border border-purple-100/90 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 duration-300 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Inmobiliaria Montaño Logo"
                className="h-16 sm:h-20 w-auto object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (Estructura de Secciones Limpia) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-semibold text-slate-700">
            <Link href="#catalogo" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#5e1754]/10 text-[#5e1754] group-hover:bg-[#5e1754] group-hover:text-white transition-colors">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <span>Propiedades</span>
            </Link>
            <Link href="#tasaciones" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#e85d04]/10 text-[#e85d04] group-hover:bg-[#e85d04] group-hover:text-white transition-colors">
                <Calculator className="w-3.5 h-3.5" />
              </span>
              <span>Tasaciones</span>
            </Link>
            <Link href="#contacto" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#5e1754]/10 text-[#5e1754] group-hover:bg-[#5e1754] group-hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span>Contacto</span>
            </Link>
          </nav>

          {/* 10% Accent CTA Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e85d04] hover:bg-[#ff7518] active:scale-95 text-white px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-md hover:shadow-orange-500/20 transition-all flex items-center space-x-2 border border-orange-400/30"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#e85d04]" />
              <span>Consulta WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Building2 className="w-5 h-5 text-[#5e1754]" />
            <span>Propiedades</span>
          </Link>
          <Link
            href="#tasaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Calculator className="w-5 h-5 text-[#e85d04]" />
            <span>Solicitar Tasación</span>
          </Link>
          <Link
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Phone className="w-5 h-5 text-[#5e1754]" />
            <span>Contacto</span>
          </Link>
          <div className="pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#e85d04] text-white py-3 rounded-xl font-extrabold text-center flex items-center justify-center space-x-2 shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#e85d04]" />
              <span>Contactar por WhatsApp (092 776 715)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
