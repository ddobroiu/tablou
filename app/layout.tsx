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
    default: "Tablou.net - Tablouri Canvas din Poza Ta",
    template: "%s | Tablou.net",
  },
  description:
    "Tablouri canvas din fotografiile tale: un tablou, colaj sau set de 3, cu șasiu de lemn inclus și poza verificată gratuit. Același atelier printează fototapet, tricouri, afișe, bannere și panouri rigide. Livrare în toată România.",
  keywords: [
    "tablou canvas",
    "tablou din poza",
    "tablouri canvas personalizate",
    "colaj foto canvas",
    "set 3 tablouri",
    "canvas nunta",
    "canvas botez",
    "fototapet personalizat",
    "cadou personalizat foto",
    "tablou.net"
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
    title: "Tablou.net | Tablouri canvas din poza ta",
    description:
      "Încarci poza, alegi formatul, vezi prețul pe loc. Tabloul vine gata de agățat, cu șasiu de lemn inclus, în 2-4 zile.",
    url: "https://www.tablou.net",
    siteName: "Tablou.net",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tablou.net - Tablouri canvas personalizate din fotografiile tale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tablou.net | Tablouri canvas din poza ta",
    description: "Tablouri canvas, colaje și seturi de 3 din fotografiile tale, cu șasiu de lemn inclus. Livrare în toată România.",
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
        {/* Consent Mode v2 — trebuie să ruleze înainte de gtag.js, de aceea stă
            aici în <head>-ul layout-ului rădăcină. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
              try {
                if (localStorage.getItem('cookie_consent') === 'granted') {
                  gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                  });
                }
              } catch (e) {}
            `,
          }}
        />
        {/* GA4 property "Tablou.net", în contul Culoarea din Viata SA SRL.
            Site-ul nu avea deloc măsurare până acum. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NZ9X76TF43" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-NZ9X76TF43');
            `,
          }}
        />
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
