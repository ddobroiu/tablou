import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConfigForSource, getPremiumHtmlTemplate, sendEmail, escapeHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const phone = String(body.phone || "").trim();
        const orderRef = String(body.orderRef || "").trim();
        const products = String(body.products || "").trim();
        const message = String(body.message || "").trim();

        if (!name || !email || !orderRef || !products) {
            return NextResponse.json({ error: "Completează numele, comanda, produsele vizate și emailul." }, { status: 400 });
        }

        const source = String(body.source || "tablou.net").toLowerCase();
        const config = getConfigForSource(source);

        const record = await prisma.withdrawalRequest.create({
            data: { name, email, phone, orderRef, products, message, source },
        });

        const submittedAt = record.createdAt.toLocaleString("ro-RO", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "Europe/Bucharest",
        });

        const detailsHtml = `
            <table style="width:100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding:6px 0; color:#64748b; width:160px;">Nume</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding:6px 0; color:#64748b;">Comandă / contract</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(orderRef)}</td></tr>
                <tr><td style="padding:6px 0; color:#64748b;">Produse vizate</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(products)}</td></tr>
                <tr><td style="padding:6px 0; color:#64748b;">Email</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(email)}</td></tr>
                ${phone ? `<tr><td style="padding:6px 0; color:#64748b;">Telefon</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(phone)}</td></tr>` : ""}
                ${message ? `<tr><td style="padding:6px 0; color:#64748b;">Mesaj</td><td style="padding:6px 0; font-weight:600;">${escapeHtml(message)}</td></tr>` : ""}
                <tr><td style="padding:6px 0; color:#64748b;">Data și ora transmiterii</td><td style="padding:6px 0; font-weight:600;">${submittedAt}</td></tr>
            </table>
        `;

        const customerHtml = getPremiumHtmlTemplate({
            title: "Cererea ta de retragere a fost înregistrată",
            subtitle: "Îți confirmăm primirea, conform legii, pe acest email (suport durabil).",
            content: `
                <p style="font-size:14px; color:#334155; line-height:1.6;">
                    Am înregistrat cererea ta de retragere din contractul la distanță. Mai jos ai conținutul exact al cererii trimise:
                </p>
                ${detailsHtml}
                <p style="font-size:13px; color:#64748b; line-height:1.6; margin-top:20px;">
                    Cererea va fi analizată conform politicii noastre de retur. Te rugăm să reții că produsele realizate după specificațiile tale (grafică/design personalizat) sunt exceptate de la dreptul de retragere conform Art. 16 lit. c din OUG 34/2014 — dar echipa noastră va verifica fiecare caz și îți va răspunde separat, pe acest email.
                </p>
            `,
            brandConfig: config,
        });

        const adminHtml = getPremiumHtmlTemplate({
            title: "Cerere nouă de retragere din contract",
            subtitle: `De la ${name}`,
            content: detailsHtml,
            brandConfig: config,
        });

        await sendEmail({
            from: `${config.name} <${process.env.EMAIL_FROM || config.email}>`,
            to: email,
            subject: `Confirmare cerere de retragere - ${config.name}`,
            html: customerHtml,
        });

        await sendEmail({
            from: `${config.name} <${process.env.EMAIL_FROM || config.email}>`,
            to: process.env.ADMIN_EMAIL || config.email,
            subject: `[Retragere contract] Cerere nouă - ${orderRef}`,
            html: adminHtml,
            replyTo: email,
        });

        return NextResponse.json({ success: true, id: record.id, submittedAt });
    } catch (error: any) {
        console.error("[api/retur] Error:", error);
        return NextResponse.json({ error: "Eroare internă. Te rugăm să încerci din nou sau să ne scrii direct." }, { status: 500 });
    }
}
