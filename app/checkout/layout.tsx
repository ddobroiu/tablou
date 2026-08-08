import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Finalizare Comandă",
    description: "Completează datele de livrare și facturare pentru a finaliza comanda pe Tablou.net.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {children}
        </div>
    );
}

