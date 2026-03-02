import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { siteConfig } from '@/lib/siteConfig';
import { listAllLandingRoutes } from '@/lib/landingData';
import { JUDETE_FULL_DATA } from '@/lib/localitati';
import { getAllBlogSlugs, getPostBySlug } from '@/lib/blogPosts';

export async function generateSitemaps() {
    const sitemaps = [{ id: 'main' }];
    const PRODUCTS_PER_LOC = 60; // This is an estimate for the number of products that will be linked per locality

    for (let i = 0; i < JUDETE_FULL_DATA.length; i++) {
        const judet = JUDETE_FULL_DATA[i];
        // Each locality will have its own page + N product pages.
        // We estimate the total URLs for a judet's localities and their product combinations.
        // 40000 is the approximate max URLs per sitemap file.
        const totalUrls = judet.localitati.length * PRODUCTS_PER_LOC;
        const parts = Math.ceil(totalUrls / 40000);

        for (let p = 0; p < parts; p++) {
            sitemaps.push({ id: `${i}-${p}` });
        }
    }
    return sitemaps;
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.ro';

    // Fetch all products and blog posts once for all sitemap generations
    const products = await getProducts();
    const allBlogSlugs = getAllBlogSlugs();
    const allBlogPosts = allBlogSlugs.map(slug => getPostBySlug(slug)).filter(Boolean);

    const validProducts = products.filter((p: any) => !p.id?.startsWith("fallback-"));
    // Filter products specifically for SEO campaigns in locality pages
    const seoProducts = validProducts.filter((p: any) => p.metadata?.isSeoCampaign || p.id?.startsWith('seo-'));

    if (id === 'main') {
        // 1. Static routes
        const staticRoutes = [
            '', '/contact', '/termeni', '/confidentialitate', '/politica-cookies',
            '/shop', '/afise', '/canvas', '/sticla-acrilica', '/blog', '/judet',
            '/editor', '/canvas', '/sticla-acrilica', '/shop/canvas', '/shop/acrylic',
            '/despre-noi', '/ghid-dimensiuni', '/instructiuni-calitate', '/urmareste-comanda',
        ];

        const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1.0 : 0.8,
        }));

        // 2. Blog Posts
        const blogRoutes: MetadataRoute.Sitemap = allBlogPosts.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        // 3. Landing Routes (Programmatic SEO)
        const landingRoutes: MetadataRoute.Sitemap = listAllLandingRoutes().map((route) => ({
            url: `${baseUrl}/${route.category}/${route.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        // 4. Product Routes
        const productRoutes: MetadataRoute.Sitemap = validProducts.map((product: any) => {
            const cat = (product.metadata?.category || 'shop').toLowerCase();
            let path = 'shop';
            if (cat === 'canvas') path = 'shop/canvas';
            else if (cat === 'plexiglass' || cat === 'acrylic') path = 'shop/acrylic';

            return {
                url: `${baseUrl}/${path}/${product.routeSlug || product.slug || product.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            };
        });

        // 5. Judete (County Pages)
        const judeteRoutes: MetadataRoute.Sitemap = JUDETE_FULL_DATA.map((j) => ({
            url: `${baseUrl}/judet/${j.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));

        return [...staticEntries, ...blogRoutes, ...landingRoutes, ...productRoutes, ...judeteRoutes];
    }

    // Dynamic Sitemaps (Localitati Sharded)
    const [judetIndexStr, pagePartStr] = id.split('-');
    const judetIndex = parseInt(judetIndexStr);
    const pagePart = parseInt(pagePartStr || '0');

    const judet = JUDETE_FULL_DATA[judetIndex];
    if (!judet) return [];

    const localitatiEntries: MetadataRoute.Sitemap = [];

    // Calculate how many URLs each locality will generate (locality page + N product pages)
    const URLS_PER_LOC = seoProducts.length + 1;
    // Determine how many localities can fit into one sitemap file (max 45000 URLs)
    const LOCS_PER_SITEMAP = Math.floor(45000 / URLS_PER_LOC);

    const startLocIndex = pagePart * LOCS_PER_SITEMAP;
    const localitiesSlice = judet.localitati.slice(startLocIndex, startLocIndex + LOCS_PER_SITEMAP);

    // Add judet main page on the first part (pagePart 0) for that judet
    if (pagePart === 0) {
        localitatiEntries.push({
            url: `${baseUrl}/judet/${judet.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        });
    }

    for (const loc of localitiesSlice) {
        // Add the locality main page
        localitatiEntries.push({
            url: `${baseUrl}/judet/${judet.slug}/${loc.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });

        // Add product-specific pages for each locality
        for (const p of seoProducts) {
            const rootSlug = (p as any).routeSlug || (p as any).slug || p.id;
            const normalizedPSlug = rootSlug?.startsWith('/') ? rootSlug.slice(1) : rootSlug;
            localitatiEntries.push({
                url: `${baseUrl}/judet/${judet.slug}/${loc.slug}/${normalizedPSlug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        }
    }

    return localitatiEntries;
}
