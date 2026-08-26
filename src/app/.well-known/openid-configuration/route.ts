import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const payload = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/login`,
    token_endpoint: `${baseUrl}/api/auth/google`,
    userinfo_endpoint: `${baseUrl}/api/auth/me`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/auth.md`,
    response_types_supported: ['code', 'token', 'id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256', 'HS256'],
    grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
    scopes_supported: ['openid', 'profile', 'email', 'properties:read', 'public:read'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic', 'none'],
    claims_supported: ['sub', 'name', 'email', 'picture'],
    service_documentation: `${baseUrl}/llms.txt`,
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
