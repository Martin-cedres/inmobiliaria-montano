'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Property } from '@/types/property';
import { SharePropertyModal } from '@/components/SharePropertyModal';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera, Play } from 'lucide-react';

interface PropertyGalleryProps {
  property: Property;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ property }) => {
  const rawImages = property.images && property.images.length > 0 ? property.images : [];
  
  // Normalize images to array of objects
  const normalizedImages = rawImages.map((img, idx) => {
    if (typeof img === 'string') {
      return { id: `img-${idx}`, url: img, isMain: idx === 0 };
    }
    return {
      id: img.id || `img-${idx}`,
      url: img.webpUrl || img.blobUrl || img.thumbnailUrl,
      isMain: !!img.isMain,
    };
  });

  const mainIndex = normalizedImages.findIndex((img) => img.isMain);
  const initialIndex = mainIndex >= 0 ? mainIndex : 0;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);

  // Touch Swipe State
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Thumbnail Auto-Scroll Refs
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentImage = normalizedImages[activeIndex] || { url: '/logo.png' };

  // Auto-scroll active thumbnail into view
  const scrollToActiveThumbnail = useCallback((index: number) => {
    if (thumbnailRefs.current[index]) {
      thumbnailRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, []);

  const changeImage = useCallback((newIndex: number) => {
    if (newIndex === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setImageError(false);
      setIsFading(false);
      scrollToActiveThumbnail(newIndex);
    }, 80);
  }, [activeIndex, scrollToActiveThumbnail]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % normalizedImages.length;
    changeImage(nextIdx);
  }, [activeIndex, normalizedImages.length, changeImage]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + normalizedImages.length) % normalizedImages.length;
    changeImage(prevIdx);
  }, [activeIndex, normalizedImages.length, changeImage]);

  // Keyboard Navigation Support (← → Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isLightboxOpen]);

  // Image Preloading (Next & Previous)
  useEffect(() => {
    if (normalizedImages.length <= 1) return;
    const nextIdx = (activeIndex + 1) % normalizedImages.length;
    const prevIdx = (activeIndex - 1 + normalizedImages.length) % normalizedImages.length;

    const imgNext = new Image();
    imgNext.src = normalizedImages[nextIdx].url;

    const imgPrev = new Image();
    imgPrev.src = normalizedImages[prevIdx].url;
  }, [activeIndex, normalizedImages]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Viewport with Touch Swipe & Hover Arrows */}
      <div 
        className="relative h-80 sm:h-96 lg:h-[480px] bg-[#350A2F] rounded-3xl overflow-hidden shadow-xl border border-purple-100 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageError ? '/logo.png' : currentImage.url}
          alt={`${property.title} - Foto ${activeIndex + 1}`}
          onError={() => setImageError(true)}
          className={`w-full h-full ${imageError ? 'object-contain p-12 bg-[#350A2F]' : 'object-cover'} transition-opacity duration-150 ease-in-out ${isFading ? 'opacity-30' : 'opacity-100'} cursor-pointer`}
          onClick={() => !imageError && setIsLightboxOpen(true)}
        />

        {/* Top Left: Operation & Ref Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none">
          <span className="bg-[#E85D04] text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow">
            {property.operation === 'alquiler' ? 'Alquiler' : property.operation === 'proyecto' ? 'Proyecto' : 'En Venta'}
          </span>
          <span className="bg-[#350A2F]/90 text-amber-300 text-xs font-bold uppercase px-3 py-1.5 rounded-full border border-amber-400/30">
            Ref. #{property.codeRef}
          </span>
        </div>

        {/* Top Right: Camera Counter Badge & Share Button */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          <span className="bg-black/60 text-white text-xs font-extrabold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center space-x-1.5 shadow">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeIndex + 1} / {normalizedImages.length || 1}</span>
          </span>
          <SharePropertyModal property={property} variant="icon" />
        </div>

        {/* Hover Navigation Arrows (⟨ ⟩) */}
        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#E85D04] text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl z-10 hover:scale-110 active:scale-95"
              title="Foto Anterior (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#E85D04] text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl z-10 hover:scale-110 active:scale-95"
              title="Siguiente Foto (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Zoom CTA Button */}
        {!imageError && (
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center space-x-1.5 opacity-90 hover:opacity-100 transition-all z-10 shadow border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Ver Pantalla Completa</span>
          </button>
        )}
      </div>

      {/* Overflow Scrollable Thumbnail Strip with Auto-Scroll */}
      {normalizedImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scroll-smooth px-1">
          {normalizedImages.map((img, idx) => (
            <button
              key={img.id || idx}
              ref={(el) => { thumbnailRefs.current[idx] = el; }}
              onClick={() => changeImage(idx)}
              className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === idx
                  ? 'border-[#E85D04] ring-2 ring-[#E85D04]/40 scale-105 shadow-md z-10'
                  : 'border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <img
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {img.isMain && (
                <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                  ★ Portada
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none">
          {/* Lightbox Top Bar */}
          <div className="flex justify-between items-center text-white z-10 max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold">
              <span className="bg-[#E85D04] text-white px-2.5 py-1 rounded-md font-mono text-xs">
                Ref. #{property.codeRef}
              </span>
              <span className="truncate max-w-xs sm:max-w-md">{property.title}</span>
              <span className="text-amber-400 font-extrabold ml-2">
                ({activeIndex + 1} / {normalizedImages.length})
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 text-slate-400 hover:text-white bg-white/10 hover:bg-rose-600 rounded-full transition-colors"
              title="Cerrar (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div 
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentImage.url}
              alt={property.title}
              className={`max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-opacity duration-150 ${isFading ? 'opacity-30' : 'opacity-100'}`}
            />

            {normalizedImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 bg-black/60 hover:bg-[#E85D04] text-white p-3.5 rounded-full backdrop-blur-md transition-all shadow-2xl active:scale-95"
                  title="Anterior (←)"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 bg-black/60 hover:bg-[#E85D04] text-white p-3.5 rounded-full backdrop-blur-md transition-all shadow-2xl active:scale-95"
                  title="Siguiente (→)"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Strip */}
          <div className="flex justify-center items-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto w-full">
            {normalizedImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => changeImage(idx)}
                className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeIndex === idx ? 'border-[#E85D04] scale-110 ring-2 ring-[#E85D04]' : 'border-transparent opacity-40 hover:opacity-80'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
