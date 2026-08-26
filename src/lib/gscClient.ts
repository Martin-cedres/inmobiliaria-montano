import * as jose from 'jose';
import { SeoTelemetryRecord, SeoPerformanceSummary } from '@/types/telemetry';
import { Property } from '@/types/property';
import { getAllLevelBLandings, evaluateLevelBLanding } from '@/data/levelBLandings';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';

export interface GscSyncResult {
  success: boolean;
  source: 'gsc_api_live' | 'error_not_configured' | 'error_permission_denied' | 'error_api_disabled';
  message: string;
  propertyFound?: string;
  recordsCount?: number;
  records?: SeoTelemetryRecord[];
  startDate?: string;
  endDate?: string;
}

export interface GscPeriodComparison {
  currentPeriod: { startDate: string; endDate: string; totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number };
  previousPeriod: { startDate: string; endDate: string; totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number };
  changes: {
    clicksDiff: number;
    clicksPercentChange: number;
    impressionsDiff: number;
    impressionsPercentChange: number;
    positionImprovement: number;
  };
}

export interface UrlInspectionResult {
  success: boolean;
  inspectionUrl: string;
  coverageState?: string;
  verdict?: 'PASS' | 'NEUTRAL' | 'FAIL';
  indexingStatus?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  error?: string;
}

export interface GscInventoryOpportunity {
  query: string;
  targetLocation: string;
  targetCategory?: string;
  gscImpressions: number;
  gscClicks: number;
  gscPosition: number;
  matchedInventoryCount: number; // N real en BD
  isThresholdMet: boolean; // N >= 2
  landingSlug?: string;
  landingCurrentStatus: 'indexable_published' | 'transition_noindex' | 'not_created';
  recommendedAction: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Genera un Access Token OAuth2 para consultar la API de Google Search Console (Read-Only).
 * Implementa reintentos con exponential backoff.
 */
async function getGscAccessToken(clientEmail: string, privateKeyPem: string, retries = 2): Promise<string> {
  const cleanKey = privateKeyPem.replace(/\\n/g, '\n');
  const privateKey = await jose.importPKCS8(cleanKey, 'RS256');

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
        throw new Error(`Error de autenticación Google: ${data.error_description || data.error || tokenRes.statusText}`);
      }

      return data.access_token;
    } catch (err: any) {
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }

  throw new Error('No se pudo obtener el token de acceso de Google tras reintentos.');
}

/**
 * Obtiene la lista de propiedades autorizadas en Google Search Console para esta Service Account.
 */
export async function getAuthorizedGscSites(): Promise<{
  success: boolean;
  sites: string[];
  error?: string;
}> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return { success: false, sites: [], error: 'Credenciales de Google no configuradas en el servidor.' };
  }

  try {
    const accessToken = await getGscAccessToken(clientEmail, privateKey);
    const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json();
    if (!res.ok) {
      const isApiDisabled = data.error?.message?.includes('has not been used') || data.error?.message?.includes('disabled');
      return {
        success: false,
        sites: [],
        error: isApiDisabled
          ? 'Google Search Console API no está habilitada en el proyecto Google Cloud.'
          : data.error?.message || 'Error consultando propiedades de GSC.',
      };
    }

    const sites = (data.siteEntry || []).map((entry: any) => entry.siteUrl);
    return { success: true, sites };
  } catch (error: any) {
    return { success: false, sites: [], error: error?.message || 'Error de conexión con Google.' };
  }
}

/**
 * Consulta los datos de rendimiento en vivo desde Google Search Console API (searchAnalytics.query).
 */
