import { Property, PropertyCategory, OperationType } from '@/types/property';

export interface StatisticalMetricGroup {
  location: string;
  category: PropertyCategory;
  operation: OperationType;
  currency: 'USD' | 'UYU';
  sampleSize: number; // N total de inmuebles en este grupo
  isStatisticallySufficient: boolean; // N >= 3
  
  // Métricas de Precio General
  priceStats?: {
    min: number;
    median: number;
    average: number;
    max: number;
  };

  // Métricas de Precio por Metro Cuadrado Edificado (calculado inmueble por inmueble)
  pricePerM2BuiltStats?: {
    sampleCount: number; // N válido con superficie edificada
    median: number;
    average: number;
    min: number;
    max: number;
  };

  // Métricas de Precio por Metro Cuadrado de Solar/Terreno (calculado inmueble por inmueble)
  pricePerM2PlotStats?: {
    sampleCount: number; // N válido con superficie de terreno
    median: number;
    average: number;
    min: number;
    max: number;
  };

  // Verificaciones Documentales (sobre registros explícitamente informados)
  documentationAudit?: {
    totalChecked: number;
    titlesVerifiedCount: number;
    bankCreditEligibleCount: number;
    uninformedCount: number;
  };
}

export interface MarketObservatoryReport {
  lastUpdatedDate: Date;
  totalPublicPropertiesAudited: number;
  overallDocumentationSummary: {
    totalProperties: number;
    explicitlyCheckedForBank: number;
    bankEligibleCount: number;
    explicitlyCheckedForTitles: number;
    titlesUpToDateCount: number;
  };
  groups: StatisticalMetricGroup[];
}

/**
 * Calcula la mediana de un arreglo numérico.
 */
export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Calcula el promedio aritmético de un arreglo numérico.
 */
export function calculateAverage(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round(sum / values.length);
}

/**
 * Genera el reporte estadístico completo del Observatorio del Inventario Inmobiliario,
 * agrupando estrictamente por (localidad, categoría, operación, moneda) y aplicando N >= 3.
 */
