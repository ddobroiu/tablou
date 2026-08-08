'use client';

import React, { useRef } from 'react';
import { Search, Loader2, ImagePlus, UploadCloud, X, LayoutGrid, Type } from 'lucide-react';
import { useFileUpload } from './useFileUpload';

interface LibraryPanelProps {
    activeTool: string | null;
    uploadedImages: string[];
    addElement: (type: 'image' | 'text', content: string) => void;
    // Props from useLibrarySearch
    pixabayQuery: string;
    setPixabayQuery: (q: string) => void;
    pixabayResults: any[];
    isSearching: boolean;
    pixabayTransparent: boolean;
    setPixabayTransparent: (v: boolean) => void;
    pixabayOrientation: string;
    setPixabayOrientation: (v: string) => void;
    pixabayError: string | null;
    performPixabaySearch: (q: string, loadMore?: boolean) => void;
    handlePixabaySearch: (e: React.FormEvent) => void;
    handleLoadMore: () => void;
    setPixabayPage: (p: number) => void;

    vectorQuery: string;
    setVectorQuery: (q: string) => void;
    vectorResults: any[];
    isSearchingVectors: boolean;
    vectorError: string | null;
    handleVectorSearch: (e: React.FormEvent) => void;
    handleLoadMoreVectors: () => void;

    // Props from useFileUpload
    handleUploadClick: () => void;
    handleBgUploadClick: () => void;
    background: string;
    setBackground: (v: string) => void;
    setActiveTool: (v: string | null) => void;
}

export const LibraryPanel: React.FC<LibraryPanelProps> = ({
    activeTool,
    uploadedImages,
    addElement,
    pixabayQuery, setPixabayQuery,
    pixabayResults, isSearching,
    pixabayTransparent, setPixabayTransparent,
    pixabayOrientation, setPixabayOrientation,
    pixabayError, performPixabaySearch, handlePixabaySearch, handleLoadMore,
    vectorQuery, setVectorQuery, vectorResults, isSearchingVectors, vectorError, handleVectorSearch, handleLoadMoreVectors,
    handleUploadClick, handleBgUploadClick, background, setBackground, setActiveTool
}) => {

    if (!['upload', 'bg', 'library', 'elements'].includes(activeTool || '')) return null;

    return (
        <div style={{
            height: '100%',
            overflowY: 'auto',
            paddingRight: '0.5rem'
        }} className="hide-scrollbar">

            {/* --- UPLOAD TOOL --- */}
            {activeTool === 'upload' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Încărcări</h3>
                    <button
                        onClick={handleUploadClick}
                        className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                    >
                        <UploadCloud size={20} /> Încarcă Imagine
                    </button>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {uploadedImages.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt="Upload"
                                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 border border-slate-200"
                                onClick={() => addElement('image', src)}
                            />
                        ))}
                        {uploadedImages.length === 0 && (
                            <div className="col-span-2 text-center text-slate-400 py-8 text-sm">
                                Nu ai încărcat imagini.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- LIBRARY (PIXABAY) TOOL --- */}
            {activeTool === 'library' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Bibliotecă Foto</h3>
                    <form onSubmit={handlePixabaySearch} className="relative">
                        <input
                            type="text"
                            className="w-full pl-3 pr-10 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                            placeholder="Caută imagini..."
                            value={pixabayQuery}
                            onChange={(e) => setPixabayQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600">
                            {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        </button>
                    </form>

                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        <label className="flex items-center gap-2 text-xs bg-slate-100 px-2 py-1 rounded cursor-pointer shrink-0 hover:bg-slate-200">
                            <input type="checkbox" checked={pixabayTransparent} onChange={(e) => setPixabayTransparent(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                            Transparent
                        </label>
                        <select
                            value={pixabayOrientation}
                            onChange={(e) => setPixabayOrientation(e.target.value)}
                            className="text-xs bg-slate-100 px-2 py-1 rounded border-none focus:ring-0 shrink-0 cursor-pointer hover:bg-slate-200"
                        >
                            <option value="all">Toate</option>
                            <option value="horizontal">Orizontal</option>
                            <option value="vertical">Vertical</option>
                        </select>
                    </div>

                    {pixabayError && <p className="text-red-500 text-xs">{pixabayError}</p>}

                    <div className="grid grid-cols-2 gap-2">
                        {pixabayResults.map((hit) => (
                            <div key={hit.id} className="relative group cursor-pointer" onClick={() => addElement('image', hit.url)}>
                                <img src={hit.preview} alt={hit.tags} className="w-full h-24 object-cover rounded bg-slate-100" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition rounded" />
                                <span className="absolute bottom-1 right-1 text-[9px] text-white/80 bg-black/40 px-1 rounded">Pixabay</span>
                            </div>
                        ))}
                    </div>
                    {pixabayResults.length > 0 && !isSearching && (
                        <button onClick={handleLoadMore} className="w-full py-2 text-sm text-emerald-600 font-semibold hover:bg-slate-50 dark:bg-slate-800 rounded mt-2">
                            Mai multe...
                        </button>
                    )}
                </div>
            )}

            {/* --- ELEMENTS (VECTORS) TOOL --- */}
            {activeTool === 'elements' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Elemente Grafice</h3>
                    <form onSubmit={handleVectorSearch} className="relative">
                        <input
                            type="text"
                            className="w-full pl-3 pr-10 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                            placeholder="Caută vectori..."
                            value={vectorQuery}
                            onChange={(e) => setVectorQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600">
                            {isSearchingVectors ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        </button>
                    </form>

                    {vectorError && <p className="text-red-500 text-xs">{vectorError}</p>}

                    <div className="grid grid-cols-3 gap-2">
                        {vectorResults.map((hit) => (
                            <div key={hit.id} className="relative group cursor-pointer aspect-square bg-slate-50 dark:bg-slate-800 p-1 rounded hover:bg-slate-100 border border-transparent hover:border-slate-200 transition" onClick={() => addElement('image', hit.url)}>
                                <img src={hit.preview} alt={hit.tags} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                    {vectorResults.length > 0 && !isSearchingVectors && (
                        <button onClick={handleLoadMoreVectors} className="w-full py-2 text-sm text-emerald-600 font-semibold hover:bg-slate-50 dark:bg-slate-800 rounded mt-2">
                            Mai multe...
                        </button>
                    )}
                </div>
            )}

            {/* --- BACKGROUND TOOL --- */}
            {activeTool === 'bg' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Fundal</h3>

                    <button
                        onClick={handleBgUploadClick}
                        className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-emerald-600 hover:border-emerald-600 transition flex items-center justify-center gap-2"
                    >
                        <ImagePlus size={18} /> Încarcă Fundal Propriu
                    </button>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <button onClick={() => setBackground('#ffffff')} className="aspect-square bg-white border border-slate-200 rounded hover:ring-2 ring-emerald-500" title="White"></button>
                        <button onClick={() => setBackground('#000000')} className="aspect-square bg-black border border-slate-200 rounded hover:ring-2 ring-emerald-500" title="Black"></button>
                        {/* Simple colors */}
                        {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map(c => (
                            <button key={c} onClick={() => setBackground(c)} className="aspect-square rounded hover:ring-2 ring-emerald-500 border border-transparent" style={{ background: c }}></button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

