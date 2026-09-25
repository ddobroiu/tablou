// Starea coletelor DPD (POST /v1/track), pentru pagina Livrari din admin.
// Codurile DPD sunt traduse intr-o stare simpla; ce nu cunoastem se clasifica dupa descriere.

export type Delivery =
    | "inregistrat"   // AWB emis, curierul inca nu l-a preluat
    | "nepreluat"     // curierul a venit / trebuia sa vina si nu l-a preluat
    | "tranzit"       // preluat, in depozite, pe drum
    | "in_livrare"    // la curier, se livreaza azi
    | "livrat"
    | "problema"      // destinatar absent, adresa gresita, amanat...
    | "retur"         // refuzat / returnat la expeditor
    | "necunoscut";

export type TrackResult = {
    awb: string;
    state: Delivery;
    text: string;            // descrierea ultimei operatii, de la DPD
    at: string | null;       // data ultimei operatii
    firstAt: string | null;  // prima operatie (cand a fost emis)
    deliveredAt: string | null;
};

const BY_CODE: Record<string, Delivery> = {
    "148": "inregistrat",
    "164": "nepreluat",
    "39": "tranzit",
    "11": "tranzit",
    "2": "tranzit",
    "1": "tranzit",
    "12": "in_livrare",
    "-14": "livrat",
};

function classify(code: string, text: string): Delivery {
    const t = text.toLowerCase();
    if (/refuz|return/.test(t)) return "retur";
    if (BY_CODE[code]) return BY_CODE[code];
    if (/livrat/.test(t) && !/nu a putut|nelivrat/.test(t)) return "livrat";
    if (/nu a putut fi preluat/.test(t)) return "nepreluat";
    if (/nu a putut|absent|amânat|amanat|adres|incomplet|reprogram|nu raspunde|nu răspunde/.test(t)) return "problema";
    if (/livrare/.test(t)) return "in_livrare";
    if (/tranzit|depozit|preluat/.test(t)) return "tranzit";
    if (/înregistrat|inregistrat/.test(t)) return "inregistrat";
    return "necunoscut";
}

const cache = new Map<string, { at: number; r: TrackResult }>();
const TTL = 10 * 60_000;

export async function trackAwbs(awbs: string[]): Promise<Map<string, TrackResult>> {
    const out = new Map<string, TrackResult>();
    const todo: string[] = [];
    for (const a of new Set(awbs.filter(Boolean))) {
        const hit = cache.get(a);
        if (hit && Date.now() - hit.at < TTL) out.set(a, hit.r);
        else todo.push(a);
    }
    const user = process.env.DPD_USERNAME;
    const pass = process.env.DPD_PASSWORD;
    if (!user || !pass) return out;

    // DPD primeste cate 10 colete pe cerere
    for (let i = 0; i < todo.length; i += 10) {
        const batch = todo.slice(i, i + 10);
        try {
            const res = await fetch("https://api.dpd.ro/v1/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: user, password: pass, language: "RO", parcels: batch.map((id) => ({ id })) }),
                cache: "no-store",
            });
            const body = await res.json();
            // Raspunsul vine in ordinea cererii; tinem AWB-ul cerut (la coletele cu mai multe piese id-ul poate diferi)
            for (const [idx, p] of (body?.parcels ?? []).entries()) {
                const ops: any[] = p.operations ?? [];
                const last = ops[ops.length - 1];
                const awb = batch[idx] ?? String(p.parcelId ?? "");
                const delivered = [...ops].reverse().find((o) => String(o.operationCode) === "-14");
                const r: TrackResult = {
                    awb,
                    state: last ? classify(String(last.operationCode), String(last.description ?? "")) : "necunoscut",
                    text: last?.description ?? (p.error?.message || "Fără informații de la DPD"),
                    at: last?.dateTime ?? null,
                    firstAt: ops[0]?.dateTime ?? null,
                    deliveredAt: delivered?.dateTime ?? null,
                };
                cache.set(awb, { at: Date.now(), r });
                out.set(awb, r);
            }
        } catch (e) {
            console.error("[dpd track]", e instanceof Error ? e.message : e);
        }
    }
    return out;
}
