import { NextRequest, NextResponse } from 'next/server';
import { updateMarketListingStatus } from '@/lib/marketStore';
import { MarketListingStatus } from '@/types/market';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, internalNotes } = body as {
      status?: MarketListingStatus;
      internalNotes?: string;
    };

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'El campo status es requerido.' },
        { status: 400 }
      );
    }

    const updated = await updateMarketListingStatus(id, status, internalNotes);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Aviso de mercado no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar aviso';
    console.error('Error en PATCH /api/admin/market/listing/[id]:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
