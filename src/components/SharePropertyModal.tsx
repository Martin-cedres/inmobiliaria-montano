'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Property } from '@/types/property';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Share2, Copy, Check, Mail, Printer, X, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface SharePropertyModalProps {
  property: Property;
  className?: string;
  variant?: 'button' | 'icon' | 'sticky-bar';
}

const PRODUCTION_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export const SharePropertyModal: React.FC<SharePropertyModalProps> = ({
  property,
  className = '',
  variant = 'button',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instagramToast, setInstagramToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Production absolute URL (Essential for WhatsApp / Facebook OpenGraph crawlers to fetch photos)
  const prodShareUrl = `${PRODUCTION_BASE_URL}/propiedad/${property.slug}`;
  const localShareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/propiedad/${property.slug}`
    : prodShareUrl;

  const mainImage = property.images.find((img) => img.isMain) || property.images[0];
  const photoUrl = mainImage?.webpUrl || mainImage?.blobUrl || '/images/sample-house-1.jpg';

  const priceMode = property.price.priceMode || (property.price.amount === 0 ? 'consultar' : 'visible');
  const hasValidPrice = Boolean(property.price.amount && property.price.amount > 0 && priceMode !== 'consultar' && priceMode !== 'reservado');
  const formattedPrice =
    priceMode === 'consultar' || !property.price.amount || property.price.amount === 0 ? 'Consultar Precio' :
    priceMode === 'reservado' ? 'Precio Reservado' :
    `${priceMode === 'desde' ? 'Desde ' : ''}${property.price.currency === 'USD' ? 'USD' : 'UYU $'}` +
    ` ${property.price.amount.toLocaleString('es-UY')}` +
    `${property.operation === 'alquiler' && property.price.period && property.price.period !== 'total' ? ` / ${property.price.period}` : ''}`;

  const operationText = property.operation === 'alquiler' 
    ? 'en Alquiler' 
    : property.operation === 'proyecto' 
    ? 'en Pozo' 
    : 'en Venta';

  const priceLine = hasValidPrice ? `💰 *Precio:* ${formattedPrice}\n` : '';

  // Redacción comercial optimizada con foto y tarjeta rica en WhatsApp
  const shareText = `🏡 Mirá esta propiedad ${operationText} en Inmobiliaria Montaño:\n\n*${property.title}*\n${priceLine}📍 *Ubicación:* ${property.location.neighborhood}, ${property.location.city}\n🔖 *Ref:* #${property.codeRef}\n\n🔗 *Ver fotos y detalles:* ${prodShareUrl}`;

  const handleShareClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(prodShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = prodShareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Ignore copy error
    }
    setInstagramToast(true);
    setTimeout(() => {
      setInstagramToast(false);
      window.open('https://www.instagram.com/', '_blank');
    }, 1800);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(prodShareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Inmobiliaria Montaño Ref #${property.codeRef}: ${property.title}`)}&body=${encodeURIComponent(shareText)}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Botones de Activación */}
      {variant === 'button' && (
        <button
          type="button"
          onClick={handleShareClick}
          className={`inline-flex items-center space-x-2 bg-purple-50 hover:bg-[#5E1754] text-[#5E1754] hover:text-white font-bold text-xs px-4 py-2.5 rounded-full border border-purple-200 shadow-sm transition-all active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4 text-[#E85D04]" />
          <span>Compartir Propiedad</span>
        </button>
      )}

      {variant === 'icon' && (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label={`Compartir ${property.title}`}
          className={`p-1.5 sm:p-2 bg-black/40 hover:bg-[#5E1754] text-white/90 hover:text-white backdrop-blur-md border border-white/20 hover:border-amber-400/50 rounded-full shadow-xs transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
        </button>
      )}

      {variant === 'sticky-bar' && (
        <button
          type="button"
          onClick={handleShareClick}
          className={`w-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#5E1754] font-extrabold text-xs py-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center space-x-2 transition-all active:scale-98 ${className}`}
        >
          <Share2 className="w-4 h-4 text-[#E85D04]" />
          <span>Compartir esta propiedad</span>
        </button>
      )}

      {/* Modal / Bottom Sheet de Compartir en Redes (Montado en el Root de document.body) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
          
          {/* Fondo para cerrar al hacer clic afuera */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

          {/* Panel Flotante / Bottom Sheet */}
          <div
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 overflow-hidden text-left z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Indicador de arrastre táctil para celulares */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden flex-shrink-0" />

            {/* Cabecera Compacta */}
            <div className="px-5 pt-3 pb-3 sm:py-3.5 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight truncate">Compartir Inmueble</h3>
                  <p className="text-[10px] text-slate-400 font-bold truncate">Ref. #{property.codeRef} • {property.location.neighborhood || 'San José'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fila Informativa Breve (Sin tapar la pantalla) */}
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 text-xs flex-shrink-0">
              <span className="font-bold text-slate-700 truncate">{property.title}</span>
              <span className="font-black text-[#5E1754] flex-shrink-0">{formattedPrice}</span>
            </div>

            {/* Notificaciones Breves de Confirmación */}
            {copied && (
              <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-2 text-[11px] font-bold flex items-center justify-center space-x-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">¡Enlace copiado! Pegalo en WhatsApp o redes.</span>
              </div>
            )}

            {instagramToast && (
              <div className="bg-purple-50 border-b border-purple-200 text-purple-900 px-4 py-2 text-[11px] font-bold flex items-center justify-center space-x-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 text-pink-600 flex-shrink-0" />
                <span>¡Texto copiado! Abriendo Instagram...</span>
              </div>
            )}

            {/* Redes Sociales en Fila Compacta */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                
                {/* 1. WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white p-2.5 rounded-2xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group border border-[#25D366]/20 hover:border-transparent"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors" />
                  <span>WhatsApp</span>
                </a>

                {/* 2. Instagram */}
                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="bg-pink-50 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-[#dc2743] hover:text-white p-2.5 rounded-2xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group border border-pink-200/50 hover:border-transparent cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </button>

                {/* 3. Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white p-2.5 rounded-2xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group border border-blue-200/50 hover:border-transparent"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* 4. Correo */}
                <a
                  href={emailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white p-2.5 rounded-2xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group border border-slate-200/60 hover:border-transparent"
                >
                  <Mail className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  <span>Correo</span>
                </a>

              </div>

              {/* Botón de 1-Clic para Copiar Enlace */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-slate-100 hover:bg-purple-50/80 text-slate-800 hover:text-[#5E1754] p-3 rounded-2xl font-bold text-xs flex items-center justify-between border border-slate-200/80 transition-all active:scale-98 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-xl bg-white text-[#5E1754] flex items-center justify-center shadow-2xs flex-shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <div className="text-left truncate">
                    <span className="block text-xs font-extrabold text-slate-800 truncate">
                      {copied ? '¡Enlace copiado al portapapeles!' : 'Copiar enlace directo'}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-normal truncate">
                      {prodShareUrl}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-colors flex-shrink-0 ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-[#5E1754] text-white'
                }`}>
                  {copied ? 'Copiado' : 'Copiar'}
                </span>
              </button>

            </div>

          </div>

        </div>,
        document.body
      )}
    </>
  );
};

export default SharePropertyModal;
