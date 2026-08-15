import { NextRequest, NextResponse } from 'next/server';
import { upsertGoogleUser } from '@/lib/usersStore';
import { createSessionToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  if (errorParam || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_cancelado`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=config_error`);
  }

  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  try {
    // 1. Intercambiar código por Tokens de Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Error intercambiando código OAuth Google:', tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_error`);
    }

    // 2. Obtener datos del Perfil de Google del Usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!userResponse.ok || !googleUser.email) {
      console.error('Error obteniendo perfil de usuario Google:', googleUser);
      return NextResponse.redirect(`${baseUrl}/login?error=profile_error`);
    }

    const { email, name, picture } = googleUser;

    // 3. Consultar / Registrar en Neon Postgres
    const dbUser = await upsertGoogleUser(email, name || email, picture);

    if (!dbUser) {
      // El correo no fue previamente autorizado por el Super Admin
      return NextResponse.redirect(
        `${baseUrl}/login?error=no_authorized&email=${encodeURIComponent(email)}`
      );
    }

    // 4. Generar Token JWT de sesión
    const tokenPayload = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      role: dbUser.role,
    };

    const jwtToken = await createSessionToken(tokenPayload);

    // 5. Redirigir al Admin estableciendo la Cookie de Sesión HTTP-Only
    const response = NextResponse.redirect(`${baseUrl}/admin`);

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: jwtToken,
    });

    return response;
  } catch (error) {
    console.error('Error imprevisto en Callback de Google OAuth:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
