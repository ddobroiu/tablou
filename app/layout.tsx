import "./globals.css";
import Script from "next/script";
import Providers from "../components/Providers";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import GlobalStructuredData from "../components/GlobalStructuredData";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import DynamicStylesLoader from "../components/DynamicStylesLoader";

export const metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.tablou.net").replace(/\/$/, "")
  ),
  title: {
    default: "Tablou.net | Tablouri Canvas & Plexiglas Personalizate",
    template: "%s | Tablou.net",
  },
  description:
    "Tablou.net - Creează tablouri canvas și plexiglas de înaltă calitate. Incarcă fotografia ta, alege dimensiunea și primești acasă un produs premium gata de expus.",
  keywords: [
    "tablouri canvas",
    "tablouri personalizate",
    "print plexiglas",
    "tablouri acrilic",
    "tablou canvas pret",
    "tablou foto",
    "decoratiuni perete",
    "configurator tablouri"
  ],
  openGraph: {
    title: "Tablou.net | Tablouri Canvas & Plexiglas Personalizate",
    description:
      "Transformă fotografiile tale în artă. Tablouri canvas și plexiglas la orice dimensiune cu livrare rapidă.",
    url: "/",
    siteName: "Tablou.net",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tablou.net - Tablouri Personalizate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tablou.net | Tablouri Canvas & Plexiglas Personalizate",
    description:
      "Configurează-ți tabloul online și obține prețul instant. Calitate premium.",
    images: ["/logo.png"],
    creator: "@tablounet",
    site: "@tablounet",
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
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PLT45BL6');`}
        </Script>
        {/* End Google Tag Manager */}
        <link rel="icon" href="/simbol.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/simbol.jpg" />

        <GlobalStructuredData />
        <LocalBusinessSchema />

        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* DNS Prefetch și Preconnect pentru servicii externe */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>

      <body className="bg-white text-slate-900 antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PLT45BL6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <DynamicStylesLoader />
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
