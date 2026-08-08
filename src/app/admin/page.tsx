'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { Property } from '@/types/property';
import { Plus, Edit, Trash2, Eye, Key, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Admin Header Title & CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-[#E85D04] font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Panel de Administración Montaño</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Gestión de Propiedades
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Al publicar una nueva propiedad, el sistema generará **automáticamente el slug, los metadatos OpenGraph y la estructura Schema.org para Google Search Console** respetando exactamente tu redacción original.
            </p>
          </div>

          <Link
            href="/admin/nueva"
            className="bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black px-6 py-3.5 rounded-full shadow-md hover:shadow-orange-500/30 transition-all flex items-center space-x-2 text-xs sm:text-sm flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Publicar Nueva Propiedad</span>
          </Link>
        </div>

        {/* Properties Management Table */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-base">
              Propiedades Publicadas ({properties.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Ref. & Propiedad</th>
                  <th className="py-4 px-4">Operación</th>
                  <th className="py-4 px-4">Categoría</th>
                  <th className="py-4 px-4">Precio</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4 text-center">SEO Auto</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center space-x-3">
                        <span className="bg-[#350A2F] text-amber-300 font-extrabold text-[10px] px-2 py-1 rounded-md">
                          #{prop.codeRef}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prop.title}</p>
                          <p className="text-xs text-slate-400 font-normal">{prop.location.neighborhood}, San José</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold uppercase text-xs">
                      {prop.operation}
                    </td>
                    <td className="py-4 px-4 font-semibold uppercase text-xs">
                      {prop.category}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#5E1754]">
                      {prop.price.currency} ${prop.price.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-bold">
                      <span className="bg-purple-100 text-purple-900 text-[10px] px-2.5 py-1 rounded-full uppercase">
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center justify-center space-x-1 w-fit mx-auto">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Generado</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/propiedad/${prop.slug}`}
                          target="_blank"
                          className="p-2 text-slate-600 hover:text-[#5E1754] hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver Ficha Publicada"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar Propiedad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
