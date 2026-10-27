import fs from 'node:fs';
import path from 'node:path';
import { MarketListing } from '@/types/market';
import { detectCompetitorSignatures, normalizeUruguayPhone } from '@/lib/whatsapp';
import { neon } from '@neondatabase/serverless';

const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'db', 'market_listings.json');
const ML_PROFILE_DIR = path.join(process.cwd(), '.playwright-ml-profile');

export interface IncomingOwnerListing {
  id: string;
  title: string;
  operation: 'venta' | 'alquiler';
  category: 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito';
  neighborhood: string;
  city?: string;
  department?: string;
  priceAmount: number;
  priceCurrency: 'USD' | 'UYU';
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

export function normalizeCategory(
  typeText?: string,
  titleText?: string
): 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito' {
  const combined = `${typeText || ''} ${titleText || ''}`.toLowerCase();
  if (combined.includes('apartamento') || combined.includes('apto') || combined.includes('monoambiente')) {
    return 'apartamento';
  }
  if (
    combined.includes('chacra') ||
    combined.includes('campo') ||
    combined.includes('estancia') ||
    combined.includes('hectarea') ||
    combined.includes('hectárea') ||
    combined.includes('quinta') ||
    combined.includes('rural')
  ) {
    return 'chacra';
  }
  if (
    combined.includes('terreno') ||
    combined.includes('solar') ||
    combined.includes('lote') ||
    combined.includes('fraccion') ||
    combined.includes('fracción')
  ) {
    return 'terreno';
  }
  if (combined.includes('galpon') || combined.includes('galpón') || combined.includes('deposito') || combined.includes('depósito') || combined.includes('tinglado')) {
    return 'deposito';
  }
  if (
    combined.includes('local') ||
    combined.includes('comercial') ||
    combined.includes('comercio') ||
    combined.includes('hotel') ||
    combined.includes('oficina') ||
    combined.includes('negocio') ||
    combined.includes('veterinaria') ||
    combined.includes('posada')
  ) {
    return 'local';
  }
  return 'casa';
}

export function normalizeNeighborhood(rawNeigh?: string, titleText?: string, addressText?: string): string {
  const text = `${rawNeigh || ''} ${titleText || ''} ${addressText || ''}`.toLowerCase();
  if (text.includes('centro') || text.includes('plaza 33') || text.includes('plaza artigas') || text.includes('treinta y tres')) return 'Centro';
  if (text.includes('molino') || text.includes('barrio molino')) return 'Barrio Molino';
  if (text.includes('arriaga') || text.includes('barrio arriaga')) return 'Barrio Arriaga';
  if (text.includes('hospital') || text.includes('zona hospital')) return 'Zona Hospital';
  if (text.includes('mallada') || text.includes('arroyo mallada') || text.includes('parquizacion')) return 'Parquización Arroyo Mallada';
  if (text.includes('playa pascual') || text.includes('pascual')) return 'Playa Pascual';
  if (text.includes('santa monica') || text.includes('santa mónica') || text.includes('ciudad del plata') || text.includes('delta del tigre') || text.includes('autodromo') || text.includes('autódromo') || text.includes('penino')) return 'Ciudad del Plata';
  if (text.includes('libertad') || text.includes('colonia wilson')) return 'Libertad';
  if (text.includes('kiyu') || text.includes('kiyú') || text.includes('orfilla') || text.includes('arazati') || text.includes('arazatí') || text.includes('boca del cufre') || text.includes('cufré')) return 'Kiyú';
  if (text.includes('ecilda') || text.includes('paullier') || text.includes(' Rafael perazza') || text.includes('perazza')) return 'Ecilda Paullier';
  if (text.includes('ruta 1') || text.includes('ruta 3') || text.includes('ruta 11') || text.includes('juan soler') || text.includes('costas de pereira') || text.includes('mahoma') || text.includes('mal abrigo') || text.includes('rodriguez') || text.includes('rodríguez') || text.includes('ituzaingo') || text.includes('ituzaingó') || text.includes('capurro') || text.includes('puntas de valdez')) return 'Eje Rutas / Libertad';
  return rawNeigh && rawNeigh !== 'San José' && rawNeigh !== 'Otra' && rawNeigh !== 'Otro' ? rawNeigh : 'San José de Mayo';
}

