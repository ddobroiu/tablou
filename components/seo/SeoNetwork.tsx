import React from 'react';

const NETWORK_SITES = [
    { domain: 'shopprint.ro', name: 'ShopPrint', title: 'Tipografie Digitală' },
    { domain: 'euprint.ro', name: 'EuPrint', title: 'Fonduri Europene' },
    { domain: 'adbanner.ro', name: 'AdBanner', title: 'Bannere & Mesh-uri' },
    { domain: 'prynt.ro', name: 'Prynt', title: 'Print și Personalizare' },
    { domain: 'visionboard.ro', name: 'VisionBoard', title: 'Decor & Motivație' },
    { domain: 'tablou.net', name: 'Tablou.net', title: 'Tablouri Canvas' }
];

export default function SeoNetwork({ judetSlug, judetName, locSlug, locName, currentDomain }: { judetSlug: string, judetName: string, locSlug: string, locName: string, currentDomain: string }) {
    const otherSites = NETWORK_SITES.filter(s => s.domain !== currentDomain);

    return (
        <div className="container mx-auto px-4 sm:px-6 mt-16 border-t border-slate-200 pt-16 mb-16">
            <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Ecosistemul nostru în {locName} ({judetName})</h3>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Suntem prezenți cu servicii specializate de top direct în localitatea ta. Descoperă expertiza noastră pe platformele dedicate:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 justify-center">
                {otherSites.map(site => (
                    <a
                        key={site.domain}
                        href={`https://${site.domain}/judet/${judetSlug}/${locSlug}`}
                        target="_blank" // Nu se pierde relevanta SEO prin href, transfera autoritatea (Fara "nofollow")
                        className="bg-white border-2 border-slate-100 hover:border-orange-500 p-4 rounded-2xl flex flex-col items-center hover:shadow-xl transition-all group"
                        title={`${site.title} în ${locName}`}
                    >
                        <span className="font-black text-slate-900 text-base mb-1 group-hover:text-orange-600 transition-colors">{site.name}</span>
                        <span className="text-xs font-medium text-slate-500 text-center">{site.title} <br className="hidden lg:block"/> {locName}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
