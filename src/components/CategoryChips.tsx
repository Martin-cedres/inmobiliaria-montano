'use client';

import React from 'react';
import { PropertyCategory } from '@/types/property';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  emoji: string;
}

const PRIMARY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todos', emoji: '🏷️' },
  { id: 'casa', label: 'Casas en Venta', emoji: '🏡' },
  { id: 'apartamento', label: 'Alquiler', emoji: '🏢' },
  { id: 'chacra', label: 'Chacras', emoji: '🌾' },
  { id: 'proyecto', label: 'Proyectos', emoji: '🏗️' },
  { id: 'deposito', label: 'Depósitos', emoji: '📦' },
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
    <div className="w-full py-4 bg-white/70 backdrop-blur-sm border-y border-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">
            Categorías:
          </span>
          {PRIMARY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => onSelectCategory(chip.id)}
                className={`px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all flex-shrink-0 shadow-sm border ${
                  isSelected
                    ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-purple-900/20 scale-105 ring-2 ring-[#E85D04]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
