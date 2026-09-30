import { faraCredite } from "@/lib/alerts";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CHAT_MODEL, chatOptions } from "@/lib/ai-model";
import { trackOpenAI } from "@/lib/aiUsage";
import { randomUUID } from "crypto";
import { executeTool } from "@/lib/ai-tool-runner";
import { siteConfig } from "@/lib/siteConfig";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { calculateBusinessCardPrice, CANVAS_CONSTANTS } from "@/lib/pricing";
import { logConversation } from "@/lib/chat-logger";

// Asistentul AI de pe site (portat din shopprint, adaptat la brandul și configuratoarele acestui site).
// Prețurile vin DOAR din lib/pricing (prin executeTool / calculateBusinessCardPrice); uneltele expuse aici
// sunt doar de calcul — chat-ul de pe site NU creează comenzi.

export const runtime = "nodejs";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

const SITE_DOMAIN = String(siteConfig.domain || "").replace(/^www\./, "");
const BRAND = siteConfig.name;

function getOpenAiClient() {
  // Lazy init so `next build` (and Docker builds) don't crash
  // when OPENAI_API_KEY isn't present at build-time.
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── Limitare abuz (în memorie, per IP): endpoint public care consumă credit OpenAI ───
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 40;
const MAX_MESSAGES = 12;
const MAX_CONTENT_CHARS = 2000;
const rateHits = new Map<string, number[]>();

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim();
}

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateHits.set(ip, hits);
  if (rateHits.size > 5000) {
    for (const [k, v] of rateHits) {
      if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) rateHits.delete(k);
    }
  }
  return hits.length > RATE_MAX;
}

function waPhoneE164(roPhone: string) {
  const digits = roPhone.replace(/[^\d]/g, "");
  if (digits.startsWith("40")) return digits;
  if (digits.startsWith("0")) return `40${digits.slice(1)}`;
  return digits;
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_BASE_URL ||
    siteConfig.url
  ).replace(/\/+$/, "");
}

