'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE, MONTAÑO_OFFICIAL_EMAIL } from '@/utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola Inmobiliaria Montaño, consulta desde la web:\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Mensaje: ${message}`;
    const waUrl = `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-slate-100/90 border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4 text-left">
            
            {/* Card 1: WhatsApp / Phone */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">WhatsApp & Teléfono Directo</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Respuesta rápida en horario comercial</p>
                <a
                  href={`https://wa.me/${MONTAÑO_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-black text-sm text-[#e85d04] hover:underline"
                >
                  +598 92 776 715
                </a>
              </div>
            </div>

            {/* Card 2: Email */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-purple-50 text-[#5e1754] rounded-xl flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Correo Electrónico</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Envianos tu consulta formal</p>
                <a
                  href={`mailto:${MONTAÑO_OFFICIAL_EMAIL}`}
                  className="inline-block mt-2 font-black text-xs sm:text-sm text-[#5e1754] hover:underline truncate max-w-[240px]"
                >
                  {MONTAÑO_OFFICIAL_EMAIL}
                </a>
              </div>
            </div>

            {/* Card 3: Location & Hours */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Oficina y Cobertura</h4>
                <p className="text-xs text-slate-600 font-semibold mt-1">San José de Mayo, Uruguay</p>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lun a Vie: 09:00 - 18:00 hs</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-md border border-slate-200/90 text-left">
              <h3 className="text-xl font-black text-[#5e1754] mb-1">Enviar Consulta Rápida</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Completá el formulario y te derivamos al instante a WhatsApp.</p>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">¡Mensaje listo para enviar!</h4>
                  <p className="text-xs text-slate-600">
                    Se ha abierto tu aplicación de WhatsApp con la consulta pre-cargada.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#5e1754] underline hover:text-[#e85d04]"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="ej. María Rodríguez"
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
                        placeholder="ej. 099 876 543"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tu Consulta</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Escribí aquí tu duda sobre alguna propiedad, alquiler o servicio..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5e1754]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5e1754] hover:bg-[#350a2f] active:scale-98 text-white font-extrabold py-3.5 rounded-xl shadow transition-all flex items-center justify-center space-x-2 text-sm mt-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Enviar Mensaje por WhatsApp</span>
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
