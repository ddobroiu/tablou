import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { JUDETE_FULL_DATA } from '@/lib/localitati';

export const metadata: Metadata = {
    title: 'Harta Site | Toate Paginile și Produsele',
    description: 'Harta completă a site-ului. Aici găsești link-uri rapide către toate categoriile, produsele, localitățile și paginile noastre speciale.',
};

export default async function HartaSitePage() {
    const products = await getProducts();

    // Categorize products broadly
    const categoriesMap = new Map<string, typeof products>();
    for (const p of products) {
        const cat = p.metadata?.category || 'Altele';
        if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
        categoriesMap.get(cat)!.push(p);
    }
    
    return (
        <main className="container py-24 min-h-screen">
            <header className="mb-16 border-b border-slate-100 pb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                    <span className="text-emerald-500">Harta Site</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed max-w-4xl font-medium">
                    Navighează rapid prin toate secțiunile, produsele și locațiile în care oferim servicii de print digital.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-16">
                {/* Pages */}
                <section>
                    <h2 className="text-2xl font-black mb-8 text-slate-900 border-b pb-4">Pagini Principale</h2>
                    <ul className="flex flex-col gap-3">
                        <li><Link href="/" className="text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4">Acasă</Link></li>
                        <li><Link href="/shop" className="text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4">Toate Produsele</Link></li>
                        <li><Link href="/contact" className="text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4">Contact / Suport</Link></li>
                        <li><Link href="/termeni" className="text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4">Termeni și Condiții</Link></li>
                        <li><Link href="/politica-cookies" className="text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4">Politica de Cookie-uri</Link></li>
                    </ul>
                </section>

                {/* Categories & Products */}
                <section>
                    <h2 className="text-2xl font-black mb-8 text-slate-900 border-b pb-4">Produse & Categorii ({products.length})</h2>
                    <div className="flex flex-col gap-8">
                        {Array.from(categoriesMap.entries()).slice(0, 10).map(([cat, prods]) => (
                            <div key={cat}>
                                <h3 className="text-lg font-bold mb-3 text-slate-800 capitalize">{cat.replace(/-/g, ' ')}</h3>
                                <ul className="flex flex-col gap-2 pl-4 border-l-2 border-emerald-100">
                                    {prods.slice(0, 15).map(p => (
                                        <li key={p.id}>
                                            <Link href={p.routeSlug || `/shop/${cat}/${p.slug}`} className="text-slate-600 hover:text-emerald-600 text-sm">
                                                {p.title}
                                            </Link>
                                        </li>
                                    ))}
                                    {prods.length > 15 && (
                                        <li className="text-xs text-slate-400 italic">... și încă {prods.length - 15} produse</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Judete */}
                <section className="md:col-span-2 mt-8">
                    <h2 className="text-2xl font-black mb-8 text-slate-900 border-b pb-4">Acoperire Națională (Județe)</h2>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {JUDETE_FULL_DATA.map(j => (
                            <li key={j.slug}>
                                <Link href={`/judet/${j.slug}`} className="text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:underline">
                                    Județul {j.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}