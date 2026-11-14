import { MONTAÑO_WHATSAPP_PHONE } from '@/utils/whatsapp';

export const GOOGLE_MAPS_STATS = {
  ratingValue: 5.0,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 15,
  ratingCount: 15,
  placeId: 'ChIJgU0vgPl3oZURSNT4x7Lw3fE',
  mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJgU0vgPl3oZURSNT4x7Lw3fE',
  shortShareUrl: 'https://share.google/6I1gbffV5ZTS5heXV',
  coordinates: {
    lat: -34.3397,
    lng: -56.7136,
  },
} as const;

export interface VerifiedGoogleReview {
  id: string;
  authorName: string;
  roleBadge: string;
  rating: number;
  text: string;
  authorUrl: string;
  category: 'venta' | 'alquiler' | 'general';
  relativeTimeLabel: string;
  ownerReply?: string;
}

export const VERIFIED_GOOGLE_REVIEWS: VerifiedGoogleReview[] = [
  {
    id: 'rev-circulo-policial',
    authorName: 'Círculo Policial San José',
    roleBadge: 'Convenio Institucional Oficial',
    rating: 5,
    text: 'Agradecemos a Inmobiliaria Montaño por los beneficios que brinda a nuestros afiliados para el acceso a alquileres en el departamento de San José.',
    authorUrl: 'https://www.google.com/maps/contrib/108317444149216844157/reviews?hl=es-419',
    category: 'alquiler',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      'Es un verdadero gusto colaborar y facilitar soluciones de alquiler para todos los afiliados en el departamento de San José. Pueden consultar todas las opciones de propiedades e información directamente en www.inmobiliariamontano.uy. ¡Gracias por la confianza de siempre!',
  },
  {
    id: 'rev-oscar-caetano',
    authorName: 'Oscar Caetano',
    roleBadge: 'Local Guide • 93 opiniones',
    rating: 5,
    text: 'Destacada inmobiliaria en san José. Atención impecable. Compromiso y total confianza. Muy recomendable',
    authorUrl: 'https://www.google.com/maps/contrib/111544246625975559264/reviews?hl=es-419',
    category: 'general',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      'Muchas gracias, Oscar, por tus palabras y tu confianza en Inmobiliaria Montaño. Nos alegra saber que valoras nuestro compromiso y atención. ¡Siempre a las órdenes en San José de Mayo para lo que necesites!',
  },
  {
    id: 'rev-cesar-zunino',
    authorName: 'Cesar Zunino',
    roleBadge: 'Cliente Verificado',
    rating: 5,
    text: 'Muy buena atención en todas las consultas que hemos realizado, inmobiliaria reconocida en el departamento',
    authorUrl: 'https://www.google.com/maps/contrib/114958650587119502025/reviews?hl=es-419',
    category: 'venta',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      'Muchas gracias, Cesar, por destacar nuestro trabajo. Para el equipo de Inmobiliaria Montaño es un placer responder cada consulta con la dedicación y el profesionalismo que el mercado inmobiliario de San José de Mayo merece. ¡A las órdenes siempre para futuros proyectos y asesoramiento!',
  },
  {
    id: 'rev-jose-luis-alvez',
    authorName: 'Jose Luis Alvez',
    roleBadge: 'Operación de Alquiler • 7 opiniones',
    rating: 5,
    text: 'Alquile con la inmobiliaria montaño y me dio un buen servicio',
    authorUrl: 'https://www.google.com/maps/contrib/111868925743992240666/reviews?hl=es-419',
    category: 'alquiler',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      '¡Muchas gracias, Jose Luis, por elegir a Inmobiliaria Montaño para tu alquiler! Nos alegra haberte brindado una gestión ágil y confiable. Para cualquier futura consulta sobre propiedades en San José de Mayo, estamos a tu disposición en www.inmobiliariamontano.uy.',
  },
  {
    id: 'rev-adriana-aguina',
    authorName: 'Adriana Aguiña',
    roleBadge: 'Asesoramiento Inmobiliario',
    rating: 5,
    text: 'Excelente asesoramiento!!!',
    authorUrl: 'https://www.google.com/maps/contrib/108533648941663008925/reviews?hl=es-419',
    category: 'general',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      '¡Muchas gracias, Adriana! Brindar un asesoramiento inmobiliario claro, seguro y personalizado en cada paso es nuestra prioridad en Inmobiliaria Montaño. ¡Gracias por confiar en nosotros en San José!',
  },
  {
    id: 'rev-angel-cabrera',
    authorName: 'Angel Cabrera',
    roleBadge: 'Atención y Respuesta Rápida',
    rating: 5,
    text: 'Excelente asesoramiento y rápida respuesta.',
    authorUrl: 'https://www.google.com/maps/contrib/106120224875956196786/reviews?hl=es-419',
    category: 'general',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      'Muchas gracias, Angel, por tu reseña y por valorar nuestra rapidez de respuesta. En Inmobiliaria Montaño sabemos lo importante que es contar con un asesoramiento ágil y seguro a la hora de buscar o gestionar inmuebles en San José. ¡Estamos siempre a tus órdenes!',
  },
  {
    id: 'rev-lucho-green',
    authorName: 'Lucho Green',
    roleBadge: 'Cliente Verificado • Casas',
    rating: 5,
    text: 'Excelente atención! · Tipos de propiedades: Casas',
    authorUrl: 'https://www.google.com/maps/contrib/103082769116535716171/reviews?hl=es-419',
    category: 'venta',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      '¡Muchas gracias, Lucho, por valorar nuestra atención! Nos enfocamos en brindar el mejor asesoramiento inmobiliario en San José de Mayo. Recuerda que puedes consultar nuestro catálogo completo y actualizado en www.inmobiliariamontano.uy. ¡A las órdenes!',
  },
  {
    id: 'rev-diego-suarez',
    authorName: 'Diego Suarez',
    roleBadge: 'Cliente Verificado • 4 opiniones',
    rating: 5,
    text: 'Inmobiliaria Montaño , gracias por la atención',
    authorUrl: 'https://www.google.com/maps/contrib/115934234021468951156/reviews?hl=es-419',
    category: 'general',
    relativeTimeLabel: 'Reseña verificada en Google',
    ownerReply:
      '¡Muchas gracias por tu confianza, Diego! En Inmobiliaria Montaño priorizamos siempre la cercanía y el compromiso en cada trámite. Te esperamos en nuestra oficina de 25 de Mayo 338 y en nuestra web www.inmobiliariamontano.uy',
  },
];

