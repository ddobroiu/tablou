// Consimțământul pentru cookie-uri: cheia din localStorage, formatul și citirea lui.
// Folosit de bannerul components/CookieConsent.tsx și de scriptul Consent Mode din app/layout.tsx.

/** Versiunea consimțământului: la schimbarea categoriilor (v4: marketing / TikTok) îi întrebăm din nou pe toți. */
export const CONSENT_VERSION = 4;
export const CONSENT_STORAGE_KEY = "cookie_consent_v4";
/** Alegerea se păstrează 12 luni, apoi întrebăm din nou. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";
/** CustomEvent pe window după aplicarea alegerii; detail: { analytics, marketing }. */
export const CONSENT_CHANGE_EVENT = "cookie-consent-change";

export type ConsentChoice = { analytics: boolean; marketing: boolean; ts: number; v: typeof CONSENT_VERSION };

export function readConsent(): ConsentChoice | null {
    try {
        const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return null;
        const c = JSON.parse(raw);
        if (!c || c.v !== CONSENT_VERSION || typeof c.ts !== "number" || Date.now() - c.ts > CONSENT_MAX_AGE_MS) return null;
        return { analytics: !!c.analytics, marketing: !!c.marketing, ts: c.ts, v: CONSENT_VERSION };
    } catch {
        return null;
    }
}

export function saveConsent(analytics: boolean, marketing: boolean): ConsentChoice {
    const c: ConsentChoice = { analytics, marketing, ts: Date.now(), v: CONSENT_VERSION };
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(c));
        // vechile chei (banner anterior) nu mai sunt folosite
        localStorage.removeItem("cookie_consent");
        localStorage.removeItem("cookie_consent_v2");
        localStorage.removeItem("cookie_consent_v3");
    } catch { }
    return c;
}

/**
 * Consent Mode v2: implicit totul refuzat (în afară de stocarea strict necesară), apoi
 * aplicăm alegerea salvată. Rulează în <head>, înaintea oricărui script Google.
 */
export const CONSENT_MODE_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
try {
  var c = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
  if (c && c.v === ${CONSENT_VERSION} && Date.now() - c.ts <= ${CONSENT_MAX_AGE_MS}) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
  }
} catch (e) {}
`;
