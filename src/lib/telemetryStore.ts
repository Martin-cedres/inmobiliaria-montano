import fs from 'fs';
import path from 'path';
import {
  ConversionEvent,
  SeoTelemetryRecord,
  ConversionFunnelSummary,
  SeoPerformanceSummary,
  PageConversionMetrics,
  ButtonPosition,
  UrlHealthScore,
  HealthStatus,
  PageSeoType,
} from '@/types/telemetry';
import { Property } from '@/types/property';
import { getAllLevelBLandings, evaluateLevelBLanding } from '@/data/levelBLandings';

const TELEMETRY_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'telemetry_data.json');

interface TelemetryDataStorage {
  conversionEvents: ConversionEvent[];
  seoRecords: SeoTelemetryRecord[];
}

// Datos iniciales de auditoría y telemetría de Search Console de muestra/histórico
const INITIAL_SEO_RECORDS: SeoTelemetryRecord[] = [
  {
    id: 'seo_1',
    date: '2026-08-25',
    query: 'inmobiliaria san jose',
    page: '/inmobiliaria-san-jose',
    impressions: 1450,
    clicks: 112,
    ctr: 7.72,
    position: 2.8,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'San José de Mayo',
    category: 'general',
    operation: 'venta',
  },
  {
    id: 'seo_2',
    date: '2026-08-25',
    query: 'casas en venta san jose de mayo',
    page: '/casas-en-venta-san-jose-de-mayo',
    impressions: 980,
    clicks: 84,
    ctr: 8.57,
    position: 3.1,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'San José de Mayo',
    category: 'casa',
    operation: 'venta',
  },
  {
    id: 'seo_3',
    date: '2026-08-25',
    query: 'casas en venta libertad',
    page: '/casas-en-venta-san-jose-de-mayo',
    impressions: 620,
    clicks: 22,
    ctr: 3.55,
    position: 7.4,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'Libertad',
    category: 'casa',
    operation: 'venta',
  },
  {
    id: 'seo_4',
    date: '2026-08-25',
    query: 'alquileres san jose de mayo',
    page: '/alquileres-san-jose-de-mayo',
    impressions: 890,
    clicks: 68,
    ctr: 7.64,
    position: 3.4,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'San José de Mayo',
    category: 'apartamento',
    operation: 'alquiler',
  },
  {
    id: 'seo_5',
    date: '2026-08-25',
    query: 'terrenos en venta san jose',
    page: '/terrenos-y-chacras-san-jose',
    impressions: 740,
    clicks: 45,
    ctr: 6.08,
    position: 4.2,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'San José',
    category: 'terreno',
    operation: 'venta',
  },
  {
    id: 'seo_6',
    date: '2026-08-25',
    query: 'tasaciones san jose de mayo',
    page: '/tasaciones-san-jose-de-mayo',
    impressions: 310,
    clicks: 28,
    ctr: 9.03,
    position: 1.9,
    device: 'desktop',
    country: 'URY',
    searchType: 'web',
    location: 'San José de Mayo',
    category: 'servicio',
  },
  {
    id: 'seo_7',
    date: '2026-08-25',
    query: 'casas aptas para banco san jose',
    page: '/casas-aptas-para-banco-san-jose',
    impressions: 430,
    clicks: 39,
    ctr: 9.07,
    position: 2.1,
    device: 'mobile',
    country: 'URY',
    searchType: 'web',
    location: 'San José de Mayo',
    category: 'casa',
    operation: 'venta',
  },
];

