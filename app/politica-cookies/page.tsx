import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import CookieSettingsLink from "@/components/legal/CookieSettingsLink";
import { COMPANY, CONTACT_EMAIL, HAS_AI_CHAT, TRACKING } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";
import { CLARITY_ID } from "@/lib/clarity";

export const metadata: Metadata = {
    title: "Politica de cookies",
    description: `Ce cookie-uri și tehnologii similare folosește ${siteConfig.domain.toLowerCase()}, în ce scop, cât timp și cum vă puteți da sau retrage consimțământul.`,
    alternates: { canonical: "/politica-cookies" },
};

const site = siteConfig.domain.toLowerCase();

type Row = { name: string; provider: string; purpose: string; duration: string };

const necessary: Row[] = [
    { name: "next-auth.session-token, __Secure-next-auth.session-token", provider: site, purpose: "Menține autentificarea în contul de client.", duration: "Până la deconectare, cel mult 30 de zile" },
    { name: "next-auth.csrf-token, next-auth.callback-url (și variantele __Host-/__Secure-)", provider: site, purpose: "Protecție împotriva cererilor falsificate și redirecționarea după autentificare.", duration: "Sesiune" },
    { name: "cookie_consent_v4 (stocare locală)", provider: site, purpose: "Reține alegerile dumneavoastră privind cookie-urile.", duration: "12 luni" },
    { name: "cart, checkout_address, checkout_billing (stocare locală)", provider: site, purpose: "Păstrează coșul și datele introduse în formularul de comandă pe acest dispozitiv.", duration: "Până la golirea coșului sau ștergerea datelor din browser" },
    { name: "session-id, newsletter-popup-dismissed (stocare de sesiune); newsletter-subscribed (stocare locală)", provider: site, purpose: "Funcționarea configuratorului și a ferestrei de abonare (să nu o afișăm din nou).", duration: "Sesiune / până la ștergerea datelor din browser" },
    ...(HAS_AI_CHAT
        ? [{ name: "shopprint_ai_chat_conversation_id (stocare locală)", provider: site, purpose: "Păstrează conversația cu asistentul de chat, dacă îl folosiți.", duration: "Până la ștergerea datelor din browser" }]
        : []),
    { name: "Cookie-uri Stripe (pe pagina de plată Stripe)", provider: "Stripe", purpose: "Procesarea securizată a plății cu cardul și prevenirea fraudei; se setează numai pe pagina Stripe, când plătiți cu cardul.", duration: "Conform politicii Stripe" },
];

const analytics: Row[] = [
    ...(TRACKING.siteAnalyticsSrc
        ? [{ name: "_pt_vid (cookie), _pt_vid, _pt_sid, _pt_last (stocare locală)", provider: `${site} (script de statistică operat de noi, găzduit pe shopprint.ro)`, purpose: "Numără vizitele și sursele de trafic (de exemplu dintr-o reclamă sau alt site) și asociază comanda cu sursa vizitei.", duration: "_pt_vid: 12 luni; celelalte: până la ștergerea datelor din browser" }]
        : []),
    ...(TRACKING.ga4Ids.length > 0
        ? [{ name: "_ga, _ga_<ID>", provider: "Google Ireland Limited (Google Analytics 4)", purpose: "Statistici agregate despre folosirea site-ului.", duration: "până la 2 ani" }]
        : []),
    ...(CLARITY_ID
        ? [{ name: "_clck, _clsk", provider: "Microsoft Corporation (Microsoft Clarity)", purpose: "Statistici de utilizare, hărți de interacțiune (heatmaps) și înregistrări ale sesiunii (session replay), cu conținutul introdus mascat; nu se încarcă pe paginile de cont, autentificare, coș și plată. Datele pot fi prelucrate în SUA, în baza EU-U.S. Data Privacy Framework.", duration: "_clck: 1 an; _clsk: 1 zi" }]
        : []),
];

const marketing: Row[] = [
    ...(TRACKING.googleAdsIds.length > 0 || TRACKING.gtmId
        ? [{ name: "_gcl_au, _gcl_aw și cookie-uri Google pe domeniile Google", provider: "Google Ireland Limited (Google Ads / Google Tag Manager)", purpose: "Măsurarea conversiilor din reclamele Google și remarketing.", duration: "până la 90 de zile (_gcl_*), conform politicii Google pentru celelalte" }]
        : []),
    ...(TRACKING.metaPixelId
        ? [{ name: "_fbp, fr", provider: "Meta Platforms Ireland Limited (Meta Pixel)", purpose: "Măsurarea conversiilor din reclamele Facebook/Instagram și publicuri de remarketing.", duration: "până la 90 de zile" }]
        : []),
    ...(TRACKING.tiktokPixelId
        ? [
              { name: "_ttp", provider: "TikTok Technology Limited, Irlanda (TikTok Pixel)", purpose: "Măsurarea eficienței reclamelor TikTok (conversii, de exemplu o comandă finalizată) și retargeting (publicuri pentru reclame relevante). Nu se încarcă pe paginile de cont, autentificare, coș și plată (cu excepția paginii de confirmare a comenzii). Datele pot fi transferate în afara UE, de exemplu în baza clauzelor contractuale standard.", duration: "aproximativ 13 luni" },
              { name: "_tt_enable_cookie", provider: "TikTok Technology Limited, Irlanda (TikTok Pixel)", purpose: "Reține că pixelul TikTok poate folosi cookie-uri pe acest site, după consimțământul pentru marketing.", duration: "aproximativ 13 luni" },
              { name: "tt_ttclid", provider: "Tablou.net (cookie propriu, pentru TikTok)", purpose: "Reține identificatorul clicului pe o reclamă TikTok (parametrul ttclid din adresă), numai cu consimțământul pentru marketing. La o comandă plătită cu cardul, împreună cu _ttp, este trimis de serverul nostru către TikTok (TikTok Events API), ca să măsurăm conversia; vezi Politica de confidențialitate.", duration: "30 de zile" },
          ]
        : []),
];

