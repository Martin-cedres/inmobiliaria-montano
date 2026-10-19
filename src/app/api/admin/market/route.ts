import { NextResponse } from 'next/server';
import {
  getAllMarketListings,
  getMarketKpis,
  getPriceDropOpportunities,
  getWeeklyExecutiveReports,
  getAllMarketSnapshots,
} from '@/lib/marketStore';

export async function GET() {
  try {
    const [listings, kpis, priceDrops, reports, snapshots] = await Promise.all([
      getAllMarketListings(),
      getMarketKpis(),
      getPriceDropOpportunities(),
      getWeeklyExecutiveReports(),
      getAllMarketSnapshots(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        listings,
        kpis,
        priceDrops,
        reports,
        snapshots,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al cargar inteligencia de mercado';
    console.error('Error en /api/admin/market:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
