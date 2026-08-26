export type DecisionCategory = 'ctr_optimization' | 'landing_activation' | 'conversion_alert' | 'local_authority';
export type DecisionStatus = 'pending' | 'approved' | 'dismissed';

export interface CtrOptimizationProposal {
  pagePath: string;
  currentTitle: string;
  currentDescription: string;
  proposedTitle: string;
  proposedDescription: string;
  gscQuery: string;
  impressions: number;
  observedPosition: number;
  observedCtr: number;
  targetCtr: number; // 🔵 Objetivo Proyectado
  rationale: string;
}

export interface InventoryTriggerProposal {
  landingSlug: string;
  landingPath: string;
  targetLocation: string;
  currentInventoryCount: number; // N
  thresholdRequired: number; // 2
  isEligible: boolean;
  gscQuery: string;
  gscImpressions: number;
  gscPosition: number;
  currentRobots: string;
  targetRobots: string;
  rationale: string;
}

export interface ConversionAnomalyItem {
  propertyId: string;
  propertySlug: string;
  title: string;
  location: string;
  priceDisplay: string;
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  engagementRate: number;
  anomalyType: 'low_conversion_high_traffic' | 'high_converting_asset';
  recommendation: string;
}

export interface ObservatorioReportSummary {
  reportTitle: string;
  period: string;
  department: string;
  keyInsights: {
    usdMedians: { category: string; median: string; sampleSize: number }[];
    uyuMedians: { category: string; median: string; sampleSize: number }[];
  };
  suggestedPressReleaseNote: string;
  targetOutlets: string[];
}

export interface DecisionCard {
  id: string;
  category: DecisionCategory;
  urgency: 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  evidence: string;
  impact: 'high' | 'medium' | 'low';
  status: DecisionStatus;
  ctrProposal?: CtrOptimizationProposal;
  inventoryProposal?: InventoryTriggerProposal;
  conversionAlert?: ConversionAnomalyItem;
  authorityReport?: ObservatorioReportSummary;
}
