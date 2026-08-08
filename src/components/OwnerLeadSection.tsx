'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, MessageCircle, Send, Building, ShieldCheck } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE } from '@/utils/whatsapp';

export const OwnerLeadSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('casa');
  const [operationType, setOperationType] = useState('venta');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `Hola Inmobiliaria Montaño, solicito tasación / información para publicar mi propiedad:\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Operación: ${operationType}\n- Tipo: ${propertyType}\n- Barrio/Zona: ${neighborhood}\n- Detalles: ${notes}`;

    const waUrl = `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="tasaciones" className="py-16 bg-gradient-to-br from-[#350A2F] via-[#4A1143] to-[#5E1754] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & Trust Factors */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Para Propietarios en San José</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              ¿Querés vender o alquilar tu propiedad?
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              En **Inmobiliaria Montaño** valuamos tu inmueble con criterio técnico real y la máxima difusión digital. Solicitá tu tasación sin compromiso.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Tasaciones profesionales precisas adaptadas al mercado local.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Difusión masiva en web optimizada, redes sociales y portales líderes.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Asesoramiento legal, notarial y acompañamiento en todo el proceso.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Lead Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#5E1754]">Solicitar Tasación / Publicar</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Completá los datos y te contactamos al instante.</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                  <Building className="w-5 h-5" />
                </div>
              </div>

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
                    className="text-xs font-bold text-[#5E1754] underline hover:text-[#E85D04]"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tu Nombre</label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Carlos Montaño"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Quiero...</label>
                      <select
                        value={operationType}
                        onChange={(e) => setOperationType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
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
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Barrio o Zona en San José</label>
                    <input
                      type="text"
                      placeholder="ej. Barrio Centro, Plaza Arriaga, etc."
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Detalles Adicionales</label>
                    <textarea
                      rows={2}
                      placeholder="ej. Casa con 2 dormitorios, parrillero y fondo..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-98 text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud por WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
