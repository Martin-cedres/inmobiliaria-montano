import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get('accept') || '';

  // 1. Permitir explícitamente rutas de autenticación y assets estáticos
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Content Negotiation para Agentes de IA (Cloudflare Markdown for Agents Spec)
  // Si el cliente pide específicamente Accept: text/markdown
  if (acceptHeader.includes('text/markdown')) {
    const origin = request.nextUrl.origin;
    let target = '';

    if (pathname === '/') {
      target = `${origin}/llms.txt`;
    } else if (pathname.startsWith('/propiedad/')) {
      const slug = pathname.replace('/propiedad/', '').replace(/\.md$/, '');
      target = `${origin}/api/markdown/propiedad/${slug}`;
    } else if (pathname === '/propiedades-san-jose') {
      target = `${origin}/propiedades/llms.txt`;
    } else if (pathname === '/alquileres-san-jose-de-mayo') {
      target = `${origin}/propiedades/alquiler/llms.txt`;
    } else if (pathname === '/casas-en-venta-san-jose-de-mayo') {
      target = `${origin}/propiedades/venta/llms.txt`;
    }

    if (target) {
      try {
        const fetchRes = await fetch(target);
        const markdownBody = await fetchRes.text();
        return new NextResponse(markdownBody, {
          status: fetchRes.status,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'x-markdown-tokens': 'true',
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        });
      } catch {
        // Fallback to normal flow if internal fetch fails
      }
    }
  }

  // 3. Intercepta rutas /admin e /api/admin
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: 'No autenticado. Por favor inicia sesión.' },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Restricción de rutas de Super Admin (ej. gestión de usuarios)
    const isSuperadminOnlyPage = pathname.startsWith('/admin/usuarios');
    const isSuperadminOnlyApi = pathname.startsWith('/api/admin/users');

    if ((isSuperadminOnlyPage || isSuperadminOnlyApi) && session.role !== 'superadmin') {
      if (isSuperadminOnlyApi) {
        return NextResponse.json(
          { success: false, error: 'Acceso denegado. Se requiere rol de Super Admin.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
