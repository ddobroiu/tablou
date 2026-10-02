// Ruta veche de abonare (o folosea fereastra „SmartNewsletterPopup”, scoasă pe 30.09.2026, cu sursa „smart-popup”).
// Niciun formular de pe site nu o mai apelează; abonarea se face prin /api/subscribers (cu acord explicit).
// Din 02.10.2026: NU mai trimite email și NU mai creează coduri de reducere (abonații nu primesc coduri);
// sursa e întotdeauna domeniul site-ului (nu ce trimite browserul); adresele dezabonate (MailOptOut) nu sunt adăugate.
// FIȘIER IDENTIC PE CELE 5 SITE-URI CARE AU RUTA (adbanner, euprint, homeprint, prynt, tablou).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/siteConfig";
import { isValidEmail, normEmail, siteDomain } from "@/lib/mail-optout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const email = normEmail(body?.email);
        if (!isValidEmail(email)) return NextResponse.json({ message: "Email invalid." }, { status: 400 });

        const site = siteDomain(siteConfig.url);
        if (!(await prisma.mailOptOut.findUnique({ where: { email }, select: { email: true } }))) {
            const existing = await prisma.subscriber.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: { id: true } });
            if (!existing) await prisma.subscriber.create({ data: { email, source: site } });
        }
        return NextResponse.json({ success: true, message: "Abonare reușită." });
    } catch (error) {
        console.error("[Newsletter Subscribe]", error);
        return NextResponse.json({ message: "Eroare internă. Încearcă din nou." }, { status: 500 });
    }
}
