'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Building2, Phone, Home, Compass, Sparkles, Key, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOwnerDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Margen de gracia de 250ms para que el cursor cruce cómodamente hacia el desplegable
    closeTimeoutRef.current = setTimeout(() => {
      setOwnerDropdownOpen(false);
    }, 250);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMobileMenuOpen(false); // Evita superposición si el menú móvil estaba abierto
    setOwnerDropdownOpen((prev) => !prev);
  };

  // Cerrar el dropdown al hacer click fuera o presionar Escape (soporta mouse y touch)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target as Node)) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setOwnerDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setOwnerDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMapClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('set-catalog-view', { detail: { view: 'map', scroll: true } }));
      window.history.replaceState(null, '', '/?view=map#catalogo');
    }
    setMobileMenuOpen(false);
    setOwnerDropdownOpen(false);
  };

  const handleCatalogClick = () => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('set-catalog-view', { detail: { view: 'grid', scroll: true } }));
    }
    setMobileMenuOpen(false);
    setOwnerDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Destacado de Inmobiliaria Montaño */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group py-1 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Inmobiliaria Montaño"
              className="h-10 sm:h-13 lg:h-15 w-auto object-contain group-hover:scale-102 transition-transform duration-300 drop-shadow-xs"
            />
            <div className="flex flex-col text-left justify-center">
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-[#E85D04] leading-none">
                Inmobiliaria
              </span>
              <span className="text-sm sm:text-lg lg:text-xl font-black tracking-tight text-[#5E1754] leading-tight">
                MONTAÑO
              </span>
            </div>
          </Link>

          {/* Menú Central Limpio (Desktop / Laptops) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-semibold text-slate-600">
            <Link
              href="/#catalogo"
              onClick={handleCatalogClick}
              className="hover:text-[#5e1754] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Propiedades
            </Link>
            <Link
              href="/casas-en-venta-san-jose-de-mayo"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 font-bold after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Casas en Venta
            </Link>
            <Link
              href="/?view=map#catalogo"
              onClick={handleMapClick}
              rel="nofollow"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 flex items-center gap-1.5 text-slate-700 font-bold after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#e85d04] hover:after:w-full after:transition-all duration-300"
            >
              <Compass className="w-4 h-4 text-[#E85D04]" />
              <span>Mapa</span>
            </Link>
            <Link
              href="/#contacto"
              className="hover:text-[#5e1754] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5e1754] hover:after:w-full after:transition-all duration-300"
            >
              Contacto
            </Link>
          </nav>

          {/* Acciones Derecha (Adaptable a todos los dispositivos) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Botón CTA Naranja con Desplegable: Soy Propietario (Desktop, Tablet y Mobile) */}
            <div
              ref={ownerDropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={handleButtonClick}
                className="bg-[#e85d04] hover:bg-[#ff7518] active:scale-95 text-white px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xs hover:shadow-orange-500/20 transition-all border border-orange-400/20 inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer touch-manipulation"
                aria-expanded={ownerDropdownOpen}
                aria-haspopup="true"
                aria-label="Menú de opciones para propietarios"
              >
                <span className="hidden xs:inline sm:inline">Soy Propietario</span>
                <span className="inline xs:hidden sm:hidden">Propietarios</span>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${ownerDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu para Propietarios (Alineado a la derecha, con z-index alto) */}
              <div
                role="menu"
                className={`absolute right-0 top-full pt-2 w-72 max-w-[calc(100vw-1.5rem)] sm:w-80 z-50 transition-all duration-200 origin-top-right ${
                  ownerDropdownOpen ? 'opacity-100 visible translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 scale-95 pointer-events-none'
                }`}
              >
                {/* Puente invisible de interacción que cubre cualquier espacio entre el botón y el desplegable */}
                <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 overflow-hidden">
                  <div className="px-4 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Opciones para Propietarios
                    </span>
                    <span className="text-[10px] font-bold text-[#E85D04] bg-orange-50 px-2 py-0.5 rounded-full">
                      San José
                    </span>
                  </div>

                  <div className="p-1 space-y-1">
                    <Link
                      href="/vender-propiedad-san-jose"
                      onClick={() => setOwnerDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-transparent active:bg-orange-100/60 transition-all duration-200 group touch-manipulation"
                      role="menuitem"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 text-[#E85D04] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E85D04] group-hover:text-white group-hover:border-[#E85D04] group-hover:scale-105 group-hover:shadow-md group-hover:shadow-orange-500/25 transition-all duration-200">
                        <Home className="w-5 h-5 transition-transform duration-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-black text-slate-900 group-hover:text-[#E85D04] transition-colors">
                            Vender mi Propiedad
                          </span>
                          <span className="text-[10px] font-black text-[#E85D04] opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-500 leading-snug truncate">
                          Compradores en espera en San José
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/alquilar-mi-propiedad-san-jose"
                      onClick={() => setOwnerDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-transparent active:bg-purple-100/60 transition-all duration-200 group touch-manipulation"
                      role="menuitem"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 border border-[#5E1754]/20 text-[#5E1754] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5E1754] group-hover:text-white group-hover:border-[#5E1754] group-hover:scale-105 group-hover:shadow-md group-hover:shadow-purple-950/25 transition-all duration-200">
                        <Key className="w-5 h-5 transition-transform duration-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-black text-slate-900 group-hover:text-[#5E1754] transition-colors">
                            Alquilar mi Propiedad
                          </span>
                          <span className="text-[10px] font-black text-[#5E1754] opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-500 leading-snug truncate">
                          Garantías homologadas y renta puntual
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle Button (Solo visible en pantallas < md) */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setOwnerDropdownOpen(false);
                }}
                className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#5e1754]" /> : <Menu className="w-6 h-6 text-[#5e1754]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Móviles y Tablets < md) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Tarjeta Destacada para Propietarios en Móvil */}
          <div className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-2xl p-4 shadow-lg border border-purple-400/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                Servicios para Propietarios
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                Directo con Daniel
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-0.5">
              <Link
                href="/vender-propiedad-san-jose"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Vender mi Propiedad</span>
                    <span className="text-[10px] text-purple-200 font-medium">Demanda activa de compra</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
                  Venta →
                </span>
              </Link>

              <Link
                href="/alquilar-mi-propiedad-san-jose"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Alquilar mi Propiedad</span>
                    <span className="text-[10px] text-purple-200 font-medium">Garantías homologadas</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
                  Renta →
                </span>
              </Link>
            </div>
          </div>

          {/* Navegación de Inmuebles */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 px-3 tracking-wider">
              Explorar Catálogo
            </span>
            <Link
              href="/#catalogo"
              onClick={handleCatalogClick}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm group transition-colors"
            >
              <Home className="w-5 h-5 text-[#5E1754] group-hover:text-[#E85D04] transition-colors" />
              <span>Ver Catálogo Completo</span>
            </Link>

            <Link
              href="/casas-en-venta-san-jose-de-mayo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm group transition-colors"
            >
              <Building2 className="w-5 h-5 text-[#5E1754] group-hover:text-[#E85D04] transition-colors" />
              <span>Casas en Venta en San José</span>
            </Link>

            <Link
              href="/?view=map#catalogo"
              onClick={handleMapClick}
              rel="nofollow"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 text-slate-800 font-bold text-sm group transition-colors"
            >
              <Compass className="w-5 h-5 text-[#E85D04] group-hover:rotate-45 transition-transform" />
              <span className="text-[#E85D04] font-bold">Mapa Interactivo de Inmuebles</span>
            </Link>

            <Link
              href="/#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 text-slate-800 font-bold text-sm group transition-colors"
            >
              <Phone className="w-5 h-5 text-[#5E1754] group-hover:text-[#E85D04] transition-colors" />
              <span>Contacto y Ubicación</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

