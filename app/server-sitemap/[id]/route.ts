import { bannerProducts } from '@/lib/products/banner-products';
import { signageProducts } from '@/lib/products/signage-products';
import canvasProductsRaw from '@/lib/products/canvas-products.json';
import { euFundsProducts } from '@/lib/products/eu-funds-products';
import { configuratorProducts } from '@/lib/products/configurator-products';
import { seoCampaignProducts } from '@/lib/products/seo-campaign-products';
import { getAllPosts } from '@/lib/blogPosts';
import { listAllLandingRoutes } from '@/lib/landingData';
import { JUDETE_FULL_DATA } from '@/lib/localitati';

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

// The curated real-town list — the only localities the judet/product SEO matrix is advertised
// for in the sitemap (down from all ~13,344 localities). Includes the 42 județ reședințe (county
// seats) plus additional real towns with meaningful search demand (e.g. Râmnicu Sărat), so
// cities beyond the county seat can also get a dedicated page.
//
// Keyed by județ slug (not a flat list): many Romanian village names repeat across unrelated
// counties (e.g. "Slobozia", "Budești", "Comănești" are all common comuna names found in a dozen+
// județe besides the one intended here), so matching this list against ALL localities nationwide
// — instead of only the named județ's own list — would silently pull in the wrong, unrelated
// villages. Matching is scoped per-județ below to avoid that.
const CURATED_TOWNS_BY_JUDET: Record<string, string[]> = {
    'alba': ["Alba Iulia", "Sebeș", "Aiud", "Blaj", "Cugir", "Câmpeni", "Ocna Mureș"],
    'arad': ["Arad", "Ineu", "Lipova", "Chișineu-Criș", "Sântana"],
    'arges': ["Pitești", "Curtea de Argeș", "Câmpulung", "Mioveni", "Topoloveni"],
    'bacau': ["Bacău", "Onești", "Moinești", "Comănești", "Buhuși", "Târgu Ocna"],
    'bihor': ["Oradea", "Salonta", "Marghita", "Beiuș", "Aleșd"],
    'bistrita-nasaud': ["Bistrița", "Beclean", "Năsăud"],
    'botosani': ["Botoșani", "Dorohoi", "Săveni"],
    'braila': ["Brăila", "Ianca", "Însurăței"],
    'brasov': ["Brașov", "Făgăraș", "Săcele", "Codlea", "Zărnești", "Rupea", "Predeal"],
    'buzau': ["Buzău", "Râmnicu Sărat", "Nehoiu", "Pogoanele"],
    'caras-severin': ["Reșița", "Caransebeș", "Oravița", "Bocșa", "Oțelu Roșu"],
    'calarasi': ["Călărași", "Oltenița", "Budești"],
    'cluj': ["Cluj-Napoca", "Turda", "Dej", "Câmpia Turzii", "Gherla", "Huedin"],
    'constanta': ["Constanța", "Medgidia", "Mangalia", "Năvodari", "Cernavodă", "Techirghiol", "Eforie", "Ovidiu", "Murfatlar"],
    'covasna': ["Sfântu Gheorghe", "Târgu Secuiesc", "Covasna", "Baraolt"],
    'dambovita': ["Târgoviște", "Moreni", "Pucioasa", "Găești", "Titu"],
    'dolj': ["Craiova", "Băilești", "Calafat", "Filiași", "Segarcea"],
    'galati': ["Galați", "Tecuci", "Târgu Bujor"],
    'giurgiu': ["Giurgiu", "Bolintin-Vale"],
    'gorj': ["Târgu Jiu", "Motru", "Rovinari", "Târgu Cărbunești", "Bumbești-Jiu"],
    'harghita': ["Miercurea Ciuc", "Odorheiu Secuiesc", "Gheorgheni", "Toplița", "Cristuru Secuiesc"],
    'hunedoara': ["Deva", "Hunedoara", "Petroșani", "Orăștie", "Brad", "Vulcan", "Lupeni", "Simeria", "Călan", "Hațeg"],
    'ialomita': ["Slobozia", "Fetești", "Urziceni", "Țăndărei"],
    'iasi': ["Iași", "Pașcani", "Hârlău", "Târgu Frumos"],
    'ilfov': ["Voluntari", "Buftea", "Otopeni", "Pantelimon", "Bragadiru", "Popești-Leordeni", "Chitila", "Măgurele", "Chiajna"],
    'maramures': ["Baia Mare", "Sighetu Marmației", "Borșa", "Vișeu de Sus", "Târgu Lăpuș"],
    'mehedinti': ["Drobeta-Turnu Severin", "Orșova", "Strehaia"],
    'mures': ["Târgu Mureș", "Reghin", "Sighișoara", "Târnăveni", "Luduș", "Sovata"],
    'neamt': ["Piatra Neamț", "Roman", "Târgu Neamț", "Bicaz"],
    'olt': ["Slatina", "Caracal", "Balș", "Corabia", "Drăgănești-Olt"],
    'prahova': ["Ploiești", "Câmpina", "Sinaia", "Bușteni", "Comarnic", "Mizil", "Băicoi", "Vălenii de Munte"],
    'satu-mare': ["Satu Mare", "Carei", "Negrești-Oaș", "Tășnad"],
    'salaj': ["Zalău", "Jibou", "Șimleu Silvaniei", "Cehu Silvaniei"],
    'sibiu': ["Sibiu", "Mediaș", "Cisnădie", "Avrig", "Agnita", "Copșa Mică"],
    'suceava': ["Suceava", "Fălticeni", "Rădăuți", "Câmpulung Moldovenesc", "Vatra Dornei", "Gura Humorului", "Siret"],
    'teleorman': ["Alexandria", "Roșiori de Vede", "Turnu Măgurele", "Zimnicea"],
    'timis': ["Timișoara", "Lugoj", "Sânnicolau Mare", "Jimbolia", "Buziaș", "Făget"],
    'tulcea': ["Tulcea", "Măcin", "Babadag", "Isaccea"],
    'vaslui': ["Vaslui", "Bârlad", "Huși", "Negrești"],
    'valcea': ["Râmnicu Vâlcea", "Drăgășani", "Horezu", "Băbeni"],
    'vrancea': ["Focșani", "Adjud", "Panciu", "Odobești"],
    'bucuresti': ["București", "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
};

function normalizeRoName(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

const NORMALIZED_TOWNS_BY_JUDET: Record<string, Set<string>> = Object.fromEntries(
    Object.entries(CURATED_TOWNS_BY_JUDET).map(([slug, towns]) => [slug, new Set(towns.map(normalizeRoName))])
);

// Picks every locality in this județ's own localitati list that matches that same județ's
// curated town names (case/diacritics-insensitive, scoped to this județ only — see note above).
// Unmatched curated names are silently skipped (some towns in the list may not exist as a
// distinct entry in this dataset). Falls back to the first listed locality if the județ has no
// match at all (or isn't in the curated map), so every județ still gets at least one page.
function pickCuratedLocalities(judet: { name: string; slug: string; localitati: { name: string; slug: string }[] }) {
    const wanted = NORMALIZED_TOWNS_BY_JUDET[judet.slug];
    const matches = wanted ? judet.localitati.filter(l => wanted.has(normalizeRoName(l.name))) : [];
    return matches.length > 0 ? matches : [judet.localitati[0]].filter(Boolean);
}

const ALL_PRODUCTS = [
    ...bannerProducts,
    ...signageProducts,
    ...(canvasProductsRaw as any[]),
    ...euFundsProducts,
    ...configuratorProducts,
    ...seoCampaignProducts
];

function generateUrlNode(url: string, priority: string, changefreq: string) {
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
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
            '/contact', '/termeni', '/confidentialitate', '/livrare', '/politica-cookies', '/urmareste-comanda',
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
            xml += generateUrlNode(`${BASE_URL}/blog/${post.slug}`, '0.7', 'weekly');
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

    } else if (id && id.startsWith('dimensions-')) {
        const part = parseInt(id.replace('dimensions-', ''));

        // Curated, realistic dimension pairs per product (see PRODUCT_DIMENSIONS above).
        // Total is a few hundred URLs, so a single sitemap part (part 0) covers everything.
        const allCombos: { pk: string; w: number; h: number }[] = [];
        for (const pk of Object.keys(PRODUCT_DIMENSIONS)) {
            for (const { w, h } of PRODUCT_DIMENSIONS[pk]) {
                allCombos.push({ pk, w, h });
            }
        }

        const MAX_PER_PART = 45000;
        const startIdx = part * MAX_PER_PART;
        const endIdx = startIdx + MAX_PER_PART;
        const pageCombos = allCombos.slice(startIdx, endIdx);

        for (const combo of pageCombos) {
            xml += generateUrlNode(`${BASE_URL}/configurator/${combo.pk}-${combo.w}x${combo.h}`, '0.5', 'monthly');
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
        // Judet/locality SEO matrix — restricted to the ~218-town curated list (county seats plus
        // other real towns with meaningful search demand) instead of all ~13,344 localities, and
        // to the site's real configurator products instead of the ~250-item SEO campaign product
        // list. Even the largest județ's curated town count comfortably fits in a single sitemap
        // part, so pagePart beyond 0 is a no-op.
        const [judetIndexStr, pagePartStr] = id.split('-');
        const judetIndex = parseInt(judetIndexStr);
        const pagePart = parseInt(pagePartStr || '0');

        const judet = JUDETE_FULL_DATA[judetIndex];

        if (judet && pagePart === 0) {
            xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}`, '0.6', 'monthly');

            const locs = pickCuratedLocalities(judet);
            for (const loc of locs) {
                xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}`, '0.5', 'monthly');

                for (const p of configuratorProducts) {
                    const rootSlug = (p as any).routeSlug || (p as any).slug || p.id;
                    const normalizedPSlug = rootSlug?.startsWith('/') ? rootSlug.slice(1) : rootSlug;
                    xml += generateUrlNode(`${BASE_URL}/judet/${judet.slug}/${loc.slug}/${normalizedPSlug}`, '0.4', 'monthly');
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
