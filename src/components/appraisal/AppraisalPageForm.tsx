'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Calculator, ArrowRight } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE } from '@/utils/whatsapp';

export function AppraisalPageForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('casa');
  const [operationType, setOperationType] = useState('venta');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `Hola Daniel Montaño, solicito tasación profesional para mi propiedad en San José:\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Tipo de Inmueble: ${propertyType}\n- Intención: ${operationType === 'venta' ? 'Venta' : operationType === 'alquiler' ? 'Alquiler' : 'Tasación informativa'}${neighborhood ? `\n- Barrio / Zona: ${neighborhood}` : ''}${notes ? `\n- Detalles adicionales: ${notes}` : ''}`;

    const waUrl = `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-black text-slate-900">¡Solicitud Enviada a WhatsApp!</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Daniel Montaño se pondrá en contacto contigo a la brevedad para coordinar la visita y realizar el peritaje de tu propiedad.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-bold text-[#5E1754] underline hover:text-[#E85D04] cursor-pointer"
        >
          Enviar otra solicitud de tasación
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md max-w-2xl mx-auto">
      <div className="space-y-2 text-center mb-6">
        <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Formulario de Tasación</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Completá los datos de tu inmueble
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Sin compromiso ni costo inicial. Te respondemos en menos de 24 horas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Tu Nombre y Apellido
            </label>
            <input
              type="text"
              required
              placeholder="ej. Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              required
              placeholder="ej. 099 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Tipo de Inmueble
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900 cursor-pointer"
            >
              <option value="casa">🏡 Casa Urbana</option>
              <option value="apartamento">🏢 Apartamento</option>
              <option value="terreno">📐 Terreno / Solar</option>
              <option value="chacra">🌾 Chacra / Fracción de Campo</option>
              <option value="local">🏪 Local Comercial</option>
              <option value="deposito">📦 Galpón / Depósito</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Finalidad Principal
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900 cursor-pointer"
            >
              <option value="venta">Quiero vender mi propiedad</option>
              <option value="alquiler">Quiero poner en alquiler</option>
              <option value="tasacion">Solo consultar valor de mercado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Barrio, Zona o Ubicación en San José
          </label>
          <input
            type="text"
            placeholder="ej. Barrio Prado, Centro, Arroyo Mallada, Ruta 3..."
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Detalles Relevantes (Metros, Dormitorios, Estado, etc.)
          </label>
          <textarea
            rows={3}
            placeholder="ej. Casa de 3 dormitorios con fondo, parrillero y garaje. Títulos al día."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754] text-slate-900 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
        >
          <span>Solicitar Tasación por WhatsApp</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
