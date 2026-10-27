'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MarketListing, MarketListingStatus } from '@/types/market';
import { buildUruguayWhatsAppUrl, detectCompetitorSignatures } from '@/lib/whatsapp';
import {
  X,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Send,
  User,
  Phone,
  ExternalLink,
} from 'lucide-react';

interface ContactWhatsAppModalProps {
  listing: MarketListing | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (
    id: string,
    newStatus: MarketListingStatus,
    extra?: { contactPhone?: string; contactName?: string }
  ) => Promise<void>;
}

function isGenericOwnerLabel(name?: string): boolean {
  if (!name) return true;
  const normalized = name.trim().toLowerCase();
  if (!normalized) return true;
  return /dueño|dueno|propietario|particular|anunciante|vendedor|directo|usuario|sin nombre/i.test(
    normalized
  );
}

export function ContactWhatsAppModal({
  listing,
  isOpen,
  onClose,
  onStatusChange,
}: ContactWhatsAppModalProps) {
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [ownerNameInput, setOwnerNameInput] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('honest_no_exclusivity');
  const [customMessage, setCustomMessage] = useState<string>('');

  useEffect(() => {
    if (listing) {
      setPhoneInput(listing.contactPhone || '');
      const cleanName =
        listing.contactName && !isGenericOwnerLabel(listing.contactName)
          ? listing.contactName.trim()
          : '';
      setOwnerNameInput(cleanName);
    }
  }, [listing]);

  const templates = useMemo(() => {
    if (!listing) return [];
    const cleanName = ownerNameInput.trim();
    const greetingName = cleanName && !isGenericOwnerLabel(cleanName) ? ` ${cleanName}` : '';
    const zone = listing.neighborhood || 'San José';
    const isRental = listing.operation === 'alquiler';
    const opText = isRental ? 'en alquiler' : 'a la venta';
    const opAction = isRental ? 'alquilarla' : 'venderla';

    return [
      {
        id: 'honest_no_exclusivity',
        title: '🤝 Propuesta Completa Sin Exclusividad (Recomendada)',
        desc: 'Cero humo: ofrece publicidad en web/redes + cartera de clientes, sin exclusividad y con link a tu web.',
        text: `Hola${greetingName}, ¿cómo estás? Te escribe Daniel Montaño, de Inmobiliaria Montaño. Vi tu publicación de la propiedad ${opText} en ${zone}. Sé que la estás ofreciendo de forma particular y me parece excelente; te escribo con total transparencia para consultarte si estarías abierto a que también la trabajemos desde nuestra inmobiliaria, sin exclusividad ni costo previo (vos seguís libre de ${opAction} por tu cuenta). Nuestro trabajo incluye publicidad en nuestra web y redes sociales, además de ofrecerla a nuestra cartera de clientes. ¿Te gustaría que conversemos unos minutos sin compromiso?\n\nTe dejo nuestra web para que nos conozcas: https://www.inmobiliariamontano.uy`,
      },
      {
        id: 'value_filter_support',
        title: '🛡️ Alivio de Gestión + Publicidad y Cartera',
        desc: 'Destaca publicidad en web/redes, cartera de clientes y filtro de consultas/trámites bancarios o garantías.',
        text: `Hola${greetingName}, ¿cómo estás? Te saluda Daniel Montaño de Inmobiliaria Montaño. Vi tu propiedad publicada ${opText} en ${zone}. Te contacto porque a muchos propietarios de San José que publican directo les resulta útil apoyarse en nosotros para sumar publicidad en nuestra web y redes sociales, ofrecerla a nuestra cartera de clientes, filtrar consultas y resolver ${isRental ? 'garantías de alquiler (ANDA, Contaduría, Aseguradoras)' : 'toda la parte de escribanía y préstamos bancarios (BHU/bancos)'}, manteniendo siempre la libertad de seguir ofreciéndola por tu cuenta. ¿Te gustaría que conversemos unos minutos sin compromiso? Saludos.\n\n🌐 https://www.inmobiliariamontano.uy`,
      },
      {
        id: 'short_icebreaker',
        title: '💬 Rompehielo Corto (Baja Fricción)',
        desc: 'Mensaje breve y directo con propuesta de difusión en web, redes y cartera sin exclusividad.',
        text: `Hola${greetingName}, buenas tardes. Soy Daniel Montaño, de Inmobiliaria Montaño (San José). Vi tu aviso de la propiedad ${opText} en ${zone} y quería consultarte si sigue disponible y si te interesaría que le sumemos publicidad en nuestra web, redes sociales y cartera de clientes de forma abierta (sin exclusividad). ¡Muchas gracias y saludos!\n\nhttps://www.inmobiliariamontano.uy`,
      },
    ];
  }, [listing, ownerNameInput]);

  useEffect(() => {
    if (templates.length > 0) {
      const currentTpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];
      setCustomMessage(currentTpl.text);
    }
  }, [templates, selectedTemplateId]);

  const competitorCheck = useMemo(() => {
    if (!listing) return { isSuspect: false, reason: undefined };
    const isTaggedCompetitor = listing.origin === 'inmobiliaria_competencia';
    const sigCheck = detectCompetitorSignatures({
      phone: phoneInput,
      title: listing.title,
      contactName: ownerNameInput,
    });

    return {
      isSuspect: isTaggedCompetitor || sigCheck.isCompetitor,
      reason: isTaggedCompetitor
        ? `Registrado bajo inmobiliaria/colega: ${listing.competitorName || 'Competencia'}`
        : sigCheck.reason,
    };
  }, [listing, phoneInput, ownerNameInput]);

  if (!isOpen || !listing) return null;

  const handleSelectTemplate = (id: string, text: string) => {
    setSelectedTemplateId(id);
    setCustomMessage(text);
  };

  const handleSendWhatsApp = async () => {
    const cleanPhone = phoneInput.trim();
    if (!cleanPhone) return;

    const waUrl = buildUruguayWhatsAppUrl(cleanPhone, customMessage);
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    const nextStatus: MarketListingStatus =
      listing.status === 'detectado' || listing.status === 'en_analisis'
        ? 'contactado'
        : listing.status;

    try {
      await onStatusChange(listing.id, nextStatus, {
        contactPhone: cleanPhone,
        contactName: ownerNameInput.trim() || 'Dueño Particular',
      });
    } catch (err) {
      console.error('Error al actualizar estado tras contacto:', err);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                <span>Contactar Propietario por WhatsApp</span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Captación en 1-clic con plantillas y escudo anti-competencia
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Alerta Anti-Competencia */}
          {competitorCheck.isSuspect && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 block">
                  ⚠️ Atención: Posible Inmobiliaria o Colega
                </span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  {competitorCheck.reason}. Verificá el aviso antes de enviar el mensaje.
                </p>
              </div>
            </div>
          )}

          {/* Ficha Resumen del Inmueble + Botón de Verificación Manual */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs space-y-2.5">
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span className="font-semibold text-slate-700">
                {listing.neighborhood} · {listing.sourceName}
              </span>
              <span className="uppercase font-bold text-[#5E1754] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {listing.operation}
              </span>
            </div>
            <p className="font-bold text-slate-900 line-clamp-1">{listing.title}</p>

            {/* Enlace destacado para verificar la publicación antes de enviar */}
            {listing.sourceUrl && (
              <div className="pt-0.5">
                <a
                  href={listing.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-bold text-[11px] transition-colors"
                >
                  <span className="truncate">
                    🔍 Verificar publicación original en {listing.sourceName} ({listing.sourceUrl})
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                </a>
              </div>
            )}

            {/* Campos editables de Nombre y Teléfono (por si el aviso de ML tenía el tel oculto) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Nombre del Dueño
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ownerNameInput}
                    onChange={(e) => setOwnerNameInput(e.target.value)}
                    placeholder="Ej. Jorge / Propietario"
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Celular / WhatsApp (Uruguay)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Pegar tel: 099 123 456"
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Plantilla */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Elegir Estrategia de Mensaje:
            </label>
            <div className="space-y-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id, tpl.text)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedTemplateId === tpl.id
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{tpl.title}</span>
                    {selectedTemplateId === tpl.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vista Previa y Edición del Texto */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                Texto a enviar por WhatsApp:
              </label>
              <span className="text-[10px] text-slate-400">Editable antes de abrir</span>
            </div>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 leading-relaxed"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={!phoneInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir en WhatsApp & Marcar Contactado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
