import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAllProperties, saveProperty } from '@/lib/propertiesStore';
import { generatePropertySlug } from '@/utils/seo';
import { Property } from '@/types/property';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await getAllProperties();
    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la lista de propiedades' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.operation || !body.category) {
      return NextResponse.json(
        { success: false, error: 'El título, la operación y la categoría son requeridos' },
        { status: 400 }
      );
    }

    const codeRef = body.codeRef || `MON-${Math.floor(100 + Math.random() * 900)}`;
    const autoSlug = generatePropertySlug(body.title, codeRef);

    const newProperty: Property = {
      id: body.id || String(Date.now()),
      codeRef,
      title: body.title,
      slug: body.slug || autoSlug,
      description: body.description || '',
      operation: body.operation,
      category: body.category,
      status: body.status || 'disponible',
      price: {
        amount: Number(body.priceAmount || body.price?.amount || 50000),
        currency: body.priceCurrency || body.price?.currency || 'USD',
        period: body.pricePeriod || body.price?.period || (body.operation === 'alquiler' ? 'mensual' : 'total'),
        priceDrop: body.priceDrop || false,
        originalAmount: body.originalAmount ? Number(body.originalAmount) : undefined,
        priceMode: body.priceMode || body.price?.priceMode || 'visible',
      },
      location: {
        department: body.department || body.location?.department || 'San José',
        city: body.city || body.location?.city || 'San José de Mayo',
        neighborhood: body.neighborhood || body.location?.neighborhood || 'Centro',
        zone: body.zone || body.location?.zone || undefined,
        address: body.address || body.location?.address || '',
        coordinates: {
          lat: body.lat ? Number(body.lat) : (body.location?.coordinates?.lat ?? -34.3375),
          lng: body.lng ? Number(body.lng) : (body.location?.coordinates?.lng ?? -56.7136),
        },
        isExactLocation: body.isExactLocation ?? body.location?.isExactLocation ?? false,
        radiusMeters: body.radiusMeters ? Number(body.radiusMeters) : (body.location?.radiusMeters || 300),
        hasLocation: body.hasLocation !== undefined ? body.hasLocation : (body.location?.hasLocation !== false),
      },
      features: {
        bedrooms: body.bedrooms ? Number(body.bedrooms) : body.features?.bedrooms,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : body.features?.bathrooms,
        floors: body.floors ? Number(body.floors) : body.features?.floors,
        builtAreaM2: body.builtAreaM2 ? Number(body.builtAreaM2) : body.features?.builtAreaM2,
        plotAreaM2: body.plotAreaM2 ? Number(body.plotAreaM2) : body.features?.plotAreaM2,
        frontMeters: body.frontMeters ? Number(body.frontMeters) : body.features?.frontMeters,
        carAccess: body.carAccess ?? body.features?.carAccess ?? false,
        garage: body.garage ?? body.features?.garage ?? false,
        barbecue: body.barbecue ?? body.features?.barbecue ?? false,
        pool: body.pool ?? body.features?.pool ?? false,
        garden: body.garden ?? body.features?.garden ?? false,
        woodStoveOrAC: body.woodStoveOrAC ?? body.features?.woodStoveOrAC ?? false,
        petFriendly: body.petFriendly ?? body.features?.petFriendly ?? false,
        perimeterFence: body.perimeterFence ?? body.features?.perimeterFence ?? false,
        bankCreditEligible: body.bankCreditEligible ?? body.features?.bankCreditEligible ?? false,
        phRegime: body.phRegime ?? body.features?.phRegime ?? false,
        oseWater: body.oseWater ?? body.features?.oseWater ?? true,
        uteElectric: body.uteElectric ?? body.features?.uteElectric ?? true,
        sanitation: body.sanitation ?? body.features?.sanitation ?? true,
        fiberOptic: body.fiberOptic ?? body.features?.fiberOptic ?? false,
        waterWellOrPond: body.waterWellOrPond ?? body.features?.waterWellOrPond ?? false,
        titlesUpToDate: body.titlesUpToDate ?? body.features?.titlesUpToDate ?? true,
        acceptsTradeIn: body.acceptsTradeIn ?? body.features?.acceptsTradeIn ?? false,
        securitySystem: body.securitySystem ?? body.features?.securitySystem ?? false,
        pavedStreet: body.pavedStreet ?? body.features?.pavedStreet ?? false,
        shedOrCorral: body.shedOrCorral ?? body.features?.shedOrCorral ?? false,
        coneatIndex: body.coneatIndex ? Number(body.coneatIndex) : body.features?.coneatIndex,
        isHectares: body.isHectares ?? body.features?.isHectares ?? false,
        hectaresAmount: body.hectaresAmount ? Number(body.hectaresAmount) : body.features?.hectaresAmount,
        fractionable: body.fractionable ?? body.features?.fractionable ?? false,
        minFractionM2: body.minFractionM2 ? Number(body.minFractionM2) : body.features?.minFractionM2,
        fractionNotes: body.fractionNotes || body.features?.fractionNotes,
        routeFrontage: body.routeFrontage || body.features?.routeFrontage,
        pricePerM2: body.pricePerM2 ? Number(body.pricePerM2) : body.features?.pricePerM2,
        priceUnitType: body.priceUnitType || body.features?.priceUnitType || 'm²',
        soilTopography: body.soilTopography || body.features?.soilTopography,
        gatedPerimeter: body.gatedPerimeter ?? body.features?.gatedPerimeter ?? false,
        cadastralNumber: body.cadastralNumber || body.features?.cadastralNumber,
        propertyTaxUpToDate: body.propertyTaxUpToDate ?? body.features?.propertyTaxUpToDate ?? true,
        primaryTaxUpToDate: body.primaryTaxUpToDate ?? body.features?.primaryTaxUpToDate ?? true,
      },
      guarantees: Array.isArray(body.guarantees) ? body.guarantees : [],
      legalCertainties: {
        titlesUpToDate: body.titlesUpToDate ?? true,
        bankCreditEligible: body.bankCreditEligible ?? false,
        acceptsTradeIn: body.acceptsTradeIn ?? false,
      },
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images.map((img: any, idx: number) => 
            typeof img === 'string' 
              ? { id: `img-${idx}`, blobUrl: img, webpUrl: img, thumbnailUrl: img, altText: body.title, isMain: idx === 0 }
              : img
          )
        : [
            {
              id: 'img-1',
              blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              webpUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              altText: body.title || 'Propiedad Inmobiliaria Montaño',
              isMain: true,
            }
          ],
      seoTitle: body.seoTitle || undefined,
      seoDescription: body.seoDescription || undefined,
      featured: body.featured ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProperty(newProperty);

    // Invalidación On-Demand de Edge Data Cache y Rutas Estáticas
    revalidateTag('properties', { expire: 0 });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/sitemap.xml');
    revalidatePath('/google-catalog.xml');
    revalidatePath('/api/feeds/google-catalog.xml');
    revalidatePath('/api/feeds/google-catalog.json');
    if (saved.slug) {
      revalidateTag(`property-${saved.slug}`, { expire: 0 });
      revalidatePath(`/propiedad/${saved.slug}`);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
      import('@/lib/googleIndexing').then(({ notifySearchEngines }) => {
        notifySearchEngines(`${baseUrl}/propiedad/${saved.slug}`, 'URL_UPDATED').catch(() => null);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Propiedad publicada exitosamente',
      data: saved,
    });
  } catch (error: any) {
    console.error('Error saving property:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al publicar la propiedad' },
      { status: 500 }
    );
  }
}
