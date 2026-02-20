import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { siteConfig } from '@/lib/siteConfig';
import { listAllLandingRoutes } from '@/lib/landingData';
import { JUDETE_DATA } from '@/lib/judeteData';
import { getAllBlogSlugs, getPostBySlug } from '@/lib/blogPosts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // 1. Static routes
    const staticRoutes = [
        '',
        '/editor',
        '/canvas',
        '/afise',
        '/sticla-acrilica',
        '/shop/canvas',
        '/shop/acrylic',
        '/contact',
        '/despre-noi',
        '/blog',
        '/termeni',
        '/confidentialitate',
        '/politica-cookies',
        '/ghid-dimensiuni',
        '/instructiuni-calitate',
        '/urmareste-comanda',
        '/judet',
    ];

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.5,
    }));

    // 2. Products (from collections)
    const products = await getProducts();
    const productEntries: MetadataRoute.Sitemap = products.map((product) => {
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
    const judeteEntries: MetadataRoute.Sitemap = JUDETE_DATA.map((j) => ({
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
