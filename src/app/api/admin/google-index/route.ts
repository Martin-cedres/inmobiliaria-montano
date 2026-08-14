import { NextRequest, NextResponse } from 'next/server';
import { notifySearchEngines } from '@/lib/googleIndexing';
import { updateGoogleIndexingStatus } from '@/lib/propertiesStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, url, type = 'URL_UPDATED' } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'La URL es requerida' },
        { status: 400 }
      );
    }

    const result = await notifySearchEngines(url, type);

    if (propertyId) {
      await updateGoogleIndexingStatus(
        propertyId,
        result.success ? 'notified' : 'error',
        result.timestamp
      );
    }

    return NextResponse.json({
      success: result.success,
      timestamp: result.timestamp,
      method: result.method,
      details: result.details,
    });
  } catch (error: any) {
    console.error('Error en /api/admin/google-index:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al notificar indexación' },
      { status: 500 }
    );
  }
}
