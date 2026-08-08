import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmobiliaria-montano.vercel.app';

export const metadata: Metadata = {
  title: "Inmobiliaria Montaño — San José de Mayo | Casas, Alquileres & Tasaciones",
  description: "Compromiso real, eficiencia comprobada. Tu portal inmobiliario de referencia en San José de Mayo. Ventas, alquileres, chacras y solicitudes de tasación.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Inmobiliaria Montaño — San José de Mayo",
    description: "Compromiso real, eficiencia comprobada. Casas en venta, alquileres, chacras y tasaciones en San José.",
    url: BASE_URL,
    siteName: "Inmobiliaria Montaño",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Inmobiliaria Montaño Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria Montaño — San José de Mayo",
    description: "Compromiso real, eficiencia comprobada. Casas en venta, alquileres y tasaciones en San José.",
    images: [`${BASE_URL}/og-logo.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
