"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

declare global {
    interface Window {
        dataLayer?: any[];
    }
}

interface CookieConsentProps {
    gtagId?: string;
    gtmId?: string;
    tiktokId?: string;
}

export default function CookieConsent({ gtagId, gtmId, tiktokId }: CookieConsentProps) {
    const [consentStatus, setConsentStatus] = useState<"granted" | "denied" | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("cookie_consent");
        if (stored === "granted" || stored === "denied") {
            setConsentStatus(stored);
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "granted");
        setConsentStatus("granted");
        setIsVisible(false);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'cookie_consent_granted' });
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "denied");
        setConsentStatus("denied");
        setIsVisible(false);
    };

    return (
        <>
            {consentStatus === "granted" && (
                <>
                    {gtagId && (
                        <>
                            <Script
                                async
                                src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
                                strategy="afterInteractive"
                            />
                            <Script id="google-analytics" strategy="afterInteractive">
                                {`
                                  window.dataLayer = window.dataLayer || [];
                                  function gtag(){dataLayer.push(arguments);}
                                  gtag('js', new Date());
                                  gtag('config', '${gtagId}');
                                `}
                            </Script>
                        </>
                    )}
                    {gtmId && (
                        <Script id="gtm" strategy="afterInteractive">
                            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                              })(window,document,'script','dataLayer','${gtmId}');`}
                        </Script>
                    )}
                    {tiktokId && (
                        <Script id="tiktok" strategy="afterInteractive">
                            {`!function (w, d, t) {
                              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                              ttq.load('${tiktokId}');
                              ttq.page();
                            }(window, document, 'ttq');`}
                        </Script>
                    )}
                </>
            )}

            {isVisible && (
                <div className="fixed bottom-0 left-0 right-0 z-[99999] p-4 sm:p-6 md:max-w-md mx-auto pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl p-6 rounded-3xl pointer-events-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                    <Cookie size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg tracking-tight">Setări Cookies</h3>
                            </div>
                            <button onClick={handleDecline} className="text-slate-400 hover:text-slate-600 transition-colors p-1" aria-label="Închide">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Folosim cookie-uri pentru a-ți personaliza experiența, a analiza traficul (Analytics) și pentru performanța configuratoarelor noastre. Poți alege să accepți doar cookie-urile strict necesare. Mai multe informații în <Link href="/politica-cookies" className="text-emerald-600 hover:underline">Politica de Cookies</Link>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDecline}
                                className="flex-1 px-4 py-2.5 rounded-xl block border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                            >
                                Doar Strict Necesare
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-4 py-2.5 rounded-xl block bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-sm"
                            >
                                Acceptă Toate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