function buildWhatsAppUrl(message: string) {
  const phone = waPhoneE164(siteConfig.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** URL-ul configuratorului din registry-ul ACESTUI site (null dacă site-ul nu îl are). */
function cfgUrl(id: string): string | null {
  return CONFIGURATORS_REGISTRY.find((c) => c.id === id)?.url ?? null;
}

function extractBannerIntent(messages: ChatMsg[]) {
  // IMPORTANT: only consider user messages; assistant greeting may contain "banner/autocolant/canvas"
  // and would otherwise bias routing incorrectly.
  const all = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n")
    .toLowerCase();
  return all.includes("banner");
}

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function findConfiguratorMatches(query: string, limit = 5) {
  const q = normalize(query);
  if (!q) return [];

  const scored = CONFIGURATORS_REGISTRY.map((c) => {
    const hay = normalize(
      [c.name, c.slug, c.category, ...(c.keywords || []), ...(c.useCases || [])].join(" | ")
    );
    let score = 0;
    if (hay.includes(q)) score += 6;
    const tokens = q.split(/[\s,.;/|]+/).filter(Boolean);
    for (const t of tokens) {
      if (t.length < 3) continue;
      if (hay.includes(t)) score += 2;
    }
    if (q.includes(normalize(c.slug))) score += 3;
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.c);
}

function isListAllIntent(text: string) {
  const t = normalize(text);
  return (
    t.includes("toate configuratoarele") ||
    t.includes("toate configurator") ||
    t.includes("ce configuratoare") ||
    t.includes("ce aveti") ||
    t.includes("ce oferi") ||
    t.includes("ce produse") ||
    t.includes("vreau sa stie de toate")
  );
}

function isOrderIntent(text: string) {
  const t = normalize(text);
  return (
    t.includes("plasa comanda") ||
    t.includes("plasez comanda") ||
    t.includes("cum comand") ||
    t.includes("cum pot comanda") ||
    t.includes("unde comand") ||
    t.includes("unde pot plasa") ||
    t.includes("unde pot comanda") ||
    t.includes("vreau sa comand")
  );
}

function extractCanvasIntent(messages: ChatMsg[]) {
  const all = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n")
    .toLowerCase();
  return all.includes("canvas") || all.includes("canva");
}

function extractPlexiglassIntent(messages: ChatMsg[]) {
  const all = normalize(messages.map((m) => m.content).join("\n"));
  return all.includes("plexiglass") || all.includes("plexiglas") || all.includes("metacrilat");
}

function extractForexIntent(messages: ChatMsg[]) {
  const all = normalize(messages.map((m) => m.content).join("\n"));
  // NOTE: do NOT match generic "pvc" because it causes false positives.
  return all.includes("forex") || all.includes("pvc forex") || all.includes("pvc-forex");
}

function extractPlexiSubtype(messages: ChatMsg[]): "transparent" | "alb" {
  const all = normalize(messages.map((m) => m.content).join("\n"));
  if (all.includes("transparent")) return "transparent";
  return "alb";
}

function parseThicknessMm(text: string): number | null {
  const t = normalize(text);
  const m = t.match(/(\d{1,2})\s*mm/);
  if (!m) return null;
  const v = Number(m[1]);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function extractWantsFrame(messages: ChatMsg[]) {
  const all = messages.map((m) => m.content).join("\n").toLowerCase();
  return (
    all.includes("cu rama") ||
    all.includes("cu șasiu") ||
    all.includes("rama") ||
    all.includes("ramă")
  );
}

function parseDimsCm(text: string): { w: number; h: number } | null {
  const t = text
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/,/g, ".");

  const m = t.match(
    /(\d{1,4}(?:\.\d{1,2})?)\s*x\s*(\d{1,4}(?:\.\d{1,2})?)(?=\s|$|[a-zăâîșț.,;:!?])/i
  );
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return { w, h };
}

type ExplicitProduct =
  | "pliante"
  | "carti_vizita"
  | "forex"
  | "plexiglass"
  | "canvas"
  | "autocolant"
  | "banner"
  | "unknown";

function detectExplicitProduct(text: string): ExplicitProduct {
  const t = normalize(text);
  if (t.includes("pliante") || t.includes("brosuri")) return "pliante";
  if (t.includes("carti de vizita") || t.includes("carti-vizita") || t.includes("business card") || t.includes("carti vizita")) return "carti_vizita";
  if (t.includes("forex") || t.includes("pvc-forex") || t.includes("pvc forex")) return "forex";
  if (t.includes("plexiglass") || t.includes("plexiglas") || t.includes("metacrilat")) return "plexiglass";
  if (t.includes("canvas") || t.includes("canva")) return "canvas";
  if (t.includes("autocolant") || t.includes("autocolante")) return "autocolant";
  if (t.includes("banner")) return "banner";
  return "unknown";
}

function formatRon(amount: any) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return String(amount);
  const rounded = Math.round(n * 100) / 100;
  return `${rounded.toFixed(2)} RON`;
}

function parseQty(text: string): number | null {
  const m = text.toLowerCase().match(/(\d+)\s*(buc|bucata|bucată|bucati|bucăți)/);
  if (m) {
    const q = Number(m[1]);
    return Number.isFinite(q) && q > 0 ? q : null;
  }
  const onlyNum = text.trim().match(/^(\d+)$/);
  if (onlyNum) {
    const q = Number(onlyNum[1]);
    return Number.isFinite(q) && q > 0 ? q : null;
  }
  return null;
}

function isOperatorIntent(last: string) {
  const t = last.trim().toLowerCase();
  return (
    t === "da" ||
    t === "ok" ||
    t === "operator" ||
    t.includes("whatsapp") ||
    t.includes("operator uman") ||
    t.includes("vreau operator") ||
    t.includes("contact") ||
    /^\+?\d[\d\s-]{7,}$/.test(t) // looks like a phone number
  );
}

function getMissingKeyError() {
  return NextResponse.json(
    {
      error: "OPENAI_API_KEY missing",
      message:
        "Lipsește OPENAI_API_KEY în environment. Adaugă cheia în `.env` și repornește serverul.",
    },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) return getMissingKeyError();

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      {
        error: "rate_limited",
        reply: `Prea multe mesaje într-un timp scurt. Încearcă din nou peste câteva minute sau scrie-ne pe WhatsApp / sună la ${siteConfig.phone}.`,
      },
      { status: 429 }
    );
  }

  try {
    const client = getOpenAiClient();
    const body = (await req.json().catch(() => null)) as {
      messages?: ChatMsg[];
      conversationId?: string;
    } | null;

    const userMessages: ChatMsg[] = (Array.isArray(body?.messages) ? body!.messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .slice(-MAX_MESSAGES)
      .map((m) => ({
        role: m.role,
        content: String(m.content ?? "").slice(0, MAX_CONTENT_CHARS),
      }));
    const last = userMessages[userMessages.length - 1];
    if (!last?.content) {
      return NextResponse.json(
        { error: "No message", message: "Trimite un mesaj." },
        { status: 400 }
      );
    }

    const conversationId =
      typeof body?.conversationId === "string" &&
      body.conversationId.trim().length > 0
        ? body.conversationId.trim().slice(0, 200)
        : `web-${randomUUID()}`;
    // Baza e comună celor 6 site-uri și AiConversation nu are coloană de site: prefixăm identificatorul cu domeniul.
    const logIdentifier = `${SITE_DOMAIN}:${conversationId}`;
    const lastUserText = last.content;

    const jsonReply = (reply: string) => {
      void logConversation("web", logIdentifier, [
        { role: "user", content: lastUserText },
        { role: "assistant", content: reply },
      ]);
      return NextResponse.json({ reply });
    };

    const baseUrl = getBaseUrl();
    // Doar mesaje user: salutul asistentului menționează produse și ar falsifica potrivirea de configuratoare.
    const convoText = userMessages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");
    const explicit = detectExplicitProduct(last.content);

    // If user asks "all configurators", return a deterministic catalog of links.
    if (isListAllIntent(last.content)) {
      const grouped = new Map<string, { name: string; url: string }[]>();
      for (const c of CONFIGURATORS_REGISTRY) {
        const cat = c.category || "altele";
        const arr = grouped.get(cat) || [];
        arr.push({ name: c.name, url: `${baseUrl}${c.url}` });
        grouped.set(cat, arr);
      }

      const lines: string[] = ["Avem aceste configuratoare/pagini (click pe link):", ""];
      for (const [cat, items] of [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        lines.push(`## ${cat}`);
        for (const it of items) lines.push(`- ${it.name}: ${it.url}`);
        lines.push("");
      }

      return jsonReply(lines.join("\n"));
    }

    // Deterministic "how to order" answer: send correct configurator/page + WhatsApp + email.
    if (isOrderIntent(last.content)) {
      const matches = findConfiguratorMatches(convoText, 3);
      const primary = matches[0];
      const primaryUrl = primary ? `${baseUrl}${primary.url}` : `${baseUrl}/`;
      const waUrl = buildWhatsAppUrl(
        `Bună! Vreau ajutor pentru plasarea unei comenzi pe ${SITE_DOMAIN} (mesaj din chat-ul de pe site).`
      );

      return jsonReply(
        [
          "Poți plasa comanda online aici:",
          `- Configurator: ${primaryUrl}`,
          "",
          "Dacă vrei un operator:",
          `- WhatsApp: ${waUrl}`,
          `- Telefon: ${siteConfig.phone}`,
          `- Email: ${siteConfig.email}`,
        ].join("\n")
      );
    }

    // Deterministic match for any product we offer: return direct link(s) instead of hallucinating.
    const matches = findConfiguratorMatches(convoText, 3);
    const wantsPricing =
      normalize(last.content).includes("pret") ||
      normalize(last.content).includes("cat costa") ||
      normalize(last.content).includes("cat e") ||
      normalize(last.content).includes("cost");

    const isRollOrBanner =
      extractBannerIntent(userMessages) ||
      normalize(last.content).includes("autocolant") ||
      extractCanvasIntent(userMessages);

    if (matches.length > 0 && !isRollOrBanner) {
      const top = matches[0];
      const others = matches.slice(1);
      const replyLines = [`Da, avem: ${top.name}.`, `Poți comanda aici: ${baseUrl}${top.url}`];

      if (others.length) {
        replyLines.push("", "Alte rezultate apropiate:");
        for (const c of others) replyLines.push(`- ${c.name}: ${baseUrl}${c.url}`);
      }

      if (wantsPricing) {
        replyLines.push(
          "",
          "Dacă vrei preț instant, spune-mi dimensiunea și cantitatea (iar pentru produse fără calculator automat, te trimit direct în pagina produsului)."
        );
      }

      return jsonReply(replyLines.join("\n"));
    }

    // Deterministic helper for PVC Forex (doar dacă site-ul are configuratorul).
    const forexUrl = cfgUrl("pvc-forex");
    if (forexUrl && (explicit === "forex" || (explicit === "unknown" && extractForexIntent(userMessages)))) {
      const dims = parseDimsCm(last.content) || parseDimsCm(convoText);
      const qty = parseQty(last.content) || parseQty(convoText) || 1;
      const thickness_mm = parseThicknessMm(last.content) || parseThicknessMm(convoText) || 3;

      if (!dims) {
        return jsonReply(
          `Sigur. Pentru PVC Forex am nevoie de dimensiune (lățime×înălțime, cm) și cantitate.\n` +
            `Ex: "100x200 cm, 1 buc, 3mm".\n` +
            `Comandă aici: ${baseUrl}${forexUrl}`
        );
      }

      const out = await executeTool(
        "calculate_rigid_price",
        {
          material_type: "forex",
          width_cm: dims.w,
          height_cm: dims.h,
          quantity: qty,
          thickness_mm,
          print_double: false,
          design_pro: false,
        },
        { source: "web", identifier: "web" }
      );

      const total = (out as any)?.pret_total;
      if (!total || total <= 0) {
        return jsonReply(
          `Nu am putut calcula corect prețul pentru PVC Forex. Verifică dimensiunile (max 305×205 cm) și grosimea (ex: 3mm).\n` +
            `Comandă aici: ${baseUrl}${forexUrl}`
        );
      }

      return jsonReply(
        `PVC Forex ${thickness_mm}mm, ${dims.w}×${dims.h} cm, ${qty} buc: ${formatRon(total)}.\n` +
          `Plasează comanda aici: ${baseUrl}${forexUrl}`
      );
    }

    // Deterministic helper for Cărți de vizită (preț instant pe cantitate + opțiuni).
    const cardsUrl = cfgUrl("carti-vizita");
    if (
      cardsUrl &&
      (explicit === "carti_vizita" ||
        (explicit === "unknown" && normalize(convoText).includes("carti") && normalize(convoText).includes("vizita")))
    ) {
      const qty = parseQty(last.content) || parseQty(convoText);
      if (!qty) {
        return jsonReply(
          `Sigur. Spune-mi cantitatea pentru Cărți de vizită (minim 100).\n` +
            `Ex: "Cărți de vizită, 100 buc, față-verso".\n` +
            `Comandă aici: ${baseUrl}${cardsUrl}`
        );
      }

      const res = calculateBusinessCardPrice({
        type: "standard",
        quantity: qty,
        twoSided: true, // default on site is față/verso
        roundedCorners: normalize(convoText).includes("rotunj"),
        specialShape:
          normalize(convoText).includes("decup") || normalize(convoText).includes("stanta"),
        designOption: normalize(convoText).includes("design pro") ? "pro" : "upload",
      } as any);

      if (!res?.finalPrice || res.finalPrice <= 0) {
        return jsonReply(
          `Nu am putut calcula prețul pentru Cărți de vizită. Spune-mi cantitatea (minim 100) și dacă vrei față-verso.\n` +
            `Comandă aici: ${baseUrl}${cardsUrl}`
        );
      }

      return jsonReply(
        `Cărți de vizită (standard), ${qty} buc: ${formatRon(res.finalPrice)}.\n` +
          `Plasează comanda aici: ${baseUrl}${cardsUrl}`
      );
    }

    const plexiUrl = cfgUrl("plexiglass");
    if (
      plexiUrl &&
      (explicit === "plexiglass" || (explicit === "unknown" && extractPlexiglassIntent(userMessages))) &&
      !extractForexIntent(userMessages)
    ) {
      const dims = parseDimsCm(last.content) || parseDimsCm(convoText);
      const qty = parseQty(last.content) || parseQty(convoText) || 1;
      const subtype = extractPlexiSubtype(userMessages);
      const thickness_mm = parseThicknessMm(last.content) || parseThicknessMm(convoText) || 3;

      if (!dims) {
        return jsonReply(
          `Sigur. Pentru Plexiglas am nevoie de dimensiune (lățime×înălțime, cm) și cantitate.\n` +
            `Ex: "100x200 cm, 1 buc, transparent, 3mm".\n` +
            `Comandă aici: ${baseUrl}${plexiUrl}`
        );
      }

      const out = await executeTool(
        "calculate_rigid_price",
        {
          material_type: "plexiglass",
          width_cm: dims.w,
          height_cm: dims.h,
          quantity: qty,
          thickness_mm,
          subtype,
          print_double: false,
          design_pro: false,
        },
        { source: "web", identifier: "web" }
      );

      const total = (out as any)?.pret_total;
      if (!total || total <= 0) {
        return jsonReply(
          `Nu am putut calcula corect prețul pentru Plexiglas. Verifică dimensiunile (max 400×200 cm) și grosimea (ex: 3mm).\n` +
            `Comandă aici: ${baseUrl}${plexiUrl}`
        );
      }

      return jsonReply(
        `Plexiglas ${subtype} ${thickness_mm}mm, ${dims.w}×${dims.h} cm, ${qty} buc: ${formatRon(total)}.\n` +
          `Plasează comanda aici: ${baseUrl}${plexiUrl}`
      );
    }

    // Deterministic helper for Canvas framed: ensure framed_size is passed so price is never 0.
    const canvasUrl = cfgUrl("canvas");
    if (canvasUrl && extractCanvasIntent(userMessages)) {
      const allText = userMessages.map((m) => m.content).join("\n");
      const dims = parseDimsCm(last.content) || parseDimsCm(allText);
      const qty = parseQty(last.content) || parseQty(allText) || 1;

      if (dims && extractWantsFrame(userMessages)) {
        // Tabelul de rame are cheile „40x60” (latura mică prima); acceptăm și „60x40”.
        const framedKeys = new Set([
          ...Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE),
          ...Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE),
        ]);
        const framed_size = framedKeys.has(`${dims.w}x${dims.h}`)
          ? `${dims.w}x${dims.h}`
          : `${dims.h}x${dims.w}`;
        const out = await executeTool(
          "calculate_roll_print_price",
          {
            product_type: "canvas",
            width_cm: dims.w,
            height_cm: dims.h,
            quantity: qty,
            framed_size,
            design_pro: false,
          },
          { source: "web", identifier: "web" }
        );

        if (!(out as any)?.pret_total) {
          return jsonReply(
            `Pentru canvas cu șasiu avem formate fixe: ${[...framedKeys].join(", ")} cm. Alege unul dintre ele și confirmă cantitatea (ex: \`1 buc\`), sau configurează aici: ${baseUrl}${canvasUrl}`
          );
        }

        return jsonReply(
          `Prețul pentru canvas cu șasiu ${dims.w}×${dims.h} cm (${qty} buc) este ${formatRon(
            (out as any).pret_total
          )}. Poți comanda aici: ${baseUrl}${canvasUrl}`
        );
      }
    }

    // Deterministic handoff: never "we will contact you".
    if (isOperatorIntent(last.content)) {
      const bannerUrl = cfgUrl("banner");
      const configuratorUrl =
        extractBannerIntent(userMessages) && bannerUrl ? `${baseUrl}${bannerUrl}` : `${baseUrl}/`;

      const waUrl = buildWhatsAppUrl(
        `Bună! Vreau să discut cu un operator ${BRAND} pentru o comandă. (Mesaj trimis din chat-ul de pe site)`
      );

      return jsonReply(
        [
          "Sigur — te conectez direct cu un operator.",
          "",
          `- WhatsApp operator: ${waUrl}`,
          `- Telefon: ${siteConfig.phone}`,
          `- Plasează comanda aici: ${configuratorUrl}`,
          "",
          "Apasă link-ul WhatsApp și scrie acolo. Eu nu pot iniția conversația în locul tău.",
        ].join("\n")
      );
    }

    const catalogLines = CONFIGURATORS_REGISTRY.map((c) => `- ${c.name}: ${baseUrl}${c.url}`).join("\n");

    const system: ChatMsg = {
      role: "system",
      content: [
        `Ești asistentul ${BRAND} (${SITE_DOMAIN}), magazin online de print din România. Răspunzi în română, concis și pragmatic.`,
        "Dacă utilizatorul cere prețuri pentru bannere, autocolante, canvas sau materiale rigide, folosește TOOLS pentru calcul.",
        "Când îți lipsesc date (dimensiuni, cantitate, material), întreabă EXACT ce lipsește.",
        "Nu inventa prețuri: orice preț vine DOAR din rezultatul unui tool. Dacă tool-ul returnează eroare, explică pe scurt și trimite linkul configuratorului.",
        "Nu inventa fapte, recenzii, statistici, reduceri sau termene. Termenul de livrare este 2-4 zile lucrătoare în total (producția inclusă); nu promite alte termene.",
        "Nu afirma nimic despre unde sau de cine se produce (fără „producție proprie”, „atelier propriu” sau „partener local”).",
        "Nu poți plasa comenzi din chat: pentru comandă trimite linkul configuratorului potrivit din lista de mai jos.",
        "NU cere numărul de telefon și NU promite că vei contacta utilizatorul.",
        `La cererea de operator uman, oferă DIRECT un link WhatsApp (https://wa.me/${waPhoneE164(siteConfig.phone)}) + telefonul ${siteConfig.phone} + emailul ${siteConfig.email}.`,
        "PENTRU CANVAS CU ȘASIU: include întotdeauna `framed_size` (ex: \"60x40\") când utilizatorul vrea șasiu (sau spune „cu ramă”).",
        "Folosește doar linkurile din lista de mai jos (nu inventa alte adrese):",
        catalogLines,
      ].join("\n"),
    };

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "calculate_banner_price",
          description: "Calculează preț pentru banner (frontlit 440/510 sau față-verso).",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              type: { type: "string", enum: ["single", "verso"] },
              width_cm: { type: "number" },
              height_cm: { type: "number" },
              quantity: { type: "number" },
              material: { type: "string", description: 'ex: "frontlit 440" sau "frontlit 510"' },
              want_wind_holes: { type: "boolean" },
            },
            required: ["type", "width_cm", "height_cm", "quantity"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "calculate_rigid_price",
          description: "Calculează preț pentru materiale rigide (ex: plexiglass, forex, alucobond).",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              material_type: {
                type: "string",
                enum: ["plexiglass", "forex", "alucobond", "polipropilena", "carton"],
              },
              width_cm: { type: "number" },
              height_cm: { type: "number" },
              quantity: { type: "number" },
              thickness_mm: { type: "number" },
              print_double: { type: "boolean" },
              color: { type: "string" },
              subtype: { type: "string" },
              design_pro: { type: "boolean" },
            },
            required: ["material_type", "width_cm", "height_cm", "quantity"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "calculate_roll_print_price",
          description: "Calculează preț pentru canvas sau autocolant (roll print).",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              product_type: { type: "string", enum: ["canvas", "autocolant"] },
              width_cm: { type: "number" },
              height_cm: { type: "number" },
              quantity: { type: "number" },
              framed_size: {
                type: "string",
                description: 'Doar canvas cu șasiu: ex "30x40" (cm), altfel omit.',
              },
              material_subtype: {
                type: "string",
                description:
                  'Doar autocolant: "Economic" / "Transparent" / "Removabil" / "Auto" (sau cheile interne).',
              },
              design_pro: { type: "boolean" },
              options: {
                type: "object",
                additionalProperties: true,
                properties: {
                  laminated: { type: "boolean" },
                  transfer_film: { type: "boolean" },
                  transfer: { type: "boolean" },
                  diecut: { type: "boolean" },
                },
              },
            },
            required: ["product_type", "width_cm", "height_cm", "quantity"],
          },
        },
      },
    ];
    // Doar uneltele de calcul de mai sus pot fi executate (fără create_order / generate_offer / căutări clienți).
    const allowedTools = new Set(tools.map((t) => (t as any).function.name as string));

    const context = { source: "web" as const, identifier: "web" };

    const convo: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      system,
      ...userMessages.map((m) => ({ role: m.role, content: m.content }) as OpenAI.Chat.Completions.ChatCompletionMessageParam),
    ];

    for (let hop = 0; hop < 4; hop++) {
      const res = await trackOpenAI("chat-site", CHAT_MODEL, () =>
        client.chat.completions.create({
          model: CHAT_MODEL,
          ...chatOptions(CHAT_MODEL, { temperature: 0.2 }),
          messages: convo,
          tools,
          tool_choice: "auto",
        })
      );

      const msg = res.choices?.[0]?.message;
      const toolCalls = msg?.tool_calls;

      if (!msg) {
        return jsonReply(
          "Nu am putut genera un răspuns. Încearcă din nou sau apasă „Operator (WhatsApp)”."
        );
      }

      convo.push(msg);

      if (!toolCalls?.length) {
        return jsonReply(msg.content || "Nu am putut genera un răspuns.");
      }

      for (const tc of toolCalls) {
        const fn = (tc as any)?.function;
        const fnName: string | undefined = fn?.name;
        if (!fnName) continue;
        let args: any = {};
        try {
          const rawArgs = typeof fn?.arguments === "string" ? fn.arguments : "";
          args = rawArgs ? JSON.parse(rawArgs) : {};
        } catch {
          args = {};
        }

        try {
          const out = allowedTools.has(fnName)
            ? await executeTool(fnName, args, context)
            : { error: true, message: "Unealtă indisponibilă." };
          convo.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(out) });
        } catch (e: any) {
          convo.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify({ error: true, message: e?.message ?? "Eroare la calcul." }),
          });
        }
      }
    }

    return jsonReply(
      "Nu am reușit să calculez automat. Spune-mi produsul (banner/autocolant/canvas), dimensiunile și cantitatea."
    );
  } catch (e: any) {
    if (faraCredite(e)) {
      // Alerta de credite o trimite lib/aiUsage.ts (trackOpenAI), ca în shopprint.
    }
    const status = Number(e?.status) || Number(e?.response?.status) || 500;
    const code = e?.code || e?.error?.code || e?.error?.type || e?.type || "unknown_error";

    if (status === 401 || code === "invalid_api_key") {
      return NextResponse.json(
        {
          error: "invalid_api_key",
          message: "Cheia OpenAI nu este validă (401).",
          reply:
            "Nu pot răspunde acum. Apasă „Operator (WhatsApp)” sau sună-ne și te ajutăm imediat.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: code,
        message: e?.message ?? "Eroare internă.",
        reply: "A apărut o eroare la asistent. Încearcă din nou sau apasă „Operator (WhatsApp)”.",
      },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
