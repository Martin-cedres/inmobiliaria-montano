'use client';

import React, { useState } from 'react';
import { MarketListing } from '@/types/market';
import {
  X,
  Plus,
  Building2,
  Phone,
  User,
  MapPin,
  DollarSign,
  Globe,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newListing: MarketListing) => void;
}

export function AddOwnerModal({ isOpen, onClose, onSuccess }: AddOwnerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    operation: 'venta' as 'venta' | 'alquiler',
    category: 'casa' as 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito',
    neighborhood: 'Centro',
    priceAmount: '',
    priceCurrency: 'USD' as 'USD' | 'UYU',
    contactName: '',
    contactPhone: '',
    sourceName: 'Cartel en la calle',
    sourceUrl: '',
    internalNotes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Por favor ingresa un título o descripción breve del inmueble.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          operation: formData.operation,
          category: formData.category,
          neighborhood: formData.neighborhood,
          priceAmount: Number(formData.priceAmount) || 0,
          priceCurrency: formData.priceCurrency,
          contactName: formData.contactName.trim() || 'Dueño Particular',
          contactPhone: formData.contactPhone.trim(),
          sourceName: formData.sourceName,
          sourceUrl: formData.sourceUrl.trim(),
          internalNotes: formData.internalNotes.trim(),
          origin: 'dueno_directo',
          status: 'detectado',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.listing) {
        onSuccess(data.data.listing);
        onClose();
      } else {
        setError(data.error || 'Error al guardar el aviso.');
      }
    } catch (err: unknown) {
      console.error('Error al registrar aviso:', err);
      setError('Error de conexión al guardar el aviso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">Cargar Aviso de Dueño Vende</h3>
              <p className="text-xs text-purple-200 font-medium">Registra captaciones de Facebook, calle o Mercado Libre</p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-left">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título o Identificación de la Propiedad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Casa 3 dormitorios con fondo y garaje en Molino"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30 focus:border-[#5E1754]"
            />
          </div>

          {/* Operación y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operación</label>
              <select
                value={formData.operation}
                onChange={(e) => setFormData({ ...formData, operation: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipología</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno / Solar</option>
                <option value="chacra">Chacra / Campo</option>
                <option value="local">Local Comercial</option>
                <option value="deposito">Galpón / Depósito</option>
              </select>
            </div>
          </div>

          {/* Barrio y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5E1754]" />
                  <span>Microzona en San José</span>
                </span>
              </label>
              <select
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="Centro">Centro / Plazas</option>
                <option value="Barrio Molino">Barrio Molino</option>
                <option value="Barrio Arriaga">Barrio Arriaga</option>
                <option value="Parquización Arroyo Mallada">Arroyo Mallada</option>
                <option value="Libertad">Libertad</option>
                <option value="Ciudad del Plata">Ciudad del Plata</option>
                <option value="Playa Pascual">Playa Pascual</option>
                <option value="Kiyú">Kiyú</option>
                <option value="Eje Rutas / Libertad">Eje Rutas / Chacras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>Precio Pretendido</span>
                </span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.priceCurrency}
                  onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value as any })}
                  className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
                >
                  <option value="USD">USD</option>
                  <option value="UYU">UYU ($)</option>
                </select>
                <input
                  type="number"
                  placeholder="Ej. 85000"
                  value={formData.priceAmount}
                  onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
                />
              </div>
            </div>
          </div>

          {/* Contacto: Nombre y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nombre del Dueño</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Gómez (o Particular)"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Teléfono / WhatsApp</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Ej. 099 123 456"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>
          </div>

          {/* Origen y Enlace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fuente / Dónde se detectó</label>
              <select
                value={formData.sourceName}
                onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="Cartel en la calle">Cartel en la calle</option>
                <option value="Facebook Marketplace">Facebook Marketplace</option>
                <option value="Grupo de Facebook San José">Grupo de Facebook San José</option>
                <option value="Mercado Libre">Mercado Libre (Dueño)</option>
                <option value="Gallito Luis">Gallito Luis</option>
                <option value="Dato / Recomendación">Dato / Recomendación de cliente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enlace Web (Opcional)</span>
                </span>
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/marketplace/item/..."
                value={formData.sourceUrl}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>
          </div>

          {/* Notas Internas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Notas Internas para Daniel</span>
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Cartel en la reja. Casa deshabitada. Llamar temprano para ofrecer tasación formal."
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar en Radar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
