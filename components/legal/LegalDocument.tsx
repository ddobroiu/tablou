import React from "react";
import Link from "next/link";
import { LEGAL_EFFECTIVE_DATE, LEGAL_LINKS, LEGAL_VERSION } from "@/lib/company";
import OperatorDetails from "@/components/legal/OperatorDetails";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/**
 * Șablonul comun al paginilor legale: titlu, versiune și dată, cuprins, secțiuni numerotate,
 * datele operatorului și link-uri către celelalte documente.
 */
export default function LegalDocument({
    title,
    intro,
    sections,
    currentHref,
    showToc = true,
}: {
    title: string;
    intro?: React.ReactNode;
    sections: LegalSection[];
    currentHref: string;
    showToc?: boolean;
}) {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 px-4 pb-16 pt-28">
            <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                <header className="mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Versiunea {LEGAL_VERSION} · în vigoare de la {LEGAL_EFFECTIVE_DATE}
                    </p>
                    {intro && <div className="mt-4 text-[15px] leading-relaxed text-slate-700">{intro}</div>}
                </header>

                {showToc && sections.length > 3 && (
                    <nav aria-label="Cuprins" className="mb-10 rounded-xl bg-slate-50 p-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cuprins</p>
                        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} className="hover:text-emerald-700 hover:underline">
                                        {s.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <div className="legal-body space-y-10 text-[15px] leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:mb-3 [&_strong]:text-slate-900 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
                    {sections.map((s, i) => (
                        <section key={s.id} id={s.id} className="scroll-mt-28">
                            <h2 className="mb-3 text-xl font-bold text-slate-900">
                                {i + 1}. {s.title}
                            </h2>
                            {s.body}
                        </section>
                    ))}
                </div>

                <footer className="mt-12 space-y-6 border-t border-slate-200 pt-8">
                    <OperatorDetails />
                    <nav aria-label="Documente legale" className="text-sm">
                        <p className="mb-2 font-semibold text-slate-900">Alte documente</p>
                        <ul className="flex flex-wrap gap-x-4 gap-y-1">
                            {LEGAL_LINKS.filter((l) => l.href !== currentHref).map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-emerald-700 underline underline-offset-2">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </footer>
            </article>
        </main>
    );
}
