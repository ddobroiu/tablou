import React from 'react';
import { ShoppingCart } from 'lucide-react';

type Props = {
    price: number;
    textPrice?: string;
    deliveryText?: string;
    onAddToCart: () => void;
    isValid?: boolean;
    uploading?: boolean;
};

export default function ConfiguratorStickyFooter({ price, textPrice, deliveryText, onAddToCart, isValid = true, uploading = false }: Props) {
    const fmt = (n: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
    const displayPrice = textPrice || fmt(price);

    return (
        <div className="static mt-8 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.08)] z-50 lg:hidden block animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{displayPrice}</div>
                    {deliveryText && (
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {deliveryText}
                        </div>
                    )}
                </div>

                <button
                    onClick={onAddToCart}
                    disabled={!isValid || uploading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    {uploading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                        <ShoppingCart size={18} />
                    )}
                    <span>Adaugă</span>
                </button>
            </div>
        </div>
    );
}