export interface ActiveDemandProfile {
  id: string;
  operation: 'venta' | 'alquiler';
  categoryTag: string;
  title: string;
  zones: string;
  backing: string;
  description: string;
  whatsappMessage: string;
}

export const ACTIVE_DEMAND_PROFILES: ActiveDemandProfile[] = [
  {
    id: 'dem-venta-casas-bhu',
    operation: 'venta',
    categoryTag: 'Casas Residenciales',
    title: 'Casas de 2 y 3 Dormitorios Aptas para Banco o Contado',
    zones: 'San José de Mayo (Centro, Molino, Arriaga, Parque Rodó)',
    backing: 'Compradores con crédito BHU / BROU y capital propio',
    description:
      'Familias y compradores calificados buscando casas con patio, fondo o garaje y documentación al día.',
    whatsappMessage:
      'Hola Daniel, vi en la web que buscan casas de 2 y 3 dormitorios para la venta en San José. Tengo una propiedad para consultar.',
  },
  {
    id: 'dem-alquiler-residencial',
    operation: 'alquiler',
    categoryTag: 'Vivienda Anual',
    title: 'Casas y Apartamentos de 1, 2 y 3 Dormitorios para Alquiler Anual',
    zones: 'San José de Mayo y alrededores',
    backing: 'Garantías ANDA, CGN, Porto Seguro, SURA y Convenio Círculo Policial',
    description:
      'Alta demanda continua de inquilinos solventes con garantía aprobada buscando vivienda anual.',
    whatsappMessage:
      'Hola Daniel, vi la demanda activa de alquileres residenciales en San José y quiero ofrecer una propiedad para alquilar.',
  },
  {
    id: 'dem-venta-terrenos',
    operation: 'venta',
    categoryTag: 'Terrenos y Solares',
    title: 'Terrenos y Solares para Edificar o Inversión',
    zones: 'San José de Mayo, Arroyo Mallada, Libertad y Eje Ruta 1',
    backing: 'Pago contado o entrega y financiación',
    description:
      'Interesados en solares nivelados con servicios de UTE y OSE para construcción de vivienda o desarrollo.',
    whatsappMessage:
      'Hola Daniel, tengo un terreno/solar en San José y vi que tienen interesados activos buscando para comprar.',
  },
  {
    id: 'dem-alquiler-comercial',
    operation: 'alquiler',
    categoryTag: 'Comercial y Logística',
    title: 'Locales Comerciales, Oficinas y Depósitos / Galpones',
    zones: 'Zona Centro, Ejes Comerciales y Accesos Ruta 3 y 11',
    backing: 'Empresas y comercios con garantía aseguradora o fianza',
    description:
      'Búsqueda de locales bien ubicados y depósitos con buen acceso logístico para contratos comerciales.',
    whatsappMessage:
      'Hola Daniel, tengo un local comercial o depósito para alquilar en San José y quiero conversar con ustedes.',
  },
  {
    id: 'dem-venta-chacras',
    operation: 'venta',
    categoryTag: 'Rural y Suburbano',
    title: 'Chacras y Fracciones de Campo en San José',
    zones: 'Rutas 1, 3, 11 y 45 • Interior de San José',
    backing: 'Inversores y compradores con fondos disponibles',
    description:
      'Búsqueda activa de chacras marítimas, residenciales o productivas con buen acceso todo el año.',
    whatsappMessage:
      'Hola Daniel, tengo una chacra o fracción de campo en San José para evaluar su venta con la inmobiliaria.',
  },
  {
    id: 'dem-venta-inversion',
    operation: 'venta',
    categoryTag: 'Inversión / Renta',
    title: 'Propiedades para Reciclar o Renta Inmediata (PH / Casas)',
    zones: 'San José de Mayo',
    backing: 'Inversores locales al contado',
    description:
      'Clientes inversores buscando casas o apartamentos bien ubicados para remodelar o volcar al mercado de alquiler.',
    whatsappMessage:
      'Hola Daniel, tengo una propiedad ideal para inversión o reciclaje en San José de Mayo y me gustaría tasarla para vender.',
  },
];

