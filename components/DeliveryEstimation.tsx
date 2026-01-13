"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Truck } from "lucide-react";

type Props = {
  county?: string;
};

export default function DeliveryEstimation({ county }: Props) {
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [debouncedCounty] = useDebounce(county, 500);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Apelăm API-ul de estimare (presupunând că există ruta /api/eta)
    fetch(`/api/eta?county=${debouncedCounty || ""}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.label) {
          setLabel(data.label);
        } else {
          // Fallback dacă nu primim un răspuns clar
          setLabel("2-3 zile lucrătoare");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // În caz de eroare, afișăm un termen standard
          setLabel("2-4 zile lucrătoare");
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedCounty]);

  return (
    <div className="text-xs sm:text-sm flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg px-2 py-1.5 shadow-sm h-full whitespace-nowrap">
      <Truck className="w-4 h-4 text-green-700 dark:text-green-400 shrink-0" strokeWidth={2.5} />
      <span className="text-slate-900 dark:text-gray-200 font-semibold">Livrare:</span>
      {loading ? (
        <span className="animate-pulse bg-slate-300 dark:bg-slate-600 h-3 w-16 rounded inline-block align-middle"></span>
      ) : (
        <span className="font-bold text-slate-900 dark:text-white">{label}</span>
      )}
    </div>
  );
}
