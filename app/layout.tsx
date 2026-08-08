import { Metadata } from "next";
import { Inter, Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import GlobalStructuredData from "../components/GlobalStructuredData";
import Header from "../components/Navbar"; // Use Navbar as Header
import Footer from "../components/Footer";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import ContactButton from "../components/ContactButton";
import CookieConsent from "../components/CookieConsent";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tablou.net"),
  title: {
    default: "Tablou.net - Tipar Digital & Producție Publicitară",
    template: "%s | Tablou",
  },
  description:
    "Comenzi de materiale publicitare la calitate inalta. Experienta in executia de print digital de lux. Livrare rapidă în toată țara.",
  keywords: [
    "tipar digital",
    "bannere publicitare",
    "afișe personalizate",
    "canvas pe pânză",
    "autocolante vinyl",
    "materiale rigide",
    "publicitate outdoor",
    "print online România",
    "tablou"
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/simbol.png',
    shortcut: '/simbol.png',
    apple: '/simbol.png',
  },
  verification: {
    google: 'FPQT6X0QSD',
  },
  openGraph: {
    title: "Tablou.net | Tipar Digital & Producție Publicitară",
    description:
      "Tipar digital profesional: bannere, afișe, canvas și autocolante. Configuratoare online cu prețuri instant.",
    url: "https://www.tablou.net",
    siteName: "Tablou.net",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tablou.net - Tipar Digital Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tablou.net | Print Digital Online",
    description: "Bannere, canvas și semnalistică cu personalizare rapidă.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" data-theme="light">
      <head>
        <link rel="icon" href="/simbol.png" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>

      <body className={`${inter.variable} ${outfit.variable} ${fraunces.variable} bg-white text-slate-900 antialiased font-sans selection:bg-emerald-500 selection:text-white relative`}>
        <CookieConsent />
        <Providers>
          <Header />
          <main className="w-full overflow-x-hidden">
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </main>
          <Footer />
          <GlobalStructuredData />
          <ContactButton />
        </Providers>
      </body>
    </html>
  );
}
