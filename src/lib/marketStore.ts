import fs from 'fs/promises';
import path from 'path';
import {
  MarketListing,
  MarketListingStatus,
  MarketKpis,
  PriceDropOpportunity,
  WeeklyExecutiveReportData,
  MarketSnapshot,
} from '@/types/market';
import { getDbClient } from './db';

const LOCAL_MARKET_LISTINGS_PATH = path.join(process.cwd(), 'src', 'db', 'market_listings.json');
const LOCAL_MARKET_SNAPSHOTS_PATH = path.join(process.cwd(), 'src', 'db', 'market_snapshots.json');

let memoryListings: MarketListing[] | null = null;
let memorySnapshots: MarketSnapshot[] | null = null;
let tablesInitialized = false;

// Fallback seed data representativo de San José de Mayo
const INITIAL_MARKET_LISTINGS: MarketListing[] = [
  {
    id: 'mkt-001',
    title: 'Casa amplia 3 dormitorios con patio y garage',
    operation: 'venta',
    category: 'casa',
    neighborhood: 'Centro',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 98000,
    priceCurrency: 'USD',
    origin: 'dueno_directo',
    sourceName: 'Gallito Luis',
    sourceUrl: 'https://www.gallito.com.uy',
    detectedAt: '2026-10-15T14:30:00Z',
    daysOnMarket: 4,
    status: 'detectado',
    contactName: 'Carlos Mendiondo',
    contactPhone: '099 123 456',
    builtAreaM2: 125,
    plotAreaM2: 240,
    bedrooms: 3,
    bathrooms: 1,
    estimatedPricePerM2: 784,
    priceHistory: [
      {
        date: '2026-10-15',
        priceAmount: 98000,
        priceCurrency: 'USD',
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Dueño directo publicado hace 4 días en zona Centro sin cartel. Potencial captación exclusiva.',
    internalNotes: 'Aviso detectado en Gallito. Ubicada a 2 cuadras de Plaza Treinta y Tres.',
    updatedAt: '2026-10-15T14:30:00Z',
  },
  {
    id: 'mkt-002',
    title: 'Propiedad padrón único a reciclar en Barrio Molino',
    operation: 'venta',
    category: 'casa',
    neighborhood: 'Barrio Molino',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 52000,
    priceCurrency: 'USD',
    origin: 'dueno_directo',
    sourceName: 'Mercado Libre',
    sourceUrl: 'https://inmuebles.mercadolibre.com.uy',
    detectedAt: '2026-10-14T09:15:00Z',
    daysOnMarket: 5,
    status: 'en_analisis',
    contactName: 'Lucía Alvez',
    contactPhone: '098 876 543',
    builtAreaM2: 85,
    plotAreaM2: 310,
    bedrooms: 2,
    bathrooms: 1,
    estimatedPricePerM2: 611,
    priceHistory: [
      {
        date: '2026-10-14',
        priceAmount: 52000,
        priceCurrency: 'USD',
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Padrón único de 310 m2 con fondo verde. Excelente para reforma o desarrollo PH.',
    internalNotes: 'Se solicitó informe catastral. Títulos en sucesión en trámite.',
    updatedAt: '2026-10-14T09:15:00Z',
  },
  {
    id: 'mkt-003',
    title: 'Residencia señorial en Plaza Artigas',
    operation: 'venta',
    category: 'casa',
    neighborhood: 'Centro',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 145000,
    priceCurrency: 'USD',
    origin: 'inmobiliaria_competencia',
    competitorName: 'Inmobiliaria del Centro',
    sourceName: 'InfoCasas',
    sourceUrl: 'https://www.infocasas.com.uy',
    detectedAt: '2026-08-01T10:00:00Z',
    daysOnMarket: 78,
    status: 'contactado',
    builtAreaM2: 190,
    plotAreaM2: 380,
    bedrooms: 4,
    bathrooms: 2,
    estimatedPricePerM2: 763,
    priceHistory: [
      {
        date: '2026-08-01',
        priceAmount: 175000,
        priceCurrency: 'USD',
      },
      {
        date: '2026-09-10',
        priceAmount: 160000,
        priceCurrency: 'USD',
        dropPercentage: -8.57,
      },
      {
        date: '2026-10-12',
        priceAmount: 145000,
        priceCurrency: 'USD',
        dropPercentage: -9.38,
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Reducción total acumulada de -17.1% (USD 30.000 menos). Vendedor frustrado por inacción de la inmobiliaria.',
    internalNotes: 'Contacto inicial realizado con el propietario vía referencia de cliente anterior.',
    updatedAt: '2026-10-12T16:00:00Z',
  },
  {
    id: 'mkt-004',
    title: 'Chacra 3 hectáreas sobre Ruta 3 km 92',
    operation: 'venta',
    category: 'chacra',
    neighborhood: 'Eje Rutas / Libertad',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 78000,
    priceCurrency: 'USD',
    origin: 'inmobiliaria_competencia',
    competitorName: 'Campos del Sur Propiedades',
    sourceName: 'Mercado Libre',
    sourceUrl: 'https://inmuebles.mercadolibre.com.uy',
    detectedAt: '2026-07-20T11:00:00Z',
    daysOnMarket: 90,
    status: 'detectado',
    builtAreaM2: 70,
    plotAreaM2: 30000,
    bedrooms: 1,
    bathrooms: 1,
    priceHistory: [
      {
        date: '2026-07-20',
        priceAmount: 95000,
        priceCurrency: 'USD',
      },
      {
        date: '2026-10-08',
        priceAmount: 78000,
        priceCurrency: 'USD',
        dropPercentage: -17.89,
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Rebaja brusca de USD 17.000 (-17.9%). Excelente conectividad sobre Ruta 3 con pozo de agua.',
    internalNotes: 'Monitorear si el propietario cancela contrato de publicación con la agencia actual.',
    updatedAt: '2026-10-08T18:00:00Z',
  },
  {
    id: 'mkt-005',
    title: 'Apartamento 2 dormitorios con balcón céntrico',
    operation: 'alquiler',
    category: 'apartamento',
    neighborhood: 'Centro',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 15500,
    priceCurrency: 'UYU',
    origin: 'dueno_directo',
    sourceName: 'Gallito Luis',
    sourceUrl: 'https://www.gallito.com.uy',
    detectedAt: '2026-10-16T11:30:00Z',
    daysOnMarket: 3,
    status: 'reunion_agendada',
    contactName: 'Beatriz Hornos',
    contactPhone: '091 234 567',
    builtAreaM2: 56,
    plotAreaM2: 56,
    bedrooms: 2,
    bathrooms: 1,
    priceHistory: [
      {
        date: '2026-10-16',
        priceAmount: 15500,
        priceCurrency: 'UYU',
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Propietaria busca administración garantizada con aseguradoras (Porto / ANDA).',
    internalNotes: 'Reunión coordinada para el martes en la mañana para firma de autorización.',
    updatedAt: '2026-10-16T12:00:00Z',
  },
  {
    id: 'mkt-006',
    title: 'Solar residencial en Parquización Arroyo Mallada',
    operation: 'venta',
    category: 'terreno',
    neighborhood: 'Parquización Arroyo Mallada',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 26000,
    priceCurrency: 'USD',
    origin: 'dueno_directo',
    sourceName: 'Cartel en Vía Pública',
    detectedAt: '2026-10-13T17:00:00Z',
    daysOnMarket: 6,
    status: 'contactado',
    contactName: 'Enrique Silva',
    contactPhone: '094 555 888',
    plotAreaM2: 450,
    estimatedPricePerM2: 57.78,
    priceHistory: [
      {
        date: '2026-10-13',
        priceAmount: 26000,
        priceCurrency: 'USD',
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Terreno nivelado sobre calle asfaltada con OSE y UTE en puerta.',
    internalNotes: 'Se le presentó propuesta de difusión en el catálogo web y cartel profesional Montaño.',
    updatedAt: '2026-10-13T17:00:00Z',
  },
  {
    id: 'mkt-007',
    title: 'Casa 2 dormitorios cerca de Hospital San José',
    operation: 'venta',
    category: 'casa',
    neighborhood: 'Barrio Arriaga',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 68000,
    priceCurrency: 'USD',
    origin: 'inmobiliaria_competencia',
    competitorName: 'Maragata Propiedades',
    sourceName: 'InfoCasas',
    sourceUrl: 'https://www.infocasas.com.uy',
    detectedAt: '2026-09-01T12:00:00Z',
    daysOnMarket: 48,
    status: 'detectado',
    builtAreaM2: 75,
    plotAreaM2: 210,
    bedrooms: 2,
    bathrooms: 1,
    estimatedPricePerM2: 906,
    priceHistory: [
      {
        date: '2026-09-01',
        priceAmount: 76000,
        priceCurrency: 'USD',
      },
      {
        date: '2026-10-10',
        priceAmount: 68000,
        priceCurrency: 'USD',
        dropPercentage: -10.53,
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Rebaja de USD 8.000 (-10.5%). Entorno con alta demanda para alquiler de personal de salud.',
    internalNotes: 'Revisar aptitud bancaria en catastro.',
    updatedAt: '2026-10-10T14:00:00Z',
  },
  {
    id: 'mkt-008',
    title: 'Local comercial en zona bancaria peatonal',
    operation: 'alquiler',
    category: 'local',
    neighborhood: 'Centro',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 28000,
    priceCurrency: 'UYU',
    origin: 'inmobiliaria_competencia',
    competitorName: 'Inmobiliaria San José',
    sourceName: 'InfoCasas',
    detectedAt: '2026-08-15T15:00:00Z',
    daysOnMarket: 64,
    status: 'en_analisis',
    builtAreaM2: 95,
    bathrooms: 2,
    priceHistory: [
      {
        date: '2026-08-15',
        priceAmount: 34000,
        priceCurrency: 'UYU',
      },
      {
        date: '2026-10-05',
        priceAmount: 28000,
        priceCurrency: 'UYU',
        dropPercentage: -17.65,
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Rebaja de $ 6.000 mensual (-17.6%). Local desocupado que genera costos fijos al propietario.',
    internalNotes: 'Contacto con el propietario previsto para la próxima semana.',
    updatedAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'mkt-009',
    title: 'Casa a estrenar apta crédito hipotecario',
    operation: 'venta',
    category: 'casa',
    neighborhood: 'Parquización Arroyo Mallada',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 92000,
    priceCurrency: 'USD',
    origin: 'dueno_directo',
    sourceName: 'Mercado Libre',
    sourceUrl: 'https://inmuebles.mercadolibre.com.uy',
    detectedAt: '2026-10-17T08:00:00Z',
    daysOnMarket: 2,
    status: 'detectado',
    contactName: 'Arq. Martín Rostagnol',
    contactPhone: '092 111 222',
    builtAreaM2: 78,
    plotAreaM2: 300,
    bedrooms: 2,
    bathrooms: 1,
    estimatedPricePerM2: 1179,
    priceHistory: [
      {
        date: '2026-10-17',
        priceAmount: 92000,
        priceCurrency: 'USD',
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Constructor particular con planos y BPS al día. Apto crédito bancario inmediato.',
    internalNotes: 'Oportunidad de incorporar al catálogo de casas financiables con BHU.',
    updatedAt: '2026-10-17T08:00:00Z',
  },
  {
    id: 'mkt-010',
    title: 'Fracción de campo 5 Ha con costa sobre arroyo',
    operation: 'venta',
    category: 'chacra',
    neighborhood: 'Eje Rutas / Libertad',
    city: 'San José de Mayo',
    department: 'San José',
    priceAmount: 115000,
    priceCurrency: 'USD',
    origin: 'inmobiliaria_competencia',
    competitorName: 'Inmobiliaria del Interior',
    sourceName: 'Mercado Libre',
    detectedAt: '2026-06-10T10:00:00Z',
    daysOnMarket: 130,
    status: 'detectado',
    plotAreaM2: 50000,
    priceHistory: [
      {
        date: '2026-06-10',
        priceAmount: 138000,
        priceCurrency: 'USD',
      },
      {
        date: '2026-10-11',
        priceAmount: 115000,
        priceCurrency: 'USD',
        dropPercentage: -16.67,
      },
    ],
    isOpportunity: true,
    opportunityReason: 'Reducción de USD 23.000 (-16.7%). Más de 4 meses sin cerrar operación.',
    internalNotes: 'Propiedad con potencial turístico o de descanso.',
    updatedAt: '2026-10-11T12:00:00Z',
  },
];

const INITIAL_MARKET_SNAPSHOTS: MarketSnapshot[] = [
  {
    id: 'snap-2026-w42',
    snapshotDate: '2026-10-18',
    weekNumber: 42,
    year: 2026,
    totalStock: 348,
    montanoStock: 64,
    montanoSharePercentage: 18.4,
    directOwnerStock: 9,
    competitorStock: 275,
    newEntries7d: 14,
    priceDrops7d: 7,
    avgPriceM2UsdSale: 815,
    avgPriceRentUyu: 16800,
    zoneDistribution: {
      'Centro': 142,
      'Barrio Molino': 68,
      'Barrio Arriaga': 54,
      'Parquización Arroyo Mallada': 38,
      'Eje Rutas / Libertad': 46,
    },
    categoryDistribution: {
      'casa': 214,
      'apartamento': 62,
      'terreno': 44,
      'chacra': 18,
      'local': 10,
    },
    notes: 'Monitoreo semanal semana 42. Crecimiento sostenido en cuota de mercado de Inmobiliaria Montaño.',
    createdAt: '2026-10-18T20:00:00Z',
  },
  {
    id: 'snap-2026-w41',
    snapshotDate: '2026-10-11',
    weekNumber: 41,
    year: 2026,
    totalStock: 342,
    montanoStock: 62,
    montanoSharePercentage: 18.1,
    directOwnerStock: 11,
    competitorStock: 269,
    newEntries7d: 12,
    priceDrops7d: 5,
    avgPriceM2UsdSale: 820,
    avgPriceRentUyu: 16500,
    zoneDistribution: {
      'Centro': 140,
      'Barrio Molino': 66,
      'Barrio Arriaga': 53,
      'Parquización Arroyo Mallada': 37,
      'Eje Rutas / Libertad': 46,
    },
    categoryDistribution: {
      'casa': 210,
      'apartamento': 60,
      'terreno': 45,
      'chacra': 17,
      'local': 10,
    },
    notes: 'Monitoreo semanal semana 41.',
    createdAt: '2026-10-11T20:00:00Z',
  },
];

async function ensureMarketTablesExist(sql: ReturnType<typeof getDbClient>) {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS market_listings (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        operation VARCHAR(32) NOT NULL,
        category VARCHAR(32) NOT NULL,
        neighborhood VARCHAR(64) NOT NULL,
        city VARCHAR(64) NOT NULL DEFAULT 'San José de Mayo',
        department VARCHAR(64) NOT NULL DEFAULT 'San José',
        price_amount NUMERIC(12, 2) NOT NULL,
        price_currency VARCHAR(8) NOT NULL DEFAULT 'USD',
        origin VARCHAR(32) NOT NULL,
        competitor_name VARCHAR(128),
        source_name VARCHAR(64) NOT NULL,
        source_url TEXT,
        detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        days_on_market INT DEFAULT 1,
        status VARCHAR(32) NOT NULL DEFAULT 'detectado',
        internal_notes TEXT,
        contact_name VARCHAR(128),
        contact_phone VARCHAR(64),
        built_area_m2 NUMERIC(10, 2),
        plot_area_m2 NUMERIC(10, 2),
        bedrooms INT,
        bathrooms INT,
        estimated_price_per_m2 NUMERIC(10, 2),
        price_history JSONB DEFAULT '[]'::jsonb,
        is_opportunity BOOLEAN DEFAULT FALSE,
        opportunity_reason TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS market_snapshots (
        id VARCHAR(64) PRIMARY KEY,
        snapshot_date DATE NOT NULL,
        week_number INT NOT NULL,
        year INT NOT NULL,
        total_stock INT NOT NULL,
        montano_stock INT NOT NULL,
        montano_share_percentage NUMERIC(5, 2) NOT NULL,
        direct_owner_stock INT NOT NULL,
        competitor_stock INT NOT NULL,
        new_entries_7d INT NOT NULL,
        price_drops_7d INT NOT NULL,
        avg_price_m2_usd_sale NUMERIC(10, 2),
        avg_price_rent_uyu NUMERIC(10, 2),
        zone_distribution JSONB DEFAULT '{}'::jsonb,
        category_distribution JSONB DEFAULT '{}'::jsonb,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    tablesInitialized = true;
  } catch (err) {
    console.warn('Error al verificar tablas de inteligencia de mercado en Postgres:', err);
  }
}

/**
 * Obtiene todos los avisos de inteligencia de mercado desde Neon Postgres o fallback JSON
 */
export async function getAllMarketListings(): Promise<MarketListing[]> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureMarketTablesExist(sql);
      const rows = await sql`SELECT * FROM market_listings ORDER BY detected_at DESC;`;
      if (rows && rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          title: String(r.title),
          operation: r.operation as MarketListing['operation'],
          category: r.category as MarketListing['category'],
          neighborhood: String(r.neighborhood),
          city: String(r.city || 'San José de Mayo'),
          department: String(r.department || 'San José'),
          priceAmount: Number(r.price_amount),
          priceCurrency: r.price_currency as 'USD' | 'UYU',
          origin: r.origin as MarketListing['origin'],
          competitorName: r.competitor_name ? String(r.competitor_name) : undefined,
          sourceName: String(r.source_name),
          sourceUrl: r.source_url ? String(r.source_url) : undefined,
          detectedAt: String(r.detected_at),
          daysOnMarket: Number(r.days_on_market || 1),
          status: r.status as MarketListingStatus,
          internalNotes: r.internal_notes ? String(r.internal_notes) : undefined,
          contactName: r.contact_name ? String(r.contact_name) : undefined,
          contactPhone: r.contact_phone ? String(r.contact_phone) : undefined,
          builtAreaM2: r.built_area_m2 ? Number(r.built_area_m2) : undefined,
          plotAreaM2: r.plot_area_m2 ? Number(r.plot_area_m2) : undefined,
          bedrooms: r.bedrooms ? Number(r.bedrooms) : undefined,
          bathrooms: r.bathrooms ? Number(r.bathrooms) : undefined,
          estimatedPricePerM2: r.estimated_price_per_m2 ? Number(r.estimated_price_per_m2) : undefined,
          priceHistory: Array.isArray(r.price_history) ? (r.price_history as MarketListing['priceHistory']) : [],
          isOpportunity: Boolean(r.is_opportunity),
          opportunityReason: r.opportunity_reason ? String(r.opportunity_reason) : undefined,
          updatedAt: String(r.updated_at || r.detected_at),
        }));
      }
    } catch (dbErr) {
      console.warn('Error consultando market_listings en Neon Postgres, usando fallback local:', dbErr);
    }
  }

  try {
    const content = await fs.readFile(LOCAL_MARKET_LISTINGS_PATH, 'utf-8');
    const parsed: MarketListing[] = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryListings = parsed;
      return parsed;
    }
  } catch {
    // Archivo no existe o vacío, inicializar con INITIAL_MARKET_LISTINGS
  }

  if (memoryListings && memoryListings.length > 0) {
    return memoryListings;
  }

  memoryListings = INITIAL_MARKET_LISTINGS;
  try {
    await fs.writeFile(LOCAL_MARKET_LISTINGS_PATH, JSON.stringify(INITIAL_MARKET_LISTINGS, null, 2), 'utf-8');
  } catch (err) {
    console.warn('No se pudo guardar market_listings.json localmente:', err);
  }

  return memoryListings;
}

/**
 * Obtiene los KPIs consolidados del mercado departamental
 */
export async function getMarketKpis(): Promise<MarketKpis> {
  // KPIs originales de referencia para el mercado de San José de Mayo
  return {
    totalStock: 348,
    montanoStock: 64,
    montanoSharePercentage: 18.4,
    newEntriesLast7Days: 14,
    ownerAlertsCount: 9,
    priceDropsCount: 7,
    competitorStock: 275,
  };
}

/**
 * Obtiene las oportunidades de rebaja de precio de competidores
 */
export async function getPriceDropOpportunities(): Promise<PriceDropOpportunity[]> {
  const listings = await getAllMarketListings();

  let dropListings = listings.filter((l) => l.priceHistory && l.priceHistory.length >= 2);
  if (dropListings.length === 0) {
    dropListings = listings.filter((l) => l.isOpportunity || l.origin === 'dueno_directo');
  }

  const opportunities: PriceDropOpportunity[] = dropListings.map((l) => {
    const history = l.priceHistory;
    const initial = history && history.length > 0 ? history[0] : { priceAmount: l.priceAmount, date: l.detectedAt.split('T')[0] };
    const latest = history && history.length > 0 ? history[history.length - 1] : { priceAmount: l.priceAmount, date: l.detectedAt.split('T')[0] };
    const dropPercentage = initial.priceAmount > 0 && latest.priceAmount < initial.priceAmount
      ? Math.round(((latest.priceAmount - initial.priceAmount) / initial.priceAmount) * 1000) / 10
      : (l.origin === 'dueno_directo' ? 0 : -5.0);

    let diagnosis = 'Sobreprecio inicial corregido tras estancamiento prolongado en portales.';
    if (dropPercentage <= -15) {
      diagnosis = 'Reducción agresiva de precio: el propietario muestra urgencia de liquidez y baja efectividad de la agencia actual.';
    } else if (dropPercentage <= -8) {
      diagnosis = 'Ajuste táctico por falta de consultas directas en las primeras 4 a 6 semanas de publicación.';
    }

    const negotiationPitch = l.origin === 'inmobiliaria_competencia'
      ? `Proponer al propietario autorización de gestión en Inmobiliaria Montaño con peritaje fundamentado de valor. Argumentar que la propiedad lleva ${l.daysOnMarket} días con visibilidad pasiva y rebaja de ${Math.abs(dropPercentage)}% sin concretar cierre.`
      : `Contactar directamente a ${l.contactName || 'propietario'} para ofrecer asesoramiento pericial gratuito, difusión en el Observatorio Inmobiliario y gestión de compradores bancarios calificados.`;

    return {
      id: `drop-${l.id}`,
      listingId: l.id,
      title: l.title,
      neighborhood: l.neighborhood,
      category: l.category,
      operation: l.operation,
      previousPrice: initial.priceAmount,
      currentPrice: latest.priceAmount,
      currency: l.priceCurrency,
      dropPercentage,
      dropDate: latest.date,
      daysSinceDrop: 5,
      totalDaysOnMarket: l.daysOnMarket,
      sourceName: l.sourceName,
      sourceUrl: l.sourceUrl,
      origin: l.origin,
      competitorOrOwner: l.origin === 'inmobiliaria_competencia' ? (l.competitorName || 'Agencia local') : (l.contactName || 'Dueño Particular'),
      diagnosis,
      negotiationPitch,
      ownerPhone: l.contactPhone,
    };
  });

  return opportunities.sort((a, b) => a.dropPercentage - b.dropPercentage);
}

/**
 * Obtiene los reportes ejecutivos semanales
 */
export async function getWeeklyExecutiveReports(): Promise<WeeklyExecutiveReportData[]> {
  return [
    {
      weekIdentifier: 'Semana 42 — Octubre 2026',
      period: '12/10/2026 – 18/10/2026',
      totalActiveStock: 348,
      montanoStock: 64,
      montanoSharePercentage: 18.4,
      newCapturesTotal: 14,
      priceDropCount: 7,
      directOwnerAlerts: 9,
      topOpportunity: {
        title: 'Residencia señorial en Plaza Artigas',
        neighborhood: 'Centro',
        previousPrice: 'USD 175.000',
        currentPrice: 'USD 145.000',
        dropPercentage: -17.1,
        diagnosis: 'Reducción de USD 30.000 acumulada. Vendedor frustrado por 78 días sin visitas calificadas.',
        actionPlan: 'Contactar al propietario con dossier de compradores calificados de Inmobiliaria Montaño.',
      },
      strategicSummary: 'Consolidación de cuota departamental en 18.4%. Se detectó un incremento de carteles "Dueño Vende" en Barrio Molino y Barrio Arriaga. La demanda compradora sigue priorizando casas de 2 a 3 dormitorios con aptitud bancaria verificada en el rango de USD 85.000 a USD 98.000.',
      bulletPoints: [
        'Stock total departamental creció a 348 avisos activos en los 3 portales principales.',
        'Inmobiliaria Montaño mantiene liderazgo en propiedades con títulos al día y aptas para banco (64 inmuebles activos).',
        'Se registraron 7 rebajas de precios en competidores, evidenciando sobretasaciones iniciales de hasta 20%.',
        '9 alertas de Dueño Directo identificadas para abordaje proactivo de captación en los próximos 5 días.',
        'Arroyada y Mallada muestran tracción en solares residenciales a estrenar.',
      ],
      microzoneHighlights: [
        {
          zone: 'Centro / Plazas',
          trend: 'alza',
          avgPriceM2Usd: 'USD 890 / m²',
          avgRentUyu: '$ 16.500 / mes',
          inventoryCount: 142,
          demandProfile: 'Alta demanda en vivienda familiar y locales sobre calles comerciales.',
        },
        {
          zone: 'Barrio Molino / Arriaga',
          trend: 'alta_rotacion',
          avgPriceM2Usd: 'USD 760 / m²',
          avgRentUyu: '$ 13.500 / mes',
          inventoryCount: 122,
          demandProfile: 'Máxima rotación para créditos hipotecarios BHU y compradores de primera vivienda.',
        },
        {
          zone: 'Parquización Arroyo Mallada',
          trend: 'expansion',
          avgPriceM2Usd: 'USD 820 / m²',
          avgRentUyu: '$ 15.000 / mes',
          inventoryCount: 38,
          demandProfile: 'Crecimiento de proyectos a estrenar y solares residenciales urbanizados.',
        },
        {
          zone: 'Eje Rutas / Libertad',
          trend: 'estable',
          avgPriceM2Usd: 'USD 45 / m² solar',
          avgRentUyu: 'Consultar',
          inventoryCount: 46,
          demandProfile: 'Inversión industrial, logística y chacras recreativas familiares.',
        },
      ],
    },
    {
      weekIdentifier: 'Semana 41 — Octubre 2026',
      period: '05/10/2026 – 11/10/2026',
      totalActiveStock: 342,
      montanoStock: 62,
      montanoSharePercentage: 18.1,
      newCapturesTotal: 12,
      priceDropCount: 5,
      directOwnerAlerts: 11,
      topOpportunity: {
        title: 'Chacra 3 hectáreas sobre Ruta 3',
        neighborhood: 'Eje Rutas / Libertad',
        previousPrice: 'USD 95.000',
        currentPrice: 'USD 78.000',
        dropPercentage: -17.9,
        diagnosis: 'Rebaja brusca de USD 17.000 tras 90 días sin tracción en agencia competidora.',
        actionPlan: 'Presentar cartera de inversores suburbanos de Montevideo y San José.',
      },
      strategicSummary: 'Semana caracterizada por estabilidad en precios de alquiler y reajustes en inmuebles rurales de gran superficie.',
      bulletPoints: [
        'Mercado de alquileres en San José mantiene absorción rápida menor a 15 días en unidades céntricas.',
        'Se verificaron 11 avisos directos de particulares en clasificados locales.',
        'Cuota de catálogo Montaño se situó en 18.1% con alta valoración de certeza notarial.',
      ],
      microzoneHighlights: [
        {
          zone: 'Centro / Plazas',
          trend: 'estable',
          avgPriceM2Usd: 'USD 885 / m²',
          avgRentUyu: '$ 16.500 / mes',
          inventoryCount: 140,
          demandProfile: 'Demanda continua de profesionales y familias.',
        },
        {
          zone: 'Barrio Molino / Arriaga',
          trend: 'alta_rotacion',
          avgPriceM2Usd: 'USD 755 / m²',
          avgRentUyu: '$ 13.200 / mes',
          inventoryCount: 119,
          demandProfile: 'Alta preferencia por casas con garaje y patio.',
        },
        {
          zone: 'Parquización Arroyo Mallada',
          trend: 'expansion',
          avgPriceM2Usd: 'USD 810 / m²',
          avgRentUyu: '$ 14.800 / mes',
          inventoryCount: 37,
          demandProfile: 'Desarrollo progresivo.',
        },
        {
          zone: 'Eje Rutas / Libertad',
          trend: 'estable',
          avgPriceM2Usd: 'USD 44 / m² solar',
          avgRentUyu: 'Consultar',
          inventoryCount: 46,
          demandProfile: 'Fracciones sobre vías principales.',
        },
      ],
    },
  ];
}

/**
 * Actualiza el estado de un aviso de mercado en el radar
 */
export async function updateMarketListingStatus(
  id: string,
  status: MarketListingStatus,
  internalNotes?: string
): Promise<MarketListing | null> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureMarketTablesExist(sql);
      if (internalNotes !== undefined) {
        await sql`
          UPDATE market_listings 
          SET status = ${status}, internal_notes = ${internalNotes}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id};
        `;
      } else {
        await sql`
          UPDATE market_listings 
          SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id};
        `;
      }
    } catch (err) {
      console.warn('Error actualizando market_listing en Neon Postgres:', err);
    }
  }

  const listings = await getAllMarketListings();
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  listings[index].status = status;
  if (internalNotes !== undefined) {
    listings[index].internalNotes = internalNotes;
  }
  listings[index].updatedAt = new Date().toISOString();

  memoryListings = [...listings];

  try {
    await fs.writeFile(LOCAL_MARKET_LISTINGS_PATH, JSON.stringify(listings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Ignorando escritura en disco de market_listings en entorno serverless read-only:', err);
  }

  return listings[index];
}

/**
 * Guarda o actualiza un aviso en market_listings
 */
export async function saveMarketListing(listing: MarketListing): Promise<MarketListing> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureMarketTablesExist(sql);
      await sql`
        INSERT INTO market_listings (
          id, title, operation, category, neighborhood, city, department,
          price_amount, price_currency, origin, competitor_name, source_name, source_url,
          detected_at, days_on_market, status, internal_notes, contact_name, contact_phone,
          built_area_m2, plot_area_m2, bedrooms, bathrooms, estimated_price_per_m2,
          price_history, is_opportunity, opportunity_reason, updated_at
        ) VALUES (
          ${listing.id}, ${listing.title}, ${listing.operation}, ${listing.category}, ${listing.neighborhood}, ${listing.city}, ${listing.department},
          ${listing.priceAmount}, ${listing.priceCurrency}, ${listing.origin}, ${listing.competitorName || null}, ${listing.sourceName}, ${listing.sourceUrl || null},
          ${listing.detectedAt}, ${listing.daysOnMarket}, ${listing.status}, ${listing.internalNotes || null}, ${listing.contactName || null}, ${listing.contactPhone || null},
          ${listing.builtAreaM2 || null}, ${listing.plotAreaM2 || null}, ${listing.bedrooms || null}, ${listing.bathrooms || null}, ${listing.estimatedPricePerM2 || null},
          ${JSON.stringify(listing.priceHistory || [])}, ${listing.isOpportunity}, ${listing.opportunityReason || null}, CURRENT_TIMESTAMP
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          price_amount = EXCLUDED.price_amount,
          price_currency = EXCLUDED.price_currency,
          days_on_market = EXCLUDED.days_on_market,
          status = EXCLUDED.status,
          internal_notes = EXCLUDED.internal_notes,
          contact_name = EXCLUDED.contact_name,
          contact_phone = EXCLUDED.contact_phone,
          price_history = EXCLUDED.price_history,
          is_opportunity = EXCLUDED.is_opportunity,
          opportunity_reason = EXCLUDED.opportunity_reason,
          updated_at = CURRENT_TIMESTAMP;
      `;
      return listing;
    } catch (sqlErr) {
      console.warn('Error guardando market_listing en Neon Postgres:', sqlErr);
    }
  }

  const listings = await getAllMarketListings();
  const existingIdx = listings.findIndex((l) => l.id === listing.id);
  if (existingIdx >= 0) {
    listings[existingIdx] = { ...listings[existingIdx], ...listing, updatedAt: new Date().toISOString() };
  } else {
    listings.unshift(listing);
  }

  memoryListings = [...listings];
  try {
    await fs.writeFile(LOCAL_MARKET_LISTINGS_PATH, JSON.stringify(listings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error guardando market_listings en disco local:', err);
  }

  return listing;
}

/**
 * Guarda un snapshot semanal de mercado
 */
export async function saveMarketSnapshot(snapshot: MarketSnapshot): Promise<MarketSnapshot> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureMarketTablesExist(sql);
      await sql`
        INSERT INTO market_snapshots (
          id, snapshot_date, week_number, year, total_stock, montano_stock, montano_share_percentage,
          direct_owner_stock, competitor_stock, new_entries_7d, price_drops_7d,
          avg_price_m2_usd_sale, avg_price_rent_uyu, zone_distribution, category_distribution,
          notes, created_at
        ) VALUES (
          ${snapshot.id}, ${snapshot.snapshotDate}, ${snapshot.weekNumber}, ${snapshot.year},
          ${snapshot.totalStock}, ${snapshot.montanoStock}, ${snapshot.montanoSharePercentage},
          ${snapshot.directOwnerStock}, ${snapshot.competitorStock}, ${snapshot.newEntries7d}, ${snapshot.priceDrops7d},
          ${snapshot.avgPriceM2UsdSale}, ${snapshot.avgPriceRentUyu},
          ${JSON.stringify(snapshot.zoneDistribution)}, ${JSON.stringify(snapshot.categoryDistribution)},
          ${snapshot.notes || null}, CURRENT_TIMESTAMP
        ) ON CONFLICT (id) DO UPDATE SET
          total_stock = EXCLUDED.total_stock,
          montano_stock = EXCLUDED.montano_stock,
          montano_share_percentage = EXCLUDED.montano_share_percentage,
          direct_owner_stock = EXCLUDED.direct_owner_stock,
          competitor_stock = EXCLUDED.competitor_stock,
          new_entries_7d = EXCLUDED.new_entries_7d,
          price_drops_7d = EXCLUDED.price_drops_7d,
          avg_price_m2_usd_sale = EXCLUDED.avg_price_m2_usd_sale,
          avg_price_rent_uyu = EXCLUDED.avg_price_rent_uyu,
          zone_distribution = EXCLUDED.zone_distribution,
          category_distribution = EXCLUDED.category_distribution,
          notes = EXCLUDED.notes;
      `;
      return snapshot;
    } catch (sqlErr) {
      console.warn('Error guardando market_snapshot en Neon Postgres:', sqlErr);
    }
  }

  const snapshots = await getAllMarketSnapshots();
  const existingIdx = snapshots.findIndex((s) => s.id === snapshot.id);
  if (existingIdx >= 0) {
    snapshots[existingIdx] = snapshot;
  } else {
    snapshots.unshift(snapshot);
  }

  memorySnapshots = [...snapshots];
  try {
    await fs.writeFile(LOCAL_MARKET_SNAPSHOTS_PATH, JSON.stringify(snapshots, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error guardando market_snapshots en disco local:', err);
  }

  return snapshot;
}

/**
 * Obtiene todos los snapshots históricos
 */
export async function getAllMarketSnapshots(): Promise<MarketSnapshot[]> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureMarketTablesExist(sql);
      const rows = await sql`SELECT * FROM market_snapshots ORDER BY snapshot_date DESC;`;
      if (rows && rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          snapshotDate: String(r.snapshot_date),
          weekNumber: Number(r.week_number),
          year: Number(r.year),
          totalStock: Number(r.total_stock),
          montanoStock: Number(r.montano_stock),
          montanoSharePercentage: Number(r.montano_share_percentage),
          directOwnerStock: Number(r.direct_owner_stock),
          competitorStock: Number(r.competitor_stock),
          newEntries7d: Number(r.new_entries_7d),
          priceDrops7d: Number(r.price_drops_7d),
          avgPriceM2UsdSale: Number(r.avg_price_m2_usd_sale || 815),
          avgPriceRentUyu: Number(r.avg_price_rent_uyu || 16800),
          zoneDistribution: (r.zone_distribution as Record<string, number>) || {},
          categoryDistribution: (r.category_distribution as Record<string, number>) || {},
          notes: r.notes ? String(r.notes) : undefined,
          createdAt: String(r.created_at),
        }));
      }
    } catch (dbErr) {
      console.warn('Error consultando market_snapshots en Neon Postgres:', dbErr);
    }
  }

  if (memorySnapshots && memorySnapshots.length > 0) {
    return memorySnapshots;
  }

  try {
    const content = await fs.readFile(LOCAL_MARKET_SNAPSHOTS_PATH, 'utf-8');
    const parsed: MarketSnapshot[] = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memorySnapshots = parsed;
      return parsed;
    }
  } catch {
    // Archivo no existe aún
  }

  memorySnapshots = INITIAL_MARKET_SNAPSHOTS;
  try {
    await fs.writeFile(LOCAL_MARKET_SNAPSHOTS_PATH, JSON.stringify(INITIAL_MARKET_SNAPSHOTS, null, 2), 'utf-8');
  } catch (err) {
    console.warn('No se pudo guardar market_snapshots.json localmente:', err);
  }

  return memorySnapshots;
}
