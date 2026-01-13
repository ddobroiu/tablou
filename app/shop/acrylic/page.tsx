import { Metadata } from 'next';
import CanvasProductGrid from '@/components/CanvasProductGrid';
import { Sparkles, Trees, Car, Building2, Dog, Briefcase, Camera, Palette, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Tablouri Sticlă Acrilică Premium - Colecții Modele Predefinite | Tablou.net',
    description: 'Descoperă colecția noastră de tablouri pe sticlă acrilică premium. Claritate excepțională, efect de profunzime și culori vibrante. Sute de modele de artă digitală imprimate pe plexiglass.',
    keywords: ['tablouri sticla acrilica', 'plexiglass print decor', 'tablou lux', 'decoratiuni interioare premium', 'print uv sticla'],
    alternates: {
        canonical: '/shop/acrylic',
    },
};

import { acrylicProducts, getAcrylicProducts } from '@/lib/products/acrylic-products';

export default async function AcrylicPage() {
    // Optimization: Strip heavy description/details for the grid view initialization
    const products = acrylicProducts.map(p => ({
        ...p,
        description: "",
        descriptionOriginal: "",
        images: [], // Only keep main image
        sourceUrl: ""
    }));

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            {/* Products Grid Area */}
            <section id="products" className="container mx-auto px-4 lg:px-8">
                <div className="mb-12">
                    <header className="max-w-3xl">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black mb-6 uppercase tracking-[0.2em] border border-blue-100 shadow-sm">
                            Luxury Acrylic Collection
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            Produse pe <span className="text-blue-600">Sticlă Acrilică</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            {products.length > 0
                                ? `Explorați cele ${products.length} tablouri premium imprimate pe sticlă acrilică de înaltă calitate.`
                                : 'Colecția se încarcă...'
                            }
                        </p>
                    </header>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-4 md:p-8 border border-white shadow-xl shadow-slate-200/50">
                    <CanvasProductGrid
                        products={products}
                        linkBase="acrylic-product"
                    />
                </div>
            </section>

            {/* Configurator CTA */}
            <section className="container mx-auto px-4 lg:px-8 mt-24">
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-12 md:p-24 text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-8">Nu ai găsit modelul perfect?</h2>
                        <p className="text-slate-400 text-lg mb-12">Creează-ți propriul tablou acrilic cu fotografia ta preferată. Calitate muzeu, preț direct de producător.</p>
                        <Link href="/sticla-acrilica" className="inline-flex items-center gap-3 bg-white text-slate-900 font-black px-12 py-6 rounded-2xl active:scale-95 transition-all hover:bg-blue-50 hover:shadow-2xl uppercase tracking-widest text-sm">
                            <Sparkles size={20} className="text-blue-600" />
                            Încarcă Poza Ta
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
