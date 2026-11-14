import type { Property, PropertyStatus } from '@/types/property';
import type { FlyerClosureOutcome } from './flyerTypes';

export interface ClosureThemeConfig {
  outcome: FlyerClosureOutcome;
  ribbonBg: string;
  ctaGradient: string;
  accentGradient: string;
  kicker: string;
  hookTitle: string;
  actionVerb: string;
}

export const CLOSURE_THEME_MAP: Record<FlyerClosureOutcome, ClosureThemeConfig> = {
  VENDIÓ: {
    outcome: 'VENDIÓ',
    ribbonBg: '#4A1242',
    ctaGradient: 'linear-gradient(135deg, #C2410C 0%, #E85D04 100%)',
    accentGradient: 'linear-gradient(90deg, #C2410C, #FFB800)',
    kicker: 'Operación Concretada',
    hookTitle: '¡Otra propiedad vendida!',
    actionVerb: 'vender',
  },
  ALQUILÓ: {
    outcome: 'ALQUILÓ',
    ribbonBg: '#5E1754',
    ctaGradient: 'linear-gradient(135deg, #5E1754 0%, #832776 100%)',
    accentGradient: 'linear-gradient(90deg, #5E1754, #E85D04)',
    kicker: 'Operación Concretada',
    hookTitle: '¡Otra propiedad alquilada!',
    actionVerb: 'alquilar',
  },
  RESERVÓ: {
    outcome: 'RESERVÓ',
    ribbonBg: '#E85D04',
    ctaGradient: 'linear-gradient(135deg, #C2410C 0%, #E85D04 100%)',
    accentGradient: 'linear-gradient(90deg, #E85D04, #FFB800)',
    kicker: 'Alta Demanda en San José',
    hookTitle: '¡Otra propiedad reservada!',
    actionVerb: 'vender o alquilar',
  },
};

export interface SocialProofPreset {
  id: string;
  outcome: FlyerClosureOutcome;
  label: string;
  proofText: string;
  demandText: string;
}

export const SOCIAL_PROOF_PRESETS: SocialProofPreset[] = [
  {
    id: 'venta-banco',
    outcome: 'VENDIÓ',
    label: 'Venta • Apta Banco / BHU',
    proofText: 'Operación concretada con documentación al día y asesoramiento integral en todo el proceso.',
    demandText: 'Nos quedaron compradores calificados (crédito bancario y contado) buscando en esta zona.',
  },
  {
    id: 'venta-rapida',
    outcome: 'VENDIÓ',
    label: 'Venta • Rápida en Cartera',
    proofText: 'Vendida con seguimiento directo desde la tasación hasta el cierre definitivo.',
    demandText: 'Seguimos necesitando propiedades similares para clientes reales que ya están buscando.',
  },
  {
    id: 'alquiler-garantia',
    outcome: 'ALQUILÓ',
    label: 'Alquiler • Con Garantía',
    proofText: 'Alquilada rápidamente con inquilinos verificados y respaldo de garantía aseguradora.',
    demandText: 'Alta demanda continua: tenemos interesados aprobados esperando casas, aptos y locales.',
  },
  {
    id: 'reserva-demanda',
    outcome: 'RESERVÓ',
    label: 'Reserva • Fuerte Demanda',
    proofText: 'Propiedad reservada gracias a nuestra base activa de compradores e inversores en San José.',
    demandText: 'Quedaron consultando por opciones similares en el departamento. ¿Evaluamos la tuya?',
  },
];

export function isClosedOrReservedStatus(status?: PropertyStatus): boolean {
  return status === 'vendido' || status === 'alquilado' || status === 'reservado';
}

export function getDefaultClosureOutcome(
  property: Pick<Property, 'status' | 'operation'>
): FlyerClosureOutcome {
  if (property.status === 'vendido') return 'VENDIÓ';
  if (property.status === 'alquilado') return 'ALQUILÓ';
  if (property.status === 'reservado') return 'RESERVÓ';
  return property.operation === 'alquiler' ? 'ALQUILÓ' : 'VENDIÓ';
}

export function formatCleanZoneLocation(location?: Property['location']): string {
  const neighborhood = location?.neighborhood?.trim() || '';
  const city = location?.city?.trim() || 'San José de Mayo';

  if (!neighborhood) return city;
  if (neighborhood.toLowerCase().includes(city.toLowerCase())) {
    return neighborhood;
  }
  return `${neighborhood}, ${city}`;
}

export function getCategoryDisplayName(category: Property['category']): string {
  switch (category) {
    case 'casa':
      return 'Casa Residencial';
    case 'apartamento':
      return 'Apartamento';
    case 'terreno':
      return 'Terreno / Solar';
    case 'chacra':
      return 'Chacra / Campo';
    case 'local':
      return 'Local Comercial';
    case 'deposito':
      return 'Depósito / Galpón';
    case 'proyecto':
      return 'Proyecto Inmobiliario';
    case 'modulo':
      return 'Módulo Habitacional';
    default:
      return 'Propiedad';
  }
}

