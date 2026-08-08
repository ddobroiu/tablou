"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ToastProvider";
import { CartProvider } from "./CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ToastProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </ToastProvider>
        </SessionProvider>
    );
}
