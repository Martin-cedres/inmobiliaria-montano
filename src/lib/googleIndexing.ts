import * as jose from 'jose';

/**
 * Módulo de Indexación Instantánea (Google Indexing API v3 & IndexNow Engine)
 * Envía avisos directos de URL_UPDATED o URL_DELETED a los motores de búsqueda.
 */

export interface IndexingResult {
  success: boolean;
  timestamp: string;
  method: string;
  details?: string;
}

/**
 * Genera un Access Token OAuth2 temporal firmado con la Clave Privada de la Service Account
 */
async function getGoogleIndexingAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  // Limpieza de formato de la clave privada (manejo de saltos de línea \n escapados)
  const cleanKey = privateKeyPem.replace(/\\n/g, '\n');
  const privateKey = await jose.importPKCS8(cleanKey, 'RS256');

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/indexing',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(`Error de autenticación con Google: ${data.error_description || data.error || tokenRes.statusText}`);
  }

  return data.access_token;
}

export async function notifySearchEngines(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<IndexingResult> {
  const timestamp = new Date().toISOString();

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const indexNowKey = process.env.INDEXNOW_KEY || 'inmobiliariamontanoindexkey2026';
    const host = siteUrl.replace(/^https?:\/\//, '');

    const indexNowBody = {
      host: host,
      key: indexNowKey,
      keyLocation: `${siteUrl}/${indexNowKey}.txt`,
      urlList: [url],
    };

    let googleApiSuccess = false;
    let googleApiError = '';

    // 1. Google Indexing API v3 oficial con Service Account
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      try {
        const accessToken = await getGoogleIndexingAccessToken(clientEmail, privateKey);
        const googleRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            type,
          }),
        });

        if (googleRes.ok) {
          googleApiSuccess = true;
        } else {
          const errData = await googleRes.json().catch(() => ({}));
          googleApiError = errData.error?.message || `HTTP ${googleRes.status}`;
          console.error('Google Indexing API error:', googleApiError);
        }
      } catch (gErr: any) {
        googleApiError = gErr.message || 'Error conectando con Google OAuth';
        console.error('Error en Google Indexing Service Account:', gErr);
      }
    }

    // 2. Avisos secundarios (IndexNow para Bing/DuckDuckGo + Google Ping)
    const backgroundPromises: Promise<any>[] = [
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { method: 'GET' }).catch(() => null),
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(indexNowBody),
      }).catch(() => null),
    ];

    await Promise.allSettled(backgroundPromises);

    const method = googleApiSuccess
      ? 'Google Indexing API v3 (Service Account) + IndexNow'
      : (clientEmail && privateKey && !googleApiSuccess)
        ? `IndexNow + Google Ping (Aviso API: ${googleApiError})`
        : 'Google Search Ping + IndexNow Engine';

    return {
      success: true,
      timestamp,
      method,
      details: `Notificación ${type} enviada a los motores de búsqueda para: ${url}`,
    };
  } catch (err: any) {
    console.error('Error general al notificar a motores de búsqueda:', err);
    return {
      success: false,
      timestamp,
      method: 'Fallback',
      details: err?.message || 'Error al conectar con el motor de indexación',
    };
  }
}
