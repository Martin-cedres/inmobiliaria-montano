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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export const metadata: Metadata = {
  title: {
    default: "Inmobiliaria Montaño — San José de Mayo | Casas, Alquileres & Tasaciones",
    template: "%s | Inmobiliaria Montaño — San José de Mayo",
  },
  description:
    "Portal inmobiliario de referencia en San José de Mayo, Uruguay. Venta de casas, alquileres garantizados, terrenos, chacras y tasaciones oficiales con Daniel Montaño.",
  keywords: [
    "inmobiliaria san jose de mayo",
    "inmobiliarias en san jose",
    "inmobiliaria san jose uruguay",
    "inmobiliaria montaño",
    "daniel montaño inmobiliaria",
    "casas en venta san jose de mayo",
    "alquileres san jose de mayo",
    "alquiler de casas san jose uruguay",
    "terrenos en venta san jose",
    "chacras en venta san jose",
    "tasaciones san jose de mayo",
    "tasar casa san jose",
    "casas aptas para banco san jose",
    "propiedades en arroyo mallada",
    "inmobiliaria san jose de mayo telefono",
  ],
  authors: [{ name: "Daniel Montaño", url: BASE_URL }],
  creator: "Inmobiliaria Montaño",
  publisher: "Inmobiliaria Montaño",
  category: "real estate",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Inmobiliaria Montaño — San José de Mayo",
    description:
      "Venta de casas, alquileres garantizados, terrenos, chacras y tasaciones profesionales en San José de Mayo. Atención personalizada con Daniel Montaño.",
    url: BASE_URL,
    siteName: "Inmobiliaria Montaño",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Inmobiliaria Montaño — San José de Mayo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria Montaño — San José de Mayo",
    description:
      "Venta de casas, alquileres garantizados, terrenos, chacras y tasaciones profesionales en San José de Mayo.",
    images: [`${BASE_URL}/og-logo.png`],
  },
  other: {
    'geo.region': 'UY-SJ',
    'geo.placename': 'San José de Mayo, San José, Uruguay',
    'geo.position': '-34.3375;-56.7136',
    'ICBM': '-34.3375, -56.7136',
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
