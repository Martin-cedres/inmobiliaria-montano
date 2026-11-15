'use client';

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Property } from '@/types/property';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera, ZoomIn, ZoomOut } from 'lucide-react';

interface PropertyGalleryProps {
  property: Property;
}

const emptySubscribe = () => () => {};

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

  // Lightbox Zoom, Pan & Vertical Swipe-to-Dismiss State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // History & Focus Refs
  const pushedHistoryRef = useRef<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Inline Carousel Touch Swipe Refs
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Lightbox Touch Gesture Refs
  const lbTouchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lbGestureAxisRef = useRef<'none' | 'x' | 'y' | 'pinch'>('none');
  const lbLastDeltaXRef = useRef<number>(0);
  const lbLastDeltaYRef = useRef<number>(0);
  const lbJustSwipedRef = useRef<boolean>(false);
  const lbPinchStartDistRef = useRef<number>(0);
  const lbPinchStartScaleRef = useRef<number>(1);
  const lbPanStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lbLastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });
  const activeIndexRef = useRef<number>(initialIndex);

  // Thumbnail Auto-Scroll Refs (Inline & Lightbox)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lightboxThumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentImage = normalizedImages[activeIndex] || { url: '/logo.png' };

  // Auto-scroll active thumbnail into view
  const scrollToActiveThumbnail = useCallback((index: number) => {
    thumbnailRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
    lightboxThumbnailRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, []);

  const resetLightboxTransforms = useCallback(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setDragOffsetY(0);
    setIsDragging(false);
    lbGestureAxisRef.current = 'none';
  }, []);

  const openLightbox = useCallback(() => {
    if (imageError || isLightboxOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    resetLightboxTransforms();
    setIsLightboxOpen(true);

    if (typeof window !== 'undefined' && !pushedHistoryRef.current) {
      window.history.pushState(
        { ...(window.history.state || {}), __montanoLightbox: true },
        ''
      );
      pushedHistoryRef.current = true;
    }
  }, [imageError, isLightboxOpen, resetLightboxTransforms]);

  const closeLightbox = useCallback(() => {
    if (!isLightboxOpen) return;
    setIsLightboxOpen(false);
    resetLightboxTransforms();

    if (typeof window !== 'undefined' && pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    }

    requestAnimationFrame(() => {
      previousFocusRef.current?.focus();
    });
  }, [isLightboxOpen, resetLightboxTransforms]);

  const toggleZoom = useCallback(() => {
    setZoomScale((prev) => {
      if (prev > 1) {
        setPanOffset({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  }, []);

  const changeImage = useCallback((newIndex: number) => {
    if (newIndex === activeIndex) return;
    activeIndexRef.current = newIndex;
    setIsFading(true);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setTimeout(() => {
      setActiveIndex(newIndex);
      setImageError(false);
      setIsFading(false);
      scrollToActiveThumbnail(newIndex);
    }, 80);
  }, [activeIndex, scrollToActiveThumbnail]);

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    const nextIdx = (activeIndex + 1) % normalizedImages.length;
    changeImage(nextIdx);
  }, [activeIndex, normalizedImages.length, changeImage]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    const prevIdx = (activeIndex - 1 + normalizedImages.length) % normalizedImages.length;
    changeImage(prevIdx);
  }, [activeIndex, normalizedImages.length, changeImage]);

  // Keyboard Navigation Support (← → Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (isInputFocused && !isLightboxOpen) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        e.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isLightboxOpen, closeLightbox]);

  // History Back Intercept (popstate), Body Scroll Lock & Initial Focus for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
      lightboxThumbnailRefs.current[activeIndexRef.current]?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }, 20);

    const handlePopState = () => {
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        setIsLightboxOpen(false);
        resetLightboxTransforms();
        requestAnimationFrame(() => {
          previousFocusRef.current?.focus();
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLightboxOpen, resetLightboxTransforms]);

  // Image Preloading (Next & Previous)
  useEffect(() => {
    if (normalizedImages.length <= 1) return;
    const nextIdx = (activeIndex + 1) % normalizedImages.length;
    const prevIdx = (activeIndex - 1 + normalizedImages.length) % normalizedImages.length;

    if (typeof window !== 'undefined') {
      const imgNext = new window.Image();
      imgNext.src = normalizedImages[nextIdx].url;

      const imgPrev = new window.Image();
      imgPrev.src = normalizedImages[prevIdx].url;
    }
  }, [activeIndex, normalizedImages]);

  // Touch Swipe Handlers for Inline Mobile Carousel
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

  // Touch Gesture Handlers for Lightbox (Swipe X = Nav, Swipe Y = Close, Pinch/Double-Tap = Zoom)
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lbGestureAxisRef.current = 'pinch';
      lbPinchStartDistRef.current = getTouchDistance(e.touches);
      lbPinchStartScaleRef.current = zoomScale;
      setIsDragging(true);
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lbTouchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      lbLastDeltaXRef.current = 0;
      lbLastDeltaYRef.current = 0;
      lbJustSwipedRef.current = false;
      lbGestureAxisRef.current = 'none';
      lbPanStartRef.current = { ...panOffset };
      setIsDragging(true);
    }
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lbGestureAxisRef.current === 'pinch') {
      const dist = getTouchDistance(e.touches);
      if (lbPinchStartDistRef.current > 0) {
        const nextScale = Math.min(
          3,
          Math.max(1, lbPinchStartScaleRef.current * (dist / lbPinchStartDistRef.current))
        );
        setZoomScale(nextScale);
        if (nextScale <= 1.02) {
          setPanOffset({ x: 0, y: 0 });
        }
      }
      return;
    }

    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lbTouchStartRef.current.x;
    const dy = touch.clientY - lbTouchStartRef.current.y;

    if (zoomScale > 1.05) {
      lbJustSwipedRef.current = true;
      const maxPan = 180 * (zoomScale - 1);
      setPanOffset({
        x: Math.max(-maxPan, Math.min(maxPan, lbPanStartRef.current.x + dx)),
        y: Math.max(-maxPan, Math.min(maxPan, lbPanStartRef.current.y + dy)),
      });
      return;
    }

    if (lbGestureAxisRef.current === 'none') {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        lbGestureAxisRef.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        lbJustSwipedRef.current = true;
      }
    }

    if (lbGestureAxisRef.current === 'x') {
      lbLastDeltaXRef.current = dx;
    } else if (lbGestureAxisRef.current === 'y') {
      lbLastDeltaYRef.current = dy;
      setDragOffsetY(dy);
    }
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);

    if (lbGestureAxisRef.current === 'pinch') {
      lbJustSwipedRef.current = true;
      if (zoomScale <= 1.08) {
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
      }
      lbGestureAxisRef.current = 'none';
      return;
    }

    if (zoomScale > 1.05) {
      // Check double tap while zoomed to reset zoom
      const changed = e.changedTouches[0];
      if (changed) {
        const moveDist = Math.hypot(
          changed.clientX - lbTouchStartRef.current.x,
          changed.clientY - lbTouchStartRef.current.y
        );
        const now = Date.now();
        if (
          moveDist < 12 &&
          now - lbLastTapRef.current.time < 280 &&
          Math.hypot(changed.clientX - lbLastTapRef.current.x, changed.clientY - lbLastTapRef.current.y) < 35
        ) {
          setZoomScale(1);
          setPanOffset({ x: 0, y: 0 });
          lbLastTapRef.current = { time: 0, x: 0, y: 0 };
          return;
        }
        if (moveDist < 12) {
          lbLastTapRef.current = { time: now, x: changed.clientX, y: changed.clientY };
        }
      }
      lbGestureAxisRef.current = 'none';
      return;
    }

    if (lbGestureAxisRef.current === 'x') {
      if (lbLastDeltaXRef.current < -50) {
        handleNext();
      } else if (lbLastDeltaXRef.current > 50) {
        handlePrev();
      }
    } else if (lbGestureAxisRef.current === 'y') {
      if (Math.abs(lbLastDeltaYRef.current) > 90) {
        closeLightbox();
        return;
      }
      setDragOffsetY(0);
    } else {
      // Tap without significant drag -> check double tap on image to zoom
      const changed = e.changedTouches[0];
      const target = e.target as HTMLElement | null;
      if (changed && target?.tagName === 'IMG') {
        const now = Date.now();
        if (
          now - lbLastTapRef.current.time < 280 &&
          Math.hypot(changed.clientX - lbLastTapRef.current.x, changed.clientY - lbLastTapRef.current.y) < 35
        ) {
          setZoomScale(2);
          lbLastTapRef.current = { time: 0, x: 0, y: 0 };
        } else {
          lbLastTapRef.current = { time: now, x: changed.clientX, y: changed.clientY };
        }
      }
    }

    lbGestureAxisRef.current = 'none';
    lbLastDeltaXRef.current = 0;
    lbLastDeltaYRef.current = 0;
  };

  return (
    <div className="space-y-3 sm:space-y-4 select-none">
      {/* Main Image Viewport with Touch Swipe & Hover Arrows */}
      <div 
        className="relative aspect-[4/3] sm:aspect-auto sm:h-96 lg:h-[480px] bg-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-purple-100 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={imageError ? '/logo.png' : currentImage.url}
          alt={`${property.title} - Foto ${activeIndex + 1}`}
          fill
          unoptimized={true}
          priority={true}
          sizes="(max-width: 1024px) 100vw, 800px"
          onError={() => setImageError(true)}
          className={`w-full h-full ${imageError ? 'object-contain p-12 bg-[#350A2F]' : 'object-cover'} transition-opacity duration-150 ease-in-out ${isFading ? 'opacity-30' : 'opacity-100'} cursor-pointer`}
          onClick={openLightbox}
        />

        {/* Faja institucional diagonal de alto impacto (RESERVÓ, ALQUILÓ, VENDIÓ) */}
        {(property.status === 'reservado' || property.status === 'vendido' || property.status === 'alquilado') && (
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-[15] flex items-center justify-center pt-3.5 pb-4 sm:pt-4 sm:pb-4.5 rotate-[-12deg] scale-x-125 pointer-events-none border-y-[3px] shadow-[0_12px_32px_rgba(0,0,0,0.65)] ${
              property.status === 'reservado'
                ? 'bg-[#E85D04] border-white text-white'
                : property.status === 'vendido'
                ? 'bg-[#4A1242] border-white text-white'
                : 'bg-[#5E1754] border-white text-white'
            }`}
          >
            <span className="font-black text-3xl sm:text-4xl lg:text-[42px] leading-none -translate-y-[1.5px] uppercase tracking-wider antialiased [text-shadow:0_2px_6px_rgba(0,0,0,0.5)] select-none">
              {property.status === 'reservado'
                ? 'RESERVÓ'
                : property.status === 'vendido'
                ? 'VENDIÓ'
                : 'ALQUILÓ'}
            </span>
          </div>
        )}

        {/* Top Left: Operation Badge (oculto si ya está reservado, vendido o alquilado para evitar contradicción) */}
        {property.operation !== 'ninguna' &&
          property.status !== 'reservado' &&
          property.status !== 'vendido' &&
          property.status !== 'alquilado' &&
          !(property.operation !== 'busqueda' && property.price?.priceMode === 'oculto') && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
            <span
              className={`text-white text-[11px] sm:text-xs font-black uppercase px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow ${
                property.operation === 'busqueda'
                  ? 'bg-[#5e1754]'
                  : property.operation === 'alquiler'
                  ? 'bg-[#5e1754]'
                  : property.operation === 'proyecto'
                  ? 'bg-emerald-600'
                  : 'bg-[#E85D04]'
              }`}
            >
              {property.operation === 'busqueda'
                ? 'Buscamos'
                : property.operation === 'alquiler'
                ? 'Alquiler'
                : property.operation === 'proyecto'
                ? 'Proyecto'
                : 'En Venta'}
            </span>
          </div>
        )}

        {/* Top Right: Camera Counter Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center space-x-2 z-10">
          <span className="bg-black/60 text-white text-[11px] sm:text-xs font-extrabold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center space-x-1.5 shadow">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeIndex + 1} / {normalizedImages.length || 1}</span>
          </span>
        </div>

        {/* Hover Navigation Arrows (⟨ ⟩) */}
        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#E85D04] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl z-10 hover:scale-110 active:scale-95 hidden sm:block"
              title="Foto Anterior (←)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#E85D04] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl z-10 hover:scale-110 active:scale-95 hidden sm:block"
              title="Siguiente Foto (→)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Zoom CTA Button */}
        {!imageError && (
          <button
            type="button"
            onClick={openLightbox}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md flex items-center space-x-1.5 opacity-90 hover:opacity-100 transition-all z-10 shadow border border-white/10 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Pantalla Completa</span>
          </button>
        )}
      </div>

      {/* Overflow Scrollable Thumbnail Strip with Auto-Scroll */}
      {normalizedImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1.5 no-scrollbar scroll-smooth px-1">
          {normalizedImages.map((img, idx) => (
            <button
              key={img.id || idx}
              ref={(el) => { thumbnailRefs.current[idx] = el; }}
              onClick={() => changeImage(idx)}
              className={`relative flex-shrink-0 w-16 h-14 sm:w-24 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === idx
                  ? 'border-[#E85D04] ring-2 ring-[#E85D04]/40 scale-105 shadow-md z-10'
                  : 'border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <Image
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                fill
                unoptimized={true}
                loading="lazy"
                sizes="96px"
                className="w-full h-full object-cover"
              />
              {img.isMain && (
                <span className="absolute top-0.5 left-0.5 bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black px-1 py-0.5 rounded shadow-xs">
                  ★
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Zoom Modal (Montado en document.body vía Portal para evitar colisiones de z-index) */}
      {isLightboxOpen && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de fotos de ${property.title}`}
          onClick={() => {
            if (lbJustSwipedRef.current) {
              lbJustSwipedRef.current = false;
              return;
            }
            closeLightbox();
          }}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${Math.max(0.25, 0.95 - Math.abs(dragOffsetY) / 380)})`,
          }}
          className="fixed inset-0 h-dvh w-screen z-[99999] backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-hidden select-none transition-colors duration-150"
        >
          {/* Lightbox Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between gap-2.5 sm:gap-4 text-white z-20 max-w-7xl mx-auto w-full flex-shrink-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
              <span className="flex-shrink-0 bg-[#E85D04] text-white px-2.5 py-1 rounded-md font-mono text-[11px] sm:text-xs font-extrabold shadow-sm">
                Ref. #{property.codeRef}
              </span>
              <span className="truncate text-xs sm:text-sm font-bold text-white/95">
                {property.title}
              </span>
              <span className="flex-shrink-0 text-amber-400 font-extrabold text-xs sm:text-sm whitespace-nowrap">
                {activeIndex + 1} / {normalizedImages.length || 1}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={toggleZoom}
                aria-label={zoomScale > 1 ? 'Alejar foto' : 'Acercar foto'}
                title={zoomScale > 1 ? 'Alejar (1x)' : 'Acercar (2x)'}
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-white bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 rounded-full transition-all cursor-pointer"
              >
                {zoomScale > 1 ? (
                  <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Cerrar galería"
                title="Cerrar (Esc)"
                className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3.5 sm:px-4 py-2 bg-white text-slate-950 hover:bg-[#E85D04] hover:text-white active:scale-95 rounded-full font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.75]" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden touch-none"
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.url}
              alt={`${property.title} - Foto ${activeIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              draggable={false}
              style={{
                transform: `translate3d(${panOffset.x}px, ${panOffset.y + dragOffsetY}px, 0) scale(${zoomScale})`,
                transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms ease',
              }}
              className={`max-h-full max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl ${
                zoomScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
              } ${isFading ? 'opacity-30' : 'opacity-100'}`}
            />

            {normalizedImages.length > 1 && zoomScale <= 1.05 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Foto anterior"
                  title="Anterior (←)"
                  className="hidden sm:flex items-center justify-center absolute left-4 lg:left-6 bg-black/70 hover:bg-[#E85D04] text-white p-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-2xl active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Siguiente foto"
                  title="Siguiente (→)"
                  className="hidden sm:flex items-center justify-center absolute right-4 lg:right-6 bg-black/70 hover:bg-[#E85D04] text-white p-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-2xl active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Strip */}
          {normalizedImages.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-1 max-w-4xl mx-auto w-full flex-shrink-0 z-20"
            >
              {normalizedImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  ref={(el) => {
                    lightboxThumbnailRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => changeImage(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                  className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#E85D04] scale-105 ring-2 ring-[#E85D04]/70 opacity-100'
                      : 'border-white/15 opacity-50 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Miniatura ${idx + 1} de ${property.title}`}
                    width={56}
                    height={44}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
