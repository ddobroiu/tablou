"use client";
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/siteConfig';

export default function GlobalStructuredData() {
  const pathname = usePathname() || '';

    const baseUrl = siteConfig.url;

    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": siteConfig.name,
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Tipografie digitală și producție publicitară online - bannere, afișe, canvas, autocolante și materiale rigide.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RO",
            "addressLocality": "Topliceni",
            "addressRegion": "Buzău",
            "streetAddress": "nr. 214",
            "postalCode": "127634"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": `+40${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '')}`,
            "contactType": "customer service",
            "email": siteConfig.email,
            "availableLanguage": "Romanian"
        },
        "sameAs": siteConfig.socialLinks.map(l => l.href)
    };

    const localBusinessData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "image": `${baseUrl}/tablou.webp`,
        "telephone": `+40${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '')}`,
        "email": siteConfig.email,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RO",
            "addressLocality": "Topliceni",
            "addressRegion": "Buzău",
            "streetAddress": "nr. 214",
            "postalCode": "127634"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "45.4190",
            "longitude": "26.9667"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ]
    };

    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "name": siteConfig.name,
        "url": baseUrl,
        "publisher": { "@id": `${baseUrl}/#organization` },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    
  let faqData = null;
  if (pathname.length > 2) {
    const slugParts = pathname.split('/').filter(Boolean);
    const lastSlug = slugParts[slugParts.length - 1];
    
    faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Care este timpul de execuție pentru ${lastSlug}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Executăm comenzile în 24-48 de ore lucrătoare de la confirmarea graficii, utilizând echipamente HP Latex / UV de ultimă generație."
            }
          },
          {
             "@type": "Question",
             "name": `Livrati si in afara localitatii pentru comenzi online?`,
             "acceptedAnswer": {
               "@type": "Answer",
               "text": "Da, livram national (inclusiv Bucuresti, Cluj, Timisoara, Iasi etc.) prin curier rapid direct din productie."
             }
          }
        ]
    };
  }

  return (
        <>
            <Script
                id="global-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([organizationData, localBusinessData, websiteData]),
                }}
            />
      {faqData && (
        <Script
          id="dynamic-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      )}
        </>
    );
}
