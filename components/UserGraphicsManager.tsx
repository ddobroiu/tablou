"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw, X, ImageIcon, FileType } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definim interfața compatibilă cu modelul Prisma (OrderItem)
interface OrderItem {
    id: string;
    name: string;
    quantity: number; // Note: In schema it is 'quantity', Prynt code used 'qty' mapped from DB? 
    // Let's use 'quantity' as per Shopprint schema.
    // Wait, Prynt used 'qty'. Let's check Shopprint schema again.
    // Shopprint schema OrderItem: quantity Int.
    // Prynt schema might be different or mapped.
    // I will use 'quantity' here.
    artworkUrl?: string | null;
}

// Ensure interface matches what we pass. 
// If passing from Shopprint OrderItem, it has 'quantity'.
interface UserGraphicsManagerProps {
    items: any[]; // Use any[] to be flexible or define strict type
}

function getFileExtension(url: string) {
    try {
        const u = new URL(url);
        const path = u.pathname;
        return path.split('.').pop()?.toLowerCase();
    } catch {
        return url.split('.').pop()?.toLowerCase();
    }
}

export default function UserGraphicsManager({ items }: UserGraphicsManagerProps) {
    const router = useRouter();
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validare simplă 50MB
        if (file.size > 50 * 1024 * 1024) {
            alert("Fișierul este prea mare. Limita este de 50MB.");
            return;
        }

        setUploadingId(itemId);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "order_item_artwork");
        formData.append("publicId", itemId);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            let apiResponse: any;
            try {
                apiResponse = await res.json();
            } catch (e) {
                // const text = await res.text();
                throw new Error(res.statusText || 'Eroare upload');
            }
            console.log("Răspuns API upload:", apiResponse);
            if (!res.ok) throw new Error(apiResponse?.error || "Eroare upload");

            router.refresh();
        } catch (error) {
            console.error(error);
            alert(`Eroare la încărcare: ${error}`);
        } finally {
            setUploadingId(null);
        }
    };

    const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    Fișiere Grafice
                    <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                        {items.length} articole
                    </span>
                </h3>
                <button onClick={() => router.refresh()} className="h-8 flex items-center gap-1.5 px-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
                    <RefreshCw size={14} /> Actualizează
                </button>
            </div>

            <div className="grid gap-4">
                {sortedItems.map((item) => {
                    const artworkUrl = item.metadata?.artworkUrl || item.artworkUrl;
                    const ext = artworkUrl ? getFileExtension(artworkUrl) : null;
                    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff'].includes(ext || '');
                    const isPdf = ext === 'pdf';

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                        >
                            {/* Detalii Produs */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="shrink-0 inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                        {item.quantity || item.qty}x
                                    </span>
                                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                                        {item.name || "Produs Personalizat"}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2 mt-2">
                                    {item.metadata?.artworkUrl || item.artworkUrl ? (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                                            <CheckCircle size={12} />
                                            Fișier recepționat
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-md border border-amber-100 dark:border-amber-900/20">
                                            <AlertCircle size={12} />
                                            Așteaptă încărcarea
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Zona Butoane */}
                            <div className="shrink-0 w-full md:w-auto">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id={`upload-${item.id}`}
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, item.id)}
                                        disabled={uploadingId === item.id}
                                        accept="image/*,.pdf,.ai,.psd,.zip,.rar,.tiff"
                                    />

                                    {artworkUrl ? (
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            {/* Preview Zona */}
                                            {isImage ? (
                                                <a href={artworkUrl} target="_blank" rel="noopener noreferrer" className="group relative block w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                                    <img src={artworkUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                </a>
                                            ) : isPdf ? (
                                                <a href={artworkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                                                    <FileType size={20} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">PDF</span>
                                                        <span className="text-[10px] opacity-75">Vizualizare</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <a href={artworkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                                    <FileText size={20} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold uppercase">{ext || 'Fișier'}</span>
                                                        <span className="text-[10px] opacity-75">Descarcă</span>
                                                    </div>
                                                </a>
                                            )}

                                            <label
                                                htmlFor={`upload-${item.id}`}
                                                className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                            >
                                                {uploadingId === item.id ? <Loader2 className="animate-spin" size={14} /> : "Înlocuiește"}
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <label
                                                htmlFor={`upload-${item.id}`}
                                                className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-md text-sm font-medium transition-colors"
                                            >
                                                {uploadingId === item.id ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" /> Se încarcă...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} /> Încarcă Grafica
                                                    </>
                                                )}
                                            </label>
                                            <p className="text-[10px] text-zinc-400 text-center">
                                                PDF, AI, TIFF, ZIP (max 50MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

