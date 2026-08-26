import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveGscPerformance, getAuthorizedGscSites } from '@/lib/gscClient';
import { importSeoTelemetryRecords } from '@/lib/telemetryStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { days = 28 } = body;

    // 1. Intentar sincronización en vivo
    const gscResult = await fetchLiveGscPerformance(days);

    if (gscResult.success && gscResult.records && gscResult.records.length > 0) {
      await importSeoTelemetryRecords(gscResult.records, true);
      return NextResponse.json({
        success: true,
        source: 'gsc_api_live',
        message: gscResult.message,
        recordsCount: gscResult.recordsCount,
        propertyFound: gscResult.propertyFound,
        startDate: gscResult.startDate,
        endDate: gscResult.endDate,
      });
    }

    // Si falló, diagnosticamos el motivo exacto
    const sitesCheck = await getAuthorizedGscSites();

    return NextResponse.json({
      success: false,
      source: gscResult.source,
      message: gscResult.message,
      authorizedSites: sitesCheck.sites,
      instructions:
        gscResult.source === 'error_api_disabled'
          ? 'Habilitá la API en Google Cloud Console: https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=685287847579'
          : 'Agregá la Service Account (google-indexing-bot-inmob@gen-lang-client-0310212601.iam.gserviceaccount.com) con permiso "Restringido" o "Lectura" en Google Search Console.',
    });
  } catch (error: any) {
    console.error('Error en /api/admin/telemetry/sync-gsc:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al sincronizar GSC' },
      { status: 500 }
    );
  }
}
