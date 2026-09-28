import React from "react";
import Link from "next/link";
import { GARANTIE_PAGE_HREF, GarantieLegalaThumb } from "@/components/legal/GarantieLegalaNotice";

/**
 * Reamintirea generală din subsol (prezentă pe toate paginile): miniatura notificării oficiale UE
 * + link către /garantie-legala, unde notificarea este afișată integral. Moștenește culorile subsolului.
 */
export default function GarantieLegalaBadge({ className = "" }: { className?: string }) {
    return (
        <Link
            href={GARANTIE_PAGE_HREF}
            className={`group inline-flex shrink-0 items-center gap-3 rounded-lg border border-current/20 px-3 py-2 text-left transition-opacity hover:opacity-80 ${className}`}
        >
            <GarantieLegalaThumb className="h-14" />
            <span className="max-w-[13rem] text-xs leading-snug">
                <strong className="block font-semibold group-hover:underline">Garanția legală de conformitate</strong>
                <span>– drepturile dumneavoastră (minimum 2 ani)</span>
            </span>
        </Link>
    );
}
