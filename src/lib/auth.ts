import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { UserSessionPayload } from '@/types/user';

export const SUPERADMIN_EMAIL = 'martinfernandocedres@gmail.com';
export const AUTH_COOKIE_NAME = 'auth_token';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'inmobiliaria_montano_jwt_secret_key_super_secure_2026_san_jose';
  return new TextEncoder().encode(secret);
}

/**
 * Genera un token JWT firmado de sesión con duración de 30 días.
 */
export async function createSessionToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getJwtSecretKey());
}

/**
 * Verifica y decodifica un token JWT. Retorna el payload o null si es inválido/expirado.
 */
export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene la sesión actual leída desde las cookies (Server Components o Route Handlers).
 */
export async function getSession(req?: NextRequest): Promise<UserSessionPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Configuración estándar para la cookie de autenticación en Next.js.
 */
export const AUTH_COOKIE_OPTIONS = {
  name: AUTH_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 días
};
