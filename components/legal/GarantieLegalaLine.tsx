import React from "react";
import Link from "next/link";
import { GARANTIE_PAGE_HREF, GarantieLegalaThumb } from "@/components/legal/GarantieLegalaNotice";

/**
 * Mențiunea scurtă despre garanția legală, pentru pagina de produs (lângă preț / „Adaugă în coș”)
 * și pentru checkout (înainte de butonul de plasare a comenzii). Duce la /garantie-legala,
 * unde se afișează notificarea oficială UE integral.
 */
export default function GarantieLegalaLine({
    variant = "product",
    className = "",
}: {
    /** product: compact, aliniat la dreapta sub estimarea livrării; checkout: casetă pe toată lățimea, cu miniatură. */
    variant?: "product" | "checkout";
    className?: string;
}) {
    if (variant === "checkout") {
        return (
            <p
                className={`flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100 ${className}`}
            >
                <GarantieLegalaThumb className="h-12" />
                <span>
                    Beneficiați de <strong>garanția legală de conformitate de minimum 2 ani</strong> pentru produsele comandate,
                    inclusiv pentru cele personalizate.{" "}
                    <Link href={GARANTIE_PAGE_HREF} target="_blank" className="font-semibold underline underline-offset-2">
                        Drepturile dumneavoastră de garanție legală
                    </Link>
                </span>
            </p>
        );
    }

    return (
        <p className={`max-w-[15rem] whitespace-normal text-right text-[11px] leading-snug text-slate-600 dark:text-slate-300 ${className}`}>
            Beneficiați de garanția legală de conformitate de minimum 2 ani.{" "}
            <Link
                href={GARANTIE_PAGE_HREF}
                target="_blank"
                className="font-semibold text-blue-800 underline underline-offset-2 dark:text-blue-300"
            >
                Detalii
            </Link>
        </p>
    );
}