export function generateObservatoryReport(allProperties: Property[]): MarketObservatoryReport {
  // 1. Filtrar solo inmuebles públicos activos/vendidos/alquilados
  const validProperties = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva'
  );

  // 2. Determinar la fecha de corte real más reciente
  const timestamps = validProperties
    .map((p) => new Date(p.updatedAt || p.createdAt || '2026-08-20T00:00:00Z').getTime())
    .filter((ts) => !isNaN(ts) && ts > 0);
  
  const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : new Date('2026-08-25T00:00:00Z').getTime();
  const lastUpdatedDate = new Date(latestTimestamp);

  // 3. Resumen Global de Certezas Documentales
  let bankChecked = 0;
  let bankEligible = 0;
  let titlesChecked = 0;
  let titlesUpToDate = 0;

  validProperties.forEach((p) => {
    // Apta Banco: solo contar si está explícitamente informado en features o legalCertainties
    const bankVal = p.legalCertainties?.bankCreditEligible ?? p.features?.bankCreditEligible;
    if (typeof bankVal === 'boolean') {
      bankChecked++;
      if (bankVal) bankEligible++;
    }

    // Títulos al día: solo contar si está explícitamente informado
    const titleVal = p.legalCertainties?.titlesUpToDate ?? p.features?.titlesUpToDate;
    if (typeof titleVal === 'boolean') {
      titlesChecked++;
      if (titleVal) titlesUpToDate++;
    }
  });

  // 4. Agrupación estricta por (Localidad + Categoría + Operación + Moneda)
  const groupMap = new Map<string, Property[]>();

  validProperties.forEach((p) => {
    const loc = p.location.city || 'San José de Mayo';
    const cat = p.category;
    const op = p.operation;
    const curr = p.price.currency || 'USD';

    const key = `${loc}|${cat}|${op}|${curr}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(p);
  });

  const groups: StatisticalMetricGroup[] = [];

  groupMap.forEach((props, key) => {
    const [location, category, operation, currency] = key.split('|') as [
      string,
      PropertyCategory,
      OperationType,
      'USD' | 'UYU'
    ];

    const sampleSize = props.length;
    const isStatisticallySufficient = sampleSize >= 3;

    // A. Precios válidos (excluye consultas y precios reservados)
    const validPrices = props
      .filter((p) => p.price.amount > 0 && p.price.priceMode !== 'consultar' && p.price.priceMode !== 'reservado')
      .map((p) => p.price.amount);

    let priceStats: StatisticalMetricGroup['priceStats'] | undefined;
    if (isStatisticallySufficient && validPrices.length >= 3) {
      priceStats = {
        min: Math.min(...validPrices),
        median: calculateMedian(validPrices),
        average: calculateAverage(validPrices),
        max: Math.max(...validPrices),
      };
    }

    // B. Precio por m² edificado (calculado individualmente por inmueble)
    const individualM2BuiltPrices: number[] = [];
    props.forEach((p) => {
      if (
        p.price.amount > 0 &&
        p.price.priceMode !== 'consultar' &&
        p.price.priceMode !== 'reservado' &&
        p.features.builtAreaM2 &&
        p.features.builtAreaM2 > 0
      ) {
        individualM2BuiltPrices.push(Math.round(p.price.amount / p.features.builtAreaM2));
      }
    });

    let pricePerM2BuiltStats: StatisticalMetricGroup['pricePerM2BuiltStats'] | undefined;
    if (individualM2BuiltPrices.length > 0) {
      pricePerM2BuiltStats = {
        sampleCount: individualM2BuiltPrices.length,
        min: Math.min(...individualM2BuiltPrices),
        median: calculateMedian(individualM2BuiltPrices),
        average: calculateAverage(individualM2BuiltPrices),
        max: Math.max(...individualM2BuiltPrices),
      };
    }

    // C. Precio por m² de terreno/solar (calculado individualmente por inmueble)
    const individualM2PlotPrices: number[] = [];
    props.forEach((p) => {
      if (
        p.price.amount > 0 &&
        p.price.priceMode !== 'consultar' &&
        p.price.priceMode !== 'reservado' &&
        p.features.plotAreaM2 &&
        p.features.plotAreaM2 > 0
      ) {
        individualM2PlotPrices.push(Math.round((p.price.amount / p.features.plotAreaM2) * 100) / 100);
      }
    });

    let pricePerM2PlotStats: StatisticalMetricGroup['pricePerM2PlotStats'] | undefined;
    if (individualM2PlotPrices.length > 0) {
      pricePerM2PlotStats = {
        sampleCount: individualM2PlotPrices.length,
        min: Math.min(...individualM2PlotPrices),
        median: calculateMedian(individualM2PlotPrices),
        average: calculateAverage(individualM2PlotPrices),
        max: Math.max(...individualM2PlotPrices),
      };
    }

    // D. Auditoría Documental del Grupo
    let groupBankChecked = 0;
    let groupBankEligible = 0;
    let groupTitlesChecked = 0;
    let groupTitlesUpToDate = 0;
    let groupUninformed = 0;

    props.forEach((p) => {
      const bank = p.legalCertainties?.bankCreditEligible ?? p.features?.bankCreditEligible;
      const titles = p.legalCertainties?.titlesUpToDate ?? p.features?.titlesUpToDate;

      let hasInfo = false;
      if (typeof bank === 'boolean') {
        hasInfo = true;
        groupBankChecked++;
        if (bank) groupBankEligible++;
      }
      if (typeof titles === 'boolean') {
        hasInfo = true;
        groupTitlesChecked++;
        if (titles) groupTitlesUpToDate++;
      }
      if (!hasInfo) groupUninformed++;
    });

    groups.push({
      location,
      category,
      operation,
      currency,
      sampleSize,
      isStatisticallySufficient,
      priceStats,
      pricePerM2BuiltStats,
      pricePerM2PlotStats,
      documentationAudit: {
        totalChecked: props.length,
        titlesVerifiedCount: groupTitlesUpToDate,
        bankCreditEligibleCount: groupBankEligible,
        uninformedCount: groupUninformed,
      },
    });
  });

  return {
    lastUpdatedDate,
    totalPublicPropertiesAudited: validProperties.length,
    overallDocumentationSummary: {
      totalProperties: validProperties.length,
      explicitlyCheckedForBank: bankChecked,
      bankEligibleCount: bankEligible,
      explicitlyCheckedForTitles: titlesChecked,
      titlesUpToDateCount: titlesUpToDate,
    },
    groups,
  };
}
