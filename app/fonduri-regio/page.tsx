import { Suspense } from "react";
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";

export const metadata = {
    title: "Kit Vizibilitate REGIO / POR - Panouri",
    description: "Kit vizibilitate pentru proiecte REGIO (POR). Panouri temporare si placi permanente conforme cu manualul de identitate vizuala.",
    alternates: { canonical: "/fonduri-regio" },
};

export default function FonduriRegioPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="fonduri-eu" productSlug="fonduri-regio" />
            </Suspense>
        </div>
    );
}
