'use client';

import React from 'react';
import { trackPropertyEvent } from '@/utils/analytics';

interface WhatsAppTrackButtonProps {
  propertyId: string;
  whatsappUrl: string;
  className?: string;
  children: React.ReactNode;
}

export function WhatsAppTrackButton({
  propertyId,
  whatsappUrl,
  className,
  children,
}: WhatsAppTrackButtonProps) {
  const handleClick = () => {
    trackPropertyEvent(propertyId, 'whatsapp_click');
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
