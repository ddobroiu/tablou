
"use client";

import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartContext";

interface Attribute {
    name: string;
    options: string[];
}

interface Variation {
    id: number;
    price: number;
    regularPrice: number | null;
    attributes: Record<string, string>;
    sku: string | null;
}

interface ProductFormProps {
    product: {
        id: number;
        name: string;
        price: number;
        regularPrice: number | null;
        type: string;
        image?: string;
    };
    attributes: Attribute[];
    variations: Variation[];
}

export default function ProductForm({ product, attributes, variations }: ProductFormProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();

    // Initialize selected options if they are not set
    useMemo(() => {
        if (attributes.length > 0 && Object.keys(selectedOptions).length === 0) {
            const initial: Record<string, string> = {};
            attributes.forEach(attr => {
                initial[attr.name] = attr.options[0];
            });
            setSelectedOptions(initial);
        }
    }, [attributes]);

    // Find current variation based on selection
    const currentVariation = useMemo(() => {
        if (product.type !== 'variable') return null;
        return variations.find(v => {
            return Object.entries(selectedOptions).every(([name, value]) => {
                return v.attributes[name] === value;
            });
        });
    }, [selectedOptions, variations, product.type]);

    const displayPrice = currentVariation ? currentVariation.price : product.price;
    const displayRegularPrice = currentVariation ? currentVariation.regularPrice : product.regularPrice;

    const handleAddToCart = () => {
        setIsAdding(true);

        // Create a unique ID for this item + variation
        const cartId = currentVariation ? `var-${currentVariation.id}` : `prod-${product.id}`;

        addItem({
            id: cartId,
            productId: String(product.id),
            title: product.name,
            price: displayPrice,
            quantity: 1,
            currency: 'RON',
            metadata: {
                variationId: currentVariation?.id,
                ...selectedOptions, // Spread options directly into metadata or under 'options'
                // Let's spread them for easier display in cart if we filter by keys
                artworkUrl: product.image
            }
        });

        // Small delay for visual feedback
        setTimeout(() => {
            setIsAdding(false);
        }, 800);
    };

    return (
        <div className="space-y-8">
            {/* Selection Area */}
            {attributes.map((attr) => (
                <div key={attr.name} className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Selectează {attr.name}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {attr.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: option }))}
                                className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${selectedOptions[attr.name] === option
                                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Dynamic Price Display */}
            <div className="flex items-baseline gap-4 py-6 border-t border-neutral-900">
                <span className="text-5xl font-black text-white">{displayPrice.toFixed(2)} Lei</span>
                {displayRegularPrice && displayRegularPrice > displayPrice && (
                    <span className="text-xl text-neutral-600 line-through">Reg. {displayRegularPrice.toFixed(2)} Lei</span>
                )}
            </div>

            {/* Add To Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 px-10 py-6 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl uppercase tracking-widest ${isAdding
                        ? "bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-white hover:bg-emerald-600 text-black hover:text-white shadow-emerald-500/10"
                        }`}
                >
                    {isAdding ? "Adăugat!" : (
                        <>
                            <ShoppingCart size={24} strokeWidth={2.5} />
                            Adaugă în Coș
                        </>
                    )}
                </button>
                <button className="px-8 py-6 rounded-2xl border border-neutral-800 hover:bg-neutral-900 transition-all font-bold text-sm uppercase tracking-widest text-neutral-400 hover:text-white">
                    Wishlist
                </button>
            </div>
        </div>
    );
}