export function buildCleanClosureTitle(property: Property): string {
  const categoryName = getCategoryDisplayName(property.category);
  const f = property.features;
  const details: string[] = [];

  if (f?.bedrooms) {
    details.push(`${f.bedrooms} dorm.`);
  }
  if (f?.builtAreaM2) {
    details.push(`${f.builtAreaM2} m²`);
  }

  const suffix = details.length > 0 ? ` (${details.join(' • ')})` : '';
  const rawTitle = property.title?.trim() || `${categoryName}${suffix}`;

  // Limpiar sufijos SEO redundantes o guiones colgantes si el título es muy largo
  return rawTitle
    .replace(/\s*[-–—]\s*Oportunidad Residencial$/i, '')
    .replace(/[\s,]*[-–—]?\s*San José de Mayo$/i, '')
    .replace(/[\s\-–—,]+$/, '')
    .trim();
}

export function buildDefaultClosureCopy(property: Property): {
  outcome: FlyerClosureOutcome;
  propertyTitle: string;
  zoneLabel: string;
  categoryLabel: string;
  proofText: string;
  demandText: string;
  ctaTitle: string;
} {
  const outcome = getDefaultClosureOutcome(property);
  const zoneLabel = formatCleanZoneLocation(property.location);
  const categoryLabel = getCategoryDisplayName(property.category);
  const propertyTitle = buildCleanClosureTitle(property);

  let proofText: string;
  let demandText: string;

  if (outcome === 'ALQUILÓ') {
    proofText =
      property.category === 'local' || property.category === 'deposito'
        ? 'Contrato comercial concretado con respaldo de garantía y gestión ágil de principio a fin.'
        : 'Alquilada rápidamente con inquilinos calificados y garantía aprobada (ANDA / CGN / aseguradoras).';
    demandText =
      property.category === 'local' || property.category === 'deposito'
        ? 'Seguimos con empresas y comercios buscando locales y depósitos en puntos estratégicos de San José.'
        : 'Nos quedaron inquilinos con garantía buscando vivienda anual en San José de Mayo.';
  } else if (outcome === 'RESERVÓ') {
    proofText = property.features?.bankCreditEligible
      ? 'Reservada por compradores activos • Documentación al día y apta para crédito bancario.'
      : 'Reservada rápidamente a través de nuestra red de compradores e inversores en San José.';
    demandText =
      property.category === 'local' || property.category === 'deposito'
        ? 'Seguimos recibiendo consultas de inversores y comerciantes por opciones similares en el Centro.'
        : 'Quedaron compradores interesados buscando propiedades similares en la zona.';
  } else {
    proofText = property.features?.bankCreditEligible
      ? 'Vendida con gestión integral y documentación lista para operación bancaria o contado.'
      : 'Venta concretada con asesoramiento directo de Inmobiliaria Montaño en San José.';
    demandText =
      'Nos quedaron compradores calificados buscando casas y propiedades similares en esta zona.';
  }

  const ctaTitle =
    outcome === 'ALQUILÓ'
      ? '¿Tenés una propiedad para alquilar?'
      : outcome === 'VENDIÓ'
      ? '¿Querés vender tu propiedad?'
      : '¿Tenés una propiedad para vender o alquilar?';

  return {
    outcome,
    propertyTitle,
    zoneLabel,
    categoryLabel,
    proofText,
    demandText,
    ctaTitle,
  };
}

