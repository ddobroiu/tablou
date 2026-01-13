import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Star, Shield, Truck, Zap, ChevronRight, Camera, Layers, Sparkles } from "lucide-react";
import Image from "next/image";

export default function TablouHome() {
    return (
        <main className="min-h-screen bg-white">

            {/* HERO SECTION - Clean & Impactful */}
            <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="container-width">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                                Din telefon,<br />
                                direct pe perete.
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed text-balance">
                                Transformă fotografiile tale în tablouri <span className="text-slate-900 font-semibold">Canvas</span> sau <span className="text-slate-900 font-semibold">Sticlă Acrilică</span> de cea mai înaltă calitate.
                                Proces simplu, livrare rapidă și garanția calității.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/canvas" className="btn-primary h-14 px-8 text-base">
                                    Configurează Canvas
                                </Link>
                                <Link href="/sticla-acrilica" className="btn-outline h-14 px-8 text-base">
                                    Vezi Sticlă Acrilică
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Check size={18} className="text-green-600" />
                                    <span>Verificare gratuită a calității</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={18} className="text-green-600" />
                                    <span>Livrare 24-48h</span>
                                </div>
                            </div>
                        </div>

                        {/* Elegant Hero Image Composition */}
                        <div className="relative">
                            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                                <img
                                    src="/products/canvas/canvas-hero.webp"
                                    alt="Tablou Canvas Premium"
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Floating Card Detail */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Star className="text-indigo-600 w-5 h-5 fill-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">4.9/5 Rating</p>
                                        <p className="text-xs text-slate-500">Din 500+ recenzii verificate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCT CATEGORIES - Minimalist Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container-width">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Alege suportul potrivit</h2>
                        <p className="text-slate-600 text-lg">Indiferent dacă preferi textura clasică a pânzei sau eleganța sticlei acrilice, avem soluția perfectă.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Canvas Card */}
                        <Link href="/canvas" className="group card-premium h-full flex flex-col">
                            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                <img src="/products/canvas/canvas-1.webp" alt="Canvas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Canvas</h3>
                                <p className="text-slate-500 mb-6 flex-1">Textură autentică de pânză de bumbac, întinsă pe șasiu din lemn natural.</p>
                                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                    Configurează <ArrowRight size={18} />
                                </span>
                            </div>
                        </Link>

                        {/* Plexiglas Card */}
                        <Link href="/sticla-acrilica" className="group card-premium h-full flex flex-col">
                            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                <img src="/products/plexiglass/plexiglass-1.webp" alt="Plexiglas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sticlă Acrilică</h3>
                                <p className="text-slate-500 mb-6 flex-1">Profunzime incredibilă și aspect lucios, modern. Print direct pe spate.</p>
                                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                    Configurează <ArrowRight size={18} />
                                </span>
                            </div>
                        </Link>

                        {/* Posters Card */}
                        <Link href="/afise" className="group card-premium h-full flex flex-col">
                            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                <img src="/products/afise/afise-1.webp" alt="Postere" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Afișe & Postere</h3>
                                <p className="text-slate-500 mb-6 flex-1">Print de înaltă rezoluție pe hârtie premium. Ideal pentru artă sau promoții.</p>
                                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                    Configurează <ArrowRight size={18} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* COLLECTIONS PREVIEW */}
            <section className="py-24 bg-white">
                <div className="container-width">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Colecții de Artă</h2>
                            <p className="text-slate-600 text-lg">Dacă nu ai propria fotografie, alege din mii de modele create de artiști, gata de a fi imprimate pe suportul tău preferat.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/shop/canvas" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-2 group whitespace-nowrap">
                                Colecție Canvas <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/shop/acrylic" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-2 group whitespace-nowrap">
                                Colecție Acrilic <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-left">
                        {/* Canvas Collection */}
                        <Link href="/shop/canvas" className="group relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                            <img src="https://pub-5e0f8c0a4c03499b92d64adf2a42dd22.r2.dev/canvas/canvas-save-water-tablou-canvas-5.jpg" alt="Colecție Canvas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em]">Popular</span>
                                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Peste 5000 de modele</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">Colecția Canvas</h3>
                                <p className="text-slate-200 text-lg opacity-80 group-hover:opacity-100 transition-opacity">Artă modernă, abstractă și peisaje spectaculoase pe pânză premium.</p>
                            </div>
                        </Link>

                        {/* Acrylic Collection */}
                        <Link href="/shop/acrylic" className="group relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                            <img src="https://pub-5e0f8c0a4c03499b92d64adf2a42dd22.r2.dev/acrylic/save-water-sticla-acrilica-6.jpg" alt="Colecție Sticlă Acrilică" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em]">Premium</span>
                                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Lux & Profunzime</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">Colecția Sticlă Acrilică</h3>
                                <p className="text-slate-200 text-lg opacity-80 group-hover:opacity-100 transition-opacity">Efect de sticlă, culori vibrante și durabilitate excepțională pe plexiglass.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 border-t border-slate-100">
                <div className="container-width">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <FeatureItem
                            icon={<Zap size={24} className="text-indigo-600" />}
                            title="Producție Rapidă"
                            description="Comanda ta este gata de expediere în 24-48 ore de la confirmare."
                        />
                        <FeatureItem
                            icon={<Shield size={24} className="text-indigo-600" />}
                            title="Calitate Garantată"
                            description="Folosim doar materiale premium și cerneluri originale. Nu facem compromisuri."
                        />
                        <FeatureItem
                            icon={<Truck size={24} className="text-indigo-600" />}
                            title="Livrare Sigură"
                            description="Ambalăm fiecare tablou cu protecții multiple pentru a ajunge intact."
                        />
                        <FeatureItem
                            icon={<Star size={24} className="text-indigo-600" />}
                            title="Suport Dedicat"
                            description="Echipa noastră te ajută cu verificarea fișierelor și sfaturi."
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            {/* CTA SECTION */}
            <section className="">
                <div className="container-width pb-24">
                    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight text-slate-900">Pregătit să-ți decorezi spațiul?</h2>
                            <p className="text-slate-600 text-lg mb-10 leading-relaxed text-balance">
                                Urcă poza ta preferată și vezi în timp real cum va arăta pe perete. Fără surprize la preț, fără timpi lungi de așteptare.
                            </p>
                            <Link href="/canvas" className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-8 py-4 text-base font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200">
                                Începe Configurarea
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
