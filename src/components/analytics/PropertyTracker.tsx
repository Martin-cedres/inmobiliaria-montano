'use client';

import { useEffect } from 'react';
import { trackPropertyEvent } from '@/utils/analytics';
import { trackConversionEvent } from '@/utils/telemetry';
import { Property } from '@/types/property';

interface PropertyTrackerProps {
  propertyId: string;
  property?: Property;
}

export function PropertyTracker({ propertyId, property }: PropertyTrackerProps) {
  useEffect(() => {
    if (propertyId) {
      trackPropertyEvent(propertyId, 'view');
    }
    if (property) {
      trackConversionEvent({
        eventType: 'property_view',
        pagePath: `/propiedad/${property.slug}`,
        propertySlug: property.slug,
        propertyCategory: property.category,
        propertyStatus: property.status,
        operation: property.operation,
        location: property.location.city || 'San José de Mayo',
      });
    }
  }, [propertyId, property]);

  return null;
}

export function handleWhatsAppClickTrack(propertyId: string, property?: Property) {
  if (propertyId) {
    trackPropertyEvent(propertyId, 'whatsapp_click');
  }
  if (property) {
    trackConversionEvent({
      eventType: 'whatsapp_click',
      buttonPosition: 'property',
      pagePath: `/propiedad/${property.slug}`,
      propertySlug: property.slug,
      propertyCategory: property.category,
      propertyStatus: property.status,
      operation: property.operation,
      location: property.location.city || 'San José de Mayo',
    });
  }
}

export function handleShareClickTrack(propertyId: string, property?: Property) {
  if (propertyId) {
    trackPropertyEvent(propertyId, 'share_click');
  }
}
