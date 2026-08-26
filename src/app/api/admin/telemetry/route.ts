import { NextRequest, NextResponse } from 'next/server';
import { getSeoPerformanceSummary, getConversionFunnelSummary, calculateUrlHealthScores } from '@/lib/telemetryStore';
import { getAllProperties } from '@/lib/propertiesStore';
import { crossReferenceGscWithInventory } from '@/lib/gscClient';

export async function GET(request: NextRequest) {
  try {
    const allProperties = await getAllProperties();
    const [seoSummary, conversionSummary] = await Promise.all([
      getSeoPerformanceSummary(),
      getConversionFunnelSummary(allProperties),
    ]);

    const inventoryOpportunities = crossReferenceGscWithInventory(seoSummary, allProperties);
    const healthScores = calculateUrlHealthScores(allProperties, seoSummary, conversionSummary);

    return NextResponse.json({
      success: true,
      seo: seoSummary,
      conversions: conversionSummary,
      inventoryOpportunities,
      healthScores,
    });
  } catch (error: any) {
    console.error('Error en /api/admin/telemetry:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno' },
      { status: 500 }
    );
  }
}

