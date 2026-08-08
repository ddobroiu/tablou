import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
    Building2,
    CheckCircle2,
    CreditCard,
    FileCheck2,
    ShieldCheck,
    Zap,
    Phone,
    Mail,
    MessageSquare,
    ArrowRight,
    TrendingUp,
    Award
} from "lucide-react";

export const metadata: Metadata = {
    title: "Achiziții Publice prin SEAP / SICAP",
    description: "Colaborăm cu instituțiile statului prin SEAP/SICAP. Facturare electronică e-Factura, plată la termen prin Trezorerie și consultanță dedicată pentru...",
    keywords: ["SEAP", "SICAP", "achizitii publice", "tablou seap", "plata trezorerie", "e-factura", "catalog seap", "bannere seap", "semnalistica institutii"],
};

const SEAPFeatures = [
    {
        title: "Catalog SEAP/SICAP",
        description: "Suntem prezenți în catalogul electronic cu toate produsele noastre standard. Putem adăuga pachete personalizate la cerere.",
        icon: Building2,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Plată prin Trezorerie",
        description: "Acceptăm plata prin contul de Trezorerie, conform reglementărilor în vigoare pentru instituțiile publice.",
        icon: CreditCard,
        color: "text-green-600",
        bg: "bg-green-50"
    },
    {
        title: "e-Factura",
        description: "Emitem facturi electronice și le transmitem automat în sistemul național RO e-Factura pentru o procesare rapidă.",
        icon: FileCheck2,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Plată la Termen",
        description: "Oferim termene de plată flexibile (30 zile sau conform contractului de achiziție) pentru instituțiile de stat.",
        icon: Zap,
        color: "text-orange-600",
        bg: "bg-orange-50"
    },
    {
        title: "Documentație Completă",
        description: "Oferim certificate de conformitate, fișe tehnice și toată documentația necesară pentru dosarul de achiziție.",
        icon: ShieldCheck,
        color: "text-red-600",
        bg: "bg-red-50"
    },
    {
        title: "Consultanță Dedicată",
        description: "Un specialist Tablou vă stă la dispoziție pentru a vă ajuta cu specificațiile tehnice și configurarea pachetelor.",
        icon: MessageSquare,
        color: "text-teal-600",
        bg: "bg-teal-50"
    }
];

