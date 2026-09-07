'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import QRCode from 'qrcode';
import { Property } from '@/types/property';
import { FlyerData, FlyerTemplateId, FlyerAmenityItem, FlyerAspectRatio, FlyerLayoutMode } from './flyer-templates/flyerTypes';
import { FlyerCanvasResponsive } from './flyer-templates/FlyerCanvasResponsive';
import {
  Download,
  Copy,
  X,
  Sparkles,
  Layout,
  Type,
  CheckSquare,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Check,
  QrCode,
  Maximize2,
  Smartphone,
  Square,
  RectangleVertical,
  Layers,
  PhoneCall,
} from 'lucide-react';

interface FlyerGeneratorModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SLOGANS = [
  { top: 'EL HOGAR QUE', bottom: 'TU FAMILIA MERECE' },
  { top: 'TU NUEVO PROYECTO', bottom: 'TE ESTÁ ESPERANDO' },
  { top: 'TU LUGAR', bottom: 'PARA VIVIR MEJOR' },
  { top: 'OPORTUNIDAD ÚNICA', bottom: 'DE INVERSIÓN' },
  { top: 'MODERNA Y FUNCIONAL', bottom: 'LISTA PARA INGRESAR' },
];

export const FlyerGeneratorModal: React.FC<FlyerGeneratorModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'format' | 'texts' | 'amenities' | 'photo' | 'conversion'>('format');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [customAmenityText, setCustomAmenityText] = useState('');
  const [previewZoom, setPreviewZoom] = useState<number>(0.65);

  // Extract initial flyer data from Property
  const buildInitialData = (): FlyerData => {
    let headline = 'EN VENTA';
    if (property.operation === 'alquiler') headline = 'EN ALQUILER';
    else if (property.category === 'chacra') headline = 'CHACRA EN VENTA';
    else if (property.category === 'terreno') headline = 'TERRENO EN VENTA';
    else if (property.category === 'modulo' || property.category === 'proyecto') headline = 'PROYECTO EN POZO';

    // Format price
    const pMode = property.price.priceMode || (property.price.amount === 0 ? 'consultar' : 'visible');
    let priceText = 'U$S CONSULTAR';
    if (pMode === 'visible' && property.price.amount > 0) {
      const sym = property.price.currency === 'USD' ? 'U$S' : 'UYU $';
      priceText = `${sym} ${property.price.amount.toLocaleString('es-UY')}`;
    } else if (pMode === 'desde' && property.price.amount > 0) {
      const sym = property.price.currency === 'USD' ? 'U$S' : 'UYU $';
      priceText = `DESDE ${sym} ${property.price.amount.toLocaleString('es-UY')}`;
    }

    // Main and secondary images
    const mainImg = property.images?.find((img) => img.isMain) || property.images?.[0];
    const initialImgUrl = mainImg?.webpUrl || mainImg?.blobUrl || '/logo.png';

    const secImg1 = property.images?.find((img, i) => !img.isMain && i > 0) || property.images?.[1];
    const secImg2 = property.images?.find((img, i) => !img.isMain && i > 1) || property.images?.[2];

    // Amenities
    const autoAmenities: FlyerAmenityItem[] = [];
    const f = property.features || {};

    if (f.bedrooms) autoAmenities.push({ id: 'bed', label: `${f.bedrooms} ${f.bedrooms === 1 ? 'DORMITORIO' : 'DORMITORIOS'}`, icon: 'bed' });
    if (f.bathrooms) autoAmenities.push({ id: 'bath', label: `${f.bathrooms} BAÑO${f.bathrooms > 1 ? 'S' : ''}`, icon: 'bath' });
    if (f.builtAreaM2) autoAmenities.push({ id: 'm2_edif', label: `${f.builtAreaM2} M² EDIFICADOS`, icon: 'm2' });
    if (f.plotAreaM2) autoAmenities.push({ id: 'm2_terr', label: `${f.plotAreaM2} M² DE TERRENO`, icon: 'm2' });
    if (f.garage || f.cochera || f.carAccess) autoAmenities.push({ id: 'garage', label: 'GARAJE', icon: 'garage' });
    if (f.barbacoa || f.barbecue || f.parrillero) autoAmenities.push({ id: 'bbq', label: 'PARRILLERO / BARBACOA', icon: 'bbq' });
    if (f.fondo || f.garden || f.patio) autoAmenities.push({ id: 'tree', label: 'FONDO CON VERDE', icon: 'tree' });
    if (f.pool) autoAmenities.push({ id: 'pool', label: 'PISCINA', icon: 'pool' });
    if (f.woodStoveOrAC) autoAmenities.push({ id: 'fire', label: 'ESTUFA / AIRE ACOND.', icon: 'fire' });
    if (f.oseWater) autoAmenities.push({ id: 'water', label: 'AGUA DE OSE', icon: 'water' });
    if (f.bankCreditEligible) autoAmenities.push({ id: 'shield', label: 'APTO CRÉDITO BANCO', icon: 'shield' });
    if (f.titlesUpToDate) autoAmenities.push({ id: 'check', label: 'TÍTULOS AL DÍA', icon: 'check' });

    if (autoAmenities.length === 0) {
      autoAmenities.push(
        { id: '1', label: 'EXCELENTE UBICACIÓN', icon: 'check' },
        { id: '2', label: 'SERVICIOS AL DÍA', icon: 'check' },
        { id: '3', label: 'BUENA ILUMINACIÓN', icon: 'check' }
      );
    }

    const defaultBullets = [
      'Ubicación consolidada y estratégica',
      'Excelente relación precio-calidad',
      'Atención personalizada y trato directo',
    ];

    const defaultSubHeadline = property.category === 'modulo'
      ? 'MÓDULO HABITACIONAL LLAVE EN MANO'
      : property.category === 'chacra'
      ? 'CHACRA Y NATURALEZA'
      : property.category === 'terreno'
      ? 'TERRENO IDEAL PARA CONSTRUIR'
      : property.category === 'apartamento'
      ? 'APARTAMENTO MODERNO'
      : property.category === 'local'
      ? 'LOCAL COMERCIAL CÉNTRICO'
      : 'CASA RESIDENCIAL';

    return {
      templateId: 'classic',
      aspectRatio: '1:1',
      layoutMode: 'single',
      mainHeadline: headline,
      subHeadline: defaultSubHeadline,
      locationBadgeTitle: (property.location?.neighborhood || property.location?.city || 'SAN JOSÉ').toUpperCase(),
      locationBadgeSubtitle: `${property.location?.neighborhood ? `${property.location.neighborhood}, ` : ''}${property.location?.city || 'San José de Mayo'}`,
      pricePrefix: 'VALOR DE PUBLICACIÓN',
      priceAmount: priceText,
      sloganTop: PRESET_SLOGANS[0].top,
      sloganBottom: PRESET_SLOGANS[0].bottom,
      phone: '092 776 715',
      email: 'inmobiliariadaniel247@gmail.com',
      website: 'www.inmobiliariamontano.uy',
      locationCity: property.location?.city || 'San José de Mayo',
      imageUrl: initialImgUrl,
      imageScale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      secondaryImage1Url: secImg1?.webpUrl || secImg1?.blobUrl || '',
      secondaryImage2Url: secImg2?.webpUrl || secImg2?.blobUrl || '',
      amenities: autoAmenities,
      bulletPoints: defaultBullets,
      chacraBadges: [],
      showWebsiteInFooter: true,
      showQrCode: true,
    };
  };

  const [flyerData, setFlyerData] = useState<FlyerData>(buildInitialData());

  // Generar QR en base64 de la URL canónica
  useEffect(() => {
    if (!isOpen) return;
    const generateQr = async () => {
      try {
        const canonicalUrl = `https://www.inmobiliariamontano.uy/propiedad/${property.slug}`;
        const qrDataUrl = await QRCode.toDataURL(canonicalUrl, {
          margin: 1,
          width: 256,
          color: {
            dark: '#1D102F',
            light: '#FFFFFF',
          },
        });
        setFlyerData((p) => ({ ...p, qrCodeDataUrl: qrDataUrl }));
      } catch (err) {
        console.error('Error generando QR code:', err);
      }
    };
    generateQr();
  }, [isOpen, property.slug]);

  // Actualizar datos iniciales al abrir
  useEffect(() => {
    if (isOpen) {
      setFlyerData(buildInitialData());
      setExportSuccess(false);
      setCopiedSuccess(false);
    }
  }, [isOpen, property]);

  // Ajustar zoom inicial según formato
  useEffect(() => {
    if (flyerData.aspectRatio === '9:16') {
      setPreviewZoom(0.48);
    } else if (flyerData.aspectRatio === '4:5') {
      setPreviewZoom(0.58);
    } else {
      setPreviewZoom(0.66);
    }
  }, [flyerData.aspectRatio]);

  if (!isOpen) return null;

  // Exportar a JPG en Alta Resolución (2.5x)
  const handleDownloadJpg = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const canvasNode = previewRef.current.firstElementChild as HTMLElement;
      if (!canvasNode) throw new Error('No se encontró el elemento lienzo');

      const dataUrl = await htmlToImage.toJpeg(canvasNode, {
        quality: 0.96,
        pixelRatio: 2.5,
        backgroundColor: '#FAF9F6',
        cacheBust: true,
      });

      const link = document.createElement('a');
      const filename = `ficha-${flyerData.aspectRatio.replace(':', 'x')}-${property.codeRef || 'inmobiliaria-montano'}-${Date.now()}.jpg`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error generando JPG de alta resolución:', error);
      alert('Hubo un inconveniente al generar la imagen. Intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copiar Imagen al Portapapeles para pegar directo en WhatsApp Web
  const handleCopyToClipboard = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const canvasNode = previewRef.current.firstElementChild as HTMLElement;
      if (!canvasNode) throw new Error('No se encontró el elemento lienzo');

      const blob = await htmlToImage.toBlob(canvasNode, {
        pixelRatio: 2,
        backgroundColor: '#FAF9F6',
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
      } else {
        alert('Tu navegador no soporta el copiado directo de imágenes. Por favor usa "Descargar JPG".');
      }
    } catch (error) {
      console.error('Error copiando imagen al portapapeles:', error);
      alert('No se pudo copiar directamente la imagen. Por favor descárgala en JPG.');
    } finally {
      setIsExporting(false);
    }
  };

  // Dimensiones del lienzo según formato
  const canvasWidth = 720;
  const canvasHeight = flyerData.aspectRatio === '9:16' ? 1280 : flyerData.aspectRatio === '4:5' ? 900 : 720;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#120D22] border border-orange-500/30 rounded-2xl w-full max-w-7xl shadow-2xl flex flex-col h-[94vh] overflow-hidden text-white">
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="px-5 py-3 border-b border-orange-500/20 flex items-center justify-between bg-[#16102A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#E85D04] to-[#FF9E00] p-2 rounded-xl text-white shadow-md shadow-orange-500/20">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Estudio de Fichas Gráficas HD
                </h2>
                <span className="text-[11px] bg-orange-500/20 text-orange-400 font-bold px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  Ref. #{property.codeRef}
                </span>
                <span className="hidden sm:inline-block text-[11px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  {flyerData.aspectRatio === '1:1' ? '1:1 WhatsApp Chat' : flyerData.aspectRatio === '9:16' ? '9:16 Estados / Stories' : '4:5 Feed Publicidad'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Sin recortes destructivos • Optimizado para WhatsApp, Facebook Ads e Instagram
              </p>
            </div>
          </div>

          {/* BOTONES DE EXPORTACIÓN */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-[#1F1739] hover:bg-[#2A1F4D] text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-orange-500/20 cursor-pointer"
              title="Copiar imagen para pegar directo en WhatsApp Web (Ctrl+V)"
            >
              {copiedSuccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedSuccess ? '¡Copiada!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#E85D04] to-[#FF6B00] hover:from-[#FF6B00] hover:to-[#FFA000] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : exportSuccess ? (
                <Check size={14} />
              ) : (
                <Download size={14} />
              )}
              <span>{isExporting ? 'Renderizando HD...' : exportSuccess ? '¡Descargado!' : 'Descargar JPG (Alta Calidad)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CUERPO PRINCIPAL: 2 COLUMNAS (CONTROLES IZQUIERDA, PREVIEW DERECHA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* COLUMNA IZQUIERDA: PESTAÑAS Y CONTROLES */}
          <div className="lg:col-span-5 border-r border-orange-500/20 flex flex-col bg-[#140E26] overflow-y-auto">
            {/* SELECTOR DE PESTAÑAS */}
            <div className="flex border-b border-orange-500/20 bg-[#160F2B] p-1.5 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('format')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'format'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Layout size={13} />
                <span>Formato</span>
              </button>

              <button
                onClick={() => setActiveTab('texts')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'texts'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Type size={13} />
                <span>Textos</span>
              </button>

              <button
                onClick={() => setActiveTab('amenities')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'amenities'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <CheckSquare size={13} />
                <span>Comodidades</span>
              </button>

              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'photo'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <ImageIcon size={13} />
                <span>Fotos</span>
              </button>

              <button
                onClick={() => setActiveTab('conversion')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'conversion'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <QrCode size={13} />
                <span>QR & Contacto</span>
              </button>
            </div>

            {/* CONTENIDO DE LA PESTAÑA */}
            <div className="p-4 space-y-4">
              {/* PESTAÑA 1: FORMATO & ASPECT RATIO */}
              {activeTab === 'format' && (
                <div className="space-y-4">
                  {/* SELECTOR DE 3 FORMATOS ESTÁNDAR */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      📐 1. Formato según Destino
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFlyerData((p) => ({ ...p, aspectRatio: '1:1' }))}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          flyerData.aspectRatio === '1:1'
                            ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-md'
                            : 'bg-[#18112F] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Square size={22} className={flyerData.aspectRatio === '1:1' ? 'text-[#E85D04]' : 'text-slate-500'} />
                        <span className="text-xs font-bold block">1:1 Cuadrado</span>
                        <span className="text-[9px] text-slate-400">WhatsApp Chat & Feed</span>
                      </button>

                      <button
                        onClick={() => setFlyerData((p) => ({ ...p, aspectRatio: '9:16' }))}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          flyerData.aspectRatio === '9:16'
                            ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-md'
                            : 'bg-[#18112F] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Smartphone size={22} className={flyerData.aspectRatio === '9:16' ? 'text-[#E85D04]' : 'text-slate-500'} />
                        <span className="text-xs font-bold block">9:16 Vertical</span>
                        <span className="text-[9px] text-slate-400">Estados & Stories</span>
                      </button>

                      <button
                        onClick={() => setFlyerData((p) => ({ ...p, aspectRatio: '4:5' }))}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          flyerData.aspectRatio === '4:5'
                            ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-md'
                            : 'bg-[#18112F] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <RectangleVertical size={22} className={flyerData.aspectRatio === '4:5' ? 'text-[#E85D04]' : 'text-slate-500'} />
                        <span className="text-xs font-bold block">4:5 Retrato</span>
                        <span className="text-[9px] text-slate-400">Meta Ads & Facebook</span>
                      </button>
                    </div>
                  </div>

                  {/* SELECTOR DE DISPOSICIÓN: 1 FOTO VS COLLAGE */}
                  <div className="space-y-2 pt-2 border-t border-orange-500/20">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      🍱 2. Distribución de Fotografías
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFlyerData((p) => ({ ...p, layoutMode: 'single' }))}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          flyerData.layoutMode === 'single'
                            ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-md'
                            : 'bg-[#18112F] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                          <ImageIcon size={16} className={flyerData.layoutMode === 'single' ? 'text-[#E85D04]' : 'text-slate-500'} />
                        </div>
                        <div>
                          <span className="text-xs font-black block">1 Foto Protagonista</span>
                          <span className="text-[10px] text-slate-400">Fachada limpia al 100%</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setFlyerData((p) => ({ ...p, layoutMode: 'collage' }))}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          flyerData.layoutMode === 'collage'
                            ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-md'
                            : 'bg-[#18112F] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                          <Layers size={16} className={flyerData.layoutMode === 'collage' ? 'text-[#E85D04]' : 'text-slate-500'} />
                        </div>
                        <div>
                          <span className="text-xs font-black block">Modo Collage (3 Fotos)</span>
                          <span className="text-[10px] text-slate-400">1 Principal + 2 Detalles</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: TEXTOS & PRECIO */}
              {activeTab === 'texts' && (
                <div className="space-y-3">
                  {/* PRECIO DESTACADO */}
                  <div className="bg-[#1C1438] border-2 border-orange-500/70 p-3 rounded-xl space-y-2">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      💰 Precio del Inmueble
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-300 block mb-1">Prefijo</label>
                        <input
                          type="text"
                          value={flyerData.pricePrefix}
                          onChange={(e) => setFlyerData((p) => ({ ...p, pricePrefix: e.target.value }))}
                          className="w-full bg-[#120D22] border border-orange-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                          placeholder="POR SOLO"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-300 block mb-1">Monto Exacto</label>
                        <input
                          type="text"
                          value={flyerData.priceAmount}
                          onChange={(e) => setFlyerData((p) => ({ ...p, priceAmount: e.target.value }))}
                          className="w-full bg-[#120D22] border border-orange-500/50 rounded-lg px-2.5 py-1.5 text-sm text-orange-400 font-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="U$S 90.000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TÍTULO Y SUBTÍTULO */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Etiqueta de Operación</label>
                      <input
                        type="text"
                        value={flyerData.mainHeadline}
                        onChange={(e) => setFlyerData((p) => ({ ...p, mainHeadline: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-black"
                        placeholder="EN VENTA"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Subtítulo / Tipo</label>
                      <input
                        type="text"
                        value={flyerData.subHeadline || ''}
                        onChange={(e) => setFlyerData((p) => ({ ...p, subHeadline: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="CASA RESIDENCIAL"
                      />
                    </div>
                  </div>

                  {/* UBICACIÓN */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Ubicación / Barrio</label>
                    <input
                      type="text"
                      value={flyerData.locationBadgeSubtitle || ''}
                      onChange={(e) => setFlyerData((p) => ({ ...p, locationBadgeSubtitle: e.target.value }))}
                      className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                      placeholder="Plaza Arriaga, San José de Mayo"
                    />
                  </div>

                  {/* SLOGAN O COPY COMERCIAL */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Slogan Línea 1</label>
                      <input
                        type="text"
                        value={flyerData.sloganTop}
                        onChange={(e) => setFlyerData((p) => ({ ...p, sloganTop: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="EL HOGAR QUE"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Slogan Línea 2</label>
                      <input
                        type="text"
                        value={flyerData.sloganBottom}
                        onChange={(e) => setFlyerData((p) => ({ ...p, sloganBottom: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="TU FAMILIA MERECE"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: COMODIDADES */}
              {activeTab === 'amenities' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                    ✨ Características Destacadas (Íconos)
                  </span>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {flyerData.amenities.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between bg-[#191133] p-2 rounded-xl border border-orange-500/20"
                      >
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...flyerData.amenities];
                            updated[idx].label = e.target.value.toUpperCase();
                            setFlyerData((p) => ({ ...p, amenities: updated }));
                          }}
                          className="bg-transparent border-none text-xs text-white font-bold focus:outline-none flex-1"
                        />
                        <button
                          onClick={() => {
                            const updated = flyerData.amenities.filter((_, i) => i !== idx);
                            setFlyerData((p) => ({ ...p, amenities: updated }));
                          }}
                          className="text-red-400 hover:text-red-300 p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* AGREGAR COMODIDAD */}
                  <div className="flex gap-2 pt-2 border-t border-orange-500/20">
                    <input
                      type="text"
                      value={customAmenityText}
                      onChange={(e) => setCustomAmenityText(e.target.value)}
                      placeholder="Ej: FRENTE ASFALTADO"
                      className="flex-1 bg-[#1A1230] border border-orange-500/30 rounded-xl px-3 py-1.5 text-xs text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!customAmenityText.trim()) return;
                          setFlyerData((p) => ({
                            ...p,
                            amenities: [...p.amenities, { id: `c_${Date.now()}`, label: customAmenityText.trim().toUpperCase(), icon: 'check' }],
                          }));
                          setCustomAmenityText('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!customAmenityText.trim()) return;
                        setFlyerData((p) => ({
                          ...p,
                          amenities: [...p.amenities, { id: `c_${Date.now()}`, label: customAmenityText.trim().toUpperCase(), icon: 'check' }],
                        }));
                        setCustomAmenityText('');
                      }}
                      className="bg-[#E85D04] hover:bg-[#FF7A00] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              )}

              {/* PESTAÑA 4: FOTOS & ENCUADRE */}
              {activeTab === 'photo' && (
                <div className="space-y-4">
                  {/* ENCUADRE FINO DE FOTO PRINCIPAL */}
                  <div className="bg-[#191133] p-3 rounded-xl border border-orange-500/30 space-y-2.5">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      🔍 Encuadre Fino (Foto Principal)
                    </span>
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                        <span>Zoom / Escala</span>
                        <span>{Math.round((flyerData.imageScale || 1) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={flyerData.imageScale || 1}
                        onChange={(e) => setFlyerData((p) => ({ ...p, imageScale: parseFloat(e.target.value) }))}
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                          <span>Posición X</span>
                          <span>{flyerData.imageOffsetX || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="2"
                          value={flyerData.imageOffsetX || 0}
                          onChange={(e) => setFlyerData((p) => ({ ...p, imageOffsetX: parseInt(e.target.value) }))}
                          className="w-full accent-orange-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                          <span>Posición Y</span>
                          <span>{flyerData.imageOffsetY || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="2"
                          value={flyerData.imageOffsetY || 0}
                          onChange={(e) => setFlyerData((p) => ({ ...p, imageOffsetY: parseInt(e.target.value) }))}
                          className="w-full accent-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SELECTOR DE FOTOS DE LA GALERÍA */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      🖼️ Seleccionar Fotos de la Galería ({property.images?.length || 0})
                    </span>
                    <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1 bg-[#120D22] rounded-xl border border-slate-800">
                      {(property.images || []).map((img, i) => {
                        const url = img.webpUrl || img.blobUrl;
                        const isMain = flyerData.imageUrl === url;
                        const isSec1 = flyerData.secondaryImage1Url === url;
                        const isSec2 = flyerData.secondaryImage2Url === url;

                        return (
                          <div
                            key={i}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              isMain
                                ? 'border-[#E85D04] ring-2 ring-orange-500/50'
                                : isSec1 || isSec2
                                ? 'border-purple-500'
                                : 'border-slate-700 hover:border-slate-500 opacity-75 hover:opacity-100'
                            }`}
                            onClick={() => {
                              if (flyerData.layoutMode === 'collage' && isMain) {
                                setFlyerData((p) => ({ ...p, secondaryImage1Url: url }));
                              } else {
                                setFlyerData((p) => ({ ...p, imageUrl: url }));
                              }
                            }}
                          >
                            <img src={url} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#E85D04] text-white text-[8px] font-black text-center py-0.5">
                                Principal
                              </span>
                            )}
                            {isSec1 && (
                              <span className="absolute bottom-0 inset-x-0 bg-purple-600 text-white text-[8px] font-black text-center py-0.5">
                                Foto 2
                              </span>
                            )}
                            {isSec2 && (
                              <span className="absolute bottom-0 inset-x-0 bg-purple-600 text-white text-[8px] font-black text-center py-0.5">
                                Foto 3
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 5: CONVERSIÓN & QR */}
              {activeTab === 'conversion' && (
                <div className="space-y-4">
                  {/* CÓDIGO QR DINÁMICO */}
                  <div className="bg-[#191133] p-3.5 rounded-xl border border-orange-500/30 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <QrCode size={18} className="text-orange-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">Código QR a Ficha Web</span>
                          <span className="text-[10px] text-slate-400">Escaneable desde celulares para ver fotos y mapa</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={flyerData.showQrCode}
                        onChange={(e) => setFlyerData((p) => ({ ...p, showQrCode: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 rounded accent-orange-500 cursor-pointer"
                      />
                    </label>

                    {flyerData.showQrCode && flyerData.qrCodeDataUrl && (
                      <div className="flex items-center gap-3 pt-2 border-t border-orange-500/20">
                        <div className="bg-white p-1.5 rounded-xl">
                          <img src={flyerData.qrCodeDataUrl} alt="QR" className="w-16 h-16 object-contain" />
                        </div>
                        <div className="text-[11px] text-slate-300 leading-tight">
                          <span className="font-bold text-amber-300 block">Enlace Canónico Oficial:</span>
                          <span className="text-[10px] text-slate-400 break-all font-mono">
                            inmobiliariamontano.uy/propiedad/{property.slug}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CONTACTO DE DANIEL MONTAÑO */}
                  <div className="bg-[#191133] p-3 rounded-xl border border-orange-500/30 space-y-2">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      📞 Datos de Asesor & WhatsApp
                    </span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Teléfono Directo</label>
                      <input
                        type="text"
                        value={flyerData.phone}
                        onChange={(e) => setFlyerData((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-[#120D22] border border-orange-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="092 776 715"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: PREVIEW EN VIVO */}
          <div className="lg:col-span-7 bg-[#090610] flex flex-col items-center justify-start p-3 sm:p-5 overflow-auto relative">
            {/* BARRA DE ZOOM Y FORMATO */}
            <div className="w-full flex items-center justify-between mb-2 text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white text-[11px]">
                  Vista Previa en Vivo • {canvasWidth} × {canvasHeight} px ({flyerData.aspectRatio})
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#18112F] border border-orange-500/20 rounded-lg p-1">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.35, z - 0.06))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                  title="Reducir Zoom"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] font-mono px-1">{Math.round(previewZoom * 100)}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(1.0, z + 0.06))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                  title="Aumentar Zoom"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={() => {
                    if (flyerData.aspectRatio === '9:16') setPreviewZoom(0.48);
                    else if (flyerData.aspectRatio === '4:5') setPreviewZoom(0.58);
                    else setPreviewZoom(0.66);
                  }}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 text-[10px] font-bold cursor-pointer"
                  title="Ajustar a Pantalla"
                >
                  Ajustar
                </button>
              </div>
            </div>

            {/* CONTENEDOR DEL LIENZO CENTRADO */}
            <div
              className="relative shadow-2xl rounded-2xl overflow-hidden border border-orange-500/40 transition-all origin-top"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${previewZoom})`,
                marginBottom: `${(canvasHeight * previewZoom) - canvasHeight}px`,
                marginRight: `${(canvasWidth * previewZoom) - canvasWidth}px`,
              }}
            >
              <div ref={previewRef} style={{ width: canvasWidth, height: canvasHeight }}>
                <FlyerCanvasResponsive data={flyerData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
