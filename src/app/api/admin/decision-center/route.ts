import { NextRequest, NextResponse } from 'next/server';
import { getDecisionCenterCards } from '@/lib/decisionCenter';
import { getDecisionDatabase, recordDecisionAction } from '@/lib/decisionStore';
import { getSeoPerformanceSummary, getConversionFunnelSummary } from '@/lib/telemetryStore';
import { getAllProperties } from '@/lib/propertiesStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const allProperties = await getAllProperties();
    const [seoSummary, conversionSummary, decisionDb] = await Promise.all([
      getSeoPerformanceSummary(),
      getConversionFunnelSummary(allProperties),
      getDecisionDatabase(),
    ]);

    const cards = getDecisionCenterCards(
      allProperties,
      seoSummary,
      conversionSummary,
      decisionDb.decisions
    );

    return NextResponse.json({
      success: true,
      data: cards,
      decisionsMap: decisionDb.decisions,
    });
  } catch (error: any) {
    console.error('Error en GET /api/admin/decision-center:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al obtener Centro de Decisiones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, actionType } = body; // actionType: 'approve' | 'dismiss' | 'pending'

    if (!actionId || !actionType) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros actionId o actionType' },
        { status: 400 }
      );
    }

    const updatedDb = await recordDecisionAction(
      actionId,
      actionType === 'approve' ? 'approved' : actionType === 'dismiss' ? 'dismissed' : 'pending'
    );

    const allProperties = await getAllProperties();
    const [seoSummary, conversionSummary] = await Promise.all([
      getSeoPerformanceSummary(),
      getConversionFunnelSummary(allProperties),
    ]);

    const updatedCards = getDecisionCenterCards(
      allProperties,
      seoSummary,
      conversionSummary,
      updatedDb.decisions
    );

    return NextResponse.json({
      success: true,
      message: `Acción '${actionId}' registrada con estado '${actionType}'.`,
      data: updatedCards,
      decisionsMap: updatedDb.decisions,
    });
  } catch (error: any) {
    console.error('Error en POST /api/admin/decision-center:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al procesar acción' },
      { status: 500 }
    );
  }
}
