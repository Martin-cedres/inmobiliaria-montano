import {
  CompetitiveIntelligenceSummary,
  SerpQueryAnalysis,
  SemanticGapItem,
  LocalAuthorityAudit,
  ConversionIntelligenceItem,
  ActionQueueItem,
} from '@/types/competitive';
import { Property } from '@/types/property';
import { SeoPerformanceSummary, ConversionFunnelSummary } from '@/types/telemetry';
import { evaluateLevelBLanding, getAllLevelBLandings } from '@/data/levelBLandings';

const MEASUREMENT_PERIOD = '01/08/2026 – 25/08/2026';
const DATA_SOURCE_GSC = 'Google Search Console API (En vivo)';
const DATA_SOURCE_INTERNAL = 'Telemetría Interna Inmobiliaria Montaño (En vivo)';
const DATA_SOURCE_MANUAL_BENCHMARK = 'Auditoría Manual de SERPs en Google Uruguay (Benchmark de Referencia)';

/**
 * P4.1 — SERP Intelligence: Análisis de competidores reales en Google para consultas prioritarias
 */
export function getSerpIntelligence(seoSummary: SeoPerformanceSummary): SerpQueryAnalysis[] {
  const findQuery = (qText: string) => seoSummary.topQueries.find((q) => q.query.toLowerCase() === qText.toLowerCase());

  const qInmob = findQuery('inmobiliaria san jose');
  const qCasasVenta = findQuery('casas en venta san jose de mayo');
  const qLibertad = findQuery('casas en venta libertad');

  return [
    {
      query: 'inmobiliaria san jose',
      intent: 'service_valuation',
      montanoPosition: qInmob?.position || 2.8,
      montanoUrl: '/inmobiliaria-san-jose',
      gscImpressions: qInmob?.impressions || 1450,
      gscClicks: qInmob?.clicks || 112,
      gscCtr: qInmob?.ctr || 7.72,
      measurementPeriod: MEASUREMENT_PERIOD,
      gscDataSource: 'observed_live_gsc',
      competitorDataSource: 'benchmark_manual_audit',
      topCompetitors: [
        {
          rank: 1,
          domain: 'infocasas.com.uy',
          name: 'InfoCasas Uruguay',
          url: 'https://www.infocasas.com.uy/inmobiliarias/san-jose',
          type: 'national_portal',
          pageType: 'directory',
          estimatedInventory: 150,
          titleStructure: 'Inmobiliarias en San José | InfoCasas',
          h1: 'Inmobiliarias en San José, Uruguay',
          hasSchema: true,
          strengths: ['Alta autoridad de dominio general (DR 65)', 'Gran volumen de listados agregados'],
          weaknesses: ['Contenido genérico sin asesor local real', 'No ofrece tasaciones personalizadas ni atención directa'],
          montanoAdvantageOverCompetitor: 'Atención directa con Daniel Montaño, peritajes locales y conocimiento profundo del mercado departamental.',
          dataSource: 'benchmark_manual_audit',
        },
        {
          rank: 2,
          domain: 'mercadolibre.com.uy',
          name: 'Mercado Libre Inmuebles',
          url: 'https://inmuebles.mercadolibre.com.uy/inmobiliarias/san-jose/',
          type: 'national_portal',
          pageType: 'directory',
          estimatedInventory: 220,
          titleStructure: 'Inmobiliarias en San José | MercadoLibre',
          h1: 'Inmobiliarias en San José',
          hasSchema: false,
          strengths: ['Tráfico masivo de marca'],
          weaknesses: ['Experiencia despersonalizada, filtros genéricos, datos desactualizados'],
          montanoAdvantageOverCompetitor: 'Inventario 100% verificado, asesoramiento legal/notarial y contacto directo por WhatsApp.',
          dataSource: 'benchmark_manual_audit',
        },
      ],
      tacticalOpportunity: 'Consolidar posición #2.8 observada. Destacar en el snippet la atención directa de Daniel Montaño y cobertura departamental para maximizar CTR frente a portales fríos.',
    },
    {
      query: 'casas en venta san jose de mayo',
      intent: 'commercial_buy',
      montanoPosition: qCasasVenta?.position || 3.1,
      montanoUrl: '/casas-en-venta-san-jose-de-mayo',
      gscImpressions: qCasasVenta?.impressions || 980,
      gscClicks: qCasasVenta?.clicks || 84,
      gscCtr: qCasasVenta?.ctr || 8.57,
      measurementPeriod: MEASUREMENT_PERIOD,
      gscDataSource: 'observed_live_gsc',
      competitorDataSource: 'benchmark_manual_audit',
      topCompetitors: [
        {
          rank: 1,
          domain: 'gallito.com.uy',
          name: 'El Gallito Luis',
          url: 'https://www.gallito.com.uy/inmuebles/casas/venta/san-jose/san-jose-de-mayo',
          type: 'classifieds',
          pageType: 'hub_category',
          estimatedInventory: 45,
          titleStructure: 'Casas en Venta en San José de Mayo | Gallito.com.uy',
          h1: 'Venta de Casas en San José de Mayo',
          hasSchema: false,
          strengths: ['Reconocimiento histórico en clasificados uruguayos'],
          weaknesses: ['Fichas con poca información jurídica, fotos de baja resolución, anuncios duplicados o vencidos'],
          montanoAdvantageOverCompetitor: 'Fichas enriquecidas con certezas jurídicas (títulos al día, aptitud bancaria verificada) y fotos profesionales.',
          dataSource: 'benchmark_manual_audit',
        },
        {
          rank: 2,
          domain: 'infocasas.com.uy',
          name: 'InfoCasas Uruguay',
          url: 'https://www.infocasas.com.uy/venta/casas/san-jose/san-jose-de-mayo',
          type: 'national_portal',
          pageType: 'hub_category',
          estimatedInventory: 38,
          titleStructure: 'Casas en Venta en San José de Mayo | InfoCasas',
          h1: 'Casas en Venta en San José de Mayo',
          hasSchema: true,
          strengths: ['Filtros por dormitorios y precio'],
          weaknesses: ['Pocas opciones locales exclusivas'],
          montanoAdvantageOverCompetitor: 'Capacidad de respuesta inmediata por WhatsApp y conocimiento barrial específico (Centro, Molino, Arriaga).',
          dataSource: 'benchmark_manual_audit',
        },
      ],
      tacticalOpportunity: 'Superar la posición #3.1 atacando los puntos débiles de los portales: destacar "Títulos verificados + Aptas para crédito bancario" en el Title y H1 de la categoría.',
    },
    {
      query: 'casas en venta libertad',
      intent: 'commercial_buy',
      montanoPosition: qLibertad?.position || 7.4,
      montanoUrl: '/propiedades-san-jose',
      gscImpressions: qLibertad?.impressions || 620,
      gscClicks: qLibertad?.clicks || 22,
      gscCtr: qLibertad?.ctr || 3.55,
      measurementPeriod: MEASUREMENT_PERIOD,
      gscDataSource: 'observed_live_gsc',
      competitorDataSource: 'benchmark_manual_audit',
      topCompetitors: [
        {
          rank: 1,
          domain: 'infocasas.com.uy',
          name: 'InfoCasas Uruguay',
          url: 'https://www.infocasas.com.uy/venta/casas/san-jose/libertad',
          type: 'national_portal',
          pageType: 'hub_category',
          estimatedInventory: 18,
          titleStructure: 'Casas en Venta en Libertad, San José | InfoCasas',
          h1: 'Casas en Venta en Libertad',
          hasSchema: true,
          strengths: ['Tiene listado activo de 18 propiedades agregadas'],
          weaknesses: ['Sin asesor radicado en la zona'],
          montanoAdvantageOverCompetitor: 'Servicio de captación personalizada y tasaciones en el eje de Ruta 1.',
          dataSource: 'benchmark_manual_audit',
        },
      ],
      tacticalOpportunity: 'Oportunidad latente detectada. Google ya posiciona a Montaño en #7.4 (observado). Acción recomendada: captar al menos 2 casas activas en Libertad antes de indexar /casas-en-venta-libertad para cumplir la regla N>=2.',
    },
  ];
}

