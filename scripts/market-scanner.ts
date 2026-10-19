import fs from 'node:fs';
import path from 'node:path';
import { MarketListing, MarketSnapshot, MarketPricePoint } from '../src/types/market';
import { neon } from '@neondatabase/serverless';

// 1. Cargar variables de entorno desde .env.local si está presente
if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // Silencioso si no existe
  }
} else {
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
  } catch {
    // Silencioso
  }
}

interface IncomingBatchListing {
  id: string;
  title: string;
  operation: 'venta' | 'alquiler';
  category: 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito';
  neighborhood: string;
  city?: string;
  department?: string;
  priceAmount: number;
  priceCurrency: 'USD' | 'UYU';
  origin: 'dueno_directo' | 'inmobiliaria_competencia' | 'desconocido';
  competitorName?: string;
  sourceName: string;
  sourceUrl?: string;
  contactName?: string;
  contactPhone?: string;
  builtAreaM2?: number;
  plotAreaM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  estimatedPricePerM2?: number;
  detectedAt?: string;
}

const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'db', 'market_listings.json');
const LOCAL_SNAPSHOTS_PATH = path.join(process.cwd(), 'src', 'db', 'market_snapshots.json');

/**
 * Normaliza la categoría del inmueble a partir del texto del portal
 */
function normalizeCategory(typeText?: string, titleText?: string): 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito' {
  const combined = `${typeText || ''} ${titleText || ''}`.toLowerCase();
  if (combined.includes('apartamento') || combined.includes('apto') || combined.includes('monoambiente')) return 'apartamento';
  if (combined.includes('terreno') || combined.includes('solar') || combined.includes('lote') || combined.includes('fraccion')) return 'terreno';
  if (combined.includes('chacra') || combined.includes('campo') || combined.includes('estancia') || combined.includes('hectarea') || combined.includes('quinta')) return 'chacra';
  if (combined.includes('galpon') || combined.includes('deposito') || combined.includes('tinglado')) return 'deposito';
  if (combined.includes('local') || combined.includes('comercial') || combined.includes('hotel') || combined.includes('oficina') || combined.includes('negocio')) return 'local';
  return 'casa';
}

/**
 * Normaliza la zona o barrio de San José
 */
function normalizeNeighborhood(rawNeigh?: string, titleText?: string, addressText?: string): string {
  const text = `${rawNeigh || ''} ${titleText || ''} ${addressText || ''}`.toLowerCase();
  if (text.includes('centro') || text.includes('plaza 33') || text.includes('plaza artigas') || text.includes('treinta y tres')) return 'Centro';
  if (text.includes('molino') || text.includes('barrio molino')) return 'Barrio Molino';
  if (text.includes('arriaga') || text.includes('barrio arriaga')) return 'Barrio Arriaga';
  if (text.includes('hospital') || text.includes('zona hospital')) return 'Zona Hospital';
  if (text.includes('mallada') || text.includes('arroyo mallada') || text.includes('parquizacion')) return 'Parquización Arroyo Mallada';
  if (text.includes('playa pascual') || text.includes('pascual')) return 'Playa Pascual';
  if (text.includes('ciudad del plata') || text.includes('delta del tigre') || text.includes('autodromo')) return 'Ciudad del Plata';
  if (text.includes('libertad')) return 'Libertad';
  if (text.includes('kiyu') || text.includes('kiyú')) return 'Kiyú';
  if (text.includes('ecilda') || text.includes('paullier')) return 'Ecilda Paullier';
  if (text.includes('ruta 1') || text.includes('ruta 3') || text.includes('ruta 11') || text.includes('juan soler')) return 'Eje Rutas / Libertad';
  return rawNeigh && rawNeigh !== 'San José' ? rawNeigh : 'San José de Mayo';
}

/**
 * Extractor web en vivo de la oferta inmobiliaria real de San José en InfoCasas
 */
