'use client';

import React from 'react';
import { PropertyCategory } from '@/types/property';
import { LayoutGrid, Home, Key, Trees, Building2, Warehouse, MapPin, ChevronRight } from 'lucide-react';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  IconComponent: React.ElementType;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todos', IconComponent: LayoutGrid },
  { id: 'casa', label: 'Casas en Venta', IconComponent: Home },
  { id: 'apartamento', label: 'Alquileres', IconComponent: Key },
  { id: 'terreno', label: 'Terrenos & Solares', IconComponent: MapPin },
  { id: 'chacra', label: 'Chacras & Campos', IconComponent: Trees },
  { id: 'proyecto', label: 'Proyectos en Pozo', IconComponent: Building2 },
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
  const handleChipClick = (id: PropertyCategory) => {
    onSelectCategory(id);
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-2.5 bg-white/95 backdrop-blur-md border-y border-slate-200/80 sticky top-16 sm:top-18 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Grid envolvente multi-fila para que todos los chips estén 100% visibles en celulares */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-0.5">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.IconComponent;
            return (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 transition-all border ${
                  isSelected
                    ? 'bg-[#5e1754] text-white border-[#5e1754] shadow-xs ring-2 ring-[#e85d04]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#5e1754]/50 hover:bg-purple-50/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-amber-300' : 'text-[#5e1754]'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
