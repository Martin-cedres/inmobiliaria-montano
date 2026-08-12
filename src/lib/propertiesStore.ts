import fs from 'fs/promises';
import path from 'path';
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
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`;
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
        return rows.map((row: any) => ({
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
          },
          location: {
            department: row.department,
            city: row.city,
            neighborhood: row.neighborhood,
            address: row.address,
            lat: row.lat ? Number(row.lat) : -34.3375,
            lng: row.lng ? Number(row.lng) : -56.7136,
            isExactLocation: row.is_exact_location ?? false,
            radiusMeters: row.radius_meters ? Number(row.radius_meters) : 300,
          },
          features: {
            bedrooms: row.bedrooms,
            bathrooms: row.bathrooms,
            floors: row.floors,
            builtAreaM2: row.built_area_m2 ? Number(row.built_area_m2) : undefined,
            plotAreaM2: row.plot_area_m2 ? Number(row.plot_area_m2) : undefined,
            isHectares: row.is_hectares,
            garage: row.garage,
            barbecue: row.barbecue,
            pool: row.pool,
            perimeterFence: row.perimeter_fence,
            bankCreditEligible: row.bank_credit_eligible,
            phRegime: row.ph_regime,
            oseWater: row.ose_water,
            sanitation: row.sanitation,
          },
          guarantees: Array.isArray(row.guarantees) ? row.guarantees : [],
          images: Array.isArray(row.images) ? row.images : [],
          featured: row.featured,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
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
 * Guarda una nueva propiedad en la base de datos o en memoria/json
 */
export async function saveProperty(property: Property): Promise<Property> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    const sql = getDbClient();
    try {
      await ensureTablesExist(sql);
      await sql`
        INSERT INTO properties (
          id, code_ref, title, slug, description, operation, category, status,
          price_amount, price_currency, price_period, price_drop, original_amount,
          department, city, neighborhood, address,
          bedrooms, bathrooms, floors, built_area_m2, plot_area_m2,
          garage, barbecue, bank_credit_eligible, ph_regime, ose_water, sanitation,
          guarantees, images, featured
        ) VALUES (
          ${property.id}, ${property.codeRef}, ${property.title}, ${property.slug}, ${property.description}, ${property.operation}, ${property.category}, ${property.status},
          ${property.price.amount}, ${property.price.currency}, ${property.price.period || null}, ${property.price.priceDrop || false}, ${property.price.originalAmount || null},
          ${property.location.department}, ${property.location.city}, ${property.location.neighborhood}, ${property.location.address || null},
          ${property.features.bedrooms || null}, ${property.features.bathrooms || null}, ${property.features.floors || null}, ${property.features.builtAreaM2 || null}, ${property.features.plotAreaM2 || null},
          ${property.features.garage || false}, ${property.features.barbecue || false}, ${property.features.bankCreditEligible || false}, ${property.features.phRegime || false}, ${property.features.oseWater || false}, ${property.features.sanitation || false},
          ${JSON.stringify(property.guarantees || [])}, ${JSON.stringify(property.images || [])}, ${property.featured}
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          price_amount = EXCLUDED.price_amount,
          description = EXCLUDED.description,
          images = EXCLUDED.images,
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
