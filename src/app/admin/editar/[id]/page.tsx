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
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Sliders, 
  Image as ImageIcon, 
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  MapPin,
  Maximize2,
  Building,
  Building2
} from 'lucide-react';
import { PropertyCategory, OperationType, PropertyStatus, GuaranteeType, ImageAsset } from '@/types/property';
import { AdminLocationPickerWrapper } from '@/components/AdminLocationPickerWrapper';

const SAN_JOSE_NEIGHBORHOODS = [
  'Centro',
  'Barrio Industrial',
  'Plaza Arriaga',
  'Arroyo Mallada',
  'Colón',
  'Parque Rodó',
  'Treinta y Tres',
  'Picada de las Tunas',
  'Bypass Ruta 3 y 11',
  'Ruta 3',
  'Ruta 11',
  'Villa Olímpica / Playa Pascual',
  'Libertad',
  'Ciudad del Plata',
  'Zona Rural / Chacras',
];

const GUARANTEE_OPTIONS: GuaranteeType[] = [
  'ANDA',
  'CGN',
  'Porto',
  'Sura',
  'Mapfre',
  'Depósito',
  'Propia',
  'Otra',
];

export default function EditarPropiedadPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  // Tab State: 'general' | 'features' | 'images' | 'seo'
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'images' | 'seo'>('general');

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
  const [floors, setFloors] = useState<number>(0);
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
  const [hectaresAmount, setHectaresAmount] = useState<number | undefined>(undefined);
  const [fractionable, setFractionable] = useState<boolean>(false);
  const [minFractionM2, setMinFractionM2] = useState<number | undefined>(undefined);
  const [fractionNotes, setFractionNotes] = useState<string>('');
  const [hasRouteFrontage, setHasRouteFrontage] = useState<boolean>(false);
  const [routeFrontage, setRouteFrontage] = useState<string>('');
  const [hasPricePerUnit, setHasPricePerUnit] = useState<boolean>(false);
  const [pricePerM2, setPricePerM2] = useState<number | undefined>(undefined);
  const [priceUnitType, setPriceUnitType] = useState<string>('m²');
  const [hasSoilTopography, setHasSoilTopography] = useState<boolean>(false);
  const [soilTopography, setSoilTopography] = useState<string>('');
  const [gatedPerimeter, setGatedPerimeter] = useState<boolean>(false);

  const [selectedGuarantees, setSelectedGuarantees] = useState<GuaranteeType[]>([]);
  const [lastGoogleNotifiedAt, setLastGoogleNotifiedAt] = useState<string | undefined>();
  const [googleIndexingStatus, setGoogleIndexingStatus] = useState<'pending' | 'notified' | 'error'>('pending');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clasificación de categoría para campos condicionales
  const isLandOrFarm = category === 'terreno' || category === 'chacra';

  const toggleGuarantee = (g: GuaranteeType) => {
    setSelectedGuarantees((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  useEffect(() => {
    async function fetchProperty() {
      if (!propertyId) return;
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
          setHasLocation(p.location?.hasLocation !== undefined ? p.location.hasLocation : true);
          setLat(p.location?.coordinates?.lat || -34.3375);
          setLng(p.location?.coordinates?.lng || -56.7136);
          setIsExactLocation(!!p.location?.isExactLocation);
          setRadiusMeters(p.location?.radiusMeters || 300);

          setBedrooms(p.features?.bedrooms || 0);
          setBathrooms(p.features?.bathrooms || 0);
          setFloors(p.features?.floors || 0);
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

          setFondo(!!p.features?.fondo);
          setPatio(!!p.features?.patio);
          setBarbacoa(!!p.features?.barbacoa);
          setParrillero(!!p.features?.parrillero);
          setCochera(!!p.features?.cochera);
          setCocheraTechada(!!p.features?.cocheraTechada);

          setOseWater(p.features?.oseWater !== undefined ? !!p.features?.oseWater : true);
          setUteElectric(p.features?.uteElectric !== undefined ? !!p.features?.uteElectric : true);
          setSanitation(p.features?.sanitation !== undefined ? !!p.features?.sanitation : true);
          setFiberOptic(p.features?.fiberOptic !== undefined ? !!p.features?.fiberOptic : true);
          setWaterWellOrPond(!!p.features?.waterWellOrPond);

          setTitlesUpToDate(p.features?.titlesUpToDate !== undefined ? !!p.features?.titlesUpToDate : true);
          setBankCreditEligible(!!p.features?.bankCreditEligible);
          setAcceptsTradeIn(!!p.features?.acceptsTradeIn);
          setPhRegime(!!p.features?.phRegime);
          setPerimeterFence(!!p.features?.perimeterFence);
          setSecuritySystem(!!p.features?.securitySystem);

          setConeatIndex(p.features?.coneatIndex);
          setPavedStreet(!!p.features?.pavedStreet);
          setShedOrCorral(!!p.features?.shedOrCorral);

          const hasHectares = !!p.features?.isHectares || !!p.features?.hectaresAmount;
          setIsHectares(hasHectares);
          setHectaresAmount(p.features?.hectaresAmount);

          setFractionable(!!p.features?.fractionable);
          setMinFractionM2(p.features?.minFractionM2);
          setFractionNotes(p.features?.fractionNotes || '');

          setHasRouteFrontage(!!p.features?.routeFrontage);
          setRouteFrontage(p.features?.routeFrontage || '');

          setHasPricePerUnit(!!p.features?.pricePerM2);
          setPricePerM2(p.features?.pricePerM2);
          setPriceUnitType(p.features?.priceUnitType || 'm²');

          setHasSoilTopography(!!p.features?.soilTopography);
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
          bedrooms: isLandOrFarm ? undefined : bedrooms,
          bathrooms: isLandOrFarm ? undefined : bathrooms,
          floors: isLandOrFarm ? undefined : floors,
          builtAreaM2: isLandOrFarm ? undefined : builtAreaM2,
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
          hectaresAmount: isHectares ? hectaresAmount : undefined,
          fractionable,
          minFractionM2: fractionable ? minFractionM2 : undefined,
          fractionNotes: fractionable && fractionNotes.trim() ? fractionNotes.trim() : undefined,
          routeFrontage: hasRouteFrontage && routeFrontage.trim() ? routeFrontage.trim() : undefined,
          pricePerM2: hasPricePerUnit ? pricePerM2 : undefined,
          priceUnitType: hasPricePerUnit ? priceUnitType : undefined,
          soilTopography: hasSoilTopography && soilTopography.trim() ? soilTopography.trim() : undefined,
          gatedPerimeter,
          guarantees: selectedGuarantees,
          images,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`¡Propiedad Ref. #${codeRef} actualizada correctamente! Redirigiendo...`);
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
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
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
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
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800">
      <Header />

      {/* STICKY TOP ACTION BAR */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center space-x-1 text-xs font-extrabold text-slate-600 hover:text-[#5E1754] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Panel</span>
            </Link>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  {codeRef}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[320px]">
                  {title}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Status Pill */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
            >
              <option value="disponible">🟢 Disponible</option>
              <option value="reservado">🟡 Reservado</option>
              <option value="vendido">🔴 Vendido</option>
              <option value="alquilado">🔵 Alquilado</option>
            </select>

            {/* Save Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
              className="bg-[#5E1754] hover:bg-[#43103c] active:scale-95 text-white font-black px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-purple-900/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

        </div>
      </div>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-left space-y-6">
        
        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB NAVIGATION COCKPIT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 flex flex-wrap sm:flex-nowrap gap-1">
          
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#5E1754] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. General & Precio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'features'
                ? 'bg-[#5E1754] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. Medidas & Características</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'bg-[#5E1754] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Fotos ({images.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-[#5E1754] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            <span>4. SEO & Google</span>
          </button>

        </div>

        {/* FORM BODY CONTAINER */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TAB 1: GENERAL & PRECIO */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#5E1754]" />
                  <span>Información Principal, Redacción & Precio</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actualizá los datos clave del inmueble y su redacción con el editor visual Word.
                </p>
              </div>

              {/* 1.1 Código, Operación y Categoría */}
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
                  >
                    <option value="venta">🏡 En Venta</option>
                    <option value="alquiler">🔑 Alquiler</option>
                    <option value="proyecto">🏗️ Proyecto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Categoría del Inmueble</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as PropertyCategory;
                      setCategory(newCat);
                      if (newCat === 'modulo') {
                        setHasLocation(false);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
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

              {/* 1.2 Título Comercial */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Título de la Propiedad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hermosa Casa de 2 Dormitorios con Fondo y Garage en Barrio Centro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                />
              </div>

              {/* 1.3 Editor de Texto Enriquecido Visual */}
              <RichTextEditor
                value={description}
                onChange={setDescription}
                required
                label="Descripción Comercial & Redacción"
                placeholder="Escribí aquí las comodidades, estado, luminosidad y entorno del inmueble..."
              />

              {/* 1.4 Precios y Modalidad */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-extrabold text-[#5E1754] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Condiciones de Precio</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Monto</label>
                    <input
                      type="number"
                      min={0}
                      disabled={priceMode === 'consultar'}
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Moneda</label>
                    <select
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value as 'USD' | 'UYU')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
                    >
                      <option value="USD">Dólares (USD)</option>
                      <option value="UYU">Pesos Uruguayos ($UY)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Modalidad</label>
                    <select
                      value={priceMode}
                      onChange={(e) => setPriceMode(e.target.value as 'visible' | 'consultar' | 'reservado' | 'desde')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
                    >
                      <option value="visible">Mostrar Precio Exacto</option>
                      <option value="consultar">Consultar Precio</option>
                      <option value="desde">Precio &quot;Desde&quot;</option>
                      <option value="reservado">Reservado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 1.5 Ubicación y Mapa */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-extrabold text-[#5E1754] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>Ubicación en San José & Privacidad del Mapa</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Barrio / Zona</label>
                    <div className="space-y-2">
                      <select
                        value={SAN_JOSE_NEIGHBORHOODS.includes(neighborhood) ? neighborhood : 'otro'}
                        onChange={(e) => {
                          if (e.target.value !== 'otro') {
                            setNeighborhood(e.target.value);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
                      >
                        {SAN_JOSE_NEIGHBORHOODS.map((nh) => (
                          <option key={nh} value={nh}>{nh}</option>
                        ))}
                        <option value="otro">Otro Barrio / Personalizado...</option>
                      </select>

                      {(!SAN_JOSE_NEIGHBORHOODS.includes(neighborhood) || neighborhood === '') && (
                        <input
                          type="text"
                          placeholder="Escribí el barrio o zona..."
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Dirección / Calle <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ej. 25 de Mayo casi Artigas"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                </div>

                {/* Mapa Interactivo */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasLocation}
                        onChange={(e) => setHasLocation(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">📍 Mostrar Mapa de Ubicación</span>
                    </label>
                  </div>

                  {hasLocation && (
                    <AdminLocationPickerWrapper
                      lat={lat}
                      lng={lng}
                      isExactLocation={isExactLocation}
                      radiusMeters={radiusMeters}
                      onChangeLocation={(newLat: number, newLng: number) => {
                        setLat(newLat);
                        setLng(newLng);
                      }}
                      onChangeExactLocation={(isExact: boolean) => setIsExactLocation(isExact)}
                      onChangeRadiusMeters={(radius: number) => setRadiusMeters(radius)}
                    />
                  )}
                </div>
              </div>

              {/* Botón Siguiente Paso */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className="bg-[#5E1754] hover:bg-[#43103c] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Siguiente: Medidas & Características</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: MEDIDAS & CARACTERÍSTICAS */}
          {activeTab === 'features' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#5E1754]" />
                    <span>Medidas, Ambientes & Comodidades</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configuración inteligente adaptada a <strong>{category.toUpperCase()}</strong>.
                  </p>
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 bg-purple-100 text-[#5E1754] rounded-full">
                  Categoría: {category.toUpperCase()}
                </span>
              </div>

              {/* 2.1 Superficies y Medidas */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-[#E85D04]" />
                  <span>Superficies & Dimensiones</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {!isLandOrFarm && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">m² Edificados</label>
                      <input
                        type="number"
                        min={0}
                        value={builtAreaM2}
                        onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">m² de Terreno / Solar</label>
                    <input
                      type="number"
                      min={0}
                      value={plotAreaM2}
                      onChange={(e) => setPlotAreaM2(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Metros de Frente <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="ej. 15"
                      value={frontMeters || ''}
                      onChange={(e) => setFrontMeters(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>
                </div>
              </div>

              {/* 2.2 Ambientes Residenciales */}
              {!isLandOrFarm && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#E85D04]" />
                    <span>Ambientes & Distribución</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dormitorios</label>
                      <input
                        type="number"
                        min={0}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Baños</label>
                      <input
                        type="number"
                        min={0}
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Plantas / Pisos <span className="text-slate-400 font-normal">(0 = Opcional)</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0 (Opcional)"
                        value={floors || ''}
                        onChange={(e) => setFloors(e.target.value ? Number(e.target.value) : 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2.3 Comodidades & Etiquetas Principales */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  ✨ Comodidades & Características Destacadas
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs font-semibold text-slate-700">
                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={barbecue} onChange={(e) => setBarbecue(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🍖 Parrillero / Barbacoa</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={fondo} onChange={(e) => setFondo(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🌳 Fondo Verde</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={patio} onChange={(e) => setPatio(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🧱 Patio</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={garage} onChange={(e) => setGarage(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🚗 Garage Techado</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={carAccess} onChange={(e) => setCarAccess(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🚙 Entrada de Auto</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={pool} onChange={(e) => setPool(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🏊 Piscina</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={woodStoveOrAC} onChange={(e) => setWoodStoveOrAC(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🔥 Estufa / Aire Acond.</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🐾 Acepta Mascotas</span>
                  </label>
                </div>
              </div>

              {/* 2.4 Servicios Básicos */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  💧 Servicios & Conectividad
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-semibold text-slate-700">
                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={oseWater} onChange={(e) => setOseWater(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>💧 Agua OSE</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={uteElectric} onChange={(e) => setUteElectric(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>⚡ Luz UTE</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={sanitation} onChange={(e) => setSanitation(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🚽 Saneamiento</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={fiberOptic} onChange={(e) => setFiberOptic(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🌐 Fibra Óptica</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={waterWellOrPond} onChange={(e) => setWaterWellOrPond(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🚜 Pozo / Tajamar</span>
                  </label>
                </div>
              </div>

              {/* 2.5 Certeza Legal & Garantías */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  ⚖️ Certeza Legal & Seguridad
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-700">
                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={titlesUpToDate} onChange={(e) => setTitlesUpToDate(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>📑 Títulos al Día</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={bankCreditEligible} onChange={(e) => setBankCreditEligible(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🏦 Apta Banco</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={acceptsTradeIn} onChange={(e) => setAcceptsTradeIn(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🔄 Acepta Permuta</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={phRegime} onChange={(e) => setPhRegime(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🏢 Propiedad Horizontal (PH)</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={perimeterFence} onChange={(e) => setPerimeterFence(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🧱 Predio Cercado</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer">
                    <input type="checkbox" checked={securitySystem} onChange={(e) => setSecuritySystem(e.target.checked)} className="w-4 h-4 text-[#5E1754] rounded" />
                    <span>🚨 Alarma / Seguridad</span>
                  </label>
                </div>

                {/* Garantías de Alquiler */}
                {operation === 'alquiler' && (
                  <div className="mt-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#5E1754]">
                      Garantías de Alquiler Aceptadas
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {GUARANTEE_OPTIONS.map((g) => {
                        const isChecked = selectedGuarantees.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGuarantee(g)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-[#5E1754] text-white border-[#5E1754]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                            }`}
                          >
                            {isChecked ? `✓ ${g}` : `+ ${g}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2.6 Perfil Industrial, Logístico & Grandes Fracciones */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#5E1754] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Perfil Industrial, Logístico & Fracciones (Opcional)</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">Activalas con el tick según corresponda</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* 1. Hectáreas */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHectares}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setIsHectares(val);
                          if (!val) setHectaresAmount(undefined);
                        }}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">📐 Superficie en Hectáreas (Ha)</span>
                    </label>
                    {isHectares ? (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500">Cantidad de Hectáreas</label>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          value={hectaresAmount || ''}
                          onChange={(e) => {
                            const val = e.target.value ? Number(e.target.value) : undefined;
                            setHectaresAmount(val);
                            if (val) setPlotAreaM2(Math.round(val * 10000));
                          }}
                          placeholder="ej. 12 o 12.5"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                        />
                        {hectaresAmount ? (
                          <p className="text-[10px] text-purple-700 font-bold">
                            = {(hectaresAmount * 10000).toLocaleString('es-UY')} m²
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo para campos, chacras o predios grandes.</p>
                    )}
                  </div>

                  {/* 2. Fraccionamiento */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fractionable}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setFractionable(val);
                          if (!val) { setMinFractionM2(undefined); setFractionNotes(''); }
                        }}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">✂️ Acepta Fraccionamiento</span>
                    </label>
                    {fractionable ? (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500">Fracción Mínima (m²)</label>
                        <input
                          type="number"
                          min={0}
                          value={minFractionM2 || ''}
                          onChange={(e) => setMinFractionM2(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="ej. 12000"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo si se vende en partes adaptables.</p>
                    )}
                  </div>

                  {/* 3. Frente sobre Ruta */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasRouteFrontage}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setHasRouteFrontage(val);
                          if (!val) setRouteFrontage('');
                        }}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🛣️ Frente sobre Ruta / Acceso</span>
                    </label>
                    {hasRouteFrontage ? (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500">Detalle de Frente</label>
                        <input
                          type="text"
                          value={routeFrontage}
                          onChange={(e) => setRouteFrontage(e.target.value)}
                          placeholder="ej. 50 Metros sobre Bypass / Ruta 3"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo para destacar metros sobre ruta o acceso clave.</p>
                    )}
                  </div>

                  {/* 4. Precio por Unidad */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPricePerUnit}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setHasPricePerUnit(val);
                          if (!val) setPricePerM2(undefined);
                        }}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🏷️ Precio por Unidad</span>
                    </label>
                    {hasPricePerUnit ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-500">Monto USD</label>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={pricePerM2 || ''}
                              onChange={(e) => setPricePerM2(e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="ej. 15"
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-500">Unidad</label>
                            <select
                              value={priceUnitType}
                              onChange={(e) => setPriceUnitType(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754] cursor-pointer"
                            >
                              <option value="m²">/ m²</option>
                              <option value="Ha">/ Ha</option>
                              <option value="Fracción">/ Fracción</option>
                              <option value="Solar">/ Solar</option>
                            </select>
                          </div>
                        </div>
                        {pricePerM2 ? (
                          <p className="text-[10px] text-purple-700 font-bold">
                            Vista: USD {pricePerM2} / {priceUnitType}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo para mostrar ej. USD 15 / m² o USD 15.000 / Ha.</p>
                    )}
                  </div>

                  {/* 5. Topografía */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSoilTopography}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setHasSoilTopography(val);
                          if (!val) setSoilTopography('');
                        }}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🚜 Topografía & Suelo</span>
                    </label>
                    {hasSoilTopography ? (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500">Estado del Suelo</label>
                        <input
                          type="text"
                          value={soilTopography}
                          onChange={(e) => setSoilTopography(e.target.value)}
                          placeholder="ej. 100% Nivelado - Listo para edificar"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">Activalo para detallar suelo parejo o relleno.</p>
                    )}
                  </div>

                  {/* 6. Predio Cerrado */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatedPerimeter}
                        onChange={(e) => setGatedPerimeter(e.target.checked)}
                        className="w-4 h-4 text-[#5E1754] rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🔒 Predio Cerrado</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Perímetro delimitado y seguridad de accesos para transporte pesado.
                    </p>
                  </div>

                </div>
              </div>

              {/* Botones de Navegación */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Paso Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="bg-[#5E1754] hover:bg-[#43103c] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Siguiente: Fotos & Galería</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: FOTOS & GALERÍA */}
          {activeTab === 'images' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#5E1754]" />
                    <span>Galería Multimedia & Foto de Portada</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Subí imágenes en alta calidad. La primera imagen o la que tenga la estrella ⭐ será la portada principal del catálogo.
                  </p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-[#5E1754] rounded-full">
                  {images.length} fotos cargadas
                </span>
              </div>

              <ImageUploader
                images={images}
                onChange={setImages}
                propertyTitle={title || 'Propiedad'}
              />

              {/* Botones de Navegación */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Paso Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  className="bg-[#5E1754] hover:bg-[#43103c] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Siguiente: Posicionamiento SEO</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: SEO & GOOGLE */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-[#5E1754]" />
                  <span>Posicionamiento en Google & Metadatos Automáticos</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  El sistema genera automáticamente la estructura Schema.org y OpenGraph. Podés personalizar el título y la descripción para Google si lo deseas.
                </p>
              </div>

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
                googleIndexingStatus={googleIndexingStatus}
                lastGoogleNotifiedAt={lastGoogleNotifiedAt}
              />

              {/* Botones de Navegación & Guardar */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Paso Anterior</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5E1754] hover:bg-[#43103c] active:scale-95 text-white font-black py-3.5 px-8 rounded-xl shadow-lg hover:shadow-purple-900/30 transition-all flex items-center space-x-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando Cambios...' : 'Guardar Todos los Cambios'}</span>
                </button>
              </div>

            </div>
          )}

        </form>

      </main>

      <Footer />
    </div>
  );
}
