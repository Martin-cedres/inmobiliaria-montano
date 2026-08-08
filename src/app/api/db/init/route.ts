import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { MOCK_PROPERTIES } from '@/data/mockProperties';

export async function GET() {
  try {
    const sql = getDbClient();

    // 1. Crear Tabla de Propiedades
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
        common_expenses_amount NUMERIC(10, 2),
        guarantees JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Crear Tabla de Imágenes
    await sql`
      CREATE TABLE IF NOT EXISTS property_images (
        id VARCHAR(64) PRIMARY KEY,
        property_id VARCHAR(64) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        blob_url TEXT NOT NULL,
        webp_url TEXT NOT NULL,
        thumbnail_url TEXT NOT NULL,
        alt_text TEXT,
        is_main BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Crear Tabla de Leads / Tasaciones
    await sql`
      CREATE TABLE IF NOT EXISTS owner_leads (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        operation VARCHAR(32) NOT NULL,
        property_type VARCHAR(32) NOT NULL,
        neighborhood VARCHAR(128),
        notes TEXT,
        status VARCHAR(32) DEFAULT 'pendiente',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Crear Índices
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);`;

    // Seed mock properties if database is empty
    const existingProps = await sql`SELECT COUNT(*)::int as count FROM properties;`;
    if (existingProps[0].count === 0) {
      for (const prop of MOCK_PROPERTIES) {
        await sql`
          INSERT INTO properties (
            id, code_ref, title, slug, description, operation, category, status,
            price_amount, price_currency, price_period, price_drop, original_amount,
            department, city, neighborhood, address,
            bedrooms, bathrooms, floors, built_area_m2, plot_area_m2,
            garage, barbecue, bank_credit_eligible, ph_regime, ose_water, sanitation,
            guarantees, featured
          ) VALUES (
            ${prop.id}, ${prop.codeRef}, ${prop.title}, ${prop.slug}, ${prop.description}, ${prop.operation}, ${prop.category}, ${prop.status},
            ${prop.price.amount}, ${prop.price.currency}, ${prop.price.period || null}, ${prop.price.priceDrop || false}, ${prop.price.originalAmount || null},
            ${prop.location.department}, ${prop.location.city}, ${prop.location.neighborhood}, ${prop.location.address || null},
            ${prop.features.bedrooms || null}, ${prop.features.bathrooms || null}, ${prop.features.floors || null}, ${prop.features.builtAreaM2 || null}, ${prop.features.plotAreaM2 || null},
            ${prop.features.garage || false}, ${prop.features.barbecue || false}, ${prop.features.bankCreditEligible || false}, ${prop.features.phRegime || false}, ${prop.features.oseWater || false}, ${prop.features.sanitation || false},
            ${JSON.stringify(prop.guarantees || [])}, ${prop.featured}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tablas de la base de datos de Inmobiliaria Montaño creadas e inicializadas correctamente en Neon Postgres.',
    });
  } catch (error: any) {
    console.error('Error inicializando la base de datos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error inicializando base de datos.',
      },
      { status: 500 }
    );
  }
}
