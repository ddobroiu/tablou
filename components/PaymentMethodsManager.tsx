"use client";

import { useState } from "react";

export default function PaymentMethodsManager() {
    const [showAddCard, setShowAddCard] = useState(false);

    // Simplified stub
    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Metode de plată</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Gestionează cardurile tale salvate pentru plăți rapide
                    </p>
                </div>
                <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl font-medium"
                >
                    {showAddCard ? "Anulează" : "Adaugă card"}
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Integrare plăți (Stripe) în curând.
                </p>
            </div>
        </div>
    );
}

