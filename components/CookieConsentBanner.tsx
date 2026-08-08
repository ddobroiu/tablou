"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

interface CookieConsent {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    timestamp: string;
}

const COOKIE_KEY = 'cookie_consent_v2';
const DEFAULT_CONSENT: CookieConsent = {
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    timestamp: new Date().toISOString()
};

export default function CookieConsentBanner() {
    const pathname = usePathname();
    const [visible, setVisible] = useState<boolean>(() => {
        try {
            if (typeof window === 'undefined') return false;
            // Don't show on admin ever
            if (window.location.pathname.startsWith('/admin')) return false;
            const consent = localStorage.getItem(COOKIE_KEY);
            return !consent;
        } catch {
            return false;
        }
    });

    if (pathname?.startsWith('/admin')) return null;

    const [showDetails, setShowDetails] = useState(false);
    const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);

    const handleConsentAll = () => {
        const fullConsent: CookieConsent = {
            essential: true,
            functional: true,
            analytics: true,
            timestamp: new Date().toISOString()
        };
        saveConsent(fullConsent);
    };

    const handleRejectAll = () => {
        const minimalConsent: CookieConsent = {
            essential: true,
            functional: false,
            analytics: false,
            timestamp: new Date().toISOString()
        };
        saveConsent(minimalConsent);
    };

    const handleCustomConsent = () => {
        const customConsent: CookieConsent = {
            ...consent,
            essential: true, // Always true
            timestamp: new Date().toISOString()
        };
        saveConsent(customConsent);
    };

    const saveConsent = (consentData: CookieConsent) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(COOKIE_KEY, JSON.stringify(consentData));
            // Set individual cookies for third-party services
            document.cookie = `cookies_essential=true; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
            document.cookie = `cookies_functional=${consentData.functional}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
            document.cookie = `cookies_analytics=${consentData.analytics}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white shadow-2xl z-50 border-t border-slate-700">
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-green-400">🍪 Preferințe Cookies & Confidențialitate</h3>
                        <p className="text-sm text-gray-300 mb-3">
                            Respectăm confidențialitatea ta. Folosim cookies esențiale pentru funcționarea site-ului și, cu consimțământul tău, cookies pentru îmbunătățirea experienței (personalizare și analiză).
                            <a href="/politica-cookies" className="underline text-green-300 hover:text-green-200 ml-1" target="_blank" rel="noopener noreferrer">
                                Citește politica completă →
                            </a>
                        </p>

                        {showDetails && (
                            <div className="bg-slate-800 p-3 rounded-lg mb-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Esențiale (obligatorii) - securitate, coș, login
                                    </span>
                                    <span className="text-green-400 text-xs font-semibold">ACTIV</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.functional}
                                            onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Funcționale - WhatsApp, preferințe vizuale
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.analytics}
                                            onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Analytics - îmbunătățire servicii (Google Analytics)
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
                        {!showDetails ? (
                            <>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition shadow-lg"
                                    onClick={handleConsentAll}
                                >
                                    ✓ Accept toate
                                </button>
                                <button
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                                    onClick={handleRejectAll}
                                >
                                    Doar esențiale
                                </button>
                                <button
                                    className="text-green-100 hover:text-white px-4 py-2 underline text-sm transition"
                                    onClick={() => setShowDetails(true)}
                                >
                                    Personalizează
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                                    onClick={handleCustomConsent}
                                >
                                    Salvează preferințele
                                </button>
                                <button
                                    className="text-gray-300 hover:text-white px-4 py-2 text-sm transition"
                                    onClick={() => setShowDetails(false)}
                                >
                                    ← Înapoi
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-slate-700">
                    <strong>Conformitate:</strong> GDPR Art. 7, ePrivacy Directive, Legea 506/2004 (RO) |
                    <strong> Contact:</strong> <a href="mailto:contact@Tablou.net" className="text-green-300 hover:text-green-200 underline">contact@Tablou.net</a>
                </div>
            </div>
        </div>
    );
}



