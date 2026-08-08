'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CategoryChips } from '@/components/CategoryChips';
import { PropertyCard } from '@/components/PropertyCard';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { PropertyCategory } from '@/types/property';
import { Building2, SearchX, RotateCcw } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('todos');

  // Filter properties based ONLY on Category Chips
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((prop) => {
      if (selectedCategory !== 'todos') {
        if (selectedCategory === 'apartamento' && (prop.category === 'apartamento' || prop.operation === 'alquiler')) {
          return true;
        }
        return prop.category === selectedCategory;
      }
      return true;
    });
  }, [selectedCategory]);

  const handleFooterFilterSelect = (category: PropertyCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 1. Sticky Header Navbar (Permanente z-50) */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSearch />

      {/* 3 & 4. Sección de Catálogo (Contenedor que incluye la Barra de Chips Fija SOLO en este sector) */}
      <div id="catalogo" className="scroll-mt-20 sm:scroll-mt-24 flex-grow">
        
        {/* Category Chips Bar: Fija de forma contextual únicamente dentro de la sección del Catálogo */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {/* Section Title */}
          <div className="mb-8 text-left">
            <div className="flex items-center space-x-2 text-[#5E1754] font-bold text-xs uppercase tracking-wider mb-1.5">
              <Building2 className="w-4 h-4 text-[#E85D04]" />
              <span>Catálogo Inmobiliario</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Propiedades en San José de Mayo
            </h2>
          </div>

          {/* Property Grid (Equilibrada en 3 Columnas) */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            /* Clean Vector Empty Search State */
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-8 space-y-4">
              <div className="w-16 h-16 bg-purple-50 text-[#5E1754] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                <SearchX className="w-8 h-8 text-[#5E1754]" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No encontramos propiedades en esta categoría</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Prueba cambiar la categoría para ver más oportunidades disponibles en San José.
              </p>
              <button
                onClick={() => setSelectedCategory('todos')}
                className="bg-[#5E1754] hover:bg-[#350A2F] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow flex items-center space-x-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Ver Todas las Propiedades</span>
              </button>
            </div>
          )}

        </main>
      </div>

      {/* 5. Owner Lead & Appraisals Section */}
      <OwnerLeadSection />

      {/* 6. Dedicated Clean Contact Section (id="contacto") */}
      <ContactSection />

      {/* 7. Footer */}
      <Footer onSelectCategoryFilter={handleFooterFilterSelect} />

      {/* 8. Floating WhatsApp CTA */}
      <FloatingWhatsApp />

    </div>
  );
}
