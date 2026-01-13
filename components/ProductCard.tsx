"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart } from "lucide-react";
import ProductVariantSelector from "./ProductVariantSelector";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    routeSlug?: string;
    title: string;
    description?: string;
    price: number;
    images?: string[];
    category?: string;
    tags?: string[];
    metadata?: {
      category?: string;
      subcategory?: string;
      isSignage?: boolean;
      isMultiVariant?: boolean;
      variants?: Array<{
        type: 'afis' | 'canvas' | 'tapet' | 'autocolant';
        title: string;
        description: string;
        slug: string;
        price: number;
        route: string;
        configurator: string;
      }>;
      [key: string]: any; // Allow other properties
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // State pentru modal și fallback imagine
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Verificăm dacă e produs multi-variant (Europosters)
  const isMultiVariant = product.metadata?.isMultiVariant === true;
  const variants = product.metadata?.variants || [];

  // LOGICA DE RUTARE: Determinăm link-ul corect bazat pe categorie
  const catRaw = String((product.metadata as any)?.category ?? product.category ?? "").toLowerCase();
  const isBanner = catRaw === "bannere" || catRaw === "banner";
  const isSemnalistica = catRaw === "semnalistică" || catRaw === "semnalistica";
  const isSignage = product.metadata?.isSignage === true;

  let href = product.routeSlug ? (product.routeSlug.startsWith('/') ? product.routeSlug : `/${product.routeSlug}`) : `/product/${product.slug}`;

  if (isSignage || isSemnalistica) { // Prioritize signage route if isSignage is true or category is semnalistica
    href = `/semnalistica/${product.slug}`;
  } else if (isBanner) { // Handle banner specifically if not signage
    href = `/banner/${product.slug}`;
  } else if (catRaw === "banner-verso") {
    href = `/banner-verso/${product.slug}`;
  } else if (catRaw === "afise") {
    href = `/afise/${product.slug}`;
  } else if (catRaw === "autocolante") {
    href = `/autocolante/${product.slug}`;
  } else if (catRaw === "flayere" || catRaw === "flyere") {
    href = `/flayere/${product.slug}`;
  } else if (catRaw === "pliante") {
    href = `/pliante/${product.slug}`;
  } else if (catRaw === "canvas") {
    href = `/canvas/${product.slug}`;
  } else if (catRaw === "tapet") {
    href = `/tapet/${product.slug}`;
  } else if (catRaw === "stickere") {
    href = `/autocolante/${product.slug}`;
  } else if (catRaw === "carton") {
    href = `/materiale/carton/${product.slug}`;
  } else if (catRaw === "plexiglass" || catRaw === "plexiglas") {
    href = `/materiale/plexiglass/${product.slug}`;
  } else if (catRaw === "alucobond") {
    href = `/materiale/alucobond/${product.slug}`;
  } else if (catRaw === "polipropilena") {
    href = `/materiale/polipropilena/${product.slug}`;
  } else if (catRaw === "pvc-forex") {
    href = `/materiale/pvc-forex/${product.slug}`;
  } else if (catRaw === "semnalistică" || catRaw === "semnalistica") {
    // href calculated above from routeSlug
  } else if (catRaw === "fonduri-eu" || catRaw === "fonduri-pnrr") {
    href = `/fonduri-eu`; // Link general către configurator
  }

  // LOGICA IMAGINE ROBUSTĂ
  const imgs = product.images ?? [];
  const categoryPath = catRaw === "bannere" ? "banner" : catRaw;
  const configuratorImageWebp = `/products/${categoryPath}/1.webp`;

  let img = configuratorImageWebp;
  if (imgs.length > 0) {
    img = imgs[0];
  }

  const finalImg = imgError ? configuratorImageWebp : img;

  // Handler pentru click
  const handleClick = (e: React.MouseEvent) => {
    if (isMultiVariant) {
      e.preventDefault();
      setShowVariantModal(true);
    }
  };

  const CardContent = (
    <>
      {/* Imagine */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {finalImg.startsWith('http') ? (
          <img
            src={finalImg}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={finalImg}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {/* Badge Preț Glassmorphism */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-premium z-10 transition-transform duration-300 group-hover:scale-105">
          <span className="text-sm font-black text-slate-900 leading-none">De la {product.price} RON</span>
        </div>
        {/* Badge Multi-Variant */}
        {isMultiVariant && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-lg shadow-elevated z-10 animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-widest">4 VARIANTE</span>
          </div>
        )}
      </div>

      {/* Conținut */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-auto">
          <div className="text-xs font-medium text-indigo-600 mb-2 uppercase tracking-wider">
            {product.metadata?.category || product.category || "Produs"}
            {product.metadata?.subcategory && ` › ${product.metadata.subcategory}`}
          </div>
          <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          {product.description && (
            <div
              className="mt-2 text-sm text-zinc-500 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {!product.description && (
            <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
              Materiale publicitare de înaltă calitate.
            </p>
          )}
        </div>

        {/* Footer Card */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
            {isMultiVariant ? "Alege Varianta" : "Configurează"}
          </span>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:shadow-indigo-100 group-hover:shadow-lg">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMultiVariant ? (
        <div
          onClick={handleClick}
          className="group flex flex-col bg-white border border-slate-200/50 rounded-3xl overflow-hidden hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 h-full cursor-pointer animate-slide-up"
        >
          {CardContent}
        </div>
      ) : (
        <Link
          href={href}
          className="group flex flex-col bg-white border border-slate-200/50 rounded-3xl overflow-hidden hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 h-full animate-slide-up"
        >
          {CardContent}
        </Link>
      )}

      {/* Modal pentru variante */}
      {showVariantModal && isMultiVariant && (
        <ProductVariantSelector
          productTitle={product.title}
          productImage={finalImg}
          variants={variants}
          onClose={() => setShowVariantModal(false)}
        />
      )}
    </>
  );
}