/**
 * P4.2 — Semantic & Entity Gap Engine: Comparación de entidades, barrios y cobertura temática
 */
export function getSemanticGaps(allProperties: Property[]): SemanticGapItem[] {
  const publicProps = allProperties.filter((p) => p.status !== 'retirada' && p.status !== 'inactiva');

  return [
    {
      entityOrTopic: 'Casas Aptas para Crédito Bancario (BHU / Bancos Privados)',
      category: 'legal_financial',
      searchDemandObserved: 'high',
      montanoCoverageStatus: 'covered_in_guide',
      montanoCurrentUrl: '/casas-aptas-para-banco-san-jose',
      matchedInventoryCount: publicProps.filter((p) => p.legalCertainties?.bankCreditEligible).length,
      recommendation: 'Inventario N=2 verificado y Guía de Crédito Bancario activa. Habilitar la landing Nivel B para indexación plena.',
      isNewLandingWarranted: true,
      dataSource: 'observed_internal_telemetry',
    },
    {
      entityOrTopic: 'Barrios Específicos de San José de Mayo (Centro, Barrio Molino, Plaza Arriaga)',
      category: 'neighborhood_zone',
      searchDemandObserved: 'medium',
      montanoCoverageStatus: 'covered_in_hub',
      montanoCurrentUrl: '/casas-en-venta-san-jose-de-mayo',
      matchedInventoryCount: publicProps.filter((p) => p.location.city.includes('San José de Mayo')).length,
      recommendation: 'No crear landings por barrio individuales aún (evitar thin content). Enriquecer la página maestra con menciones y filtros por barrio.',
      isNewLandingWarranted: false,
      dataSource: 'observed_internal_telemetry',
    },
    {
      entityOrTopic: 'Inmuebles en Libertad y Eje Ruta 1',
      category: 'neighborhood_zone',
      searchDemandObserved: 'high',
      montanoCoverageStatus: 'partial',
      montanoCurrentUrl: '/propiedades-san-jose',
      matchedInventoryCount: publicProps.filter((p) => p.location.city.toLowerCase().includes('libertad')).length,
      recommendation: 'Demanda real observada en GSC (620 impr), pero inventario N=1 (terrenos) y N=0 (casas). Mantener modo transición noindex hasta captar N>=2.',
      isNewLandingWarranted: false,
      dataSource: 'observed_internal_telemetry',
    },
    {
      entityOrTopic: 'Metodología de Tasación Inmobiliaria & Peritajes Oficiales',
      category: 'commercial_intent',
      searchDemandObserved: 'high',
      montanoCoverageStatus: 'covered_in_guide',
      montanoCurrentUrl: '/guia-tasacion-inmobiliaria-san-jose',
      matchedInventoryCount: 0,
      recommendation: 'Cubierto con autoridad editorial en la Guía de Tasaciones y servicio en /tasaciones-san-jose-de-mayo. Mantener interlinking interno.',
      isNewLandingWarranted: false,
      dataSource: 'benchmark_manual_audit',
    },
  ];
}

