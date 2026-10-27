'use client';

import React, { useState } from 'react';
import { MarketListing, MarketListingStatus } from '@/types/market';
import { buildUruguayWhatsAppUrl } from '@/lib/whatsapp';
import { ContactWhatsAppModal } from '@/components/admin/market/ContactWhatsAppModal';
import {
  ExternalLink,
  Phone,
  MessageCircle,
  FileText,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
} from 'lucide-react';

interface CaptacionRadarTableProps {
  listings: MarketListing[];
  onStatusChange: (
    id: string,
    newStatus: MarketListingStatus,
    extra?: { contactPhone?: string; contactName?: string }
  ) => Promise<void>;
  onSaveNotes?: (id: string, notes: string) => Promise<void>;
}

const STATUS_LABELS: Record<MarketListingStatus, { label: string; colorClass: string }> = {
  detectado: {
    label: 'Detectado',
    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  en_analisis: {
    label: 'En análisis',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  contactado: {
    label: 'Contactado',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  reunion_agendada: {
    label: 'Reunión agendada',
    colorClass: 'bg-purple-50 text-[#5E1754] border-purple-200 font-bold',
  },
  captado: {
    label: 'Captado',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
  },
  descartado: {
    label: 'Descartado',
    colorClass: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function CaptacionRadarTable({
  listings,
  onStatusChange,
  onSaveNotes,
}: CaptacionRadarTableProps) {
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [whatsappModalListing, setWhatsappModalListing] = useState<MarketListing | null>(null);

  const handleOpenNotes = (listing: MarketListing) => {
    setActiveNotesId(listing.id);
    setNotesDraft(listing.internalNotes || '');
  };

  const handleSaveNotes = async (id: string) => {
    if (onSaveNotes) {
      await onSaveNotes(id, notesDraft);
    }
    setActiveNotesId(null);
  };

  const handleStatusSelect = async (id: string, status: MarketListingStatus) => {
    setIsUpdatingStatus(id);
    try {
      await onStatusChange(id, status);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <p className="font-bold text-sm">No se encontraron avisos que coincidan con los filtros seleccionados.</p>
        <p className="text-xs text-slate-400 mt-1">Ajuste los criterios de búsqueda para visualizar avisos del radar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Nota breve y sutil sobre teléfonos en Mercado Libre */}
      <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900">
        <span className="font-black text-amber-800">💡 Tip Mercado Libre:</span>
        <span className="text-amber-800/90">
          Si el aviso no muestra el celular automáticamente, tocá <strong>Ver Aviso</strong>, hacé clic en <em>&quot;Ver teléfono&quot;</em> en ML y pegalo en <strong>+ Tel / WA</strong> para guardarlo.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[850px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-4">Aviso & Ubicación</th>
              <th scope="col" className="py-3 px-3">Origen & Fuente</th>
              <th scope="col" className="py-3 px-3">Precio & Valor/m²</th>
              <th scope="col" className="py-3 px-3">Antigüedad</th>
              <th scope="col" className="py-3 px-3">Estado de Gestión</th>
              <th scope="col" className="py-3 px-4 text-right">Contacto & Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {listings.map((item) => {
              const isOwner = item.origin === 'dueno_directo';
              const formattedPrice = item.priceCurrency === 'USD'
                ? `USD ${item.priceAmount.toLocaleString('es-UY')}`
                : `$ ${item.priceAmount.toLocaleString('es-UY')}`;

              const currentStatusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.detectado;

              return (
                <tr key={item.id} className="hover:bg-purple-50/20 transition-colors">
                  {/* Col 1: Aviso & Ubicación (limpio, sin repetir enlaces) */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-slate-900 hover:text-[#5E1754] hover:underline line-clamp-1 inline-flex items-center gap-1 transition-colors"
                            title={`Abrir publicación original: ${item.title}`}
                          >
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <span className="font-bold text-slate-900 line-clamp-1" title={item.title}>
                            {item.title}
                          </span>
                        )}
                        {item.isOpportunity && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#5E1754] bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                            <Sparkles className="w-2.5 h-2.5 text-[#E85D04]" />
                            Oportunidad
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{item.neighborhood}</span>
                        <span>·</span>
                        <span className="capitalize">{item.category}</span>
                        <span>·</span>
                        <span className="uppercase font-bold text-[#5E1754]">{item.operation}</span>
                      </div>
                      {item.opportunityReason && (
                        <p className="text-[10px] text-slate-500 italic line-clamp-1">
                          {item.opportunityReason}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Col 2: Origen & Fuente */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                        <UserCheck className="w-3 h-3 text-[#E85D04]" />
                        {item.contactName && item.contactName !== 'Dueño Particular'
                          ? item.contactName
                          : 'Dueño Directo'}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Portal: <strong className="text-slate-600">{item.sourceName}</strong>
                      </div>
                      {item.contactPhone ? (
                        <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 tabular-nums">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{item.contactPhone}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-amber-700 font-medium">
                          <span>Tel. en aviso</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Col 3: Precio & Valor/m² */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-black text-[#5E1754] tabular-nums">
                        {formattedPrice}
                      </div>
                      {item.estimatedPricePerM2 ? (
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          ~USD {Math.round(item.estimatedPricePerM2)} / m²
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">
                          {item.builtAreaM2 ? `${item.builtAreaM2} m² edif.` : 'Sup. no esp.'}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Col 4: Antigüedad */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-600 text-[11px] tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.daysOnMarket} {item.daysOnMarket === 1 ? 'día' : 'días'}</span>
                    </div>
                  </td>

                  {/* Col 5: Selector de Estado de Gestión */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="relative inline-block text-left">
                      <select
                        value={item.status}
                        disabled={isUpdatingStatus === item.id}
                        onChange={(e) => handleStatusSelect(item.id, e.target.value as MarketListingStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5E1754]/40 cursor-pointer ${currentStatusInfo.colorClass}`}
                      >
                        <option value="detectado">Detectado</option>
                        <option value="en_analisis">En análisis</option>
                        <option value="contactado">Contactado</option>
                        <option value="reunion_agendada">Reunión agendada</option>
                        <option value="captado">Captado</option>
                        <option value="descartado">Descartado</option>
                      </select>
                    </div>
                  </td>

                  {/* Col 6: Contacto & Acciones */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Botón WhatsApp / Llamada (siempre disponible para enviar o pegar teléfono) */}
                      <button
                        type="button"
                        onClick={() => setWhatsappModalListing(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs transition-all cursor-pointer ${
                          item.contactPhone
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                        title={
                          item.contactPhone
                            ? `Contactar por WhatsApp a ${item.contactName || 'propietario'} (${item.contactPhone})`
                            : 'Pegar teléfono del aviso y abrir WhatsApp'
                        }
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{item.contactPhone ? 'WhatsApp' : '+ Tel / WA'}</span>
                      </button>

                      {/* Botón Ver Aviso Original */}
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                          title={`Verificar publicación original: ${item.sourceUrl}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver Aviso</span>
                        </a>
                      )}

                      {/* Botón Notas Internas */}
                      <button
                        type="button"
                        onClick={() => handleOpenNotes(item)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          item.internalNotes
                            ? 'text-[#5E1754] bg-purple-100 hover:bg-purple-200'
                            : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                        }`}
                        title={item.internalNotes ? `Notas: ${item.internalNotes}` : 'Agregar notas de gestión'}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal / Diálogo de Notas Internas */}
      {activeNotesId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900">
              Notas Internas de Gestión
            </h3>
            <p className="text-xs text-slate-500">
              Anotaciones de peritaje, acuerdos o bitácora de contacto para este aviso.
            </p>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Escribí notas sobre la conversación, títulos o condición de captación..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveNotesId(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotes(activeNotesId)}
                className="px-4 py-1.5 text-xs font-bold bg-[#5E1754] hover:bg-[#7A1E6E] text-white rounded-xl shadow-xs cursor-pointer"
              >
                Guardar Notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1-Clic de Contacto por WhatsApp con Plantillas */}
      <ContactWhatsAppModal
        listing={whatsappModalListing}
        isOpen={Boolean(whatsappModalListing)}
        onClose={() => setWhatsappModalListing(null)}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
