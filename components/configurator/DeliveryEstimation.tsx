"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Truck } from "lucide-react";

type Props = {
    county?: string;
};

export default function DeliveryEstimation({ county }: Props) {
    const [loading, setLoading] = useState(true);
    const [label, setLabel] = useState("");
    const debouncedCounty = useDebounce(county, 500);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`/api/eta?county=${debouncedCounty || ""}`, { signal })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok && data.label) {
                    setLabel(data.label);
                } else {
                    setLabel("3-4 zile lucrătoare");
                }
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setLabel("3-5 zile lucrătoare");
                }
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [debouncedCounty]);

    return (
        <div className="text-xs sm:text-sm flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5 shadow-sm h-full whitespace-nowrap">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
            <span className="text-slate-700 font-bold">Livrare:</span>
            {loading ? (
                <span className="animate-pulse bg-emerald-100 h-3 w-16 rounded inline-block align-middle"></span>
            ) : (
                <span className="font-extrabold text-emerald-700">{label}</span>
            )}
        </div>
    );
}
