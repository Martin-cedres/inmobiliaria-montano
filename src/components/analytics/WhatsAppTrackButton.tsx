'use client';

import React from 'react';
import { trackPropertyEvent } from '@/utils/analytics';
import { trackConversionEvent } from '@/utils/telemetry';
import { Property } from '@/types/property';
import { ButtonPosition } from '@/types/telemetry';

interface WhatsAppTrackButtonProps {
  propertyId?: string;
  property?: Property;
  whatsappUrl: string;
  buttonPosition?: ButtonPosition;
  pagePath?: string;
  className?: string;
  children: React.ReactNode;
}

export function WhatsAppTrackButton({
  propertyId,
  property,
  whatsappUrl,
  buttonPosition = 'property',
  pagePath,
  className,
  children,
}: WhatsAppTrackButtonProps) {
  const handleClick = () => {
    if (propertyId) {
      trackPropertyEvent(propertyId, 'whatsapp_click');
    }
    trackConversionEvent({
      eventType: 'whatsapp_click',
      buttonPosition,
      pagePath: pagePath || (property ? `/propiedad/${property.slug}` : typeof window !== 'undefined' ? window.location.pathname : '/'),
      propertySlug: property?.slug,
      propertyCategory: property?.category,
      propertyStatus: property?.status,
      operation: property?.operation,
      location: property?.location.city || 'San José de Mayo',
    });
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
