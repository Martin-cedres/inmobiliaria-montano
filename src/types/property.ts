export type OperationType = 'venta' | 'alquiler' | 'proyecto';

export type PropertyCategory = 
  | 'todos'
  | 'casa' 
  | 'apartamento' 
  | 'chacra' 
  | 'deposito' 
  | 'proyecto' 
  | 'terreno' 
  | 'local';

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
  };
  guarantees?: GuaranteeType[];
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
