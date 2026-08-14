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
    floors?: number;            // Cantidad de plantas / pisos de la vivienda
    builtAreaM2?: number;       // m² edificados
    plotAreaM2?: number;        // m² de terreno
    frontMeters?: number;       // Metros de frente (ej. 15m)
    isHectares?: boolean;       // Medida en ha
    carAccess?: boolean;        // Entrada de Auto / Acceso Vehicular
    garage?: boolean;           // Garage Techado / Cochera
    barbecue?: boolean;         // Parrillero / Barbacoa
    pool?: boolean;             // Piscina
    garden?: boolean;           // Jardín / Fondo Verde / Patio
    woodStoveOrAC?: boolean;    // Estufa a Leña / Aire Acondicionado
    petFriendly?: boolean;      // Acepta Mascotas / Pet Friendly
    oseWater?: boolean;         // Agua Corriente (OSE)
    uteElectric?: boolean;      // Luz Eléctrica (UTE)
    sanitation?: boolean;       // Saneamiento / Alcantarillado
    fiberOptic?: boolean;       // Fibra Óptica / Internet
    waterWellOrPond?: boolean;  // Pozo de Agua / Tajamar
    titlesUpToDate?: boolean;   // Títulos al Día / Escriturable
    bankCreditEligible?: boolean; // Apta Crédito Bancario
    acceptsTradeIn?: boolean;   // Acepta Permuta
    phRegime?: boolean;         // Régimen de Propiedad Horizontal (PH)
    perimeterFence?: boolean;   // Cerco Perimetral / Rejas / Muro
    securitySystem?: boolean;   // Alarma / Cámaras / Seguridad
    pavedStreet?: boolean;      // Frente a Asfalto / Hormigón
    shedOrCorral?: boolean;     // Galpón / Embarcadero / Depósito
    coneatIndex?: number;       // Índice CONEAT (ej. 110)
    commonExpensesAmount?: number; // Gastos comunes (Monto)
  };
  guarantees?: GuaranteeType[];
  legalCertainties?: {
    titlesUpToDate?: boolean;
    bankCreditEligible?: boolean;
    acceptsTradeIn?: boolean;
  };
  images: ImageAsset[];
  seoTitle?: string;
  seoDescription?: string;
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
