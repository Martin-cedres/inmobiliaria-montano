'use client';

import React, { useState } from 'react';
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

  const handleShareClick = () => {
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
          className={`w-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#5E1754] font-extrabold text-xs py-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center space-x-2 transition-all active:scale-98 ${className}`}
        >
          <Share2 className="w-4 h-4 text-[#E85D04]" />
          <span>Compartir esta propiedad</span>
        </button>
      )}

      {/* Modal Principal de Compartir en Redes */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden text-left animate-scaleUp">
            
            {/* Header del Modal */}
            <div className="bg-[#191024] text-white p-5 border-b border-[#2D1D42] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#E85D04] flex items-center justify-center text-white">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Compartir Ficha de Propiedad</h3>
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

            {/* Vista Previa de la Tarjeta Visual (Foto + Datos que se envían) */}
            <div className="p-4 bg-slate-900 text-white flex items-center space-x-3.5 border-b border-slate-800">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-amber-400/30 shadow-md">
                <img
                  src={photoUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-bold text-amber-300 px-1.5 py-0.5 rounded">
                  Foto HD
                </span>
              </div>

              <div className="overflow-hidden space-y-1">
                <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <ImageIcon className="w-3 h-3 text-[#E85D04]" />
                  <span>Vista previa de tarjeta visual</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 truncate">{property.title}</h4>
                {hasValidPrice ? (
                  <p className="text-sm font-black text-amber-300">{formattedPrice}</p>
                ) : (
                  <p className="text-xs font-bold text-slate-400">Consultar precio</p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">{property.location.neighborhood}, San José de Mayo</p>
              </div>
            </div>

            {/* Toast Notifications */}
            {copied && (
              <div className="bg-emerald-50 border-y border-emerald-200 text-emerald-900 px-4 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Enlace de producción copiado! Listo para pegar donde quieras.</span>
              </div>
            )}

            {instagramToast && (
              <div className="bg-purple-50 border-y border-purple-200 text-purple-900 px-4 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>¡Texto e imagen listos! Abriendo Instagram...</span>
              </div>
            )}

            {/* Botones de Redes Sociales Específicos */}
            <div className="p-5 space-y-4">
              
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Seleccioná la Red Social o Canal:
              </p>

              {/* Grid 4 Botones Principales de Redes Sociales: WhatsApp, Instagram, Facebook, X (Twitter) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. Botón WhatsApp Oficial (Verde) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-emerald-500/20 transition-all text-center"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>WhatsApp</span>
                  <span className="text-[9px] font-normal text-emerald-100">Directo</span>
                </a>

                {/* 2. Botón Instagram Oficial (Gradiente Rosa/Púrpura) */}
                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 active:scale-95 text-white p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-pink-500/20 transition-all text-center"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                  <span className="text-[9px] font-normal text-pink-100">DM / Story</span>
                </button>

                {/* 3. Botón Facebook Oficial (Azul) */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-blue-500/20 transition-all text-center"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                  <span className="text-[9px] font-normal text-blue-100">Muro/Grupos</span>
                </a>

                {/* 4. Botón X (Twitter) Oficial (Negro) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🏡 Mirá esta propiedad en Inmobiliaria Montaño: ${property.title}${hasValidPrice ? ` - ${formattedPrice}` : ''}`)}&url=${encodeURIComponent(prodShareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-900 hover:bg-black active:scale-95 text-white p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-slate-500/20 transition-all text-center"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X (Twitter)</span>
                  <span className="text-[9px] font-normal text-slate-300">Publicación</span>
                </a>

              </div>

              {/* Botón de Copiar Enlace Directo */}
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
                    <span className="block text-[10px] font-normal text-slate-500">{prodShareUrl}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-[#5E1754] text-white px-3 py-1.5 rounded-lg shadow-xs">
                  {copied ? 'Listo' : 'Copiar'}
                </span>
              </button>

              {/* Acción Secundaria: Email */}
              <div className="pt-2">
                <a
                  href={emailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-slate-50 hover:bg-slate-800 text-slate-700 hover:text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200 transition-all"
                >
                  <Mail className="w-4 h-4 text-[#E85D04]" />
                  <span>Enviar por Correo Electrónico</span>
                </a>
              </div>

            </div>

            {/* Footer del Modal */}
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
