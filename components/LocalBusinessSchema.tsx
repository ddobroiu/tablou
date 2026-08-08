import React from "react";
import { siteConfig } from "@/lib/siteConfig";

export default function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#organization`,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "url": siteConfig.url,
        "logo": `${siteConfig.url}/logo.png`,
        "image": `${siteConfig.url}/logo.png`,
        "telephone": siteConfig.phone,
        "email": siteConfig.email,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Strada Principală, nr. 214",
            "addressLocality": "Sat Topliceni, Com. Topliceni",
            "addressRegion": "Buzău",
            "postalCode": "127634",
            "addressCountry": "RO"
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
        ],
        "priceRange": "$$",
        "currenciesAccepted": "RON",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "areaServed": {
            "@type": "Country",
            "name": "Romania"
        },
        "sameAs": [
            "https://www.facebook.com/Tablou.net",
            "https://www.instagram.com/Tablou.net"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicii Tablou",
            "itemListElement": [
                {
                    "@type": "OfferCatalog",
                    "name": "Bannere & Afișe",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Bannere Outdoor",
                                "description": "Bannere PVC personalizate rezistente"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Afișe HD",
                                "description": "Postere HD pe hârtie premium"
                            }
                        }
                    ]
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Decor & Promo",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Tablouri Canvas",
                                "description": "Print pe pânză bumbac pe șasiu lemn"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Autocolante Vinyl",
                                "description": "Autocolante personalizate rezistente la apă"
                            }
                        }
                    ]
                }
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}



