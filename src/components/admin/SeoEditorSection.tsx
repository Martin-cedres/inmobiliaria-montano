'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Wand2, Search, MessageSquare, ExternalLink } from 'lucide-react';
import { PropertyCategory, OperationType, GuaranteeType, ImageAsset } from '@/types/property';
import { generateSmartSeoTitle, generateSmartSeoDescription, generatePropertySlug } from '@/utils/seo';

interface SeoEditorSectionProps {
  title: string;
  category: PropertyCategory;
  operation: OperationType;
  priceAmount: number;
  priceCurrency: 'USD' | 'UYU';
  neighborhood: string;
  city?: string;
  bedrooms?: number;
  builtAreaM2?: number;
  plotAreaM2?: number;
  codeRef: string;
  features?: any;
  guarantees?: GuaranteeType[];
  images?: ImageAsset[];
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  propertyId?: string;
  lastGoogleNotifiedAt?: string;
  googleIndexingStatus?: 'notified' | 'pending' | 'error';
}

export function SeoEditorSection({
  title,
  category,
  operation,
  priceAmount,
  priceCurrency,
  neighborhood,
  city = 'San José de Mayo',
  bedrooms,
  builtAreaM2,
  plotAreaM2,
  codeRef,
  features = {},
  guarantees = [],
  images = [],
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  propertyId,
  lastGoogleNotifiedAt,
  googleIndexingStatus = 'pending',
}: SeoEditorSectionProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiVariants, setAiVariants] = useState<any[]>([]);
  const [isNotifyingGoogle, setIsNotifyingGoogle] = useState(false);
  const [localNotifiedAt, setLocalNotifiedAt] = useState<string | undefined>(lastGoogleNotifiedAt);
  const [indexingState, setIndexingState] = useState<'notified' | 'pending' | 'error'>(googleIndexingStatus);

  // Reglas de semáforo
  const titleLen = seoTitle.length;
  const isTitleIdeal = titleLen >= 45 && titleLen <= 60;
  const isTitleWarning = titleLen > 60 || (titleLen > 0 && titleLen < 45);

  const descLen = seoDescription.length;
  const isDescIdeal = descLen >= 130 && descLen <= 155;
  const isDescWarning = descLen > 155 || (descLen > 0 && descLen < 130);

  // Generador de fallback local
  const handleAutoGenerate = () => {
    const propertyDraft = {
      title,
      category,
      operation,
      price: { amount: priceAmount, currency: priceCurrency },
      location: { department: 'San José', city, neighborhood },
      features: { bedrooms, builtAreaM2, plotAreaM2, ...features },
      guarantees,
    };

    const suggestedTitle = generateSmartSeoTitle(propertyDraft as any);
    const suggestedDesc = generateSmartSeoDescription(propertyDraft as any);

    setSeoTitle(suggestedTitle);
    setSeoDescription(suggestedDesc);
  };

  // Asistente IA (3 Variantes)
  const handleFetchAiVariants = async () => {
    setIsGeneratingAi(true);
    setShowAiModal(true);
    try {
      const res = await fetch('/api/admin/seo-ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          operation,
          priceAmount,
          priceCurrency,
          neighborhood,
          city,
          bedrooms,
          builtAreaM2,
          plotAreaM2,
          features,
          guarantees,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.variants)) {
        setAiVariants(data.variants);
      }
    } catch (err) {
      console.error('Error obteniendo variantes SEO:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Checklist Rápido de Validación SEO
  const hasLocalKeyword = /san jose|centro|mallada|arriaga|picada|parquizacion|libertad|rodriguez/i.test(`${seoTitle} ${seoDescription}`);
  const hasCta = /coordina|consulta|contacta|conoce|llama|agenda|visita/i.test(`${seoTitle} ${seoDescription}`);
  const hasOptimalLength = isTitleIdeal && isDescIdeal;
  const hasValidImage = images.length > 0;

  const generatedSlug = generatePropertySlug(title || 'propiedad', codeRef, category, operation, neighborhood);
  const mainImg = images.find((i) => i.isMain)?.webpUrl || images[0]?.webpUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  const priceFormatted = `${priceCurrency === 'USD' ? 'USD' : 'UYU $'} ${priceAmount.toLocaleString()}`;

  const handleForceGoogleIndexing = async () => {
    setIsNotifyingGoogle(true);
    try {
      const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://inmobiliariamontano.uy';
      const targetUrl = `${siteOrigin}/propiedad/${generatedSlug}`;

      const res = await fetch('/api/admin/google-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          url: targetUrl,
          type: 'URL_UPDATED',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIndexingState('notified');
        setLocalNotifiedAt(data.timestamp || new Date().toISOString());
      } else {
        setIndexingState('error');
      }
    } catch (err) {
      console.error('Error forzando indexación:', err);
      setIndexingState('error');
    } finally {
      setIsNotifyingGoogle(false);
    }
  };

  const formattedNotifiedDate = localNotifiedAt
    ? new Date(localNotifiedAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  const searchConsoleInspectUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent('https://inmobiliariamontano.uy')}&url=${encodeURIComponent(`https://inmobiliariamontano.uy/propiedad/${generatedSlug}`)}`;

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      
      {/* Encabezado de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#E85D04]" />
            <span>4. Optimización SEO, Copywriting & Vista Previa Social</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Control de títulos y snippets persuasivos para posicionar #1 en Google San José y compartir por WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAutoGenerate}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all"
            title="Auto-generar sugerencia básica"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Plantilla Base</span>
          </button>
          
          <button
            type="button"
            onClick={handleFetchAiVariants}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#5E1754] to-purple-800 hover:from-purple-900 hover:to-indigo-900 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm hover:shadow transition-all"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>🪄 Asistente SEO (3 Copys)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Inputs con Semáforo (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Campo 1: Título SEO (Meta Title) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase flex items-center space-x-1.5">
                <span>Título SEO (Meta Title)</span>
              </label>
              
              {/* Semáforo de Caracteres Título */}
              <div className="flex items-center space-x-1.5 text-[11px] font-extrabold">
                <span className={`px-2 py-0.5 rounded-full border ${
                  isTitleIdeal
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isTitleWarning
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {titleLen} / 60 car.
                </span>
              </div>
            </div>

            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="ej. Casa de 2 Dormitorios en Parquización Mallada | Apta Banco | Inmobiliaria Montaño"
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#5E1754] text-slate-900"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Aparece como enlace azul principal en Google. Ideal entre 45 y 60 caracteres.
            </p>
          </div>

          {/* Campo 2: Meta Descripción (Copywriting) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase flex items-center space-x-1.5">
                <span>Meta Descripción (Copywriting Comercial)</span>
              </label>

              {/* Semáforo de Caracteres Descripción */}
              <div className="flex items-center space-x-1.5 text-[11px] font-extrabold">
                <span className={`px-2 py-0.5 rounded-full border ${
                  isDescIdeal
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isDescWarning
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {descLen} / 155 car.
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="ej. Oportunidad en Parquización de Arroyo Mallada: Casa de 2 dorms con garage por USD 88.000. Apta banco. Coordiná tu visita con Daniel Montaño."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#5E1754] text-slate-900 resize-none"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Texto persuasivo en los resultados de búsqueda. Ideal entre 130 y 155 caracteres con CTA.
            </p>
          </div>

          {/* Checklist Rápido de Validación SEO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center justify-between">
              <span>📋 Checklist de Validación SEO Local</span>
              <span className="text-[10px] bg-slate-100 font-extrabold text-slate-600 px-2 py-0.5 rounded-full">
                San José de Mayo
              </span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className={`flex items-center space-x-1.5 p-2 rounded-xl border ${
                hasLocalKeyword ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {hasLocalKeyword ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <span>Palabra Local ("San José")</span>
              </div>

              <div className={`flex items-center space-x-1.5 p-2 rounded-xl border ${
                hasCta ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {hasCta ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <span>Llamado a la Acción (CTA)</span>
              </div>

              <div className={`flex items-center space-x-1.5 p-2 rounded-xl border ${
                hasOptimalLength ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {hasOptimalLength ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <span>Longitud Óptima (Verde)</span>
              </div>

              <div className={`flex items-center space-x-1.5 p-2 rounded-xl border ${
                hasValidImage ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {hasValidImage ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <span>Portada para WhatsApp</span>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Previsualizadores de Google & WhatsApp (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 🔍 Simulador Google Search Snippet */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-slate-700 border-b border-slate-100 pb-2">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulador Google Search</span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 truncate">
                <span className="w-4 h-4 rounded-full bg-[#5E1754] text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                  M
                </span>
                <span className="truncate">inmobiliariamontano.uy › propiedad › {generatedSlug}</span>
              </div>

              <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                {seoTitle || title || 'Casa en Venta en San José de Mayo | Inmobiliaria Montaño'}
              </h4>

              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {seoDescription || 'Oportunidad en San José de Mayo. Inmobiliaria Montaño con atención directa de Daniel Montaño. Coordiná tu visita hoy mismo.'}
              </p>
            </div>
          </div>

          {/* 💬 Simulador WhatsApp Share Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-emerald-950 border-b border-emerald-200/60 pb-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vista Previa en WhatsApp</span>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-2xs">
              <div className="h-32 bg-slate-100 relative">
                <img
                  src={mainImg}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                  {priceFormatted}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1">
                <h5 className="text-xs font-black text-slate-900 line-clamp-1">
                  {seoTitle || title || 'Propiedad en Inmobiliaria Montaño'}
                </h5>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {seoDescription || 'Excelente oportunidad en San José. Consultá directamente con Daniel Montaño.'}
                </p>
                <div className="text-[10px] font-bold text-slate-400 pt-1 flex items-center space-x-1">
                  <span>inmobiliariamontano.uy</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 🟢 Panel de Indexación Instantánea en Google & Recordatorio Vercel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs space-y-4 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <span>🚀 Notificación & Indexación Instantánea (Google & IndexNow)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Notificá a Google y Bing inmediatamente para que rastreen y posicionen esta publicación en minutos.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleForceGoogleIndexing}
              disabled={isNotifyingGoogle}
              className="flex-1 sm:flex-initial bg-[#5E1754] hover:bg-purple-900 active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isNotifyingGoogle ? 'animate-spin' : ''}`} />
              <span>{isNotifyingGoogle ? 'Notificando...' : 'Forzar Indexación en Google'}</span>
            </button>

            <a
              href={searchConsoleInspectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
              title="Abrir en Google Search Console para auditar"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Search Console ↗</span>
            </a>
          </div>
        </div>

        {/* Estado Visual de la Notificación */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-bold">Estado de Indexación:</span>
            {indexingState === 'notified' ? (
              <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>🟢 Notificado a Google & IndexNow</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>🟡 Pendiente de envío</span>
              </span>
            )}
          </div>

          {formattedNotifiedDate && (
            <span className="text-[11px] text-slate-400 font-semibold">
              Última notificación: {formattedNotifiedDate}
            </span>
          )}
        </div>
      </div>

      {/* Modal del Asistente SEO (3 Variantes) */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-purple-100 shadow-2xl animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754]">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">🪄 Asistente de Copywriting SEO</h3>
                  <p className="text-xs text-slate-500">Seleccioná una de las 3 opciones optimizadas según tu objetivo comercial.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {isGeneratingAi ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-[#5E1754] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-slate-600">Analizando atributos de la propiedad y generando copys comerciales...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {aiVariants.map((v) => (
                  <div key={v.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#5E1754]">{v.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSeoTitle(v.title);
                          setSeoDescription(v.description);
                          setShowAiModal(false);
                        }}
                        className="px-3 py-1 bg-[#5E1754] hover:bg-purple-900 text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs"
                      >
                        [ Aplicar variante ]
                      </button>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/60 text-xs">
                      <p className="font-extrabold text-slate-900">📌 Título: <span className="font-semibold text-slate-700">{v.title}</span></p>
                      <p className="font-extrabold text-slate-900">📝 Descripción: <span className="font-medium text-slate-600">{v.description}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