export function buildDemandWhatsAppUrl(profile: ActiveDemandProfile): string {
  return `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(profile.whatsappMessage)}`;
}

/**
 * Genera los bloques Schema.org estandarizados de calificación agregada, reseñas y demandas
 * para unificar la autoridad de Inmobiliaria Montaño ante Google, Maps y motores de IA.
 */
export function buildOrganizationReviewsAndDemandsSchema() {
  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: GOOGLE_MAPS_STATS.ratingValue.toFixed(1),
      bestRating: String(GOOGLE_MAPS_STATS.bestRating),
      worstRating: String(GOOGLE_MAPS_STATS.worstRating),
      ratingCount: String(GOOGLE_MAPS_STATS.ratingCount),
      reviewCount: String(GOOGLE_MAPS_STATS.reviewCount),
    },
    review: VERIFIED_GOOGLE_REVIEWS.map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.authorName,
        url: rev.authorUrl,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(rev.rating),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: rev.text,
      inLanguage: 'es-UY',
    })),
    seeks: ACTIVE_DEMAND_PROFILES.map((dem) => ({
      '@type': 'Demand',
      name: `${dem.operation === 'alquiler' ? 'Búsqueda de Alquiler' : 'Búsqueda de Compra'}: ${dem.title}`,
      description: `${dem.description} Zonas: ${dem.zones}. Respaldo: ${dem.backing}.`,
      areaServed: {
        '@type': 'AdministrativeArea',
        name: dem.zones,
      },
    })),
  };
}
