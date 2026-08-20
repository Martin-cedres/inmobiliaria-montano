'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUploader } from '@/components/ImageUploader';
import { SeoEditorSection } from '@/components/admin/SeoEditorSection';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { generatePropertySlug } from '@/utils/seo';
import { ArrowLeft, Save, Sparkles, Upload, CheckCircle2, ShieldCheck, Camera, Loader2, Edit3 } from 'lucide-react';
import { PropertyCategory, OperationType, PropertyStatus, GuaranteeType, ImageAsset } from '@/types/property';
import { AdminLocationPickerWrapper } from '@/components/AdminLocationPickerWrapper';

export default function EditarPropiedadPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form State
  const [codeRef, setCodeRef] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [operation, setOperation] = useState<OperationType>('venta');
  const [category, setCategory] = useState<PropertyCategory>('casa');
  const [status, setStatus] = useState<PropertyStatus>('disponible');
  const [priceAmount, setPriceAmount] = useState<number>(0);
  const [priceCurrency, setPriceCurrency] = useState<'USD' | 'UYU'>('USD');
  const [priceMode, setPriceMode] = useState<'visible' | 'consultar' | 'reservado' | 'desde'>('visible');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [address, setAddress] = useState('');
  
  // Location Map Pin & Privacy State
  const [hasLocation, setHasLocation] = useState<boolean>(true);
  const [lat, setLat] = useState<number>(-34.3375);
  const [lng, setLng] = useState<number>(-56.7136);
  const [isExactLocation, setIsExactLocation] = useState<boolean>(false);
  const [radiusMeters, setRadiusMeters] = useState<number>(300);

  // Features
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [floors, setFloors] = useState<number>(1);
  const [builtAreaM2, setBuiltAreaM2] = useState<number>(0);
  const [plotAreaM2, setPlotAreaM2] = useState<number>(0);
  const [frontMeters, setFrontMeters] = useState<number | undefined>(undefined);

  // Comodidades & Accesibilidad
  const [carAccess, setCarAccess] = useState<boolean>(false);
  const [garage, setGarage] = useState<boolean>(false);
  const [barbecue, setBarbecue] = useState<boolean>(false);
  const [pool, setPool] = useState<boolean>(false);
  const [garden, setGarden] = useState<boolean>(false);
  const [woodStoveOrAC, setWoodStoveOrAC] = useState<boolean>(false);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);

  // Badges Destacados (Etiquetas Principales)
  const [fondo, setFondo] = useState<boolean>(false);
  const [patio, setPatio] = useState<boolean>(false);
  const [barbacoa, setBarbacoa] = useState<boolean>(false);
  const [parrillero, setParrillero] = useState<boolean>(false);
  const [cochera, setCochera] = useState<boolean>(false);
  const [cocheraTechada, setCocheraTechada] = useState<boolean>(false);

  // Servicios Básicos
  const [oseWater, setOseWater] = useState<boolean>(true);
  const [uteElectric, setUteElectric] = useState<boolean>(true);
  const [sanitation, setSanitation] = useState<boolean>(true);
  const [fiberOptic, setFiberOptic] = useState<boolean>(true);
  const [waterWellOrPond, setWaterWellOrPond] = useState<boolean>(false);

  // Certeza Legal, Regímenes & Seguridad
  const [titlesUpToDate, setTitlesUpToDate] = useState<boolean>(true);
  const [bankCreditEligible, setBankCreditEligible] = useState<boolean>(false);
  const [acceptsTradeIn, setAcceptsTradeIn] = useState<boolean>(false);
  const [phRegime, setPhRegime] = useState<boolean>(false);
  const [perimeterFence, setPerimeterFence] = useState<boolean>(false);
  const [securitySystem, setSecuritySystem] = useState<boolean>(false);

  // Atributos Rurales & Comerciales
  const [coneatIndex, setConeatIndex] = useState<number | undefined>(undefined);
  const [pavedStreet, setPavedStreet] = useState<boolean>(false);
  const [shedOrCorral, setShedOrCorral] = useState<boolean>(false);

  // Perfil Industrial, Logístico & Fraccionamiento
  const [isHectares, setIsHectares] = useState<boolean>(false);
  const [fractionable, setFractionable] = useState<boolean>(false);
  const [minFractionM2, setMinFractionM2] = useState<number | undefined>(undefined);
  const [fractionNotes, setFractionNotes] = useState<string>('');
  const [routeFrontage, setRouteFrontage] = useState<string>('');
  const [pricePerM2, setPricePerM2] = useState<number | undefined>(undefined);
  const [soilTopography, setSoilTopography] = useState<string>('');
  const [gatedPerimeter, setGatedPerimeter] = useState<boolean>(false);

  const [selectedGuarantees, setSelectedGuarantees] = useState<GuaranteeType[]>([]);

  const [lastGoogleNotifiedAt, setLastGoogleNotifiedAt] = useState<string | undefined>(undefined);
  const [googleIndexingStatus, setGoogleIndexingStatus] = useState<'notified' | 'pending' | 'error'>('pending');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar datos de la propiedad para editar
  useEffect(() => {
    if (!propertyId) return;

    async function fetchProperty() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/properties/${propertyId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const p = data.data;
          setCodeRef(p.codeRef || '');
          setTitle(p.title || '');
          setDescription(p.description || '');
          setOperation(p.operation || 'venta');
          setCategory(p.category || 'casa');
          setStatus(p.status || 'disponible');
          setPriceAmount(p.price?.amount || 0);
          setPriceCurrency(p.price?.currency || 'USD');
          setPriceMode(p.price?.priceMode || 'visible');
          setNeighborhood(p.location?.neighborhood || 'Centro');
          setAddress(p.location?.address || '');
          
          setHasLocation(p.location?.hasLocation !== false);
          setLat(p.location?.coordinates?.lat ?? p.location?.lat ?? -34.3375);
          setLng(p.location?.coordinates?.lng ?? p.location?.lng ?? -56.7136);
          setIsExactLocation(p.location?.isExactLocation ?? false);
          setRadiusMeters(p.location?.radiusMeters ?? 300);

          setBedrooms(p.features?.bedrooms || 0);
          setBathrooms(p.features?.bathrooms || 0);
          setFloors(p.features?.floors || 1);
          setBuiltAreaM2(p.features?.builtAreaM2 || 0);
          setPlotAreaM2(p.features?.plotAreaM2 || 0);
          setFrontMeters(p.features?.frontMeters);
          
          setCarAccess(!!p.features?.carAccess);
          setGarage(!!p.features?.garage);
          setBarbecue(!!p.features?.barbecue);
          setPool(!!p.features?.pool);
          setGarden(!!p.features?.garden);
          setWoodStoveOrAC(!!p.features?.woodStoveOrAC);
          setPetFriendly(!!p.features?.petFriendly);

          setFondo(!!(p.features?.fondo ?? p.features?.garden));
          setPatio(!!p.features?.patio);
          setBarbacoa(!!p.features?.barbacoa);
          setParrillero(!!(p.features?.parrillero ?? p.features?.barbecue));
          setCochera(!!(p.features?.cochera ?? p.features?.carAccess));
          setCocheraTechada(!!(p.features?.cocheraTechada ?? p.features?.garage));

          setOseWater(p.features?.oseWater ?? true);
          setUteElectric(p.features?.uteElectric ?? true);
          setSanitation(p.features?.sanitation ?? true);
          setFiberOptic(p.features?.fiberOptic ?? true);
          setWaterWellOrPond(!!p.features?.waterWellOrPond);

          setTitlesUpToDate(p.features?.titlesUpToDate ?? p.legalCertainties?.titlesUpToDate ?? true);
          setBankCreditEligible(!!p.features?.bankCreditEligible || !!p.legalCertainties?.bankCreditEligible);
          setAcceptsTradeIn(!!p.features?.acceptsTradeIn || !!p.legalCertainties?.acceptsTradeIn);
          setPhRegime(!!p.features?.phRegime);
          setPerimeterFence(!!p.features?.perimeterFence);
          setSecuritySystem(!!p.features?.securitySystem);

          setConeatIndex(p.features?.coneatIndex);
          setPavedStreet(!!p.features?.pavedStreet);
          setShedOrCorral(!!p.features?.shedOrCorral);

          setIsHectares(!!p.features?.isHectares || (p.features?.plotAreaM2 ? p.features.plotAreaM2 >= 10000 : false));
          setFractionable(!!p.features?.fractionable);
          setMinFractionM2(p.features?.minFractionM2);
          setFractionNotes(p.features?.fractionNotes || '');
          setRouteFrontage(p.features?.routeFrontage || '');
          setPricePerM2(p.features?.pricePerM2);
          setSoilTopography(p.features?.soilTopography || '');
          setGatedPerimeter(!!p.features?.gatedPerimeter);

          setSelectedGuarantees(p.guarantees || []);

          setSeoTitle(p.seoTitle || '');
          setSeoDescription(p.seoDescription || '');
          setLastGoogleNotifiedAt(p.lastGoogleNotifiedAt);
          setGoogleIndexingStatus(p.googleIndexingStatus || 'pending');

          setImages(Array.isArray(p.images) ? p.images : []);
        } else {
          setLoadError(data.error || 'No se pudo cargar la propiedad.');
        }
      } catch (err: any) {
        setLoadError(err?.message || 'Error de red al cargar la propiedad.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    const autoSlug = generatePropertySlug(title, codeRef);

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeRef,
          title,
          slug: autoSlug,
          description,
          operation,
          category,
          status,
          priceAmount,
          priceCurrency,
          priceMode,
          neighborhood,
          address,
          hasLocation,
          lat,
          lng,
          isExactLocation,
          radiusMeters,
          bedrooms,
          bathrooms,
          floors,
          builtAreaM2,
          plotAreaM2,
          frontMeters,
          carAccess,
          garage,
          cochera,
          cocheraTechada,
          barbecue,
          barbacoa,
          parrillero,
          pool,
          garden,
          fondo,
          patio,
          woodStoveOrAC,
          petFriendly,
          oseWater,
          uteElectric,
          sanitation,
          fiberOptic,
          waterWellOrPond,
          titlesUpToDate,
          bankCreditEligible,
          acceptsTradeIn,
          phRegime,
          perimeterFence,
          securitySystem,
          pavedStreet,
          shedOrCorral,
          coneatIndex,
          isHectares,
          fractionable,
          minFractionM2,
          fractionNotes: fractionNotes.trim() || undefined,
          routeFrontage: routeFrontage.trim() || undefined,
          pricePerM2,
          soilTopography: soilTopography.trim() || undefined,
          gatedPerimeter,
          guarantees: selectedGuarantees,
          images,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`¡Propiedad Ref. #${codeRef} actualizada correctamente en la base de datos!`);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        alert(data.error || 'Error al actualizar la propiedad.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error de red al intentar actualizar la propiedad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 text-[#5E1754] animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-700">Cargando datos de la propiedad para editar...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
            <h3 className="font-bold text-base">Error al Cargar</h3>
            <p className="text-xs mt-1">{loadError}</p>
          </div>
          <Link href="/admin" className="inline-flex items-center space-x-2 text-[#5E1754] font-bold text-xs hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Panel Admin</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              <Link href="/admin" className="hover:text-[#5E1754] flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Panel de Administración</span>
              </Link>
              <span>/</span>
              <span className="text-[#5E1754]">Editar Propiedad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <Edit3 className="w-7 h-7 text-[#E85D04]" />
              <span>Editar Inmueble Ref. #{codeRef}</span>
            </h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center space-x-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancelar</span>
          </Link>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
          
          {/* Success Toast */}
          {successMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex items-center space-x-3 text-emerald-950 text-xs sm:text-sm font-bold animate-fade-in shadow-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <p>{successMessage}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Redirigiendo al Panel de Administración...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider">
                1. Información Principal (Redacción Libre)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Código Ref.</label>
                  <input
                    type="text"
                    required
                    value={codeRef}
                    onChange={(e) => setCodeRef(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Operación</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as OperationType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  >
                    <option value="venta">🏡 En Venta</option>
                    <option value="alquiler">🔑 Alquiler</option>
                    <option value="proyecto">🏗️ Proyecto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as PropertyCategory;
                      setCategory(newCat);
                      if (newCat === 'modulo') {
                        setHasLocation(false);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  >
                    <option value="casa">🏡 Casa</option>
                    <option value="apartamento">🏢 Apartamento</option>
                    <option value="terreno">📐 Terreno / Solar</option>
                    <option value="chacra">🌾 Chacra / Campo</option>
                    <option value="modulo">🏠 Módulo Habitacional</option>
                    <option value="deposito">📦 Depósito / Galpón</option>
                    <option value="local">🏪 Local Comercial</option>
                    <option value="proyecto">🏗️ Proyecto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título de la Propiedad</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hermosa Casa de 2 Dormitorios en Barrio Centro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                />
              </div>

              <RichTextEditor
                value={description}
                onChange={setDescription}
                required
                label="Descripción Comercial & Detalles"
                placeholder="Describí las características, estado de conservación, orientación, luminosidad y entorno del inmueble..."
              />
            </div>

            {/* Section 2: Location & Price */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider">
                2. Ubicación & Precio Comercial
              </h3>

              {/* Modalidad de Visualización del Precio */}
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label className="text-xs font-black uppercase text-[#5E1754] flex items-center gap-1.5">
                    💵 Modalidad de Precio / Publicación
                  </label>
                  <span className="text-[11px] text-purple-700 font-semibold">Define cómo lo ve el cliente en la web</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPriceMode('visible')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      priceMode === 'visible'
                        ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs">💵 Precio Fijo</div>
                    <div className={`text-[10px] mt-0.5 ${priceMode === 'visible' ? 'text-purple-200' : 'text-slate-400'}`}>Monto visible</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceMode('consultar')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      priceMode === 'consultar'
                        ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs">💬 Consultar Precio</div>
                    <div className={`text-[10px] mt-0.5 ${priceMode === 'consultar' ? 'text-purple-200' : 'text-slate-400'}`}>Oculta el monto</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceMode('reservado')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      priceMode === 'reservado'
                        ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs">🔒 Precio Reservado</div>
                    <div className={`text-[10px] mt-0.5 ${priceMode === 'reservado' ? 'text-purple-200' : 'text-slate-400'}`}>Confidencial</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceMode('desde')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      priceMode === 'desde'
                        ? 'bg-[#5E1754] text-white border-[#5E1754] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs">📈 Precio "Desde..."</div>
                    <div className={`text-[10px] mt-0.5 ${priceMode === 'desde' ? 'text-purple-200' : 'text-slate-400'}`}>Para proyectos/lotes</div>
                  </button>
                </div>

                {/* Mensaje Informativo Contextual */}
                {priceMode === 'consultar' && (
                  <p className="text-[11px] text-purple-900 font-medium bg-purple-100/70 p-2.5 rounded-xl border border-purple-200">
                    💡 La tarjeta y ficha mostrarán <strong>"Consultar Precio"</strong>. El monto abajo queda guardado como referencia interna.
                  </p>
                )}
                {priceMode === 'reservado' && (
                  <p className="text-[11px] text-purple-900 font-medium bg-purple-100/70 p-2.5 rounded-xl border border-purple-200">
                    🔒 La tarjeta y ficha mostrarán <strong>"🔒 Precio Reservado"</strong> para propiedades de alta confidencialidad.
                  </p>
                )}
                {priceMode === 'desde' && (
                  <p className="text-[11px] text-purple-900 font-medium bg-purple-100/70 p-2.5 rounded-xl border border-purple-200">
                    📈 La tarjeta y ficha mostrarán <strong>"Desde {priceCurrency} {priceAmount.toLocaleString('es-UY')}"</strong>.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {priceMode === 'desde' ? 'Monto Base ("Desde...")' : priceMode === 'visible' ? 'Monto del Precio' : 'Monto de Referencia Interno'}
                  </label>
                  <input
                    type="number"
                    required
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Moneda</label>
                  <select
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value as 'USD' | 'UYU')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  >
                    <option value="USD">💵 Dólares (USD)</option>
                    <option value="UYU">🇺🇾 Pesos Uruguayos (UYU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estado Comercial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  >
                    <option value="disponible">🟢 Disponible</option>
                    <option value="nuevo">🟢 Nuevo Ingreso</option>
                    <option value="reservado">🟡 Reservado</option>
                    <option value="vendido">🔴 Vendido</option>
                    <option value="alquilado">🔵 Alquilado</option>
                    <option value="oportunidad">💥 Oportunidad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Barrio / Zona</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dirección (Opcional)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>
              </div>

              {/* Toggle Opcional de Mapa */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLocation}
                    onChange={(e) => setHasLocation(e.target.checked)}
                    className="w-5 h-5 text-[#5E1754] rounded focus:ring-[#5E1754]"
                  />
                  <div>
                    <span className="text-xs font-black uppercase text-slate-800">
                      🗺️ Mostrar Mapa de Ubicación Geográfica
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Desmarcá esta opción para Módulos Habitacionales, Galpones Transportables o inmuebles sin terreno fijo.
                    </p>
                  </div>
                </label>

                {hasLocation ? (
                  <div className="pt-2">
                    <AdminLocationPickerWrapper
                      lat={lat}
                      lng={lng}
                      isExactLocation={isExactLocation}
                      radiusMeters={radiusMeters}
                      onChangeLocation={(newLat, newLng) => {
                        setLat(newLat);
                        setLng(newLng);
                      }}
                      onChangeExactLocation={setIsExactLocation}
                      onChangeRadiusMeters={setRadiusMeters}
                    />
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 font-bold flex items-center space-x-2">
                    <span>🚫 Ubicación desactivada: Esta publicación no incluirá sección de mapa interactivo.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Adaptive Features, Services & Badges */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#E85D04]" />
                  <span>3. Características, Servicios & Comodidades</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Campos adaptados a {category.toUpperCase()} ({operation.toUpperCase()})
                </span>
              </div>

              {/* Adaptativo: Alquileres (Garantías) */}
              {operation === 'alquiler' && (
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-900">
                    🛡️ Garantías de Alquiler Aceptadas
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['ANDA', 'CGN', 'Porto', 'Sura', 'Mapfre', 'Depósito'] as GuaranteeType[]).map((g) => (
                      <label key={g} className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGuarantees.includes(g)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGuarantees([...selectedGuarantees, g]);
                            } else {
                              setSelectedGuarantees(selectedGuarantees.filter((x) => x !== g));
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>🛡️ {g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Grupo 1: Dimensiones, Estructura & Plantas */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700">
                  📐 Dimensiones, Estructura & Plantas
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Dormitorios</label>
                    <input
                      type="number"
                      min={0}
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Baños</label>
                    <input
                      type="number"
                      min={0}
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Plantas / Pisos</label>
                    <input
                      type="number"
                      min={1}
                      value={floors}
                      onChange={(e) => setFloors(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                      placeholder="ej. 1 u 2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">m² Edificados</label>
                    <input
                      type="number"
                      min={0}
                      value={builtAreaM2}
                      onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">m² Terreno</label>
                    <input
                      type="number"
                      min={0}
                      value={plotAreaM2}
                      onChange={(e) => setPlotAreaM2(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Frente (m)</label>
                    <input
                      type="number"
                      min={0}
                      value={frontMeters || ''}
                      onChange={(e) => setFrontMeters(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                      placeholder="ej. 15"
                    />
                  </div>
                </div>
              </div>

              {/* Grupo: Perfil Industrial, Logístico & Fraccionamiento (Dossier Ejecutivo) */}
              <div className="bg-purple-50/60 border-2 border-purple-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/60 pb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black uppercase text-[#5E1754] flex items-center gap-2">
                      <span>🏭 Perfil Industrial, Logístico & Grandes Fracciones (Tarjetas Clave)</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      Completá estos campos para generar el Dossier de 6 tarjetas en la ficha y los badges destacados en el catálogo.
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#5E1754] text-white">
                    Tarjetas Destacadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 1. Medida en Hectáreas */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHectares}
                        onChange={(e) => setIsHectares(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">📐 Mostrar en Hectáreas (Ha)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Calculado: {plotAreaM2 ? (isHectares && plotAreaM2 < 1000 ? plotAreaM2 : (plotAreaM2 / 10000)).toLocaleString('es-UY') : 0} Ha ({plotAreaM2 ? plotAreaM2.toLocaleString('es-UY') : 0} m²).
                    </p>
                  </div>

                  {/* 2. Fraccionamiento */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fractionable}
                        onChange={(e) => setFractionable(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">✂️ Acepta Fraccionamiento</span>
                    </label>
                    {fractionable ? (
                      <div className="space-y-1 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500">Fracción mínima (m²)</label>
                        <input
                          type="number"
                          value={minFractionM2 || ''}
                          onChange={(e) => setMinFractionM2(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="ej. 12000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo para indicar fraccionamiento adaptable.</p>
                    )}
                  </div>

                  {/* 3. Frente sobre Ruta / Bypass */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <label className="block text-xs font-bold text-slate-800">🛣️ Frente sobre Ruta / Conectividad</label>
                    <input
                      type="text"
                      value={routeFrontage}
                      onChange={(e) => setRouteFrontage(e.target.value)}
                      placeholder="ej. 50 Metros sobre Bypass / Ruta 3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>

                  {/* 4. Precio por m² */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <label className="block text-xs font-bold text-slate-800">🏷️ Precio por m² (USD)</label>
                    <input
                      type="number"
                      value={pricePerM2 || ''}
                      onChange={(e) => setPricePerM2(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="ej. 15"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>

                  {/* 5. Topografía & Suelo */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <label className="block text-xs font-bold text-slate-800">🚜 Topografía / Nivelación del Suelo</label>
                    <input
                      type="text"
                      value={soilTopography}
                      onChange={(e) => setSoilTopography(e.target.value)}
                      placeholder="ej. 100% Nivelado - Listo para edificar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>

                  {/* 6. Seguridad & Predio Cerrado */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2 flex flex-col justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatedPerimeter}
                        onChange={(e) => setGatedPerimeter(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🔒 Predio Cerrado & Acceso Controlado</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Perímetro delimitado y seguridad de accesos para transporte pesado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grupo 2: Servicios Básicos & Conectividad */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-sky-900">
                  💧 Servicios Básicos & Conectividad
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-sky-200/60 shadow-2xs hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={oseWater}
                      onChange={(e) => setOseWater(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>🚰 Agua de OSE</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-sky-200/60 shadow-2xs hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={uteElectric}
                      onChange={(e) => setUteElectric(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>⚡ Luz UTE</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-sky-200/60 shadow-2xs hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={sanitation}
                      onChange={(e) => setSanitation(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>🚽 Saneamiento</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-sky-200/60 shadow-2xs hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={fiberOptic}
                      onChange={(e) => setFiberOptic(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>📶 Fibra Óptica</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-sky-200/60 shadow-2xs hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={waterWellOrPond}
                      onChange={(e) => setWaterWellOrPond(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>💧 Pozo / Tajamar</span>
                  </label>
                </div>
              </div>

              {/* Grupo 3: Badges Destacados (Etiquetas Clave) */}
              <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h4 className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5">
                    🏷️ Badges Destacados (Etiquetas Visibles en Portada y Ficha)
                  </h4>
                  <span className="text-[11px] text-amber-800 font-bold">Resaltan en la tarjeta de la propiedad</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={fondo}
                      onChange={(e) => setFondo(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🌳 Fondo</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={patio}
                      onChange={(e) => setPatio(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🏡 Patio</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={barbacoa}
                      onChange={(e) => setBarbacoa(e.target.checked)}
                      className="w-4 h-4 text-[#E85D04] rounded"
                    />
                    <span>🥩 Barbacoa</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={parrillero}
                      onChange={(e) => setParrillero(e.target.checked)}
                      className="w-4 h-4 text-[#E85D04] rounded"
                    />
                    <span>🔥 Parrillero</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={cochera}
                      onChange={(e) => setCochera(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🚗 Cochera</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={cocheraTechada}
                      onChange={(e) => setCocheraTechada(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🛡️ Cochera Techada</span>
                  </label>
                </div>
              </div>

              {/* Grupo 4: Otras Comodidades & Equipamiento */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700">
                  🏡 Otras Comodidades & Equipamiento
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400">
                    <input
                      type="checkbox"
                      checked={carAccess}
                      onChange={(e) => setCarAccess(e.target.checked)}
                      className="w-4 h-4 text-slate-700 rounded"
                    />
                    <span>Entrada de Auto</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400">
                    <input
                      type="checkbox"
                      checked={woodStoveOrAC}
                      onChange={(e) => setWoodStoveOrAC(e.target.checked)}
                      className="w-4 h-4 text-slate-700 rounded"
                    />
                    <span>Estufa a Leña / AC</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400">
                    <input
                      type="checkbox"
                      checked={pool}
                      onChange={(e) => setPool(e.target.checked)}
                      className="w-4 h-4 text-slate-700 rounded"
                    />
                    <span>Piscina</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400">
                    <input
                      type="checkbox"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                      className="w-4 h-4 text-slate-700 rounded"
                    />
                    <span>Acepta Mascotas</span>
                  </label>
                </div>
              </div>

              {/* Grupo 4: Certeza Legal, Regímenes & Seguridad */}
              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#5E1754]">
                  📜 Certeza Legal, Regímenes & Seguridad
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={titlesUpToDate}
                      onChange={(e) => setTitlesUpToDate(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>📜 Títulos al Día</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={bankCreditEligible}
                      onChange={(e) => setBankCreditEligible(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🏛️ Apta Crédito Bancario</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={acceptsTradeIn}
                      onChange={(e) => setAcceptsTradeIn(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🔄 Acepta Permuta</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={phRegime}
                      onChange={(e) => setPhRegime(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🏢 Régimen de PH</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={perimeterFence}
                      onChange={(e) => setPerimeterFence(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🛡️ Cerco Perimetral / Rejas</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={securitySystem}
                      onChange={(e) => setSecuritySystem(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>📹 Alarma / Seguridad</span>
                  </label>
                </div>
              </div>

              {/* Grupo 5: Atributos Rurales & Comerciales */}
              <div className="bg-[#5E1754]/5 border border-[#5E1754]/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#5E1754]">
                  🌾 Atributos Rurales & Comerciales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Índice CONEAT</label>
                    <input
                      type="number"
                      value={coneatIndex || ''}
                      onChange={(e) => setConeatIndex(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5E1754]"
                      placeholder="ej. 120"
                    />
                  </div>
                  <div className="flex items-center sm:pt-5">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs hover:border-purple-300 w-full">
                      <input
                        type="checkbox"
                        checked={pavedStreet}
                        onChange={(e) => setPavedStreet(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span>🛣️ Frente a Asfalto</span>
                    </label>
                  </div>
                  <div className="flex items-center sm:pt-5">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs hover:border-purple-300 w-full">
                      <input
                        type="checkbox"
                        checked={shedOrCorral}
                        onChange={(e) => setShedOrCorral(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span>🛖 Galpón / Depósito</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* Section 4: SEO Optimization & Live Previews */}
            <SeoEditorSection
              title={title}
              category={category}
              operation={operation}
              priceAmount={priceAmount}
              priceCurrency={priceCurrency}
              priceMode={priceMode}
              neighborhood={neighborhood}
              bedrooms={bedrooms}
              builtAreaM2={builtAreaM2}
              plotAreaM2={plotAreaM2}
              codeRef={codeRef}
              features={{
                carAccess, garage, barbecue, pool, garden, woodStoveOrAC, petFriendly,
                oseWater, uteElectric, sanitation, fiberOptic, waterWellOrPond,
                titlesUpToDate, bankCreditEligible, acceptsTradeIn, phRegime, perimeterFence, securitySystem,
                pavedStreet, shedOrCorral, coneatIndex
              }}
              guarantees={selectedGuarantees}
              images={images}
              seoTitle={seoTitle}
              setSeoTitle={setSeoTitle}
              seoDescription={seoDescription}
              setSeoDescription={setSeoDescription}
              propertyId={propertyId}
              lastGoogleNotifiedAt={lastGoogleNotifiedAt}
              googleIndexingStatus={googleIndexingStatus}
            />

            {/* Section 5: Gallery & Main Cover Photo */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[#E85D04]" />
                <span>5. Galería de Fotos & Portada Principal</span>
              </h3>

              <ImageUploader
                images={images}
                onChange={setImages}
                propertyTitle={title || 'Propiedad'}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-98 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios en la Propiedad'}</span>
              </button>
            </div>

          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}
