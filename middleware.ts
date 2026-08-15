import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir explícitamente rutas de autenticación, assets estáticos y páginas públicas
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Intercepta rutas /admin e /api/admin
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
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
};
