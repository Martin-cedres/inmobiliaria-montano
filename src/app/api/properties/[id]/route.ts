import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { updatePropertyStatus, deletePropertyById, getAllProperties, getPropertyById, saveProperty } from '@/lib/propertiesStore';
import { PropertyStatus } from '@/types/property';

export const dynamic = 'force-dynamic';

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
        priceMode: body.priceMode || body.price?.priceMode || existing.price.priceMode || 'visible',
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
        bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : (body.features?.bedrooms !== undefined ? Number(body.features.bedrooms) : existing.features?.bedrooms),
        bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : (body.features?.bathrooms !== undefined ? Number(body.features.bathrooms) : existing.features?.bathrooms),
        floors: body.floors !== undefined ? Number(body.floors) : (body.features?.floors !== undefined ? Number(body.features.floors) : existing.features?.floors),
        builtAreaM2: body.builtAreaM2 !== undefined ? Number(body.builtAreaM2) : (body.features?.builtAreaM2 !== undefined ? Number(body.features.builtAreaM2) : existing.features?.builtAreaM2),
        plotAreaM2: body.plotAreaM2 !== undefined ? Number(body.plotAreaM2) : (body.features?.plotAreaM2 !== undefined ? Number(body.features.plotAreaM2) : existing.features?.plotAreaM2),
        frontMeters: body.frontMeters !== undefined ? Number(body.frontMeters) : (body.features?.frontMeters !== undefined ? Number(body.features.frontMeters) : existing.features?.frontMeters),
        isHectares: body.isHectares !== undefined ? Boolean(body.isHectares) : (body.features?.isHectares !== undefined ? Boolean(body.features.isHectares) : existing.features?.isHectares),
        carAccess: body.carAccess !== undefined ? Boolean(body.carAccess) : (body.features?.carAccess !== undefined ? Boolean(body.features.carAccess) : existing.features?.carAccess),
        garage: body.garage !== undefined ? Boolean(body.garage) : (body.features?.garage !== undefined ? Boolean(body.features.garage) : existing.features?.garage),
        barbecue: body.barbecue !== undefined ? Boolean(body.barbecue) : (body.features?.barbecue !== undefined ? Boolean(body.features.barbecue) : existing.features?.barbecue),
        pool: body.pool !== undefined ? Boolean(body.pool) : (body.features?.pool !== undefined ? Boolean(body.features.pool) : existing.features?.pool),
        garden: body.garden !== undefined ? Boolean(body.garden) : (body.features?.garden !== undefined ? Boolean(body.features.garden) : existing.features?.garden),
        woodStoveOrAC: body.woodStoveOrAC !== undefined ? Boolean(body.woodStoveOrAC) : (body.features?.woodStoveOrAC !== undefined ? Boolean(body.features.woodStoveOrAC) : existing.features?.woodStoveOrAC),
        petFriendly: body.petFriendly !== undefined ? Boolean(body.petFriendly) : (body.features?.petFriendly !== undefined ? Boolean(body.features.petFriendly) : existing.features?.petFriendly),
        perimeterFence: body.perimeterFence !== undefined ? Boolean(body.perimeterFence) : (body.features?.perimeterFence !== undefined ? Boolean(body.features.perimeterFence) : existing.features?.perimeterFence),
        bankCreditEligible: body.bankCreditEligible !== undefined ? Boolean(body.bankCreditEligible) : (body.features?.bankCreditEligible !== undefined ? Boolean(body.features.bankCreditEligible) : existing.features?.bankCreditEligible),
        phRegime: body.phRegime !== undefined ? Boolean(body.phRegime) : (body.features?.phRegime !== undefined ? Boolean(body.features.phRegime) : existing.features?.phRegime),
        oseWater: body.oseWater !== undefined ? Boolean(body.oseWater) : (body.features?.oseWater !== undefined ? Boolean(body.features.oseWater) : existing.features?.oseWater),
        uteElectric: body.uteElectric !== undefined ? Boolean(body.uteElectric) : (body.features?.uteElectric !== undefined ? Boolean(body.features.uteElectric) : existing.features?.uteElectric),
        sanitation: body.sanitation !== undefined ? Boolean(body.sanitation) : (body.features?.sanitation !== undefined ? Boolean(body.features.sanitation) : existing.features?.sanitation),
        fiberOptic: body.fiberOptic !== undefined ? Boolean(body.fiberOptic) : (body.features?.fiberOptic !== undefined ? Boolean(body.features.fiberOptic) : existing.features?.fiberOptic),
        waterWellOrPond: body.waterWellOrPond !== undefined ? Boolean(body.waterWellOrPond) : (body.features?.waterWellOrPond !== undefined ? Boolean(body.features.waterWellOrPond) : existing.features?.waterWellOrPond),
        titlesUpToDate: body.titlesUpToDate !== undefined ? Boolean(body.titlesUpToDate) : (body.features?.titlesUpToDate !== undefined ? Boolean(body.features.titlesUpToDate) : existing.features?.titlesUpToDate),
        acceptsTradeIn: body.acceptsTradeIn !== undefined ? Boolean(body.acceptsTradeIn) : (body.features?.acceptsTradeIn !== undefined ? Boolean(body.features.acceptsTradeIn) : existing.features?.acceptsTradeIn),
        securitySystem: body.securitySystem !== undefined ? Boolean(body.securitySystem) : (body.features?.securitySystem !== undefined ? Boolean(body.features.securitySystem) : existing.features?.securitySystem),
        pavedStreet: body.pavedStreet !== undefined ? Boolean(body.pavedStreet) : (body.features?.pavedStreet !== undefined ? Boolean(body.features.pavedStreet) : existing.features?.pavedStreet),
        shedOrCorral: body.shedOrCorral !== undefined ? Boolean(body.shedOrCorral) : (body.features?.shedOrCorral !== undefined ? Boolean(body.features.shedOrCorral) : existing.features?.shedOrCorral),
        coneatIndex: body.coneatIndex !== undefined ? Number(body.coneatIndex) : (body.features?.coneatIndex !== undefined ? Number(body.features.coneatIndex) : existing.features?.coneatIndex),
        fractionable: body.fractionable !== undefined ? Boolean(body.fractionable) : (body.features?.fractionable !== undefined ? Boolean(body.features.fractionable) : existing.features?.fractionable),
        minFractionM2: body.minFractionM2 !== undefined ? (body.minFractionM2 ? Number(body.minFractionM2) : undefined) : (body.features?.minFractionM2 !== undefined ? (body.features.minFractionM2 ? Number(body.features.minFractionM2) : undefined) : existing.features?.minFractionM2),
        fractionNotes: body.fractionNotes !== undefined ? body.fractionNotes : (body.features?.fractionNotes !== undefined ? body.features.fractionNotes : existing.features?.fractionNotes),
        routeFrontage: body.routeFrontage !== undefined ? body.routeFrontage : (body.features?.routeFrontage !== undefined ? body.features.routeFrontage : existing.features?.routeFrontage),
        pricePerM2: body.pricePerM2 !== undefined ? (body.pricePerM2 ? Number(body.pricePerM2) : undefined) : (body.features?.pricePerM2 !== undefined ? (body.features.pricePerM2 ? Number(body.features.pricePerM2) : undefined) : existing.features?.pricePerM2),
        soilTopography: body.soilTopography !== undefined ? body.soilTopography : (body.features?.soilTopography !== undefined ? body.features.soilTopography : existing.features?.soilTopography),
        gatedPerimeter: body.gatedPerimeter !== undefined ? Boolean(body.gatedPerimeter) : (body.features?.gatedPerimeter !== undefined ? Boolean(body.features.gatedPerimeter) : existing.features?.gatedPerimeter),
      },
      guarantees: Array.isArray(body.guarantees) ? body.guarantees : existing.guarantees,
      legalCertainties: {
        titlesUpToDate: body.titlesUpToDate !== undefined ? body.titlesUpToDate : existing.legalCertainties?.titlesUpToDate,
        bankCreditEligible: body.bankCreditEligible !== undefined ? body.bankCreditEligible : existing.legalCertainties?.bankCreditEligible,
        acceptsTradeIn: body.acceptsTradeIn !== undefined ? body.acceptsTradeIn : existing.legalCertainties?.acceptsTradeIn,
      },
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : existing.images,
      seoTitle: body.seoTitle !== undefined ? body.seoTitle : existing.seoTitle,
      seoDescription: body.seoDescription !== undefined ? body.seoDescription : existing.seoDescription,
      featured: body.featured !== undefined ? body.featured : existing.featured,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProperty(updatedProperty);

    // Invalidación On-Demand de Edge Data Cache y Rutas Estáticas
    revalidateTag('properties', { expire: 0 });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/sitemap.xml');
    if (saved.slug) {
      revalidateTag(`property-${saved.slug}`, { expire: 0 });
      revalidatePath(`/propiedad/${saved.slug}`);
    }
    if (existing.slug && existing.slug !== saved.slug) {
      revalidateTag(`property-${existing.slug}`, { expire: 0 });
      revalidatePath(`/propiedad/${existing.slug}`);
    }

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al actualizar la propiedad' },
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

    // Invalidación On-Demand de Edge Data Cache y Rutas Estáticas
    revalidateTag('properties', { expire: 0 });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/sitemap.xml');
    if (updated.slug) {
      revalidateTag(`property-${updated.slug}`, { expire: 0 });
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

    // Invalidación On-Demand de Edge Data Cache y Rutas Estáticas
    revalidateTag('properties', { expire: 0 });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/sitemap.xml');
    if (targetProp?.slug) {
      revalidateTag(`property-${targetProp.slug}`, { expire: 0 });
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
