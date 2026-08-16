import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * Handler de Revalidación On-Demand
 * Permite purgar el caché perimetral (Edge) de Next.js mediante Tags o Paths.
 * Ejemplo: 
 *   GET /api/revalidate?tag=properties&secret=TU_TOKEN
 *   GET /api/revalidate?path=/&secret=TU_TOKEN
 *   POST /api/revalidate con { tag: "properties", secret: "TU_TOKEN" }
 */
export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}

async function handleRevalidation(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let secret = searchParams.get('secret');
    let tag = searchParams.get('tag');
    let path = searchParams.get('path');

    // Si viene por POST JSON
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        secret = body.secret || secret;
        tag = body.tag || tag;
        path = body.path || path;
      } catch {
        // Ignorar si no hay body json
      }
    }

    const expectedSecret = process.env.REVALIDATE_SECRET_TOKEN || 'montano_revalidate_secret_2026';

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Token de seguridad inválido o no proporcionado' },
        { status: 401 }
      );
    }

    if (!tag && !path) {
      // Revalidación global por defecto
      revalidateTag('properties', { expire: 0 });
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/sitemap.xml');
      return NextResponse.json({
        success: true,
        revalidated: true,
        type: 'all',
        message: 'Caché completo revalidado (tag: properties, paths: /, /admin, /sitemap.xml)',
        now: Date.now(),
      });
    }

    const revalidatedItems: string[] = [];

    if (tag) {
      revalidateTag(tag, { expire: 0 });
      revalidatedItems.push(`Tag: ${tag}`);
    }

    if (path) {
      revalidatePath(path);
      revalidatedItems.push(`Path: ${path}`);
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      items: revalidatedItems,
      message: `Revalidación exitosa de: ${revalidatedItems.join(', ')}`,
      now: Date.now(),
    });
  } catch (error: any) {
    console.error('Error en endpoint /api/revalidate:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno durante la revalidación' },
      { status: 500 }
    );
  }
}
