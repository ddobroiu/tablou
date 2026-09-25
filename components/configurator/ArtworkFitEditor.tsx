"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Crosshair, Maximize2, Minimize2, Move } from "lucide-react";

// Editor de incadrare: clientul vede grafica exact la proportia comandata (ex. 300×140 cm),
// o muta cu mouse-ul/degetul, face zoom si vede tivul, capsele, zona sigura si daca rezolutia
// ajunge pentru dimensiunea aleasa. Incadrarea aleasa se salveaza in comanda (vezi fitMetadata).

export type ArtworkFit = {
    // cover = umple suprafata (se taie ce iese), contain = intreaga grafica (margini albe)
    mode: "cover" | "contain";
    // 1 = marimea de baza a modului; >1 = marit
    zoom: number;
    // centrul graficii fata de centrul suprafetei, ca fractiune din latime / inaltime
    x: number;
    y: number;
};

export const DEFAULT_FIT: ArtworkFit = { mode: "cover", zoom: 1, x: 0, y: 0 };

type Props = {
    widthCm: number;
    heightCm: number;
    imageUrl: string;
    fit: ArtworkFit;
    onChange?: (fit: ArtworkFit) => void;
    // tiv si capse pe margine (banner), la ~50 cm
    grommets?: boolean;
    // distanta de la margine in care nu se pune text important (tivul se indoaie aici)
    safeMarginCm?: number;
    // cat de departe e privit produsul, fata de diagonala lui (banner ~1.5; autocolant/plexi de aproape ~0.7)
    viewingFactor?: number;
    readOnly?: boolean;
    // se apeleaza cand se cunosc pixelii imaginii (pentru metadate)
    onImageSize?: (size: { w: number; h: number } | null) => void;
    // Macheta produsului (ex. tricoul in culoarea aleasa): zona de print se deseneaza pe ea.
    // area: centrul zonei (x) si marginea de sus (y) ca fractiuni din poza, latimea (w) ca fractiune din latimea pozei.
    mockup?: { src: string; area: { x: number; y: number; w: number }; label?: string };
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Cat de mare iese grafica tiparita si ce rezolutie are, pentru o incadrare data
// Rezolutia de care e nevoie: produsul e privit de la ~viewingFactor × diagonala, iar ochiul
// distinge cam 3438 / distanta (in inch) puncte pe inch. Ex. banner 200×100 cm: privit de la ~3,4 m, ajung ~26 dpi.
export function neededDpi(widthCm: number, heightCm: number, viewingFactor = 1.5) {
    const distanceCm = Math.max(30, viewingFactor * Math.hypot(widthCm, heightCm));
    return { dpi: clamp(3438 / (distanceCm / 2.54), 12, 300), distanceM: distanceCm / 100 };
}

export function fitGeometry(widthCm: number, heightCm: number, img: { w: number; h: number }, fit: ArtworkFit) {
    const base = fit.mode === "cover" ? Math.max(widthCm / img.w, heightCm / img.h) : Math.min(widthCm / img.w, heightCm / img.h);
    const cmPerPx = base * fit.zoom;
    const printW = img.w * cmPerPx;
    const printH = img.h * cmPerPx;
    const dpi = 2.54 / cmPerPx;
    return { printW, printH, dpi };
}

// Limitele deplasarii: in modul „umple” grafica nu are voie sa lase margini goale
function clampFit(fit: ArtworkFit, widthCm: number, heightCm: number, img: { w: number; h: number } | null): ArtworkFit {
    if (!img) return fit;
    const { printW, printH } = fitGeometry(widthCm, heightCm, img, fit);
    const maxX = Math.abs(printW - widthCm) / 2 / widthCm;
    const maxY = Math.abs(printH - heightCm) / 2 / heightCm;
    return { ...fit, x: clamp(fit.x, -maxX, maxX), y: clamp(fit.y, -maxY, maxY) };
}

export default function ArtworkFitEditor({
    widthCm,
    heightCm,
    imageUrl,
    fit,
    onChange,
    grommets = false,
    safeMarginCm = 0,
    viewingFactor = 1.5,
    readOnly = false,
    onImageSize,
    mockup,
}: Props) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ w: 0, h: 0 });
    const [img, setImg] = useState<{ w: number; h: number } | null>(null);
    const [failed, setFailed] = useState(false);
    const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
    const [mockupPx, setMockupPx] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        setMockupPx(null);
        if (!mockup?.src) return;
        const el = new window.Image();
        el.onload = () => setMockupPx({ w: el.naturalWidth, h: el.naturalHeight });
        el.src = mockup.src;
    }, [mockup?.src]);

    // Pixelii imaginii (PDF/AI nu se pot previzualiza in browser)
    useEffect(() => {
        setImg(null);
        setFailed(false);
        const el = new window.Image();
        el.onload = () => {
            const size = { w: el.naturalWidth, h: el.naturalHeight };
            setImg(size);
            onImageSize?.(size);
        };
        el.onerror = () => {
            setFailed(true);
            onImageSize?.(null);
        };
        el.src = imageUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl]);

    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Suprafata tiparita, incadrata in spatiul disponibil
    // Macheta (daca exista): cat ocupa poza produsului in spatiul disponibil
    const mock = useMemo(() => {
        if (!mockup || !mockupPx || !box.w) return null;
        const maxH = Math.max(box.h, 220);
        const k = Math.min(box.w / mockupPx.w, maxH / mockupPx.h);
        const w = mockupPx.w * k;
        const h = mockupPx.h * k;
        return { w, h, left: (box.w - w) / 2, top: (maxH - h) / 2 };
    }, [mockup, mockupPx, box]);

    const frame = useMemo(() => {
        if (!box.w || !widthCm || !heightCm) return null;
        if (mockup) {
            if (!mock) return null;
            // zona de print pe produs: latimea data de macheta, inaltimea dupa proportia in cm
            const w = mockup.area.w * mock.w;
            const scale = w / widthCm;
            return {
                w, h: heightCm * scale, pxPerCm: scale,
                left: mock.left + mockup.area.x * mock.w - w / 2,
                top: mock.top + mockup.area.y * mock.h,
            };
        }
        const maxH = Math.max(box.h, 220);
        const scale = Math.min((box.w - 48) / widthCm, (maxH - 48) / heightCm);
        return { w: widthCm * scale, h: heightCm * scale, pxPerCm: scale, left: null as number | null, top: null as number | null };
    }, [box, widthCm, heightCm, mockup, mock]);

    const set = useCallback(
        (next: ArtworkFit) => onChange?.(clampFit(next, widthCm, heightCm, img)),
        [onChange, widthCm, heightCm, img],
    );

    // Daca se schimba dimensiunea, pastram incadrarea in limite
    useEffect(() => {
        if (!img || readOnly) return;
        const c = clampFit(fit, widthCm, heightCm, img);
        if (c.x !== fit.x || c.y !== fit.y) onChange?.(c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widthCm, heightCm, img]);

    const geo = img && widthCm && heightCm ? fitGeometry(widthCm, heightCm, img, fit) : null;
    const need = neededDpi(widthCm, heightCm, viewingFactor);
    // bun: cat ochiul distinge de la distanta obisnuita; acceptabil: de la jumatate in sus (usor moale de aproape)
    const quality = !geo ? null : geo.dpi >= need.dpi ? "good" : geo.dpi >= need.dpi * 0.5 ? "ok" : "low";
    const dist = need.distanceM >= 1 ? `${need.distanceM.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} m` : `${Math.round(need.distanceM * 100)} cm`;

    const onPointerDown = (e: React.PointerEvent) => {
        if (readOnly || !frame) return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { px: e.clientX, py: e.clientY, x: fit.x, y: fit.y };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current || !frame) return;
        const d = drag.current;
        set({ ...fit, x: d.x + (e.clientX - d.px) / frame.w, y: d.y + (e.clientY - d.py) / frame.h });
    };
    const onPointerUp = () => {
        drag.current = null;
    };

    // Capsele: in colturi si cam la fiecare 50 cm pe fiecare latura
    const eyelets = useMemo(() => {
        if (!grommets || !frame) return [];
        const inset = 2.5 * frame.pxPerCm;
        const pts: { x: number; y: number }[] = [];
        const along = (len: number) => {
            const n = Math.max(1, Math.round(len / 50));
            return Array.from({ length: n + 1 }, (_, i) => i / n);
        };
        for (const t of along(widthCm)) {
            const x = inset + t * (frame.w - 2 * inset);
            pts.push({ x, y: inset }, { x, y: frame.h - inset });
        }
        for (const t of along(heightCm).slice(1, -1)) {
            const y = inset + t * (frame.h - 2 * inset);
            pts.push({ x: inset, y }, { x: frame.w - inset, y });
        }
        return pts;
    }, [grommets, frame, widthCm, heightCm]);

    if (failed) {
        return (
            <div className="flex h-full min-h-60 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                <CheckCircle2 className="text-emerald-600" />
                <p className="font-medium text-slate-900">Fișier încărcat</p>
                <p>Fișierele PDF, AI sau PSD nu se pot previzualiza aici. Verificăm noi încadrarea înainte de tipar.</p>
            </div>
        );
    }

    const imgStyle = frame && geo
        ? {
            width: geo.printW * frame.pxPerCm,
            height: geo.printH * frame.pxPerCm,
            left: frame.w / 2 + fit.x * frame.w - (geo.printW * frame.pxPerCm) / 2,
            top: frame.h / 2 + fit.y * frame.h - (geo.printH * frame.pxPerCm) / 2,
        }
        : null;

    return (
        <div className="flex h-full w-full flex-col gap-3">
            <div ref={boxRef} className={`relative flex min-h-60 flex-1 items-center justify-center overflow-hidden rounded-xl ${mockup ? "bg-white" : "bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-[length:16px_16px]"}`}>
                {mockup && mock && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mockup.src} alt="" draggable={false} className="pointer-events-none absolute select-none" style={{ left: mock.left, top: mock.top, width: mock.w, height: mock.h }} />
                )}
                {frame && (
                    <div className={frame.left === null ? "relative" : "absolute"} style={{ width: frame.w, height: frame.h, ...(frame.left !== null && { left: frame.left, top: frame.top ?? 0 }) }}>
                        {/* suprafata tiparita */}
                        <div
                            className={`absolute inset-0 overflow-hidden ${mockup ? "outline-dashed outline-1 outline-offset-0 outline-emerald-500/80" : "bg-white shadow-lg ring-1 ring-slate-300"} ${readOnly ? "" : "cursor-grab active:cursor-grabbing"} touch-none select-none`}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                        >
                            {imgStyle && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imageUrl} alt="Grafica ta" draggable={false} className="pointer-events-none absolute max-w-none" style={imgStyle} />
                            )}
                            {/* zona sigura */}
                            {safeMarginCm > 0 && (
                                <div
                                    className="pointer-events-none absolute border border-dashed border-sky-500/80"
                                    style={{ inset: safeMarginCm * frame.pxPerCm }}
                                    title="Zona sigură: textul important în interior"
                                />
                            )}
                            {eyelets.map((p, i) => (
                                <span
                                    key={i}
                                    className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-500 bg-white/90"
                                    style={{ left: p.x, top: p.y }}
                                />
                            ))}
                        </div>
                        {/* cotele */}
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-slate-500">{mockup?.label ? `${mockup.label}: ` : ""}{widthCm} cm</span>
                        <span className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-[11px] font-medium text-slate-500">{heightCm} cm</span>
                    </div>
                )}
                {!readOnly && img && (
                    <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] text-slate-600 shadow-sm">
                        <Move size={12} /> Trage imaginea ca s-o poziționezi
                    </span>
                )}
            </div>

            {!readOnly && img && (
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                        <button type="button" onClick={() => set({ ...fit, mode: "cover", zoom: 1, x: 0, y: 0 })}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${fit.mode === "cover" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                            title="Grafica umple toată suprafața; ce iese în afară se taie">
                            <Maximize2 size={13} /> Umple
                        </button>
                        <button type="button" onClick={() => set({ ...fit, mode: "contain", zoom: 1, x: 0, y: 0 })}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${fit.mode === "contain" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                            title="Toată grafica se vede; rămân margini albe">
                            <Minimize2 size={13} /> Încadrează
                        </button>
                    </div>
                    <button type="button" onClick={() => set({ ...fit, x: 0, y: 0 })}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                        <Crosshair size={13} /> Centrează
                    </button>
                    <label className="flex flex-1 items-center gap-2 text-xs text-slate-500">
                        Zoom
                        <input type="range" min={1} max={3} step={0.01} value={fit.zoom}
                            onChange={(e) => set({ ...fit, zoom: Number(e.target.value) })}
                            className="min-w-24 flex-1 accent-emerald-600" />
                        <span className="w-10 text-right tabular-nums">{Math.round(fit.zoom * 100)}%</span>
                    </label>
                </div>
            )}

            {geo && quality && (
                <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${quality === "good" ? "bg-emerald-50 text-emerald-800" : quality === "ok" ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-800"}`}>
                    {quality === "good" ? <CheckCircle2 size={15} className="mt-px shrink-0" /> : <AlertTriangle size={15} className="mt-px shrink-0" />}
                    <span>
                        {quality === "good" && <>Calitate bună: la {widthCm}×{heightCm} cm, privit de la ~{dist}, imaginea arată clar ({Math.round(geo.dpi)} dpi).</>}
                        {quality === "ok" && <>Calitate acceptabilă ({Math.round(geo.dpi)} dpi): de la ~{dist} arată bine, doar foarte de aproape se vede puțin mai moale.</>}
                        {quality === "low" && <>Imaginea e prea mică pentru {widthCm}×{heightCm} cm ({Math.round(geo.dpi)} dpi) și se va vedea pixelată chiar și de la ~{dist}. Încarcă o imagine mai mare sau alege grafica făcută de noi.</>}
                        {safeMarginCm > 0 && <span className="block opacity-80">Linia punctată albastră e zona sigură: ține textul important în interiorul ei.</span>}
                    </span>
                </div>
            )}
        </div>
    );
}

// Ce se salveaza in comanda: descrierea pentru atelier (in cm) + datele exacte pentru admin
export function fitMetadata(widthCm: number, heightCm: number, img: { w: number; h: number } | null, fit: ArtworkFit) {
    if (!img || !widthCm || !heightCm) return {};
    const g = fitGeometry(widthCm, heightCm, img, fit);
    const dx = Math.round(fit.x * widthCm);
    const dy = Math.round(fit.y * heightCm);
    const pos = dx === 0 && dy === 0 ? "centrată" : `mutată ${dx > 0 ? `${dx} cm la dreapta` : dx < 0 ? `${-dx} cm la stânga` : ""}${dx && dy ? ", " : ""}${dy > 0 ? `${dy} cm în jos` : dy < 0 ? `${-dy} cm în sus` : ""}`;
    return {
        "Încadrare": `${fit.mode === "cover" ? "umple suprafața" : "încadrată cu margini albe"}, grafica ${Math.round(g.printW)}×${Math.round(g.printH)} cm, ${pos}`,
        "Rezoluție": `${Math.round(g.dpi)} dpi (${img.w}×${img.h} px)`,
        artworkFit: JSON.stringify({ ...fit, imgW: img.w, imgH: img.h }),
    };
}
