"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRACKING } from "@/lib/company";
import {
    CONSENT_CHANGE_EVENT,
    OPEN_COOKIE_SETTINGS_EVENT,
    readConsent,
    saveConsent,
    type ConsentChoice,
} from "@/lib/cookieConsent";
import { CLARITY_ID, loadClarity, revokeClarity, syncClarityWithPath } from "@/lib/clarity";
import { loadTikTok, revokeTikTok, syncTikTokWithPath } from "@/lib/tiktok";

const HAS_ANALYTICS = TRACKING.ga4Ids.length > 0 || !!TRACKING.siteAnalyticsSrc || !!CLARITY_ID;
const HAS_MARKETING =
    TRACKING.googleAdsIds.length > 0 || !!TRACKING.gtmId || !!TRACKING.metaPixelId || !!TRACKING.tiktokPixelId;

function dataLayer(): unknown[] {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    return w.dataLayer;
}

// gtag trebuie să pună în dataLayer obiectul `arguments`, nu un array
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    dataLayer().push(arguments);
}

function inlineScript(id: string, code: string) {
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.text = code;
    document.head.appendChild(s);
}

function loadScript(src: string, id: string) {
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.id = id;
    document.head.appendChild(s);
}

/** Încarcă scripturile pentru categoriile acceptate. Nimic nu se încarcă înainte de consimțământ. */
function applyConsent(c: ConsentChoice, loaded: Set<string>) {
    gtag("consent", "update", {
        analytics_storage: c.analytics ? "granted" : "denied",
        ad_storage: c.marketing ? "granted" : "denied",
        ad_user_data: c.marketing ? "granted" : "denied",
        ad_personalization: c.marketing ? "granted" : "denied",
    });

    const gaIds = c.analytics ? TRACKING.ga4Ids : [];
    const adsIds = c.marketing ? TRACKING.googleAdsIds : [];
    const tagIds = [...gaIds, ...adsIds];
    if (tagIds.length > 0) {
        if (!loaded.has("gtag")) {
            loaded.add("gtag");
            gtag("js", new Date());
            loadScript(`https://www.googletagmanager.com/gtag/js?id=${tagIds[0]}`, "gtag-js");
        }
        for (const id of tagIds) {
            if (loaded.has(id)) continue;
            loaded.add(id);
            gtag("config", id);
        }
    }

    if (TRACKING.gtmId && (c.analytics || c.marketing) && !loaded.has("gtm")) {
        loaded.add("gtm");
        dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });
        loadScript(`https://www.googletagmanager.com/gtm.js?id=${TRACKING.gtmId}`, "gtm-js");
    }

    if (TRACKING.siteAnalyticsSrc && c.analytics && !loaded.has("pt")) {
        loaded.add("pt");
        loadScript(TRACKING.siteAnalyticsSrc, "pt-track");
    }

    // Microsoft Clarity: numai cu statistică acceptată și în afara paginilor cu date personale (lib/clarity.ts)
    if (c.analytics) loadClarity();

    if (TRACKING.metaPixelId && c.marketing && !loaded.has("fbq")) {
        loaded.add("fbq");
        // snippetul oficial Meta Pixel
        inlineScript(
            "fbq-init",
            `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(TRACKING.metaPixelId)});fbq('track','PageView');`
        );
    }

    // TikTok Pixel: numai cu marketing acceptat și în afara paginilor cu date personale (lib/tiktok.ts)
    if (TRACKING.tiktokPixelId && c.marketing) loadTikTok();

    dataLayer().push({ event: "cookie_consent_update", analytics: c.analytics, marketing: c.marketing });
    window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { analytics: c.analytics, marketing: c.marketing } })
    );
}

/** La retragerea consimțământului ștergem cookie-urile neesențiale deja puse pe domeniul nostru. */
function clearNonEssentialCookies() {
    const prefixes = ["_ga", "_gid", "_gat", "_gcl", "_fbp", "_fbc", "_ttp", "_tt_", "_pt_vid", "_clck", "_clsk"];
    const host = location.hostname;
    const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    for (const part of document.cookie.split(";")) {
        const name = part.split("=")[0]?.trim();
        if (!name || !prefixes.some((p) => name.startsWith(p))) continue;
        for (const d of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
        }
    }
    try {
        for (const k of ["_pt_vid", "_pt_sid", "_pt_last"]) localStorage.removeItem(k);
    } catch { }
}

