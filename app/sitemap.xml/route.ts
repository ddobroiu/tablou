import { LOCS_PER_SITEMAP } from "@/lib/seo/sitemapPaging";
import { getDimensionSitemapParts } from "@/lib/seo/dimensionPages";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.net';

export async function GET() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Main sitemap
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/main</loc>\n  </sitemap>\n`;

    // LOCALITĂȚI: fiecare județ, cu TOATE localitățile lui, împărțite în părți
    // de câte LOCS_PER_SITEMAP. Paginile de localitate sunt cele care aduc
    // traficul organic, așa că sunt listate integral (~13.300), nu doar
    // reședințele de județ.
    //
    // Numărul de părți se calculează din aceeași constantă pe care o folosește
    // generatorul, altfel localitățile din coada fiecărui județ n-ar fi servite
    // niciodată.
    for (let i = 0; i < JUDETE_FULL_DATA.length; i++) {
        const parts = Math.max(
            1,
            Math.ceil(JUDETE_FULL_DATA[i].localitati.length / LOCS_PER_SITEMAP)
        );
        for (let p = 0; p < parts; p++) {
            xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/${i}-${p}</loc>\n  </sitemap>\n`;
        }
    }


    // DIMENSIONS SITEMAP — curated realistic size pairs per product (a few hundred URLs total,
    // down from the old ~188,000-combination brute-force grid), fits in a single part.
    // PREȚURI PE CANTITĂȚI: /preturi/{produs}/{format}-{n}-buc (~180 URL-uri)
    xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/preturi</loc>
  </sitemap>
`;

    // DIMENSIUNI: /dimensiuni/{produs}/{L}x{H}, paginat cu aceeași constantă ca
    // generatorul (lib/seo/dimensionPages.ts).
    for (let d = 0; d < getDimensionSitemapParts(); d++) {
        xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/dimensions-${d}</loc>
  </sitemap>
`;
    }

    // SEO CLUSTER SITEMAPS
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/materiale</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/servicii</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/norme</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/stiluri</loc>\n  </sitemap>\n`;

    // RECOMANDAT SITEMAP (product x intent x industry combinations for real configurator products)
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/recomandat-0</loc>\n  </sitemap>\n`;

    // INTENTS SITEMAP (purpose-driven pages like de-vanzare, nunta, etc.)
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/intents-0</loc>\n  </sitemap>\n`;

    xml += `</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
        }
    });
}
