import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { siteConfig } from '@/lib/siteConfig';
import { listAllLandingRoutes } from '@/lib/landingData';
import { JUDETE_FULL_DATA } from '@/lib/localitati';
import { getAllBlogSlugs, getPostBySlug } from '@/lib/blogPosts';

export async function generateSitemaps() {
    const sitemaps = [{ id: 0 }]; // 0 = main sitemap
    for (let i = 0; i < JUDETE_FULL_DATA.length; i++) {
        sitemaps.push({ id: i + 1 });
    }
    return sitemaps;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // 2. Products (from collections)
    const products = await getProducts();
    const validProducts = products.filter((p: any) => !p.id?.startsWith("fallback-"));

    if (id === 0) {
        // 1. Static routes
        const staticRoutes = [
            '', '/editor', '/canvas', '/afise', '/sticla-acrilica', '/shop/canvas',
            '/shop/acrylic', '/contact', '/despre-noi', '/blog', '/termeni', '/confidentialitate',
            '/politica-cookies', '/ghid-dimensiuni', '/instructiuni-calitate', '/urmareste-comanda', '/judet'
        ];

        const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' ? 'daily' : 'monthly',
            priority: route === '' ? 1 : 0.5,
        }));

        const productEntries: MetadataRoute.Sitemap = validProducts.map((product: any) => {
            const category = (product.metadata?.category || '').toLowerCase();
            let path = 'shop';
            if (category === 'canvas') path = 'shop/canvas';
            else if (category === 'plexiglass' || category === 'acrylic') path = 'shop/acrylic';

            return {
                url: `${baseUrl}/${path}/${product.routeSlug || product.slug || product.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            };
        });

        // 3. Landing Routes (Programmatic SEO)
        const landingEntries: MetadataRoute.Sitemap = listAllLandingRoutes().map((route) => ({
            url: `${baseUrl}/${route.category}/${route.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // 4. Judete (County Pages)
        const judeteEntries: MetadataRoute.Sitemap = JUDETE_FULL_DATA.map((j) => ({
            url: `${baseUrl}/judet/${j.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }));

        // 5. Blog Posts
        const blogEntries: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => {
            const post = getPostBySlug(slug);
            return {
                url: `${baseUrl}/blog/${slug}`,
                lastModified: post ? new Date(post.date) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            };
        });

        return [...staticEntries, ...productEntries, ...landingEntries, ...judeteEntries, ...blogEntries];
    }

    // Dynamic Localities SEO
    const judetIndex = id - 1;
    const judet = JUDETE_FULL_DATA[judetIndex];
    if (!judet) return [];

    const localitatiEntries: MetadataRoute.Sitemap = [];

    for (const loc of judet.localitati) {
        localitatiEntries.push({
            url: `${baseUrl}/judet/${judet.slug}/${loc.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });

        for (const p of validProducts) {
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
