import { countySitemapIds, STANDARD_SIZES_SITEMAP_ID } from "@/lib/seo/localitySitemap";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.net';

export async function GET() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Main sitemap
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/main</loc>\n  </sitemap>\n`;

    // JUDEȚE: câte un sitemap pe județ (pagina județului, localitățile lui și
    // paginile localitate × produs pentru produsele al căror site acasă e acesta),
    // vezi lib/seo/localitySitemap.ts. Vechile /server-sitemap/{n}-{m} răspund 410.
    for (const id of countySitemapIds()) {
        xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/${id}</loc>
  </sitemap>
`;
    }

    // Județ × dimensiune: noindex,follow (aproape identice cu pagina de dimensiune), deci nu mai sunt în sitemap.

    // COMPARAȚII de materiale (lib/seo/comparisons.ts)
    xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/comparatii</loc>
  </sitemap>
`;

    // PREȚURI PE CANTITĂȚI: /preturi/{produs}/{format}-{n}-buc (~180 URL-uri)
    xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/preturi</loc>
  </sitemap>
`;

    // DIMENSIUNI STANDARD: doar mărimile standard ale produselor acasă (lib/seo/standardSizes.ts);
    // restul grilei de dimensiuni e noindex,follow și nu intră în sitemap.
    xml += `  <sitemap>
    <loc>${BASE_URL}/server-sitemap/${STANDARD_SIZES_SITEMAP_ID}</loc>
  </sitemap>
`;

    // NEW SEO CLUSTERS SITEMAPS
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/materiale</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/servicii</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/norme</loc>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/stiluri</loc>\n  </sitemap>\n`;

    // RECOMANDAT SITEMAP (product x intent / industry, restricted to realistic
    // pairings - see server-sitemap/[id]/route.ts). Fits in a single part now.
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/recomandat-0</loc>\n  </sitemap>\n`;

    // INTENTS SITEMAP (Purpose-driven pages like de-vanzare, nunta, etc.) - already
    // a small curated list (PRODUCT_INTENTS), fits in a single part.
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/intents-0</loc>\n  </sitemap>\n`;

    xml += `</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
        }
    });
}
