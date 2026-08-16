import fs from 'fs/promises';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { Property, PropertyStatus } from '@/types/property';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { getDbClient } from './db';

const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'db', 'properties.json');

let memoryProperties: Property[] | null = null;
let tablesInitialized = false;

async function ensureTablesExist(sql: any) {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(64) PRIMARY KEY,
        code_ref VARCHAR(32) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        operation VARCHAR(32) NOT NULL,
        category VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'disponible',
        price_amount NUMERIC(12, 2) NOT NULL,
        price_currency VARCHAR(8) NOT NULL DEFAULT 'USD',
        price_period VARCHAR(16),
        price_drop BOOLEAN DEFAULT FALSE,
        original_amount NUMERIC(12, 2),
        department VARCHAR(64) NOT NULL DEFAULT 'San José',
        city VARCHAR(64) NOT NULL DEFAULT 'San José de Mayo',
        neighborhood VARCHAR(64) NOT NULL,
        address VARCHAR(255),
        bedrooms INT,
        bathrooms INT,
        floors INT,
        built_area_m2 NUMERIC(10, 2),
        plot_area_m2 NUMERIC(10, 2),
        is_hectares BOOLEAN DEFAULT FALSE,
        garage BOOLEAN DEFAULT FALSE,
        barbecue BOOLEAN DEFAULT FALSE,
        pool BOOLEAN DEFAULT FALSE,
        perimeter_fence BOOLEAN DEFAULT FALSE,
        bank_credit_eligible BOOLEAN DEFAULT FALSE,
        ph_regime BOOLEAN DEFAULT FALSE,
        ose_water BOOLEAN DEFAULT FALSE,
        sanitation BOOLEAN DEFAULT FALSE,
        guarantees JSONB DEFAULT '[]'::jsonb,
        images JSONB DEFAULT '[]'::jsonb,
        lat NUMERIC(10, 6),
        lng NUMERIC(10, 6),
        is_exact_location BOOLEAN DEFAULT FALSE,
        radius_meters INT DEFAULT 300,
        has_location BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_mode VARCHAR(32) DEFAULT 'visible';`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS lat NUMERIC(10, 6);`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS lng NUMERIC(10, 6);`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_exact_location BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS radius_meters INT DEFAULT 300;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS floors INT DEFAULT 1;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS built_area_m2 NUMERIC(10, 2);`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_area_m2 NUMERIC(10, 2);`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS front_meters NUMERIC(10, 2);`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS car_access BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS garden BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS fondo BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS patio BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS barbacoa BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS parrillero BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS cochera BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS cochera_techada BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS wood_stove_or_ac BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS ute_electric BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS fiber_optic BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_well_or_pond BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS titles_up_to_date BOOLEAN DEFAULT TRUE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS accepts_trade_in BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS security_system BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS paved_street BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS shed_or_corral BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS coneat_index INT;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_title TEXT;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_description TEXT;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS whatsapp_clicks_count INT DEFAULT 0;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS shares_count INT DEFAULT 0;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS last_google_notified_at TIMESTAMP WITH TIME ZONE;`;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS google_indexing_status TEXT DEFAULT 'pending';`;
    tablesInitialized = true;
  } catch (err) {
    console.warn('Error al auto-crear tablas en Neon Postgres:', err);
  }
}

/**
 * Carga las propiedades desde Neon Postgres (si está configurado) 
 * o desde el archivo local JSON persistente usando fs.promises.
 */
