export type OperationType = 'venta' | 'alquiler' | 'proyecto';

export type PropertyCategory = 
  | 'todos'
  | 'casa' 
  | 'apartamento' 
  | 'chacra' 
  | 'deposito' 
  | 'proyecto' 
  | 'terreno' 
  | 'local'
  | 'modulo';

export type PropertyStatus = 'disponible' | 'nuevo' | 'reservado' | 'vendido' | 'alquilado' | 'oportunidad';

export type GuaranteeType = 'ANDA' | 'CGN' | 'Porto' | 'Sura' | 'Mapfre' | 'Depósito' | 'Propia' | 'Otra';

export interface ImageAsset {
  id: string;
  blobUrl: string;
  webpUrl: string;
  thumbnailUrl: string;
  altText: string;
  isMain: boolean;
}

export interface Property {
  id: string;
  codeRef: string; // ej: "MON-101"
  title: string;
  slug: string;
  description: string;
  operation: OperationType;
  category: PropertyCategory;
  status: PropertyStatus;
  price: {
    amount: number;
    currency: 'USD' | 'UYU';
    period?: 'mensual' | 'total';
    priceDrop?: boolean;
    originalAmount?: number;
  };
  location: {
    department: string;   // "San José"
    city: string;         // "San José de Mayo", "Libertad", etc.
    neighborhood: string; // "Centro", "Plaza Arriaga", "Zona Sub Urbana", etc.
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    isExactLocation?: boolean; // false por defecto -> dibuja círculo de zona aproximada
    radiusMeters?: number;     // por defecto 300 metros
    hasLocation?: boolean;     // false -> oculta el mapa por completo (ej. Módulos Habitacionales / Construcciones Transportables)
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;            // Cantidad de plantas
    builtAreaM2?: number;       // m² edificados
    plotAreaM2?: number;        // m² de terreno
    isHectares?: boolean;       // Medida en ha
    garage?: boolean;
    barbecue?: boolean;
    pool?: boolean;
    perimeterFence?: boolean;
    bankCreditEligible?: boolean; // Apta crédito bancario
    phRegime?: boolean;           // Régimen de PH
    oseWater?: boolean;          // Agua de OSE
    sanitation?: boolean;         // Saneamiento
    commonExpensesAmount?: number; // Gastos comunes
    coneatIndex?: number;          // Índice CONEAT (ej. 110)
    frontMeters?: number;          // Metros de frente (ej. 15m)
    waterWellOrPond?: boolean;     // Pozo de Agua / Tajamar
    fiberOptic?: boolean;          // Fibra Óptica
    pavedStreet?: boolean;         // Frente a Asfalto / Hormigón
    woodStoveOrAC?: boolean;       // Estufa a Leña / Aire Acondicionado
    titlesUpToDate?: boolean;      // Títulos al Día / Verificado Notarialmente
    acceptsTradeIn?: boolean;      // Acepta Permuta
    shedOrCorral?: boolean;        // Galpón / Embarcadero
  };
  guarantees?: GuaranteeType[];
  legalCertainties?: {
    titlesUpToDate?: boolean;
    bankCreditEligible?: boolean;
    acceptsTradeIn?: boolean;
  };
  images: ImageAsset[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryChip {
  id: PropertyCategory;
  label: string;
  icon: string;
  count?: number;
}
