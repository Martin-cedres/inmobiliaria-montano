'use client';

import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`group fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center border-2 border-white/90 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white flex-shrink-0 group-hover:scale-110 transition-transform" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-extrabold text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2.5">
        WhatsApp Directo
      </span>
    </a>
  );
};
