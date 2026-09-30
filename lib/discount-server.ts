// Coduri de reducere, verificate pe server. FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT (baza e comună).
// Reducerea se aplică doar produselor (nu transportului); suma calculată aici e cea din Stripe, Oblio și comandă.
import { prisma } from "@/lib/prisma";

export type DiscountCheck =
    | { ok: true; code: string; type: "percentage" | "fixed"; value: number; amount: number }
    | { ok: false; error: string };

const round2 = (n: number) => Math.round(n * 100) / 100;

export async function checkDiscountCode(rawCode: unknown, productsSubtotal: number): Promise<DiscountCheck> {
    const code = String(rawCode || "").trim().toUpperCase();
    if (!/^[A-Z0-9-]{3,40}$/.test(code)) return { ok: false, error: "Codul de reducere nu e valid." };
    const dc = await prisma.discountCode.findUnique({ where: { code } });
    if (!dc || !dc.isActive) return { ok: false, error: "Codul de reducere nu există." };
    const now = new Date();
    if (now < dc.validFrom) return { ok: false, error: "Codul de reducere nu e încă activ." };
    if (now > dc.validUntil) return { ok: false, error: "Codul de reducere a expirat." };
    if (dc.maxUses && dc.currentUses >= dc.maxUses) return { ok: false, error: "Codul de reducere a fost deja folosit." };
    if (dc.minOrderValue && productsSubtotal < dc.minOrderValue) {
        return { ok: false, error: `Codul e valabil pentru comenzi de minimum ${dc.minOrderValue} lei.` };
    }
    let amount = 0;
    if (dc.type === "percentage") amount = (productsSubtotal * dc.value) / 100;
    else if (dc.type === "fixed") amount = dc.value;
    else return { ok: false, error: "Codul de reducere nu se poate folosi aici." };
    amount = round2(Math.min(Math.max(amount, 0), productsSubtotal));
    if (amount <= 0) return { ok: false, error: "Codul de reducere nu se aplică acestei comenzi." };
    return { ok: true, code, type: dc.type, value: dc.value, amount };
}

/** Marchează codul ca folosit (atomic: nu trece de maxUses). Întoarce false dacă nu mai era disponibil. */
export async function redeemDiscountCode(code: string): Promise<boolean> {
    const c = String(code || "").trim().toUpperCase();
    if (!c) return false;
    const n = await prisma.$executeRaw`
        update "DiscountCode" set "currentUses" = "currentUses" + 1, "updatedAt" = now()
        where code = ${c} and "isActive" = true and ("maxUses" is null or "currentUses" < "maxUses")`;
    return n > 0;
}
