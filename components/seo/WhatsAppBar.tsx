import React from "react";
import { siteConfig } from "@/lib/siteConfig";

export function whatsappHref(message: string): string {
    const digits = String(siteConfig.phone || "").replace(/\D/g, "");
    const number = digits.startsWith("0") ? `4${digits}` : digits;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Bară fixă jos, doar pe mobil: prețul și butonul de WhatsApp mereu la vedere.
 * Pe desktop butonul de WhatsApp e deja în prima secțiune a paginii.
 */
export function WhatsAppBar({ message, price, label }: { message: string; price?: string; label?: string }) {
    return (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center gap-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
            {price && (
                <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">{label ?? "de la"}</div>
                    <div className="text-lg font-black text-slate-900 leading-tight truncate">{price}</div>
                </div>
            )}
            <a
                href={whatsappHref(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98]"
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.1 12C2.1 6.5 6.5 2 12 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 9.9-9.9 9.9zm5.4-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/></svg>
                WhatsApp
            </a>
        </div>
    );
}

export function WhatsAppButton({ message, className = "", children }: { message: string; className?: string; children?: React.ReactNode }) {
    return (
        <a
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-all shadow-xl shadow-emerald-500/25 ${className}`}
        >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.1 12C2.1 6.5 6.5 2 12 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 9.9-9.9 9.9zm5.4-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/></svg>
            {children ?? "Scrie-ne pe WhatsApp"}
        </a>
    );
}
