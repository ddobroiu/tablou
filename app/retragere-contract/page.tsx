"use client";

import React, { Suspense, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function RetragereContractPage() {
    return (
        <Suspense fallback={null}>
            <RetragereContractForm />
        </Suspense>
    );
}

function RetragereContractForm() {
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ name: "", email: "", phone: "", orderRef: "", products: "", message: "" });

    useEffect(() => {
        const order = searchParams.get("order");
        if (order) setForm((f) => ({ ...f, orderRef: order }));
    }, [searchParams]);

    const [confirmed, setConfirmed] = useState(false);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submittedAt, setSubmittedAt] = useState<string | null>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(null);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!confirmed) {
            setError("Bifează confirmarea de mai jos înainte de a trimite cererea.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/retur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, source: "tablou.net" }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "A apărut o eroare la trimitere.");

            setSent(true);
            setSubmittedAt(data.submittedAt);
        } catch (err: any) {
            setError(err.message || "Ceva nu a funcționat. Te rugăm să încerci din nou sau să ne scrii direct.");
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 lg:py-32 flex items-center justify-center px-4">
                <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 p-10 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Cererea de retragere a fost înregistrată</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Ți-am trimis o confirmare pe email, cu conținutul cererii{submittedAt ? `, transmisă pe ${submittedAt}` : ""}.
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mb-8">
                        Echipa noastră va analiza cererea conform politicii de retur și îți va răspunde separat pe email.
                    </p>
                    <Link href="/" className="btn-outline px-8 py-4 inline-block">Înapoi la prima pagină</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 lg:py-32 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase italic leading-none">
                        Retrage-te din <span className="text-emerald-600">contract</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-emerald-600 mx-auto rounded-full shadow-lg mb-6"></div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Formularul de mai jos transmite o cerere oficială de retragere dintr-un contract la distanță, conform legii.
                        Vezi și <Link href="/politica-retur" className="text-emerald-600 font-semibold underline">politica noastră de retur</Link> pentru condiții și termene.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Nume complet *</span>
                            <input required name="name" value={form.name} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Email *</span>
                            <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Număr comandă / contract *</span>
                            <input required name="orderRef" value={form.orderRef} onChange={handleChange} placeholder="ex: #10234" className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Telefon</span>
                            <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Produsele vizate *</span>
                        <input required name="products" value={form.products} onChange={handleChange} placeholder="ex: Banner 200x100cm, cantitate 1" className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </label>

                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Mesaj (opțional)</span>
                        <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                            Confirm că doresc să mă retrag din contractul la distanță pentru comanda și produsele indicate mai sus.
                        </span>
                    </label>

                    {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest transition-colors"
                    >
                        {loading ? "Se trimite..." : "Confirmă retragerea"}
                    </button>
                </form>
            </div>
        </main>
    );
}
