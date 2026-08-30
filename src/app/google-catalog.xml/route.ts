import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/propertiesStore';
import { stripMarkdown } from '@/utils/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hora de caché en Edge

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const allProperties = await getAllProperties();

    // Filtramos únicamente propiedades públicas (excluyendo retiradas o inactivas)
    const validProperties = allProperties.filter(
      (p) => p.status !== 'retirada' && p.status !== 'inactiva'
    );

    const itemsXml = validProperties
      .map((property) => {
        const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;
        const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
        const rawImg = mainImage?.webpUrl || mainImage?.blobUrl || '/logo.png';
        const imageUrl = rawImg.startsWith('http') ? rawImg : `${BASE_URL}${rawImg}`;
        
        const isSoldOrRented = property.status === 'vendido' || property.status === 'alquilado';
        const isReserved = property.status === 'reservado';
        const availability = isSoldOrRented || isReserved ? 'out_of_stock' : 'in_stock';

        const rawAmount = property.price?.amount || 0;
        // Google Merchant Center exige un precio mayor a 0. Para inmuebles "a consultar" se establece 1.00 como valor técnico base
        const validAmount = rawAmount > 0 ? rawAmount : 1;
        const currency = property.price?.currency === 'UYU' ? 'UYU' : 'USD';
        const priceFormatted = `${validAmount.toFixed(2)} ${currency}`;

        const cleanTitle = escapeXml(property.seoTitle || property.title);
        const cleanDesc = escapeXml(stripMarkdown(property.seoDescription || property.description));
        const cleanCity = escapeXml(property.location?.city || 'San José de Mayo');
        const cleanNeighborhood = escapeXml(property.location?.neighborhood || 'San José');
        const isAptaBanco = Boolean(property.legalCertainties?.bankCreditEligible || property.features?.bankCreditEligible);

        let categoryLabel = 'Casas en Venta';
        if (property.operation === 'alquiler') categoryLabel = 'Alquileres';
        else if (property.category === 'terreno' || property.category === 'chacra') categoryLabel = 'Terrenos y Chacras';
        else if (property.category === 'modulo' || property.category === 'proyecto') categoryLabel = 'Viviendas Modulares y Proyectos';
        else if (property.category === 'local' || property.category === 'deposito') categoryLabel = 'Locales Comerciales y Galpones';

        // Imágenes adicionales
        const additionalImages = (property.images || [])
          .slice(1, 10)
          .map((img) => {
            const src = img.webpUrl || img.blobUrl;
            const fullSrc = src.startsWith('http') ? src : `${BASE_URL}${src}`;
            return `<g:additional_image_link>${escapeXml(fullSrc)}</g:additional_image_link>`;
          })
          .join('\n        ');

        return `    <item>
      <g:id>${escapeXml(property.codeRef || property.id)}</g:id>
      <g:title>${cleanTitle}</g:title>
      <g:description>${cleanDesc}</g:description>
      <g:link>${escapeXml(canonicalUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      ${additionalImages ? `${additionalImages}\n      ` : ''}<g:price>${priceFormatted}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Inmobiliaria Montaño</g:brand>
      <g:product_type>Inmuebles &gt; ${escapeXml(categoryLabel)}</g:product_type>
      <g:google_product_category>Real Estate</g:google_product_category>
      <g:shipping>
        <g:country>UY</g:country>
        <g:service>Servicio Inmobiliario</g:service>
        <g:price>0.00 UYU</g:price>
      </g:shipping>
      <g:custom_label_0>${escapeXml(property.operation)}</g:custom_label_0>
      <g:custom_label_1>${cleanCity}</g:custom_label_1>
      <g:custom_label_2>${isAptaBanco ? 'Apta Banco' : 'No Aplica'}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(property.status)}</g:custom_label_3>
      <g:custom_label_4>${cleanNeighborhood}</g:custom_label_4>
    </item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Inmobiliaria Montaño - Catálogo Oficial de Inmuebles</title>
    <link>${BASE_URL}</link>
    <description>Feed oficial automatizado de propiedades de Inmobiliaria Montaño en San José de Mayo y Uruguay.</description>
${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error generating Google catalog feed:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>`,
      {
        status: 500,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    );
  }
}
