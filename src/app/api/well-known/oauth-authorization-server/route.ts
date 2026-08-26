import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const payload = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/login`,
    token_endpoint: `${baseUrl}/api/auth/google`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/auth.md`,
    response_types_supported: ['code', 'token'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    scopes_supported: ['openid', 'profile', 'email', 'properties:read', 'public:read'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic', 'none'],
    agent_auth: {
      register_uri: `${baseUrl}/auth.md`,
      supported_identity_types: ['public_agent', 'registered_user'],
      supported_credential_types: ['none_for_public', 'jwt_bearer'],
    },
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
