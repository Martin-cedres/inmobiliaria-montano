'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Property } from '@/types/property';
import { FlyerData, FlyerTemplateId, FlyerAmenityItem } from './flyer-templates/flyerTypes';
import { FlyerTemplateClassic } from './flyer-templates/FlyerTemplateClassic';
import { FlyerTemplateChacra } from './flyer-templates/FlyerTemplateChacra';
import { FlyerTemplateModular } from './flyer-templates/FlyerTemplateModular';
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
  Globe,
  Maximize2,
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
  const [activeTab, setActiveTab] = useState<'template' | 'texts' | 'amenities' | 'photo'>('texts');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [customAmenityText, setCustomAmenityText] = useState('');
  const [previewZoom, setPreviewZoom] = useState<number>(0.68);

  // Extract initial flyer data from Property
  const buildInitialData = (): FlyerData => {
    let initialTemplate: FlyerTemplateId = 'classic';
    if (property.category === 'chacra' || property.category === 'terreno') {
      initialTemplate = 'chacra';
    } else if (property.category === 'modulo' || property.category === 'proyecto') {
      initialTemplate = 'modular';
    }

    let headline = 'EN VENTA';
    if (property.operation === 'alquiler') headline = 'EN ALQUILER';
    else if (property.category === 'chacra') headline = 'CHACRA EN VENTA';
    else if (property.category === 'terreno') headline = 'TERRENO EN VENTA';
    else if (property.category === 'modulo' || property.category === 'proyecto') headline = 'TU CASA LISTA PARA VIVIR';

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

    // Main image
    const mainImg = property.images?.find((img) => img.isMain) || property.images?.[0];
    const initialImgUrl = mainImg?.webpUrl || mainImg?.blobUrl || '/logo.png';

    // Amenities
    const autoAmenities: FlyerAmenityItem[] = [];
    const f = property.features || {};

    if (f.bedrooms) autoAmenities.push({ id: 'bed', label: `${f.bedrooms} ${f.bedrooms === 1 ? 'HABITACIÓN' : 'HABITACIONES'}`, icon: 'bed' });
    if (f.bathrooms) autoAmenities.push({ id: 'bath', label: `${f.bathrooms} BAÑO${f.bathrooms > 1 ? 'S' : ''}`, icon: 'bath' });
    if (f.builtAreaM2) autoAmenities.push({ id: 'm2_edif', label: `${f.builtAreaM2} M² EDIFICADOS`, icon: 'm2' });
    if (f.plotAreaM2) autoAmenities.push({ id: 'm2_terr', label: `${f.plotAreaM2} M² DE TERRENO`, icon: 'm2' });
    if (f.garage || f.cochera || f.carAccess) autoAmenities.push({ id: 'garage', label: 'GARAJE', icon: 'garage' });
    if (f.barbacoa || f.barbecue || f.parrillero) autoAmenities.push({ id: 'bbq', label: 'PARRILLERO / BARBACOA', icon: 'bbq' });
    if (f.fondo || f.garden || f.patio) autoAmenities.push({ id: 'tree', label: 'FONDO', icon: 'tree' });
    if (f.pool) autoAmenities.push({ id: 'pool', label: 'PISCINA', icon: 'pool' });
    if (f.woodStoveOrAC) autoAmenities.push({ id: 'fire', label: 'COCINA CON CALEFACTOR', icon: 'kitchen' });
    if (f.oseWater) autoAmenities.push({ id: 'water', label: 'AGUA DE OSE', icon: 'water' });
    if (f.titlesUpToDate) autoAmenities.push({ id: 'shield', label: 'TÍTULOS AL DÍA', icon: 'shield' });

    // Fallbacks if property had few features filled
    if (autoAmenities.length === 0) {
      autoAmenities.push(
        { id: '1', label: '3 HABITACIONES', icon: 'bed' },
        { id: '2', label: '1 BAÑO', icon: 'bath' },
        { id: '3', label: 'COCINA COMEDOR', icon: 'kitchen' },
        { id: '4', label: 'GARAJE', icon: 'garage' }
      );
    }

    const defaultBullets = [
      'Ubicación privilegiada',
      'Ambientes amplios y luminosos',
      'Ideal para tu familia',
    ];

    const defaultChacraBadges = [
      {
        title: 'ZONA SUB URBANA',
        desc: 'Entorno natural, ideal para disfrutar de la paz.',
        icon: 'pin' as const,
      },
      {
        title: 'AGUA DE OSE',
        desc: 'Servicio de agua potable disponible.',
        icon: 'water' as const,
      },
      {
        title: 'EXCELENTE UBICACIÓN',
        desc: `${property.location?.neighborhood || 'San José de Mayo'}`,
        icon: 'pin' as const,
      },
    ];

    const defaultSubHeadline = property.category === 'modulo'
      ? 'MÓDULO HABITACIONAL'
      : property.category === 'chacra'
      ? 'CHACRA Y NATURALEZA'
      : property.category === 'terreno'
      ? 'TERRENO ESPECTACULAR'
      : property.category === 'apartamento'
      ? 'APARTAMENTO CÉNTRICO'
      : 'CASA EN ESQUINA';

    return {
      templateId: initialTemplate,
      mainHeadline: headline,
      subHeadline: defaultSubHeadline,
      locationBadgeTitle: (property.location?.neighborhood || property.location?.city || 'SAN JOSÉ').toUpperCase(),
      locationBadgeSubtitle: property.location?.city !== property.location?.neighborhood ? property.location?.city : undefined,
      pricePrefix: 'POR SOLO',
      priceAmount: priceText,
      sloganTop: PRESET_SLOGANS[0].top,
      sloganBottom: PRESET_SLOGANS[0].bottom,
      phone: '092 776 715',
      email: 'inmobiliariadaniel247@gmail.com',
      website: 'www.inmobiliariamontano.uy',
      locationCity: property.location?.city || 'San José',
      imageUrl: initialImgUrl,
      imageScale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      amenities: autoAmenities,
      bulletPoints: defaultBullets,
      chacraBadges: defaultChacraBadges,
      showWebsiteInFooter: true,
      coBrandingTitle: property.category === 'modulo' ? 'INGENIERÍA MODULAR' : undefined,
    };
  };

  const [flyerData, setFlyerData] = useState<FlyerData>(buildInitialData());

  useEffect(() => {
    if (isOpen) {
      setFlyerData(buildInitialData());
      setExportSuccess(false);
      setCopiedSuccess(false);
    }
  }, [isOpen, property]);

  if (!isOpen) return null;

  // Export to High-Resolution JPG
  const handleDownloadJpg = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const canvasNode = previewRef.current.firstElementChild as HTMLElement;
      if (!canvasNode) throw new Error('No canvas element found');

      const dataUrl = await htmlToImage.toJpeg(canvasNode, {
        quality: 0.96,
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
      });

      const link = document.createElement('a');
      const filename = `ficha-${property.codeRef || 'inmobiliaria-montano'}-${Date.now()}.jpg`;
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

  // Copy to Clipboard
  const handleCopyToClipboard = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const canvasNode = previewRef.current.firstElementChild as HTMLElement;
      if (!canvasNode) throw new Error('No canvas element found');

      const blob = await htmlToImage.toBlob(canvasNode, {
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
      } else {
        alert('Tu navegador no soporta el copiado directo de imágenes. Usa "Descargar JPG".');
      }
    } catch (error) {
      console.error('Error copiando imagen al portapapeles:', error);
      alert('No se pudo copiar directamente la imagen. Por favor descárgala en JPG.');
    } finally {
      setIsExporting(false);
    }
  };

  // Amenities handlers
  const handleToggleAmenity = (id: string) => {
    setFlyerData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a.id !== id),
    }));
  };

  const handleAddCustomAmenity = () => {
    if (!customAmenityText.trim()) return;
    const newItem: FlyerAmenityItem = {
      id: `custom_${Date.now()}`,
      label: customAmenityText.trim().toUpperCase(),
      icon: 'check',
    };
    setFlyerData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, newItem],
    }));
    setCustomAmenityText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#120D22] border border-orange-500/30 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col h-[94vh] overflow-hidden text-white">
        {/* HEADER BAR */}
        <div className="px-5 py-3 border-b border-orange-500/20 flex items-center justify-between bg-[#16102A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#E85D04] to-[#FF9E00] p-2 rounded-xl text-white shadow-md shadow-orange-500/20">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Estudio de Fichas Gráficas JPG
                </h2>
                <span className="text-[11px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                  Ref. #{property.codeRef}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Genera imágenes en alta definición listas para WhatsApp, Instagram y Marketplace
              </p>
            </div>
          </div>

          {/* ACTIONS & CLOSE */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="hidden sm:flex items-center gap-1.5 bg-[#1F1739] hover:bg-[#2A1F4D] text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-orange-500/20 cursor-pointer"
              title="Copiar imagen para pegar en WhatsApp Web"
            >
              {copiedSuccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedSuccess ? '¡Copiada!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#E85D04] to-[#FF6B00] hover:from-[#FF6B00] hover:to-[#FFA000] text-white px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : exportSuccess ? (
                <Check size={14} />
              ) : (
                <Download size={14} />
              )}
              <span>{isExporting ? 'Procesando...' : exportSuccess ? '¡Descargado!' : 'Descargar JPG (Alta Calidad)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (CONTROLS LEFT, PREVIEW RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT: CONTROLS & CUSTOMIZATION */}
          <div className="lg:col-span-5 border-r border-orange-500/20 flex flex-col bg-[#140E26] overflow-y-auto">
            {/* TABS SELECTOR */}
            <div className="flex border-b border-orange-500/20 bg-[#160F2B] p-1.5 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('texts')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'texts'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Type size={13} />
                <span>Textos & Precio</span>
              </button>

              <button
                onClick={() => setActiveTab('amenities')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
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
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'photo'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <ImageIcon size={13} />
                <span>Foto</span>
              </button>

              <button
                onClick={() => setActiveTab('template')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'template'
                    ? 'bg-[#E85D04] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Layout size={13} />
                <span>Estilo</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 space-y-4">
              {/* TAB 1: TEXTS & PRICING */}
              {activeTab === 'texts' && (
                <div className="space-y-3">
                  {/* PRECIO DESTACADO (MUY IMPORTANTE) */}
                  <div className="bg-[#1C1438] border-2 border-orange-500/70 p-3 rounded-xl space-y-2">
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block">
                      💰 Precio de la Ficha
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
                          placeholder="U$S 117.000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MAIN HEADLINE */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Título</label>
                      <input
                        type="text"
                        value={flyerData.mainHeadline}
                        onChange={(e) => setFlyerData((p) => ({ ...p, mainHeadline: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-black"
                        placeholder="EN VENTA"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Insignia Negra (Subtítulo)</label>
                      <input
                        type="text"
                        value={flyerData.subHeadline || ''}
                        onChange={(e) => setFlyerData((p) => ({ ...p, subHeadline: e.target.value }))}
                        className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="CASA EN ESQUINA"
                      />
                    </div>
                  </div>

                  {/* LOCATION BADGE */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Ubicación Destacada</label>
                    <input
                      type="text"
                      value={flyerData.locationBadgeTitle}
                      onChange={(e) => setFlyerData((p) => ({ ...p, locationBadgeTitle: e.target.value }))}
                      className="w-full bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                      placeholder="SAN JOSÉ / A 1 CUADRA DE LA PLAZA"
                    />
                  </div>

                  {/* PRESET SLOGANS */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Eslóganes Rápidos</label>
                    <div className="grid grid-cols-1 gap-1 max-h-28 overflow-y-auto">
                      {PRESET_SLOGANS.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFlyerData((p) => ({ ...p, sloganTop: s.top, sloganBottom: s.bottom }))}
                          className={`p-1.5 rounded-lg text-left text-xs transition-all border ${
                            flyerData.sloganTop === s.top && flyerData.sloganBottom === s.bottom
                              ? 'bg-orange-600/30 border-orange-500 text-white font-bold'
                              : 'bg-[#18112F] border-slate-800 text-slate-300 hover:bg-[#20163E]'
                          }`}
                        >
                          <span className="text-white font-bold">{s.top}</span>{' '}
                          <span className="text-orange-400 font-black">{s.bottom}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CHECKPOINTS / BULLETS */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Puntos Fuertes (3 Tildes)</label>
                    <div className="space-y-1">
                      {flyerData.bulletPoints?.map((bp, i) => (
                        <input
                          key={i}
                          type="text"
                          value={bp}
                          onChange={(e) => {
                            const newBullets = [...(flyerData.bulletPoints || [])];
                            newBullets[i] = e.target.value;
                            setFlyerData((p) => ({ ...p, bulletPoints: newBullets }));
                          }}
                          className="w-full bg-[#1A1230] border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AMENITIES & ICONS */}
              {activeTab === 'amenities' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Comodidades en la Ficha ({flyerData.amenities.length}):
                      </label>
                      <span className="text-[10px] text-orange-400 font-medium">Recomendado: 4 a 5</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto p-1.5 bg-[#18112F] rounded-xl border border-slate-800">
                      {flyerData.amenities.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-[#21173F] border border-orange-500/30 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between"
                        >
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...flyerData.amenities];
                              updated[index] = { ...item, label: e.target.value.toUpperCase() };
                              setFlyerData((p) => ({ ...p, amenities: updated }));
                            }}
                            className="bg-transparent border-none text-xs font-bold text-white focus:outline-none w-full mr-2 uppercase"
                          />
                          <button
                            onClick={() => handleToggleAmenity(item.id)}
                            className="text-slate-400 hover:text-red-400 p-0.5"
                            title="Quitar"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADD CUSTOM AMENITY */}
                  <div className="pt-2 border-t border-orange-500/20">
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Agregar Comodidad:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customAmenityText}
                        onChange={(e) => setCustomAmenityText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAmenity()}
                        className="flex-1 bg-[#1A1230] border border-orange-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none"
                        placeholder="Ej. COCINA CON CALEFACTOR"
                      />
                      <button
                        onClick={handleAddCustomAmenity}
                        className="bg-[#E85D04] hover:bg-[#FF6B00] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PHOTO ADJUSTMENTS */}
              {activeTab === 'photo' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Selecciona la Foto:
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 bg-[#18112F] rounded-xl border border-slate-800">
                      {property.images && property.images.length > 0 ? (
                        property.images.map((img, idx) => {
                          const url = img.webpUrl || img.blobUrl;
                          const isSelected = flyerData.imageUrl === url;
                          return (
                            <button
                              key={img.id || idx}
                              onClick={() => setFlyerData((p) => ({ ...p, imageUrl: url }))}
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected ? 'border-[#FF6B00] ring-2 ring-orange-500/50 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 col-span-3 p-2">Sin fotos adicionales.</p>
                      )}
                    </div>
                  </div>

                  {/* PHOTO ZOOM & POSITION CONTROLS */}
                  <div className="bg-[#18112F] border border-orange-500/20 p-3 rounded-xl space-y-2">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">
                      Ajuste de Encuadre
                    </span>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                        <span>Zoom</span>
                        <span>{Math.round(flyerData.imageScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={flyerData.imageScale}
                        onChange={(e) => setFlyerData((p) => ({ ...p, imageScale: parseFloat(e.target.value) }))}
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                        <span>Posición Vertical</span>
                        <span>{flyerData.imageOffsetY} px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={flyerData.imageOffsetY}
                        onChange={(e) => setFlyerData((p) => ({ ...p, imageOffsetY: parseInt(e.target.value) }))}
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                        <span>Posición Horizontal</span>
                        <span>{flyerData.imageOffsetX} px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={flyerData.imageOffsetX}
                        onChange={(e) => setFlyerData((p) => ({ ...p, imageOffsetX: parseInt(e.target.value) }))}
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <button
                      onClick={() => setFlyerData((p) => ({ ...p, imageScale: 1, imageOffsetX: 0, imageOffsetY: 0 }))}
                      className="text-xs text-orange-400 hover:text-orange-300 font-bold underline block"
                    >
                      Restablecer Encuadre
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: TEMPLATES */}
              {activeTab === 'template' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setFlyerData((p) => ({ ...p, templateId: 'classic' }))}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        flyerData.templateId === 'classic'
                          ? 'bg-[#E85D04]/15 border-[#FF6B00] shadow-md'
                          : 'bg-[#18112F] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black text-white block">Urbana / Diagonal Neón (Muestra 2, 3, 4)</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fondo claro a la izquierda, corte diagonal neón y pie de contacto.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setFlyerData((p) => ({ ...p, templateId: 'chacra' }))}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        flyerData.templateId === 'chacra'
                          ? 'bg-[#E85D04]/15 border-[#FF6B00] shadow-md'
                          : 'bg-[#18112F] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black text-white block">Chacra, Campo & Terreno</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Destaca metros de superficie, agua de OSE y entorno.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setFlyerData((p) => ({ ...p, templateId: 'modular' }))}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        flyerData.templateId === 'modular'
                          ? 'bg-[#E85D04]/15 border-[#FF6B00] shadow-md'
                          : 'bg-[#18112F] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black text-white block">Vivienda Modular / Proyecto</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Formato "Tu Casa Lista Para Vivir".
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-orange-500/20">
                    <label className="flex items-center justify-between p-2.5 bg-[#191133] rounded-xl border border-orange-500/30 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-orange-400" />
                        <span className="text-xs font-bold text-white">www.inmobiliariamontano.uy</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={flyerData.showWebsiteInFooter}
                        onChange={(e) => setFlyerData((p) => ({ ...p, showWebsiteInFooter: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW CANVAS (FULL FIT 100% VISIBLE) */}
          <div className="lg:col-span-7 bg-[#090610] flex flex-col items-center justify-start p-3 sm:p-5 overflow-auto relative">
            {/* ZOOM CONTROLS BAR */}
            <div className="w-full flex items-center justify-between mb-2 text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white text-[11px]">Vista Previa Completa</span>
              </div>
              <div className="flex items-center gap-1 bg-[#18112F] border border-orange-500/20 rounded-lg p-1">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.4, z - 0.08))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300"
                  title="Reducir Zoom"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] font-mono px-1">{Math.round(previewZoom * 100)}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(1.1, z + 0.08))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300"
                  title="Aumentar Zoom"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={() => setPreviewZoom(0.68)}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 text-[10px] font-bold"
                  title="Ajustar a Pantalla"
                >
                  Ajustar
                </button>
              </div>
            </div>

            {/* FULL FLYER WRAPPER */}
            <div
              className="relative shadow-2xl rounded-2xl overflow-hidden border border-orange-500/40 transition-transform origin-top"
              style={{
                width: 600,
                height: 900,
                transform: `scale(${previewZoom})`,
                marginBottom: `${(900 * previewZoom) - 900}px`,
                marginRight: `${(600 * previewZoom) - 600}px`,
              }}
            >
              <div ref={previewRef} className="w-[600px] h-[900px]">
                {flyerData.templateId === 'classic' && <FlyerTemplateClassic data={flyerData} />}
                {flyerData.templateId === 'chacra' && <FlyerTemplateChacra data={flyerData} />}
                {flyerData.templateId === 'modular' && <FlyerTemplateModular data={flyerData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
