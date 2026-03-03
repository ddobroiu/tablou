"use client";
import { useState } from "react";
import { MessageCircle, Mail, X, FileText } from "lucide-react";
import Link from "next/link";

export default function ContactButton() {
  const phoneNumber = "40750473111";
  const message = encodeURIComponent("Bună ziua, vă scriu de pe site-ul Tablou.ro");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
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
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-green-400">
          Suntem Online
        </span>
      </a>
    </div>
  );
}
