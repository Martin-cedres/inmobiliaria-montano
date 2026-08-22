'use client';

import React, { useRef, useEffect } from 'react';
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
} from 'lucide-react';

interface CategoryChipItem {
  id: PropertyCategory;
  label: string;
  shortLabel?: string;
  IconComponent: React.ElementType;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  { id: 'todos', label: 'Todas', IconComponent: LayoutGrid },
  { id: 'casa', label: 'Casas', IconComponent: Home },
  { id: 'apartamento', label: 'Alquileres', IconComponent: Key },
  { id: 'terreno', label: 'Terrenos', IconComponent: MapPin },
  { id: 'chacra', label: 'Chacras', IconComponent: Trees },
  { id: 'local', label: 'Locales', IconComponent: Store },
  { id: 'proyecto', label: 'Proyectos', IconComponent: Building2 },
  { id: 'modulo', label: 'Módulos', IconComponent: Box },
  { id: 'deposito', label: 'Depósitos', IconComponent: Warehouse },
];

interface CategoryChipsProps {
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const chipRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleSelect = (id: PropertyCategory) => {
    onSelectCategory(id);
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll the active chip into view on mobile swipe container
  useEffect(() => {
    if (selectedCategory && chipRefs.current[selectedCategory]) {
      chipRefs.current[selectedCategory]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCategory]);

  return (
    <div className="w-full min-h-[54px] sm:min-h-[60px]">
      <div className="w-full py-2 bg-white/95 backdrop-blur-md border-b border-[#5E1754]/15 sticky top-16 sm:top-18 z-40 shadow-sm shadow-[#5E1754]/5 transition-all">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          
          {/* Tira Horizontal: 100% visible y centrada en pantallas medianas y grandes, deslizable en móviles */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-2 justify-start md:justify-center">
            {CATEGORY_CHIPS.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              const Icon = chip.IconComponent;

              return (
                <button
                  key={chip.id}
                  ref={(el) => { chipRefs.current[chip.id] = el; }}
                  onClick={() => handleSelect(chip.id)}
                  type="button"
                  aria-pressed={isSelected}
                  className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center space-x-1.5 whitespace-nowrap transition-all duration-200 border cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-xs ring-2 ring-[#E85D04]'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-[#5E1754]/40 hover:bg-purple-50/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-amber-300' : 'text-[#5E1754]'}`} />
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
