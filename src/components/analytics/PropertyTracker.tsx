'use client';

import { useEffect } from 'react';
import { trackPropertyEvent } from '@/utils/analytics';

interface PropertyTrackerProps {
  propertyId: string;
}

export function PropertyTracker({ propertyId }: PropertyTrackerProps) {
  useEffect(() => {
    if (propertyId) {
      trackPropertyEvent(propertyId, 'view');
    }
  }, [propertyId]);

  return null;
}

export function handleWhatsAppClickTrack(propertyId: string) {
  if (propertyId) {
    trackPropertyEvent(propertyId, 'whatsapp_click');
  }
}

export function handleShareClickTrack(propertyId: string) {
  if (propertyId) {
    trackPropertyEvent(propertyId, 'share_click');
  }
}
