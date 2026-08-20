'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PropertyCategory } from '@/types/property';
import { 
  LayoutGrid, 
  Home, 
  Key, 
  Trees, 
  Building2, 
  Warehouse, 
  MapPin, 
  Store, 
  Box, 
  ChevronDown,
  Check,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  shortLabel?: string;
  IconComponent: React.ElementType;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todas las Propiedades', shortLabel: 'Todas', IconComponent: LayoutGrid },
  { id: 'casa', label: 'Casas en Venta', shortLabel: 'Casas', IconComponent: Home },
  { id: 'apartamento', label: 'Alquileres', shortLabel: 'Alquileres', IconComponent: Key },
  { id: 'terreno', label: 'Terrenos & Solares', shortLabel: 'Terrenos', IconComponent: MapPin },
  { id: 'chacra', label: 'Chacras & Campos', shortLabel: 'Chacras', IconComponent: Trees },
  { id: 'local', label: 'Locales Comerciales', shortLabel: 'Locales', IconComponent: Store },
  { id: 'proyecto', label: 'Proyectos', shortLabel: 'Proyectos', IconComponent: Building2 },
  { id: 'modulo', label: 'Módulos Habitacionales', shortLabel: 'Módulos', IconComponent: Box },
  { id: 'deposito', label: 'Depósitos & Galpones', shortLabel: 'Depósitos', IconComponent: Warehouse },
];

interface CategoryChipsProps {
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeChip = CATEGORY_CHIPS.find((c) => c.id === selectedCategory) || CATEGORY_CHIPS[0];
  const ActiveIcon = activeChip.IconComponent;

  const handleSelect = (id: PropertyCategory) => {
    onSelectCategory(id);
    setIsMobileOpen(false);
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    }
    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Close dropdown on ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
      }
    }
    if (isMobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  return (
    /* Contenedor padre de altura reservada fija para evitar saltos al hacer scroll */
    <div className="w-full min-h-[58px] sm:min-h-[64px]" ref={dropdownRef}>
      <div className="w-full py-2.5 bg-white/95 backdrop-blur-md border-b border-[#5E1754]/15 sticky top-16 sm:top-18 z-40 shadow-md shadow-[#5E1754]/5 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
          {/* VISTA MÓVIL (<640px): Selector Personalizado Estilo Inmobiliaria Montaño */}
          <div className="block sm:hidden relative">
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-haspopup="listbox"
              className={`w-full bg-white active:bg-slate-50 border rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-xs transition-all cursor-pointer ${
                isMobileOpen 
                  ? 'border-[#5E1754] ring-2 ring-[#5E1754]/15 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 text-slate-900 font-extrabold text-xs truncate">
                <span className="p-1.5 rounded-xl bg-[#5E1754] text-white flex-shrink-0 shadow-xs">
                  <ActiveIcon className="w-3.5 h-3.5 text-amber-300" />
                </span>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-black text-[#5E1754] leading-tight">
                    Categoría
                  </span>
                  <span className="text-xs font-black text-slate-800 truncate">
                    {activeChip.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 pl-2 text-[#5E1754]">
                <span className="text-[10px] font-extrabold bg-[#5E1754]/10 text-[#5E1754] px-2 py-0.5 rounded-full">
                  Cambiar
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileOpen ? 'rotate-180 text-[#E85D04]' : 'text-[#5E1754]'}`} />
              </div>
            </button>

            {/* Menú Desplegable Personalizado */}
            {isMobileOpen && (
              <>
                {/* Backdrop semi-transparente para cerrar al tocar fuera */}
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] animate-in fade-in duration-150"
                  onClick={() => setIsMobileOpen(false)}
                />

                {/* Card flotante del selector con estética Montaño */}
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-3xl border border-purple-100 shadow-2xl shadow-purple-950/25 p-2.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
                  
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-black text-[#5E1754] uppercase tracking-wider">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#E85D04]" />
                      <span>Filtrar Inmuebles</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1 pt-1">
                    {CATEGORY_CHIPS.map((chip) => {
                      const isSelected = selectedCategory === chip.id;
                      const Icon = chip.IconComponent;
                      
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => handleSelect(chip.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#5E1754] text-white shadow-sm ring-1 ring-[#5E1754]'
                              : 'bg-slate-50/70 hover:bg-purple-50 text-slate-700 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className={`p-2 rounded-xl flex-shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-white text-[#5E1754] shadow-xs border border-slate-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-[#5E1754]'}`} />
                            </span>
                            <span className={`text-xs font-extrabold truncate ${
                              isSelected ? 'text-white' : 'text-slate-800'
                            }`}>
                              {chip.label}
                            </span>
                          </div>

                          {isSelected && (
                            <span className="p-1 bg-[#E85D04] text-white rounded-full flex-shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              </>
            )}
          </div>

          {/* VISTA ESCRITORIO (>=640px): Fila horizontal estricta 100% visible sin scroll ni recortes */}
          <div className="hidden sm:flex items-center justify-between lg:justify-center gap-1 sm:gap-1.5 lg:gap-2">
            {CATEGORY_CHIPS.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              const Icon = chip.IconComponent;
              return (
                <button
                  key={chip.id}
                  onClick={() => handleSelect(chip.id)}
                  className={`px-2 sm:px-2.5 lg:px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-xs ring-2 ring-[#E85D04]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#5E1754]/50 hover:bg-purple-50/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-amber-300' : 'text-[#5E1754]'}`} />
                  <span>
                    <span className="hidden xl:inline">{chip.label}</span>
                    <span className="xl:hidden">{chip.shortLabel || chip.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
