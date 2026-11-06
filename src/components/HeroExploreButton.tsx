'use client';

import React from 'react';
import { Building2, ArrowDown } from 'lucide-react';

export const HeroExploreButton: React.FC = () => {
  const handleExploreClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('set-catalog-view', {
          detail: { view: 'grid', scroll: true },
        })
      );
    }
  };

  return (
    <a
      href="#catalogo"
      onClick={handleExploreClick}
      className="inline-flex items-center justify-center space-x-2.5 bg-[#C2410C] hover:bg-[#9A3412] active:scale-95 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base flex-shrink-0"
    >
      <Building2 className="w-4 h-4 text-amber-200" />
      <span>Explorar Propiedades</span>
      <ArrowDown className="w-3.5 h-3.5 hidden sm:inline-block animate-bounce" />
    </a>
  );
};
