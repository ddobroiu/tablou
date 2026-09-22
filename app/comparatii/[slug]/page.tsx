import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { COMPARISONS, getComparison, getComparisonPrices } from "@/lib/seo/comparisons";
import { formatLei } from "@/lib/seo/dimensionPricing";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

export const revalidate = 604800;
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const c = getComparison(slug);
    if (!c) return {};
    const url = `${BASE_URL}/comparatii/${c.slug}`;
    const description = `${c.question} ${c.verdict}`.slice(0, 158);
    return { title: { absolute: `${c.title} | ${siteConfig.name}` }, description, alternates: { canonical: url }, openGraph: { title: c.title, description, url, siteName: siteConfig.name, locale: "ro_RO", type: "article" } };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const c = getComparison(slug);
    if (!c) notFound();
    const table = getComparisonPrices(c);
    const waMessage = `Bună ziua, am o întrebare despre: ${c.title}.`;
    const jsonLd = [
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: c.question, acceptedAnswer: { "@type": "Answer", text: c.verdict } }, ...c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))] },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Acasă", item: `${BASE_URL}/` }, { "@type": "ListItem", position: 2, name: "Comparații", item: `${BASE_URL}/comparatii` }, { "@type": "ListItem", position: 3, name: c.title }] },
    ];

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="pt-24 pb-10 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <nav className="text-[10px] font-black text-slate-400 mb-5 flex flex-wrap gap-3 items-center uppercase tracking-widest"><Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span><Link href="/comparatii" className="hover:text-emerald-600 transition-colors">Comparații</Link><span>/</span><span className="text-slate-900">{c.title}</span></nav>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">{c.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">{c.intro}</p>
                    <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5 mb-6"><div className="text-[10px] uppercase tracking-widest font-black text-emerald-700 mb-1">Pe scurt</div><p className="text-slate-900 font-bold">{c.verdict}</p></div>
                    <div className="flex flex-col sm:flex-row gap-3"><WhatsAppButton message={waMessage}>Întreabă-ne pe WhatsApp</WhatsAppButton></div>
                </div>
            </div>

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className={`grid grid-cols-1 ${c.options.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5`}>
                        {c.options.map((o) => (
                            <div key={o.name} className="rounded-3xl border border-slate-200 p-6">
                                <h2 className="text-xl font-black text-slate-900 mb-3">{o.name}</h2>
                                <div className="text-[10px] uppercase tracking-widest font-black text-emerald-600 mb-1">Avantaje</div>
                                <ul className="space-y-1 mb-4">{o.pros.map((p) => <li key={p} className="text-sm text-slate-700 pl-3 border-l-2 border-emerald-500">{p}</li>)}</ul>
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Dezavantaje</div>
                                <ul className="space-y-1 mb-4">{o.cons.map((p) => <li key={p} className="text-sm text-slate-600 pl-3 border-l-2 border-slate-300">{p}</li>)}</ul>
                                <div className="text-sm text-slate-900"><span className="font-bold">Potrivit pentru:</span> {o.bestFor}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {table.columns.length > 0 && (
                <section className="py-12 border-b border-slate-100 bg-slate-50">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">Prețuri comparate</h2>
                        <p className="text-sm text-slate-500 mb-6">{c.sizes ? "Preț pe bucată, o bucată, cu grafica ta." : "Preț total pentru tiraj, cu grafica ta."} Calculat cu motorul configuratorului; TVA inclus. Fiecare celulă deschide pagina cu toate variantele.</p>
                        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50"><tr><th className="text-left px-5 py-3 font-black text-slate-700">Variantă</th>{table.columns.map((col) => <th key={col} className="text-right px-5 py-3 font-black text-slate-700 whitespace-nowrap">{col}</th>)}</tr></thead>
                                <tbody>
                                    {table.rows.map((row) => (
                                        <tr key={row.option} className="border-t border-slate-100">
                                            <td className="px-5 py-3 font-bold text-slate-900">{row.option}</td>
                                            {row.cells.map((cell, i) => <td key={i} className="px-5 py-3 text-right whitespace-nowrap">{cell.price !== null ? <Link href={cell.href} className="font-black text-slate-900 hover:text-emerald-600">{formatLei(cell.price)}</Link> : <span className="text-xs text-slate-400">în configurator</span>}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        {c.faq.map((f, i) => (
                            <details key={i} className="group px-6 py-5" open={i === 0}><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><p className="text-slate-600 leading-relaxed mt-3">{f.a}</p></details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">Alte comparații</h2>
                    <div className="flex flex-wrap gap-2">{COMPARISONS.filter((x) => x.slug !== c.slug).map((x) => <Link key={x.slug} href={`/comparatii/${x.slug}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{x.title}</Link>)}</div>
                </div>
            </section>

            <WhatsAppBar message={waMessage} />
        </div>
    );
}