export async function getAllProperties(): Promise<Property[]> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureTablesExist(sql);
      const rows = await sql`SELECT * FROM properties ORDER BY created_at DESC;`;
      if (rows && rows.length > 0) {
        return rows.map((row: any) => {
          const latVal = row.lat ? Number(row.lat) : -34.3375;
          const lngVal = row.lng ? Number(row.lng) : -56.7136;

          return {
            id: row.id,
            codeRef: row.code_ref,
            title: row.title,
            slug: row.slug,
            description: row.description,
            operation: row.operation,
            category: row.category,
            status: row.status,
            price: {
              amount: Number(row.price_amount),
              currency: row.price_currency,
              period: row.price_period,
              priceDrop: row.price_drop,
              originalAmount: row.original_amount ? Number(row.original_amount) : undefined,
              priceMode: row.price_mode || 'visible',
            },
            location: {
              department: row.department || 'San José',
              city: row.city || 'San José de Mayo',
              neighborhood: row.neighborhood || 'Centro',
              address: row.address,
              lat: latVal,
              lng: lngVal,
              coordinates: { lat: latVal, lng: lngVal },
              isExactLocation: row.is_exact_location ?? false,
              radiusMeters: row.radius_meters ? Number(row.radius_meters) : 300,
              hasLocation: row.has_location !== false,
            },
            features: {
              bedrooms: row.bedrooms,
              bathrooms: row.bathrooms,
              floors: row.floors,
              builtAreaM2: row.built_area_m2 ? Number(row.built_area_m2) : undefined,
              plotAreaM2: row.plot_area_m2 ? Number(row.plot_area_m2) : undefined,
              frontMeters: row.front_meters ? Number(row.front_meters) : undefined,
              carAccess: row.car_access,
              garage: row.garage,
              cochera: row.cochera ?? row.car_access,
              cocheraTechada: row.cochera_techada ?? row.garage,
              barbecue: row.barbecue,
              barbacoa: row.barbacoa,
              parrillero: row.parrillero ?? row.barbecue,
              pool: row.pool,
              garden: row.garden,
              fondo: row.fondo ?? row.garden,
              patio: row.patio,
              woodStoveOrAC: row.wood_stove_or_ac,
              petFriendly: row.pet_friendly,
              perimeterFence: row.perimeter_fence,
              bankCreditEligible: row.bank_credit_eligible,
              phRegime: row.ph_regime,
              oseWater: row.ose_water,
              uteElectric: row.ute_electric,
              sanitation: row.sanitation,
              fiberOptic: row.fiber_optic,
              waterWellOrPond: row.water_well_or_pond,
              titlesUpToDate: row.titles_up_to_date,
              acceptsTradeIn: row.accepts_trade_in,
              securitySystem: row.security_system,
              pavedStreet: row.paved_street,
              shedOrCorral: row.shed_or_corral,
              coneatIndex: row.coneat_index ? Number(row.coneat_index) : undefined,
            },
            guarantees: Array.isArray(row.guarantees) ? row.guarantees : [],
            images: Array.isArray(row.images) ? row.images : [],
            seoTitle: row.seo_title || undefined,
            seoDescription: row.seo_description || undefined,
            viewsCount: Number(row.views_count || 0),
            whatsappClicksCount: Number(row.whatsapp_clicks_count || 0),
            sharesCount: Number(row.shares_count || 0),
            lastGoogleNotifiedAt: row.last_google_notified_at || undefined,
            googleIndexingStatus: row.google_indexing_status || 'pending',
            featured: row.featured,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        });
      }
    } catch (dbErr: any) {
      console.warn('Error al consultar Neon Postgres, usando fallback local/memoria:', dbErr?.message || dbErr);
    }
  }

  if (memoryProperties && memoryProperties.length > 0) {
    return memoryProperties;
  }

  try {
    // Fallback: Leer usando fs.promises.readFile (asíncrono no bloqueante)
    const fileContent = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
    const rawProperties: any[] = JSON.parse(fileContent);
    const properties: Property[] = rawProperties.map((p) => ({
      ...p,
      images: Array.isArray(p.images)
        ? p.images.map((img: any, idx: number) =>
            typeof img === 'string'
              ? { id: `img-${idx}`, blobUrl: img, webpUrl: img, thumbnailUrl: img, altText: p.title || 'Propiedad Inmobiliaria Montaño', isMain: idx === 0 }
              : img
          )
        : [],
    }));
    memoryProperties = properties;
    return properties;
  } catch (error) {
    if (memoryProperties && memoryProperties.length > 0) {
      return memoryProperties;
    }
    console.warn('Cargando MOCK_PROPERTIES como fallback debido a:', error);
    memoryProperties = MOCK_PROPERTIES;
    return MOCK_PROPERTIES;
  }
}

