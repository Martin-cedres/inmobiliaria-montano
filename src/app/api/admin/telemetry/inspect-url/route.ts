import { NextRequest, NextResponse } from 'next/server';
import { inspectUrlIndexStatus } from '@/lib/gscClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL requerida' }, { status: 400 });
    }

    const result = await inspectUrlIndexStatus(url);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en /api/admin/telemetry/inspect-url:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error inspeccionando URL' },
      { status: 500 }
    );
  }
}
