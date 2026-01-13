"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function BlogShareButton() {
    const toast = useToast();

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiat în clipboard!");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="ml-auto w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            title="Partajează articolul"
        >
            <Share2 size={18} />
        </button>
    );
}
