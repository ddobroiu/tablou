import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { getProducts } from "@/lib/products";

const BASE_URL = 'https://tablou.net';

export const dynamic = 'force-dynamic';

export async function GET() {
    const products = await getProducts();
    const validProducts = products.filter((p: any) => !p.id?.startsWith("fallback-"));
    const seoProductsCount = validProducts.filter((p: any) => p.metadata?.isSeoCampaign || p.id?.startsWith('seo-')).length;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Main sitemap entry
    xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/main</loc>\n  </sitemap>\n`;

    const URLS_PER_LOC = seoProductsCount + 1; // Products + Locality index
    const LOCS_PER_SITEMAP = Math.floor(45000 / URLS_PER_LOC);

    for (let i = 0; i < JUDETE_FULL_DATA.length; i++) {
        const judet = JUDETE_FULL_DATA[i];
        const parts = Math.ceil(judet.localitati.length / LOCS_PER_SITEMAP);

        for (let p = 0; p < parts; p++) {
            xml += `  <sitemap>\n    <loc>${BASE_URL}/server-sitemap/${i}-${p}</loc>\n  </sitemap>\n`;
        }
    }

    xml += `</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
        }
    });
}
