"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/siteConfig";

export default function ContactClient() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || 'A apărut o eroare la trimitere.');
            }

            setSent(true);
            setForm({ name: "", email: "", phone: "", message: "", website: "" });
        } catch (err: any) {
            setError(err.message || "Eroare de sistem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center lg:p-8 p-0 pt-[104px] lg:pt-[104px]">
            <div className="w-full max-w-[1400px] bg-white lg:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100/60 min-h-[85vh] lg:min-h-[800px] flex flex-col lg:flex-row relative z-10">

                {/* Left Panel - Info & Branding */}
                <div className="relative lg:w-5/12 bg-slate-950 p-8 lg:p-16 flex flex-col justify-between overflow-hidden text-white">
                    {/* Background decorative blobs */}
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
                    
                    {/* Grid Pattern overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-block mb-16 opacity-70 hover:opacity-100 hover:translate-x-1 transition-all">
                            <span className="text-xs font-black tracking-[0.2em] uppercase text-emerald-400">← Înapoi la site</span>
                        </Link>

                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                            Hai să <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">colaborăm.</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
                            Fie că ai nevoie de materiale publicitare complexe, printuri de mari dimensiuni sau doar un sfat tehnic, suntem aici.
                        </p>
                    </div>

                    <div className="relative z-10 mt-16 space-y-8">
                        <a href="mailto:contact@Tablou.net" className="flex items-start gap-5 group cursor-pointer w-fit">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-300">
                                <svg className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-slate-200 text-sm tracking-widest uppercase mb-1">Email</h3>
                                <div className="text-emerald-400 font-medium text-lg">contact@Tablou.net</div>
                            </div>
                        </a>

                        <a href={`tel:${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '+40')}`} className="flex items-start gap-5 group cursor-pointer w-fit">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-300">
                                <svg className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-slate-200 text-sm tracking-widest uppercase mb-1">Telefon & WhatsApp</h3>
                                <div className="text-emerald-400 font-medium text-lg">{siteConfig.phone}</div>
                            </div>
                        </a>

                        <div className="flex items-start gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-slate-200 text-sm tracking-widest uppercase mb-1">Acoperire</h3>
                                <p className="text-slate-400 font-medium">România, Livrare Națională</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="lg:w-7/12 bg-white/80 backdrop-blur-md p-8 lg:p-24 flex flex-col justify-center relative">
                    {sent ? (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 relative group">
                                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <svg className="w-14 h-14 text-emerald-500 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Mesaj recepționat!</h2>
                            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-lg">Mulțumim că ne-ai contactat. Echipa noastră va analiza detaliile și va reveni în cel mai scurt timp.</p>
                            <Button onClick={() => setSent(false)} className="bg-slate-950 text-white hover:bg-emerald-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-black px-10 h-14 rounded-full shadow-xl shadow-slate-900/10">Trimite un alt mesaj</Button>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto w-full">
                            <div className="mb-12">
                                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Trimite-ne un mesaj</h2>
                                <p className="text-slate-500 font-medium">Completează formularul de mai jos pentru oferte personalizate sau întrebări generale.</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3">
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Nume complet <span className="text-emerald-500">*</span></label>
                                        <Input
                                            id="name" name="name"
                                            placeholder="Ion Popescu"
                                            required
                                            value={form.name} onChange={handleChange}
                                            className="h-14 bg-slate-50 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-xl font-medium"
                                        />
                                    </div>
                                    {/* Honeypot field - block bots */}
                                    <div className="hidden" aria-hidden="true">
                                        <Input
                                            id="website"
                                            name="website"
                                            type="text"
                                            placeholder="Your website"
                                            value={form.website}
                                            onChange={handleChange}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Telefon <span className="text-slate-400 lowercase tracking-normal">(opțional)</span></label>
                                        <Input
                                            id="phone" name="phone"
                                            placeholder="0750 xxx xxx"
                                            value={form.phone} onChange={handleChange}
                                            className="h-14 bg-slate-50 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-xl font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Adresă de email <span className="text-emerald-500">*</span></label>
                                    <Input
                                        id="email" name="email" type="email"
                                        placeholder="adresa@companie.ro"
                                        required
                                        value={form.email} onChange={handleChange}
                                        className="h-14 bg-slate-50 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-xl font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Mesajul tău <span className="text-emerald-500">*</span></label>
                                    <textarea
                                        id="message" name="message"
                                        required
                                        rows={5}
                                        placeholder="Salut, aș dori detalii tehnice sau o ofertă pentru..."
                                        value={form.message} onChange={handleChange}
                                        className="flex w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] bg-slate-950 text-white hover:bg-emerald-500 rounded-xl transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 mt-4" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                            Se trimite...
                                        </span>
                                    ) : "Trimite Solicitarea"}
                                </Button>

                                <p className="text-xs text-center text-slate-500 mt-6 font-medium">
                                    Prin trimiterea acestui formular, ești de acord cu <Link href="/termeni" className="text-slate-900 font-bold underline hover:text-emerald-500 transition-colors">Termenii și Condițiile</Link>.
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
