import React from 'react';
import Link from 'next/link';
import { getPopularSizes, getSizesForProduct, dimensionUrl, isDimensionProduct } from '@/lib/seo/dimensionPages';

interface SeoDimensionsLinksProps {
    productId: string;
    productName: string;
    currentW: number;
    currentH: number;
}

/**
 * Link-uri vizibile către paginile de dimensiune ale produsului
 * (/dimensiuni/{produs}/{L}x{H}). Înlocuiește vechea listă ascunsă de
 * link-uri către /configurator/{produs}-{L}x{H}: paginile de dimensiune au
 * acum conținut real (preț, greutate, fișier, montaj), deci merită arătate.
 */
export const SeoDimensionsLinks: React.FC<SeoDimensionsLinksProps> = ({
    productId,
    productName,
    currentW,
    currentH
}) => {
    if (!isDimensionProduct(productId)) return null;
    const total = getSizesForProduct(productId).length;
    if (total === 0) return null;
    const popular = getPopularSizes(productId, 12).filter((s) => !(s.w === currentW && s.h === currentH));

    return (
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Prețuri pe dimensiuni pentru {productName}</h2>
            <p className="text-sm text-slate-500 mt-1 mb-5">
                {total} formate cu preț calculat, greutate, rezoluție de fișier și recomandări de montaj.
            </p>
            <div className="flex flex-wrap gap-2">
                {popular.map((s) => (
                    <Link
                        key={`${s.w}x${s.h}`}
                        href={dimensionUrl(productId, s.w, s.h)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all"
                    >
                        {productName} {s.w}×{s.h} cm
                    </Link>
                ))}
                <Link
                    href={`/dimensiuni/${productId}`}
                    className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all"
                >
                    Toate dimensiunile →
                </Link>
            </div>
        </section>
    );
};
