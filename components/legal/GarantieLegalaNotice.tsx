import React from "react";

/**
 * Notificarea armonizată UE privind garanția legală de conformitate
 * (art. 22a din Directiva 2011/83/UE, introdus prin Directiva (UE) 2024/825; model stabilit prin
 * Regulamentul de punere în aplicare (UE) 2025/1960; OUG nr. 34/2014 și OUG nr. 140/2021 modificate prin OUG nr. 18/2026).
 *
 * Fișierele din public/garantie-legala/ sunt fișierele OFICIALE ale Comisiei (versiunea color, RGB, în limba română),
 * nemodificate. Nu le decupați, nu le recolorați, nu suprapuneți text și nu le treceți prin optimizatorul de imagini
 * (next/image ar converti formatul): se afișează întotdeauna integral, cu <img>, scalate doar proporțional.
 */
export const GARANTIE_PAGE_HREF = "/garantie-legala";
export const GARANTIE_NOTICE_SVG = "/garantie-legala/notificare-garantie-legala-ro.svg";
export const GARANTIE_NOTICE_PNG = "/garantie-legala/notificare-garantie-legala-ro.png";
/** Aceeași destinație ca a codului QR de pe notificare. */
export const GARANTIE_EUROPA_URL = "https://europa.eu/youreurope/garan%C8%9Bii";
export const GARANTIE_EUROPA_LABEL = "europa.eu/youreurope/garanții";
/** Dimensiunile PNG-ului oficial (raport A4, identic cu viewBox-ul SVG-ului). */
export const GARANTIE_NOTICE_WIDTH = 1654;
export const GARANTIE_NOTICE_HEIGHT = 2339;

export const GARANTIE_NOTICE_ALT =
    "Notificarea oficială a Uniunii Europene „Garanția legală”: protecția oferită de garanția legală minimă de doi ani pentru bunurile vândute în Uniunea Europeană, drepturile consumatorilor dacă bunurile sunt neconforme și cod QR către europa.eu/youreurope/garanții";

/** Notificarea completă: SVG oficial, cu PNG-ul oficial ca rezervă. */
export default function GarantieLegalaNotice({
    className = "",
    lazy = false,
}: {
    className?: string;
    lazy?: boolean;
}) {
    return (
        <picture>
            <source srcSet={GARANTIE_NOTICE_SVG} type="image/svg+xml" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={GARANTIE_NOTICE_PNG}
                alt={GARANTIE_NOTICE_ALT}
                width={GARANTIE_NOTICE_WIDTH}
                height={GARANTIE_NOTICE_HEIGHT}
                loading={lazy ? "lazy" : "eager"}
                decoding="async"
                className={`block h-auto w-full max-w-full ${className}`}
            />
        </picture>
    );
}

/** Miniatura notificării ÎNTREGI (nu doar a unei părți), scalată proporțional; PNG-ul e de ~7 ori mai mic decât SVG-ul. */
export function GarantieLegalaThumb({ className = "h-14" }: { className?: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={GARANTIE_NOTICE_PNG}
            alt=""
            aria-hidden="true"
            width={GARANTIE_NOTICE_WIDTH}
            height={GARANTIE_NOTICE_HEIGHT}
            loading="lazy"
            decoding="async"
            className={`w-auto shrink-0 rounded-sm bg-white shadow-sm ring-1 ring-black/10 ${className}`}
        />
    );
}
