"use client";

import React from "react";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookieConsent";

/** Redeschide panoul de setări cookie-uri (retragerea sau modificarea consimțământului). */
export default function CookieSettingsLink({
    className,
    label = "Setări cookie-uri",
}: {
    className?: string;
    label?: string;
}) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
            className={className ?? "font-medium text-emerald-700 underline underline-offset-2"}
        >
            {label}
        </button>
    );
}
