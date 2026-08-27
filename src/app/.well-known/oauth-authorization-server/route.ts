import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
    bearer_methods_supported: ['header'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic', 'none'],
    agent_auth: {
      skill: `${baseUrl}/auth.md`,
      register_uri: `${baseUrl}/auth.md`,
      identity_types_supported: ['anonymous', 'identity_assertion'],
      anonymous: {
        credential_types_supported: ['none'],
      },
      identity_assertion: {
        assertion_types_supported: [
          'verified_email',
          'urn:ietf:params:oauth:token-type:id-jag',
        ],
        credential_types_supported: ['jwt_bearer'],
      },
    },
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    },
  });
}
