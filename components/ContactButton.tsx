"use client";
import Link from "next/link";
import { MessageCircle, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ContactButton() {
    const pathname = usePathname();
    const whatsappUrl = `https://wa.me/40750473111?text=${encodeURIComponent("Bună ziua, vă scriu de pe site-ul Tablou.net")}`;

    if (pathname?.includes("/editor")) {
        return null;
    }

    // Pe configuratoare există bara sticky „Adaugă” — butoanele rămân deasupra ei, dar mai jos decât înainte (bottom-32).
    const hasMobileStickyBar =
        pathname != null &&
        /\/(banner|canvas|autocolante|rollup|tapet|hanorace|tricouri|pliante|flyere|afise|materiale|window-graphics|signage|checkout|banner-product)/.test(
            pathname
        );

    const positionClass = hasMobileStickyBar
        ? "bottom-20 max-sm:pb-safe sm:bottom-6"
        : "bottom-6 max-sm:pb-safe sm:bottom-6";

    return (
        <div className={`fixed ${positionClass} right-4 sm:right-6 z-[60] flex flex-col gap-4`}>
            {/* Quote Request Button */}
            <Link
                href="/contact"
                className="flex items-center justify-center w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-300 group relative"
                aria-label="Cere Ofertă Personalizată"
                title="Cere Ofertă Personalizată"
            >
                <FileText size={28} />
                <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
                    Cere Ofertă
                </span>
            </Link>

            {/* WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 group relative"
                aria-label="Contactează-ne pe WhatsApp"
                title="Contactează-ne pe WhatsApp"
            >
                <span className="absolute inset-0 rounded-full bg-green-400/30 animate-ping"></span>
                <MessageCircle size={32} className="relative z-10" />
                <span className="absolute right-full mr-4 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-green-400">
                    Suntem Online
                </span>
            </a>
        </div>
    );
}
