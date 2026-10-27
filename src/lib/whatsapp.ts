/**
 * Utilidades de WhatsApp y Sanitización de Contactos para San José / Uruguay.
 * Previene números rotos, duplicaciones de código de país (+598) y filtra contactos de colegas/competencia.
 */

// Teléfonos conocidos de inmobiliarias y colegas en San José / Uruguay para evitar contacto accidental
export const KNOWN_COMPETITOR_PHONES = new Set([
  '59899553253', // Lema Propiedades
  '59898703438', // Brickell Inmobiliarios
  '59892806062', // Covello International
  '59892936012', // Ocho Puntos Real Estate
  '59897233255', // Century 21
  '59897447431', // Inmobiliaria Socio ADIU / Tera Inmuebles
]);

// Palabras clave que identifican inequívocamente a una inmobiliaria o agente intermediario
export const COMPETITOR_KEYWORD_PATTERNS = [
  /\bcomisi[oó]n\s+inmobiliaria\b/i,
  /\bhonorarios\s+inmobiliarios\b/i,
  /\b3\s*%\s*\+?\s*iva\b/i,
  /\bhonorarios\b/i,
  /\binmobiliaria\b/i,
  /\bbienes ra[ií]ces\b/i,
  /\bagente inmobiliario\b/i,
  /\basesor inmobiliario\b/i,
  /\bcorredor\s+inmobiliario\b/i,
  /\brematador\b/i,
  /\bmatr[ií]cula\s+profesional\b/i,
  /\bre\/max\b/i,
  /\bremax\b/i,
  /\bcentury\s*21\b/i,
  /\bnegocios inmobiliarios\b/i,
  /\badiu\b/i, // Asociación de Inmobiliarias del Uruguay
  /\bsocio\s+adiu\b/i,
  /\bc[aá]mara\s+inmobiliaria\b/i,
  /\bciu\b/i, // Cámara Inmobiliaria Uruguaya
  /\banrtci\b/i, // Rematadores y Corredores
  /\bc[oó]digo\s+tera\b/i, // Tera Sistema Inmobiliario
  /\btera:\b/i,
  /\btokko\b/i, // CRM Tokko Broker
  /\bref[\s.:#-]*\d+\b/i, // Código de referencia de inmobiliaria (ej. "ref 189")
];

/**
 * Normaliza un número telefónico uruguayo al formato estándar internacional: 598 + número celular sin 0.
 * Ejemplo:
 *   "+598 95 308 162" -> "59895308162"
 *   "099 553 253"     -> "59899553253"
 *   "094123456"       -> "59894123456"
 *   "59894123456"     -> "59894123456"
 */
export function normalizeUruguayPhone(phone: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');

  if (digits.startsWith('598')) {
    digits = digits.slice(3);
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // En Uruguay los móviles tienen 8 dígitos tras quitar el 0 (ej. 99 123 456)
  if (digits.length === 8 && digits.startsWith('9')) {
    return `598${digits}`;
  }

  // Fijo en San José (código 434 + 5 dígitos = 7-8 dígitos)
  if (digits.length >= 7 && digits.length <= 8) {
    return `598${digits}`;
  }

  return digits ? `598${digits}` : null;
}

/**
 * Construye el enlace universal a WhatsApp asegurando que no se duplique el código de país.
 */
export function buildUruguayWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeUruguayPhone(phone);
  if (!normalized) {
    return '#';
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Evalúa si una publicación pertenece a una inmobiliaria competidora basándose en:
 * 1. Coincidencia en lista negra de teléfonos de la competencia.
 * 2. Detección de vocabulario de intermediación en la descripción o título.
 */
export function detectCompetitorSignatures(data: {
  phone?: string;
  title?: string;
  description?: string;
  contactName?: string;
}): { isCompetitor: boolean; reason?: string } {
  if (data.phone) {
    const normalized = normalizeUruguayPhone(data.phone);
    if (normalized && KNOWN_COMPETITOR_PHONES.has(normalized)) {
      return { isCompetitor: true, reason: 'Teléfono registrado en lista negra de inmobiliarias' };
    }
  }

  const fullText = `${data.title || ''} ${data.description || ''} ${data.contactName || ''}`;
  for (const pattern of COMPETITOR_KEYWORD_PATTERNS) {
    if (pattern.test(fullText)) {
      return { isCompetitor: true, reason: `Término de agencia detectado (${pattern.source})` };
    }
  }

  return { isCompetitor: false };
}
