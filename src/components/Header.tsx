'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Menu, X, Home, Key, Building2, Calculator } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE, buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappLink = buildGeneralWhatsAppLink('general');

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Utility Bar with Depth Gradient */}
      <div className="bg-gradient-to-r from-[#2d0b28] via-[#43123c] to-[#5e1754] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-amber-300 hidden sm:inline">
              ✨ Inmobiliaria Montaño — San José de Mayo
            </span>
            <span className="text-slate-300 text-[11px]">
              Compromiso real, eficiencia comprobada.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${MONTAÑO_WHATSAPP_PHONE}`}
              className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>092 776 715</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with Subtle Depth & Gold Border */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#5e1754] to-[#2d0b28] rounded-xl flex items-center justify-center text-amber-400 font-black text-xl shadow-sm group-hover:scale-105 transition-transform border border-amber-400/30">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-[#5e1754] transition-colors">
                MONTAÑO
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#e85d04] uppercase mt-0.5">
                NEGOCIOS INMOBILIARIOS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#5e1754]/10 text-[#5e1754] group-hover:bg-[#5e1754] group-hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" />
              </span>
              <span>Inicio</span>
            </Link>
            <Link href="#catalogo" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#e85d04]/10 text-[#e85d04] group-hover:bg-[#e85d04] group-hover:text-white transition-colors">
                <Key className="w-3.5 h-3.5" />
              </span>
              <span>Alquileres</span>
            </Link>
            <Link href="#catalogo" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#5e1754]/10 text-[#5e1754] group-hover:bg-[#5e1754] group-hover:text-white transition-colors">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <span>Ventas</span>
            </Link>
            <Link href="#tasaciones" className="hover:text-[#5e1754] transition-colors flex items-center space-x-1.5 group">
              <span className="p-1.5 rounded-lg bg-[#e85d04]/10 text-[#e85d04] group-hover:bg-[#e85d04] group-hover:text-white transition-colors">
                <Calculator className="w-3.5 h-3.5" />
              </span>
              <span>Tasaciones</span>
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
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Home className="w-5 h-5 text-[#5e1754]" />
            <span>Inicio</span>
          </Link>
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Key className="w-5 h-5 text-[#e85d04]" />
            <span>Alquileres</span>
          </Link>
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Building2 className="w-5 h-5 text-[#5e1754]" />
            <span>Ventas</span>
          </Link>
          <Link
            href="#tasaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
          >
            <Calculator className="w-5 h-5 text-[#e85d04]" />
            <span>Solicitar Tasación</span>
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
