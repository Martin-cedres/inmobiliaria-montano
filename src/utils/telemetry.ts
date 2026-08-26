import {
  ButtonPosition,
  ConversionEventType,
} from '@/types/telemetry';
import { Property, PropertyCategory, PropertyStatus, OperationType } from '@/types/property';

const SESSION_STORAGE_KEY = 'im_anon_session_id';

/**
 * Obtiene o inicializa un identificador anónimo de sesión en el navegador.
 * NUNCA almacena nombres, números de teléfono ni datos personales.
 */
export function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') return 'server_side_render';

  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `temp_${Date.now()}`;
  }
}

export interface TrackEventOptions {
  eventType: ConversionEventType;
  pagePath?: string;
  buttonPosition?: ButtonPosition;
  propertySlug?: string;
  propertyCategory?: PropertyCategory;
  propertyStatus?: PropertyStatus;
  operation?: OperationType;
  location?: string;
  referrer?: string;
}

/**
 * Envía un evento de telemetría / conversión de forma asíncrona y transparente.
 */
export async function trackConversionEvent(options: TrackEventOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      eventType: options.eventType,
      pagePath: options.pagePath || window.location.pathname,
      buttonPosition: options.buttonPosition,
      propertySlug: options.propertySlug,
      propertyCategory: options.propertyCategory,
      propertyStatus: options.propertyStatus,
      operation: options.operation,
      location: options.location,
      anonymousSessionId: getAnonymousSessionId(),
      referrer: options.referrer || document.referrer || undefined,
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silencioso para no degradar la experiencia de usuario
    });
  } catch {
    // Silencioso
  }
}

/**
 * Registra la visualización de una ficha de propiedad.
 */
export function trackPropertyView(property: Property): void {
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

/**
 * Registra un clic hacia WhatsApp con su posición y contexto específico.
 */
export function trackWhatsappClick(params: {
  buttonPosition: ButtonPosition;
  pagePath?: string;
  property?: Property;
  location?: string;
  category?: PropertyCategory;
}): void {
  trackConversionEvent({
    eventType: 'whatsapp_click',
    buttonPosition: params.buttonPosition,
    pagePath: params.pagePath,
    propertySlug: params.property?.slug,
    propertyCategory: params.property?.category || params.category,
    propertyStatus: params.property?.status,
    operation: params.property?.operation,
    location: params.property?.location.city || params.location || 'San José de Mayo',
  });
}

/**
 * Registra un clic hacia llamada telefónica directa.
 */
export function trackPhoneClick(params: {
  buttonPosition: ButtonPosition;
  pagePath?: string;
  propertySlug?: string;
  location?: string;
}): void {
  trackConversionEvent({
    eventType: 'phone_click',
    buttonPosition: params.buttonPosition,
    pagePath: params.pagePath,
    propertySlug: params.propertySlug,
    location: params.location || 'San José de Mayo',
  });
}
