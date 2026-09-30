// Emailuri automate: captarea coșului și dezabonarea. FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT
// (baza e comună; trimiterea se face doar din shopprint, lib/mail-auto).
import { prisma } from "@/lib/prisma";

export const normEmail = (e: unknown) => String(e || "").trim().toLowerCase();
export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;

/** Dezabonare după id-ul emailului trimis (link-ul din email). Întoarce adresa, dacă a găsit-o. */
export async function unsubscribeBySendId(sendId: string, reason = "link"): Promise<string | null> {
    if (!/^[a-z0-9]{16,40}$/i.test(sendId)) return null;
    const s = await prisma.mailSend.findUnique({ where: { id: sendId }, select: { email: true, site: true } });
    if (!s) return null;
    await optOut(s.email, s.site, reason);
    return s.email;
}

/** Nu mai trimitem nimic pe această adresă (pe niciun site). */
export async function optOut(email: string, site: string | null, reason: string) {
    const e = normEmail(email);
    if (!isValidEmail(e)) return;
    await prisma.mailOptOut.upsert({ where: { email: e }, create: { email: e, site, reason }, update: {} });
    await prisma.mailCart.updateMany({ where: { email: e, status: "open" }, data: { status: "stopped" } });
}

type CartLine = { name: string; quantity: number; total?: number };

/** Salvează / actualizează coșul început la checkout (pentru emailul de reamintire). */
export async function saveCheckoutCart(input: { email: unknown; name?: unknown; items: unknown; total?: unknown; site: string }) {
    const email = normEmail(input.email);
    if (!isValidEmail(email)) return { ok: false as const, reason: "email" };
    if (await prisma.mailOptOut.findUnique({ where: { email } })) return { ok: false as const, reason: "optout" };
    const items: CartLine[] = (Array.isArray(input.items) ? input.items : [])
        .slice(0, 20)
        .map((it: any) => ({
            name: String(it?.name || it?.title || "").slice(0, 120),
            quantity: Math.max(1, Math.min(100000, Number(it?.quantity) || 1)),
            total: Number.isFinite(Number(it?.total)) ? Math.max(0, Number(it.total)) : undefined,
        }))
        .filter((it) => it.name);
    if (!items.length) return { ok: false as const, reason: "gol" };
    const name = String(input.name || "").slice(0, 80) || null;
    const total = Number.isFinite(Number(input.total)) ? Number(input.total) : null;
    const existing = await prisma.mailCart.findUnique({ where: { email_site: { email, site: input.site } } });
    // coș nou (sau reluat după ce s-a terminat seria de emailuri) → seria pornește de la capăt
    const restart = !existing || existing.status !== "open";
    await prisma.mailCart.upsert({
        where: { email_site: { email, site: input.site } },
        create: { email, site: input.site, name, items, total },
        update: { name: name ?? existing?.name ?? null, items, total, ...(restart ? { status: "open", step: 0, lastSentAt: null } : {}) },
    });
    return { ok: true as const };
}
