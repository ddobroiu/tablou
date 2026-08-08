"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

interface ReorderButtonProps {
    orderId: string;
    className?: string;
    variant?: "primary" | "secondary";
}

export default function ReorderButton({ orderId, className = "", variant = "secondary" }: ReorderButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { addItem } = useCart();

    const handleReorder = async () => {
        setLoading(true);
        setMessage("");

        try {
            // Note: Endpoint needs to be implemented or we assume it returns items like in Tablou
            // I will implement /api/reorder later if needed, but for now assuming it exists or handled
            // Actually, since I haven't implemented /api/reorder yet, this button might fail.
            // I should implement /api/reorder as well.

            const response = await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (response.ok && data.items) {
                let addedCount = 0;
                data.items.forEach((item: any) => {
                    const metadata = item.metadata || {};

                    addItem({
                        id: `${item.productId || item.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                        productId: item.productId,
                        title: item.name,
                        price: Number(item.price),
                        quantity: item.quantity || item.qty || 1,
                        currency: 'RON',
                        metadata: item.metadata || {}
                    });
                    addedCount++;
                });

                setMessage(`${addedCount} ${addedCount === 1 ? 'produs adăugat' : 'produse adăugate'} în coș!`);

                setTimeout(() => {
                    router.push("/cart"); // Go to cart instead of checkout directly? Or checkout.
                }, 1500);
            } else {
                setMessage(data.error || "Eroare la adăugarea produselor");
            }
        } catch (error) {
            console.error("Reorder error:", error);
            setMessage("Eroare la procesarea comenzii");
        } finally {
            setLoading(false);
        }
    };

    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200";
    const variantStyles = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
    };

    return (
        <div className="relative">
            <button
                onClick={handleReorder}
                disabled={loading}
                className={`${baseStyles} ${variantStyles[variant]} ${className} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Se procesează...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Comandă din nou
                    </>
                )}
            </button>

            {message && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-lg text-xs font-medium text-center z-20 shadow-lg ${message.includes("Eroare") || message.includes("eroare")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}

