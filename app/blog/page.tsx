import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
    ArrowRight,
    Clock,
    User,
    ImageIcon,
    Layers,
    Frame,
    Sparkles
} from "lucide-react";

export const metadata: Metadata = {
    title: "Blog Inspirație - Tablou.net | Design Interior și Tehnologie AI",
    description: "Descoperă sfaturi experte despre tablouri canvas, sticlă acrilică și cum să folosești AI pentru a transforma amintirile în artă.",
    alternates: {
        canonical: "/blog",
    }
};

const articles = [
    {
        id: 1,
        title: "Cum să alegi dimensiunea perfectă pentru un Tablou Canvas",
        excerpt: "Află regulile de aur ale designerilor de interior pentru a alege mărimea ideală a tabloului în funcție de spațiul tău.",
        category: "Ghid Decor",
        author: "Echipa Tablou.net",
        date: "5 Ian 2026",
        readTime: "5 min",
        link: "/blog/alegere-dimensiune-canvas",
        ctaPath: "/canvas",
        ctaLabel: "Configurează un Canvas",
        icon: <ImageIcon size={18} />
    },
    {
        id: 2,
        title: "Decor modern: De ce să alegi Tablourile pe Sticlă Acrilică?",
        excerpt: "Descoperă efectul de profunzime tridimensională și culorile vibrante ale printului pe plexiglas premium.",
        category: "Trenduri",
        author: "Echipa Tablou.net",
        date: "4 Ian 2026",
        readTime: "4 min",
        link: "/blog/avantaje-sticla-acrilica",
        ctaPath: "/sticla-acrilica",
        ctaLabel: "Vezi Sticlă Acrilică",
        icon: <Layers size={18} />
    },
    {
        id: 3,
        title: "Transformă-ți biroul cu Postere Profesionale High-End",
        excerpt: "Cum poți crea o atmosferă de lucru inspirațională folosind postere de înaltă rezoluție pe hârtie fotografică.",
        category: "Office",
        author: "Echipa Tablou.net",
        date: "3 Ian 2026",
        readTime: "3 min",
        link: "/blog/postere-birou-inspiratie",
        ctaPath: "/afise",
        ctaLabel: "Creează un Poster",
        icon: <Frame size={18} />
    },
    {
        id: 4,
        title: "AI Editor: Cum am readus la viață fotografii vechi de 50 de ani",
        excerpt: "Un studiu de caz despre restaurarea digitală și modul în care inteligența artificială poate salva amintirile uitate.",
        category: "Tehnologie",
        author: "Echipa Tablou.net",
        date: "2 Ian 2026",
        readTime: "6 min",
        link: "/blog/restaurare-foto-ai",
        ctaPath: "/editor",
        ctaLabel: "Încearcă Editorul AI",
        icon: <Sparkles size={18} />
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container-width px-4">
                {/* Blog Header */}
                <section className="text-center max-w-3xl mx-auto mb-16">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 uppercase">
                            Blog <span className="text-indigo-600">Inspirație</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Articole despre design interior, ghiduri de calitate și modul în care tehnologia AI transformă arta personalizată.
                        </p>
                    </div>
                </section>

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-slate-100 flex flex-col group hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        {article.category}
                                    </span>
                                    <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-indigo-400" />
                                            <span>{article.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                                    <Link href={article.link}>{article.title}</Link>
                                </h2>

                                <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                                    {article.excerpt}
                                </p>

                                {/* Footer / CTA Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                                    <Link
                                        href={article.link}
                                        className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                    >
                                        Citește tot <ArrowRight size={16} />
                                    </Link>

                                    <Link
                                        href={article.ctaPath}
                                        className="sm:ml-auto w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        {article.icon}
                                        {article.ctaLabel}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEO Content Section */}
                <section className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-premium">
                    <div className="max-w-4xl mx-auto prose prose-slate">
                        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">De ce să alegi Tablou.net pentru amintirile tale?</h2>
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                            La <strong>Tablou.net</strong>, nu vindem doar printuri, ci oferim o experiență premium de personalizare. Fie că optezi pentru un <strong>tablou canvas personalizat</strong>,
                            o placă modernă de <strong>sticlă acrilică</strong> sau un <strong>poster high-end</strong>, procesul nostru este ghidat de excelență.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">01</div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Calitate Muzeală</h4>
                                <p className="text-xs text-slate-500 font-medium">Folosim cerneluri UV rezistente la decolorare și materiale certificate pentru o durabilitate de peste 50 de ani.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">02</div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Tehnologie AI</h4>
                                <p className="text-xs text-slate-500 font-medium">Singurul site din România care îți permite să restaurezi sau să creezi caricaturi instant din pozele tale vechi.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">03</div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Livrare 48H</h4>
                                <p className="text-xs text-slate-500 font-medium">Producția locală ne permite să livrăm comanda ta în orice colț al țării în timp record.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
