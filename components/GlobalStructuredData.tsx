import { siteConfig } from '@/lib/siteConfig';

export default function GlobalStructuredData() {
    const baseUrl = siteConfig.url;

    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": siteConfig.name,
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Tablouri canvas din fotografiile clienților - un tablou, colaj sau set de 3, cu șasiu de lemn inclus - plus fototapet, textile personalizate, afișe, bannere, panouri rigide și kituri pentru fonduri UE, printate în același atelier și livrate în toată România.",
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

    

  return (
        <>
            <script
                id="global-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([organizationData, localBusinessData, websiteData]),
                }}
            />
        </>
    );
}
