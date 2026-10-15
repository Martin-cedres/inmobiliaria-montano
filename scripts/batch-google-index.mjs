import fs from 'node:fs';
import path from 'node:fs';
import * as jose from 'jose';

// 1. Cargar variables de entorno desde .env.local
if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env.local');
  } catch (err) {
    console.warn('Aviso: process.loadEnvFile falló o .env.local no existe directamente:', err.message);
  }
} else {
  // Fallback simple si no existe loadEnvFile
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  } catch (e) {
    console.warn('Aviso: No se pudo leer .env.local manualmente:', e.message);
  }
}

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKeyPem = process.env.GOOGLE_PRIVATE_KEY;

if (!clientEmail || !privateKeyPem) {
  console.error('ERROR: GOOGLE_CLIENT_EMAIL y GOOGLE_PRIVATE_KEY deben estar definidos en .env.local');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Genera un Access Token OAuth2 para Google Indexing API
 */
async function getGoogleIndexingAccessToken(email, rawKey) {
  const cleanKey = rawKey.replace(/\\n/g, '\n');
  const privateKey = await jose.importPKCS8(cleanKey, 'RS256');

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/indexing',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(email)
    .setSubject(email)
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
    throw new Error(`Error de autenticación Google OAuth2: ${data.error_description || data.error || tokenRes.statusText}`);
  }

  return data.access_token;
}

/**
 * Notifica a Google Indexing API v3
 */
async function notifyGoogleIndexing(accessToken, url, type = 'URL_UPDATED') {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      type,
    }),
  });

  const responseBody = await response.json().catch(() => ({}));
  return {
    status: response.status,
    ok: response.ok,
    body: responseBody,
  };
}

async function main() {
  console.log('--- Iniciando Lote de Indexación en Google Indexing API ---');
  console.log(`Service Account: ${clientEmail}`);

  // Cargar propiedades
  const rawData = fs.readFileSync('src/db/properties.json', 'utf8');
  const properties = JSON.parse(rawData);

  const activeProperties = properties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva' && p.slug
  );

  console.log(`Total propiedades en DB: ${properties.length}`);
  console.log(`Propiedades activas a notificar: ${activeProperties.length}`);

  if (activeProperties.length === 0) {
    console.log('No hay propiedades activas para indexar.');
    return;
  }

  console.log('Generando token OAuth2 de Google...');
  const accessToken = await getGoogleIndexingAccessToken(clientEmail, privateKeyPem);
  console.log('Token OAuth2 obtenido con éxito.');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < activeProperties.length; i++) {
    const prop = activeProperties[i];
    const targetUrl = `https://www.inmobiliariamontano.uy/propiedad/${prop.slug}`;
    const progressPrefix = `[${i + 1}/${activeProperties.length}]`;

    try {
      const res = await notifyGoogleIndexing(accessToken, targetUrl, 'URL_UPDATED');

      if (res.ok) {
        successCount++;
        console.log(`${progressPrefix} HTTP ${res.status} OK: ${targetUrl}`);
      } else {
        errorCount++;
        console.error(`${progressPrefix} ERROR HTTP ${res.status}: ${targetUrl} ->`, JSON.stringify(res.body));
      }
    } catch (err) {
      errorCount++;
      console.error(`${progressPrefix} EXCEPCIÓN: ${targetUrl} ->`, err.message);
    }

    // Delay de 250ms entre llamadas para respetar límites de cuota
    if (i < activeProperties.length - 1) {
      await sleep(250);
    }
  }

  console.log('\n================ RESUMEN DE INDEXACIÓN ================');
  console.log(`Total procesadas : ${activeProperties.length}`);
  console.log(`Exitosas (HTTP 200): ${successCount}`);
  console.log(`Fallidas         : ${errorCount}`);
  console.log('========================================================\n');

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Error fatal durante la ejecución:', err);
  process.exit(1);
});
