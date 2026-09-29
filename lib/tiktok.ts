// TikTok Pixel (măsurarea eficienței reclamelor TikTok și publicuri de remarketing).
// Se încarcă NUMAI după consimțământul pentru marketing, din components/CookieConsent.tsx,
// și niciodată pe paginile cu date personale (aceeași listă ca la Clarity: lib/clarity.ts),
// cu o singură excepție: pagina de mulțumire după comandă, ca să putem trimite CompletePayment.

import { isClarityExcludedPath } from "./clarity";
import { readConsent } from "./cookieConsent";

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "DATFUK3C77UFS4KR7770";

/** Pagini de mulțumire (sub /checkout, exclus altfel) pe care pixelul are voie să ruleze pentru CompletePayment. */
const TIKTOK_ALLOWED_THANK_YOU_PATHS = ["/checkout/success"];

export function isTikTokExcludedPath(pathname: string | null | undefined): boolean {
    const p = pathname || "/";
    if (TIKTOK_ALLOWED_THANK_YOU_PATHS.some((x) => p === x || p.startsWith(x + "/"))) return false;
    return isClarityExcludedPath(p);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ttq = any;

function win() {
    return window as unknown as {
        ttq?: Ttq;
        TiktokAnalyticsObject?: string;
        __ttqLoaded?: boolean;
        __ttqRevoked?: boolean;
        __ttqLastPath?: string;
    };
}

/** Snippetul oficial TikTok (fără load/page, pe care le apelăm separat, cu holdConsent înainte). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function injectBaseCode(w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ttq.setAndDefer = function (t: any, e: string) {
        t[e] = function (...args: unknown[]) {
            t.push([e].concat(args as never[]));
        };
    };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t: string) {
        const e = ttq._i[t] || [];
        for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ttq.load = function (e: string, n?: any) {
        const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        const s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = r + "?sdkid=" + e + "&lib=" + t;
        const first = d.getElementsByTagName("script")[0];
        if (first?.parentNode) first.parentNode.insertBefore(s, first);
        else d.head.appendChild(s);
    };
}

export function isTikTokLoaded(): boolean {
    return typeof window !== "undefined" && !!win().__ttqLoaded && !win().__ttqRevoked;
}

/** Încarcă pixelul (o singură dată pe pagină) după consimțământul pentru marketing; la re-acordare, grantConsent. */
export function loadTikTok(pathname?: string | null) {
    if (!TIKTOK_PIXEL_ID || typeof window === "undefined") return;
    const path = pathname ?? window.location.pathname;
    if (isTikTokExcludedPath(path)) return;
    const w = win();
    if (!w.__ttqLoaded) {
        injectBaseCode(w, document, "ttq");
        w.ttq.holdConsent();
        w.ttq.load(TIKTOK_PIXEL_ID);
        w.ttq.page();
        w.ttq.grantConsent();
        w.__ttqLoaded = true;
        w.__ttqRevoked = false;
        w.__ttqLastPath = path;
        return;
    }
    if (w.__ttqRevoked) {
        w.ttq?.grantConsent();
        w.__ttqRevoked = false;
    }
}

/** Navigare client-side: page() pe paginile noi (nu la prima încărcare, acoperită de loadTikTok), niciodată pe cele excluse. */
export function syncTikTokWithPath(pathname: string | null | undefined, marketingConsent: boolean) {
    if (!TIKTOK_PIXEL_ID || typeof window === "undefined" || !marketingConsent) return;
    const path = pathname || "/";
    if (isTikTokExcludedPath(path)) return;
    const w = win();
    if (!w.__ttqLoaded) {
        loadTikTok(path);
        return;
    }
    if (w.__ttqRevoked || w.__ttqLastPath === path) return;
    w.__ttqLastPath = path;
    w.ttq?.page();
}

/** La refuz / retragere: revokeConsent și ștergerea cookie-urilor _ttp / _tt_enable_cookie. */
export function revokeTikTok() {
    if (typeof window === "undefined") return;
    const w = win();
    if (w.__ttqLoaded && !w.__ttqRevoked) {
        w.ttq?.revokeConsent();
        w.__ttqRevoked = true;
    }
    const host = window.location.hostname;
    const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    for (const name of ["_ttp", "_tt_enable_cookie"]) {
        for (const d of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
        }
    }
}

export type TikTokContent = { content_id: string; content_name?: string; quantity?: number; price?: number };
export type TikTokParams = {
    value?: number;
    currency?: string;
    content_type?: "product" | "product_group";
    contents?: TikTokContent[];
    order_id?: string;
    event_id?: string;
};

/** Trimite un eveniment numai cu consimțământ pentru marketing și cu pixelul încărcat. Întoarce true dacă s-a trimis. */
export function trackTikTok(event: string, params: TikTokParams = {}): boolean {
    if (typeof window === "undefined" || !isTikTokLoaded()) return false;
    if (!readConsent()?.marketing) return false;
    const w = win();
    if (params.event_id) w.ttq.track(event, params, { event_id: params.event_id });
    else w.ttq.track(event, params);
    return true;
}