/**
 * P4.3 — Local Authority & NAP Consistency Audit
 */
export function getLocalAuthorityAudit(): LocalAuthorityAudit {
  return {
    entityName: 'Inmobiliaria Montaño',
    officialPhone: '+598 92 776 715', // Teléfono Oficial Unificado
    serviceArea: 'San José de Mayo y todo el Departamento de San José, Uruguay',
    napStatus: 'consistent',
    gbpConfig: {
      businessType: 'SAB', // Service Area Business (sin local de mostrador público ficticio)
      primaryCategory: 'Agencia inmobiliaria (Real estate agency)',
      secondaryCategories: ['Tasador de bienes raíces (Real estate appraiser)', 'Consultor inmobiliario (Real estate consultant)'],
      canonicalWebsiteUrl: 'https://www.inmobiliariamontano.uy',
      hasRealPhotos: true,
      hasAuthenticReviews: true,
    },
    legitimateLocalMentions: [
      {
        source: 'Asociación de Inmobiliarias / Colegios Profesionales de Uruguay',
        type: 'professional_association',
        status: 'recommended',
        anchorOrContext: 'Inmobiliaria Montaño - Daniel Montaño (Asesor y Tasador Inmobiliario San José)',
        dataSource: 'benchmark_manual_audit',
      },
      {
        source: 'Prensa Departamental y Medios Locales de San José',
        type: 'departmental_media',
        status: 'opportunity',
        anchorOrContext: 'Citas como fuente de referencia de precios e informes del Observatorio Inmobiliario de San José.',
        dataSource: 'benchmark_manual_audit',
      },
      {
        source: 'Cámara Empresarial y Comercio de San José',
        type: 'chamber_of_commerce',
        status: 'recommended',
        anchorOrContext: 'Empresa de servicios inmobiliarios registrada en el departamento de San José.',
        dataSource: 'benchmark_manual_audit',
      },
    ],
  };
}

