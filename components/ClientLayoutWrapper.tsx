"use client";


import dynamic from "next/dynamic";
import React from "react";
import { usePathname } from "next/navigation";


export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <main className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">{children}</main>
        </>
    );
}