export function buildPropertyShareUrl(
  property: Pick<Property, 'slug' | 'status'>,
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy'
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBase}/propiedad/${property.slug}`;
  if (isClosedOrReservedStatus(property.status)) {
    return `${url}?estado=${property.status}`;
  }
  return url;
}

export function buildClosureSocialCaptureCopy(
  property: Property,
  baseUrl?: string
): {
  outcome: FlyerClosureOutcome;
  statusAdjective: 'VENDIDA' | 'ALQUILADA' | 'RESERVADA';
  zoneLabel: string;
  cleanTitle: string;
  shareUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogBannerLine: string;
  ogBannerSubline: string;
  shareMessage: string;
  ownerHeadline: string;
  ownerBody: string;
  ownerCtaLabel: string;
  ownerLandingHref: string;
  ownerLandingLabel: string;
  ownerWhatsAppSubject: 'vender' | 'alquilar_propiedad' | 'publicar';
} {
  const baseCopy = buildDefaultClosureCopy(property);
  const shareUrl = buildPropertyShareUrl(property, baseUrl);
  const statusAdjective =
    baseCopy.outcome === 'ALQUILÓ'
      ? 'ALQUILADA'
      : baseCopy.outcome === 'RESERVÓ'
      ? 'RESERVADA'
      : 'VENDIDA';

  if (baseCopy.outcome === 'ALQUILÓ') {
    return {
      outcome: baseCopy.outcome,
      statusAdjective,
      zoneLabel: baseCopy.zoneLabel,
      cleanTitle: baseCopy.propertyTitle,
      shareUrl,
      ogTitle: `¡ALQUILADA! ${baseCopy.propertyTitle} — Buscamos similares | Inmobiliaria Montaño`,
      ogDescription: `¡Alquilada en ${baseCopy.zoneLabel} con garantías verificadas! Seguimos con inquilinos calificados esperando propiedades similares. ¿Tenés una propiedad para alquilar? Publicala con Inmobiliaria Montaño.`,
      ogBannerLine: `Alquilada en ${baseCopy.zoneLabel} • Garantías verificadas`,
      ogBannerSubline: 'Nos quedaron inquilinos buscando • ¿Alquilás tu propiedad?',
      shareMessage: `✅ *¡OTRA PROPIEDAD ALQUILADA EN ${baseCopy.zoneLabel.toUpperCase()}!*\n\n${baseCopy.proofText}\n📌 *${baseCopy.demandText}*\n\n¿Tenés una casa, apartamento o local para alquilar?\n👉 ${shareUrl}`,
      ownerHeadline: `¡Propiedad alquilada en ${baseCopy.zoneLabel}! Tenemos inquilinos esperando`,
      ownerBody: `Nos quedaron interesados aprobados con garantía (ANDA, CGN, aseguradoras y Círculo Policial) buscando opciones similares. ¿Tenés una propiedad para alquilar?`,
      ownerCtaLabel: 'Publicar para alquilar por WhatsApp',
      ownerLandingHref: '/alquilar-mi-propiedad-san-jose',
      ownerLandingLabel: 'Cómo alquilamos tu propiedad',
      ownerWhatsAppSubject: 'alquilar_propiedad',
    };
  }

  if (baseCopy.outcome === 'RESERVÓ') {
    return {
      outcome: baseCopy.outcome,
      statusAdjective,
      zoneLabel: baseCopy.zoneLabel,
      cleanTitle: baseCopy.propertyTitle,
      shareUrl,
      ogTitle: `¡RESERVADA! ${baseCopy.propertyTitle} — Alta demanda en ${baseCopy.zoneLabel} | Inmobiliaria Montaño`,
      ogDescription: `¡Reservada en ${baseCopy.zoneLabel}! Seguimos con compradores e interesados buscando propiedades similares en la zona. ¿Evaluás vender o alquilar la tuya? Consultanos.`,
      ogBannerLine: `Reservada en ${baseCopy.zoneLabel} • Alta demanda activa`,
      ogBannerSubline: 'Nos quedaron clientes en espera • ¿Publicás tu propiedad?',
      shareMessage: `🔥 *¡OTRA PROPIEDAD RESERVADA EN ${baseCopy.zoneLabel.toUpperCase()}!*\n\n${baseCopy.proofText}\n📌 *${baseCopy.demandText}*\n\n¿Tenés una propiedad en San José para vender o alquilar?\n👉 ${shareUrl}`,
      ownerHeadline: `¡Propiedad reservada en ${baseCopy.zoneLabel}! Clientes en lista de espera`,
      ownerBody: `Esta operación generó fuerte demanda y nos quedaron compradores e interesados activos buscando en la zona. Si estás evaluando vender o alquilar, conversemos.`,
      ownerCtaLabel: 'Consultar / Publicar mi propiedad',
      ownerLandingHref: property.operation === 'alquiler' ? '/alquilar-mi-propiedad-san-jose' : '/vender-propiedad-san-jose',
      ownerLandingLabel: property.operation === 'alquiler' ? 'Alquilar mi propiedad' : 'Tasar o vender mi propiedad',
      ownerWhatsAppSubject: 'publicar',
    };
  }

  return {
    outcome: baseCopy.outcome,
    statusAdjective,
    zoneLabel: baseCopy.zoneLabel,
    cleanTitle: baseCopy.propertyTitle,
    shareUrl,
    ogTitle: `¡VENDIDA! ${baseCopy.propertyTitle} — Buscamos similares | Inmobiliaria Montaño`,
    ogDescription: `¡Vendida en ${baseCopy.zoneLabel}! Nos quedaron compradores calificados buscando viviendas similares. ¿Querés vender tu propiedad? Tasala y publicala con Inmobiliaria Montaño.`,
    ogBannerLine: `Vendida en ${baseCopy.zoneLabel} • Compradores buscando`,
    ogBannerSubline: 'Tenemos demanda activa en la zona • ¿Vendés tu propiedad?',
    shareMessage: `✅ *¡OTRA PROPIEDAD VENDIDA EN ${baseCopy.zoneLabel.toUpperCase()}!*\n\n${baseCopy.proofText}\n📌 *${baseCopy.demandText}*\n\n¿Querés vender tu casa, terreno o chacra en San José?\n👉 ${shareUrl}`,
    ownerHeadline: `¡Propiedad vendida en ${baseCopy.zoneLabel}! Hay compradores buscando similares`,
    ownerBody: `Nos quedaron compradores calificados (crédito bancario y contado) buscando opciones similares en la zona. Si querés vender, te asesoramos sin compromiso.`,
    ownerCtaLabel: 'Quiero vender / tasar por WhatsApp',
    ownerLandingHref: '/vender-propiedad-san-jose',
    ownerLandingLabel: 'Solicitar tasación para vender',
    ownerWhatsAppSubject: 'vender',
  };
}