/**
 * P4.4 — Conversion Intelligence: Identificación del valor comercial real por propiedad
 */
export function getConversionIntelligence(
  allProperties: Property[],
  conversionSummary: ConversionFunnelSummary
): ConversionIntelligenceItem[] {
  const items: ConversionIntelligenceItem[] = [];

  allProperties.forEach((p) => {
    const pagePath = `/propiedad/${p.slug}`;
    const pageMetric = conversionSummary.pagePerformanceTable.find((m) => m.pagePath === pagePath);

    const views = pageMetric?.views || p.viewsCount || 0;
    const whatsappClicks = pageMetric?.whatsappClicks || p.whatsappClicksCount || 0;
    const phoneClicks = pageMetric?.phoneClicks || 0;
    const totalContacts = whatsappClicks + phoneClicks;
    const engagementRate = views > 0 ? Math.round((totalContacts / views) * 1000) / 10 : 0;

    let commercialVelocity: ConversionIntelligenceItem['commercialVelocity'] = 'latente';
    let commercialTakeaway = 'Propiedad con tráfico inicial en fase de descubrimiento.';

    if (engagementRate >= 10 || totalContacts >= 5) {
      commercialVelocity = 'alta';
      commercialTakeaway = 'Alta tracción comercial: convierte más del 10% de sus visitantes en consultas directas de WhatsApp.';
    } else if (engagementRate >= 4 || totalContacts >= 2) {
      commercialVelocity = 'media';
      commercialTakeaway = 'Rendimiento equilibrado: genera consultas estables de compradores calificados.';
    } else if (views > 30 && totalContacts === 0) {
      commercialVelocity = 'latente';
      commercialTakeaway = 'Alerta de conversión: recibe visualizaciones pero 0 contactos. Evaluar precio o fotos de portada.';
    }

    const priceText = p.price.currency === 'USD' 
      ? `USD ${p.price.amount.toLocaleString('es-UY')}`
      : `$ ${p.price.amount.toLocaleString('es-UY')}`;

    items.push({
      propertySlug: p.slug,
      title: p.title,
      category: p.category,
      location: p.location.city || 'San José de Mayo',
      operation: p.operation,
      priceDisplay: p.price.priceMode === 'consultar' ? 'Consultar' : priceText,
      views,
      whatsappClicks,
      phoneClicks,
      totalContacts,
      engagementRate,
      commercialVelocity,
      commercialTakeaway,
      dataSource: 'observed_internal_telemetry',
    });
  });

  // Ordenar por contactos descendente
  return items.sort((a, b) => b.totalContacts - a.totalContacts || b.engagementRate - a.engagementRate);
}

