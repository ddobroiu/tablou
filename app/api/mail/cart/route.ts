// Coșul început la checkout (emailul de reamintire). FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";
import { saveCheckoutCart } from "@/lib/mail-optout";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
        const site = String(siteConfig.url || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
        const r = await saveCheckoutCart({ email: body.email, name: body.name, items: body.items, total: body.total, site });
        return NextResponse.json({ ok: r.ok });
    } catch (e) {
        console.warn("[mail/cart]", e);
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}
