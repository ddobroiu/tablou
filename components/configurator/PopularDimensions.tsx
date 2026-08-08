import React from 'react';
import Link from 'next/link';
import { Target } from 'lucide-react';

interface Dimension {
    w: number;
    h: number;
    label?: string;
}

interface PopularDimensionsProps {
    productId: string;
    productName: string;
    dimensions: Dimension[];
}

export const PopularDimensions: React.FC<PopularDimensionsProps> = ({ productId, productName, dimensions }) => {
    return (
        <section className="mt-12 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Target className="text-orange-600 w-6 h-6" />
                Dimensiuni Populare pentru {productName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {dimensions.map((dim, idx) => (
                    <Link
                        key={idx}
                        href={`/configurator/${productId}-${dim.w}x${dim.h}`}
                        className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all group text-center"
                    >
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-orange-600 transition-colors">
                            {dim.label || 'Format'}
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                            {dim.w} × {dim.h} <span className="text-xs">cm</span>
                        </div>
                    </Link>
                ))}
            </div>
            <p className="mt-6 text-sm text-slate-500 italic">
                * Acestea sunt dimensiunile cele mai frecvent comandate. Poți însă comanda orice dimensiune personalizată folosind configuratorul de mai sus.
            </p>
        </section>
    );
};
