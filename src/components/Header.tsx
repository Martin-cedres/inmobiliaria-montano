'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Menu, X, Home, Key, Building2, Calculator, Info } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE, buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappLink = buildGeneralWhatsAppLink('general');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-[#350A2F] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-amber-400 hidden sm:inline">
              ✨ Inmobiliaria Montaño — San José de Mayo
            </span>
            <span className="text-slate-300">
              Compromiso real, eficiencia comprobada.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${MONTAÑO_WHATSAPP_PHONE}`}
              className="flex items-center space-x-1 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>092 776 715</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#5E1754] to-[#350A2F] rounded-xl flex items-center justify-center text-amber-400 font-bold text-xl shadow-md group-hover:scale-105 transition-transform border border-amber-400/30">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl text-[#350A2F] tracking-tight leading-none group-hover:text-[#5E1754] transition-colors">
                MONTAÑO
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#E85D04] uppercase mt-0.5">
                NEGOCIOS INMOBILIARIOS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-[#5E1754] transition-colors flex items-center space-x-1">
              <Home className="w-4 h-4 text-[#5E1754]" />
              <span>Inicio</span>
            </Link>
            <Link href="#catalogo" className="hover:text-[#5E1754] transition-colors flex items-center space-x-1">
              <Key className="w-4 h-4 text-[#E85D04]" />
              <span>Alquileres</span>
            </Link>
            <Link href="#catalogo" className="hover:text-[#5E1754] transition-colors flex items-center space-x-1">
              <Building2 className="w-4 h-4 text-[#5E1754]" />
              <span>Ventas</span>
            </Link>
            <Link href="#tasaciones" className="hover:text-[#5E1754] transition-colors flex items-center space-x-1">
              <Calculator className="w-4 h-4 text-[#E85D04]" />
              <span>Tasaciones</span>
            </Link>
          </nav>

          {/* WhatsApp Direct CTA Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#E85D04]" />
              <span>Consulta WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#350A2F] hover:bg-purple-50 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 font-semibold text-slate-800"
          >
            <Home className="w-5 h-5 text-[#5E1754]" />
            <span>Inicio</span>
          </Link>
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 font-semibold text-slate-800"
          >
            <Key className="w-5 h-5 text-[#E85D04]" />
            <span>Alquileres</span>
          </Link>
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 font-semibold text-slate-800"
          >
            <Building2 className="w-5 h-5 text-[#5E1754]" />
            <span>Ventas</span>
          </Link>
          <Link
            href="#tasaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 font-semibold text-slate-800"
          >
            <Calculator className="w-5 h-5 text-[#E85D04]" />
            <span>Solicitar Tasación</span>
          </Link>
          <div className="pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#E85D04] text-white py-3 rounded-xl font-bold text-center flex items-center justify-center space-x-2 shadow"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#E85D04]" />
              <span>Contactar por WhatsApp (092 776 715)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
