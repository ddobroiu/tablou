import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { bannerProducts } from '@/lib/products/banner-products';
import { getLandingInfo } from '@/lib/landingData';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Suspense } from 'react';
import ProductStructuredData from '@/components/ProductStructuredData';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

type Props = {
    params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
    // 0. Curățăm slug-ul de segmente redundante (e.g. /banner-product/banner-product/slug)
    const cleanSlug = slug.includes('/') 
        ? slug.split('/').filter(s => s !== 'banner-product' && s !== '').pop() || slug 
        : slug;

    // 1. Căutăm în produsele predefinite folosind variante de slug
    const predef = bannerProducts.find((p) => p.slug === cleanSlug || p.slug === slug);
    if (predef) return { ...predef, type: 'predefined' };

    // 2. Căutăm în datele de landing/SEO (judete, etc) - folosim ambele variante
    const landing = getLandingInfo('bannere', cleanSlug) || getLandingInfo('bannere', slug);
    if (landing) {
        return {
            id: landing.key,
            slug: cleanSlug,
            title: landing.title,
            description: landing.seoDescription || landing.shortDescription,
            image: landing.images?.[0] || '/products/banner/banner-1.webp',
            price: '49 LEI/mp',
            type: 'seo',
            longDescription: landing.contentHtml,
            faqs: (landing as any).faqs
        };
    }

    return null;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: 'Banner Personalizat' };
    }

    const seoTitle = product.title;
    const seoDesc = (product.description + " Print UV, finisaje incluse, livrare rapidă 24-48h.").substring(0, 160);

    return {
        title: seoTitle,
        description: seoDesc,
        keywords: `banner, ${product.title.toLowerCase()}, print outdoor, publicitate stradala, bannere bucuresti, bannere ilfov, print uv, banner imobiliare`,
        openGraph: {
            title: `${seoTitle} | Tablou.net`,
            description: seoDesc,
            images: [product.image],
            type: 'website',
            locale: 'ro_RO',
        },
    };
}

export default async function BannerProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="pt-20">
            <h1 className="sr-only">{product.title} - Configurator Online</h1>
            
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Bannere", item: "/bannere" },
                    { name: product.title, item: `/banner-product/${product.slug}` }
                ]}
            />

            <ProductStructuredData product={{
                name: product.title,
                description: product.description,
                image: product.image,
                sku: product.id,
                offers: {
                    price: "49.00",
                    priceCurrency: "RON",
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/banner-product/${product.slug}`
                }
            }} />

            
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center text-slate-500 font-medium">Se încarcă configuratorul de bannere...</div>}>
                <ConfiguratorDispatcher 
                    configuratorId="banner" 
                    productSlug={product.slug}
                    productImage={product.image}
                />
            </Suspense>

            {/* Content SEO Section */}
            {(product as any).longDescription && (
                <section className="container mx-auto px-4 py-16 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
                        <div dangerouslySetInnerHTML={{ __html: (product as any).longDescription }} />
                    </div>
                </section>
            )}

            <FAQSchema
                faqs={(product as any).faqs && (product as any).faqs.length > 0 ? (product as any).faqs : [
                    {
                        question: "Sunt incluse inelele de prindere (capsele) și tivul?",
                        answer: "Da! Finisarea de bază: tivirea marginilor pentru rezistență mecanică sporită la smulgere și asamblarea capselor metalice sunt complet gratuite."
                    },
                    {
                        question: "Cât de repede se livrează comanda?",
                        answer: "Timpul standard de producție + livrare prin Curier este între 24 și 48 de ore lucrătoare, național."
                    }
                ]}
            />
        </div>
    );
}
