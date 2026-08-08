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
    <div className="w-full py-2.5 bg-white/95 backdrop-blur-md border-y border-slate-200/80 sticky top-16 sm:top-18 z-40 shadow-xs relative group">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        
        {/* Continuous Horizontal Pill Bar with Peek Scroll Affordance */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 pr-8 sm:pr-0">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.IconComponent;
            return (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.id)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 transition-all flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#5e1754] text-white border-[#5e1754] shadow-xs ring-2 ring-[#e85d04]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#5e1754]/50 hover:bg-purple-50/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-amber-300' : 'text-[#5e1754]'}`} />
                <span className="whitespace-nowrap">{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gradient Mask Fade & Scroll Hint Indicator for Mobile */}
        <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1">
          <ChevronRight className="w-4 h-4 text-[#5e1754] animate-pulse opacity-75" />
        </div>

      </div>
    </div>
  );
};
