'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryChips } from '@/components/CategoryChips';
import { PropertyCard } from '@/components/PropertyCard';
import { CatalogMapWrapper } from '@/components/CatalogMapWrapper';
import { Property, PropertyCategory } from '@/types/property';
import { SharePropertyModal } from '@/components/SharePropertyModal';
import { Building2, SearchX, RotateCcw, LayoutGrid, MapPin, Compass } from 'lucide-react';

function CatalogUrlSyncHandler({
  onCategoryFound,
  onViewModeFound,
  onFocusFound,
}: {
  onCategoryFound: (cat: PropertyCategory) => void;
  onViewModeFound: (mode: 'grid' | 'map') => void;
  onFocusFound: (id: string) => void;
}) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as PropertyCategory | null;
  const viewParam = searchParams.get('view');
  const focusParam = searchParams.get('focus') || searchParams.get('propertyId');

  useEffect(() => {
    if (categoryParam) {
      onCategoryFound(categoryParam);
    }
    if (viewParam === 'map') {
      onViewModeFound('map');
    }
    if (focusParam) {
      onFocusFound(focusParam);
      onViewModeFound('map');
    }
    if (categoryParam || viewParam || focusParam) {
      setTimeout(() => {
        const el = document.getElementById('catalogo');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [categoryParam, viewParam, focusParam, onCategoryFound, onViewModeFound, onFocusFound]);

  return null;
}

interface CatalogSectionProps {
  initialProperties: Property[];
}

export function CatalogSection({ initialProperties }: CatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('todos');
  const [properties] = useState<Property[]>(initialProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  // Escuchar eventos globales de cambio de vista (Navbar y Hero)
  useEffect(() => {
    const handleCustomViewEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ view: 'grid' | 'map'; scroll?: boolean; propertyId?: string }>;
      if (customEvent.detail?.view) {
        setViewMode(customEvent.detail.view);
      }
      if (customEvent.detail?.propertyId) {
        setActivePropertyId(customEvent.detail.propertyId);
      }
      if (customEvent.detail?.scroll !== false) {
        setTimeout(() => {
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };

    window.addEventListener('set-catalog-view', handleCustomViewEvent);
    return () => window.removeEventListener('set-catalog-view', handleCustomViewEvent);
  }, []);

  // Scroll automático y centrado suave en el panel lateral al seleccionar pin en el mapa
  const handleSelectProperty = (id: string) => {
    setActivePropertyId(id);
    const cardEl = document.getElementById(`side-card-${id}`);
    if (cardEl) {
      const container = cardEl.parentElement;
      if (container) {
        const topOffset = cardEl.offsetTop - container.offsetTop - 16;
        container.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      } else {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Filtrar propiedades solo por categoría
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

  return (
    <div id="catalogo" className="scroll-mt-20 sm:scroll-mt-24 flex-grow">
      <Suspense fallback={null}>
        <CatalogUrlSyncHandler
          onCategoryFound={setSelectedCategory}
          onViewModeFound={setViewMode}
          onFocusFound={setActivePropertyId}
        />
      </Suspense>

      {/* Category Chips Bar */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Section Title Header */}
        <div className="mb-8 text-left">
          <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-[#E85D04] mb-2">
            <Building2 className="w-4 h-4 text-[#E85D04]" />
            <span>Catálogo Inmobiliario</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Encontrá tu Próximo Inmueble
          </h2>
        </div>

        {/* Property Catalog Content (Grid or Interactive Map Split View) */}
        {filteredProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </div>
          ) : (
            /* Split View: Mapa a la izquierda / Lista interactiva a la derecha */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Columna Izquierda: Mapa Interactivo */}
              <div className="md:col-span-7 lg:col-span-7 xl:col-span-7 relative">
                <CatalogMapWrapper
                  properties={filteredProperties}
                  activePropertyId={activePropertyId}
                  onSelectProperty={handleSelectProperty}
                />

                {/* Mobile Active Property Snap Card (solo visible en pantallas < md al seleccionar un pin) */}
                {activePropertyId && (() => {
                  const activeProp = filteredProperties.find((p) => p.id === activePropertyId);
                  if (!activeProp) return null;
                  const mainImg = activeProp.images.find((img) => img.isMain)?.webpUrl || activeProp.images[0]?.webpUrl || '/logo.png';
                  const priceMode = activeProp.price.priceMode || (activeProp.price.amount === 0 ? 'consultar' : 'visible');
                  const priceText =
                    priceMode === 'consultar' ? 'Consultar Precio' :
                    priceMode === 'reservado' ? '🔒 Reservado' :
                    `${priceMode === 'desde' ? 'Desde ' : ''}${activeProp.price.currency === 'USD' ? 'USD' : 'UYU $'} ${activeProp.price.amount.toLocaleString('es-UY')}`;

                  return (
                    <div className="md:hidden mt-3 p-3 rounded-2xl bg-white border border-[#E85D04] ring-2 ring-[#E85D04]/30 shadow-xl flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={mainImg}
                          alt={activeProp.title}
                          fill
                          unoptimized={true}
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute top-1 left-1 bg-[#5E1754] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md z-10">
                          {activeProp.category}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="text-xs font-black text-[#5E1754] block">
                            {priceText}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                            {activeProp.title}
                          </h4>
                          <p className="text-[10px] font-medium text-slate-500 truncate">
                            {activeProp.location.neighborhood}, San José
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-bold">
                          <span className="text-slate-500">
                            {activeProp.features.bedrooms ? `${activeProp.features.bedrooms} dorm` : ''} {activeProp.features.builtAreaM2 ? `• ${activeProp.features.builtAreaM2}m²` : ''}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <SharePropertyModal
                              property={activeProp}
                              variant="icon"
                              className="!p-1.5 !w-7 !h-7 bg-slate-100/90 hover:bg-[#5E1754] text-slate-600 hover:text-white border border-slate-200/60 shadow-2xs"
                            />
                            <Link
                              href={`/propiedad/${activeProp.slug}`}
                              className="bg-[#E85D04] text-white px-2.5 py-1 rounded-lg font-black text-[10px] flex items-center gap-1 shadow-xs hover:bg-[#5E1754] transition-colors"
                            >
                              <span>Ver Ficha</span>
                              <span>➔</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Mobile Helper Banner when no pin is selected */}
                {!activePropertyId && (
                  <div className="md:hidden mt-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2 text-xs font-bold text-slate-700 animate-in fade-in duration-200">
                    <MapPin className="w-4 h-4 text-[#E85D04] animate-pulse flex-shrink-0" />
                    <span>Tocá un pin en el mapa para ver los detalles</span>
                  </div>
                )}
              </div>

              {/* Columna Derecha: Panel Lateral Desplazable */}
              <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 hidden md:flex flex-col h-[520px] lg:h-[650px]">
                <div className="bg-slate-100/90 border border-slate-200 p-3 rounded-2xl mb-3 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {filteredProperties.length} Inmuebles Encontrados
                  </span>
                  <span className="text-[11px] font-bold text-[#E85D04]">
                    Tocá un pin para resaltar
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                  {filteredProperties.map((property, index) => {
                    const isActive = activePropertyId === property.id;
                    const mainImg = property.images.find((img) => img.isMain)?.webpUrl || property.images[0]?.webpUrl || '/logo.png';
                    const priceMode = property.price.priceMode || (property.price.amount === 0 ? 'consultar' : 'visible');
                    const priceText =
                      priceMode === 'consultar' ? 'Consultar Precio' :
                      priceMode === 'reservado' ? '🔒 Reservado' :
                      `${priceMode === 'desde' ? 'Desde ' : ''}${property.price.currency === 'USD' ? 'USD' : 'UYU $'} ${property.price.amount.toLocaleString('es-UY')}`;

                    return (
                      <div
                        key={property.id}
                        id={`side-card-${property.id}`}
                        onMouseEnter={() => setActivePropertyId(property.id)}
                        onClick={() => handleSelectProperty(property.id)}
                        className={`p-3 rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex gap-3.5 shadow-xs scroll-mt-4 ${
                          isActive
                            ? 'border-[#E85D04] ring-2 ring-[#E85D04]/30 shadow-md bg-amber-50/20 translate-x-1'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Mini Thumbnail optimizada con next/image unoptimized */}
                        <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={mainImg}
                            alt={property.title}
                            fill
                            unoptimized={true}
                            loading={index < 3 ? 'eager' : 'lazy'}
                            className="object-cover w-full h-full"
                          />
                          <span className="absolute top-1 left-1 bg-[#5E1754] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md z-10">
                            {property.category}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-black text-[#5E1754]">
                                {priceText}
                              </span>
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5">
                              {property.title}
                            </h4>
                            <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                              {property.location.neighborhood}, San José
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600">
                            <span>{property.features.bedrooms ? `${property.features.bedrooms} dorm` : ''} {property.features.builtAreaM2 ? `• ${property.features.builtAreaM2}m²` : ''}</span>
                            <div className="flex items-center gap-2">
                              <SharePropertyModal
                                property={property}
                                variant="icon"
                                className="!p-1.5 !w-6 !h-6 bg-slate-100/90 hover:bg-[#5E1754] text-slate-600 hover:text-white border border-slate-200/60 shadow-2xs"
                              />
                              <Link
                                href={`/propiedad/${property.slug}`}
                                className="text-[#E85D04] hover:text-[#5E1754] font-black text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <span>Ver</span>
                                <span>➔</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
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
              className="bg-[#5E1754] hover:bg-[#350A2F] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow flex items-center space-x-2 mx-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Ver Todas las Propiedades</span>
            </button>
          </div>
        )}

      </main>

      {/* Botón Flotante Omnipresente Estilo Airbnb / Idealista */}
      <aside aria-label="Cambiar vista de catálogo" className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none max-w-[92vw]">
        <button
          type="button"
          onClick={() => {
            const nextMode = viewMode === 'grid' ? 'map' : 'grid';
            setViewMode(nextMode);
            const el = document.getElementById('catalogo');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer bg-gradient-to-r from-[#5E1754] via-[#43123C] to-[#2D0B28] text-white border-2 border-white/50 hover:border-amber-300 hover:shadow-orange-500/40 hover:scale-105 whitespace-nowrap"
        >
          {viewMode === 'grid' ? (
            <>
              <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Ver en Mapa</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 text-amber-300" />
              <span>Ver Lista</span>
            </>
          )}
        </button>
      </aside>
    </div>
  );
}
