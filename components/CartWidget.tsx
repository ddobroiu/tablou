// components/CartWidget.tsx
"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  Trash2,
  Truck,
  Gift,
  ArrowRight,
  Plus,
  Minus,
  FileText,
  X,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { formatMoneyDisplay } from "@/lib/pricing";
import { getEstimatedShippingCost } from "@/lib/shippingUtils";

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartWidget() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartTotal
  );
  const progressPercent = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  async function exportOfferPdfServer() {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const shippingCost =
        cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : getEstimatedShippingCost('RO', items);

      const normalizedItems = items.map((it) => ({
        id: it.id,
        name:
          it.title ||
          (it as any).name ||
          (it as any).productName ||
          it.slug ||
          it.metadata?.title ||
          "Produs",
        quantity: it.quantity,
        unitAmount: it.price,
        totalAmount: it.price * it.quantity,
        artworkUrl: it.metadata?.artworkUrl || null,
        metadata: it.metadata || {},
      }));

      const res = await fetch("/api/pdf/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: normalizedItems, shipping: shippingCost }),
      });

      if (!res.ok) throw new Error("Generarea PDF a eșuat");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toLocaleDateString("ro-RO");
      a.href = url;
      a.download = `oferta-tablou-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "Nu s-a putut genera PDF-ul.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="relative flex items-center gap-2 px-2 sm:px-3 py-2 border-2 border-green-500 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all shadow-sm hover:shadow-md"
          aria-label="Deschide coșul de cumpărături"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-green-600 dark:text-green-400"
          >
            <path
              d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.2 16.5H17M17 16.5C15.9 16.5 15 17.4 15 18.5C15 19.6 15.9 20.5 17 20.5C18.1 20.5 19 19.6 19 18.5C19 17.4 18.1 16.5 17 16.5ZM9 18.5C9 19.6 8.1 20.5 7 20.5C5.9 20.5 5 19.6 5 18.5C5 17.4 5.9 16.5 7 16.5C8.1 16.5 9 17.4 9 18.5Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="text-green-600 dark:text-green-400 text-xs font-semibold leading-none mb-0.5">
              Coș ({cartCount})
            </span>
            <span className="text-slate-900 dark:text-white text-sm font-bold leading-none">
              {formatMoneyDisplay(cartTotal)}
            </span>
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full shadow-sm leading-none">
              {cartCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="cart-description"
        className="!fixed !inset-y-0 !right-0 !left-auto !top-0 !bottom-0 !h-screen !w-full sm:!max-w-[450px] !max-w-none !flex !flex-col !p-0 !gap-0 !rounded-none !border-l !border-slate-200 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !shadow-2xl !duration-300 !m-0 !translate-x-0 !translate-y-0 !z-[2000] data-[state=open]:!slide-in-from-right data-[state=closed]:!slide-out-to-right [&>button]:!hidden"
      >
        <p id="cart-description" className="sr-only">
          Coșul tău de cumpărături cu produsele adăugate
        </p>

        {/* HEADER */}
        <div className="shrink-0 z-20 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-4 py-3 flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-black text-black dark:text-white flex items-center gap-2">
              Coșul Tău{" "}
              <span className="text-black dark:text-slate-300 text-base font-bold font-sans">
                ({cartCount})
              </span>
            </DialogTitle>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200"
              aria-label="Închide coșul"
            >
              <X size={20} />
            </button>
          </div>

          {items.length > 0 && (
            <div className="px-4 pb-3">
              <button
                onClick={exportOfferPdfServer}
                disabled={isGeneratingPdf}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/50 text-green-700 dark:text-green-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 hover:bg-green-50 dark:hover:bg-slate-700"
              >
                {isGeneratingPdf ? (
                  <span className="animate-pulse">Se generează...</span>
                ) : (
                  <>
                    <FileText size={14} />
                    Descarcă Ofertă PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* BARĂ LIVRARE GRATUITĂ - Enhanced Design */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-y-2 border-slate-200 dark:border-green-900/30 shrink-0 bg-white dark:from-green-950/30 dark:to-emerald-950/30">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Truck size={16} className="text-white" />
                    </div>
                    Livrare Gratuită
                  </span>
                  <span className="text-xs text-slate-800 dark:text-slate-300 font-semibold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border-2 border-slate-300 dark:border-slate-700 shadow-sm">
                    încă{" "}
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      +{formatMoneyDisplay(remainingForFreeShipping)} RON
                    </span>
                  </span>
                </div>

                <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700 ease-out rounded-full shadow-lg"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-md">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                  Mai adaugă <span className="font-bold text-green-600 dark:text-green-400">{formatMoneyDisplay(remainingForFreeShipping)} RON</span> pentru transport gratuit
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-sm font-bold justify-center bg-emerald-50 dark:bg-emerald-950/30 py-3 px-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center animate-pulse">
                  <Gift size={16} className="text-white" />
                </div>
                <span>🎉 Beneficiezi de Livrare Gratuită!</span>
              </div>
            )}
          </div>
        )}

        {/* LISTĂ PRODUSE - Fix pentru scroll pe mobil */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 max-h-[calc(100vh-520px)] sm:max-h-[calc(100vh-420px)] px-4 py-4 space-y-4 bg-white dark:bg-slate-900 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Coșul este gol
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Nu ai adăugat încă niciun produs.
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Continuă Cumpărăturile
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const anyItem: any = item as any;
              const productTitle =
                item.title ||
                anyItem.name ||
                anyItem.productName ||
                item.slug ||
                item.metadata?.title ||
                "Produs";

              return (
                <div
                  key={item.id}
                  className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {/* IMAGINE PRODUS */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    {(() => {
                      // Căutăm imaginea în mai multe locuri
                      let imgSrc = item.metadata?.productImage ||
                        item.metadata?.image ||
                        item.metadata?.Imagine ||
                        item.metadata?.src ||
                        item.metadata?.imageUrl ||
                        item.metadata?.thumbnail ||
                        item.metadata?.artworkUrl;

                      // Dacă nu găsim imagine, încercăm să generăm una default bazată pe slug
                      if (!imgSrc && (item.slug || item.productId)) {
                        const slug = item.slug || item.productId || '';

                        // Mapăm slug-uri la imagini default
                        const defaultImages: Record<string, string> = {
                          'banner': '/products/banner/banner-1.webp',
                          'afise': '/products/afise/afise-1.webp',
                          'autocolante': '/products/autocolante/autocolante-1.webp',
                          'flayere': '/products/flayere/flayere-1.webp',
                          'pliante': '/products/pliante/pliante-1.webp',
                          'canvas': 'https://pub-5e0f8c0a4c03499b92d64adf2a42dd22.r2.dev/canvas/gutscheincode-für-dotcomcanvas-1.png',
                          'rollup': '/products/rollup/rollup-1.webp',
                          'tapet': '/products/tapet/tapet-1.webp',
                          'window-graphics': '/products/window-graphics/window-graphics-1.webp',
                        };

                        // Căutăm imaginea default bazată pe slug
                        for (const [key, defaultImg] of Object.entries(defaultImages)) {
                          if (slug.toLowerCase().includes(key)) {
                            imgSrc = defaultImg;
                            break;
                          }
                        }
                      }

                      if (!imgSrc) {
                        return (
                          <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800">
                            <ShoppingCart className="h-6 w-6 mb-1" />
                            <span className="text-[10px] font-medium">Produs</span>
                          </div>
                        );
                      }

                      return (
                        <img
                          src={imgSrc}
                          alt={productTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            el.onerror = null;
                            // Înlocuim cu placeholder în loc să ascundem
                            el.style.display = "none";
                            const parent = el.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="h-full w-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                                  <svg class="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                  </svg>
                                  <span class="text-[10px] font-medium">Produs</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      );
                    })()}
                  </div>

                  {/* DETALII PRODUS */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className="font-black text-base sm:text-lg text-black dark:text-white leading-snug flex-1 min-w-0"
                          style={{
                            overflow: "visible",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            display: "block",
                          }}
                        >
                          <Link
                            href={`/${item.slug || "shop"}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          >
                            {productTitle}
                          </Link>
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-700 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.width && item.height && (
                          <span className="text-[10px] text-black dark:text-slate-300 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                            {item.width}x{item.height}cm
                          </span>
                        )}
                        {item.metadata?.Material && (
                          <span className="text-[10px] text-black dark:text-slate-300 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                            {item.metadata.Material}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CANTITATE & PREȚ */}
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 h-7 px-3">
                        <span className="text-xs font-bold text-black dark:text-white" style={{ color: '#000000' }}>
                          {item.quantity} buc.
                        </span>
                      </div>
                      <p className="font-bold text-sm text-green-700 dark:text-green-400">
                        {formatMoneyDisplay(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER - STICKY LA BOTTOM */}
        {items.length > 0 && (
          <div className="sticky !bottom-0 border-t border-slate-100 dark:border-slate-800 p-3 lg:p-4 pb-safe bg-white dark:bg-slate-900 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] !z-50">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs text-slate-800 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Total Estimat
                </p>
                <p className="text-[10px] text-slate-700 dark:text-slate-400">
                  (TVA inclus)
                </p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoneyDisplay(cartTotal)}
              </p>
            </div>

            <div className="grid gap-2 lg:gap-3">
              <Button className="w-full h-11 lg:h-12 text-sm lg:text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200/50 dark:shadow-none rounded-xl transition-all" asChild>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Finalizează Comanda <ArrowRight className="ml-1 lg:ml-2 h-4 lg:h-5 w-4 lg:w-5" />
                </Link>
              </Button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-xs lg:text-sm font-semibold text-slate-900 dark:text-slate-300 hover:text-green-600 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <ChevronLeft size={14} className="lg:w-4 lg:h-4" /> Continuă Cumpărăturile
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
