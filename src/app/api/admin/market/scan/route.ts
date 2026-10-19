import { NextResponse } from 'next/server';
import { executeMarketScan } from '@/lib/marketScanner';
import {
  getAllMarketListings,
  getMarketKpis,
  getPriceDropOpportunities,
  getWeeklyExecutiveReports,
} from '@/lib/marketStore';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST() {
  try {
    const scanResult = await executeMarketScan();

    const [listings, kpis, priceDrops, reports] = await Promise.all([
      getAllMarketListings(),
      getMarketKpis(),
      getPriceDropOpportunities(),
      getWeeklyExecutiveReports(),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Escaneo de mercado en vivo completado exitosamente.',
      scanResult,
      data: {
        listings,
        kpis,
        priceDrops,
        reports,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error durante el escaneo de mercado';
    console.error('Error en /api/admin/market/scan:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
