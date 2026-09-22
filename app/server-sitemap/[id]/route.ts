import { LOCS_PER_SITEMAP } from '@/lib/seo/sitemapPaging';
import { getAllDimensionEntries, DIMENSION_URLS_PER_SITEMAP, DIMENSION_PRODUCT_IDS, dimensionUrl } from '@/lib/seo/dimensionPages';
import { QTY_PRODUCTS, getAllQtyEntries, qtyUrl } from '@/lib/seo/quantityPages';
import { bannerProducts } from '@/lib/products/banner-products';
import { signageProducts } from '@/lib/products/signage-products';
import canvasProductsRaw from '@/lib/products/canvas-products.json';
import { euFundsProducts } from '@/lib/products/eu-funds-products';
import { configuratorProducts } from '@/lib/products/configurator-products';
import { seoCampaignProducts } from '@/lib/products/seo-campaign-products';
import { getAllPosts } from '@/lib/blogPosts';
import { listAllLandingRoutes } from '@/lib/landingData';
import { JUDETE_FULL_DATA } from '@/lib/localitati';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';

import { PRODUCT_INTENTS, INTENT_LABELS, MARKETING_INTENTS } from '@/lib/seo/intents';
import { MATERIALE_DATA } from '@/lib/seo/materialeData';
import { SERVICII_DATA } from '@/lib/seo/serviciiData';
import { REGLEMENTARI_DATA } from '@/lib/seo/reglementariData';
import { STILURI_DATA } from '@/lib/seo/stiluriData';
import { INDUSTRIE_DATA } from '@/lib/seo/industriiData';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.net';

// Curated, realistic (width x height, in cm) size pairs per product key — replaces the
// old brute-force 20-500cm/5cm-step cross product (~9,409 combos/product, ~188k total).
// Sizes reflect commonly-ordered dimensions for each product category.
function crossSizes(widths: number[], heights: number[]): { w: number; h: number }[] {
    const out: { w: number; h: number }[] = [];
    for (const w of widths) for (const h of heights) out.push({ w, h });
    return out;
}

const PRODUCT_DIMENSIONS: Record<string, { w: number; h: number }[]> = {
    // Banners are ordered to near-arbitrary custom sizes in practice, so a wider realistic grid applies.
    'banner': crossSizes([50, 100, 150, 200, 250, 300, 400, 500, 600], [50, 70, 100, 150, 200, 250, 300]),
    'banner-verso': crossSizes([100, 150, 200, 300, 400, 500], [50, 70, 100, 150, 200]),
    'afise': [
        { w: 30, h: 40 }, { w: 40, h: 60 }, { w: 50, h: 70 }, { w: 60, h: 90 }, { w: 70, h: 100 },
        { w: 100, h: 140 }, { w: 21, h: 30 }, { w: 42, h: 60 }, { w: 50, h: 50 }, { w: 30, h: 30 },
        { w: 20, h: 30 }, { w: 84, h: 120 }, { w: 61, h: 91 }, { w: 45, h: 60 }, { w: 90, h: 60 },
    ],
    'autocolante': crossSizes([5, 10, 15, 20, 30, 40, 50, 60, 80, 100], [5, 10, 15, 20, 30]),
    'canvas': crossSizes([20, 30, 40, 50, 60, 70, 80, 100, 120], [30, 40, 50, 60, 70, 80, 100, 150]),
    'tapet': [
        { w: 100, h: 250 }, { w: 150, h: 250 }, { w: 200, h: 250 }, { w: 250, h: 250 }, { w: 300, h: 250 },
        { w: 350, h: 250 }, { w: 400, h: 250 }, { w: 200, h: 270 }, { w: 300, h: 270 }, { w: 250, h: 270 },
        { w: 350, h: 270 }, { w: 150, h: 270 },
    ],
    'rollup': [
        { w: 85, h: 200 }, { w: 85, h: 215 }, { w: 100, h: 200 }, { w: 100, h: 215 }, { w: 120, h: 200 },
        { w: 150, h: 200 }, { w: 60, h: 160 }, { w: 200, h: 220 },
    ],
    'window-graphics': crossSizes([50, 100, 150, 200], [50, 100, 150, 200]),
    'pliante': [
        { w: 10, h: 21 }, { w: 21, h: 10 }, { w: 15, h: 21 }, { w: 21, h: 15 }, { w: 10, h: 15 }, { w: 21, h: 30 },
        { w: 20, h: 20 }, { w: 15, h: 15 },
    ],
    'flayere': [
        { w: 10, h: 15 }, { w: 15, h: 21 }, { w: 21, h: 10 }, { w: 10, h: 10 }, { w: 14, h: 21 }, { w: 9, h: 14 },
        { w: 21, h: 30 }, { w: 15, h: 15 },
    ],
    'plexiglass': crossSizes([20, 30, 40, 50, 60, 80, 100], [30, 40, 50, 70, 90, 100]),
    'pvc-forex': crossSizes([30, 40, 50, 70, 100], [40, 60, 70, 90, 100, 140]),
    'alucobond': crossSizes([30, 50, 70, 100], [40, 60, 70, 100, 140]),
    'fonduri-eu': [
        { w: 50, h: 70 }, { w: 70, h: 100 }, { w: 30, h: 42 }, { w: 80, h: 120 }, { w: 60, h: 80 },
        { w: 40, h: 60 }, { w: 100, h: 150 },
    ],
    'polipropilena': crossSizes([30, 40, 50, 70], [40, 50, 60, 70, 100]),
    'carton': crossSizes([21, 30, 40, 50, 70], [30, 40, 50, 70, 100]),
    'carti-vizita': [
        { w: 9, h: 5 }, { w: 8, h: 5 }, { w: 9, h: 6 }, { w: 8.5, h: 5.5 }, { w: 9, h: 5.5 },
    ],
    'tricouri': [
        { w: 20, h: 30 }, { w: 25, h: 35 }, { w: 30, h: 40 }, { w: 15, h: 20 }, { w: 20, h: 20 }, { w: 35, h: 45 },
    ],
    'hanorace': [
        { w: 20, h: 30 }, { w: 25, h: 35 }, { w: 30, h: 40 }, { w: 20, h: 20 }, { w: 35, h: 45 },
    ],
    'sepci': [
        { w: 8, h: 5 }, { w: 10, h: 6 }, { w: 9, h: 5.5 },
    ],
};

