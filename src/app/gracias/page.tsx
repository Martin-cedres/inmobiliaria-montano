import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CheckCircle2, Home, PhoneCall, ArrowLeft } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';

export const metadata: Metadata = {
  title: '¡Muchas Gracias por tu Contacto! | Inmobiliaria Montaño',
  description: 'Hemos recibido tu solicitud de tasación o contacto. Daniel Montaño se comunicará contigo a la brevedad.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasPage() {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Solicitud Recibida con Éxito
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ¡Muchas gracias por comunicarte!
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Hemos recibido tu información. <strong>Daniel Montaño</strong> revisará tu consulta y se pondrá en contacto contigo a la brevedad para brindarte una respuesta personalizada.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">
              ¿Precisás una respuesta urgente o querés coordinar una visita hoy mismo?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chatear directo por WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-[#5E1754] hover:bg-[#350a2f] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              <span>Volver a la Portada</span>
            </Link>

            <Link
              href="/#catalogo"
              className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explorar Propiedades</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
