'use client';

import React from 'react';
import { PropertyCategory } from '@/types/property';
import { LayoutGrid, Home, Key, Trees, Building2, Warehouse, MapPin, Store, ChevronDown } from 'lucide-react';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  IconComponent: React.ElementType;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todas las Propiedades', IconComponent: LayoutGrid },
  { id: 'casa', label: 'Casas en Venta', IconComponent: Home },
  { id: 'apartamento', label: 'Alquileres', IconComponent: Key },
  { id: 'terreno', label: 'Terrenos & Solares', IconComponent: MapPin },
  { id: 'chacra', label: 'Chacras & Campos', IconComponent: Trees },
  { id: 'local', label: 'Locales Comerciales', IconComponent: Store },
  { id: 'proyecto', label: 'Proyectos', IconComponent: Building2 },
  { id: 'deposito', label: 'Depósitos & Galpones', IconComponent: Warehouse },
];

interface CategoryChipsProps {
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const activeChip = CATEGORY_CHIPS.find((c) => c.id === selectedCategory) || CATEGORY_CHIPS[0];
  const ActiveIcon = activeChip.IconComponent;

  const handleSelectChange = (id: PropertyCategory) => {
    onSelectCategory(id);
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    /* Contenedor padre de altura reservada fija para evitar el sticky jump al hacer scroll */
    <div className="w-full min-h-[58px] sm:min-h-[64px]">
      <div className="w-full py-2.5 bg-white/95 backdrop-blur-md border-b border-[#5e1754]/15 sticky top-16 sm:top-18 z-40 shadow-md shadow-[#5e1754]/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VISTA MÓVIL (<640px): Dropdown Nativo Estilizado en 1 sola fila */}
        <div className="block sm:hidden relative">
          <div className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs transition-colors">
            <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-xs sm:text-sm truncate">
              <span className="p-1 rounded-lg bg-[#5e1754]/10 text-[#5e1754] flex-shrink-0">
                <ActiveIcon className="w-4 h-4 text-[#5e1754]" />
              </span>
              <span className="truncate">{activeChip.label}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500 pl-2">
              <ChevronDown className="w-4 h-4 text-[#5e1754]" />
            </div>
          </div>

          {/* Select nativo transparente encimado para disparar el picker de iOS/Android */}
          <select
            value={selectedCategory}
            onChange={(e) => handleSelectChange(e.target.value as PropertyCategory)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base"
          >
            {CATEGORY_CHIPS.map((chip) => (
              <option key={chip.id} value={chip.id}>
                {chip.label}
              </option>
            ))}
          </select>
        </div>

        {/* VISTA ESCRITORIO (>=640px): Fila horizontal limpia de píldoras */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.IconComponent;
            return (
              <button
                key={chip.id}
                onClick={() => handleSelectChange(chip.id)}
                className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all border ${
                  isSelected
                    ? 'bg-[#5e1754] text-white border-[#5e1754] shadow-xs ring-2 ring-[#e85d04]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#5e1754]/50 hover:bg-purple-50/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-[#5e1754]'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        </div>
      </div>
    </div>
  );
};
