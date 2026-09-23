import { Property } from '@/types/property';

export const MONTAÑO_WHATSAPP_PHONE = '59892776715';
export const MONTAÑO_OFFICIAL_EMAIL = 'contacto@inmobiliariamontano.uy';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

/**
 * Genera el enlace directo a WhatsApp con un mensaje contextual pre-redactado
 * citando la referencia, tipo, ubicación, precio exacto y enlace directo para miniatura.
 */
export function buildPropertyWhatsAppLink(
  property: Property,
  customPhone: string = MONTAÑO_WHATSAPP_PHONE
): string {
  const opStr = property.operation === 'alquiler' ? 'alquiler' : property.operation === 'proyecto' ? 'proyecto' : 'venta';
  const priceMode = property.price.priceMode || (property.price.amount === 0 ? 'consultar' : 'visible');
  const hasValidPrice = Boolean(property.price.amount && property.price.amount > 0 && priceMode !== 'consultar' && priceMode !== 'reservado');
  const priceFormatted = `${property.price.currency} ${property.price.amount?.toLocaleString('es-UY')}`;
  const propertyUrl = `${SITE_URL}/propiedad/${property.slug}`;

  let text = '';
  if (property.operation === 'busqueda' || priceMode === 'oculto') {
    text = `Hola Inmobiliaria Montaño, vi la publicación/búsqueda Ref. #${property.codeRef} (${property.title}) y tengo una propiedad para ofrecerles.\n\n🔗 Ver publicación: ${propertyUrl}\n\n¿Podríamos coordinar para conversar al respecto?`;
  } else if (property.status === 'reservado') {
    text = `Hola Inmobiliaria Montaño, vi que la propiedad Ref. #${property.codeRef} (${property.title}) se acaba de reservar.\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían mostrarme opciones similares disponibles en San José o avisarme si se libera?`;
  } else if (property.status === 'vendido') {
    text = `Hola Inmobiliaria Montaño, vi que la propiedad Ref. #${property.codeRef} (${property.title}) ya fue vendida.\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían brindarme información sobre opciones similares disponibles en San José?`;
  } else if (property.status === 'alquilado') {
    text = `Hola Inmobiliaria Montaño, vi que la propiedad Ref. #${property.codeRef} (${property.title}) ya fue alquilada.\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían brindarme información sobre opciones similares disponibles en San José?`;
  } else if (!hasValidPrice || priceMode === 'consultar') {
    text = `Hola Inmobiliaria Montaño, quisiera consultar el precio y condiciones de la propiedad Ref. #${property.codeRef} (${property.title} en ${property.location.neighborhood}).\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían brindarme más información y coordinar una visita?`;
  } else if (priceMode === 'reservado') {
    text = `Hola Inmobiliaria Montaño, quisiera solicitar información confidencial y detalles de la propiedad Ref. #${property.codeRef} (${property.title} en ${property.location.neighborhood}).\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían contactarme?`;
  } else if (priceMode === 'desde') {
    text = `Hola Inmobiliaria Montaño, quisiera consultar unidades y planes de financiación disponibles desde ${priceFormatted} para el proyecto Ref. #${property.codeRef} (${property.title}).\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían brindarme más detalles?`;
  } else {
    text = `Hola Inmobiliaria Montaño, estoy interesado/a en la propiedad Ref. #${property.codeRef} (${property.title} - ${priceFormatted} en ${opStr}).\n\n🔗 Ver propiedad: ${propertyUrl}\n\n¿Podrían brindarme más información y coordinar una visita?`;
  }
  
  return `https://wa.me/${customPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Genera el texto del mensaje cuando se comparte una propiedad por WhatsApp u otras redes sociales.
 */
export function buildPropertyShareMessage(property: Property): string {
  const propertyUrl = `${SITE_URL}/propiedad/${property.slug}`;
  if (property.status === 'reservado') {
    return `Esta propiedad (Ref. #${property.codeRef}) se acaba de reservar. Podés ver otras opciones similares en San José: ${propertyUrl}`;
  }
  if (property.status === 'vendido') {
    return `Esta propiedad (Ref. #${property.codeRef}) ya fue vendida. Podés ver otras opciones similares en San José: ${propertyUrl}`;
  }
  if (property.status === 'alquilado') {
    return `Esta propiedad (Ref. #${property.codeRef}) ya fue alquilada. Podés ver otras opciones similares en San José: ${propertyUrl}`;
  }
  return propertyUrl;
}

export type WhatsAppServiceSubject = 'tasacion' | 'publicar' | 'notarial' | 'general';

/**
 * Genera un enlace a WhatsApp para consultas generales de tasación, captación o asesoramiento notarial.
 */
export function buildGeneralWhatsAppLink(
  subject: WhatsAppServiceSubject = 'general',
  customPhone: string = MONTAÑO_WHATSAPP_PHONE
): string {
  let text = 'Hola Inmobiliaria Montaño, me comunico a través de la web para hacer una consulta.';
  
  if (subject === 'tasacion') {
    text = 'Hola Inmobiliaria Montaño, me gustaría solicitar una tasación profesional para mi propiedad en San José.';
  } else if (subject === 'publicar') {
    text = 'Hola Inmobiliaria Montaño, quisiera consultar requisitos para publicar mi inmueble con ustedes en venta o alquiler.';
  } else if (subject === 'notarial') {
    text = 'Hola Inmobiliaria Montaño, quisiera solicitar información sobre Asesoramiento Notarial para una operación inmobiliaria.';
  }
  
  return `https://wa.me/${customPhone}?text=${encodeURIComponent(text)}`;
}
