import { OperationType } from './property';

export type CompetitorType = 'national_portal' | 'local_agency' | 'classifieds' | 'direct_owner';

export type DataClassification = 
  | 'observed_live_gsc'        // 🟢 Dato Observado en Vivo (Search Console API)
  | 'observed_internal_telemetry' // 🟢 Dato Observado en Vivo (Telemetría Interna)
  | 'benchmark_manual_audit'   // ⚪ Dato Manual / Auditoría de Referencia
  | 'target_projection'        // 🔵 Estimación / Objetivo Proyectado
  | 'system_recommendation';   // 🟡 Recomendación Estratégica

export interface CompetitorEntry {
  rank: number;
  domain: string;
  name: string;
  url: string;
  type: CompetitorType;
  pageType: 'hub_category' | 'listing_page' | 'directory' | 'service_page';
  estimatedInventory?: number;
  titleStructure: string;
  h1: string;
  hasSchema: boolean;
  strengths: string[];
  weaknesses: string[];
  montanoAdvantageOverCompetitor: string;
  dataSource: 'benchmark_manual_audit';
}

export interface SerpQueryAnalysis {
  query: string;
  intent: 'commercial_buy' | 'commercial_rent' | 'service_valuation' | 'commercial_sell' | 'informational';
  montanoPosition: number;
  montanoUrl: string;
  gscImpressions: number;
  gscClicks: number;
  gscCtr: number;
  measurementPeriod: string;
  gscDataSource: 'observed_live_gsc';
  competitorDataSource: 'benchmark_manual_audit';
  topCompetitors: CompetitorEntry[];
  tacticalOpportunity: string;
}

export interface SemanticGapItem {
  entityOrTopic: string;
  category: 'neighborhood_zone' | 'property_attribute' | 'legal_financial' | 'commercial_intent';
  searchDemandObserved: 'high' | 'medium' | 'emerging';
  montanoCoverageStatus: 'covered_in_hub' | 'covered_in_guide' | 'partial' | 'missing';
  montanoCurrentUrl?: string;
  matchedInventoryCount: number; // N
  recommendation: string;
  isNewLandingWarranted: boolean; // solo si N >= 2 + demanda sostenida
  dataSource: 'observed_internal_telemetry' | 'benchmark_manual_audit';
}

export interface LocalAuthorityAudit {
  entityName: string;
  officialPhone: string;
  serviceArea: string;
  napStatus: 'consistent' | 'discrepancy_detected';
  gbpConfig: {
    businessType: 'SAB' | 'Storefront';
    primaryCategory: string;
    secondaryCategories: string[];
    canonicalWebsiteUrl: string;
    hasRealPhotos: boolean;
    hasAuthenticReviews: boolean;
  };
  legitimateLocalMentions: {
    source: string;
    type: 'chamber_of_commerce' | 'departmental_media' | 'local_institution' | 'professional_association';
    status: 'active' | 'recommended' | 'opportunity';
    anchorOrContext: string;
    dataSource: 'benchmark_manual_audit';
  }[];
}

export interface ConversionIntelligenceItem {
  propertySlug: string;
  title: string;
  category: string;
  location: string;
  operation: OperationType;
  priceDisplay: string;
  gscEntryQuery?: string;
  gscEntryPage?: string;
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  totalContacts: number;
  engagementRate: number; // porcentaje (contactos / vistas * 100)
  commercialVelocity: 'alta' | 'media' | 'latente';
  commercialTakeaway: string;
  dataSource: 'observed_internal_telemetry';
}

export type ExecutionTier = 'auto_executable' | 'requires_approval' | 'forbidden';

export interface ActionQueueItem {
  id: string;
  title: string;
  executionTier: ExecutionTier;
  proposal: string;
  evidence: {
    gscQuery?: string;
    impressions?: number;
    clicks?: number;
    observedPosition?: number;
    observedCtr?: number;
    targetCtr?: number; // 🔵 Objetivo Proyectado
    period: string;
    source: string;
  };
  inventoryCount: number; // N en BD
  isThresholdMet: boolean; // N >= 2
  expectedImpact: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  riskDescription: string;
  decision: 'pending_user_approval' | 'approved' | 'rejected' | 'deferred_insufficient_inventory';
  alternativeAction: string;
  futureTriggerCondition: string;
}

export interface CompetitiveIntelligenceSummary {
  measurementPeriod: string;
  source: string;
  dataClassificationGuide: {
    liveObserved: string;
    internalTelemetry: string;
    manualBenchmark: string;
    targetProjection: string;
    recommendation: string;
  };
  serpQueries: SerpQueryAnalysis[];
  semanticGaps: SemanticGapItem[];
  localAuthority: LocalAuthorityAudit;
  conversionIntelligence: ConversionIntelligenceItem[];
  actionQueue: ActionQueueItem[];
}
