export type MarketListingOrigin = 
  | 'dueno_directo' 
  | 'inmobiliaria_competencia' 
  | 'desconocido';

export type MarketListingStatus = 
  | 'detectado' 
  | 'en_analisis' 
  | 'contactado' 
  | 'reunion_agendada' 
  | 'descartado' 
  | 'captado';

export interface MarketPricePoint {
  date: string;
  priceAmount: number;
  priceCurrency: 'USD' | 'UYU';
  dropPercentage?: number;
}

export interface MarketListing {
  id: string;
  title: string;
  operation: 'venta' | 'alquiler';
  category: 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito';
  neighborhood: string;
  city: string;
  department: string;
  priceAmount: number;
  priceCurrency: 'USD' | 'UYU';
  origin: MarketListingOrigin;
  competitorName?: string;
  sourceName: string;
  sourceUrl?: string;
  detectedAt: string;
  daysOnMarket: number;
  status: MarketListingStatus;
  internalNotes?: string;
  contactName?: string;
  contactPhone?: string;
  builtAreaM2?: number;
  plotAreaM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  estimatedPricePerM2?: number;
  priceHistory: MarketPricePoint[];
  isOpportunity: boolean;
  opportunityReason?: string;
  updatedAt: string;
}

export interface MarketKpis {
  totalStock: number;
  montanoStock: number;
  montanoSharePercentage: number;
  newEntriesLast7Days: number;
  ownerAlertsCount: number;
  priceDropsCount: number;
  competitorStock: number;
  // KPIs reales del Embudo de Captación de Dueños Directos
  pendingContactCount?: number;
  contactedCount?: number;
  scheduledCount?: number;
  capturedCount?: number;
  withPhoneCount?: number;
}

export interface PriceDropOpportunity {
  id: string;
  listingId: string;
  title: string;
  neighborhood: string;
  category: string;
  operation: 'venta' | 'alquiler';
  previousPrice: number;
  currentPrice: number;
  currency: 'USD' | 'UYU';
  dropPercentage: number;
  dropDate: string;
  daysSinceDrop: number;
  totalDaysOnMarket: number;
  sourceName: string;
  sourceUrl?: string;
  origin: MarketListingOrigin;
  competitorOrOwner: string;
  diagnosis: string;
  negotiationPitch: string;
  ownerPhone?: string;
}

export interface MicrozoneHighlight {
  zone: string;
  trend: 'alza' | 'estable' | 'alta_rotacion' | 'expansion';
  avgPriceM2Usd: string;
  avgRentUyu: string;
  inventoryCount: number;
  demandProfile: string;
}

export interface WeeklyExecutiveReportData {
  weekIdentifier: string;
  period: string;
  totalActiveStock: number;
  montanoStock: number;
  montanoSharePercentage: number;
  newCapturesTotal: number;
  priceDropCount: number;
  directOwnerAlerts: number;
  topOpportunity: {
    title: string;
    neighborhood: string;
    previousPrice: string;
    currentPrice: string;
    dropPercentage: number;
    diagnosis: string;
    actionPlan: string;
  };
  strategicSummary: string;
  bulletPoints: string[];
  microzoneHighlights: MicrozoneHighlight[];
}

export interface MarketSnapshot {
  id: string;
  snapshotDate: string;
  weekNumber: number;
  year: number;
  totalStock: number;
  montanoStock: number;
  montanoSharePercentage: number;
  directOwnerStock: number;
  competitorStock: number;
  newEntries7d: number;
  priceDrops7d: number;
  avgPriceM2UsdSale: number;
  avgPriceRentUyu: number;
  zoneDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  notes?: string;
  createdAt: string;
}

export interface MarketRadarFilters {
  search: string;
  neighborhood: string;
  category: string;
  origin: string;
  operation: string;
  status: string;
}