// Județ x localitate x produs: TOATE localitățile din lib/seo/ro_localitati.json
// au pagină și intră în sitemap (vezi ramura paginată de mai jos).

const ALL_PRODUCTS = [
    ...bannerProducts,
    ...signageProducts,
    ...(canvasProductsRaw as any[]),
    ...euFundsProducts,
    ...configuratorProducts,
    ...seoCampaignProducts
];

/**
 * Last meaningful content change for evergreen pages. Bump when the catalog or
 * copy actually changes. A per-request `new Date()` told Google every URL
 * changed today, every day, so it learned to ignore the field.
 */
const CONTENT_LASTMOD = '2026-09-12';

function generateUrlNode(url: string, priority: string, changefreq: string, lastmod: string = CONTENT_LASTMOD) {
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

export async function GET(request: Request, props: any) {
    const params = await (props.params instanceof Promise ? props.params : props.params);
    const id = params?.id;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    if (id === 'main') {
        const staticRoutes = [
            '', '/shop', '/shop/bannere', '/shop/canvas', '/shop/semnalistica',
            '/shop/panouri-sticla', '/shop/fonduri-europene', '/configurator/banner', '/configurator/rollup',
            '/configurator/afise', '/configurator/autocolante', '/configurator/pliante', '/configurator/flayere',
            '/configurator/window-graphics', '/configurator/canvas', '/configurator/tapet',
            '/configurator/custom-glass', '/configurator/fonduri-eu', '/materiale/plexiglass', '/materiale/pvc-forex',
            '/contact', '/termeni', '/confidentialitate', '/livrare', '/politica-cookies',
            '/anpc', '/litigii', '/judet', '/seap'
        ];

        for (const route of staticRoutes) {
            xml += generateUrlNode(`${BASE_URL}${route}`, route === '' ? '1.0' : '0.8', 'daily');
        }

        for (const product of ALL_PRODUCTS) {
            let pRoute = (product as any).routeSlug || (product as any).slug || product.id;
            const isSignage = signageProducts.some(s => s.id === product.id);
            if (isSignage && !pRoute.startsWith('semnalistica-product/')) {
                pRoute = `semnalistica-product/${pRoute}`;
            }
            const normalizedPSlug = pRoute?.startsWith('/') ? pRoute.slice(1) : pRoute;
            xml += generateUrlNode(`${BASE_URL}/${normalizedPSlug}`, '0.9', 'weekly');
        }

        for (const post of getAllPosts()) {
            xml += generateUrlNode(`${BASE_URL}/blog/${post.slug}`, '0.7', 'weekly', post.date ? post.date.slice(0, 10) : CONTENT_LASTMOD);
        }

        for (const route of listAllLandingRoutes()) {
            let path = '';
            if (route.category === 'bannere') path = `/bannere/${route.slug}`;
            else if (route.category === 'canvas') path = `/canvas/${route.slug}`;
            else path = `/shop/${route.category}/${route.slug}`;
            xml += generateUrlNode(`${BASE_URL}${path}`, '0.9', 'weekly');
        }

        for (const j of JUDETE_FULL_DATA) {
            xml += generateUrlNode(`${BASE_URL}/judet/${j.slug}`, '0.6', 'monthly');
        }

        const { INDUSTRIE_DATA } = await import('@/lib/seo/industriiData');
        xml += generateUrlNode(`${BASE_URL}/industrii`, '0.8', 'weekly');
        xml += generateUrlNode(`${BASE_URL}/sectoare-bucuresti`, '0.8', 'weekly');

        for (const ind of INDUSTRIE_DATA) {
            xml += generateUrlNode(`${BASE_URL}/industrii/${ind.slug}`, '0.8', 'weekly');
            for (const prod of ind.recommendedProducts) {
                xml += generateUrlNode(`${BASE_URL}/industrii/${ind.slug}/${prod}`, '0.7', 'weekly');
            }
        }

    } else if (id === 'preturi') {
        // Pagini de preț pe cantitate (lib/seo/quantityPages.ts).
        xml += generateUrlNode(`${BASE_URL}/preturi`, '0.7', 'monthly');
        for (const p of QTY_PRODUCTS) {
            xml += generateUrlNode(`${BASE_URL}/preturi/${p.slug}`, '0.6', 'monthly');
        }
        for (const e of getAllQtyEntries()) {
            xml += generateUrlNode(`${BASE_URL}${qtyUrl(e.product, e.format, e.qty)}`, '0.5', 'monthly');
        }

    } else if (id && id.startsWith('dimensions-')) {
        // Pagini de dimensiune: /dimensiuni/{produs}/{L}x{H}, una pentru fiecare
        // combinație din grila lib/seo/dimensionPages.ts. Indexul (app/sitemap.xml)
        // anunță câte părți există folosind aceeași constantă DIMENSION_URLS_PER_SITEMAP.
        const part = parseInt(id.replace('dimensions-', '')) || 0;
        const entries = getAllDimensionEntries();
        const startIdx = part * DIMENSION_URLS_PER_SITEMAP;
        const slice = entries.slice(startIdx, startIdx + DIMENSION_URLS_PER_SITEMAP);

        if (part === 0) {
            xml += generateUrlNode(`${BASE_URL}/dimensiuni`, '0.7', 'monthly');
            for (const pid of DIMENSION_PRODUCT_IDS) {
                xml += generateUrlNode(`${BASE_URL}/dimensiuni/${pid}`, '0.6', 'monthly');
            }
        }
        for (const e of slice) {
            xml += generateUrlNode(`${BASE_URL}${dimensionUrl(e.productId, e.w, e.h)}`, '0.5', 'monthly');
        }

    } else if (id && id.startsWith('intents-')) {
        const part = parseInt(id.replace('intents-', ''));
        const allIntentsCombos = [];
        
        for (const [productId, intents] of Object.entries(PRODUCT_INTENTS)) {
            for (const intent of intents) {
                allIntentsCombos.push({ productId, intent });
            }
        }

        const MAX_PER_PART = 45000;
        const startIdx = part * MAX_PER_PART;
        const endIdx = startIdx + MAX_PER_PART;
        const pageCombos = allIntentsCombos.slice(startIdx, endIdx);

        for (const combo of pageCombos) {
            xml += generateUrlNode(`${BASE_URL}/configurator/${combo.productId}-${combo.intent}`, '0.7', 'monthly');
        }

    } else if (id === 'materiale') {
        xml += generateUrlNode(`${BASE_URL}/material`, '0.8', 'weekly');
        for (const mat of MATERIALE_DATA) {
            xml += generateUrlNode(`${BASE_URL}/material/${mat.slug}`, '0.7', 'weekly');
        }
    } else if (id === 'servicii') {
        xml += generateUrlNode(`${BASE_URL}/servicii`, '0.8', 'weekly');
        for (const srv of SERVICII_DATA) {
            xml += generateUrlNode(`${BASE_URL}/servicii/${srv.slug}`, '0.7', 'weekly');
        }
    } else if (id === 'norme') {
        xml += generateUrlNode(`${BASE_URL}/norme`, '0.8', 'weekly');
        for (const reg of REGLEMENTARI_DATA) {
            xml += generateUrlNode(`${BASE_URL}/norme/${reg.slug}`, '0.7', 'weekly');
        }
    } else if (id === 'stiluri') {
        xml += generateUrlNode(`${BASE_URL}/stil`, '0.8', 'weekly');
        for (const stl of STILURI_DATA) {
            xml += generateUrlNode(`${BASE_URL}/stil/${stl.slug}`, '0.7', 'weekly');
        }
    } else if (id && id.startsWith('recomandat-')) {
        const part = parseInt(id.replace('recomandat-', ''));
        const allRecomandat = [];
        const { configuratorProducts } = await import('@/lib/products/configurator-products');
        
        for (const prod of configuratorProducts) {
            const pSlug = prod.slug || prod.id;
            // Existing intents
            const intents = PRODUCT_INTENTS[prod.id] || [];
            for (const intent of intents) {
                allRecomandat.push(`/recomandat/${pSlug}/${intent}`);
                allRecomandat.push(`/recomandat/${pSlug}/pentru-${intent}`);
            }
            // Marketing intents
            for (const m of MARKETING_INTENTS) {
                allRecomandat.push(`/recomandat/${pSlug}/${m}`);
            }
            // Industries
            for (const ind of INDUSTRIE_DATA) {
                allRecomandat.push(`/recomandat/${pSlug}/${ind.slug}`);
                allRecomandat.push(`/recomandat/${pSlug}/pentru-${ind.slug}`);
            }
        }

        const MAX_PER_PART = 45000;
        const startIdx = part * MAX_PER_PART;
        const endIdx = startIdx + MAX_PER_PART;
        const pageCombos = allRecomandat.slice(startIdx, endIdx);

        for (const path of pageCombos) {
            xml += generateUrlNode(`${BASE_URL}${path}`, '0.6', 'monthly');
        }

    } else {
        // TOATE localitățile județului, paginat: id-ul e "{judetIndex}-{pagePart}".
        //
        // Paginile de localitate sunt cele care aduc traficul organic, deci le
        // listăm pe toate (~13.300 din lib/seo/ro_localitati.json), încrucișate
        // cu configuratoarele reale. Indexul (app/sitemap.xml) anunță câte părți
        // are fiecare județ folosind aceeași constantă LOCS_PER_SITEMAP.
        //
        // Un id necunoscut (inclusiv vechiul "localities") dă un urlset valid,
        // dar gol, ca să nu erorizeze URL-urile de sitemap deja indexate.
        const [judetIndexStr, pagePartStr] = String(id ?? '').split('-');
        const judetIndex = parseInt(judetIndexStr);
        const pagePart = parseInt(pagePartStr || '0');
        const judet = Number.isInteger(judetIndex) ? JUDETE_FULL_DATA[judetIndex] : undefined;

        if (judet) {
            const startLocIndex = pagePart * LOCS_PER_SITEMAP;
            const localitiesSlice = judet.localitati.slice(
                startLocIndex,
                startLocIndex + LOCS_PER_SITEMAP
            );

            // Pagina județului o emitem o singură dată, nu în fiecare parte.
            if (pagePart === 0) {
                xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}`, '0.6', 'monthly');
            }

            for (const loc of localitiesSlice) {
                xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}`, '0.5', 'monthly');

                for (const cfg of CONFIGURATORS_REGISTRY) {
                    const cfgSlug = (cfg as any).slug || cfg.id;
                    xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}/${cfgSlug}`, '0.4', 'monthly');
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
