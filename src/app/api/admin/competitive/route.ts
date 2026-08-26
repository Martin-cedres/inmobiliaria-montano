import { NextRequest, NextResponse } from 'next/server';
import { getCompetitiveIntelligenceSummary } from '@/lib/competitiveIntelligence';
import { getSeoPerformanceSummary, getConversionFunnelSummary } from '@/lib/telemetryStore';
import { getAllProperties } from '@/lib/propertiesStore';

export async function GET(request: NextRequest) {
  try {
    const allProperties = await getAllProperties();
    const [seoSummary, conversionSummary] = await Promise.all([
      getSeoPerformanceSummary(),
      getConversionFunnelSummary(allProperties),
    ]);

    const competitiveSummary = getCompetitiveIntelligenceSummary(
      allProperties,
      seoSummary,
      conversionSummary
    );

    return NextResponse.json({
      success: true,
      data: competitiveSummary,
    });
  } catch (error: any) {
    console.error('Error en /api/admin/competitive:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al obtener inteligencia competitiva' },
      { status: 500 }
    );
  }
}
