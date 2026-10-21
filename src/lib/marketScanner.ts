import fs from 'node:fs';
import path from 'node:path';
import { MarketListing, MarketSnapshot } from '@/types/market';
import { neon } from '@neondatabase/serverless';

const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'db', 'market_listings.json');
const LOCAL_SNAPSHOTS_PATH = path.join(process.cwd(), 'src', 'db', 'market_snapshots.json');

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

function normalizeCategory(typeText?: string, titleText?: string): 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito' {
  const combined = `${typeText || ''} ${titleText || ''}`.toLowerCase();
  if (combined.includes('apartamento') || combined.includes('apto') || combined.includes('monoambiente')) return 'apartamento';
  if (combined.includes('terreno') || combined.includes('solar') || combined.includes('lote') || combined.includes('fraccion')) return 'terreno';
  if (combined.includes('chacra') || combined.includes('campo') || combined.includes('estancia') || combined.includes('hectarea') || combined.includes('quinta')) return 'chacra';
  if (combined.includes('galpon') || combined.includes('deposito') || combined.includes('tinglado')) return 'deposito';
  if (combined.includes('local') || combined.includes('comercial') || combined.includes('hotel') || combined.includes('oficina') || combined.includes('negocio')) return 'local';
  return 'casa';
}

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

async function extractLemaProperties(): Promise<IncomingBatchListing[]> {
  const results: IncomingBatchListing[] = [];
  try {
    const res = await fetch('https://www.lemapropiedades.com/todo', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-UY,es;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return results;

    const html = await res.text();
    const items = html.split('wixui-repeater__item');

    for (let i = 1; i < items.length; i++) {
      const chunk = items[i];
      const linkMatch = chunk.match(/href="(https:\/\/www\.lemapropiedades\.com\/propiedades\/[^"]+)"/);
      const cleanText = chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      const isAlquiler = cleanText.toUpperCase().includes('ALQUILER');
      const operation: 'venta' | 'alquiler' = isAlquiler ? 'alquiler' : 'venta';

      const priceMatch = cleanText.match(/(?:U\$S|USD)\s*([0-9\.\,]+)/i);
      const uyuPriceMatch = cleanText.match(/\$\s*([0-9\.\,]+)/);
      let priceAmount = 0;
      let priceCurrency: 'USD' | 'UYU' = 'USD';

      if (priceMatch) {
        priceAmount = Number(priceMatch[1].replace(/\./g, '').replace(',', '.'));
        priceCurrency = 'USD';
      } else if (uyuPriceMatch) {
        priceAmount = Number(uyuPriceMatch[1].replace(/\./g, '').replace(',', '.'));
        priceCurrency = 'UYU';
      }

      let rawTitle = '';
      if (linkMatch) {
        const slug = linkMatch[1].split('/').pop() || '';
        rawTitle = decodeURIComponent(slug).replace(/-/g, ' ');
      }
      if (!rawTitle) {
        const titleMatch = cleanText.match(/(?:VENTA|ALQUILER)\s+([^#\$\n]+?)(?:Manuel|Av\.|Luis|Leandro|Kiyú|Ruta|USD|U\$S|\$|[0-9]|$)/i);
        rawTitle = titleMatch ? titleMatch[1].trim() : 'Inmueble en San José';
      }

      const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1).toLowerCase();
      const neighborhood = normalizeNeighborhood(cleanText, title, cleanText);
      const category = normalizeCategory(cleanText, title);
      const slug = linkMatch ? linkMatch[1].split('/').pop() || '' : `lema-${i}`;
      const id = `lema-${slug}`;

      results.push({
        id,
        title,
        operation,
        category,
        neighborhood,
        city: neighborhood === 'Libertad' ? 'Libertad' : 'San José de Mayo',
        department: 'San José',
        priceAmount: priceAmount || 75000,
        priceCurrency,
        origin: 'inmobiliaria_competencia',
        competitorName: 'Lema Propiedades',
        sourceName: 'Lema Propiedades',
        sourceUrl: linkMatch ? linkMatch[1] : 'https://www.lemapropiedades.com/todo',
        contactName: 'Lema Propiedades',
        contactPhone: '099 553 253',
        detectedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('[MARKET-SCANNER] Aviso al escanear Lema Propiedades:', err);
  }
  return results;
}

export async function executeMarketScan() {
  console.log('[MARKET-SCANNER] Iniciando escaneo de portales en vivo...');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const categories = [
    { op: 'venta' as const, path: 'venta/inmuebles/san-jose' },
    { op: 'alquiler' as const, path: 'alquiler/inmuebles/san-jose' },
  ];

  const extracted: IncomingBatchListing[] = [];

  for (const cat of categories) {
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 3) {
      const url = `https://www.infocasas.com.uy/${cat.path}${page > 1 ? `/pagina${page}` : ''}`;
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-UY,es;q=0.9',
          },
          signal: AbortSignal.timeout(6000),
        });

        if (!res.ok) break;

        const html = await res.text();
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (!nextDataMatch) break;

        const data = JSON.parse(nextDataMatch[1]);
        const sf = data.props?.pageProps?.fetchResult?.searchFast;
        if (!sf?.data || !Array.isArray(sf.data) || sf.data.length === 0) break;

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
        console.warn(`[MARKET-SCANNER] Error en página ${page}:`, err);
        break;
      }
    }
  }

  // Escaneo de inmobiliarias locales de San José (Lema Propiedades)
  try {
    const lemaItems = await extractLemaProperties();
    if (lemaItems.length > 0) {
      console.log(`[MARKET-SCANNER] Extraídas ${lemaItems.length} propiedades locales de Lema Propiedades`);
      extracted.push(...lemaItems);
    }
  } catch (err) {
    console.warn('[MARKET-SCANNER] Error incorporando Lema Propiedades:', err);
  }

  if (extracted.length === 0) {
    throw new Error('No se pudieron extraer inmuebles del portal en este momento.');
  }

  let currentListings: MarketListing[] = [];
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      currentListings = JSON.parse(raw);
    }
  } catch {
    currentListings = [];
  }

  const existingMap = new Map<string, MarketListing>();
  currentListings.forEach((l) => existingMap.set(l.id, l));

  let newEntriesCount = 0;
  let priceDropsCount = 0;
  let directOwnersCount = 0;

  const updatedListings: MarketListing[] = [];

  for (const item of extracted) {
    const existing = existingMap.get(item.id);

    if (existing) {
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

  // Guardar archivo local
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(updatedListings, null, 2), 'utf8');

  // Actualizar snapshot
  const totalStock = updatedListings.length;
  const montanoStock = 64;
  const montanoShare = Number(((montanoStock / (totalStock + montanoStock)) * 100).toFixed(1));

  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  const m2List = updatedListings
    .filter((l) => l.operation === 'venta' && l.priceCurrency === 'USD' && l.estimatedPricePerM2 && l.estimatedPricePerM2 > 200 && l.estimatedPricePerM2 < 3000)
    .map((l) => l.estimatedPricePerM2!);
  const avgM2Price = m2List.length > 0 ? Math.round(m2List.reduce((a, b) => a + b, 0) / m2List.length) : 850;

  const rentList = updatedListings
    .filter((l) => l.operation === 'alquiler' && l.priceCurrency === 'UYU' && l.priceAmount > 5000 && l.priceAmount < 80000)
    .map((l) => l.priceAmount);
  const avgRentPrice = rentList.length > 0 ? Math.round(rentList.reduce((a, b) => a + b, 0) / rentList.length) : 16500;

  const zoneDistribution = updatedListings.reduce((acc, l) => {
    acc[l.neighborhood] = (acc[l.neighborhood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
    notes: `Monitoreo semanal ${weekNumber} de ${currentYear}. Relevamiento en vivo con ${totalStock} inmuebles auditados en San José.`,
    createdAt: now.toISOString(),
  };

  let snapshots: MarketSnapshot[] = [];
  try {
    if (fs.existsSync(LOCAL_SNAPSHOTS_PATH)) {
      snapshots = JSON.parse(fs.readFileSync(LOCAL_SNAPSHOTS_PATH, 'utf8'));
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

  fs.writeFileSync(LOCAL_SNAPSHOTS_PATH, JSON.stringify(snapshots, null, 2), 'utf8');

  // Postgres sincronización opcional
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connectionString) {
    try {
      const sql = neon(connectionString);
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
    } catch (e) {
      console.warn('[MARKET-SCANNER] Postgres no disponible:', e);
    }
  }

  return {
    totalListings: updatedListings.length,
    newEntriesCount,
    priceDropsCount,
    directOwnersCount,
  };
}
