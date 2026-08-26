import { NextRequest, NextResponse } from 'next/server';
import { importSeoTelemetryRecords } from '@/lib/telemetryStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un arreglo de registros de Search Console' },
        { status: 400 }
      );
    }

    const result = await importSeoTelemetryRecords(records);
    return NextResponse.json({ success: true, imported: result.imported });
  } catch (error: any) {
    console.error('Error en /api/admin/telemetry/import-seo:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error importando datos GSC' },
      { status: 500 }
    );
  }
}