function CookieTable({ rows }: { rows: Row[] }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Cookie / element de stocare</th>
                    <th>Furnizor</th>
                    <th>Scop</th>
                    <th>Durată</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r) => (
                    <tr key={r.name}>
                        <td>{r.name}</td>
                        <td>{r.provider}</td>
                        <td>{r.purpose}</td>
                        <td>{r.duration}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const sections: LegalSection[] = [
    {
        id: "ce-sunt",
        title: "Ce sunt cookie-urile",
        body: (
            <p>
                Cookie-urile sunt fișiere text de mici dimensiuni pe care un site le salvează în browserul dumneavoastră. Tehnologii
                similare sunt stocarea locală (localStorage), stocarea de sesiune (sessionStorage) și scripturile de măsurare
                („pixeli”). În această politică le numim pe toate „cookie-uri”. Site-ul {site} este operat de {COMPANY.legalName} (datele
                complete sunt în subsolul paginii).
            </p>
        ),
    },
    {
        id: "consimtamant",
        title: "Consimțământul și modul de gestionare",
        body: (
            <>
                <p>
                    Cookie-urile strict necesare funcționării site-ului se folosesc fără consimțământ, conform art. 4 alin. (5) din
                    Legea nr. 506/2004. <strong>Cookie-urile de statistică și de marketing se activează numai după ce vă dați
                    consimțământul</strong> în bannerul afișat la prima vizită; până atunci scripturile respective nu se încarcă, iar
                    semnalele Google Consent Mode sunt setate implicit pe „refuzat”. Puteți accepta toate categoriile, le puteți refuza
                    pe toate (cu un singur clic, la fel de ușor) sau puteți alege pe categorii.
                </p>
                <p>
                    Vă puteți modifica sau retrage oricând consimțământul din linkul „Setări cookie-uri” din subsolul oricărei pagini
                    sau de aici: <CookieSettingsLink />. Retragerea nu afectează legalitatea prelucrării anterioare. Puteți șterge
                    cookie-urile deja salvate și din setările browserului; blocarea cookie-urilor strict necesare poate împiedica
                    funcționarea coșului, a contului sau a plății.
                </p>
                <p>Alegerea dumneavoastră este păstrată 12 luni, după care vă întrebăm din nou.</p>
            </>
        ),
    },
    {
        id: "necesare",
        title: "Cookie-uri strict necesare (întotdeauna active)",
        body: <CookieTable rows={necessary} />,
    },
    {
        id: "statistica",
        title: "Cookie-uri de statistică (numai cu consimțământ)",
        body: analytics.length > 0 ? <CookieTable rows={analytics} /> : <p>Momentan nu folosim cookie-uri de statistică.</p>,
    },
    {
        id: "marketing",
        title: "Cookie-uri de marketing (numai cu consimțământ)",
        body: marketing.length > 0 ? <CookieTable rows={marketing} /> : <p>Momentan nu folosim cookie-uri de marketing pe acest site.</p>,
    },
    {
        id: "terti",
        title: "Conținut de la terți",
        body: (
            <p>
                Anumite funcții încarcă resurse de la terți, care pot primi adresa IP a dispozitivului: harta lockerelor și punctelor DPD
                (OpenStreetMap), fonturile din unele configuratoare (Google Fonts), imaginile servite prin Cloudinary. Butonul de WhatsApp
                deschide aplicația WhatsApp (Meta), iar autentificarea cu Google are loc pe pagina Google, numai dacă o alegeți.
            </p>
        ),
    },
    {
        id: "date",
        title: "Datele personale",
        body: (
            <p>
                Informații despre prelucrarea datelor personale, destinatari, transferuri și drepturile dumneavoastră găsiți în{" "}
                <Link href="/confidentialitate">Politica de confidențialitate</Link>. Pentru întrebări ne puteți scrie la{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
        ),
    },
];

export default function PoliticaCookiesPage() {
    return (
        <LegalDocument
            title="Politica de cookies"
            currentHref="/politica-cookies"
            intro={<p>Ce cookie-uri folosim, de ce, cât timp le păstrăm și cum vă puteți schimba oricând opțiunile.</p>}
            sections={sections}
        />
    );
}
