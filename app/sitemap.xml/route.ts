import { JUDETE_FULL_DATA } from "@/lib/localitati";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.net';

export async function GET() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Main sitemap
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/main</loc>\n  </sitemap>\n`;

    // JUDET/LOCALITY SITEMAPS — one part per județ, restricted server-side to the județ's
    // reședință (county seat) and the real configurator product list. See
    // app/server-sitemap/[id]/route.ts for the curation logic.
    for (let i = 0; i < JUDETE_FULL_DATA.length; i++) {
        xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/${i}-0</loc>\n  </sitemap>\n`;
    }

    // DIMENSIONS SITEMAP — curated realistic size pairs per product (a few hundred URLs total,
    // down from the old ~188,000-combination brute-force grid), fits in a single part.
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/dimensions-0</loc>\n  </sitemap>\n`;

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