export default function CookieConsent() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [showPrefs, setShowPrefs] = useState(false);
    const [analytics, setAnalytics] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const current = useRef<ConsentChoice | null>(null);
    const loaded = useRef(new Set<string>());

    useEffect(() => {
        const c = readConsent();
        current.current = c;
        let t: number | undefined;
        if (c) applyConsent(c, loaded.current);
        else t = window.setTimeout(() => setOpen(true), 0);
        const onOpen = () => {
            const saved = readConsent();
            setAnalytics(!!saved?.analytics);
            setMarketing(!!saved?.marketing);
            setShowPrefs(true);
            setOpen(true);
        };
        window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
        return () => {
            window.clearTimeout(t);
            window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
        };
    }, []);

    // Clarity se oprește pe paginile excluse (cont, login, coș, plată, admin) și se reia în afara lor.
    useEffect(() => {
        syncClarityWithPath(pathname, !!current.current?.analytics);
        syncTikTokWithPath(pathname, !!current.current?.marketing);
    }, [pathname]);

    const decide = useCallback((a: boolean, m: boolean) => {
        const prev = current.current;
        const next = saveConsent(a && HAS_ANALYTICS, m && HAS_MARKETING);
        current.current = next;
        setOpen(false);
        setShowPrefs(false);
        const revoked = !!prev && ((prev.analytics && !next.analytics) || (prev.marketing && !next.marketing));
        applyConsent(next, loaded.current);
        if (!next.analytics) revokeClarity();
        if (!next.marketing) revokeTikTok();
        if (revoked) {
            // scripturile deja încărcate nu pot fi descărcate: ștergem cookie-urile și reîncărcăm pagina
            clearNonEssentialCookies();
            window.location.reload();
        }
    }, []);

    if (!open || pathname?.startsWith("/admin")) return null;

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-consent-title"
            className="fixed inset-x-0 bottom-0 z-[99999] p-3 sm:p-5"
        >
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-2xl sm:p-6">
                <h2 id="cookie-consent-title" className="text-base font-bold text-slate-900">
                    Folosim cookie-uri
                </h2>
                <p className="mt-2 text-sm leading-relaxed">
                    Cookie-urile strict necesare țin coșul, contul și plata funcționale. Cu acordul tău, folosim și cookie-uri de
                    statistică{HAS_MARKETING ? " și de marketing" : ""}, ca să înțelegem cum e folosit site-ul
                    {HAS_MARKETING ? " și să măsurăm reclamele" : ""}. Poți accepta, refuza sau alege pe categorii; îți poți schimba
                    oricând opțiunea din „Setări cookie-uri”, în subsolul paginii. Detalii în{" "}
                    <Link href="/politica-cookies" className="font-medium text-emerald-700 underline">
                        Politica de cookies
                    </Link>
                    .
                </p>

                {showPrefs && (
                    <fieldset className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <legend className="sr-only">Categorii de cookie-uri</legend>
                        <label className="flex items-start gap-3">
                            <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4" />
                            <span>
                                <strong className="text-slate-900">Strict necesare</strong> – întotdeauna active (coș, autentificare,
                                securitate, reținerea acestei alegeri).
                            </span>
                        </label>
                        {HAS_ANALYTICS && (
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={analytics}
                                    onChange={(e) => setAnalytics(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                                />
                                <span>
                                    <strong className="text-slate-900">Statistică</strong> – numărul de vizite, sursele de trafic și
                                    paginile vizitate, agregat.
                                </span>
                            </label>
                        )}
                        {HAS_MARKETING && (
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={marketing}
                                    onChange={(e) => setMarketing(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                                />
                                <span>
                                    <strong className="text-slate-900">Marketing / reclame</strong> – ne permite să măsurăm
                                    eficiența reclamelor (ex. TikTok) și să vă arătăm reclame relevante.
                                </span>
                            </label>
                        )}
                    </fieldset>
                )}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => decide(false, false)}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                    >
                        Refuz toate
                    </button>
                    {showPrefs ? (
                        <button
                            type="button"
                            onClick={() => decide(analytics, marketing)}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                        >
                            Salvează alegerea
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowPrefs(true)}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                        >
                            Personalizează
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => decide(true, true)}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                    >
                        Accept toate
                    </button>
                </div>
            </div>
        </div>
    );
}
