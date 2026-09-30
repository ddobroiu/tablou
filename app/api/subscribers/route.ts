// Abonare la emailuri (fereastra „10% reducere la următoarea comandă”). FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
// Salvează doar abonatul (cu site-ul); emailul de bun venit cu codul personal îl trimite shopprint în câteva minute
// (lib/mail-auto, /api/cron/emails). Dacă adresa se dezabonase, o reactivăm (abonarea e un acord nou, explicit).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/siteConfig";
import { isValidEmail, normEmail } from "@/lib/mail-optout";

export const runtime = "nodejs";

const hits = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
    try {
        const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
        const now = Date.now();
        const h = hits.get(ip);
        if (h && now - h.t < 10 * 60_000 && h.n >= 10) {
            return NextResponse.json({ message: "Prea multe încercări. Încearcă mai târziu." }, { status: 429 });
        }
        hits.set(ip, h && now - h.t < 10 * 60_000 ? { n: h.n + 1, t: h.t } : { n: 1, t: now });

        const body = await req.json().catch(() => ({}));
        const email = normEmail(body?.email);
        if (!isValidEmail(email)) return NextResponse.json({ message: "Adresa de email nu pare corectă." }, { status: 400 });
        if (body?.consent !== true) return NextResponse.json({ message: "Bifează acordul pentru emailuri." }, { status: 400 });

        const site = String(siteConfig.url || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
        const existing = await prisma.subscriber.findUnique({ where: { email_source: { email, source: site } } });
        if (!existing) await prisma.subscriber.create({ data: { email, source: site } });
        await prisma.mailOptOut.deleteMany({ where: { email } });

        return NextResponse.json({
            ok: true,
            message: existing
                ? "Ești deja abonat. Verifică emailul pentru codul tău."
                : "Gata! În câteva minute primești pe email codul de reducere.",
        });
    } catch (error) {
        console.error("[subscribers]", error);
        return NextResponse.json({ message: "A apărut o eroare. Încearcă din nou." }, { status: 500 });
    }
}
