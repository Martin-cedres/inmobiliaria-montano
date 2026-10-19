-- Schema SQL para Inmobiliaria Montaño (Neon Serverless Postgres)

-- 1. Tabla de Propiedades
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(64) PRIMARY KEY,
  code_ref VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  operation VARCHAR(32) NOT NULL, -- 'venta', 'alquiler', 'proyecto'
  category VARCHAR(32) NOT NULL,  -- 'casa', 'apartamento', 'chacra', 'deposito', 'proyecto', 'terreno', 'local'
  status VARCHAR(32) NOT NULL DEFAULT 'disponible', -- 'disponible', 'nuevo', 'reservado', 'vendido', 'alquilado', 'oportunidad'
  
  -- Precios
  price_amount NUMERIC(12, 2) NOT NULL,
  price_currency VARCHAR(8) NOT NULL DEFAULT 'USD', -- 'USD', 'UYU'
  price_period VARCHAR(16), -- 'mensual', 'total'
  price_drop BOOLEAN DEFAULT FALSE,
  original_amount NUMERIC(12, 2),

  -- Ubicación
  department VARCHAR(64) NOT NULL DEFAULT 'San José',
  city VARCHAR(64) NOT NULL DEFAULT 'San José de Mayo',
  neighborhood VARCHAR(64) NOT NULL,
  address VARCHAR(255),

  -- Características y Servicios
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

  -- Garantías en formato JSON
  guarantees JSONB DEFAULT '[]'::jsonb,

  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Imágenes de Propiedades (Vercel Blob)
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

-- 3. Tabla de Solicitudes de Tasación / Captación de Propietarios
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

-- 4. Tabla de Usuarios e Integración Google OAuth
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  image TEXT,
  role VARCHAR(32) NOT NULL DEFAULT 'admin', -- 'superadmin', 'admin', 'agente'
  status VARCHAR(32) NOT NULL DEFAULT 'activo', -- 'activo', 'inactivo'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- 5. Índices para Búsquedas Ultra Rápidas en San José
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 6. Tabla de Avisos de Inteligencia de Mercado (Radar de Captación & Competencia)
CREATE TABLE IF NOT EXISTS market_listings (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  operation VARCHAR(32) NOT NULL, -- 'venta', 'alquiler'
  category VARCHAR(32) NOT NULL,  -- 'casa', 'apartamento', 'terreno', 'chacra', 'local', 'deposito'
  neighborhood VARCHAR(64) NOT NULL,
  city VARCHAR(64) NOT NULL DEFAULT 'San José de Mayo',
  department VARCHAR(64) NOT NULL DEFAULT 'San José',
  price_amount NUMERIC(12, 2) NOT NULL,
  price_currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  origin VARCHAR(32) NOT NULL, -- 'dueno_directo', 'inmobiliaria_competencia', 'desconocido'
  competitor_name VARCHAR(128),
  source_name VARCHAR(64) NOT NULL,
  source_url TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  days_on_market INT DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'detectado', -- 'detectado', 'en_analisis', 'contactado', 'reunion_agendada', 'descartado', 'captado'
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

-- 7. Tabla de Snapshots Históricos Semanales del Mercado
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

CREATE INDEX IF NOT EXISTS idx_market_listings_origin ON market_listings(origin);
CREATE INDEX IF NOT EXISTS idx_market_listings_status ON market_listings(status);
CREATE INDEX IF NOT EXISTS idx_market_listings_neighborhood ON market_listings(neighborhood);
CREATE INDEX IF NOT EXISTS idx_market_listings_operation ON market_listings(operation);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_date ON market_snapshots(snapshot_date);


