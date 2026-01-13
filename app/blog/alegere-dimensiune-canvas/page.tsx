import React from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Share2,
    CheckCircle2,
    ImageIcon,
    ArrowRight
} from "lucide-react";
import { Metadata } from "next";
import BlogShareButton from "@/components/BlogShareButton";

export const metadata: Metadata = {
    title: "Cum să alegi dimensiunea perfectă pentru un Tablou Canvas | Tablou.net",
    description: "Regulile de aur pentru alegerea mărimii tabloului canvas. Învață cum să măsori corect spațiul și să creezi un punct focal impresionant în casa ta.",
    alternates: {
        canonical: "/blog/alegere-dimensiune-canvas",
    }
};

export default function ArticleCanvasDimensions() {
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
                            Ghid Decor
                        </span>
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Canvas
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] uppercase tracking-tight">
                        Cum să alegi dimensiunea perfectă pentru un <span className="text-indigo-600">Tablou Canvas</span>
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
                                <span className="text-xs font-medium">5 Ianuarie 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="text-xs font-medium">5 min de citit</span>
                            </div>
                        </div>

                        <BlogShareButton />
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-slate lg:prose-xl max-w-none">
                    <p className="lead font-medium text-slate-600 text-xl leading-relaxed">
                        Un tablou canvas poate fi punctul focal al oricărei încăperi, dar alegerea unei dimensiuni greșite poate strica tot echilibrul vizual al spațiului.
                        Iată regulile esențiale pe care trebuie să le urmezi pentru un decor impecabil.
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">1. Regula celor 2/3 (Proporția Ideală)</h2>
                    <p>
                        Atunci când agăți un tablou deasupra unei piese de mobilier (canapea, pat sau consolă), acesta ar trebui să acopere între <strong>60% și 75%</strong> din lățimea mobilierului respectiv.
                        Dacă tabloul este prea mic, va părea "pierdut" pe perete, iar dacă este prea mare, va domina excesiv camera.
                    </p>

                    <div className="bg-indigo-50 border-l-4 border-indigo-600 p-8 my-10 rounded-r-2xl">
                        <h4 className="font-black text-indigo-900 uppercase text-sm tracking-widest mb-2">Sfat Premium</h4>
                        <p className="text-indigo-800 text-sm font-medium leading-relaxed italic">
                            "Dacă ai o canapea de 200 cm, lățimea ideală pentru un tablou (sau un grup de tablouri) este de aproximativ 120 cm - 150 cm."
                        </p>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">2. Înălțimea la nivelul ochilor</h2>
                    <p>
                        Cea mai frecventă greșeală este agățarea tablourilor prea sus. Centrul imaginii ar trebui să fie la aproximativ <strong>145 cm - 152 cm</strong> față de podea.
                        Aceasta este înălțimea medie a nivelului ochilor și este standardul folosit în galeriile de artă.
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">3. Spațiul în jurul tabloului</h2>
                    <p>
                        Dacă alegi să creezi o galerie (mai multe tablouri mici), lasă o distanță de <strong>5 - 8 cm</strong> între ele. Acest spațiu negativ permite ochiului să respire
                        și face ca întreg ansamblul să pară o singură unitate coerentă.
                    </p>

                    {/* CTA Box - Configurator Link */}
                    <div className="my-20 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                                <ImageIcon size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Ești gata să îți creezi propriul tablou?</h3>
                            <p className="text-slate-400 font-medium mb-10">
                                Folosește configuratorul nostru 3D pentru a previzualiza în timp real cum va arăta imaginea ta pe perete.
                            </p>
                            <Link
                                href="/canvas"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl hover:-translate-y-1"
                            >
                                Configurează acum <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">4. Materialul contează</h2>
                    <p>
                        Nu doar dimensiunea este importantă, ci și finisajul. Pentru un aspect clasic și cald, alege <strong>Canvasul</strong>.
                        Dacă vrei ceva ultra-modern pentru o bucătărie sau un hol minimalist, <strong>Sticla Acrilică</strong> este alegerea imbatabilă datorită luciului și profunzimii.
                    </p>

                    <ul className="space-y-4 my-10 list-none p-0">
                        <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                            <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                            <span className="text-slate-700 font-medium italic">Știai că pe Tablou.net poți încărca orice poză și noi o transformăm în artă la orice dimensiune vrei?</span>
                        </li>
                    </ul>
                </div>

                {/* Footer Navigation */}
                <footer className="mt-20 pt-10 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex gap-4">
                            <Link href="/sticla-acrilica" className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Sticlă Acrilică</Link>
                            <Link href="/afise" className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Postere</Link>
                        </div>
                    </div>
                </footer>
            </article>
        </main>
    );
}
