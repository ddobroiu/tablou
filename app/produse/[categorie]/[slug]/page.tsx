import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductStructuredData from "@/components/ProductStructuredData";
import CatalogProductView from "@/components/catalog/CatalogProductView";
import {
  CATALOG_PRODUCTS,
  catalogProductUrl,
  getCatalogCategory,
  getCatalogProduct,
  relatedCatalogProducts,
  qtyUnitPrice,
  type CatalogProduct,
} from "@/lib/catalog";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";
import { SITE_GROUP_INTROS } from "@/lib/catalog/siteIntros";

export const revalidate = 604800;

type Props = { params: Promise<{ categorie: string; slug: string }> };

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ categorie: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie, slug } = await params;
  const p = getCatalogProduct(categorie, slug);
  if (!p) return { title: "Produs negăsit" };
  const url = `${siteConfig.url}${catalogProductUrl(p)}`;
  const title = `${p.title} – de la ${formatMoneyDisplay(p.priceFrom)}`;
  return {
    title,
    description: p.short,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.short, url, images: p.images.slice(0, 1), type: "website" },
  };
}

/** Tabel de prețuri pentru produsele pe m² sau pe praguri de cantitate (text vizibil pentru client și Google). */
function PriceTable({ p }: { p: CatalogProduct }) {
  if (p.kind === "sqm" && p.sqm) {
    const bands = p.sqm.materials[0].bands;
    const label = (i: number) => {
      const lo = i === 0 ? 0 : bands[i - 1].max;
      const hi = bands[i].max;
      if (hi === null) return `peste ${lo} m²`;
      return i === 0 ? `sub ${hi} m²` : `${lo}–${hi} m²`;
    };
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left p-3">Material / suprafață totală</th>
              {bands.map((_, i) => (
                <th key={i} className="text-right p-3 whitespace-nowrap">{label(i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.sqm.materials.map((m) => (
              <tr key={m.name} className="border-t border-slate-200">
                <td className="p-3 font-medium text-slate-900">{m.name}</td>
                {m.bands.map((b, i) => (
                  <td key={i} className="p-3 text-right whitespace-nowrap">{formatMoneyDisplay(b.price)}/m²</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (p.kind === "qty" && p.qty) {
    const tiers = p.qty.tiers;
    const label = (i: number) => (i === tiers.length - 1 ? `${tiers[i]}+ buc` : `${tiers[i]}–${tiers[i + 1] - 1} buc`);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left p-3">Variantă</th>
              {tiers.map((_, i) => (
                <th key={i} className="text-right p-3 whitespace-nowrap">{label(i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.qty.rows
              .filter((r) => r.p.some((x) => x !== null))
              .map((r) => (
                <tr key={r.o.join("|")} className="border-t border-slate-200">
                  <td className="p-3 font-medium text-slate-900">{r.o.join(" · ") || p.title}</td>
                  {tiers.map((t, i) => {
                    const v = qtyUnitPrice(p.qty!, r.o, t);
                    return (
                      <td key={i} className="p-3 text-right whitespace-nowrap">{v === null ? "–" : formatMoneyDisplay(v)}</td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-2">Prețuri pe bucată, în funcție de cantitatea comandată.</p>
      </div>
    );
  }
  return null;
}

export default async function CatalogProductPage({ params }: Props) {
  const { categorie, slug } = await params;
  const p = getCatalogProduct(categorie, slug);
  const cat = getCatalogCategory(categorie);
  if (!p || !cat) notFound();

  const related = relatedCatalogProducts(p);
  const url = `${siteConfig.url}${catalogProductUrl(p)}`;

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-16">
      <ProductStructuredData
        product={{
          name: p.title,
          description: p.short,
          image: `${siteConfig.url}${p.images[0]}`,
          sku: `cat-${p.slug}`,
          brand: siteConfig.domain,
          offers: {
            price: p.priceFrom.toFixed(2),
            priceCurrency: "RON",
            availability: "https://schema.org/InStock",
            url,
          },
        }}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumbs
          items={[
            { label: "Produse", href: "/produse" },
            { label: cat.name, href: `/produse/${cat.slug}` },
            { label: p.title, href: catalogProductUrl(p) },
          ]}
        />

        <div className="mt-6">
          <CatalogProductView product={p} />
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Despre {p.title}</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {p.group && SITE_GROUP_INTROS[siteConfig.name]?.[p.group] && <p>{SITE_GROUP_INTROS[siteConfig.name][p.group]}</p>}
              {p.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {(p.kind === "sqm" || p.kind === "qty") && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Prețuri</h2>
                <PriceTable p={p} />
              </div>
            )}
          </div>
          {p.specs.length > 0 && (
            <aside className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 h-fit">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Specificații</h2>
              <dl className="space-y-3 text-sm">
                {p.specs.map((s) => {
                  const idx = s.indexOf(":");
                  const k = idx > 0 ? s.slice(0, idx) : "";
                  const v = idx > 0 ? s.slice(idx + 1).trim() : s;
                  return (
                    <div key={s} className="border-b border-slate-100 pb-2">
                      {k && <dt className="text-slate-500">{k}</dt>}
                      <dd className="font-medium text-slate-900">{v}</dd>
                    </div>
                  );
                })}
              </dl>
            </aside>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Din aceeași categorie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={catalogProductUrl(r)}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-white">
                    <Image src={r.images[0]} alt={r.title} fill className="object-contain p-3" sizes="(max-width: 640px) 50vw, 25vw" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:underline">{r.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">de la {formatMoneyDisplay(r.priceFrom)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
