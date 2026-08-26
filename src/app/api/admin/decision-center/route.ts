import { NextRequest, NextResponse } from 'next/server';
import { getDecisionCenterCards } from '@/lib/decisionCenter';
import { getSeoPerformanceSummary, getConversionFunnelSummary } from '@/lib/telemetryStore';
import { getAllProperties } from '@/lib/propertiesStore';

export async function GET(request: NextRequest) {
  try {
    const allProperties = await getAllProperties();
    const [seoSummary, conversionSummary] = await Promise.all([
      getSeoPerformanceSummary(),
      getConversionFunnelSummary(allProperties),
    ]);

    const cards = getDecisionCenterCards(allProperties, seoSummary, conversionSummary);

    return NextResponse.json({
      success: true,
      data: cards,
    });
  } catch (error: any) {
    console.error('Error en /api/admin/decision-center:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al obtener Centro de Decisiones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, actionType } = body; // actionType: 'approve' | 'dismiss'

    return NextResponse.json({
      success: true,
      message: `Acción '${actionId}' procesada con estado '${actionType}'.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al procesar acción' },
      { status: 500 }
    );
  }
}
