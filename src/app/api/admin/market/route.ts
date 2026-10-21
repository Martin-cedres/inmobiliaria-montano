import { NextResponse } from 'next/server';
import {
  getAllMarketListings,
  getMarketKpis,
  getPriceDropOpportunities,
  getWeeklyExecutiveReports,
  getAllMarketSnapshots,
  createManualMarketListing,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, error: 'El título del inmueble es requerido' },
        { status: 400 }
      );
    }

    const newListing = await createManualMarketListing(body);
    const kpis = await getMarketKpis();

    return NextResponse.json({
      success: true,
      message: 'Aviso de particular registrado exitosamente en el Radar',
      data: {
        listing: newListing,
        kpis,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al registrar aviso en el mercado';
    console.error('Error en POST /api/admin/market:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
