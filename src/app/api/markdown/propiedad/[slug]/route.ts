import { NextRequest } from 'next/server';
import { getAllProperties } from '@/lib/propertiesStore';
import { generatePropertyMarkdown } from '@/utils/markdown';

export const revalidate = 86400; // 24 horas

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const properties = await getAllProperties();

  const property = properties.find((p) => p.slug === slug);

  // Si la propiedad no existe o está retirada/inactiva -> 404
  if (!property || property.status === 'retirada' || property.status === 'inactiva') {
    return new Response('# 404 - Propiedad No Encontrada\n\nEl inmueble solicitado no está disponible o ha sido retirado del catálogo público.', {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  }

  const markdown = generatePropertyMarkdown(property);

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
