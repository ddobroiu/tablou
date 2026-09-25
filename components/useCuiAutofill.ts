"use client";

import { useEffect, useRef, useState } from "react";

// Datele firmei din ANAF dupa CUI (acelasi serviciu ca la checkout: /api/company).
// Cand CUI-ul are cel putin 3 cifre, dupa o scurta pauza cere datele si le da mai departe.
export type CompanyFound = {
    denumire: string;
    regCom?: string;
    adresa?: string;
    judet?: string;
    localitate?: string;
    codPostal?: string;
    telefon?: string;
};

export function useCuiAutofill(cui: string | null | undefined, onFound: (c: CompanyFound) => void, enabled = true) {
    const [state, setState] = useState<"idle" | "loading" | "found" | "notfound">("idle");
    const [name, setName] = useState<string | null>(null);
    const last = useRef<string>("");
    const cb = useRef(onFound);
    cb.current = onFound;

    useEffect(() => {
        const digits = String(cui || "").replace(/\D/g, "");
        if (!enabled || digits.length < 3) {
            setState("idle");
            return;
        }
        if (digits === last.current) return;
        const t = setTimeout(async () => {
            last.current = digits;
            setState("loading");
            try {
                const res = await fetch(`/api/company?cui=${digits}`);
                if (!res.ok) throw new Error("not found");
                const data = (await res.json()) as CompanyFound;
                // Raspuns venit tarziu pentru un CUI deja schimbat: il ignoram
                if (last.current !== digits) return;
                setName(data.denumire);
                setState("found");
                cb.current(data);
            } catch {
                if (last.current === digits) setState("notfound");
            }
        }, 600);
        return () => clearTimeout(t);
    }, [cui, enabled]);

    const hint =
        state === "loading" ? "Caut firma în ANAF…"
            : state === "found" ? `Completat din ANAF: ${name}`
                : state === "notfound" ? "N-am găsit firma în ANAF. Completează datele de mână."
                    : "Scrie CUI-ul și completăm automat datele firmei din ANAF.";
    return { state, hint };
}
