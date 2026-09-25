import { NextRequest, NextResponse } from "next/server";
import { estimateParcel, fitsIn, getDpdPoints } from "@/lib/dpdPoints";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Punctele DPD in care incape comanda (cosul trimis de checkout). Raspuns compact, pentru harta.
export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? body.items.slice(0, 100) : [];
    try {
        const parcel = estimateParcel(items);
        const all = await getDpdPoints();
        const points = all
            .filter((p) => fitsIn(p, parcel))
            .map((p) => ({ id: p.id, t: p.type === "APT" ? "L" : "O", n: p.name, a: p.address, c: p.city, z: p.postCode, la: p.lat, lo: p.lng, cod: p.cod }));
        return NextResponse.json({ points, lockers: points.filter((p) => p.t === "L").length, total: all.length });
    } catch (e) {
        return NextResponse.json({ points: [], error: e instanceof Error ? e.message : "Eroare DPD" }, { status: 502 });
    }
}