export default function SeapPage() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-green-500 selection:text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-white/10">
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcb9vfqv9/image/upload/v1710500000/grid-white.svg')] opacity-5 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest mb-8 animate-fade-in">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        Partener de Încredere pentru Instituții Publice
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                        Achiziții Publice prin <span className="text-green-400">SEAP / SICAP</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        Simplificăm procesul de achiziție pentru primării, școli, spitale și alte instituții de stat.
                        Producție publicitară premium, livrare rapidă și conformitate legală totală.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="#contact-seap" className="w-full sm:w-auto px-10 py-5 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-500 transition-all shadow-2xl shadow-green-900/40 uppercase tracking-wider flex items-center justify-center gap-3">
                            Solicită Ofertă SEAP <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="tel:0750473111" className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3">
                            <Phone className="w-5 h-5 text-green-400" /> 0750.473.111
                        </a>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Benefits Grid */}
                    <div className="lg:col-span-2 space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {SEAPFeatures.map((feature, idx) => (
                                <div key={idx} className="group p-8 bg-white rounded-3xl border border-slate-200 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-300">
                                    <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* SEAP Process Section */}
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500 opacity-10 blur-[100px] pointer-events-none"></div>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                <Zap className="text-green-400" /> Procedura de Achiziție
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 font-black text-xl text-green-400">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Identificarea produselor</h4>
                                        <p className="text-slate-400">Alegeți produsele de pe Tablou.net sau solicitați o ofertă personalizată prin email la <span className="text-green-400 font-bold">contact@Tablou.net</span>.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 font-black text-xl text-green-400">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Publicarea în catalog</h4>
                                        <p className="text-slate-400">Echipa noastră publică produsele / pachetele în catalogul SEAP pe codul CPV indicat de dumneavoastră.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 font-black text-xl text-green-400">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Acceptarea achiziției</h4>
                                        <p className="text-slate-400">După ce efectuați cumpărarea directă în sistem, procesăm comanda și livrăm materialele în cel mai scurt timp.</p>
                                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-300 italic">
                                            <strong>Info:</strong> Date de identificare în SEAP: <strong>CULOAREA DIN VIATA SA SRL</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div id="contact-seap" className="lg:col-span-1">
                        <div className="sticky top-32 p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Aveți un proiect specific?</h3>
                            <p className="text-slate-500 mb-10 font-medium">Lăsați un specialist să se ocupe de tot procesul SEAP pentru dumneavoastră. Vă răspundem în maxim 60 de minute.</p>

                            <div className="space-y-6">
                                <a href="tel:0750473111" className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-400 transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Telefon Direct</span>
                                        <span className="text-xl font-black text-slate-900 tracking-tight">0750.473.111</span>
                                    </div>
                                </a>

                                <a href="mailto:contact@Tablou.net" className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-400 transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <Mail className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email SEAP</span>
                                        <span className="text-xl font-black text-slate-900 tracking-tight">contact@Tablou.net</span>
                                    </div>
                                </a>

                                <a href="https://wa.me/40750473111" className="flex items-center gap-5 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:border-emerald-500 transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-emerald-600/60 uppercase tracking-widest mb-1">WhatsApp de Urgență</span>
                                        <span className="text-xl font-black text-slate-900 tracking-tight">Live Chat</span>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <Award className="w-8 h-8 text-green-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 leading-tight">Garantăm cel mai bun raport calitate-preț pentru instituțiile publice.</p>
                                </div>
                                <Link href="/judet" className="text-green-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                    Vezi livrări în județul tău <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-4xl font-black text-slate-900 mb-12 text-center uppercase tracking-tight">Experți în Semnalistică pentru Fonduri Europene și SEAP</h2>

                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-green-600 prose-strong:text-slate-900">
                        <p>
                            Platforma <strong>Tablou.net</strong> este pregătită să preia și să proceseze comenzi complexe prin sistemul electronic de achiziții publice. Înțelegem rigurozitatea cerută de manualele de identitate vizuală (MIV) pentru proiectele finanțate prin <strong>PNRR</strong>, <strong>Programul Regional</strong>, sau <strong>Fonduri Structurale</strong>.
                        </p>

                        <h3>Categorii CPV Populare în Catalogul Nostru:</h3>
                        <ul>
                            <li><strong>22462000-6</strong> Materiale publicitare tipărite</li>
                            <li><strong>39154100-7</strong> Sisteme de expoziție (Roll-up, Pop-up)</li>
                            <li><strong>35261000-1</strong> Panouri de informare</li>
                            <li><strong>22140000-3</strong> Fluturași și pliante</li>
                            <li><strong>22400000-4</strong> Timbre, formulare, cecuri, titluri de acțiuni, broșuri comerciale</li>
                        </ul>

                        <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-200 mt-12 mb-12 shadow-inner">
                            <h4 className="flex items-center gap-3 text-2xl font-black mb-4">
                                <TrendingUp className="text-green-600" /> SEO & Vizibilitate Online
                            </h4>
                            <p>
                                Pentru a ne asigura că suntem soluția nr. 1 în căutările pentru <strong>achiziții publice print</strong>, <strong>bannere seap</strong>, sau <strong>pliante sicap</strong>, actualizăm constant catalogul nostru. Oferim prețuri competitive de producător, eliminând intermediarii, ceea ce reprezintă un avantaj major în evaluarea ofertelor economice.
                            </p>
                        </div>

                        <h3>Plată la Termen și Trezorerie</h3>
                        <p>
                            Instituția dumneavoastră beneficiază de <strong>plată la termen prin Trezorerie</strong>. Factura pe care o trimitem este însoțită de toate elementele necesare decontării: contul IBAN de trezorerie, codul de identificare fiscală CULOAREA DIN VIATA SA SRL și detalii contractuale clare.
                        </p>

                        <p>
                            Suntem mândri să colaborăm cu sute de primării și consilii județene din toată România, asigurând un standard de calitate european pentru fiecare produs livrat.
                        </p>
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">500+</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instituții de Stat</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">100%</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Conformitate MIV</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">24H</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timp Răspuns Ofertă</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">RO</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Livrări Naționale</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 bg-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-10 tracking-tight leading-none uppercase">Gata să începem colaborarea?</h2>
                    <p className="text-xl text-slate-500 mb-16 font-medium">Trimiteți-ne necesarul de produse pentru SEAP și noi ne ocupăm de tot procesul de publicare în sistem.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a href="mailto:contact@Tablou.net" className="px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-widest">
                            Trimite Email SEAP
                        </a>
                        <Link href="/contact" className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
                            Solicită Consultanță
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