/**
 * ISR & Data Cache: Obtiene todas las propiedades con almacenamiento en caché perimetral (Edge/Data Cache)
 * Revalidación automática periódica: 24 horas (86.400 segundos)
 * Invalidación On-Demand: revalidateTag('properties')
 */
export const getCachedProperties = unstable_cache(
  async (): Promise<Property[]> => {
    return getAllProperties();
  },
  ['properties-all'],
  {
    revalidate: 86400, // 24 horas
    tags: ['properties'],
  }
);

/**
 * ISR & Data Cache: Obtiene una propiedad específica por su slug
 * Revalidación automática periódica: 24 horas (86.400 segundos)
 * Invalidación On-Demand: revalidateTag('properties') o revalidateTag(`property-${slug}`)
 */
export async function getCachedPropertyBySlug(slug: string): Promise<Property | null> {
  const getCached = unstable_cache(
    async () => {
      const all = await getAllProperties();
      return all.find((p) => p.slug === slug) || null;
    },
    [`property-slug-${slug}`],
    {
      revalidate: 86400, // 24 horas
      tags: ['properties', `property-${slug}`],
    }
  );
  return getCached();
}

/**
 * Guarda una nueva propiedad en la base de datos o en memoria/json
 */
export async function saveProperty(property: Property): Promise<Property> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureTablesExist(sql);
      const latVal = property.location.coordinates?.lat ?? (property.location as any).lat ?? -34.3375;
      const lngVal = property.location.coordinates?.lng ?? (property.location as any).lng ?? -56.7136;

      await sql`
        INSERT INTO properties (
          id, code_ref, title, slug, description, operation, category, status,
          price_amount, price_currency, price_period, price_drop, original_amount, price_mode,
          department, city, neighborhood, address,
          lat, lng, is_exact_location, radius_meters, has_location,
          bedrooms, bathrooms, floors, built_area_m2, plot_area_m2, front_meters,
          car_access, garage, cochera, cochera_techada, barbecue, barbacoa, parrillero, pool, garden, fondo, patio, wood_stove_or_ac, pet_friendly,
          perimeter_fence, bank_credit_eligible, ph_regime, ose_water, ute_electric, sanitation, fiber_optic,
          water_well_or_pond, titles_up_to_date, accepts_trade_in, security_system, paved_street, shed_or_corral, coneat_index,
          guarantees, images, seo_title, seo_description, featured
        ) VALUES (
          ${property.id}, ${property.codeRef}, ${property.title}, ${property.slug}, ${property.description}, ${property.operation}, ${property.category}, ${property.status},
          ${property.price.amount}, ${property.price.currency}, ${property.price.period || null}, ${property.price.priceDrop || false}, ${property.price.originalAmount || null}, ${property.price.priceMode || 'visible'},
          ${property.location.department}, ${property.location.city}, ${property.location.neighborhood}, ${property.location.address || null},
          ${latVal}, ${lngVal}, ${property.location.isExactLocation ?? false}, ${property.location.radiusMeters || 300}, ${property.location.hasLocation !== false},
          ${property.features.bedrooms || null}, ${property.features.bathrooms || null}, ${property.features.floors || null}, ${property.features.builtAreaM2 || null}, ${property.features.plotAreaM2 || null}, ${property.features.frontMeters || null},
          ${property.features.carAccess || false}, ${property.features.garage || false}, ${property.features.cochera || false}, ${property.features.cocheraTechada || false}, ${property.features.barbecue || false}, ${property.features.barbacoa || false}, ${property.features.parrillero || false}, ${property.features.pool || false}, ${property.features.garden || false}, ${property.features.fondo || false}, ${property.features.patio || false}, ${property.features.woodStoveOrAC || false}, ${property.features.petFriendly || false},
          ${property.features.perimeterFence || false}, ${property.features.bankCreditEligible || false}, ${property.features.phRegime || false}, ${property.features.oseWater || false}, ${property.features.uteElectric || false}, ${property.features.sanitation || false}, ${property.features.fiberOptic || false},
          ${property.features.waterWellOrPond || false}, ${property.features.titlesUpToDate || false}, ${property.features.acceptsTradeIn || false}, ${property.features.securitySystem || false}, ${property.features.pavedStreet || false}, ${property.features.shedOrCorral || false}, ${property.features.coneatIndex || null},
          ${JSON.stringify(property.guarantees || [])}, ${JSON.stringify(property.images || [])}, ${property.seoTitle || null}, ${property.seoDescription || null}, ${property.featured}
        ) ON CONFLICT (id) DO UPDATE SET
          code_ref = EXCLUDED.code_ref,
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          operation = EXCLUDED.operation,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          price_amount = EXCLUDED.price_amount,
          price_currency = EXCLUDED.price_currency,
          price_period = EXCLUDED.price_period,
          price_drop = EXCLUDED.price_drop,
          original_amount = EXCLUDED.original_amount,
          price_mode = EXCLUDED.price_mode,
          department = EXCLUDED.department,
          city = EXCLUDED.city,
          neighborhood = EXCLUDED.neighborhood,
          address = EXCLUDED.address,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          is_exact_location = EXCLUDED.is_exact_location,
          radius_meters = EXCLUDED.radius_meters,
          has_location = EXCLUDED.has_location,
          bedrooms = EXCLUDED.bedrooms,
          bathrooms = EXCLUDED.bathrooms,
          floors = EXCLUDED.floors,
          built_area_m2 = EXCLUDED.built_area_m2,
          plot_area_m2 = EXCLUDED.plot_area_m2,
          front_meters = EXCLUDED.front_meters,
          car_access = EXCLUDED.car_access,
          garage = EXCLUDED.garage,
          cochera = EXCLUDED.cochera,
          cochera_techada = EXCLUDED.cochera_techada,
          barbecue = EXCLUDED.barbecue,
          barbacoa = EXCLUDED.barbacoa,
          parrillero = EXCLUDED.parrillero,
          pool = EXCLUDED.pool,
          garden = EXCLUDED.garden,
          fondo = EXCLUDED.fondo,
          patio = EXCLUDED.patio,
          wood_stove_or_ac = EXCLUDED.wood_stove_or_ac,
          pet_friendly = EXCLUDED.pet_friendly,
          perimeter_fence = EXCLUDED.perimeter_fence,
          bank_credit_eligible = EXCLUDED.bank_credit_eligible,
          ph_regime = EXCLUDED.ph_regime,
          ose_water = EXCLUDED.ose_water,
          ute_electric = EXCLUDED.ute_electric,
          sanitation = EXCLUDED.sanitation,
          fiber_optic = EXCLUDED.fiber_optic,
          water_well_or_pond = EXCLUDED.water_well_or_pond,
          titles_up_to_date = EXCLUDED.titles_up_to_date,
          accepts_trade_in = EXCLUDED.accepts_trade_in,
          security_system = EXCLUDED.security_system,
          paved_street = EXCLUDED.paved_street,
          shed_or_corral = EXCLUDED.shed_or_corral,
          coneat_index = EXCLUDED.coneat_index,
          guarantees = EXCLUDED.guarantees,
          images = EXCLUDED.images,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          featured = EXCLUDED.featured,
          updated_at = CURRENT_TIMESTAMP;
      `;
      return property;
    } catch (sqlErr: any) {
      console.error('Error guardando en Neon Postgres:', sqlErr?.message || sqlErr);
    }
  }

  // Fallback Local JSON / Memory:
  const properties = await getAllProperties();
  const existingIndex = properties.findIndex((p) => p.id === property.id);

  if (existingIndex >= 0) {
    properties[existingIndex] = { ...properties[existingIndex], ...property, updatedAt: new Date().toISOString() };
  } else {
    properties.unshift(property);
  }

  memoryProperties = [...properties];

  try {
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(properties, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Ignorando escritura en disco en entorno serverless read-only:', err);
  }

  return property;
}

