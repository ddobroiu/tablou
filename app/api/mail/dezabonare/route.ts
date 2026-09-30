// Dezabonare dintr-un click (link-ul din email și antetul List-Unsubscribe). FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
import { NextResponse } from "next/server";
import { unsubscribeBySendId } from "@/lib/mail-optout";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const url = new URL(req.url);
    let id = url.searchParams.get("id") || "";
    if (!id) {
        const form = await req.formData().catch(() => null);
        id = String(form?.get("id") || "");
    }
    const email = await unsubscribeBySendId(id, "link").catch(() => null);
    // din formularul paginii → înapoi pe pagină; one-click (Gmail/Outlook) → doar 200
    const fromPage = (req.headers.get("content-type") || "").includes("form") && !url.searchParams.get("id");
    if (fromPage) return NextResponse.redirect(new URL(`/dezabonare?gata=${email ? 1 : 0}`, url.origin), 303);
    return NextResponse.json({ ok: !!email });
}