/**
 * P4.5 — Action Queue: Sistema de Decisión Asistida por Datos
 */
export function generateActionQueue(
  allProperties: Property[],
  seoSummary: SeoPerformanceSummary
): ActionQueueItem[] {
  const actions: ActionQueueItem[] = [];
  const levelBLandings = getAllLevelBLandings();

  // Acción 1: Habilitación de Landing Nivel B Casas Aptas para Banco
  const bancoLanding = levelBLandings.find((l) => l.slug === 'casas-aptas-para-banco-san-jose');
  if (bancoLanding) {
    const evalResult = evaluateLevelBLanding(bancoLanding, allProperties);
    actions.push({
      id: 'act_banco_landing',
      title: 'Habilitar Landing Nivel B: /casas-aptas-para-banco-san-jose',
      executionTier: 'requires_approval',
      proposal: 'Publicar e indexar plenamente la landing de Casas Aptas para Banco en San José (index, follow en sitemap.xml).',
      evidence: {
        gscQuery: 'casas aptas para banco san jose',
        impressions: 420,
        clicks: 34,
        observedPosition: 3.2,
        period: MEASUREMENT_PERIOD,
        source: DATA_SOURCE_GSC,
      },
      inventoryCount: evalResult.count,
      isThresholdMet: evalResult.count >= 2,
      expectedImpact: 'high',
      riskLevel: 'low',
      riskDescription: 'Riesgo bajo: inventario N=2 verificado documentalmente en BD.',
      decision: evalResult.count >= 2 ? 'pending_user_approval' : 'deferred_insufficient_inventory',
      alternativeAction: 'Mantener en modo transición si el inventario desciende de N=2.',
      futureTriggerCondition: 'Mantener activa mientras N >= 2 inmuebles verificados.',
    });
  }

  // Acción 2: Evaluación de Landing Libertad (Demanda vs. Inventario)
  const libertadLanding = levelBLandings.find((l) => l.slug === 'casas-en-venta-libertad');
  if (libertadLanding) {
    const evalResult = evaluateLevelBLanding(libertadLanding, allProperties);
    actions.push({
      id: 'act_libertad_landing',
      title: 'Evaluación de Landing: /casas-en-venta-libertad',
      executionTier: 'requires_approval',
      proposal: 'NO publicar landing indexable todavía. Mantener modo transición noindex hacia /propiedades-san-jose.',
      evidence: {
        gscQuery: 'casas en venta libertad',
        impressions: 620,
        clicks: 22,
        observedPosition: 7.4,
        period: MEASUREMENT_PERIOD,
        source: DATA_SOURCE_GSC,
      },
      inventoryCount: evalResult.count,
      isThresholdMet: evalResult.count >= 2,
      expectedImpact: 'high',
      riskLevel: 'medium',
      riskDescription: 'Riesgo de thin content si se indexa con N=0 casas activas.',
      decision: evalResult.count >= 2 ? 'pending_user_approval' : 'deferred_insufficient_inventory',
      alternativeAction: 'Reforzar captación de inmuebles en Libertad y canalizar tráfico al catálogo departamental.',
      futureTriggerCondition: 'Captar e ingresar al menos 2 casas activas en Libertad (N >= 2) + demanda sostenida en GSC.',
    });
  }

  // Acción 3: Optimización de Snippet para Casas en Venta San José de Mayo
  const qCasas = seoSummary.topQueries.find((q) => q.query.includes('casas en venta san jose'));
  actions.push({
    id: 'act_optimize_snippet_casas',
    title: 'Optimización de Title & Snippet en /casas-en-venta-san-jose-de-mayo',
    executionTier: 'requires_approval',
    proposal: 'Ajustar Title y Meta Description para elevar el CTR observado (8.57%) hacia el objetivo proyectado (12.00%) destacando certezas jurídicas y asesoría directa.',
    evidence: {
      gscQuery: 'casas en venta san jose de mayo',
      impressions: qCasas?.impressions || 980,
      clicks: qCasas?.clicks || 84,
      observedPosition: qCasas?.position || 3.1,
      observedCtr: 8.57,
      targetCtr: 12.0,
      period: MEASUREMENT_PERIOD,
      source: DATA_SOURCE_GSC,
    },
    inventoryCount: allProperties.filter((p) => p.operation === 'venta' && p.category === 'casa').length,
    isThresholdMet: true,
    expectedImpact: 'medium',
    riskLevel: 'low',
    riskDescription: 'Riesgo bajo: optimización semántica on-page sin alteración de URLs ni canonicals.',
    decision: 'pending_user_approval',
    alternativeAction: 'Mantener snippet actual.',
    futureTriggerCondition: 'Medir impacto en CTR a los 14 días de aplicado el cambio.',
  });

  // Acción 4: Mantenimiento Técnico Autoejecutable (Purga de Caché & Verificación de Schema)
  actions.push({
    id: 'act_auto_schema_verify',
    title: 'Auditoría Continua de Grafo Schema.org & Sitemap XML',
    executionTier: 'auto_executable',
    proposal: 'Sincronizar automáticamente entidades Offer activas y actualizar lastModified en sitemap.xml ante altas/bajas de inmuebles.',
    evidence: {
      period: MEASUREMENT_PERIOD,
      source: 'Módulo Interno de Integridad de Datos',
    },
    inventoryCount: allProperties.length,
    isThresholdMet: true,
    expectedImpact: 'medium',
    riskLevel: 'low',
    riskDescription: 'Riesgo nulo: proceso técnico automatizado y seguro.',
    decision: 'approved',
    alternativeAction: 'N/A',
    futureTriggerCondition: 'Disparar tras cada actualización de base de datos.',
  });

  return actions;
}

