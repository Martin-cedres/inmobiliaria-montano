'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUploader } from '@/components/ImageUploader';
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
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [operation, setOperation] = useState<OperationType>('venta');
  const [category, setCategory] = useState<PropertyCategory>('casa');
  const [status, setStatus] = useState<PropertyStatus>('disponible');
  const [priceAmount, setPriceAmount] = useState<number>(0);
  const [priceCurrency, setPriceCurrency] = useState<'USD' | 'UYU'>('USD');
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
  const [builtAreaM2, setBuiltAreaM2] = useState<number>(0);
  const [plotAreaM2, setPlotAreaM2] = useState<number>(0);
  const [garage, setGarage] = useState<boolean>(false);
  const [bankCreditEligible, setBankCreditEligible] = useState<boolean>(false);
  const [oseWater, setOseWater] = useState<boolean>(true);
  const [phRegime, setPhRegime] = useState<boolean>(false);

  // Category & Operation Specific Adaptive States
  const [coneatIndex, setConeatIndex] = useState<number | undefined>(undefined);
  const [frontMeters, setFrontMeters] = useState<number | undefined>(undefined);
  const [waterWellOrPond, setWaterWellOrPond] = useState<boolean>(false);
  const [fiberOptic, setFiberOptic] = useState<boolean>(false);
  const [pavedStreet, setPavedStreet] = useState<boolean>(false);
  const [woodStoveOrAC, setWoodStoveOrAC] = useState<boolean>(false);
  const [titlesUpToDate, setTitlesUpToDate] = useState<boolean>(true);
  const [acceptsTradeIn, setAcceptsTradeIn] = useState<boolean>(false);
  const [shedOrCorral, setShedOrCorral] = useState<boolean>(false);
  const [selectedGuarantees, setSelectedGuarantees] = useState<GuaranteeType[]>([]);

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
          setNeighborhood(p.location?.neighborhood || 'Centro');
          setAddress(p.location?.address || '');
          
          setHasLocation(p.location?.hasLocation !== false);
          setLat(p.location?.coordinates?.lat ?? p.location?.lat ?? -34.3375);
          setLng(p.location?.coordinates?.lng ?? p.location?.lng ?? -56.7136);
          setIsExactLocation(p.location?.isExactLocation ?? false);
          setRadiusMeters(p.location?.radiusMeters ?? 300);

          setBedrooms(p.features?.bedrooms || 0);
          setBathrooms(p.features?.bathrooms || 0);
          setBuiltAreaM2(p.features?.builtAreaM2 || 0);
          setPlotAreaM2(p.features?.plotAreaM2 || 0);
          setGarage(!!p.features?.garage);
          setBankCreditEligible(!!p.features?.bankCreditEligible || !!p.legalCertainties?.bankCreditEligible);
          setOseWater(p.features?.oseWater ?? true);
          setPhRegime(!!p.features?.phRegime);
          
          setConeatIndex(p.features?.coneatIndex);
          setFrontMeters(p.features?.frontMeters);
          setWaterWellOrPond(!!p.features?.waterWellOrPond);
          setFiberOptic(!!p.features?.fiberOptic);
          setPavedStreet(!!p.features?.pavedStreet);
          setWoodStoveOrAC(!!p.features?.woodStoveOrAC);
          setTitlesUpToDate(p.features?.titlesUpToDate ?? p.legalCertainties?.titlesUpToDate ?? true);
          setAcceptsTradeIn(!!p.features?.acceptsTradeIn || !!p.legalCertainties?.acceptsTradeIn);
          setShedOrCorral(!!p.features?.shedOrCorral);
          setSelectedGuarantees(p.guarantees || []);

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
          neighborhood,
          address,
          hasLocation,
          lat,
          lng,
          isExactLocation,
          radiusMeters,
          bedrooms,
          bathrooms,
          builtAreaM2,
          plotAreaM2,
          garage,
          bankCreditEligible,
          oseWater,
          phRegime,
          coneatIndex,
          frontMeters,
          waterWellOrPond,
          fiberOptic,
          pavedStreet,
          woodStoveOrAC,
          titlesUpToDate,
          acceptsTradeIn,
          shedOrCorral,
          guarantees: selectedGuarantees,
          images,
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

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Descripción Completa</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                />
              </div>
            </div>

            {/* Section 2: Location & Price */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider">
                2. Ubicación & Precio Comercial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Monto del Precio</label>
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

            {/* Section 3: Adaptive Features & Category Specific Badges */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider">
                  3. Características Adaptativas & Badges
                </h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Campos adaptados a {category.toUpperCase()} ({operation.toUpperCase()})
                </span>
              </div>

              {/* General Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dormitorios</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Baños</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">m² Edificados</label>
                  <input
                    type="number"
                    value={builtAreaM2}
                    onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">m² Terreno</label>
                  <input
                    type="number"
                    value={plotAreaM2}
                    onChange={(e) => setPlotAreaM2(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>
              </div>

              {/* Certeza Legal & Servicios */}
              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#5E1754]">
                  📜 Certeza Legal & Servicios Básicos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={titlesUpToDate}
                      onChange={(e) => setTitlesUpToDate(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>📜 Títulos al Día</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bankCreditEligible}
                      onChange={(e) => setBankCreditEligible(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🏛️ Apta Crédito Bancario</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptsTradeIn}
                      onChange={(e) => setAcceptsTradeIn(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>🔄 Acepta Permuta</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fiberOptic}
                      onChange={(e) => setFiberOptic(e.target.checked)}
                      className="w-4 h-4 text-[#5E1754] rounded"
                    />
                    <span>📶 Fibra Óptica</span>
                  </label>
                </div>
              </div>
            </div>

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
