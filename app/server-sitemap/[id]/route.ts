import { getProducts } from '@/lib/products';
import { JUDETE_FULL_DATA } from '@/lib/localitati';
import { listAllLandingRoutes } from '@/lib/landingData';
import { getAllBlogSlugs, getPostBySlug } from '@/lib/blogPosts';

const BASE_URL = 'https://tablou.net';

function generateUrlNode(url: string, priority: string, changefreq: string) {
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}
export const dynamic = 'force-dynamic';

export async function GET(request: Request, props: any) {
    const params = await (props.params instanceof Promise ? props.params : props.params);
    const id = params?.id;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const products = await getProducts();
    const validProducts = products.filter((p: any) => !p.id?.startsWith("fallback-"));
    const seoProducts = validProducts.filter((p: any) => p.metadata?.isSeoCampaign || p.id?.startsWith('seo-'));

    if (id === 'main') {
        const staticRoutes = [
            '', '/contact', '/termeni', '/confidentialitate', '/politica-cookies',
            '/shop', '/afise', '/canvas', '/sticla-acrilica', '/blog', '/judet',
            '/editor', '/despre-noi', '/ghid-dimensiuni', '/instructiuni-calitate', '/urmareste-comanda',
        ];

        for (const route of staticRoutes) {
            xml += generateUrlNode(`${BASE_URL}${route}`, route === '' ? '1.0' : '0.8', route === '' ? 'daily' : 'weekly');
        }

        // Blog
        const allBlogSlugs = getAllBlogSlugs();
        for (const slug of allBlogSlugs) {
            xml += generateUrlNode(`${BASE_URL}/blog/${slug}`, '0.7', 'weekly');
        }

        // Landing Pages
        for (const route of listAllLandingRoutes()) {
            xml += generateUrlNode(`${BASE_URL}/${route.category}/${route.slug}`, '0.9', 'weekly');
        }

        // Core Products
        for (const product of validProducts) {
            const cat = (product.metadata?.category || 'shop').toLowerCase();
            let path = 'shop';
            if (cat === 'canvas') path = 'shop/canvas';
            else if (cat === 'plexiglass' || cat === 'acrylic') path = 'shop/acrylic';

            xml += generateUrlNode(`${BASE_URL}/${path}/${product.routeSlug || product.slug || product.id}`, '0.8', 'weekly');
        }

        // Judete
        for (const j of JUDETE_FULL_DATA) {
            xml += generateUrlNode(`${BASE_URL}/judet/${j.slug}`, '0.8', 'monthly');
        }

    } else {
        const [judetIndexStr, pagePartStr] = id.split('-');
        const judetIndex = parseInt(judetIndexStr);
        const pagePart = parseInt(pagePartStr || '0');

        const judet = JUDETE_FULL_DATA[judetIndex];

        if (judet) {
            if (pagePart === 0) {
                xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}`, '0.8', 'monthly');
            }

            const URLS_PER_LOC = seoProducts.length + 1;
            const LOCS_PER_SITEMAP = Math.floor(45000 / URLS_PER_LOC);

            const startLocIndex = pagePart * LOCS_PER_SITEMAP;
            const endLocIndex = startLocIndex + LOCS_PER_SITEMAP;
            const localitiesSlice = judet.localitati.slice(startLocIndex, endLocIndex);

            for (const loc of localitiesSlice) {
                // Locality main page
                xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}`, '0.7', 'monthly');

                // SEO products
                for (const p of seoProducts) {
                    const rootSlug = p.routeSlug || p.slug || p.id || '';
                    const normalizedPSlug = rootSlug.startsWith('/') ? rootSlug.slice(1) : rootSlug;
                    xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}/${normalizedPSlug}`, '0.6', 'monthly');
                }
            }
        }
    }

    xml += `</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
        }
    });
}