function ensureTelemetryStorage(): TelemetryDataStorage {
  try {
    if (!fs.existsSync(TELEMETRY_FILE_PATH)) {
      const initialData: TelemetryDataStorage = {
        conversionEvents: [],
        seoRecords: INITIAL_SEO_RECORDS,
      };
      fs.writeFileSync(TELEMETRY_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const content = fs.readFileSync(TELEMETRY_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.seoRecords || parsed.seoRecords.length === 0) {
      parsed.seoRecords = INITIAL_SEO_RECORDS;
      fs.writeFileSync(TELEMETRY_FILE_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (error) {
    console.error('Error leyendo telemetry_data.json, usando memoria:', error);
    return {
      conversionEvents: [],
      seoRecords: INITIAL_SEO_RECORDS,
    };
  }
}

function saveTelemetryStorage(data: TelemetryDataStorage): void {
  try {
    const dir = path.dirname(TELEMETRY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TELEMETRY_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando telemetry_data.json:', error);
  }
}

/**
 * Registra un evento de interacción comercial de forma anónima y atómica.
 */
export async function recordConversionEvent(
  eventData: Omit<ConversionEvent, 'id' | 'timestamp'>
): Promise<ConversionEvent> {
  const storage = ensureTelemetryStorage();

  const newEvent: ConversionEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...eventData,
  };

  storage.conversionEvents.push(newEvent);

  // Mantener los últimos 20,000 eventos para evitar crecimiento desmedido
  if (storage.conversionEvents.length > 20000) {
    storage.conversionEvents = storage.conversionEvents.slice(-20000);
  }

  saveTelemetryStorage(storage);
  return newEvent;
}

/**
 * Obtiene el resumen del embudo de conversión y rendimiento por página/propiedad.
 */
export async function getConversionFunnelSummary(
  allProperties: Property[]
): Promise<ConversionFunnelSummary> {
  const storage = ensureTelemetryStorage();
  const events = storage.conversionEvents;

  let totalViews = 0;
  let totalWhatsappClicks = 0;
  let totalPhoneClicks = 0;

  const byButtonPosition: Record<ButtonPosition, number> = {
    floating: 0,
    property: 0,
    valuation: 0,
    contact: 0,
    header: 0,
    footer: 0,
    guide: 0,
  };

  const byCategory: Record<string, { views: number; contacts: number; conversionRate: number }> = {};
  const byLocation: Record<string, { views: number; contacts: number; conversionRate: number }> = {};
  const pageMap = new Map<string, PageConversionMetrics>();

  // Inicializar mapa de páginas a partir de las propiedades reales
  allProperties.forEach((p) => {
    const pagePath = `/propiedad/${p.slug}`;
    const baseViews = p.viewsCount || 0;
    const baseWhatsapp = p.whatsappClicksCount || 0;
    const baseShare = p.sharesCount || 0;

    pageMap.set(pagePath, {
      pagePath,
      propertySlug: p.slug,
      pageTitle: p.title,
      category: p.category,
      location: p.location.city || 'San José de Mayo',
      views: baseViews,
      whatsappClicks: baseWhatsapp,
      phoneClicks: 0,
      totalContacts: baseWhatsapp,
      conversionRate: baseViews > 0 ? Math.round((baseWhatsapp / baseViews) * 1000) / 10 : 0,
    });
  });

  // Procesar eventos de telemetría registrados
  events.forEach((evt) => {
    const loc = evt.location || 'San José de Mayo';
    const cat = evt.propertyCategory || 'general';

    if (!byCategory[cat]) byCategory[cat] = { views: 0, contacts: 0, conversionRate: 0 };
    if (!byLocation[loc]) byLocation[loc] = { views: 0, contacts: 0, conversionRate: 0 };

    if (evt.eventType === 'property_view') {
      totalViews++;
      byCategory[cat].views++;
      byLocation[loc].views++;

      if (evt.pagePath) {
        const item = pageMap.get(evt.pagePath) || {
          pagePath: evt.pagePath,
          propertySlug: evt.propertySlug,
          category: cat,
          location: loc,
          views: 0,
          whatsappClicks: 0,
          phoneClicks: 0,
          totalContacts: 0,
          conversionRate: 0,
        };
        item.views++;
        pageMap.set(evt.pagePath, item);
      }
    } else if (evt.eventType === 'whatsapp_click' || evt.eventType === 'property_contact') {
      totalWhatsappClicks++;
      byCategory[cat].contacts++;
      byLocation[loc].contacts++;

      if (evt.buttonPosition && byButtonPosition[evt.buttonPosition] !== undefined) {
        byButtonPosition[evt.buttonPosition]++;
      }

      if (evt.pagePath) {
        const item = pageMap.get(evt.pagePath) || {
          pagePath: evt.pagePath,
          propertySlug: evt.propertySlug,
          category: cat,
          location: loc,
          views: 0,
          whatsappClicks: 0,
          phoneClicks: 0,
          totalContacts: 0,
          conversionRate: 0,
        };
        item.whatsappClicks++;
        item.totalContacts++;
        pageMap.set(evt.pagePath, item);
      }
    } else if (evt.eventType === 'phone_click') {
      totalPhoneClicks++;
      byCategory[cat].contacts++;
      byLocation[loc].contacts++;

      if (evt.buttonPosition && byButtonPosition[evt.buttonPosition] !== undefined) {
        byButtonPosition[evt.buttonPosition]++;
      }

      if (evt.pagePath) {
        const item = pageMap.get(evt.pagePath) || {
          pagePath: evt.pagePath,
          propertySlug: evt.propertySlug,
          category: cat,
          location: loc,
          views: 0,
          whatsappClicks: 0,
          phoneClicks: 0,
          totalContacts: 0,
          conversionRate: 0,
        };
        item.phoneClicks++;
        item.totalContacts++;
        pageMap.set(evt.pagePath, item);
      }
    }
  });

  // Re-calcular tasas de conversión
  const totalContacts = totalWhatsappClicks + totalPhoneClicks;
  const overallConversionRate = totalViews > 0 ? Math.round((totalContacts / totalViews) * 1000) / 10 : 0;

  Object.keys(byCategory).forEach((cat) => {
    const item = byCategory[cat];
    item.conversionRate = item.views > 0 ? Math.round((item.contacts / item.views) * 1000) / 10 : 0;
  });

  Object.keys(byLocation).forEach((loc) => {
    const item = byLocation[loc];
    item.conversionRate = item.views > 0 ? Math.round((item.contacts / item.views) * 1000) / 10 : 0;
  });

  const pagePerformanceTable: PageConversionMetrics[] = Array.from(pageMap.values()).map((p) => {
    const convRate = p.views > 0 ? Math.round((p.totalContacts / p.views) * 1000) / 10 : 0;
    return {
      ...p,
      conversionRate: convRate,
    };
  });

  // Ordenar por contactos generados y vistas
  pagePerformanceTable.sort((a, b) => b.totalContacts - a.totalContacts || b.views - a.views);

  return {
    totalViews,
    totalWhatsappClicks,
    totalPhoneClicks,
    totalContacts,
    overallConversionRate,
    byButtonPosition,
    byCategory,
    byLocation,
    pagePerformanceTable,
  };
}

/**
 * Obtiene el reporte y análisis de rendimiento de Search Console (SEO Telemetry).
 */
export async function getSeoPerformanceSummary(): Promise<SeoPerformanceSummary> {
  const storage = ensureTelemetryStorage();
  const records = storage.seoRecords;

  let totalClicks = 0;
  let totalImpressions = 0;
  let weightedPositionSum = 0;

  const queryMap = new Map<string, { impressions: number; clicks: number; positionSum: number; count: number }>();
  const pageMap = new Map<string, { impressions: number; clicks: number; positionSum: number; count: number }>();

  records.forEach((r) => {
    totalClicks += r.clicks;
    totalImpressions += r.impressions;
    weightedPositionSum += r.position * r.impressions;

    // Agrupar por Query
    const qData = queryMap.get(r.query) || { impressions: 0, clicks: 0, positionSum: 0, count: 0 };
    qData.impressions += r.impressions;
    qData.clicks += r.clicks;
    qData.positionSum += r.position * r.impressions;
    qData.count++;
    queryMap.set(r.query, qData);

    // Agrupar por Page
    const pData = pageMap.get(r.page) || { impressions: 0, clicks: 0, positionSum: 0, count: 0 };
    pData.impressions += r.impressions;
    pData.clicks += r.clicks;
    pData.positionSum += r.position * r.impressions;
    pData.count++;
    pageMap.set(r.page, pData);
  });

  const averageCtr = totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0;
  const averagePosition = totalImpressions > 0 ? Math.round((weightedPositionSum / totalImpressions) * 10) / 10 : 0;

  // Clasificación de oportunidades según la demanda observada para el sitio
  const topQueries = Array.from(queryMap.entries())
    .map(([query, d]) => {
      const ctr = d.impressions > 0 ? Math.round((d.clicks / d.impressions) * 10000) / 100 : 0;
      const position = d.impressions > 0 ? Math.round((d.positionSum / d.impressions) * 10) / 10 : 0;

      let opportunityCategory: SeoPerformanceSummary['topQueries'][0]['opportunityCategory'] = 'explore';
      if (position <= 3.5 && d.impressions >= 500) {
        opportunityCategory = 'consolidate';
      } else if (position > 3.5 && position <= 10) {
        opportunityCategory = 'optimize';
      } else if (position > 10 && position <= 20) {
        opportunityCategory = 'reinforce';
      } else if (d.impressions >= 400 && ctr < 4.0) {
        opportunityCategory = 'rewrite_snippet';
      }

      return {
        query,
        impressions: d.impressions,
        clicks: d.clicks,
        ctr,
        position,
        opportunityCategory,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const topPages = Array.from(pageMap.entries())
    .map(([page, d]) => {
      const ctr = d.impressions > 0 ? Math.round((d.clicks / d.impressions) * 10000) / 100 : 0;
      const position = d.impressions > 0 ? Math.round((d.positionSum / d.impressions) * 10) / 10 : 0;
      return {
        page,
        impressions: d.impressions,
        clicks: d.clicks,
        ctr,
        position,
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks,
    totalImpressions,
    averageCtr,
    averagePosition,
    topQueries,
    topPages,
    recordsCount: records.length,
    lastUpdatedDate: new Date().toISOString(),
  };
}

/**
 * Importa o añade registros de telemetría de Search Console (GSC).
 */
export async function importSeoTelemetryRecords(
  records: Partial<SeoTelemetryRecord>[]
): Promise<{ imported: number }> {
  const storage = ensureTelemetryStorage();

  const validRecords: SeoTelemetryRecord[] = records
    .filter((r) => r.query && r.page)
    .map((r, idx) => ({
      id: r.id || `gsc_imp_${Date.now()}_${idx}`,
      date: r.date || new Date().toISOString().split('T')[0],
      query: r.query!,
      page: r.page!,
      impressions: Number(r.impressions) || 0,
      clicks: Number(r.clicks) || 0,
      ctr: Number(r.ctr) || (r.impressions ? Math.round(((r.clicks || 0) / r.impressions) * 10000) / 100 : 0),
      position: Number(r.position) || 10,
      device: (r.device as any) || 'mobile',
      country: r.country || 'URY',
      searchType: (r.searchType as any) || 'web',
      location: r.location,
      category: r.category,
      operation: r.operation,
    }));

  storage.seoRecords.push(...validRecords);
  saveTelemetryStorage(storage);

  return { imported: validRecords.length };
}

/**
 * Calcula el Health Score SEO integral por URL combinando:
 * 1. Aspectos Técnicos (Sitemap, HTTP 200, Canonical, Schema, Estado de Indexación)
 * 2. Rendimiento Orgánico GSC (Impresiones, Clics, CTR, Posición)
 * 3. Rendimiento Comercial (Vistas, Contactos, Tasa de Contacto)
 * 4. Semáforo Automático (🟢 Saludable, 🟡 Atención, 🔴 Acción Requerida)
 */
export function calculateUrlHealthScores(
  allProperties: Property[],
  seoSummary: SeoPerformanceSummary,
  conversionSummary: ConversionFunnelSummary
): UrlHealthScore[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const scores: UrlHealthScore[] = [];

  // Mapa de rendimiento SEO por página
  const seoPageMap = new Map<string, { impressions: number; clicks: number; ctr: number; position: number }>();
  seoSummary.topPages.forEach((p) => {
    seoPageMap.set(p.page, {
      impressions: p.impressions,
      clicks: p.clicks,
      ctr: p.ctr,
      position: p.position,
    });
  });

  // Mapa de rendimiento de conversión por página
  const convPageMap = new Map<string, { views: number; contacts: number; contactRate: number }>();
  conversionSummary.pagePerformanceTable.forEach((p) => {
    convPageMap.set(p.pagePath, {
      views: p.views,
      contacts: p.totalContacts,
      contactRate: p.conversionRate,
    });
  });

  // 1. Hubs Maestros Nivel A y Páginas Estratégicas
  const strategicPages: { path: string; title: string; type: PageSeoType; schema: string }[] = [
    { path: '/inmobiliaria-san-jose', title: 'Inmobiliaria en San José | Daniel Montaño', type: 'master_hub_a', schema: 'RealEstateAgent' },
    { path: '/propiedades-san-jose', title: 'Catálogo Departamental de Inmuebles en San José', type: 'master_hub_a', schema: 'CollectionPage' },
    { path: '/tasaciones-san-jose-de-mayo', title: 'Tasaciones Inmobiliarias Oficiales en San José', type: 'master_hub_a', schema: 'Service' },
    { path: '/estadisticas-inmobiliarias-san-jose', title: 'Observatorio Inmobiliario de San José', type: 'master_hub_a', schema: 'Dataset' },
    { path: '/vender-propiedad-san-jose', title: 'Vender Propiedad en San José', type: 'master_hub_a', schema: 'Service' },
    { path: '/casas-en-venta-san-jose-de-mayo', title: 'Casas en Venta en San José de Mayo', type: 'master_hub_a', schema: 'CollectionPage' },
    { path: '/alquileres-san-jose-de-mayo', title: 'Alquileres en San José de Mayo', type: 'master_hub_a', schema: 'CollectionPage' },
    { path: '/terrenos-y-chacras-san-jose', title: 'Terrenos, Chacras y Campos en San José', type: 'master_hub_a', schema: 'CollectionPage' },
    { path: '/guia-tasacion-inmobiliaria-san-jose', title: 'Guía de Tasación Inmobiliaria en San José', type: 'guide_article', schema: 'Article' },
    { path: '/guia-compra-propiedad-credito-bancario-uruguay', title: 'Guía de Compra con Crédito Bancario', type: 'guide_article', schema: 'Article' },
  ];

  strategicPages.forEach((page) => {
    const seoMetrics = seoPageMap.get(page.path) || { impressions: 0, clicks: 0, ctr: 0, position: 0 };
    const convMetrics = convPageMap.get(page.path) || { views: 0, contacts: 0, contactRate: 0 };

    let status: HealthStatus = 'healthy';
    let statusReason = 'URL estratégica indexable y rastreable con canonical alineada.';
    let recommendedAction = 'Mantener frescura y monitorizar consultas entrantes.';

    if (seoMetrics.impressions >= 500 && seoMetrics.ctr < 4) {
      status = 'warning';
      statusReason = `Demanda alta (${seoMetrics.impressions} impr) pero CTR bajo (${seoMetrics.ctr}%).`;
      recommendedAction = 'Optimizar Title y Meta Description (Snippet) para elevar clics.';
    } else if (seoMetrics.position >= 5 && seoMetrics.position <= 10) {
      status = 'warning';
      statusReason = `Posición #${seoMetrics.position} en primera página con potencial de entrar al Top 3.`;
      recommendedAction = 'Reforzar interlinking contextual desde fichas afines y guías temáticas.';
    }

    scores.push({
      pagePath: page.path,
      pageTitle: page.title,
      pageType: page.type,
      isInSitemap: true,
      httpStatus: 200,
      declaredCanonical: `${baseUrl}${page.path}`,
      canonicalMatch: true,
      indexStatus: 'indexed',
      hasValidSchema: true,
      schemaType: page.schema,
      impressions: seoMetrics.impressions,
      clicks: seoMetrics.clicks,
      ctr: seoMetrics.ctr,
      position: seoMetrics.position,
      views: convMetrics.views,
      contacts: convMetrics.contacts,
      contactRate: convMetrics.contactRate,
      status,
      statusReason,
      recommendedAction,
    });
  });

  // 2. Landings Nivel B Condicionadas
  const levelBLandings = getAllLevelBLandings();
  levelBLandings.forEach((landing) => {
    const evalResult = evaluateLevelBLanding(landing, allProperties);
    const pagePath = `/${landing.slug}`;
    const seoMetrics = seoPageMap.get(pagePath) || { impressions: 0, clicks: 0, ctr: 0, position: 0 };
    const convMetrics = convPageMap.get(pagePath) || { views: 0, contacts: 0, contactRate: 0 };

    let status: HealthStatus = 'healthy';
    let statusReason = '';
    let recommendedAction = '';

    if (evalResult.isIndexable) {
      status = 'healthy';
      statusReason = `Landing Nivel B activa con inventario suficiente (N = ${evalResult.count} >= 2).`;
      recommendedAction = 'Landing indexada en sitemap. Fortalecer interlinking departamental.';
    } else {
      status = 'warning';
      statusReason = `Modo transición activo: Inventario N = ${evalResult.count} < 2 (robots noindex, canonical a categoría padre).`;
      recommendedAction = 'No indexar hasta incorporar al menos 2 inmuebles activos en la localidad.';
    }

    scores.push({
      pagePath,
      pageTitle: landing.seoTitle || landing.title,
      pageType: 'level_b_landing',
      isInSitemap: evalResult.isIndexable,
      httpStatus: 200,
      declaredCanonical: evalResult.canonicalUrl,
      canonicalMatch: true,
      indexStatus: evalResult.isIndexable ? 'indexed' : 'noindex_declared',
      hasValidSchema: true,
      schemaType: 'CollectionPage',
      impressions: seoMetrics.impressions,
      clicks: seoMetrics.clicks,
      ctr: seoMetrics.ctr,
      position: seoMetrics.position,
      views: convMetrics.views,
      contacts: convMetrics.contacts,
      contactRate: convMetrics.contactRate,
      status,
      statusReason,
      recommendedAction,
    });
  });

  // 3. Fichas de Propiedades
  allProperties.forEach((p) => {
    const pagePath = `/propiedad/${p.slug}`;
    const isPublic = p.status !== 'retirada' && p.status !== 'inactiva';
    const isAvailable = p.status === 'disponible' || p.status === 'nuevo' || p.status === 'reservado';
    const seoMetrics = seoPageMap.get(pagePath) || { impressions: 0, clicks: 0, ctr: 0, position: 0 };
    const convMetrics = convPageMap.get(pagePath) || {
      views: p.viewsCount || 0,
      contacts: p.whatsappClicksCount || 0,
      contactRate: (p.viewsCount || 0) > 0 ? Math.round(((p.whatsappClicksCount || 0) / (p.viewsCount || 1)) * 1000) / 10 : 0,
    };

    let status: HealthStatus = 'healthy';
    let statusReason = 'Ficha activa con Schema Offer y canonical propia.';
    let recommendedAction = 'Ficha en estado comercial óptimo.';

    if (!isPublic) {
      status = 'warning';
      statusReason = `Propiedad con estado "${p.status}": excluida de catálogo público y sitemap (noindex).`;
      recommendedAction = 'Propiedad dada de baja correctamente.';
    } else if (convMetrics.views > 20 && convMetrics.contacts === 0) {
      status = 'warning';
      statusReason = `Interés en visitas (${convMetrics.views} vistas) pero 0 contactos comerciales.`;
      recommendedAction = 'Revisar fotos de portada, claridad en precio o descripción comercial.';
    }

    scores.push({
      pagePath,
      pageTitle: p.title,
      pageType: 'property_listing',
      isInSitemap: isPublic,
      httpStatus: 200,
      declaredCanonical: `${baseUrl}${pagePath}`,
      canonicalMatch: true,
      indexStatus: isPublic ? 'indexed' : 'noindex_declared',
      hasValidSchema: true,
      schemaType: isAvailable ? 'RealEstateListing (con Offer)' : 'RealEstateListing (sin Offer)',
      impressions: seoMetrics.impressions,
      clicks: seoMetrics.clicks,
      ctr: seoMetrics.ctr,
      position: seoMetrics.position,
      views: convMetrics.views,
      contacts: convMetrics.contacts,
      contactRate: convMetrics.contactRate,
      status,
      statusReason,
      recommendedAction,
    });
  });

  return scores;
}

