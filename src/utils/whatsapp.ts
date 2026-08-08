import { Property } from '@/types/property';

export const MONTAÑO_WHATSAPP_PHONE = '59892776715';
export const MONTAÑO_OFFICIAL_EMAIL = 'inmobiliariadaniel247@gmail.com';

/**
 * Genera el enlace directo a WhatsApp con un mensaje contextual pre-redactado
 * citando la referencia, tipo, ubicación y precio exacto de la propiedad.
 */
export function buildPropertyWhatsAppLink(
  property: Property,
  customPhone: string = MONTAÑO_WHATSAPP_PHONE
): string {
  const opStr = property.operation === 'alquiler' ? 'alquiler' : property.operation === 'proyecto' ? 'proyecto en pozo' : 'venta';
  const priceFormatted = `${property.price.currency} ${property.price.amount.toLocaleString()}`;
  const text = `Hola Inmobiliaria Montaño, estoy interesado/a en la propiedad Ref. ${property.codeRef} (${property.title} en ${property.location.neighborhood} - ${priceFormatted} en ${opStr}). ¿Podrían brindarme más información y coordinar una visita?`;
  
  return `https://wa.me/${customPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Genera un enlace a WhatsApp para consultas generales de tasación o captación.
 */
export function buildGeneralWhatsAppLink(
  subject: 'tasacion' | 'publicar' | 'general' = 'general',
  customPhone: string = MONTAÑO_WHATSAPP_PHONE
): string {
  let text = 'Hola Inmobiliaria Montaño, me comunico a través de la web para hacer una consulta.';
  
  if (subject === 'tasacion') {
    text = 'Hola Inmobiliaria Montaño, me gustaría solicitar una tasación para mi propiedad en San José.';
  } else if (subject === 'publicar') {
    text = 'Hola Inmobiliaria Montaño, deseo publicar mi propiedad con ustedes para venta/alquiler.';
  }
  
  return `https://wa.me/${customPhone}?text=${encodeURIComponent(text)}`;
}
