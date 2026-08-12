'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CategoryChips } from '@/components/CategoryChips';
import { PropertyCard } from '@/components/PropertyCard';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CatalogMapWrapper } from '@/components/CatalogMapWrapper';
import { Property, PropertyCategory } from '@/types/property';
import { Building2, SearchX, RotateCcw, Loader2, LayoutGrid, MapPin, Map as MapIcon, List } from 'lucide-react';

function SearchCategoryHandler({ onCategoryFound }: { onCategoryFound: (cat: PropertyCategory) => void }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as PropertyCategory | null;

  useEffect(() => {
    if (categoryParam) {
      onCategoryFound(categoryParam);
      setTimeout(() => {
        const el = document.getElementById('catalogo');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [categoryParam, onCategoryFound]);

  return null;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('todos');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    async function loadLiveProperties() {
      try {
        const response = await fetch('/api/properties');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setProperties(result.data);
        }
      } catch (error) {
        console.warn('Error al cargar propiedades:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveProperties();
  }, []);

  // Filter properties based ONLY on Category Chips
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (selectedCategory !== 'todos') {
        if (selectedCategory === 'apartamento' && (prop.category === 'apartamento' || prop.operation === 'alquiler')) {
          return true;
        }
        return prop.category === selectedCategory;
      }
      return true;
    });
  }, [properties, selectedCategory]);

  const handleFooterFilterSelect = (category: PropertyCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Suspense fallback={null}>
        <SearchCategoryHandler onCategoryFound={setSelectedCategory} />
      </Suspense>
      
      {/* 1. Sticky Header Navbar */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSearch />

      {/* 3 & 4. Sección de Catálogo */}
      <div id="catalogo" className="scroll-mt-20 sm:scroll-mt-24 flex-grow">
        
        {/* Category Chips Bar: Fija de forma contextual únicamente dentro de la sección del Catálogo */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {/* Section Title & View Switcher Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div>
              <div className="flex items-center space-x-2 text-[#5E1754] font-bold text-xs uppercase tracking-wider mb-1.5">
                <Building2 className="w-4 h-4 text-[#E85D04]" />
                <span>Catálogo Inmobiliario</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Propiedades en San José de Mayo
              </h2>
            </div>

            {/* View Mode Toggle Button Pill (Desktop & Tablet) */}
            <div className="inline-flex items-center space-x-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300 shadow-inner self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-[#5E1754] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tarjetas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 ${
                  viewMode === 'map'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Mapa Interactivo</span>
              </button>
            </div>
          </div>

          {/* Property Catalog Content (Grid or Interactive Map) */}
          {isLoading ? (
            <div className="py-20 text-center text-slate-500 font-bold text-sm flex items-center justify-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#5E1754]" />
              <span>Cargando catálogo de propiedades...</span>
            </div>
          ) : filteredProperties.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <CatalogMapWrapper properties={filteredProperties} />
            )
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

      {/* Floating Action Button for Mobile View Switcher (Estilo Airbnb < sm) */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={() => setViewMode((prev) => (prev === 'grid' ? 'map' : 'grid'))}
          className="bg-[#191024]/95 text-white backdrop-blur-md px-5 py-3 rounded-full font-black text-xs shadow-2xl border border-amber-400/30 flex items-center space-x-2 transition-all active:scale-95 text-amber-300"
        >
          {viewMode === 'grid' ? (
            <>
              <MapIcon className="w-4 h-4 text-[#E85D04]" />
              <span>Ver Mapa Interactivo</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4 text-amber-400" />
              <span>Ver Lista de Tarjetas</span>
            </>
          )}
        </button>
      </div>

      {/* 5. Owner Lead & Appraisals Section */}
      <OwnerLeadSection />

      {/* 6. Footer */}
      <Footer onSelectCategoryFilter={handleFooterFilterSelect} />

      {/* 7. Floating WhatsApp CTA */}
      <FloatingWhatsApp />

    </div>
  );
}
