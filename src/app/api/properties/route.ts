import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProperties, saveProperty } from '@/lib/propertiesStore';
import { generatePropertySlug } from '@/utils/seo';
import { Property } from '@/types/property';

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
        department: body.department || 'San José',
        city: body.city || 'San José de Mayo',
        neighborhood: body.neighborhood || 'Centro',
        address: body.address || '',
        coordinates: {
          lat: body.lat ? Number(body.lat) : -34.3375,
          lng: body.lng ? Number(body.lng) : -56.7136,
        },
        isExactLocation: body.isExactLocation ?? false,
        radiusMeters: body.radiusMeters ? Number(body.radiusMeters) : 300,
        hasLocation: body.hasLocation !== undefined ? body.hasLocation : true,
      },
      features: {
        bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
        floors: body.floors ? Number(body.floors) : undefined,
        builtAreaM2: body.builtAreaM2 ? Number(body.builtAreaM2) : undefined,
        plotAreaM2: body.plotAreaM2 ? Number(body.plotAreaM2) : undefined,
        frontMeters: body.frontMeters ? Number(body.frontMeters) : undefined,
        isHectares: body.isHectares ?? false,
        carAccess: body.carAccess ?? false,
        garage: body.garage ?? false,
        barbecue: body.barbecue ?? false,
        pool: body.pool ?? false,
        garden: body.garden ?? false,
        woodStoveOrAC: body.woodStoveOrAC ?? false,
        petFriendly: body.petFriendly ?? false,
        perimeterFence: body.perimeterFence ?? false,
        bankCreditEligible: body.bankCreditEligible ?? false,
        phRegime: body.phRegime ?? false,
        oseWater: body.oseWater ?? true,
        uteElectric: body.uteElectric ?? true,
        sanitation: body.sanitation ?? true,
        fiberOptic: body.fiberOptic ?? false,
        waterWellOrPond: body.waterWellOrPond ?? false,
        titlesUpToDate: body.titlesUpToDate ?? true,
        acceptsTradeIn: body.acceptsTradeIn ?? false,
        securitySystem: body.securitySystem ?? false,
        pavedStreet: body.pavedStreet ?? false,
        shedOrCorral: body.shedOrCorral ?? false,
        coneatIndex: body.coneatIndex ? Number(body.coneatIndex) : undefined,
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

    // Revalidación explícita del caché de Next.js (Recomendación Técnica #1)
    revalidatePath('/');
    revalidatePath('/admin');

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
