import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/propertiesStore';
import { stripMarkdown } from '@/utils/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export async function GET() {
  try {
    const allProperties = await getAllProperties();
    const validProperties = allProperties.filter(
      (p) => p.status !== 'retirada' && p.status !== 'inactiva'
    );

    const items = validProperties.map((p) => {
      const canonicalUrl = `${BASE_URL}/propiedad/${p.slug}`;
      const mainImage = p.images?.find((img) => img.isMain) || p.images?.[0];
      const rawImg = mainImage?.webpUrl || mainImage?.blobUrl || '/logo.png';
      const imageUrl = rawImg.startsWith('http') ? rawImg : `${BASE_URL}${rawImg}`;
      
      const isSoldOrRented = p.status === 'vendido' || p.status === 'alquilado';
      const isReserved = p.status === 'reservado';
      const availability = isSoldOrRented || isReserved ? 'out_of_stock' : 'in_stock';

      return {
        id: p.codeRef || p.id,
        title: p.seoTitle || p.title,
        description: stripMarkdown(p.seoDescription || p.description),
        link: canonicalUrl,
        image_link: imageUrl,
        additional_image_links: (p.images || []).slice(1, 10).map((img) => {
          const src = img.webpUrl || img.blobUrl;
          return src.startsWith('http') ? src : `${BASE_URL}${src}`;
        }),
        price: `${(p.price?.amount || 0).toFixed(2)} ${p.price?.currency === 'UYU' ? 'UYU' : 'USD'}`,
        availability,
        condition: 'new',
        brand: 'Inmobiliaria Montaño',
        product_type: `Inmuebles > ${p.category}`,
        google_product_category: 'Real Estate',
        custom_labels: {
          operation: p.operation,
          city: p.location?.city || 'San José de Mayo',
          neighborhood: p.location?.neighborhood || 'San José',
          bank_credit_eligible: Boolean(p.legalCertainties?.bankCreditEligible || p.features?.bankCreditEligible),
          status: p.status,
        },
      };
    });

    return NextResponse.json({
      title: 'Inmobiliaria Montaño - Catálogo Oficial de Inmuebles',
      link: BASE_URL,
      count: items.length,
      updated_at: new Date().toISOString(),
      items,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error fetching feed' }, { status: 500 });
  }
}
