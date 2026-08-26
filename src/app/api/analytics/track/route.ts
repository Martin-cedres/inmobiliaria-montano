import { NextRequest, NextResponse } from 'next/server';
import { incrementPropertyMetric } from '@/lib/propertiesStore';
import { recordConversionEvent } from '@/lib/telemetryStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      eventType,
      pagePath,
      buttonPosition,
      propertySlug,
      propertyCategory,
      propertyStatus,
      operation,
      location,
      anonymousSessionId,
      referrer,
    } = body;

    // 1. Caso A: Evento de Telemetría Avanzada (P3.1 / P3.3)
    if (eventType && ['whatsapp_click', 'phone_click', 'property_view', 'property_contact', 'share_click', 'view'].includes(eventType)) {
      const normalizedType = eventType === 'view' ? 'property_view' : eventType;

      await recordConversionEvent({
        eventType: normalizedType,
        pagePath: pagePath || '/',
        buttonPosition,
        propertySlug,
        propertyCategory,
        propertyStatus,
        operation,
        location,
        anonymousSessionId: anonymousSessionId || 'anon_server',
        referrer,
      });

      // Si incluye propertyId, también incrementamos el contador atómico de la propiedad
      if (propertyId) {
        const metricType = normalizedType === 'property_view' ? 'view' : (normalizedType === 'whatsapp_click' ? 'whatsapp_click' : 'share_click');
        if (['view', 'whatsapp_click', 'share_click'].includes(metricType)) {
          await incrementPropertyMetric(propertyId, metricType as any);
        }
      }

      return NextResponse.json({ success: true });
    }

    // 2. Caso B: Compatibilidad con llamadas legacy
    if (propertyId && ['view', 'whatsapp_click', 'share_click'].includes(eventType)) {
      const success = await incrementPropertyMetric(propertyId, eventType);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { success: false, error: 'Parámetros inválidos' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error en /api/analytics/track:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno' },
      { status: 500 }
    );
  }
}
