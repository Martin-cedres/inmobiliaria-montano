'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUploader } from '@/components/ImageUploader';
import { SeoEditorSection } from '@/components/admin/SeoEditorSection';
import { generatePropertySlug } from '@/utils/seo';
import { ArrowLeft, Save, Sparkles, Upload, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { PropertyCategory, OperationType, PropertyStatus, GuaranteeType, ImageAsset } from '@/types/property';
import { AdminLocationPickerWrapper } from '@/components/AdminLocationPickerWrapper';

export default function NuevaPropiedadPage() {
  const router = useRouter();

  // Form State
  const [codeRef, setCodeRef] = useState(`MON-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [operation, setOperation] = useState<OperationType>('venta');
  const [category, setCategory] = useState<PropertyCategory>('casa');
  const [status, setStatus] = useState<PropertyStatus>('disponible');
  const [priceAmount, setPriceAmount] = useState<number>(50000);
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
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [floors, setFloors] = useState<number>(1);
  const [builtAreaM2, setBuiltAreaM2] = useState<number>(75);
  const [plotAreaM2, setPlotAreaM2] = useState<number>(150);
  const [frontMeters, setFrontMeters] = useState<number | undefined>(undefined);

  // Comodidades & Accesibilidad
  const [carAccess, setCarAccess] = useState<boolean>(true);
  const [garage, setGarage] = useState<boolean>(false);
  const [barbecue, setBarbecue] = useState<boolean>(false);
  const [pool, setPool] = useState<boolean>(false);
  const [garden, setGarden] = useState<boolean>(false);
  const [woodStoveOrAC, setWoodStoveOrAC] = useState<boolean>(false);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);

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

  const [selectedGuarantees, setSelectedGuarantees] = useState<GuaranteeType[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    const autoSlug = generatePropertySlug(title, codeRef);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
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
          floors,
          builtAreaM2,
          plotAreaM2,
          frontMeters,
          carAccess,
          garage,
          barbecue,
          pool,
          garden,
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
          guarantees: selectedGuarantees,
          images,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
          featured: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`¡Propiedad Ref. #${codeRef} publicada con éxito! Se ha registrado en la base de datos y generado automáticamente el Slug SEO: "/propiedad/${autoSlug}".`);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        alert(data.error || 'Error al publicar la propiedad.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error de red al intentar publicar la propiedad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 text-left">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Panel Admin</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-xl space-y-8">
          
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Generación de Contenido SEO Automático</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Publicar Nueva Propiedad
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Completá los datos con tu título y redacción habitual. El sistema creará **automáticamente la estructura Schema.org, metadatos OpenGraph y etiquetas para Google**.
            </p>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs sm:text-sm font-semibold space-y-2">
              <div className="flex items-center space-x-2 font-bold text-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Publicación Exitosa!</span>
              </div>
              <p>{successMessage}</p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-block hover:bg-emerald-800"
                >
                  Volver al Panel Admin
                </Link>
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
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título de la Propiedad (Tu Redacción)</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hermosa Casa de 2 Dormitorios con Fondo en Barrio Centro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Descripción Completa (Tu Redacción)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribí aquí todos los detalles de la propiedad..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                />
              </div>
            </div>

            {/* Section 2: Pricing & Location */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-[#5E1754] uppercase tracking-wider">
                2. Precios & Ubicación en San José
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Moneda</label>
                  <select
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value as 'USD' | 'UYU')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  >
                    <option value="USD">USD (Dólares)</option>
                    <option value="UYU">UYU (Pesos Uruguayos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Monto del Precio</label>
                  <input
                    type="number"
                    required
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estado de Gestión</label>
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
                    placeholder="ej. Barrio Centro, Plaza Arriaga, etc."
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dirección (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. Calle Asamblea esq. Benton"
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

              {/* Grupo 3: Comodidades Residenciales & Accesibilidad */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-amber-900">
                  🏡 Comodidades & Equipamiento Residencial
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={carAccess}
                      onChange={(e) => setCarAccess(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🚘 Entrada de Auto</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={garage}
                      onChange={(e) => setGarage(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🚗 Garage / Cochera</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={barbecue}
                      onChange={(e) => setBarbecue(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🍖 Parrillero / Barbacoa</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={woodStoveOrAC}
                      onChange={(e) => setWoodStoveOrAC(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🪵 Estufa a Leña / AC</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={pool}
                      onChange={(e) => setPool(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🏊 Piscina</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={garden}
                      onChange={(e) => setGarden(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>🌳 Jardín / Fondo Verde</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>🐾 Acepta Mascotas</span>
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
                propertyTitle={title || 'Nueva Propiedad'}
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
                <span>{isSubmitting ? 'Generando SEO & Publicando...' : 'Publicar Propiedad con SEO Automático'}</span>
              </button>
            </div>

          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}