/**
 * Extrae teléfonos uruguayos ocultos en un texto (formatos 099 123 456, +598 99 123 456, 098-123-456)
 */
export function extractPhoneFromText(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/(?:\+?598\s*0?9\d|09\d)[\s.\-_]?\d{3}[\s.\-_]?\d{3}/);
  if (match) {
    return match[0].trim();
  }
  return undefined;
}

/**
 * 1. Escáner de InfoCasas (Todas las páginas de Venta y Alquiler en el Dpto. de San José - Solo Particulares)
 */
async function scanInfoCasasDirectOwners(): Promise<IncomingOwnerListing[]> {
  console.log('[RADAR-DUENOS] Escaneando InfoCasas (Venta y Alquiler en San José - Solo Dueño Directo)...');
  const categories = [
    { op: 'venta' as const, path: 'venta/inmuebles/san-jose' },
    { op: 'alquiler' as const, path: 'alquiler/inmuebles/san-jose' },
  ];

  const owners: IncomingOwnerListing[] = [];

  for (const cat of categories) {
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 10) {
      const url = `https://www.infocasas.com.uy/${cat.path}${page > 1 ? `/pagina${page}` : ''}`;
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-UY,es;q=0.9',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) break;

        const html = await res.text();
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (!nextDataMatch) break;

        const data = JSON.parse(nextDataMatch[1]);
        const sf = data.props?.pageProps?.fetchResult?.searchFast;
        if (!sf?.data || !Array.isArray(sf.data) || sf.data.length === 0) break;

        for (const item of sf.data) {
          const isDirect = item.owner?.particular === true || item.owner?.type === 'particular';
          if (!isDirect) continue;

          // Verificar con escudo anti-competencia
          const check = detectCompetitorSignatures({
            phone: item.owner?.whatsapp_phone,
            title: item.title,
            description: item.description,
            contactName: item.owner?.name,
          });
          if (check.isCompetitor) {
            console.log(`[RADAR-DUENOS] Descartado falso particular en InfoCasas (${check.reason}): ${item.title}`);
            continue;
          }

          const rawNeigh = item.locations?.neighbourhood?.[0]?.name || item.locations?.city?.[0]?.name;
          const neighborhood = normalizeNeighborhood(rawNeigh, item.title, item.address);
          const category = normalizeCategory(item.property_type?.name, item.title);

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

          const contactPhone = item.owner?.whatsapp_phone || extractPhoneFromText(item.description);

          owners.push({
            id: `infocasas-${item.id}`,
            title: item.title || 'Propiedad de Particular en San José',
            operation: cat.op,
            category,
            neighborhood,
            city: neighborhood === 'Ciudad del Plata' || neighborhood === 'Playa Pascual' ? 'Ciudad del Plata' : 'San José de Mayo',
            department: 'San José',
            priceAmount,
            priceCurrency,
            sourceName: 'InfoCasas (Dueño)',
            sourceUrl: item.link ? `https://www.infocasas.com.uy${item.link}` : 'https://www.infocasas.com.uy',
            contactName: item.owner?.name || 'Dueño Particular',
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
      } catch (err) {
        console.warn(`[RADAR-DUENOS] Error en página ${page} de InfoCasas:`, err);
        break;
      }
    }
  }

  console.log(`[RADAR-DUENOS] InfoCasas finalizó: ${owners.length} dueños directos verificados.`);
  return owners;
}

/**
 * 2. Escáner Local con Playwright (El Gallito Luis + Mercado Libre en todo San José)
 * Se ejecuta usando el Google Chrome instalado localmente en la PC.
 */
async function scanPortalsWithLocalPlaywright(): Promise<IncomingOwnerListing[]> {
  const owners: IncomingOwnerListing[] = [];

  let pw: any = null;
  try {
    pw = eval('require')('playwright-core');
  } catch {
    console.warn('[RADAR-DUENOS] playwright-core no disponible en este entorno, omitiendo escaneo de navegador.');
    return owners;
  }

  let browser: any = null;
  try {
    console.log('[RADAR-DUENOS] Iniciando navegador Chrome local para El Gallito y Mercado Libre...');
    browser = await pw.chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      locale: 'es-UY',
    });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    const page = await context.newPage();

    // =========================================================================
    // A. ESCANEO DE EL GALLITO LUIS (Todas las zonas y categorías de San José)
    // =========================================================================
    const gallitoCandidateUrls: string[] = [];
    for (const p of [1, 2, 3]) {
      const url =
        p === 1
          ? 'https://www.gallito.com.uy/inmuebles/san-jose!cant=80'
          : `https://www.gallito.com.uy/inmuebles/san-jose!cant=80?pag=${p}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 22000 });
        const pageUrls: string[] = await page.evaluate(() => {
          const articles = Array.from(document.querySelectorAll('article'));
          const links: string[] = [];
          for (const art of articles) {
            const a = art.querySelector('a');
            if (!a || !a.href || !/\d{7,8}$/.test(a.href)) continue;
            // Descartar inmediatamente tarjetas que ya exhiben logo de inmobiliaria
            const hasAgencyLogo = Array.from(art.querySelectorAll('img')).some((img) =>
              img.src.includes('/fotosavi/100x100/')
            );
            if (!hasAgencyLogo) {
              links.push(a.href);
            }
          }
          return Array.from(new Set(links));
        });

        if (pageUrls.length === 0) break;
        gallitoCandidateUrls.push(...pageUrls);
      } catch {
        break;
      }
    }

    const uniqueGallitoUrls = Array.from(new Set(gallitoCandidateUrls));
    console.log(`[RADAR-DUENOS] Analizando en paralelo ${uniqueGallitoUrls.length} avisos candidatos en El Gallito...`);

    const clientPropertyCounts = new Map<string, number>();
    const rawGallitoCandidates: Array<IncomingOwnerListing & { clte: string; description: string }> = [];

    // Procesar en lotes paralelos de 8 dentro del contexto del navegador (tarda ~4 segundos en total)
    const batchSize = 8;
    for (let i = 0; i < uniqueGallitoUrls.length; i += batchSize) {
      const batch = uniqueGallitoUrls.slice(i, i + batchSize);
      const batchDetails = await page.evaluate(async (urls: string[]) => {
        const w = window as any;
        const parser = new DOMParser();

        const results = await Promise.all(
          urls.map(async (u) => {
            try {
              const res = await fetch(u, { credentials: 'include' });
              if (!res.ok) return null;
              const html = await res.text();
              const doc = parser.parseFromString(html, 'text/html');

              const inmoName = doc.querySelector('#ficha_inmobiliaria p.text-gray-900')?.textContent?.trim() || '';
              if (inmoName) {
                return { u, isAgency: true, inmoName };
              }

              const cod = (doc.getElementById('HfCodigoAviso') as HTMLInputElement)?.value || '';
              const clte = (doc.getElementById('HfCodigoCliente') as HTMLInputElement)?.value || '';
              if (!cod) return null;

              let phone = '';
              try {
                const datos = `${cod}-${clte}-Ver Telefono Whatsapp`;
                const raw = w.AjaxEnviar ? w.AjaxEnviar('VerContacto', datos) : null;
                if (raw) {
                  const parsed = JSON.parse(raw);
                  phone = parsed.telefono || parsed.fTelefono || '';
                }
              } catch {}

              const title =
                (doc.getElementById('HTitulo') as HTMLInputElement)?.value ||
                doc.querySelector('h1')?.textContent?.trim() ||
                'Propiedad en San José';

              const fullText = (doc.body?.innerText || doc.body?.textContent || '').replace(/\s+/g, ' ');

              // Extraer únicamente el bloque de descripción del aviso (sin menús ni pie de página del portal)
              let cleanDesc = '';
              const descStart = fullText.indexOf('Descripción');
              const descEnd = fullText.indexOf('Características generales');
              if (descStart !== -1) {
                cleanDesc = fullText.slice(descStart, descEnd !== -1 ? descEnd : descStart + 2000);
              } else {
                cleanDesc = fullText.slice(0, 2500);
              }

              const priceMatch = fullText.match(/(U\$S|USD|\$U|\$)\s*([\d.]+)/i);
              const priceCurrency: 'USD' | 'UYU' =
                priceMatch && (priceMatch[1].toUpperCase().includes('U$S') || priceMatch[1].toUpperCase().includes('USD'))
                  ? 'USD'
                  : 'UYU';
              const priceAmount = priceMatch ? Number(priceMatch[2].replace(/\./g, '')) : 0;

              const m2Match = fullText.match(/(\d+)\s*m²/i);
              const dormMatch = fullText.match(/(\d+)\s*Dormitorio/i);
              const banoMatch = fullText.match(/(\d+)\s*Baño/i);

              return {
                u,
                isAgency: false,
                cod,
                clte,
                title,
                priceAmount,
                priceCurrency,
                phone,
                m2: m2Match ? Number(m2Match[1]) : undefined,
                bedrooms: dormMatch ? Number(dormMatch[1]) : undefined,
                bathrooms: banoMatch ? Number(banoMatch[1]) : undefined,
                cleanDesc,
              };
            } catch {
              return null;
            }
          })
        );

        return results.filter(Boolean);
      }, batch);

      for (const detail of batchDetails) {
        if (!detail || detail.isAgency || !detail.cod) continue;

        if (detail.clte) {
          clientPropertyCounts.set(detail.clte, (clientPropertyCounts.get(detail.clte) || 0) + 1);
        }

        const u = detail.u;
        let phone = detail.phone || extractPhoneFromText(detail.cleanDesc);

        // Si es dueño directo y el teléfono no estaba en el HTML plano, abrir la ficha para ejecutar AjaxEnviar('VerContacto')
        if (!phone) {
          try {
            await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 15000 });
            phone = await page.evaluate(
              ({ cod, clte }: { cod: string; clte: string }) => {
                const w = window as any;
                try {
                  const raw = w.AjaxEnviar ? w.AjaxEnviar('VerContacto', `${cod}-${clte}-Ver Telefono Whatsapp`) : null;
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    return parsed.telefono || parsed.fTelefono || '';
                  }
                } catch {}
                return '';
              },
              { cod: detail.cod, clte: detail.clte }
            );
          } catch {}
        }

        const isAlquiler = u.includes('/alquiler-') || detail.title.toLowerCase().includes('alquiler');
        const operation: 'venta' | 'alquiler' = isAlquiler ? 'alquiler' : 'venta';
        const category = normalizeCategory(u, detail.title);
        const neighborhood = normalizeNeighborhood(u, detail.title, detail.cleanDesc);
        const contactPhone = phone || extractPhoneFromText(detail.cleanDesc);

        rawGallitoCandidates.push({
          id: `gallito-${detail.cod}`,
          clte: detail.clte,
          description: detail.cleanDesc,
          title: detail.title,
          operation,
          category,
          neighborhood,
          city: neighborhood === 'Ciudad del Plata' || neighborhood === 'Playa Pascual' ? 'Ciudad del Plata' : 'San José de Mayo',
          department: 'San José',
          priceAmount: detail.priceAmount,
          priceCurrency: detail.priceCurrency,
          sourceName: 'Gallito Luis (Trato Directo)',
          sourceUrl: u,
          contactName: 'Dueño Particular',
          contactPhone,
          builtAreaM2: category !== 'terreno' && category !== 'chacra' ? detail.m2 : undefined,
          plotAreaM2: category === 'terreno' || category === 'chacra' ? detail.m2 : undefined,
          bedrooms: detail.bedrooms,
          bathrooms: detail.bathrooms,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Filtrar candidatos de El Gallito contra multi-propiedad (>2 avisos = inmobiliaria) y palabras clave
    for (const cand of rawGallitoCandidates) {
      const countForClient = cand.clte ? clientPropertyCounts.get(cand.clte) || 1 : 1;
      if (countForClient > 2) {
        console.log(`[RADAR-DUENOS] Descartado anunciante con múltiples propiedades (${countForClient}) en Gallito: ${cand.title}`);
        continue;
      }

      const sigCheck = detectCompetitorSignatures({
        phone: cand.contactPhone,
        title: cand.title,
        description: cand.description,
      });
      if (sigCheck.isCompetitor) {
        console.log(`[RADAR-DUENOS] Descartado por firma de competencia en Gallito (${sigCheck.reason}): ${cand.title}`);
        continue;
      }

      owners.push(cand);
    }

    console.log(`[RADAR-DUENOS] El Gallito finalizó: ${owners.length} dueños directos con teléfono capturados.`);
  } catch (err) {
    console.warn('[RADAR-DUENOS] Aviso durante escaneo Playwright de El Gallito:', err);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }

  // ===========================================================================
  // B. ESCANEO DE MERCADO LIBRE URUGUAY (Usando Perfil Persistente si existe)
  // ===========================================================================
  let mlContext: any = null;
  try {
    if (fs.existsSync(ML_PROFILE_DIR)) {
      console.log('[RADAR-DUENOS] Revisando Mercado Libre San José (Dueño Directo) con sesión local...');
      mlContext = await pw.chromium.launchPersistentContext(ML_PROFILE_DIR, {
        channel: 'chrome',
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
          '--disable-blink-features=AutomationControlled',
          '--window-position=-2400,-2400',
          '--window-size=1280,800',
        ],
        locale: 'es-UY',
      });

      await mlContext.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      });

      const mlPage = mlContext.pages()[0] || (await mlContext.newPage());
      const mlUrls = [
        { op: 'venta' as const, url: 'https://listado.mercadolibre.com.uy/inmuebles/dueno-vende-san-jose' },
        { op: 'venta' as const, url: 'https://listado.mercadolibre.com.uy/inmuebles/trato-directo-san-jose' },
        { op: 'alquiler' as const, url: 'https://listado.mercadolibre.com.uy/inmuebles/alquiler-dueno-san-jose' },
      ];

      const seenMlIds = new Set<string>();
      const mlCandidates: Array<{
        id: string;
        href: string;
        title: string;
        op: 'venta' | 'alquiler';
        priceAmount: number;
        priceCurrency: 'USD' | 'UYU';
        locationText: string;
      }> = [];

      for (const entry of mlUrls) {
        try {
          await mlPage.goto(entry.url, { waitUntil: 'domcontentloaded', timeout: 22000 });
          if (mlPage.url().includes('account-verification') || mlPage.url().includes('login')) {
            console.log('[RADAR-DUENOS] Mercado Libre requiere iniciar sesión (ejecutar conectar-sesion-mercadolibre.bat).');
            break;
          }

          try {
            await mlPage.waitForSelector('.poly-card, .ui-search-layout__item', { timeout: 7500 });
          } catch {
            continue;
          }

          const mlItems = await mlPage.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.poly-card, .ui-search-layout__item'));
            return cards.slice(0, 35).map((card) => {
              const a = card.querySelector('a') as HTMLAnchorElement | null;
              const title = card.querySelector('h2, .poly-component__title')?.textContent?.trim() || '';
              const priceText = card.querySelector('.andes-money-amount__fraction')?.textContent?.trim() || '0';
              const currencyText = card.querySelector('.andes-money-amount__currency-symbol')?.textContent?.trim() || 'U$S';
              const locationText =
                card.querySelector('.poly-component__location, .ui-search-item__location')?.textContent?.trim() || '';
              const sellerText =
                card.querySelector('.poly-component__seller, .ui-search-official-store-label')?.textContent?.trim() || '';
              return {
                href: a?.href ? a.href.split('#')[0] : '',
                title,
                priceAmount: Number(priceText.replace(/\./g, '')),
                priceCurrency:
                  currencyText.includes('U$S') || currencyText.includes('USD') || currencyText.includes('US$')
                    ? 'USD'
                    : 'UYU',
                locationText,
                sellerText,
              };
            });
          });

          for (const item of mlItems) {
            if (!item.href || !item.title) continue;
            if (item.sellerText) continue;
            // Excluir vehículos o productos que no sean inmuebles
            if (!/\/\/(casa|apartamento|terreno|inmueble)\.mercadolibre\.com\.uy\//i.test(item.href)) continue;

            // Verificar que pertenezca efectivamente al Departamento de San José y no a Montevideo/Maldonado
            const locAndTitle = `${item.locationText} ${item.title}`.toLowerCase();
            const isSanJose =
              /san jos[eé]|ciudad del plata|playa pascual|libertad|ecilda|rodr[ií]guez|kiy[uú]|raigon|puntas de valdez|delta del tigre|villa ol[ií]mpica|boca del cufr[eé]|ituzaing[oó]/i.test(
                locAndTitle
              );
            const isOtherDept = /montevideo|maldonado|punta del este|canelones|colonia|rocha/i.test(
              item.locationText.toLowerCase()
            );
            if (!isSanJose || isOtherDept) continue;

            const sigCheck = detectCompetitorSignatures({
              title: item.title,
              contactName: item.sellerText,
            });
            if (sigCheck.isCompetitor) continue;

            const mluMatch = item.href.match(/MLU-?(\d+)/i);
            const id = mluMatch ? `mlu-${mluMatch[1]}` : `mlu-${Buffer.from(item.href).toString('base64').slice(0, 12)}`;
            if (seenMlIds.has(id)) continue;
            seenMlIds.add(id);

            const isAlquilerItem =
              entry.op === 'alquiler' || /\balquiler|alquilo\b/i.test(item.title);

            mlCandidates.push({
              id,
              href: item.href,
              title: item.title,
              op: isAlquilerItem ? 'alquiler' : 'venta',
              priceAmount: item.priceAmount,
              priceCurrency: item.priceCurrency as 'USD' | 'UYU',
              locationText: item.locationText,
            });
          }
        } catch {
          // Continuar con la siguiente URL de ML
        }
      }

      console.log(`[RADAR-DUENOS] Verificando ${mlCandidates.length} fichas candidatas en Mercado Libre San José...`);

      // Inspeccionar cada ficha candidata en ML para obtener el nombre real del dueño, descripción y filtrar multi-propiedad/inmobiliarias
      let mlAddedCount = 0;
      for (const cand of mlCandidates) {
        try {
          await mlPage.goto(cand.href, { waitUntil: 'domcontentloaded', timeout: 18000 });
          await mlPage.waitForTimeout(1200);

          const detail = await mlPage.evaluate(() => {
            const description =
              document.querySelector('.ui-pdp-description__content')?.textContent?.trim() || '';
            const sellerHeader =
              document
                .querySelector('.ui-vip-profile-info h3, .ui-vip-profile-info, .ui-pdp-seller__header, .ui-box-component-pdp__seller')
                ?.textContent?.trim() || '';
            const hasCatalogLink = Array.from(document.querySelectorAll('a')).some(
              (a) =>
                /ver propiedades|ver m[aá]s propiedades|inmuebles\/_CustId_/i.test(
                  `${a.textContent || ''} ${a.href || ''}`
                )
            );
            const m2Match = document.body?.innerText?.match(/(\d+)\s*m²/i);
            const dormMatch = document.body?.innerText?.match(/(\d+)\s*dormitorio/i);
            const banoMatch = document.body?.innerText?.match(/(\d+)\s*baño/i);

            return {
              description,
              sellerHeader: sellerHeader.replace(/\s+/g, ' ').slice(0, 80),
              hasCatalogLink,
              m2: m2Match ? Number(m2Match[1]) : undefined,
              bedrooms: dormMatch ? Number(dormMatch[1]) : undefined,
              bathrooms: banoMatch ? Number(banoMatch[1]) : undefined,
            };
          });

          // Si tiene link a catálogo de múltiples propiedades ("Ver propiedades"), es inmobiliaria o empresa constructora
          if (detail.hasCatalogLink) {
            console.log(
              `[RADAR-DUENOS] Descartado en ML por tener catálogo comercial ("Ver propiedades"): ${cand.title} (${detail.sellerHeader})`
            );
            continue;
          }

          const fullSigCheck = detectCompetitorSignatures({
            title: cand.title,
            description: detail.description,
            contactName: detail.sellerHeader,
          });
          if (fullSigCheck.isCompetitor) {
            console.log(
              `[RADAR-DUENOS] Descartado en ML por firma de inmobiliaria (${fullSigCheck.reason}): ${cand.title}`
            );
            continue;
          }

          const category = normalizeCategory(cand.href, cand.title);
          const neighborhood = normalizeNeighborhood(cand.locationText, cand.title, detail.description);
          const extractedPhone =
            extractPhoneFromText(detail.description) || extractPhoneFromText(cand.title);
          const cleanSellerName =
            detail.sellerHeader && detail.sellerHeader.length <= 40
              ? detail.sellerHeader
              : 'Dueño Particular';

          owners.push({
            id: cand.id,
            title: cand.title,
            operation: cand.op,
            category,
            neighborhood,
            city:
              neighborhood === 'Ciudad del Plata' || neighborhood === 'Playa Pascual'
                ? 'Ciudad del Plata'
                : 'San José de Mayo',
            department: 'San José',
            priceAmount: cand.priceAmount,
            priceCurrency: cand.priceCurrency,
            sourceName: 'Mercado Libre (Dueño)',
            sourceUrl: cand.href,
            contactName: cleanSellerName,
            contactPhone: extractedPhone,
            builtAreaM2: category !== 'terreno' && category !== 'chacra' ? detail.m2 : undefined,
            plotAreaM2: category === 'terreno' || category === 'chacra' ? detail.m2 : undefined,
            bedrooms: detail.bedrooms,
            bathrooms: detail.bathrooms,
            detectedAt: new Date().toISOString(),
          });
          mlAddedCount++;
        } catch {
          // Ignorar error puntual de ficha
        }
      }

      console.log(`[RADAR-DUENOS] Mercado Libre finalizó: ${mlAddedCount} dueños directos verificados en San José.`);
    }
  } catch (err) {
    console.warn('[RADAR-DUENOS] Aviso al revisar perfil Mercado Libre:', err);
  } finally {
    if (mlContext) {
      try {
        await mlContext.close();
      } catch {}
    }
  }

  return owners;
}

/**
 * Ejecuta el escaneo completo de Dueños Directos en el Departamento de San José,
 * purga avisos viejos de inmobiliarias competidoras y sincroniza con Neon Postgres + JSON local.
 */
export async function executeMarketScan() {
  console.log('[RADAR-DUENOS] Iniciando rastreo exclusivo de Dueños Vende en San José...');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const [infoCasasOwners, playwrightOwners] = await Promise.all([
    scanInfoCasasDirectOwners(),
    scanPortalsWithLocalPlaywright(),
  ]);

  const extracted: IncomingOwnerListing[] = [...playwrightOwners, ...infoCasasOwners];

  // Cargar base local actual
  let currentListings: MarketListing[] = [];
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      currentListings = JSON.parse(raw);
    }
  } catch {
    currentListings = [];
  }

  // Filtrar solo dueños directos previos (eliminar los 133 avisos de competencia)
  const existingOwnersOnly = currentListings.filter((l) => {
    if (l.origin !== 'dueno_directo') return false;
    const sig = detectCompetitorSignatures({
      phone: l.contactPhone,
      title: l.title,
      contactName: l.contactName,
    });
    return !sig.isCompetitor;
  });

  const existingMap = new Map<string, MarketListing>();
  existingOwnersOnly.forEach((l) => existingMap.set(l.id, l));

  let newEntriesCount = 0;
  let priceDropsCount = 0;

  for (const item of extracted) {
    const existing = existingMap.get(item.id);
    const normalizedPhone = item.contactPhone ? (normalizeUruguayPhone(item.contactPhone) || item.contactPhone) : undefined;

    if (existing) {
      const oldPrice = existing.priceAmount;
      const newPrice = item.priceAmount;
      const daysOnMarket = existing.daysOnMarket + 1;
      const priceHistory = [...(existing.priceHistory || [])];
      let opportunityReason = existing.opportunityReason;

      if (newPrice > 0 && oldPrice > 0 && newPrice < oldPrice) {
        const dropPct = Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2));
        priceDropsCount++;
        opportunityReason = `El propietario bajó el precio de ${existing.priceCurrency} ${oldPrice.toLocaleString()} a ${item.priceCurrency} ${newPrice.toLocaleString()} (${dropPct}%).`;
        priceHistory.push({
          date: dateStr,
          priceAmount: newPrice,
          priceCurrency: item.priceCurrency,
          dropPercentage: dropPct,
        });
      }

      existingMap.set(item.id, {
        ...existing,
        title: item.title || existing.title,
        priceAmount: newPrice || existing.priceAmount,
        priceCurrency: item.priceCurrency || existing.priceCurrency,
        sourceUrl: item.sourceUrl || existing.sourceUrl,
        contactName: existing.contactName && existing.contactName !== 'Dueño Particular' ? existing.contactName : (item.contactName || existing.contactName),
        contactPhone: existing.contactPhone || normalizedPhone,
        builtAreaM2: item.builtAreaM2 || existing.builtAreaM2,
        plotAreaM2: item.plotAreaM2 || existing.plotAreaM2,
        bedrooms: item.bedrooms || existing.bedrooms,
        bathrooms: item.bathrooms || existing.bathrooms,
        estimatedPricePerM2: item.estimatedPricePerM2 || existing.estimatedPricePerM2,
        daysOnMarket,
        priceHistory,
        isOpportunity: true,
        opportunityReason,
        updatedAt: now.toISOString(),
      });
    } else {
      newEntriesCount++;
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
        origin: 'dueno_directo',
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        detectedAt: item.detectedAt || now.toISOString(),
        daysOnMarket: 1,
        status: 'detectado',
        contactName: item.contactName || 'Dueño Particular',
        contactPhone: normalizedPhone,
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
        isOpportunity: true,
        opportunityReason: 'Dueño directo verificado en San José para captación.',
        updatedAt: now.toISOString(),
      };
      existingMap.set(item.id, newListing);
    }
  }

  const finalListings = Array.from(existingMap.values()).sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );

  // Guardar en archivo JSON local
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(finalListings, null, 2), 'utf8');
  } catch (err) {
    console.warn('[RADAR-DUENOS] No se pudo escribir archivo local:', err);
  }

  // Sincronizar con Neon PostgreSQL (purgando competencia y guardando todos los dueños directos)
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connectionString) {
    try {
      const sql = neon(connectionString);
      // 1. Limpiar de la base de datos todos los avisos viejos de inmobiliarias de la competencia
      await sql`DELETE FROM market_listings WHERE origin != 'dueno_directo';`;

      // 2. Insertar o actualizar cada dueño directo detectado (preservando status y notas si ya fue gestionado en la web)
      for (const listing of finalListings) {
        await sql`
          INSERT INTO market_listings (
            id, title, operation, category, neighborhood, city, department,
            price_amount, price_currency, origin, competitor_name, source_name, source_url,
            detected_at, days_on_market, status, internal_notes, contact_name, contact_phone,
            built_area_m2, plot_area_m2, bedrooms, bathrooms, estimated_price_per_m2,
            price_history, is_opportunity, opportunity_reason, updated_at
          ) VALUES (
            ${listing.id}, ${listing.title}, ${listing.operation}, ${listing.category}, ${listing.neighborhood}, ${listing.city}, ${listing.department},
            ${listing.priceAmount}, ${listing.priceCurrency}, 'dueno_directo', ${null}, ${listing.sourceName}, ${listing.sourceUrl || null},
            ${listing.detectedAt}, ${listing.daysOnMarket}, ${listing.status}, ${listing.internalNotes || null}, ${listing.contactName || null}, ${listing.contactPhone || null},
            ${listing.builtAreaM2 || null}, ${listing.plotAreaM2 || null}, ${listing.bedrooms || null}, ${listing.bathrooms || null}, ${listing.estimatedPricePerM2 || null},
            ${JSON.stringify(listing.priceHistory || [])}, ${true}, ${listing.opportunityReason || null}, CURRENT_TIMESTAMP
          ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            price_amount = EXCLUDED.price_amount,
            price_currency = EXCLUDED.price_currency,
            source_url = COALESCE(EXCLUDED.source_url, market_listings.source_url),
            contact_phone = COALESCE(market_listings.contact_phone, EXCLUDED.contact_phone),
            price_history = EXCLUDED.price_history,
            updated_at = CURRENT_TIMESTAMP;
        `;
      }
      console.log(`[RADAR-DUENOS] Sincronizados ${finalListings.length} dueños directos en Neon PostgreSQL.`);
    } catch (e) {
      console.warn('[RADAR-DUENOS] Error sincronizando con Neon Postgres:', e);
    }
  }

  return {
    totalListings: finalListings.length,
    newEntriesCount,
    priceDropsCount,
    directOwnersCount: finalListings.length,
  };
}
