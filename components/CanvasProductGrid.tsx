"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    slug: string;
    title: string;
    descriptionOriginal?: string;
    image: string;
    price: string | null;
    dimensions: string[];
    categories: string[];
    tags: string[];
    category: string;
    orientation?: string; // New field from smart scraper
    shape?: string;
}

import { useSearchParams } from 'next/navigation';

export default function CanvasProductGrid({ products, linkBase = 'canvas-product', showOrientationFilter = true }: { products: Product[], linkBase?: string, showOrientationFilter?: boolean }) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');

    // Normalize initial category strictly to avoid mismatches
    // We will validate it against available categories later, but for now just use it if present
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Toate');
    const [selectedOrientation, setSelectedOrientation] = useState<string>('Toate');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true); // Default open on desktop
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Helper to determine product orientation from its dimensions
    const getProductOrientation = (p: Product) => {
        // Priority 1: Use explicit orientation field from DB if exists
        if (p.shape === 'Round' || p.orientation === 'Round' || p.orientation === 'Circular' || p.tags?.some(t => t.toLowerCase() === 'round')) return 'Rotund';

        if (p.orientation) {
            if (p.orientation === 'Landscape' || p.orientation === 'Quer') return 'Landscape';
            if (p.orientation === 'Portret' || p.orientation === 'Hoch') return 'Portret';
            if (p.orientation === 'Pătrat' || p.orientation === 'square') return 'Pătrat';
            if (p.orientation === 'Panoramic') return 'Panoramic';
            return p.orientation;
        }

        // Priority 2: Fallback to dimension heuristic
        if (!p.dimensions || p.dimensions.length === 0) return 'Standard';

        const first = p.dimensions[0];
        const m = first.match(/(\d+)[x×](\d+)/);
        if (!m) return 'Standard';

        const w = parseInt(m[1]);
        const h = parseInt(m[2]);
        const ratio = w / h;

        if (ratio >= 0.95 && ratio <= 1.05) return 'Pătrat';
        if (ratio >= 1.8 || ratio <= 0.55) return 'Panoramic';
        if (w > h) return 'Landscape';
        return 'Portret';
    };

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        cats.add('Toate');

        products.forEach(p => {
            // Rely only on the formatted categories array from the scraper
            p.categories?.forEach(c => {
                const excluded = ['Canvas', 'Artă Murală', 'Tablou Canvas', 'Sticlă Acrilică', 'Panouri Sticlă Bucătărie']; // Added exclusion for generic parent
                if (!excluded.includes(c) && c.length > 2) {
                    cats.add(c);
                }
            });
        });

        return ['Toate', ...Array.from(cats).filter(c => c !== 'Toate').sort()];
    }, [products]);

    const orientations = ['Toate', 'Pătrat', 'Panoramic', 'Portret', 'Landscape', 'Rotund'];

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;

    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategory === 'Toate' || p.categories?.includes(selectedCategory);
            // Ignore orientation filter if showOrientationFilter is false
            const matchesOrientation = !showOrientationFilter || selectedOrientation === 'Toate' || getProductOrientation(p) === selectedOrientation;

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = query === "" ||
                p.title.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query)) ||
                p.id.toLowerCase().includes(query);

            return matchesCategory && matchesOrientation && matchesSearch;
        });
    }, [products, selectedCategory, selectedOrientation, searchQuery, showOrientationFilter]);

    // Reset page when a filter changes
    useMemo(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedOrientation, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const visibleProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // Scroll to top of products grid
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const displayedCategories = showAllCategories ? categories : categories.slice(0, 10);

    return (
        <div className="space-y-8">
            {/* Filter Group */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Caută model..."
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                            <Palette size={20} />
                        </div>
                    </div>

                    {/* Filters Container */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8 sticky top-24">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                Filtrare
                            </h3>
                            {(selectedCategory !== 'Toate' || (showOrientationFilter && selectedOrientation !== 'Toate')) && (
                                <button
                                    onClick={() => { setSelectedCategory('Toate'); setSelectedOrientation('Toate'); }}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <X size={12} /> Reset
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="w-full flex items-center justify-between group"
                            >
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Categorii Populare</h4>
                                {isCategoriesOpen ? (
                                    <ArrowUp size={16} className="text-gray-400 lg:hidden" />
                                ) : (
                                    <ArrowDown size={16} className="text-gray-400 lg:hidden" />
                                )}
                            </button>

                            <div className={`flex-col gap-1 ${isCategoriesOpen ? 'flex' : 'hidden'} lg:flex`}>
                                {displayedCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${selectedCategory === cat
                                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                                            : 'text-gray-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{cat}</span>
                                        {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                    </button>
                                ))}

                                {categories.length > 10 && (
                                    <button
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2 pl-2 text-left"
                                    >
                                        {showAllCategories ? "- Arată mai puțin" : `+ Vezi toate (${categories.length - 10} altele)`}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div >

                {/* Main Grid Area */}
                < div className="flex-1 min-w-0" >

                    {/* Horizontal Orientation Filter */}
                    {showOrientationFilter && (
                        < div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide" >
                            <div className="flex gap-3 min-w-max">
                                {orientations.map((orient) => (
                                    <button
                                        key={orient}
                                        onClick={() => setSelectedOrientation(orient)}
                                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${selectedOrientation === orient
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        {orient}
                                    </button>
                                ))}
                            </div>
                        </div >
                    )}

                    <div className="flex items-center justify-between mb-8 text-sm text-gray-500">
                        <span>Afișare {visibleProducts.length} din {filteredProducts.length} produse</span>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
                        {visibleProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        loading="lazy"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Categories Badge */}
                                    {product.categories && product.categories.length > 0 && (
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                            {product.categories.filter(c => c !== 'Canvas' && c !== 'Artă Murală' && c !== 'Panouri Sticlă Bucătărie').slice(0, 1).map(c => (
                                                <span key={c} className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className="absolute bottom-3 right-3">
                                        <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-md border border-gray-100">
                                            {(() => {
                                                const orient = getProductOrientation(product);
                                                let basePrice = 119;
                                                if (orient === 'Pătrat') basePrice = 109;
                                                if (orient === 'Panoramic') basePrice = 129;
                                                return `DE LA ${basePrice} LEI`;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                                            {product.title}
                                        </h3>

                                        {/* Tags - Hidden on card to save space, but used for filtering */}
                                    </div>

                                    {/* CTA Button */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <Link href={`/${linkBase}/${product.slug}`} className="block">
                                            <Button
                                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-xl h-10 font-bold transition-colors"
                                                size="sm"
                                            >
                                                Vezi Configurare
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {
                        totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 overflow-x-auto pb-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="h-10 w-10 shrink-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                        // Logic to show limited pages if many pages exist
                                        // Show first, last, and around current page
                                        if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                                            return (
                                                <Button
                                                    key={p}
                                                    variant={currentPage === p ? "default" : "outline"}
                                                    onClick={() => handlePageChange(p)}
                                                    className={`h-10 w-10 font-bold ${currentPage === p ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                                >
                                                    {p}
                                                </Button>
                                            );
                                        }
                                        if (p === currentPage - 3 || p === currentPage + 3) {
                                            return <span key={p} className="flex items-center justify-center w-8 h-10">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-10 w-10 shrink-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    }

                    {
                        filteredProducts.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">Nu am găsit produse în categoria sau orientarea selectată.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Toate');
                                        setSelectedOrientation('Toate');
                                    }}
                                    className="text-emerald-600 font-bold mt-2 hover:underline"
                                >
                                    Vezi toate produsele
                                </button>
                            </div>
                        )
                    }
                </div >
            </div >
        </div >
    );
}

