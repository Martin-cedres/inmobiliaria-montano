'use client';

import React from 'react';
import { PropertyCategory } from '@/types/property';
import { LayoutGrid, Home, Key, Trees, Building2, Warehouse } from 'lucide-react';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  IconComponent: React.ElementType;
}

const PRIMARY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todos', IconComponent: LayoutGrid },
  { id: 'casa', label: 'Casas en Venta', IconComponent: Home },
  { id: 'apartamento', label: 'Alquiler', IconComponent: Key },
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
  return (
    <div className="w-full py-3.5 bg-white/90 backdrop-blur-md border-y border-slate-200/80 sticky top-20 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">
            Categorías:
          </span>
          {PRIMARY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.IconComponent;
            return (
              <button
                key={chip.id}
                onClick={() => onSelectCategory(chip.id)}
                className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#5e1754] text-white border-[#5e1754] shadow-md ring-2 ring-[#e85d04] scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#5e1754]/50 hover:bg-purple-50/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-[#5e1754]'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
