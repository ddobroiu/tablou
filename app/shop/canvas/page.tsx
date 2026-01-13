import { Metadata } from 'next';
import CanvasProductGrid from '@/components/CanvasProductGrid';
import { canvasProducts } from '@/lib/products/canvas-products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Tablouri Canvas Premium | Tablou.net',
    description: 'Descoperă colecția noastră de tablouri canvas premium. Print de înaltă calitate pe pânză textilă, întins pe șasiu de lemn. Livrare rapidă în România.',
    keywords: ['tablouri canvas', 'canvas personalizat', 'tablou perete', 'decoratiuni', 'art print', 'panza'],
};

export default function CanvasPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            {/* Products Grid */}
            <section id="products" className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Colecția de Tablouri
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {canvasProducts.length > 0
                            ? `Descoperă ${canvasProducts.length} tablouri canvas unice, pregătite special pentru spațiul tău.`
                            : 'Colecția se încarcă...'
                        }
                    </p>
                </div>

                <CanvasProductGrid products={canvasProducts} />
            </section>
        </div>
    );
}
