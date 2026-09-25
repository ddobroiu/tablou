"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Loader2, MapPin, Package, Search, Store } from "lucide-react";

// Alegerea unui locker sau punct DPD pe harta (OpenStreetMap). Apar doar punctele in care
// incape comanda: lista vine de la /api/dpd/points, calculata pe cosul curent.

export type DpdPointChoice = { id: number; type: "L" | "O"; name: string; address: string; city: string; postCode: string; cod: boolean };

type P = { id: number; t: "L" | "O"; n: string; a: string; c: string; z: string; la: number; lo: number; cod: boolean };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const dist = (a: [number, number], b: [number, number]) => {
    const r = Math.PI / 180;
    const x = (b[1] - a[1]) * r * Math.cos(((a[0] + b[0]) / 2) * r);
    const y = (b[0] - a[0]) * r;
    return Math.sqrt(x * x + y * y) * 6371;
};

export default function DpdPointPicker({ items, value, onChange }: { items: any[]; value: DpdPointChoice | null; onChange: (p: DpdPointChoice | null) => void }) {
    const [points, setPoints] = useState<P[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [onlyLockers, setOnlyLockers] = useState(false);
    const [center, setCenter] = useState<[number, number]>([45.94, 24.97]);
    const [locating, setLocating] = useState(false);
    const mapEl = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const layerRef = useRef<any>(null);
    const Lref = useRef<any>(null);

    // Punctele in care incape cosul (se recalculeaza cand se schimba cosul)
    const cartKey = JSON.stringify((items || []).map((i) => [i.slug || i.productId || i.name, i.quantity, i.width, i.height]));
    useEffect(() => {
        let alive = true;
        setPoints(null);
        setError(null);
        fetch("/api/dpd/points", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) })
            .then((r) => r.json())
            .then((d) => { if (alive) { setPoints(d.points || []); if (d.error) setError(d.error); } })
            .catch(() => alive && setError("Nu am putut încărca punctele DPD."));
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartKey]);

    const visible = useMemo(() => (points || []).filter((p) => !onlyLockers || p.t === "L"), [points, onlyLockers]);

    // Cautare dupa oras / nume / cod postal: muta harta pe primul rezultat
    useEffect(() => {
        const q = norm(query.trim());
        if (q.length < 3 || !visible.length) return;
        const hit = visible.find((p) => norm(p.c).startsWith(q)) || visible.find((p) => norm(`${p.n} ${p.a} ${p.z}`).includes(q));
        if (hit) setCenter([hit.la, hit.lo]);
    }, [query, visible]);

    const nearest = useMemo(
        () => [...visible].map((p) => ({ p, d: dist(center, [p.la, p.lo]) })).sort((a, b) => a.d - b.d).slice(0, 8),
        [visible, center],
    );

    const choose = (p: P) => {
        onChange({ id: p.id, type: p.t, name: p.n, address: p.a, city: p.c, postCode: p.z, cod: p.cod });
        setCenter([p.la, p.lo]);
    };

    // Harta Leaflet (incarcata doar in browser)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!mapEl.current || mapRef.current) return;
            const L = (await import("leaflet")).default;
            if (cancelled || !mapEl.current) return;
            Lref.current = L;
            const map = L.map(mapEl.current, { preferCanvas: true, zoomControl: true }).setView(center, 7);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            map.on("moveend", () => {
                const c = map.getCenter();
                setCenter([c.lat, c.lng]);
            });
            mapRef.current = map;
            layerRef.current = L.layerGroup().addTo(map);
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);

    // Punctele pe harta
    useEffect(() => {
        const L = Lref.current, layer = layerRef.current;
        if (!L || !layer) return;
        layer.clearLayers();
        for (const p of visible) {
            const selected = value?.id === p.id;
            L.circleMarker([p.la, p.lo], {
                radius: selected ? 9 : 6,
                color: "#fff",
                weight: 1.5,
                fillColor: selected ? "#dc2626" : p.t === "L" ? "#059669" : "#2563eb",
                fillOpacity: 0.95,
            })
                .bindTooltip(`${p.t === "L" ? "Locker" : "Punct"} DPD · ${p.n}`)
                .on("click", () => choose(p))
                .addTo(layer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, value?.id, points]);

    // Muta harta cand se schimba centrul din cautare / locatie / alegere
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        const c = map.getCenter();
        if (Math.abs(c.lat - center[0]) > 1e-4 || Math.abs(c.lng - center[1]) > 1e-4) map.setView(center, Math.max(map.getZoom(), 13));
    }, [center]);

    const locate = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => { setCenter([pos.coords.latitude, pos.coords.longitude]); setLocating(false); },
            () => setLocating(false),
            { timeout: 8000 },
        );
    };

    const lockers = (points || []).filter((p) => p.t === "L").length;

    return (
        <div className="space-y-3">
            {points && lockers === 0 && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Comanda e prea mare pentru lockere: poți ridica doar de la punctele DPD de mai jos sau alege livrarea la adresă.
                </p>
            )}
            <div className="flex flex-wrap gap-2">
                <div className="relative min-w-48 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Caută orașul sau adresa"
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm" />
                </div>
                <button type="button" onClick={locate} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2.5 text-sm hover:bg-slate-50">
                    {locating ? <Loader2 size={15} className="animate-spin" /> : <Crosshair size={15} />} Lângă mine
                </button>
                {lockers > 0 && (
                    <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                        <input type="checkbox" checked={onlyLockers} onChange={(e) => setOnlyLockers(e.target.checked)} /> Doar lockere
                    </label>
                )}
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200">
                <div ref={mapEl} className="h-72 w-full sm:h-80" />
                {!points && !error && (
                    <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 text-sm text-slate-600">
                        <Loader2 size={18} className="mr-2 animate-spin" /> Se încarcă punctele DPD…
                    </div>
                )}
                <div className="pointer-events-none absolute bottom-2 left-2 z-[500] flex gap-2 rounded-lg bg-white/90 px-2 py-1 text-[11px] text-slate-600 shadow">
                    <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-emerald-600" /> Locker</span>
                    <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-blue-600" /> Punct DPD</span>
                </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            {value && (
                <div className="flex items-start gap-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 p-3">
                    {value.type === "L" ? <Package className="mt-0.5 shrink-0 text-emerald-700" size={20} /> : <Store className="mt-0.5 shrink-0 text-emerald-700" size={20} />}
                    <div className="min-w-0 text-sm">
                        <p className="font-semibold text-slate-900">{value.type === "L" ? "Locker" : "Punct"} DPD: {value.name}</p>
                        <p className="text-slate-600">{value.address}</p>
                    </div>
                </div>
            )}

            <ul className="max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
                {nearest.map(({ p, d }) => (
                    <li key={p.id}>
                        <button type="button" onClick={() => choose(p)}
                            className={`flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 ${value?.id === p.id ? "bg-emerald-50" : ""}`}>
                            <MapPin size={16} className={`mt-0.5 shrink-0 ${p.t === "L" ? "text-emerald-600" : "text-blue-600"}`} />
                            <span className="min-w-0 flex-1">
                                <span className="block font-medium text-slate-900">{p.t === "L" ? "Locker" : "Punct"} · {p.n}</span>
                                <span className="block truncate text-xs text-slate-500">{p.a}</span>
                            </span>
                            <span className="shrink-0 text-xs text-slate-500">{d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
