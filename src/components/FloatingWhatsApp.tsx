'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
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
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white/80 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-500 group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-extrabold text-sm">WhatsApp Directo</span>
    </a>
  );
};
