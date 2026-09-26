"use client";

export default function PrintButton({ label = "Tipărește formularul" }: { label?: string }) {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 print:hidden"
        >
            {label}
        </button>
    );
}
