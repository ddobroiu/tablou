"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Comutator între /configurator/autocolante și /configurator/window-graphics (pagini separate). */
export default function StickerModeSwitchInline() {
    const pathname = usePathname() || "";
    const isAutocolante =
        pathname === "/configurator/autocolante" ||
        pathname.startsWith("/configurator/autocolante/");
    const isWindowGraphics =
        pathname === "/configurator/window-graphics" ||
        pathname.startsWith("/configurator/window-graphics/");

    const base =
        "px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center";
    const active = "bg-emerald-600 text-white shadow-md";
    const inactive =
        "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800";

    return (
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Link
                href="/configurator/autocolante"
                className={`${base} ${isAutocolante ? active : inactive}`}
            >
                Autocolante
            </Link>
            <Link
                href="/configurator/window-graphics"
                className={`${base} ${isWindowGraphics ? active : inactive}`}
            >
                Window Graphics
            </Link>
        </div>
    );
}
