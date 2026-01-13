import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();
    const em = String(email || "").trim().toLowerCase();
    // FIX: Regex mai robust pentru email validation
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(em)) {
      return NextResponse.json({ ok: false, message: "Email invalid" }, { status: 400 });
    }

    // Reuse existing subscriber if exists
    const existing = await prisma.subscriber
      .findUnique({ where: { email: em } })
      .catch((e: any) => {
        const isDbInitError = (e as any)?.name === "PrismaClientInitializationError";
        if ((e as any)?.code === "P1001" || isDbInitError) {
          return NextResponse.json(
            { ok: false, message: "Baza de date este indisponibilă. Te rugăm încearcă mai târziu." },
            { status: 503 }
          );
        }
        return null;
      });

    if (existing instanceof NextResponse) return existing;
    if (existing) {
      return NextResponse.json({ ok: true, message: "Ești deja abonat(ă)." });
    }

    let sub;
    try {
      sub = await prisma.subscriber.create({
        data: {
          email: em,
          source: source || null
        }
      });
    } catch (e) {
      const isDbInitError = (e as any)?.name === "PrismaClientInitializationError";
      if ((e as any)?.code === "P1001" || isDbInitError) {
        return NextResponse.json(
          { ok: false, message: "Baza de date este indisponibilă. Te rugăm încearcă mai târziu." },
          { status: 503 }
        );
      }
      throw e;
    }

    // Subscriber created successfully
    return NextResponse.json({ ok: true, message: "Abonare reușită!" });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Eroare server" }, { status: 500 });
  }
}
