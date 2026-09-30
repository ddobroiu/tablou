"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ShoppingCart, UploadCloud, MessageCircle, Info } from "lucide-react";
import { useCart } from "@/components/CartContext";
import DeliveryEstimation from "@/components/configurator/DeliveryEstimation";
import { NumberInput } from "@/components/configurator/ui/NumberInput";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";
import { VAT_NOTE_SENTENCE } from "@/lib/company";
import {
  findVariant,
  qtyUnitPrice,
  sqmPrice,
  type CatalogProduct,
} from "@/lib/catalog/types";

type ArtworkMode = "upload" | "later";

const whatsappNumber = siteConfig.phone.replace(/\D/g, "").replace(/^0/, "40");

function firstAvailableSelection(p: CatalogProduct): string[] {
  if (p.kind === "variant" && p.variants?.length) return [...p.variants[0].o];
  if (p.kind === "qty" && p.qty?.rows.length) {
    const row = p.qty.rows.find((r) => r.p.some((x) => x !== null)) ?? p.qty.rows[0];
    return [...row.o];
  }
  return p.options.map((o) => o.values[0]);
}

export default function CatalogProductView({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selection, setSelection] = useState<string[]>(() => firstAvailableSelection(product));
  const [quantity, setQuantity] = useState(product.qty?.minQty ?? 1);
  const [materialIdx, setMaterialIdx] = useState(0);
  const [widthCm, setWidthCm] = useState(100);
  const [heightCm, setHeightCm] = useState(100);
  const [artworkMode, setArtworkMode] = useState<ArtworkMode>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const needsArtwork = product.artwork !== "none";

  /** Dacă o valoare nu are nicio variantă compatibilă cu restul selecției, o dezactivăm. */
  const isValueAvailable = (optIdx: number, value: string): boolean => {
    const trial = [...selection];
    trial[optIdx] = value;
    if (product.kind === "variant") {
      return !!product.variants?.some((v) => v.o[optIdx] === value);
    }
    if (product.kind === "qty" && product.qty) {
      return product.qty.rows.some((r) => r.o[optIdx] === value && r.p.some((x) => x !== null));
    }
    return true;
  };

  const choose = (optIdx: number, value: string) => {
    const next = [...selection];
    next[optIdx] = value;
    if (product.kind === "variant" && !findVariant(product, next)) {
      // Păstrăm alegerea făcută și potrivim restul opțiunilor pe prima variantă compatibilă.
      const match = product.variants?.find((v) => v.o[optIdx] === value);
      if (match) {
        setSelection([...match.o]);
        return;
      }
    }
    if (product.kind === "qty" && product.qty && qtyUnitPrice(product.qty, next, quantity) === null) {
      const match = product.qty.rows.find((r) => r.o[optIdx] === value && r.p.some((x) => x !== null));
      if (match) {
        setSelection([...match.o]);
        return;
      }
    }
    setSelection(next);
  };

  const sqmMaterial = product.sqm?.materials[materialIdx];
  const maxW = product.sqm?.maxWidthCm;
  const maxH = product.sqm?.maxHeightCm;
  const sizeError =
    product.kind === "sqm" &&
    ((maxW && widthCm > maxW && heightCm > maxW) || (maxH && widthCm > maxH && heightCm > maxH))
      ? `Dimensiunea maximă este ${maxW ?? maxH} cm pe una dintre laturi.`
      : null;

  const pricing = useMemo(() => {
    if (product.kind === "variant") {
      const v = findVariant(product, selection);
      return v ? { unit: v.p, total: v.p * quantity } : null;
    }
    if (product.kind === "sqm" && sqmMaterial) {
      const r = sqmPrice(sqmMaterial, widthCm, heightCm, quantity);
      return { unit: r.unit, total: r.total, perSqm: r.perSqm, totalSqm: r.totalSqm };
    }
    if (product.kind === "qty" && product.qty) {
      const unit = qtyUnitPrice(product.qty, selection, quantity);
      return unit === null ? null : { unit, total: Math.round(unit * quantity * 100) / 100 };
    }
    return null;
  }, [product, selection, quantity, sqmMaterial, widthCm, heightCm]);

  const handleFile = async (file: File | null) => {
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Încărcarea a eșuat. Încearcă din nou sau trimite fișierul ulterior.");
      const data = await res.json();
      setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la încărcare");
    } finally {
      setUploading(false);
    }
  };

  const canAdd =
    !!pricing &&
    pricing.total > 0 &&
    !sizeError &&
    !(needsArtwork && product.artwork === "required" && artworkMode === "upload" && !artworkUrl);

  const handleAdd = () => {
    if (!pricing || !canAdd) return;
    const metadata: Record<string, any> = { Categorie: product.category };
    product.options.forEach((o, i) => {
      if (selection[i]) metadata[o.name] = selection[i];
    });
    if (product.kind === "sqm" && sqmMaterial) {
      metadata["Material"] = sqmMaterial.name;
      metadata["Dimensiune"] = `${widthCm} x ${heightCm} cm`;
      metadata["width"] = widthCm;
      metadata["height"] = heightCm;
    }
    if (needsArtwork) {
      if (artworkMode === "upload" && artworkUrl) {
        metadata["Grafică"] = "Grafică proprie (încărcată)";
        metadata["artworkUrl"] = artworkUrl;
      } else if (artworkMode === "later") {
        metadata["Grafică"] = "Trimisă ulterior";
      }
    }
    const key = [...selection, product.kind === "sqm" ? `${widthCm}x${heightCm}-${materialIdx}` : ""].join("|");
    addItem({
      id: `cat-${product.slug}-${key}-${Date.now()}`,
      productId: `cat-${product.slug}`,
      slug: product.slug,
      title: product.title,
      price: pricing.unit,
      quantity,
      image: product.images[0],
      ...(product.kind === "sqm" ? { width: widthCm, height: heightCm } : {}),
      metadata,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const images = product.images.length ? product.images : ["/logo.png"];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Galerie */}
      <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200">
          <Image
            src={images[activeImage]}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-white border ${i === activeImage ? "border-slate-900 ring-2 ring-slate-900/20" : "border-slate-200"}`}
                aria-label={`Imaginea ${i + 1}`}
              >
                <Image src={src} alt="" fill className="object-contain p-1" sizes="120px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Configurare */}
      <div className="w-full lg:w-1/2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{product.title}</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">{product.short}</p>

        <div className="mt-6 space-y-6">
          {product.kind === "sqm" && product.sqm && (
            <>
              {product.sqm.materials.length > 1 && (
                <fieldset>
                  <legend className="block text-sm font-bold text-slate-900 mb-2">Material</legend>
                  <div className="flex flex-wrap gap-2">
                    {product.sqm.materials.map((m, i) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setMaterialIdx(i)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border ${materialIdx === i ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"}`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-sm font-bold text-slate-900 mb-1">Lățime (cm)</span>
                  <input
                    type="number"
                    min={1}
                    value={widthCm}
                    onChange={(e) => setWidthCm(Math.max(0, parseInt(e.target.value || "0", 10)))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-bold text-slate-900 mb-1">Înălțime (cm)</span>
                  <input
                    type="number"
                    min={1}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(0, parseInt(e.target.value || "0", 10)))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </label>
              </div>
              {sizeError && <p className="text-sm text-red-600">{sizeError}</p>}
            </>
          )}

          {product.options.map((opt, optIdx) =>
            opt.values.length > 1 ? (
              <fieldset key={opt.name}>
                <legend className="block text-sm font-bold text-slate-900 mb-2">{opt.name}</legend>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const available = isValueAvailable(optIdx, val);
                    const active = selection[optIdx] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        disabled={!available}
                        onClick={() => choose(optIdx, val)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border inline-flex items-center gap-1.5 ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"} ${available ? "" : "opacity-40 cursor-not-allowed"}`}
                      >
                        {active && <Check size={14} />}
                        {val}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : null,
          )}

          <NumberInput
            label={product.kind === "qty" && product.qty ? `Cantitate (minim ${product.qty.minQty})` : "Cantitate"}
            value={quantity}
            onChange={setQuantity}
            min={product.qty?.minQty ?? 1}
          />

          {needsArtwork && (
            <fieldset>
              <legend className="block text-sm font-bold text-slate-900 mb-2">
                Grafica ta{product.artwork === "optional" ? " (opțional)" : ""}
              </legend>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setArtworkMode("upload")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${artworkMode === "upload" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}
                >
                  Încarc acum
                </button>
                <button
                  type="button"
                  onClick={() => setArtworkMode("later")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${artworkMode === "later" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}
                >
                  Trimit după comandă
                </button>
              </div>
              {artworkMode === "upload" ? (
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-28 px-4 bg-slate-50 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:border-slate-500">
                    <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                    <span className="text-sm font-medium text-slate-600">Încarcă fișierul (PDF, JPG, PNG)</span>
                    <input type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                  </label>
                  {uploading && <p className="text-sm text-slate-600 mt-2">Se încarcă...</p>}
                  {artworkUrl && <p className="text-sm text-emerald-700 font-semibold mt-2">Fișier primit.</p>}
                  {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  După plasarea comenzii ne trimiți fișierul pe e-mail la {siteConfig.email} sau pe WhatsApp, cu numărul comenzii.
                </p>
              )}
            </fieldset>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          {product.kind === "sqm" && pricing && "totalSqm" in pricing && (
            <p className="text-sm text-slate-600 mb-2">
              Suprafață totală: <strong>{pricing.totalSqm} m²</strong> · {formatMoneyDisplay(pricing.perSqm ?? 0)} / m²
            </p>
          )}
          {pricing ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{formatMoneyDisplay(pricing.total)}</span>
                {quantity > 1 && <span className="text-sm text-slate-500">{formatMoneyDisplay(pricing.unit)} / buc</span>}
              </div>
              <p className="text-xs text-slate-500 mt-1">{VAT_NOTE_SENTENCE}</p>
            </>
          ) : (
            <p className="text-sm text-red-600">Combinația aleasă nu este disponibilă.</p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg"
          >
            {added ? <Check size={22} /> : <ShoppingCart size={22} />}
            {added ? "Adăugat în coș" : "Adaugă în coș"}
          </button>
          {needsArtwork && product.artwork === "required" && artworkMode === "upload" && !artworkUrl && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <Info size={14} /> Încarcă grafica sau alege „Trimit după comandă”.
            </p>
          )}

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <DeliveryEstimation />
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bună ziua, am o întrebare despre ${product.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm"
          >
            <MessageCircle size={18} /> Întreabă pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
