'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, Send, Building, X } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE } from '@/utils/whatsapp';

export const OwnerLeadSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('casa');
  const [operationType, setOperationType] = useState('venta');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent, onDone?: () => void) => {
    e.preventDefault();

    const text = `Hola Inmobiliaria Montaño, solicito tasación / información para publicar mi propiedad:\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Operación: ${operationType}\n- Tipo: ${propertyType}${neighborhood ? `\n- Barrio/Zona: ${neighborhood}` : ''}${notes ? `\n- Detalles: ${notes}` : ''}`;

    const waUrl = `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
    if (onDone) onDone();
  };

  const renderFormContent = (onDone?: () => void) => (
    <>
      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h4 className="text-lg font-black text-slate-900">¡Solicitud enviada a WhatsApp!</h4>
          <p className="text-xs text-slate-600">
            Nos pondremos en contacto contigo a la brevedad para coordinar la tasación.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-[#5e1754] underline hover:text-[#e85d04]"
          >
            Enviar otra consulta
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e, onDone)} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tu Nombre</label>
              <input
                type="text"
                required
                placeholder="ej. Carlos Montaño"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Teléfono / WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="ej. 099 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Quiero...</label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
              >
                <option value="venta">Vender mi propiedad</option>
                <option value="alquiler">Alquilar mi propiedad</option>
                <option value="tasacion">Solo solicitar Tasación</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tipo de Propiedad</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
              >
                <option value="casa">🏡 Casa</option>
                <option value="apartamento">🏢 Apartamento</option>
                <option value="chacra">🌾 Chacra / Campo</option>
                <option value="deposito">📦 Galpón / Depósito</option>
                <option value="terreno">📐 Terreno / Solar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Barrio o Zona en San José (Opcional)</label>
            <input
              type="text"
              placeholder="ej. Barrio Centro, Plaza Arriaga, etc."
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Detalles Adicionales (Opcional)</label>
            <textarea
              rows={2}
              placeholder="ej. Casa con 2 dormitorios, parrillero y fondo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#e85d04] hover:bg-[#ff7518] active:scale-98 text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base mt-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Solicitud por WhatsApp</span>
          </button>
        </form>
      )}
    </>
  );

  return (
    <section id="tasaciones" className="relative scroll-mt-28 sm:scroll-mt-32 py-16 sm:py-24 bg-gradient-to-br from-[#2d0b28] via-[#43123c] to-[#5e1754] text-white overflow-hidden">
      
      {/* Halo Radial Blur (Glow Sutil de Fondo) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#e85d04]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & Trust Factors */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 bg-amber-400/15 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Para Propietarios en San José</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              ¿Querés vender o alquilar tu propiedad?
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              En <strong className="text-amber-300">Inmobiliaria Montaño</strong> valuamos tu inmueble con criterio técnico real y la máxima difusión digital. Solicitá tu tasación sin compromiso.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start space-x-3">
                <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Tasaciones profesionales precisas adaptadas al mercado local de San José.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Difusión masiva en web optimizada, redes sociales y portales líderes.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Asesoramiento legal, notarial y acompañamiento en todo el proceso.
                </span>
              </div>
            </div>

            {/* Personal Guarantee Quote Card from Daniel Montaño */}
            <div className="pt-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-xl">
                {/* Circular Avatar of Daniel with Orange Ring */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-[#E85D04]/30 border-2 border-[#E85D04] shadow-2xl bg-slate-900">
                    <img
                      src="/daniel-montano.webp"
                      alt="Daniel Montaño — Director & Asesor Inmobiliario"
                      className="w-full h-full object-cover object-[center_28%] scale-105"
                    />
                  </div>
                </div>

                {/* Quote & Signature */}
                <div className="text-left space-y-1.5 overflow-hidden">
                  <p className="text-xs sm:text-sm text-slate-100 italic leading-snug">
                    "Me comprometo personalmente a brindarte una tasación justa, honesta y sin falsas expectativas para defender el verdadero valor de tu propiedad."
                  </p>
                  <div className="pt-1.5 space-y-0.5">
                    <p className="font-black text-white text-xs sm:text-sm tracking-wide leading-tight">
                      Daniel Montaño
                    </p>
                    <p className="text-slate-200 font-medium text-[11px] sm:text-xs leading-tight">
                      Director & Asesor Inmobiliario
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Compact High-Converting CTA Card (< lg:hidden) */}
            <div className="lg:hidden mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center space-y-3.5 shadow-2xl">
              <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>Tasación / Publicación Rápida</span>
              </div>

              <h3 className="text-xl font-black text-white leading-snug">
                ¿Querés conocer el valor real de tu inmueble?
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Completá tus datos en menos de 1 minuto y te contactamos al instante.
              </p>

              <div className="pt-1">
                {/* Primary Modal Trigger Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 text-sm transition-all"
                >
                  <Calculator className="w-4.5 h-4.5" />
                  <span>Solicitar Tasación por Formulario</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Inline Form (hidden lg:block) */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#5e1754]">Solicitar Tasación / Publicar</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Completá los datos y te contactamos al instante.</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-[#5e1754]">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              {renderFormContent()}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Appraisal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 my-auto animate-scaleUp">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-5 text-left">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-[#5e1754] flex-shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#5e1754] leading-tight">Solicitar Tasación / Publicar</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Completá los datos y te contactamos al instante.</p>
              </div>
            </div>

            {renderFormContent(() => setIsModalOpen(false))}
          </div>
        </div>
      )}
    </section>
  );
};

