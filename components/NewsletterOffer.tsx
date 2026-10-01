"use client";
// Fereastra de abonare „10% reducere la următoarea comandă”. FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
// Apare o singură dată (după 30 s pe site sau la ieșire pe desktop), nu pe checkout/cont/admin.
// Închisă → nu mai apare 30 de zile; abonat → nu mai apare deloc.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

const KEY = "nl-offer-v1";
const HIDE_ON = [/^\/checkout/, /^\/account/, /^\/cont/, /^\/admin/, /^\/login/, /^\/dezabonare/, /^\/comanda/];

export default function NewsletterOffer({ percent = 10 }: { percent?: number }) {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (HIDE_ON.some((r) => r.test(pathname))) return;
        let seen: string | null;
        try {
            seen = localStorage.getItem(KEY);
        } catch {
            return; // fără stocare locală nu putem ține minte că a fost închisă: nu o arătăm
        }
        const hidden = (v: string | null) => v === "done" || (!!v && Date.now() - Number(v) < 30 * 86400_000);
        if (hidden(seen)) return;
        let shown = false;
        // o singură dată pe pagină și niciodată după ce a fost închisă (timerul și ieșirea cu mouse-ul rămân armate)
        const show = () => {
            let now: string | null = null;
            try {
                now = localStorage.getItem(KEY);
            } catch {
                /* fără stocare */
            }
            if (shown || hidden(now)) return;
            shown = true;
            clearTimeout(t);
            document.removeEventListener("mouseout", onLeave);
            setOpen(true);
        };
        const t = setTimeout(show, 30_000);
        const onLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) show();
        };
        document.addEventListener("mouseout", onLeave);
        return () => {
            clearTimeout(t);
            document.removeEventListener("mouseout", onLeave);
        };
    }, [pathname]);

    const remember = (v: string) => {
        try {
            localStorage.setItem(KEY, v);
        } catch {
            /* fără stocare */
        }
    };

    const close = () => {
        setOpen(false);
        remember(state === "done" ? "done" : String(Date.now()));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) {
            setState("error");
            setMsg("Bifează acordul ca să-ți trimitem codul.");
            return;
        }
        setState("sending");
        try {
            const r = await fetch("/api/subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, consent: true }),
            });
            const j = await r.json().catch(() => ({}));
            if (!r.ok) {
                setState("error");
                setMsg(j.message || "Nu a mers. Încearcă din nou.");
                return;
            }
            setState("done");
            setMsg(j.message || "Gata! Verifică emailul.");
            remember("done");
        } catch {
            setState("error");
            setMsg("Nu a mers. Încearcă din nou.");
        }
    };

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Abonare cu reducere"
            onClick={close}
        >
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={close}
                    aria-label="Închide"
                    className="absolute right-3 top-3 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                    ✕
                </button>
                {state === "done" ? (
                    <div className="py-4 text-center">
                        <p className="text-lg font-bold text-slate-900">{msg}</p>
                        <p className="mt-2 text-sm text-slate-600">Dacă nu îl vezi, uită-te și în Promoții sau Spam.</p>
                        <button onClick={close} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white">
                            Mulțumesc
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">{siteConfig.name}</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">{percent}% reducere la următoarea comandă</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Lasă-ne emailul și îți trimitem un cod personal. Îți scriem cel mult o dată pe lună, cu idei și oferte.
                        </p>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplu.ro"
                            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        />
                        <label className="mt-3 flex items-start gap-2 text-xs text-slate-600">
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600"
                            />
                            <span>
                                Sunt de acord să primesc emailuri cu oferte de la {siteConfig.name}. Mă pot dezabona oricând din orice email.
                                Detalii în{" "}
                                <a href="/confidentialitate" target="_blank" className="underline">
                                    Politica de confidențialitate
                                </a>
                                .
                            </span>
                        </label>
                        {state === "error" && <p className="mt-2 text-sm text-red-600">{msg}</p>}
                        <button
                            type="submit"
                            disabled={state === "sending"}
                            className="mt-4 w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {state === "sending" ? "Se trimite…" : "Vreau codul"}
                        </button>
                        <p className="mt-2 text-center text-[11px] text-slate-400">Codul e valabil 60 de zile, pentru o singură comandă.</p>
                    </form>
                )}
            </div>
        </div>
    );
}
