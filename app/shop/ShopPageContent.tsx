"use client";

import React, { useMemo, useEffect, useTransition, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Search,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

// --- CONFIGURARE ---
const PRODUCTS_PER_PAGE = 16;

// --- CONFIGURARE PREȚURI DE PORNIRE ---
const STARTING_PRICES: Record<string, number> = {
    bannere: 50,
    canvas: 79,
    flayere: 50,
    flyere: 50,
    afise: 3,
    autocolante: 5,
    tapet: 150,
    modele: 29,
    "pvc-forex": 45,
    alucobond: 120,
    plexiglass: 80,
    carton: 30,
    polipropilena: 40,
    configuratoare: 50,
    "carti-vizita": 45,
    "carti-vizita-plastic": 120,
    "carti-vizita-transparente": 150,
    "carti-vizita-lemn": 350,
    "carti-vizita-metalice": 450,
};

export default function ShopPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // --- 1. Sursa de Adevăr: URL Params ---
    const selectedCategory = searchParams.get("category") || "Toate";
    const selectedSubcategory = searchParams.get("subcategory") || "Toate";
    const selectedArthubSubcategory = searchParams.get("detail") || "Toate";
    const searchTerm = searchParams.get("search") || "";
    const minPrice = searchParams.get("min") || "";
    const maxPrice = searchParams.get("max") || "";
    const [currentPage, setCurrentPage] = useState(1);
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());


    // --- 2. Helper pentru actualizarea URL-ului ---
    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "Toate") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset subcategories if category changes
        if (updates.category && updates.category !== selectedCategory) {
            params.delete("subcategory");
            params.delete("detail");
        }
        // Reset detail if subcategory changes
        if (updates.subcategory && updates.subcategory !== selectedSubcategory) {
            params.delete("detail");
        }

        const newUrl = `${pathname}?${params.toString()}`;

        startTransition(() => {
            router.push(newUrl, { scroll: false });
        });
        setCurrentPage(1); // Reset page on filter change
    };

    // --- 3. Pregătim datele (Categorii, Produse) ---

    // 3a. Produse prelucrate (și filtrate pentru Shop)
    const allProducts = useMemo(() => {
        return PRODUCTS
            // Nu vrem produsele generate pentru SEO ca "categorii" în Shop.
            // Ele trebuie să existe pentru rute/landing-uri, dar nu pentru browse în /shop.
            .filter((p) => !(p.metadata?.isSeoCampaign === true || String(p.metadata?.category ?? "").toLowerCase() === "campanii-seo"))
            .map((p) => {
            const cat = String(p.metadata?.category ?? "").toLowerCase();
            const price = STARTING_PRICES[cat] ?? p.priceBase ?? 0;
            return {
                ...p,
                processedCategory: String(p.metadata?.category ?? ""),
                processedSubcategory: String(p.metadata?.subcategory ?? ""),
                processedLabel: String(p.metadata?.subcategoryLabel ?? ""),
                price: price
            };
        });
    }, []);

    // 3b. Lista Categorii
    const categories = useMemo(() => {
        const cats = new Set(allProducts.map((p) => p.processedCategory.toLowerCase()).filter(Boolean));

        const displayMap = new Map<string, string>();
        allProducts.forEach(p => {
            if (p.processedCategory) displayMap.set(p.processedCategory.toLowerCase(), p.processedCategory);
        });

        const list = Array.from(cats).map(c => displayMap.get(c) || c.charAt(0).toUpperCase() + c.slice(1));

        const sorted = list.sort((a, b) => {
            const order = ["Modele", "Semnalistică", "Configuratoare"];
            const indexA = order.indexOf(a);
            const indexB = order.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        return ["Toate", ...sorted];
    }, [allProducts]);

    // 3c. Lista Subcategorii (Dinamică, bazată pe categoria selectată)
    const subcategories = useMemo(() => {
        if (selectedCategory === "Toate") return [];

        const subcats = new Set<string>();
        const selCatLower = selectedCategory.toLowerCase();

        allProducts
            .filter(p => p.processedCategory.toLowerCase() === selCatLower)
            .forEach(p => {
                if (p.processedSubcategory) subcats.add(p.processedSubcategory);
                if (Array.isArray(p.metadata?.categories)) {
                    p.metadata.categories.forEach((c: string) => subcats.add(c));
                }
            });

        return subcats.size > 0 ? ["Toate", ...Array.from(subcats)] : [];
    }, [selectedCategory, allProducts]);

    // 3d. Lista Detalii (Arthub/Modele)
    const arthubSubcategories = useMemo(() => {
        const catLower = selectedCategory.toLowerCase();
        if ((catLower !== "canvas" && catLower !== "modele") || selectedSubcategory === "Toate") {
            return [];
        }

        const selSubLower = selectedSubcategory.toLowerCase();
        const detailSubcats = new Set(
            allProducts
                .filter(p =>
                    p.processedCategory.toLowerCase() === catLower &&
                    p.processedSubcategory.toLowerCase() === selSubLower
                )
                .map(p => p.processedLabel)
                .filter(Boolean)
        );

        return detailSubcats.size > 0 ? ["Toate", ...Array.from(detailSubcats)] : [];
    }, [selectedCategory, selectedSubcategory, allProducts]);


    // --- 4. Filtrare Finală ---
    const filteredProducts = useMemo(() => {
        return allProducts.filter((p) => {
            // Categorie
            if (selectedCategory !== "Toate" && p.processedCategory.toLowerCase() !== selectedCategory.toLowerCase()) return false;

            // Subcategorie
            if (selectedSubcategory !== "Toate") {
                const subLower = selectedSubcategory.toLowerCase();
                const pSub = p.processedSubcategory.toLowerCase();
                let match = pSub === subLower;
                // Verificam si array-ul de categorii secundare
                if (!match && Array.isArray(p.metadata?.categories)) {
                    match = p.metadata.categories.some((c: string) => c.toLowerCase() === subLower);
                }
                if (!match) return false;
            }

            // Detaliu
            if (selectedArthubSubcategory !== "Toate" && p.processedLabel.toLowerCase() !== selectedArthubSubcategory.toLowerCase()) return false;

            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const text = `${p.title} ${p.description || ""} ${p.tags?.join(" ") || ""}`.toLowerCase();
                if (!text.includes(term)) return false;
            }

            // Pret
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;
            if (p.price < min || p.price > max) return false;

            return true;
        });
    }, [allProducts, selectedCategory, selectedSubcategory, selectedArthubSubcategory, searchTerm, minPrice, maxPrice]);

    // --- 5. Paginare ---
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // --- State local input-uri ---
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);

    // Debounce search/price updates
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchTerm) updateFilters({ search: localSearch });
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localMin !== minPrice) updateFilters({ min: localMin });
            if (localMax !== maxPrice) updateFilters({ max: localMax });
        }, 500);
        return () => clearTimeout(timer);
    }, [localMin, localMax]);


    const hasActiveFilters = selectedCategory !== "Toate" || selectedSubcategory !== "Toate" || selectedArthubSubcategory !== "Toate" || searchTerm !== "" || minPrice !== "" || maxPrice !== "";

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* --- HEADER VISUAL --- */}
            <div className="relative bg-slate-950 border-b border-slate-900 pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 transition-colors">
                 {/* Premium Background Effects */}
                 <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                 <div className="absolute bottom-[-20%] left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Premium</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl font-medium">
                        Explorează colecția noastră completă de produse printate digital la calitate de studio.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR (FILTRE) --- */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-6">

                        {/* 1. SEARCH */}
                        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 transition-all hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
                            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <Search size={16} className="text-emerald-500" /> Căutare
                            </h3>
                            <div className="relative">
                                <input
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    placeholder="Caută produse..."
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                />
                                {localSearch && (
                                    <button
                                        onClick={() => { setLocalSearch(""); updateFilters({ search: "" }) }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. CATEGORII (Listă Verticală & Subcategorii Nested) */}
                        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 transition-all hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
                            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <Filter size={16} className="text-emerald-500" /> Categorii
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory === cat;
                                    const isExpanded =
                                        isSelected &&
                                        !collapsedCategories.has(cat) &&
                                        subcategories.length > 0;
                                    return (
                                        <div key={cat} className="space-y-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setCollapsedCategories((prev) => {
                                                            const next = new Set(prev);
                                                            if (next.has(cat)) next.delete(cat);
                                                            else next.add(cat);
                                                            return next;
                                                        });
                                                    } else {
                                                        updateFilters({ category: cat });
                                                        setCollapsedCategories((prev) => {
                                                            const next = new Set(prev);
                                                            next.delete(cat);
                                                            return next;
                                                        });
                                                    }
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between group flex-wrap gap-2 ${isSelected
                                                    ? "bg-slate-950 text-white font-black shadow-lg shadow-slate-900/10"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-bold"
                                                    }`}
                                            >
                                                {cat}
                                                {isSelected && (
                                                    <ChevronDown
                                                        size={14}
                                                        className={`text-emerald-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                                    />
                                                )}
                                                {!isSelected && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-400" />}
                                            </button>

                                            {/* RENDER SUBCATEGORIES IF CATEGORY IS SELECTED */}
                                            {isExpanded && (
                                                <div className="pl-4 pr-2 py-2 space-y-1 animate-in slide-in-from-left-1 duration-200 border-l-2 border-slate-100 ml-4 relative">
                                                    <button
                                                        onClick={() => updateFilters({ subcategory: "Toate" })}
                                                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${selectedSubcategory === "Toate"
                                                            ? "text-emerald-700 bg-emerald-50"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                            }`}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === "Toate" ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                                                        Toate
                                                    </button>

                                                    {subcategories.map((subcat) => (
                                                        <button
                                                            key={subcat}
                                                            onClick={() => updateFilters({ subcategory: subcat })}
                                                            className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${selectedSubcategory === subcat
                                                                ? "text-emerald-700 bg-emerald-50"
                                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                                }`}
                                                        >
                                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === subcat ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                                                            {subcat}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        {/* 4. RAFINARE (Arthub Detail - Nivel 3) */}
                        {arthubSubcategories.length > 0 && (
                            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 transition-all hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] animate-fade-in-up">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Tip {selectedSubcategory}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => updateFilters({ detail: "Toate" })} className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${selectedArthubSubcategory === "Toate" ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-900/10" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Toate</button>
                                    {arthubSubcategories.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => updateFilters({ detail: sub })}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${selectedArthubSubcategory === sub ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-900/10" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"}`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. PREȚ */}
                        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 transition-all hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
                            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                                Interval Preț
                            </h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localMin}
                                    onChange={e => setLocalMin(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                                />
                                <span className="text-slate-300 font-bold">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localMax}
                                    onChange={e => setLocalMax(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* RESET FILTERS */}
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    updateFilters({ category: "Toate", subcategory: null, detail: null, search: null, min: null, max: null });
                                    setLocalSearch(""); setLocalMin(""); setLocalMax("");
                                }}
                                className="w-full py-4 bg-red-50 text-red-600 font-black tracking-widest uppercase text-xs rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={16} strokeWidth={3} /> Șterge Filtre
                            </button>
                        )}
                    </aside>


                    {/* --- MAIN CONTENT (GRID) --- */}
                    <div className="flex-1 min-w-0">
                        {/* Results Header */}
                        <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-100/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="font-black text-xl text-slate-900 tracking-tight">
                                    {selectedCategory !== "Toate" ? selectedCategory : "Toate Produsele"}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    <span className="font-black text-slate-900">{filteredProducts.length}</span> rezultate găsite
                                </p>
                            </div>

                            {/* Tags for active filters */}
                            <div className="flex flex-wrap gap-2">
                                {selectedSubcategory !== "Toate" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                                        {selectedSubcategory} <button onClick={() => updateFilters({ subcategory: "Toate" })} className="hover:bg-emerald-200/50 rounded-full p-0.5 transition-colors"><X size={12} strokeWidth={3} /></button>
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                                        "{searchTerm}" <button onClick={() => { updateFilters({ search: "" }); setLocalSearch("") }} className="hover:bg-emerald-200/50 rounded-full p-0.5 transition-colors"><X size={12} strokeWidth={3} /></button>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* PRODUCTS GRID */}
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
                                    {paginatedProducts.map((product, index) => (
                                        <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                                            <ProductCard product={product as any} priority={index < 12} />
                                        </div>
                                    ))}
                                </div>

                                {/* PAGINATION */}
                                {totalPages > 1 && (
                                    <div className="mt-14 flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-900 transition-colors shadow-sm"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <div className="flex items-center gap-1 bg-white px-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <span className="text-sm font-bold text-slate-600">Pagina <span className="text-slate-950">{currentPage}</span> din <span className="text-slate-950">{totalPages}</span></span>
                                        </div>

                                        <button
                                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === totalPages}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-900 transition-colors shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={36} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Nu am găsit produse</h3>
                                <p className="text-slate-500 font-medium">Încearcă să ștergi filtrele curente sau caută un alt termen.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
            `}</style>
        </main>
    );
}

