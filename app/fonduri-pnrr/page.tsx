import { Suspense } from "react";
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";

export const metadata = {
    title: "Kit Vizibilitate PNRR - Panouri și Plăci",
    description: "Comandă online kitul complet de vizibilitate pentru proiecte PNRR. Materiale obligatorii conform manualului de identitate vizuală. Panouri, plăci rigide,...",
    alternates: { canonical: "/fonduri-pnrr" },
};

export default function FonduriPnrrPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="fonduri-eu" productSlug="fonduri-pnrr" />
            </Suspense>
        </div>
    );
}
