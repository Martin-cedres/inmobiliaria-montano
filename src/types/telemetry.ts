import { PropertyCategory, PropertyStatus, OperationType } from './property';

export type ButtonPosition = 
  | 'floating'
  | 'property'
  | 'valuation'
  | 'contact'
  | 'header'
  | 'footer'
  | 'guide';

export type ConversionEventType = 
  | 'whatsapp_click'
  | 'phone_click'
  | 'property_view'
  | 'property_contact'
  | 'share_click';

export interface ConversionEvent {
  id: string;
  timestamp: string; // ISO 8601
  eventType: ConversionEventType;
  pagePath: string;
  buttonPosition?: ButtonPosition;
  propertySlug?: string;
  propertyCategory?: PropertyCategory;
  propertyStatus?: PropertyStatus;
  operation?: OperationType;
  location?: string;
  anonymousSessionId: string;
  referrer?: string;
}

export interface SeoTelemetryRecord {
  id: string;
  date: string; // YYYY-MM-DD
  query: string;
  page: string; // URL path relativa o completa
  impressions: number;
  clicks: number;
  ctr: number; // porcentaje (0 - 100) o ratio
  position: number;
  device: 'desktop' | 'mobile' | 'tablet';
  country: string;
  searchType: 'web' | 'image' | 'video';
  location?: string;
  category?: string;
  operation?: string;
}

export interface PageConversionMetrics {
  pagePath: string;
  propertySlug?: string;
  pageTitle?: string;
  category?: string;
  location?: string;
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  totalContacts: number;
  conversionRate: number; // porcentaje
}

export interface ConversionFunnelSummary {
  totalViews: number;
  totalWhatsappClicks: number;
  totalPhoneClicks: number;
  totalContacts: number;
  overallConversionRate: number;
  byButtonPosition: Record<ButtonPosition, number>;
  byCategory: Record<string, { views: number; contacts: number; conversionRate: number }>;
  byLocation: Record<string, { views: number; contacts: number; conversionRate: number }>;
  pagePerformanceTable: PageConversionMetrics[];
}

export interface SeoPerformanceSummary {
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  topQueries: {
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
    opportunityCategory: 'consolidate' | 'optimize' | 'reinforce' | 'rewrite_snippet' | 'explore';
  }[];
  topPages: {
    page: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }[];
  recordsCount: number;
  lastUpdatedDate: string;
}

export type HealthStatus = 'healthy' | 'warning' | 'action_required';

export type PageSeoType = 'master_hub_a' | 'level_b_landing' | 'guide_article' | 'property_listing' | 'core_page';

export interface UrlHealthScore {
  pagePath: string;
  pageTitle: string;
  pageType: PageSeoType;
  isInSitemap: boolean;
  httpStatus: number;
  declaredCanonical: string;
  googleCanonical?: string;
  canonicalMatch: boolean;
  indexStatus: 'indexed' | 'crawled_not_indexed' | 'noindex_declared' | 'unknown';
  hasValidSchema: boolean;
  schemaType?: string;
  lastCrawlTime?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  views: number;
  contacts: number;
  contactRate: number; // porcentaje
  status: HealthStatus;
  statusReason: string;
  recommendedAction: string;
}
