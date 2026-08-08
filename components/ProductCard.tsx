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
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
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

  // Prefer routeSlug if it exists, otherwise build it based on category
  let href = product.routeSlug ? (product.routeSlug.startsWith('/') ? product.routeSlug : `/${product.routeSlug}`) : `/product/${product.slug}`;

  // Helper function to safely prepend category if not already present
  const getSafeHref = (prefix: string, slug: string) => {
    if (slug.startsWith(prefix.replace(/^\//, '')) || slug.startsWith(prefix)) {
      return slug.startsWith('/') ? slug : `/${slug}`;
    }
    return `${prefix}/${slug}`;
  };

  // Only apply category overrides if we don't have a specialized routeSlug from the catalog
  if (!product.routeSlug) {
    if (isSignage || isSemnalistica) { 
      href = getSafeHref('/semnalistica-product', product.slug);
    } else if (isBanner) { 
      href = getSafeHref('/banner-product', product.slug);
    } else if (catRaw === "banner-verso") {
      href = getSafeHref('/banner-verso', product.slug);
    } else if (catRaw === "afise") {
      href = getSafeHref('/afise', product.slug);
    } else if (catRaw === "autocolante") {
      href = getSafeHref('/autocolante', product.slug);
    } else if (catRaw === "flayere" || catRaw === "flyere") {
      href = getSafeHref('/flayere', product.slug);
    } else if (catRaw === "pliante") {
      href = getSafeHref('/pliante', product.slug);
    } else if (catRaw === "canvas") {
      href = getSafeHref('/canvas-product', product.slug);
    } else if (catRaw === "acrylic" || catRaw === "sticlă acrilică" || catRaw === "sticla acrilica") {
      href = getSafeHref('/acrylic-product', product.slug);
    } else if (catRaw === "tapet") {
      href = getSafeHref('/tapet', product.slug);
    } else if (catRaw === "stickere") {
      href = getSafeHref('/autocolante', product.slug);
    } else if (catRaw === "carton") {
      href = getSafeHref('/materiale/carton', product.slug);
    } else if (catRaw === "plexiglass" || catRaw === "plexiglas") {
      href = getSafeHref('/materiale/plexiglass', product.slug);
    } else if (catRaw === "alucobond") {
      href = getSafeHref('/materiale/alucobond', product.slug);
    } else if (catRaw === "polipropilena") {
      href = getSafeHref('/materiale/polipropilena', product.slug);
    } else if (catRaw === "pvc-forex") {
      href = getSafeHref('/materiale/pvc-forex', product.slug);
    } else if (catRaw === "fonduri-eu" || catRaw === "fonduri-pnrr") {
      href = `/fonduri-eu`; 
    }
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
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 group">
        {finalImg.startsWith('http') ? (
          <img
            src={finalImg}
            alt={`${product.title} - Tipar digital și personalizare online ${catRaw ? `din categoria ${catRaw}` : ''}`}
            title={`${product.title} | Tablou România`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-90 mix-blend-multiply"
            loading={priority ? "eager" : "lazy"}
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={finalImg}
            alt={`${product.title} - Tipar digital și personalizare online ${catRaw ? `din categoria ${catRaw}` : ''}`}
            title={`${product.title} | Tablou România`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-90 mix-blend-multiply"
            loading={priority ? undefined : "lazy"}
            priority={priority}
            onError={() => setImgError(true)}
          />
        )}
        
        {/* Print-Pro overlay + CMYK hairline */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent"></div>
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-cyan),var(--color-magenta),var(--color-yellow))]"></div>
        </div>
        
        {/* Badge Multi-Variant */}
        {isMultiVariant && (
          <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md text-slate-950 px-3 py-1.5 rounded-full border border-slate-200/70 shadow-sm z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-magenta),var(--color-yellow))]"></div>
            <span className="text-[10px] font-semibold tracking-tight">4 variante</span>
          </div>
        )}
      </div>

      {/* Conținut */}
      <div className="p-6 flex flex-col flex-1 bg-white relative">
        <div className="absolute inset-x-6 top-0 h-px bg-slate-200/0 group-hover:bg-slate-200/70 transition-colors"></div>
        <div className="mb-auto">
          <div className="text-xs font-semibold text-slate-600 mb-2 tracking-tight flex items-center gap-2">
            <span className="text-slate-900">{product.metadata?.category || product.category || "Produs"}</span>
            {product.metadata?.subcategory && (
              <>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span className="text-slate-500">{product.metadata.subcategory}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-slate-950 leading-tight tracking-tight group-hover:text-slate-950 transition-colors duration-300">
            {product.title}
          </h3>
          <div className="mt-2.5 flex items-center">
            <span className="text-sm font-semibold text-slate-950 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-full tracking-tight">De la {product.price} RON</span>
          </div>
          {product.description && (
            <div
              className="mt-3 text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {!product.description && (
            <p className="mt-3 text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
              Materiale publicitare de înaltă performanță pentru afacerea ta.
            </p>
          )}
        </div>

        {/* Footer Card */}
        <div className="mt-6 flex items-center justify-between group/btn cursor-pointer">
          <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-2">
            {isMultiVariant ? "Alege Varianta" : "Configurează"}
            <div className="w-0 h-[2px] bg-slate-950 group-hover:w-4 transition-all duration-300 ease-out"></div>
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all duration-300 group-hover:-rotate-45 group-hover:shadow-lg">
            <ArrowRight size={16} strokeWidth={2.5} />
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
          className="group flex flex-col bg-white border border-slate-200/70 rounded-3xl overflow-hidden hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 h-full cursor-pointer animate-slide-up"
        >
          {CardContent}
        </div>
      ) : (
        <Link
          href={href}
          className="group flex flex-col bg-white border border-slate-200/70 rounded-3xl overflow-hidden hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 h-full animate-slide-up"
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