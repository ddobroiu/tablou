import { Suspense } from "react";
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";

export const metadata = {
    title: "Kit Vizibilitate Fonduri Naționale",
    description: "Panouri și plăci permanente pentru proiecte cu finanțare națională (Start-Up Nation, Femeia Antreprenor, IMM Invest). Conforme cu regulamentele de vizibilitate.",
    alternates: { canonical: "/fonduri-nationale" },
};

export default function FonduriNationalePage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="fonduri-eu" productSlug="fonduri-nationale" />
            </Suspense>
        </div>
    );
}
