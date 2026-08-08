'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CategoryChips } from '@/components/CategoryChips';
import { PropertyCard } from '@/components/PropertyCard';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { Footer } from '@/components/Footer';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { PropertyCategory } from '@/types/property';
import { Building2, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('todos');

  // Filter properties based ONLY on the Category Chips below Hero
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((prop) => {
      if (selectedCategory !== 'todos') {
        if (selectedCategory === 'casa' && prop.category !== 'casa') return false;
        if (selectedCategory === 'apartamento' && prop.category !== 'apartamento' && prop.operation !== 'alquiler') return false;
        if (selectedCategory === 'chacra' && prop.category !== 'chacra') return false;
        if (selectedCategory === 'proyecto' && prop.category !== 'proyecto') return false;
        if (selectedCategory === 'deposito' && prop.category !== 'deposito') return false;
      }
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section (Limpio e Impactante) */}
      <HeroSearch />

      {/* 3. Primary Category Chips Bar (Único control de filtrado rápido) */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. Main Catalog Section */}
      <main id="catalogo" className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section Title & Active Filters Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-[#5E1754] font-bold text-xs uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-[#E85D04]" />
              <span>Catálogo Inmobiliario</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Propiedades en San José de Mayo
            </h2>
          </div>

          {/* Result counter badge */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-[#5E1754]" />
            <span>
              Mostrando {filteredProperties.length} de {MOCK_PROPERTIES.length} propiedades
            </span>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-purple-50 text-[#5E1754] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-900">No encontramos propiedades en esta categoría</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prueba cambiar la categoría para ver más oportunidades disponibles en San José.
            </p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="bg-[#5E1754] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#350A2F] transition-all shadow"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        )}

      </main>

      {/* 5. Owner Lead & Appraisals Section */}
      <OwnerLeadSection />

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}
