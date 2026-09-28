"use client";

import { useEffect } from "react";
import { readConsent } from "@/lib/cookieConsent";

type TrackingWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
};

type ConversionTrackerProps = {
    orderNo: string | number | null;
    value?: number | null;
    currency?: string;
};

/**
 * Evenimentul `purchase` pe pagina de comandă finalizată: GA4 (TRACKING.ga4Ids) și, dacă există,
 * Google Ads / GTM / Meta Pixel. Se trimite doar cu acordul de cookie-uri (statistică sau marketing)
 * și o singură dată per comandă. Fără date personale: doar numărul comenzii, valoarea și moneda.
 */
export default function ConversionTracker({ orderNo, value, currency = "RON" }: ConversionTrackerProps) {
    useEffect(() => {
        if (!orderNo) return;

        // Rulăm după efectul din CookieConsent (layout), care încarcă gtag.js și face `config`
        // pentru ID-urile acceptate; altfel evenimentul ar ajunge în dataLayer înaintea config-ului.
        const timer = window.setTimeout(() => {
            const consent = readConsent();
            if (!consent || (!consent.analytics && !consent.marketing)) return;

            const key = `conv_purchase_${orderNo}`;
            try {
                if (localStorage.getItem(key)) return;
                localStorage.setItem(key, "1");
            } catch {
                const w = window as unknown as Record<string, unknown>;
                if (w[key]) return;
                w[key] = true;
            }

            const w = window as TrackingWindow;
            const params: Record<string, unknown> = { transaction_id: String(orderNo), currency };
            if (typeof value === "number" && value > 0) params.value = Number(value.toFixed(2));

            // pentru GTM (se încarcă doar după acord), dacă are un trigger pe `purchase`
            w.dataLayer = w.dataLayer || [];
            w.dataLayer.push({ event: "purchase", ...params });

            // GA4 + Google Ads, cu transaction_id pentru deduplicare
            if (typeof w.gtag === "function") w.gtag("event", "purchase", params);

            // Meta Pixel: `fbq` există doar dacă s-a acceptat marketingul (vezi components/CookieConsent.tsx).
            // eventID = numărul comenzii, ca să se deduplice dacă adăugăm și CAPI pe server.
            if (consent.marketing && typeof w.fbq === "function") {
                w.fbq(
                    "track",
                    "Purchase",
                    { value: typeof params.value === "number" ? params.value : 0, currency, content_type: "product" },
                    { eventID: `order-${orderNo}` }
                );
            }
        }, 0);

        return () => window.clearTimeout(timer);
    }, [orderNo, value, currency]);

    return null;
}