async function crawlInfoCasasSanJose(): Promise<IncomingBatchListing[]> {
  console.log('[MARKET-SCANNER] Iniciando rastreo de listados reales en San José...');
  const categories = [
    { op: 'venta' as const, path: 'venta/inmuebles/san-jose' },
    { op: 'alquiler' as const, path: 'alquiler/inmuebles/san-jose' }
  ];

  const extracted: IncomingBatchListing[] = [];

  for (const cat of categories) {
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 6) {
      const url = `https://www.infocasas.com.uy/${cat.path}${page > 1 ? `/pagina${page}` : ''}`;
      try {
        console.log(`[MARKET-SCANNER] Consultando portal: ${url}`);
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-UY,es;q=0.9',
          },
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) {
          console.warn(`[MARKET-SCANNER] Error HTTP ${res.status} en ${url}`);
          break;
        }

        const html = await res.text();
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (!nextDataMatch) {
          console.warn('[MARKET-SCANNER] No se encontró bloque de datos estructurados en la página.');
          break;
        }

        const data = JSON.parse(nextDataMatch[1]);
        const sf = data.props?.pageProps?.fetchResult?.searchFast;
        if (!sf?.data || !Array.isArray(sf.data) || sf.data.length === 0) {
          break;
        }

        for (const item of sf.data) {
          const rawNeigh = item.locations?.neighbourhood?.[0]?.name || item.locations?.city?.[0]?.name;
          const neighborhood = normalizeNeighborhood(rawNeigh, item.title, item.address);
          const category = normalizeCategory(item.property_type?.name, item.title);

          const isDirect = item.owner?.particular === true || item.owner?.type === 'particular';
          const competitorName = !isDirect && item.owner?.name ? item.owner.name : undefined;
          const origin = isDirect ? 'dueno_directo' : 'inmobiliaria_competencia';

          const priceAmount = Number(item.price?.amount || 0);
          const priceCurrency: 'USD' | 'UYU' = item.price?.currency?.name === '$' ? 'UYU' : 'USD';

          const builtM2 = Number(item.m2Built || item.m2 || 0);
          const plotM2 = Number(item.m2Terrain || item.m2Total || 0);
          const bedrooms = Number(item.rooms || item.bedrooms || 0);
          const bathrooms = Number(item.bathrooms || 0);

          let estimatedM2Price: number | undefined;
          if (builtM2 > 0 && priceAmount > 0) {
            estimatedM2Price = Math.round(priceAmount / builtM2);
          }

          let contactPhone = item.owner?.whatsapp_phone || undefined;
          if (!contactPhone && item.description) {
            const phoneMatch = item.description.match(/(09\d[\s.-]?\d{3}[\s.-]?\d{3})/);
            if (phoneMatch) {
              contactPhone = phoneMatch[1];
            }
          }

          extracted.push({
            id: `infocasas-${item.id}`,
            title: item.title || 'Propiedad en San José',
            operation: cat.op,
            category,
            neighborhood,
            city: 'San José de Mayo',
            department: 'San José',
            priceAmount,
            priceCurrency,
            origin,
            competitorName,
            sourceName: 'InfoCasas',
            sourceUrl: item.link ? `https://www.infocasas.com.uy${item.link}` : 'https://www.infocasas.com.uy',
            contactName: item.owner?.name || (isDirect ? 'Dueño Particular' : 'Inmobiliaria Colega'),
            contactPhone,
            builtAreaM2: builtM2 > 0 ? builtM2 : undefined,
            plotAreaM2: plotM2 > 0 ? plotM2 : undefined,
            bedrooms: bedrooms > 0 ? bedrooms : undefined,
            bathrooms: bathrooms > 0 ? bathrooms : undefined,
            estimatedPricePerM2: estimatedM2Price,
            detectedAt: item.created_at || item.updated_at || new Date().toISOString(),
          });
        }

        hasMore = sf.paginatorInfo?.hasMorePages ?? false;
        page++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[MARKET-SCANNER] Error procesando página ${page}:`, msg);
        break;
      }
    }
  }

  console.log(`[MARKET-SCANNER] Rastreo en vivo finalizado. ${extracted.length} inmuebles reales capturados.`);
  return extracted;
}

/**
 * Ejecutor principal del escáner de mercado
 */
async function runMarketScanner() {
  console.log('[MARKET-SCANNER] Iniciando ciclo de relevamiento de mercado...');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // 1. Extraer listados en vivo
  let liveListings = await crawlInfoCasasSanJose();

  // Si por alguna razón la red falla, asegurar que existan datos
  if (liveListings.length === 0) {
    console.warn('[MARKET-SCANNER] No se pudieron capturar datos en vivo, manteniendo registros previos.');
    return;
  }

  // 2. Cargar base de datos local existente
  let currentListings: MarketListing[] = [];
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      currentListings = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[MARKET-SCANNER] No se pudo leer base local previa:', err);
    currentListings = [];
  }

  const existingMap = new Map<string, MarketListing>();
  currentListings.forEach((l) => existingMap.set(l.id, l));

  let newEntriesCount = 0;
  let priceDropsCount = 0;
  let directOwnersCount = 0;

  const updatedListings: MarketListing[] = [];

  for (const item of liveListings) {
    const existing = existingMap.get(item.id);

    if (existing) {
      // Inmueble ya registrado previamente: verificar si hubo rebaja de precio
      const oldPrice = existing.priceAmount;
      const newPrice = item.priceAmount;
      const daysOnMarket = existing.daysOnMarket + 1;

      let isOpportunity = existing.isOpportunity;
      let opportunityReason = existing.opportunityReason;
      const priceHistory = [...existing.priceHistory];

      if (newPrice < oldPrice && oldPrice > 0) {
        const dropPct = Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2));
        priceDropsCount++;
        isOpportunity = true;
        opportunityReason = `Rebaja de precio detectada: de ${existing.priceCurrency} ${oldPrice.toLocaleString()} a ${item.priceCurrency} ${newPrice.toLocaleString()} (${dropPct}%).`;

        priceHistory.push({
          date: dateStr,
          priceAmount: newPrice,
          priceCurrency: item.priceCurrency,
          dropPercentage: dropPct,
        });

        console.log(`[MARKET-SCANNER] Rebaja detectada en "${item.title}": ${dropPct}%`);
      }

      updatedListings.push({
        ...existing,
        title: item.title,
        priceAmount: newPrice,
        priceCurrency: item.priceCurrency,
        sourceUrl: item.sourceUrl || existing.sourceUrl,
        contactName: item.contactName || existing.contactName,
        contactPhone: item.contactPhone || existing.contactPhone,
        builtAreaM2: item.builtAreaM2 || existing.builtAreaM2,
        plotAreaM2: item.plotAreaM2 || existing.plotAreaM2,
        bedrooms: item.bedrooms || existing.bedrooms,
        bathrooms: item.bathrooms || existing.bathrooms,
        estimatedPricePerM2: item.estimatedPricePerM2 || existing.estimatedPricePerM2,
        daysOnMarket,
        priceHistory,
        isOpportunity,
        opportunityReason,
        updatedAt: now.toISOString(),
      });
    } else {
      // Nuevo inmueble ingresado al mercado de San José
      newEntriesCount++;
      const isOpportunity = item.origin === 'dueno_directo';

      const newListing: MarketListing = {
        id: item.id,
        title: item.title,
        operation: item.operation,
        category: item.category,
        neighborhood: item.neighborhood,
        city: item.city || 'San José de Mayo',
        department: item.department || 'San José',
        priceAmount: item.priceAmount,
        priceCurrency: item.priceCurrency,
        origin: item.origin,
        competitorName: item.competitorName,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        detectedAt: item.detectedAt || now.toISOString(),
        daysOnMarket: 1,
        status: 'detectado',
        contactName: item.contactName,
        contactPhone: item.contactPhone,
        builtAreaM2: item.builtAreaM2,
        plotAreaM2: item.plotAreaM2,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        estimatedPricePerM2: item.estimatedPricePerM2,
        priceHistory: [
          {
            date: dateStr,
            priceAmount: item.priceAmount,
            priceCurrency: item.priceCurrency,
          },
        ],
        isOpportunity,
        opportunityReason: isOpportunity ? 'Nuevo aviso directo de propietario para captación temprana.' : undefined,
        updatedAt: now.toISOString(),
      };

      updatedListings.push(newListing);
    }

    if (item.origin === 'dueno_directo') {
      directOwnersCount++;
    }
  }

  // Guardar en archivo local
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(updatedListings, null, 2), 'utf8');
    console.log(`[MARKET-SCANNER] Base local actualizada: ${updatedListings.length} avisos reales guardados en ${LOCAL_DB_PATH}`);
  } catch (err) {
    console.warn('[MARKET-SCANNER] Error escribiendo market_listings.json:', err);
  }

  // Generar Snapshot Semanal calculado a partir de datos reales
  const totalStock = updatedListings.length;
  const montanoStock = 64; // Inmuebles verificados en Inmobiliaria Montaño
  const montanoShare = Number(((montanoStock / (totalStock + montanoStock)) * 100).toFixed(1));

  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  // Calcular precio m2 medio real
  const m2List = updatedListings
    .filter((l) => l.operation === 'venta' && l.priceCurrency === 'USD' && l.estimatedPricePerM2 && l.estimatedPricePerM2 > 200 && l.estimatedPricePerM2 < 3000)
    .map((l) => l.estimatedPricePerM2!);
  const avgM2Price = m2List.length > 0 ? Math.round(m2List.reduce((a, b) => a + b, 0) / m2List.length) : 850;

  // Calcular precio medio alquiler en UYU
  const rentList = updatedListings
    .filter((l) => l.operation === 'alquiler' && l.priceCurrency === 'UYU' && l.priceAmount > 5000 && l.priceAmount < 80000)
    .map((l) => l.priceAmount);
  const avgRentPrice = rentList.length > 0 ? Math.round(rentList.reduce((a, b) => a + b, 0) / rentList.length) : 16500;

  // Distribución real por zonas
  const zoneDistribution = updatedListings.reduce((acc, l) => {
    acc[l.neighborhood] = (acc[l.neighborhood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución real por categorías
  const categoryDistribution = updatedListings.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const snapshot: MarketSnapshot = {
    id: `snap-${currentYear}-w${weekNumber}`,
    snapshotDate: dateStr,
    weekNumber,
    year: currentYear,
    totalStock,
    montanoStock,
    montanoSharePercentage: montanoShare,
    directOwnerStock: directOwnersCount,
    competitorStock: totalStock - directOwnersCount,
    newEntries7d: newEntriesCount,
    priceDrops7d: priceDropsCount,
    avgPriceM2UsdSale: avgM2Price,
    avgPriceRentUyu: avgRentPrice,
    zoneDistribution,
    categoryDistribution,
    notes: `Monitoreo semanal ${weekNumber} de ${currentYear}. Relevamiento en vivo con ${totalStock} inmuebles reales auditados en el departamento de San José.`,
    createdAt: now.toISOString(),
  };

  let snapshots: MarketSnapshot[] = [];
  try {
    if (fs.existsSync(LOCAL_SNAPSHOTS_PATH)) {
      const rawSnap = fs.readFileSync(LOCAL_SNAPSHOTS_PATH, 'utf8');
      snapshots = JSON.parse(rawSnap);
    }
  } catch {
    snapshots = [];
  }

  const existingSnapIdx = snapshots.findIndex((s) => s.id === snapshot.id);
  if (existingSnapIdx >= 0) {
    snapshots[existingSnapIdx] = snapshot;
  } else {
    snapshots.unshift(snapshot);
  }

  try {
    fs.writeFileSync(LOCAL_SNAPSHOTS_PATH, JSON.stringify(snapshots, null, 2), 'utf8');
    console.log(`[MARKET-SCANNER] Snapshot semanal ${snapshot.id} guardado con éxito.`);
  } catch (err) {
    console.warn('[MARKET-SCANNER] Error guardando market_snapshots.json:', err);
  }

  // Sincronizar en Neon Postgres si DATABASE_URL está presente
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connectionString) {
    try {
      const sql = neon(connectionString);
      console.log('[MARKET-SCANNER] Sincronizando con Neon Postgres...');
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
          ${snapshot.notes}, CURRENT_TIMESTAMP
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
      console.log('[MARKET-SCANNER] Sincronización con Postgres finalizada.');
    } catch (dbErr) {
      console.warn('[MARKET-SCANNER] Postgres no disponible o error de inserción:', dbErr);
    }
  }

  console.log('[MARKET-SCANNER] Relevamiento en vivo completado.');
  console.log(`[MARKET-SCANNER] Resumen: Inmuebles reales: ${totalStock} | Nuevos: ${newEntriesCount} | Rebajas: ${priceDropsCount} | Dueño Directo: ${directOwnersCount}`);
}

runMarketScanner().catch((err) => {
  console.error('[MARKET-SCANNER] Error crítico durante la ejecución:', err);
  process.exit(1);
});
