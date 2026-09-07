import { NextRequest } from 'next/server';
import { getAllProperties } from '@/lib/propertiesStore';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export const revalidate = 86400; // 24 horas

export async function GET(request: NextRequest) {
  const allProperties = await getAllProperties();
  const saleProperties = allProperties.filter(
    (p) =>
      p.operation === 'venta' &&
      p.status !== 'retirada' &&
      p.status !== 'inactiva' &&
      p.status !== 'vendido' &&
      p.status !== 'alquilado'
  );

  let content = `# Propiedades en Venta — Inmobiliaria Montaño\n`;
  content += `> Catálogo exclusivo de casas, apartamentos y terrenos disponibles para la venta en San José de Mayo y todo el departamento de San José, Uruguay. Inmuebles verificados aptos para crédito bancario (BHU, Santander, Itaú, BBVA). Atención directa con Daniel Montaño en 25 de Mayo 338, San José de Mayo (WhatsApp: 092 776 715).\n\n`;
  content += `Total de propiedades en venta disponibles: ${saleProperties.length}\n\n`;

  for (const p of saleProperties) {
    const priceFormatted = p.price.priceMode === 'consultar' || p.price.amount === 0
      ? 'A consultar'
      : p.price.priceMode === 'reservado'
      ? 'Precio reservado'
      : `${p.price.currency === 'USD' ? 'USD' : 'UYU $'} ${p.price.amount.toLocaleString('es-UY')}`;

    content += `### [${p.title}](${BASE_URL}/propiedad/${p.slug})\n`;
    content += `- **Referencia:** #${p.codeRef}\n`;
    content += `- **Categoría:** ${p.category.toUpperCase()} | **Estado:** ${p.status.toUpperCase()}\n`;
    content += `- **Precio:** ${priceFormatted}\n`;
    content += `- **Ubicación:** ${p.location.neighborhood ? `${p.location.neighborhood}, ` : ''}${p.location.city || 'San José de Mayo'}, ${p.location.department || 'San José'}\n`;
    content += `- **Ficha Markdown:** ${BASE_URL}/propiedad/${p.slug}.md\n`;
    content += `- **Ficha Web:** ${BASE_URL}/propiedad/${p.slug}\n\n`;
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
