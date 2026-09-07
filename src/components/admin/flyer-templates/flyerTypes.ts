export type FlyerTemplateId = 'classic' | 'chacra' | 'modular';
export type FlyerAspectRatio = '1:1' | '9:16' | '4:5';
export type FlyerLayoutMode = 'single' | 'collage';

export interface FlyerAmenityItem {
  id: string;
  label: string;
  icon: 'bed' | 'bath' | 'kitchen' | 'garage' | 'tree' | 'bbq' | 'm2' | 'commercial' | 'water' | 'fire' | 'pool' | 'check' | 'house' | 'shield';
}

export interface FlyerChacraBadge {
  title: string;
  desc: string;
  icon: 'pin' | 'water' | 'area' | 'fire' | 'tree' | 'check';
}

export interface FlyerData {
  templateId: FlyerTemplateId;
  aspectRatio: FlyerAspectRatio;
  layoutMode: FlyerLayoutMode;
  mainHeadline: string; // "EN VENTA", "CHACRA EN VENTA", "TU CASA LISTA PARA VIVIR"
  subHeadline?: string; // "AMPLIA PROPIEDAD", "CASA EN ESQUINA", "3600 M² DE TRANQUILIDAD Y NATURALEZA"
  locationBadgeTitle: string; // "SAN JOSÉ" o "CASA A 1 CUADRA DE LA PLAZA 33"
  locationBadgeSubtitle?: string; // "A 6 CUADRAS DEL CENTRO"
  pricePrefix: string; // "POR SOLO", "VALOR DEL MÓDULO", "PRECIO:"
  priceAmount: string; // "U$S 117.000", "U$S CONSULTAR", "USD 24.500"
  sloganTop: string; // "EL HOGAR QUE" o "TU NUEVO PROYECTO" o "TU LUGAR"
  sloganBottom: string; // "TU FAMILIA MERECE" o "TE ESTÁ ESPERANDO" o "PARA VIVIR MEJOR"
  phone: string; // "092 776 715"
  email: string; // "inmobiliariadaniel247@gmail.com"
  website: string; // "www.inmobiliariamontano.uy"
  locationCity: string; // "San José"
  imageUrl: string;
  imageScale: number; // 1 to 2 (100% to 200%)
  imageOffsetX: number; // -50 to 50
  imageOffsetY: number; // -50 to 50
  secondaryImage1Url?: string;
  secondaryImage2Url?: string;
  amenities: FlyerAmenityItem[];
  bulletPoints: string[];
  chacraBadges: FlyerChacraBadge[];
  showWebsiteInFooter: boolean;
  showQrCode: boolean;
  qrCodeDataUrl?: string;
  coBrandingTitle?: string; // "INGENIERÍA MODULAR"
}