export async function fetchLiveGscPerformance(days = 28): Promise<GscSyncResult> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  if (!clientEmail || !privateKey) {
    return {
      success: false,
      source: 'error_not_configured',
      message: 'GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY no están configuradas en .env.local.',
    };
  }

  try {
    const accessToken = await getGscAccessToken(clientEmail, privateKey);

    // 1. Obtener lista de propiedades autorizadas
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const sitesData = await sitesRes.json();

    if (!sitesRes.ok) {
      const isApiDisabled = sitesData.error?.message?.includes('disabled') || sitesData.error?.message?.includes('has not been used');
      return {
        success: false,
        source: isApiDisabled ? 'error_api_disabled' : 'error_permission_denied',
        message: sitesData.error?.message || 'Error accediendo a Search Console API.',
      };
    }

    const siteEntries: any[] = sitesData.siteEntry || [];
    const matchedEntry = siteEntries.find(
      (entry) =>
        entry.siteUrl === siteUrl ||
        entry.siteUrl === `${siteUrl}/` ||
        entry.siteUrl === 'sc-domain:inmobiliariamontano.uy'
    );

    if (!matchedEntry) {
      const availableSites = siteEntries.map((e) => e.siteUrl).join(', ') || 'Ninguna';
      return {
        success: false,
        source: 'error_permission_denied',
        message: `La Service Account tiene acceso a: [${availableSites}], pero no cuenta con permisos "Completo" o "Lectura" en la propiedad de Inmobiliaria Montaño (${siteUrl}).`,
      };
    }

    const targetPropertyUrl = encodeURIComponent(matchedEntry.siteUrl);

    // 2. Rango de fechas con corte de 3 días por latencia normal de GSC
    const endDate = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days + 3) * 86400000).toISOString().split('T')[0];

    const queryUrl = `https://www.googleapis.com/webmasters/v3/sites/${targetPropertyUrl}/searchAnalytics/query`;
    const analyticsRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query', 'page', 'device', 'country'],
        rowLimit: 500,
        aggregationType: 'auto',
      }),
    });

    const analyticsData = await analyticsRes.json();
    if (!analyticsRes.ok) {
      return {
        success: false,
        source: 'error_permission_denied',
        message: analyticsData.error?.message || 'Error consultando Search Analytics.',
      };
    }

    const rows: any[] = analyticsData.rows || [];
    const records: SeoTelemetryRecord[] = rows.map((row, idx) => {
      const query = row.keys[0] || '';
      const fullPage = row.keys[1] || '';
      const page = fullPage.replace(siteUrl, '') || '/';
      const device = (row.keys[2] || 'mobile').toLowerCase() as any;
      const country = row.keys[3] || 'URY';

      return {
        id: `gsc_live_${Date.now()}_${idx}`,
        date: endDate,
        query,
        page,
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: Math.round((row.ctr || 0) * 10000) / 100,
        position: Math.round((row.position || 0) * 10) / 10,
        device,
        country,
        searchType: 'web',
      };
    });

    return {
      success: true,
      source: 'gsc_api_live',
      message: `Sincronización exitosa con Google Search Console (${records.length} consultas reales analizadas).`,
      propertyFound: matchedEntry.siteUrl,
      recordsCount: records.length,
      records,
      startDate,
      endDate,
    };
  } catch (error: any) {
    return {
      success: false,
      source: 'error_permission_denied',
      message: error?.message || 'Error inesperado al conectar con Search Console.',
    };
  }
}

/**
 * Inspecciona el estado de indexación real de una URL mediante Google URL Inspection API.
 */
