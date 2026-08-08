import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // Kept if needed by other sections, though not by grid anymore
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, Sparkles, Shield, Truck } from 'lucide-react';
import CanvasProductGrid from '@/components/CanvasProductGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Tablouri Canvas Premium',
    description: 'Explorează colecția noastră de tablouri canvas premium. Sute de modele predefinite pentru decorul casei tale. Print de înaltă calitate pe pânză textilă,...',
    keywords: ['tablouri canvas', 'modele tablouri', 'decor perete canvas', 'artă murală', 'panza foto', 'tablouri sufragerie'],
    alternates: {
        canonical: '/shop/canvas',
    },
};

// Vom încărca produsele din JSON după ce rulăm scraperul
const getCanvasProducts = async () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'lib', 'products', 'canvas-products.json');

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading canvas products:', error);
    }
    return [];
};

export default async function CanvasPage() {
    const products = await getCanvasProducts();

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Products Grid */}
            <section id="products" className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Colecția de Tablouri
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {products.length > 0
                            ? `Descoperă ${products.length} tablouri canvas unice, pregătite special pentru spațiul tău.`
                            : 'Colecția se încarcă...'
                        }
                    </p>
                </div>

                <CanvasProductGrid products={products} />
            </section>
        </div>
    );
}