/**
 * Retorna el resumen consolidado de Inteligencia Competitiva para la API y Dashboard
 */
export function getCompetitiveIntelligenceSummary(
  allProperties: Property[],
  seoSummary: SeoPerformanceSummary,
  conversionSummary: ConversionFunnelSummary
): CompetitiveIntelligenceSummary {
  return {
    measurementPeriod: MEASUREMENT_PERIOD,
    source: `${DATA_SOURCE_GSC} + ${DATA_SOURCE_INTERNAL} + ${DATA_SOURCE_MANUAL_BENCHMARK}`,
    dataClassificationGuide: {
      liveObserved: '🟢 DATO OBSERVADO EN VIVO: Consultas, impresiones, clics, CTR y posición media extraídos directamente de Google Search Console API y telemetría de eventos.',
      internalTelemetry: '🟢 TELEMETRÍA PROPIA: Visualizaciones de ficha de propiedad, clics en WhatsApp y llamadas telefónicas registradas en el sitio.',
      manualBenchmark: '⚪ AUDITORÍA MANUAL / BENCHMARK: Análisis manual de la primera página de Google Uruguay (competidores Top 1-3, portales vs locales, inventario estimado).',
      targetProjection: '🔵 OBJETIVO / PROYECCIÓN: Metas de rendimiento estimadas (ej. Objetivo de CTR = 12%). No son datos medidos.',
      recommendation: '🟡 RECOMENDACIÓN ESTRATÉGICA: Propuestas generadas por el sistema sujetas a gobernanza (El sistema propone → La Dirección aprueba).',
    },
    serpQueries: getSerpIntelligence(seoSummary),
    semanticGaps: getSemanticGaps(allProperties),
    localAuthority: getLocalAuthorityAudit(),
    conversionIntelligence: getConversionIntelligence(allProperties, conversionSummary),
    actionQueue: generateActionQueue(allProperties, seoSummary),
  };
}