export async function inspectUrlIndexStatus(targetUrl: string): Promise<UrlInspectionResult> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  if (!clientEmail || !privateKey) {
    return { success: false, inspectionUrl: targetUrl, error: 'Credenciales no configuradas.' };
  }

  const fullInspectionUrl = targetUrl.startsWith('http') ? targetUrl : `${siteUrl}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;

  try {
    const accessToken = await getGscAccessToken(clientEmail, privateKey);

    const inspectEndpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
    const res = await fetch(inspectEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: fullInspectionUrl,
        siteUrl: `${siteUrl}/`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        inspectionUrl: fullInspectionUrl,
        error: data.error?.message || 'Error consultando URL Inspection API.',
      };
    }

    const result = data.inspectionResult?.indexStatusResult || {};

    return {
      success: true,
      inspectionUrl: fullInspectionUrl,
      verdict: result.verdict || 'NEUTRAL',
      coverageState: result.coverageState || 'No disponible',
      indexingStatus: result.indexingState || 'No disponible',
      lastCrawlTime: result.lastCrawlTime,
      googleCanonical: result.googleCanonical,
      userCanonical: result.userCanonical,
      robotsTxtState: result.robotsTxtState,
      pageFetchState: result.pageFetchState,
    };
  } catch (error: any) {
    return { success: false, inspectionUrl: fullInspectionUrl, error: error?.message || 'Error de conexión.' };
  }
}

/**
 * Cruza las consultas reales de Search Console con el inventario real de propiedades y la regla N >= 2.
 * Genera propuestas fundamentadas para activar o no landings Nivel B sin caer en thin content.
 */
export function crossReferenceGscWithInventory(
  seoSummary: SeoPerformanceSummary,
  allProperties: Property[]
): GscInventoryOpportunity[] {
  const publicProps = allProperties.filter((p) => p.status !== 'retirada' && p.status !== 'inactiva');
  const levelBLandings = getAllLevelBLandings();
  const opportunities: GscInventoryOpportunity[] = [];

  const locations = SAN_JOSE_LOCATIONS;

  seoSummary.topQueries.forEach((q) => {
    const queryLower = q.query.toLowerCase();

    // Detectar localidad mencionada en la búsqueda
    const matchedLoc = locations.find((loc) => queryLower.includes(loc.slug) || queryLower.includes(loc.name.toLowerCase()) || queryLower.includes(loc.shortName.toLowerCase()));

    if (!matchedLoc) return;

    // Detectar categoría mencionada
    let detectedCategory: string | undefined;
    if (queryLower.includes('casa') || queryLower.includes('casas')) detectedCategory = 'casa';
    else if (queryLower.includes('terreno') || queryLower.includes('terrenos') || queryLower.includes('solar')) detectedCategory = 'terreno';
    else if (queryLower.includes('alquiler') || queryLower.includes('alquileres')) detectedCategory = 'alquiler';
    else if (queryLower.includes('chacra') || queryLower.includes('campo')) detectedCategory = 'chacra';

    // Contar inventario real coincidente en esa localidad
    const matchedProps = publicProps.filter((p) => {
      const city = (p.location.city || '').toLowerCase();
      const hood = (p.location.neighborhood || '').toLowerCase();
      const target = matchedLoc.name.toLowerCase();

      const matchesLocation = city.includes(target) || target.includes(city) || hood.includes(target);
      if (!matchesLocation) return false;

      if (detectedCategory === 'casa') return p.category === 'casa';
      if (detectedCategory === 'terreno') return p.category === 'terreno' || p.category === 'chacra';
      if (detectedCategory === 'alquiler') return p.operation === 'alquiler';
      return true;
    });

    const matchedCount = matchedProps.length;
    const isThresholdMet = matchedCount >= 2;

    // Verificar si ya existe una Landing Nivel B para esta combinación
    const existingLanding = levelBLandings.find((l) => {
      const cityMatch = l.targetCity?.toLowerCase() === matchedLoc.name.toLowerCase() || l.targetCity?.toLowerCase() === matchedLoc.slug;
      const catMatch = !detectedCategory || l.targetCategory === detectedCategory;
      return cityMatch && catMatch;
    });

    let landingCurrentStatus: GscInventoryOpportunity['landingCurrentStatus'] = 'not_created';
    if (existingLanding) {
      const evalResult = evaluateLevelBLanding(existingLanding, allProperties);
      landingCurrentStatus = evalResult.isIndexable ? 'indexable_published' : 'transition_noindex';
    }

    let recommendedAction = '';
    let priority: GscInventoryOpportunity['priority'] = 'low';

    if (isThresholdMet && existingLanding && landingCurrentStatus === 'indexable_published') {
      recommendedAction = `Demanda activa (${q.impressions} impr) y N=${matchedCount}. Consolidar landing activa /${existingLanding.slug}.`;
      priority = 'high';
    } else if (isThresholdMet && existingLanding && landingCurrentStatus === 'transition_noindex') {
      recommendedAction = `¡Umbral superado (N=${matchedCount})! Habilitar landing /${existingLanding.slug} para indexación plena (pasar de noindex a index).`;
      priority = 'high';
    } else if (isThresholdMet && !existingLanding) {
      recommendedAction = `Oportunidad de Nueva Landing: Demanda observada (${q.impressions} impr) + Inventario suficiente (N=${matchedCount}). Proponer diseño de Landing Nivel B.`;
      priority = 'high';
    } else {
      recommendedAction = `Demanda observada (${q.impressions} impr) pero inventario insuficiente (N=${matchedCount} < 2). Mantener enrutado al catálogo general para evitar thin content.`;
      priority = q.impressions >= 500 ? 'medium' : 'low';
    }

    opportunities.push({
      query: q.query,
      targetLocation: matchedLoc.name,
      targetCategory: detectedCategory,
      gscImpressions: q.impressions,
      gscClicks: q.clicks,
      gscPosition: q.position,
      matchedInventoryCount: matchedCount,
      isThresholdMet,
      landingSlug: existingLanding?.slug,
      landingCurrentStatus,
      recommendedAction,
      priority,
    });
  });

  return opportunities;
}
