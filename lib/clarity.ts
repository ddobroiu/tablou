// Microsoft Clarity (hărți de interacțiune și înregistrări de sesiune, cu conținutul mascat).
// Se încarcă NUMAI după consimțământul pentru statistică, din components/CookieConsent.tsx,
// și niciodată pe paginile unde se introduc date personale (cont, autentificare, coș, plată, admin).

export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "ypl9ek3sbg";

const CLARITY_SCRIPT_ID = "clarity-js";

/** Căile pe care Clarity nu se încarcă și, dacă rulează deja, se oprește. */
const CLARITY_EXCLUDED_PATHS = [
    "/admin",
    "/account",
    "/login",
    "/seteaza-parola",
    "/cart",
    "/checkout",
    "/comanda",
    "/urmareste-comanda",
    "/formular-retragere",
    "/retragere-contract",
    "/stergere-date",
    "/reclamatii",
];

export function isClarityExcludedPath(pathname: string | null | undefined): boolean {
    const p = pathname || "/";
    return CLARITY_EXCLUDED_PATHS.some((x) => p === x || p.startsWith(x + "/"));
}

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

function win() {
    return window as unknown as { clarity?: ClarityFn; __clarityPaused?: boolean };
}

/** Încarcă tagul Clarity (idempotent) și îi transmite consimțământul pentru statistică. */
export function loadClarity(pathname?: string | null) {
    if (!CLARITY_ID || typeof window === "undefined") return;
    if (isClarityExcludedPath(pathname ?? window.location.pathname)) return;
    const w = win();
    if (!document.getElementById(CLARITY_SCRIPT_ID)) {
        // snippetul standard Clarity
        w.clarity =
            w.clarity ||
            function (...args: unknown[]) {
                (w.clarity!.q = w.clarity!.q || []).push(args);
            };
        const s = document.createElement("script");
        s.async = true;
        s.id = CLARITY_SCRIPT_ID;
        s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
        const first = document.getElementsByTagName("script")[0];
        if (first?.parentNode) first.parentNode.insertBefore(s, first);
        else document.head.appendChild(s);
    } else if (w.__clarityPaused) {
        w.clarity?.("resume");
    }
    w.__clarityPaused = false;
    w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

/** La navigarea pe o pagină exclusă oprim înregistrarea; la ieșire o reluăm (doar cu consimțământ). */
export function syncClarityWithPath(pathname: string | null | undefined, analyticsConsent: boolean) {
    if (!CLARITY_ID || typeof window === "undefined") return;
    const w = win();
    if (isClarityExcludedPath(pathname)) {
        if (w.clarity && !w.__clarityPaused) {
            w.clarity("pause");
            w.__clarityPaused = true;
        }
        return;
    }
    if (analyticsConsent) loadClarity(pathname);
}

/** La refuz / retragere: semnal de consimțământ refuzat și ștergerea cookie-urilor _clck / _clsk. */
export function revokeClarity() {
    if (typeof window === "undefined") return;
    const w = win();
    w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    const host = window.location.hostname;
    const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    for (const name of ["_clck", "_clsk"]) {
        for (const d of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
        }
    }
}
