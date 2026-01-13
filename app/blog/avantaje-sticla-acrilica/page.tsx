import React from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Share2,
    CheckCircle2,
    Layers,
    ArrowRight
} from "lucide-react";
import { Metadata } from "next";
import BlogShareButton from "@/components/BlogShareButton";

export const metadata: Metadata = {
    title: "Decor modern: De ce să alegi Tablourile pe Sticlă Acrilică? | Tablou.net",
    description: "Descoperă efectul de profunzime tridimensională și culorile vibrante ale printului pe plexiglas premium. Avantajele sticlei acrilice în designul modern.",
    alternates: {
        canonical: "/blog/avantaje-sticla-acrilica",
    }
};

export default function ArticlePlexiglass() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-20">
            <article className="container-width px-4 max-w-4xl mx-auto">
                {/* Navigation Back */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-12 transition-colors"
                >
                    <ArrowLeft size={16} /> Înapoi la Blog
                </Link>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Trenduri
                        </span>
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Design Modern
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] uppercase tracking-tight">
                        Decor modern: De ce să alegi <span className="text-indigo-600">Tablourile pe Sticlă Acrilică?</span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Autor</p>
                                <p className="text-sm font-bold text-slate-900">Echipa Tablou.net</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span className="text-xs font-medium">4 Ianuarie 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="text-xs font-medium">4 min de citit</span>
                            </div>
                        </div>

                        <BlogShareButton />
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-slate lg:prose-xl max-w-none">
                    <p className="lead font-medium text-slate-600 text-xl leading-relaxed">
                        Sticla acrilică (plexiglasul) este noul standard în decorul interior modern. Cu o claritate comparabilă cu sticla și o durabilitate net superioară, acest material transformă orice fotografie într-o experiență vizuală hi-tech.
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">Profunzime și Strălucire</h2>
                    <p>
                        Spre deosebire de canvas, unde imaginea este la suprafața materialului, în cazul <strong>sticlei acrilice</strong> printul UV este aplicat direct pe spatele plăcii transparente.
                        Acest lucru creează un efect natural de "profunzime 3D", lumina trecând prin material și luminând culorile din interior.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-12">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-4">Avantaj Vizual</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Culorile negre sunt mai intense, iar contrastul este de neegalat. Este materialul perfect pentru fotografii de noapte, arhitectură sau artă abstractă.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-4">Rezistență</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Plexiglasul este mult mai ușor decât sticla și rezistent la șocuri. De asemenea, este rezistent la umiditate, fiind ideal pentru băi sau bucătării.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">Un look minimalist</h2>
                    <p>
                        Tablourile pe sticlă acrilică de la <strong>Tablou.net</strong> vin opțional cu sisteme de prindere invizibile sau distanțiere metalice, oferind peretelui tău acel aspect de "galerie de lux"
                        unde tabloul pare că plutește la câțiva centimetri de zid.
                    </p>

                    {/* CTA Box */}
                    <div className="my-20 p-12 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                                <Layers size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Vrei un decor care să impresioneze?</h3>
                            <p className="text-indigo-100 font-medium mb-10">
                                Alege calitatea fotografică pe sticlă acrilică și dă viață spațiului tău cu reflexii spectaculoase.
                            </p>
                            <Link
                                href="/sticla-acrilica"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-xl hover:-translate-y-1"
                            >
                                Configurator Plexiglass <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">Cum să îl întreții?</h2>
                    <p>
                        Este extrem de simplu! O lavetă moale din microfibră și puțină apă (sau soluție de geamuri fără alcool) sunt suficiente pentru a păstra strălucirea intactă pentru decenii întregi.
                    </p>
                </div>

                {/* Footer Navigation */}
                <footer className="mt-20 pt-10 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex gap-4">
                            <Link href="/canvas" className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Canvas</Link>
                            <Link href="/afise" className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Postere</Link>
                        </div>
                    </div>
                </footer>
            </article>
        </main>
    );
}
