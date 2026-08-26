import { Property } from '@/types/property';
import { stripMarkdown } from './seo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

/**
 * Genera la representación Markdown limpia y estructurada para una propiedad,
 * utilizando exactamente la misma fuente de datos que la ficha HTML canónica.
 */
export function generatePropertyMarkdown(property: Property): string {
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;
  const priceFormatted = property.price.priceMode === 'consultar' || property.price.amount === 0
    ? 'A consultar'
    : property.price.priceMode === 'reservado'
    ? 'Precio reservado'
    : `${property.price.priceMode === 'desde' ? 'Desde ' : ''}${property.price.currency === 'USD' ? 'USD' : 'UYU $'} ${property.price.amount.toLocaleString('es-UY')}${property.operation === 'alquiler' && property.price.period ? ` / ${property.price.period}` : ''}`;

  const cleanDescription = stripMarkdown(property.description);

  let md = `# ${property.title}\n\n`;
  md += `**Referencia:** #${property.codeRef}\n`;
  md += `**Operación:** ${property.operation.toUpperCase()}\n`;
  md += `**Categoría:** ${property.category.toUpperCase()}\n`;
  md += `**Estado:** ${property.status.toUpperCase()}\n`;
  md += `**Precio:** ${priceFormatted}\n\n`;

  md += `## Ubicación\n`;
  md += `- **Departamento:** ${property.location.department || 'San José'}\n`;
  md += `- **Ciudad / Localidad:** ${property.location.city || 'San José de Mayo'}\n`;
  if (property.location.neighborhood) {
    md += `- **Barrio / Zona:** ${property.location.neighborhood}\n`;
  }
  if (property.location.address) {
    md += `- **Dirección / Referencia:** ${property.location.address}\n`;
  }
  if (property.location.coordinates?.lat && property.location.coordinates?.lng) {
    md += `- **Coordenadas:** ${property.location.coordinates.lat}, ${property.location.coordinates.lng}\n`;
  }
  md += `\n`;

  md += `## Características y Dimensiones\n`;
  if (property.features.bedrooms) md += `- **Dormitorios:** ${property.features.bedrooms}\n`;
  if (property.features.bathrooms) md += `- **Baños:** ${property.features.bathrooms}\n`;
  if (property.features.floors) md += `- **Plantas / Pisos:** ${property.features.floors}\n`;
  if (property.features.builtAreaM2) md += `- **Superficie Edificada:** ${property.features.builtAreaM2} m²\n`;
  if (property.features.plotAreaM2) {
    const areaStr = property.features.isHectares && property.features.hectaresAmount
      ? `${property.features.hectaresAmount} Hectáreas (${property.features.plotAreaM2.toLocaleString('es-UY')} m²)`
      : `${property.features.plotAreaM2.toLocaleString('es-UY')} m²`;
    md += `- **Superficie de Terreno:** ${areaStr}\n`;
  }
  if (property.features.frontMeters) md += `- **Frente:** ${property.features.frontMeters} metros\n`;
  if (property.features.coneatIndex) md += `- **Índice CONEAT:** ${property.features.coneatIndex}\n`;
  md += `\n`;

  md += `## Comodidades y Servicios\n`;
  const amenities: string[] = [];
  if (property.features.garage) amenities.push('Garage cerrado / Cochera');
  if (property.features.carAccess && !property.features.garage) amenities.push('Entrada para vehículo');
  if (property.features.barbecue || property.features.parrillero) amenities.push('Parrillero / Barbacoa');
  if (property.features.garden || property.features.fondo || property.features.patio) amenities.push('Fondo / Jardín / Patio');
  if (property.features.pool) amenities.push('Piscina');
  if (property.features.woodStoveOrAC) amenities.push('Estufa a leña o Aire acondicionado');
  if (property.features.petFriendly) amenities.push('Acepta mascotas (Pet friendly)');
  if (property.features.oseWater) amenities.push('Agua corriente (OSE)');
  if (property.features.uteElectric) amenities.push('Energía eléctrica (UTE)');
  if (property.features.sanitation) amenities.push('Saneamiento');
  if (property.features.fiberOptic) amenities.push('Fibra óptica');
  if (property.features.waterWellOrPond) amenities.push('Pozo de agua / Tajamar');
  if (property.features.perimeterFence) amenities.push('Cerco perimetral');

  if (amenities.length > 0) {
    amenities.forEach((a) => (md += `- ${a}\n`));
  } else {
    md += `- Información estándar de servicios verificada por Inmobiliaria Montaño.\n`;
  }
  md += `\n`;

  md += `## Certezas Jurídicas y Bancarias\n`;
  md += `- **Títulos de Propiedad:** ${property.legalCertainties?.titlesUpToDate || property.features.titlesUpToDate ? 'Al día y escriturables' : 'En trámite / A verificar'}\n`;
  md += `- **Apta para Crédito Bancario:** ${property.legalCertainties?.bankCreditEligible || property.features.bankCreditEligible ? 'Sí (BHU, Santander, Itaú, BBVA, Scotiabank)' : 'A consultar con escribanía'}\n`;
  md += `- **Acepta Permuta:** ${property.legalCertainties?.acceptsTradeIn || property.features.acceptsTradeIn ? 'Sí, consulta condiciones' : 'No'}\n`;
  md += `\n`;

  if (property.guarantees && property.guarantees.length > 0) {
    md += `## Garantías de Alquiler Aceptadas\n`;
    property.guarantees.forEach((g) => (md += `- ${g}\n`));
    md += `\n`;
  }

  md += `## Descripción Detallada\n`;
  md += `${cleanDescription}\n\n`;

  md += `## Asesor Inmobiliario y Contacto\n`;
  md += `- **Inmobiliaria:** Inmobiliaria Montaño\n`;
  md += `- **Asesor Responsable:** Daniel Montaño (Director & Asesor Inmobiliario)\n`;
  md += `- **Teléfono / WhatsApp:** +598 92 776 715\n`;
  md += `- **Email:** inmobiliariadaniel247@gmail.com\n`;
  md += `- **Ubicación:** San José de Mayo, Departamento de San José, Uruguay\n`;
  md += `- **Ficha Web Canónica:** ${canonicalUrl}\n`;

  return md;
}
