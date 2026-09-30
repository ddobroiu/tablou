// Verificarea codului de reducere în checkout (doar afișare; la comandă se verifică din nou pe server).
// FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
import { NextResponse } from "next/server";
import { checkDiscountCode } from "@/lib/discount-server";

export const runtime = "nodejs";

const hits = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
    const now = Date.now();
    const h = hits.get(ip);
    if (h && now - h.t < 10 * 60_000 && h.n >= 20) {
        return NextResponse.json({ isValid: false, error: "Prea multe încercări. Încearcă peste câteva minute." }, { status: 429 });
    }
    hits.set(ip, h && now - h.t < 10 * 60_000 ? { n: h.n + 1, t: h.t } : { n: 1, t: now });

    const body = await req.json().catch(() => ({}));
    const subtotal = Math.max(0, Number(body?.subtotal) || 0);
    const r = await checkDiscountCode(body?.code, subtotal);
    if (!r.ok) return NextResponse.json({ isValid: false, error: r.error });
    return NextResponse.json({ isValid: true, discount: { code: r.code, type: r.type, value: r.value, amount: r.amount } });
}
