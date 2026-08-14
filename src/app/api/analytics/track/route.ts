import { NextRequest, NextResponse } from 'next/server';
import { incrementPropertyMetric } from '@/lib/propertiesStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, eventType } = body;

    if (!propertyId || !['view', 'whatsapp_click', 'share_click'].includes(eventType)) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const success = await incrementPropertyMetric(propertyId, eventType);

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error en /api/analytics/track:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno' },
      { status: 500 }
    );
  }
}
