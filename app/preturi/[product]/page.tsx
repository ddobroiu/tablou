import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { QTY_PRODUCTS, getQtyProduct, getQtyPricing, qtyUrl, getRegistryEntry } from "@/lib/seo/quantityPages";
import { formatLei } from "@/lib/seo/dimensionPricing";

export const revalidate = 604800;
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
    const { product } = await params;
    const p = getQtyProduct(String(product || "").toLowerCase());
    if (!p) return {};
    const title = `${p.name}: prețuri pe cantități și formate | ${siteConfig.name}`;
    const description = `Prețul pentru ${p.unit} la ${p.quantities[0]}-${p.quantities[p.quantities.length - 1]} bucăți, pe fiecare ${p.formatLabel.toLowerCase()}, calculat de motorul configuratorului. Producție 2-4 zile lucrătoare, livrare prin curier.`;
    const url = `${BASE_URL}/preturi/${p.slug}`;
    return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: siteConfig.name, locale: "ro_RO", type: "website" } };
}

export default async function QtyProductIndex({ params }: { params: Promise<{ product: string }> }) {
    const { product } = await params;
    const p = getQtyProduct(String(product || "").toLowerCase());
    if (!p) notFound();
    const cfg = getRegistryEntry(p.id);

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span>
                        <Link href="/preturi" className="hover:text-emerald-600 transition-colors">Prețuri pe cantități</Link><span>/</span>
                        <span className="text-slate-900">{p.name}</span>
                    </nav>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">{p.name} <span className="text-emerald-500">pe cantități</span></h1>
                            <p className="text-lg text-slate-500">{cfg?.description}</p>
                            <p className="text-slate-600 leading-relaxed mt-4">Prețul pe bucată scade pe praguri de cantitate. Tabelul de mai jos arată prețul pentru varianta recomandată la fiecare {p.formatLabel.toLowerCase()}; fiecare celulă deschide pagina cu toate variantele, greutatea coletului și specificațiile de fișier.</p>
                        </div>
                        {cfg?.image && <div className="relative w-full lg:w-72 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0"><Image src={cfg.image} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 288px" /></div>}
                    </div>
                </div>
            </div>

            <section className="py-14">
                <div className="container mx-auto px-6">
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50"><tr><th className="text-left px-5 py-4 font-black text-slate-700">{p.formatLabel}</th>{p.quantities.map((q) => <th key={q} className="text-right px-5 py-4 font-black text-slate-700 whitespace-nowrap">{q} buc</th>)}</tr></thead>
                            <tbody>
                                {p.formats.map((f) => (
                                    <tr key={f.key} className="border-t border-slate-100">
                                        <td className="px-5 py-4 font-bold text-slate-900">{f.label}</td>
                                        {p.quantities.map((q) => {
                                            const pr = getQtyPricing(p, f, q);
                                            return <td key={q} className="px-5 py-4 text-right whitespace-nowrap">{pr ? <Link href={qtyUrl(p, f, q)} className="font-black text-slate-900 hover:text-emerald-600">{formatLei(pr.recommended.total)}<div className="text-xs font-medium text-slate-500">{formatLei(pr.recommended.unit)}/buc</div></Link> : <span className="text-slate-300">–</span>}</td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8"><Link href={cfg?.url || `/${p.id}`} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">Altă cantitate sau opțiuni? Deschide configuratorul</Link></div>
                </div>
            </section>

            <section className="py-14 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Alte produse la tiraj</h2>
                    <div className="flex flex-wrap gap-3">
                        {QTY_PRODUCTS.filter((x) => x.slug !== p.slug).map((x) => <Link key={x.slug} href={`/preturi/${x.slug}`} className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{x.name}</Link>)}
                        <Link href="/dimensiuni" className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">Prețuri pe dimensiuni →</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
