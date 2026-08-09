'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Share2, Copy, Check, MessageCircle, Facebook, Mail, Printer, X, Sparkles } from 'lucide-react';

interface SharePropertyModalProps {
  property: Property;
  className?: string;
  variant?: 'button' | 'icon' | 'sticky-bar';
}

export const SharePropertyModal: React.FC<SharePropertyModalProps> = ({
  property,
  className = '',
  variant = 'button',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic share URL & formatted commercial text
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/propiedad/${property.slug}`
    : `https://inmobiliaria-montano.vercel.app/propiedad/${property.slug}`;

  const formattedPrice = `${property.price.currency} $${property.price.amount.toLocaleString()}${
    property.price.period ? `/${property.price.period}` : ''
  }`;

  const operationText = property.operation === 'alquiler' 
    ? 'en Alquiler' 
    : property.operation === 'proyecto' 
    ? 'en Pozo' 
    : 'en Venta';

  const shareText = `🏡 Mirá esta propiedad ${operationText} en Inmobiliaria Montaño:\n\n${property.title}\n💰 Precio: ${formattedPrice}\n📍 ${property.location.neighborhood}, ${property.location.city}\n\n🔗 ${shareUrl}`;

  const handleShareClick = async () => {
    // Web Share API for Mobile Devices (iOS/Android native sheet)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Inmobiliaria Montaño: ${property.title} - ${formattedPrice}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to desktop modal if user cancels or browser rejects share
        if ((err as Error).name !== 'AbortError') {
          setIsOpen(true);
        }
        return;
      }
    }

    // Fallback on Desktop -> Open Branded Modal
    setIsOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy logic
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Propiedad ${property.codeRef}: ${property.title}`)}&body=${encodeURIComponent(shareText)}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Trigger Button Variants */}
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
          title="Compartir esta propiedad"
          className={`p-2.5 bg-white/90 hover:bg-[#5E1754] text-[#5E1754] hover:text-white rounded-full border border-slate-200 shadow-md transition-all active:scale-95 ${className}`}
        >
          <Share2 className="w-4.5 h-4.5 text-[#E85D04]" />
        </button>
      )}

      {variant === 'sticky-bar' && (
        <button
          type="button"
          onClick={handleShareClick}
          className={`w-full bg-[#191024] hover:bg-[#350A2F] text-amber-300 font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg border border-purple-500/30 flex items-center justify-center space-x-2 transition-all active:scale-98 ${className}`}
        >
          <Share2 className="w-4 h-4 text-[#E85D04]" />
          <span>Compartir con Pareja / Familiar</span>
        </button>
      )}

      {/* Desktop Modal / Popover Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          
          {/* Main Modal Box */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden text-left animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#191024] text-white p-5 border-b border-[#2D1D42] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#5E1754] flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Compartir Propiedad</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Ref. #{property.codeRef} • San José de Mayo</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Property Summary Preview */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-3">
              <img
                src={property.images[0]?.thumbnailUrl || property.images[0]?.blobUrl || '/logo.png'}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
                <p className="text-xs font-extrabold text-[#5E1754]">{formattedPrice}</p>
                <p className="text-[10px] text-slate-500">{property.location.neighborhood}, {property.location.city}</p>
              </div>
            </div>

            {/* Toast Copy Confirmation Notification */}
            {copied && (
              <div className="bg-emerald-50 border-y border-emerald-200 text-emerald-900 px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Enlace copiado al portapapeles! Listo para pegar.</span>
              </div>
            )}

            {/* Channels List */}
            <div className="p-5 space-y-3">
              
              {/* 1. WhatsApp Direct Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white p-3.5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold">Enviar por WhatsApp</span>
                    <span className="block text-[10px] font-normal text-emerald-100">Directo a un contacto o grupo</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-lg">Abrir</span>
              </a>

              {/* 2. Copy Direct Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-[#5E1754] p-3.5 rounded-2xl font-bold text-xs flex items-center justify-between border border-slate-200 transition-all active:scale-98"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5E1754] flex items-center justify-center">
                    {copied ? <Check className="w-4.5 h-4.5 text-emerald-600" /> : <Copy className="w-4.5 h-4.5" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold">{copied ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
                    <span className="block text-[10px] font-normal text-slate-500">Para Telegram, Instagram DM o notas</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                  {copied ? 'Listo' : 'Copiar'}
                </span>
              </button>

              {/* Grid 3-in-1: Facebook, Email & Print */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1.5 border border-blue-200 transition-all"
                >
                  <Facebook className="w-4.5 h-4.5" />
                  <span className="text-[10px]">Facebook</span>
                </a>

                <a
                  href={emailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-50 hover:bg-slate-800 text-slate-700 hover:text-white p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1.5 border border-slate-200 transition-all"
                >
                  <Mail className="w-4.5 h-4.5" />
                  <span className="text-[10px]">Email</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handlePrint();
                  }}
                  className="bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1.5 border border-amber-200 transition-all"
                >
                  <Printer className="w-4.5 h-4.5" />
                  <span className="text-[10px]">Ficha PDF</span>
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Inmobiliaria Montaño • San José de Mayo, Uruguay</p>
            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default SharePropertyModal;
