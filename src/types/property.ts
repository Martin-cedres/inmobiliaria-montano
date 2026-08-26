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

export type PropertyStatus = 
  | 'disponible' 
  | 'nuevo' 
  | 'reservado' 
  | 'vendido' 
  | 'alquilado' 
  | 'oportunidad' 
  | 'retirada' 
  | 'inactiva';

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
    priceMode?: 'visible' | 'consultar' | 'reservado' | 'desde';
  };
  location: {
    department: string;   // "San José", "Colonia", "Montevideo", etc.
    city: string;         // "San José de Mayo", "Libertad", "Ciudad del Plata", "Rodríguez", "Ecilda Paullier", "Kiyú", etc.
    neighborhood: string; // "Centro", "Barrio Molino", "Plaza Arriaga", etc.
    zone?: string;        // "Urbana", "Sub Urbana", "Rural", "Balneario", "Ruta 1", "Ruta 3", etc.
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
    carAccess?: boolean;        // Entrada de Auto / Acceso Vehicular
    garage?: boolean;           // Garage Techado / Cochera
    cochera?: boolean;          // Cochera
    cocheraTechada?: boolean;   // Cochera Techada
    barbecue?: boolean;         // Parrillero / Barbacoa
    barbacoa?: boolean;         // Barbacoa
    parrillero?: boolean;       // Parrillero
    pool?: boolean;             // Piscina
    garden?: boolean;           // Jardín / Fondo Verde / Patio
    fondo?: boolean;            // Fondo
    patio?: boolean;            // Patio
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
    isHectares?: boolean;       // Mostrar superficie en Hectáreas
    hectaresAmount?: number;    // Cantidad exacta de Hectáreas (ej. 12)
    fractionable?: boolean;     // Acepta Fraccionamiento
    minFractionM2?: number;     // Fracción mínima en m² (ej. 12000)
    fractionNotes?: string;     // Notas de fraccionamiento (ej. "Desde 12.000 m² - Adaptable")
    routeFrontage?: string;     // Frente a Ruta / Bypass (ej. "50 Metros - Salida directa Bypass")
    pricePerM2?: number;        // Precio por unidad (m², Ha, etc.)
    priceUnitType?: string;     // Tipo de unidad (ej. "m²", "Ha", "Fracción")
    soilTopography?: string;    // Topografía (ej. "100% Nivelado - Listo para edificar")
    gatedPerimeter?: boolean;   // Predio Cerrado & Acceso Controlado
    cadastralNumber?: string;   // Número de padrón catastral (si está informado)
    propertyTaxUpToDate?: boolean; // Contribución inmobiliaria al día
    primaryTaxUpToDate?: boolean;  // Impuesto de Primaria al día
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
  viewsCount?: number;
  whatsappClicksCount?: number;
  sharesCount?: number;
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
