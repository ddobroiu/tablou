"use client";

import React from "react";
import Link from "next/link";
import { Truck, Package, MapPin, Clock, CheckCircle, CreditCard } from "lucide-react";

export default function LivrareClient() {
    return (
        <main className="min-h-screen bg-bg text-text flex items-center justify-center lg:p-8 p-0 pt-24 lg:pt-28">
            <div className="w-full max-w-[1600px] bg-white dark:bg-slate-950 lg:rounded-3xl overflow-hidden shadow-2xl border border-border min-h-screen lg:min-h-[800px] flex flex-col lg:flex-row">

                {/* Left Panel - Info & Branding */}
                <div className="relative lg:w-5/12 bg-slate-50 dark:bg-slate-900 p-8 lg:p-16 flex flex-col justify-between overflow-hidden">
                    {/* Background decorative blobs */}
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-block mb-12 opacity-80 hover:opacity-100 transition">
                            <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">← Înapoi la site</span>
                        </Link>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6">
                            Livrare <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600">rapidă.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                            Transport rapid în toată România. Comenzile tale ajung la tine în 1-2 zile lucrătoare.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 space-y-8">
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-border flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all duration-300 shadow-sm border">
                                <Clock className="w-5 h-5 text-foreground group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">1-2 zile</h3>
                                <p className="text-muted-foreground">Livrare în toată țara</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-border flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all duration-300 shadow-sm border">
                                <CreditCard className="w-5 h-5 text-foreground group-hover:text-green-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Livrare DPD</h3>
                                <p className="text-muted-foreground">de la 24 RON (40 RON &gt; 100cm)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-border flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all duration-300 shadow-sm border">
                                <Package className="w-5 h-5 text-foreground group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Urmărire AWB</h3>
                                <p className="text-muted-foreground">Real-time prin email & SMS</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-border flex items-center justify-center shadow-sm border">
                                <MapPin className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Ridicare personală</h3>
                                <p className="text-muted-foreground">GRATUIT din depozit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Details */}
                <div className="lg:w-7/12 bg-white dark:bg-slate-950 p-8 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
                    <div className="max-w-2xl mx-auto w-full space-y-12">

                        {/* Costuri Transport */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Costuri de Transport</h2>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                                    Valoare Comandă
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                                    Cost Livrare
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-foreground font-medium">
                                                    Cost Livrare Standard (Romania)
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                                        24 RON
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-foreground font-medium">
                                                    Materiale Rigide Agabaritice (&gt; 100 cm pe orice latură)
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold">
                                                        40.00 RON
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-foreground font-medium">
                                                    Comenzi peste 500 RON
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold">
                                                        GRATUIT
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Timpi de Livrare */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Timpi de Livrare</h2>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">1-2 zile lucrătoare</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Toate produsele sunt procesate și livrate în <strong>1-2 zile lucrătoare</strong> în toată România.
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="text-foreground">Produse incluse:</strong> Bannere, Autocolante, Pliante, Flayere, Canvas, Tablouri, Materiale Rigide (PVC, Plexiglass, Alucobond).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ridicare Personală */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Ridicare din Depozit</h2>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">GRATUIT - Fără costuri</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Poți ridica comanda personal din depozitul nostru, fără costuri suplimentare.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                                    <p className="font-semibold text-foreground text-sm">Program ridicări:</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>📅 <strong>Luni - Vineri:</strong> 09:00 - 18:00</p>
                                        <p>📅 <strong>Sâmbătă:</strong> 10:00 - 14:00</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-700">
                                        *Te rugăm să anunți cu 24h înainte pentru a pregăti comanda
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Urmărire Comandă */}
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center bg-emerald-50 dark:bg-emerald-900/10">
                            <Package className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                            <h3 className="text-xl font-bold text-foreground mb-2">Urmărește-ți Comanda</h3>
                            <p className="text-muted-foreground mb-6">
                                Primești AWB automat prin email și SMS. Poți urmări coletul în timp real.
                            </p>
                            <Link
                                href="/account"
                                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                            >
                                Verifică Status Comandă
                            </Link>
                        </div>

                        {/* Contact */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground mb-3">Ai întrebări despre livrare?</h3>
                            <p className="text-muted-foreground mb-6">
                                Echipa noastră este gata să te ajute cu orice detalii despre transport și livrare.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="tel:+40750473111"
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                                >
                                    📞 0750 473 111
                                </a>
                                <a
                                    href="mailto:contact@Tablou.net"
                                    className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
                                >
                                    ✉️ contact@Tablou.net
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