/**
 * Actualiza el estado de una propiedad (ej. disponible -> reservado -> vendido)
 */
export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<Property | null> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    await sql`
      UPDATE properties 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id};
    `;
  }

  const properties = await getAllProperties();
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  properties[index].status = status;
  properties[index].updatedAt = new Date().toISOString();

  memoryProperties = [...properties];

  try {
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(properties, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Ignorando escritura en disco en entorno serverless read-only:', err);
  }

  return properties[index];
}

/**
 * Elimina una propiedad por ID
 */
export async function deletePropertyById(id: string): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    await sql`DELETE FROM properties WHERE id = ${id};`;
  }

  const properties = await getAllProperties();
  const filtered = properties.filter((p) => p.id !== id);
  memoryProperties = [...filtered];

  try {
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Ignorando escritura en disco en entorno serverless read-only:', err);
  }

  return true;
}

/**
 * Obtiene una propiedad por ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return properties.find((p) => p.id === id) || null;
}

/**
 * Incrementa atómicamente la métrica indicada ('view', 'whatsapp_click', 'share_click')
 */
export async function incrementPropertyMetric(
  identifier: string,
  eventType: 'view' | 'whatsapp_click' | 'share_click'
): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  const keyMap = {
    view: 'viewsCount',
    whatsapp_click: 'whatsappClicksCount',
    share_click: 'sharesCount',
  } as const;

  if (connectionString) {
    const sql = getDbClient();
    try {
      if (eventType === 'view') {
        await sql`
          UPDATE properties 
          SET views_count = COALESCE(views_count, 0) + 1 
          WHERE id = ${identifier} OR slug = ${identifier};
        `;
      } else if (eventType === 'whatsapp_click') {
        await sql`
          UPDATE properties 
          SET whatsapp_clicks_count = COALESCE(whatsapp_clicks_count, 0) + 1 
          WHERE id = ${identifier} OR slug = ${identifier};
        `;
      } else if (eventType === 'share_click') {
        await sql`
          UPDATE properties 
          SET shares_count = COALESCE(shares_count, 0) + 1 
          WHERE id = ${identifier} OR slug = ${identifier};
        `;
      }
    } catch (dbErr) {
      console.warn('Error incrementando métrica en Neon Postgres:', dbErr);
    }
  }

  const properties = await getAllProperties();
  const index = properties.findIndex((p) => p.id === identifier || p.slug === identifier);
  if (index >= 0) {
    const field = keyMap[eventType];
    properties[index][field] = (properties[index][field] || 0) + 1;
    memoryProperties = [...properties];

    try {
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(properties, null, 2), 'utf-8');
    } catch (err) {
      // Ignorar en serverless read-only
    }
    return true;
  }

  return false;
}

/**
 * Actualiza el estado de la notificación de indexación en Google
 */
export async function updateGoogleIndexingStatus(
  identifier: string,
  status: 'notified' | 'pending' | 'error',
  notifiedAt: string = new Date().toISOString()
): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await sql`
        UPDATE properties 
        SET 
          google_indexing_status = ${status},
          last_google_notified_at = ${notifiedAt}
        WHERE id = ${identifier} OR slug = ${identifier};
      `;
    } catch (dbErr) {
      console.warn('Error actualizando estado de indexación en Neon Postgres:', dbErr);
    }
  }

  const properties = await getAllProperties();
  const index = properties.findIndex((p) => p.id === identifier || p.slug === identifier);
  if (index >= 0) {
    properties[index].googleIndexingStatus = status;
    properties[index].lastGoogleNotifiedAt = notifiedAt;
    memoryProperties = [...properties];

    try {
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(properties, null, 2), 'utf-8');
    } catch (err) {
      // Ignorar en serverless read-only
    }
    return true;
  }

  return false;
}
