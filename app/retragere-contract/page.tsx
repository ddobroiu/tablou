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

    // Retur partial (OUG 18/2026): dupa numarul comenzii si email incarcam produsele, iar clientul
    // bifeaza ce returneaza si cate bucati. Daca nu gasim comanda, ramane campul text.
    const [items, setItems] = useState<{ id: string; name: string; qty: number }[] | null>(null);
    const [picked, setPicked] = useState<Record<string, number>>({});
    const [lookup, setLookup] = useState<"idle" | "loading" | "found" | "notfound">("idle");

    useEffect(() => {
        const ref = form.orderRef.replace(/\D/g, "");
        if (!ref || !form.email.includes("@")) { setItems(null); setLookup("idle"); return; }
        const t = setTimeout(async () => {
            setLookup("loading");
            try {
                const res = await fetch("/api/retur/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderRef: ref, email: form.email }),
                });
                if (!res.ok) throw new Error("not found");
                const data = await res.json();
                setItems(data.items || []);
                setPicked({});
                setLookup("found");
            } catch {
                setItems(null);
                setLookup("notfound");
            }
        }, 700);
        return () => clearTimeout(t);
    }, [form.orderRef, form.email]);

    const pickedText = (items || [])
        .filter((i) => picked[i.id] > 0)
        .map((i) => `${i.name} × ${picked[i.id]} (din ${i.qty})`)
        .join("; ");

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
        const products = items ? pickedText : form.products;
        if (!products.trim()) {
            setError(items ? "Bifează produsele pe care le returnezi." : "Scrie produsele vizate.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/retur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, products, source: "tablou.net" }),
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

                    {items ? (
                        <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                            <legend className="px-1 text-sm font-bold text-slate-700 dark:text-slate-300">Ce returnezi din comandă? *</legend>
                            <p className="mb-3 text-xs text-slate-500">Poți returna doar o parte din produse sau din cantitate.</p>
                            <ul className="space-y-2">
                                {items.map((i) => (
                                    <li key={i.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
                                        <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm text-slate-800 dark:text-slate-200">
                                            <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-emerald-600"
                                                checked={(picked[i.id] || 0) > 0}
                                                onChange={(e) => setPicked((p) => ({ ...p, [i.id]: e.target.checked ? i.qty : 0 }))} />
                                            {i.name}
                                        </label>
                                        {(picked[i.id] || 0) > 0 && i.qty > 1 && (
                                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                                Bucăți
                                                <input type="number" min={1} max={i.qty} value={picked[i.id]}
                                                    onChange={(e) => setPicked((p) => ({ ...p, [i.id]: Math.max(1, Math.min(i.qty, Number(e.target.value) || 1)) }))}
                                                    className="w-20 rounded-lg border border-slate-300 bg-white p-1.5 text-sm dark:bg-slate-800" />
                                                din {i.qty}
                                            </label>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                    ) : (
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Produsele vizate *</span>
                            <input name="products" value={form.products} onChange={handleChange} placeholder="ex: Banner 200x100cm, cantitate 1" className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                            <span className="mt-1 block text-xs text-slate-500">
                                {lookup === "loading" ? "Caut comanda…" : lookup === "notfound" ? "N-am găsit comanda cu acest email: scrie produsele de mână." : "Completează numărul comenzii și emailul de pe comandă ca să alegi produsele din listă."}
                            </span>
                        </label>
                    )}

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
