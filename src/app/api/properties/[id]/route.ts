import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePropertyStatus, deletePropertyById, getAllProperties, getPropertyById, saveProperty } from '@/lib/propertiesStore';
import { PropertyStatus } from '@/types/property';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la propiedad' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await getPropertyById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }

    const updatedProperty = {
      ...existing,
      codeRef: body.codeRef || existing.codeRef,
      title: body.title || existing.title,
      slug: body.slug || existing.slug,
      description: body.description || existing.description,
      operation: body.operation || existing.operation,
      category: body.category || existing.category,
      status: body.status || existing.status,
      price: {
        amount: body.priceAmount !== undefined ? Number(body.priceAmount) : existing.price.amount,
        currency: body.priceCurrency || existing.price.currency,
        period: body.pricePeriod || existing.price.period || (body.operation === 'alquiler' ? 'mensual' : 'total'),
        priceDrop: body.priceDrop !== undefined ? body.priceDrop : existing.price.priceDrop,
        originalAmount: body.originalAmount ? Number(body.originalAmount) : existing.price.originalAmount,
      },
      location: {
        department: body.department || existing.location.department || 'San José',
        city: body.city || existing.location.city || 'San José de Mayo',
        neighborhood: body.neighborhood || existing.location.neighborhood || 'Centro',
        address: body.address !== undefined ? body.address : existing.location.address,
        coordinates: {
          lat: body.lat !== undefined ? Number(body.lat) : (existing.location.coordinates?.lat ?? -34.3375),
          lng: body.lng !== undefined ? Number(body.lng) : (existing.location.coordinates?.lng ?? -56.7136),
        },
        isExactLocation: body.isExactLocation !== undefined ? body.isExactLocation : existing.location.isExactLocation,
        radiusMeters: body.radiusMeters !== undefined ? Number(body.radiusMeters) : existing.location.radiusMeters,
        hasLocation: body.hasLocation !== undefined ? body.hasLocation : existing.location.hasLocation,
      },
      features: {
        bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : existing.features.bedrooms,
        bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : existing.features.bathrooms,
        floors: body.floors !== undefined ? Number(body.floors) : existing.features.floors,
        builtAreaM2: body.builtAreaM2 !== undefined ? Number(body.builtAreaM2) : existing.features.builtAreaM2,
        plotAreaM2: body.plotAreaM2 !== undefined ? Number(body.plotAreaM2) : existing.features.plotAreaM2,
        isHectares: body.isHectares !== undefined ? body.isHectares : existing.features.isHectares,
        garage: body.garage !== undefined ? body.garage : existing.features.garage,
        barbecue: body.barbecue !== undefined ? body.barbecue : existing.features.barbecue,
        pool: body.pool !== undefined ? body.pool : existing.features.pool,
        perimeterFence: body.perimeterFence !== undefined ? body.perimeterFence : existing.features.perimeterFence,
        bankCreditEligible: body.bankCreditEligible !== undefined ? body.bankCreditEligible : existing.features.bankCreditEligible,
        phRegime: body.phRegime !== undefined ? body.phRegime : existing.features.phRegime,
        oseWater: body.oseWater !== undefined ? body.oseWater : existing.features.oseWater,
        sanitation: body.sanitation !== undefined ? body.sanitation : existing.features.sanitation,
        coneatIndex: body.coneatIndex !== undefined ? Number(body.coneatIndex) : existing.features.coneatIndex,
        frontMeters: body.frontMeters !== undefined ? Number(body.frontMeters) : existing.features.frontMeters,
        waterWellOrPond: body.waterWellOrPond !== undefined ? body.waterWellOrPond : existing.features.waterWellOrPond,
        fiberOptic: body.fiberOptic !== undefined ? body.fiberOptic : existing.features.fiberOptic,
        pavedStreet: body.pavedStreet !== undefined ? body.pavedStreet : existing.features.pavedStreet,
        woodStoveOrAC: body.woodStoveOrAC !== undefined ? body.woodStoveOrAC : existing.features.woodStoveOrAC,
        shedOrCorral: body.shedOrCorral !== undefined ? body.shedOrCorral : existing.features.shedOrCorral,
      },
      guarantees: Array.isArray(body.guarantees) ? body.guarantees : existing.guarantees,
      legalCertainties: {
        titlesUpToDate: body.titlesUpToDate !== undefined ? body.titlesUpToDate : existing.legalCertainties?.titlesUpToDate,
        bankCreditEligible: body.bankCreditEligible !== undefined ? body.bankCreditEligible : existing.legalCertainties?.bankCreditEligible,
        acceptsTradeIn: body.acceptsTradeIn !== undefined ? body.acceptsTradeIn : existing.legalCertainties?.acceptsTradeIn,
      },
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : existing.images,
      featured: body.featured !== undefined ? body.featured : existing.featured,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProperty(updatedProperty);

    revalidatePath('/');
    revalidatePath('/admin');
    if (saved.slug) {
      revalidatePath(`/propiedad/${saved.slug}`);
    }

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la propiedad' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'El estado es requerido' },
        { status: 400 }
      );
    }

    const updated = await updatePropertyStatus(id, status as PropertyStatus);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }

    // Revalidación explícita del caché de Next.js (Recomendación Técnica #1)
    revalidatePath('/');
    revalidatePath('/admin');
    if (updated.slug) {
      revalidatePath(`/propiedad/${updated.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: `Estado actualizado a ${status}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating property status:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el estado de la propiedad' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allProps = await getAllProperties();
    const targetProp = allProps.find((p) => p.id === id);

    await deletePropertyById(id);

    // Revalidación explícita del caché de Next.js (Recomendación Técnica #1)
    revalidatePath('/');
    revalidatePath('/admin');
    if (targetProp?.slug) {
      revalidatePath(`/propiedad/${targetProp.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Propiedad eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la propiedad' },
      { status: 500 }
    );
  }
}
