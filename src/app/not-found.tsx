import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Building2, Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#5E1754]/10 text-[#5E1754] rounded-2xl flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 text-[#E85D04]" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
              Error 404
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Página no encontrada
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              La dirección que buscas no existe o ha sido trasladada a una nueva ubicación en nuestro catálogo oficial.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#5E1754] hover:bg-[#350A2F] text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
            >
              <Home className="w-4 h-4 text-amber-300" />
              <span>Volver a la Portada</span>
            </Link>
            <Link
              href="/propiedades-san-jose"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all border border-slate-300 active:scale-95"
            >
              <Building2 className="w-4 h-4 text-[#5E1754]" />
              <span>Ver Catálogo Completo</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
