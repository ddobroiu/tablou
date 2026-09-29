// Consumul AI al site-urilor de print, scris direct in baza comuna (tabelele PrintAi*), NU in mydashboard.
// Fisier IDENTIC in cele 6 site-uri (shopprint, prynt, euprint, homeprint, adbanner, tablou); site-ul vine din siteConfig.domain.
// Preturile si clasificarea erorilor sunt aceleasi ca in _deploy/shared/ai-usage.ts.
//
// - Nu arunca niciodata si nu blocheaza cererea: apelurile se aduna in memorie si se scriu (upsert cu increment)
//   dupa ~2 s, deci un raspuns cu mai multe apeluri (ex. chat cu unelte) devine o singura scriere.
// - Erorile se scriu imediat in PrintAiError. La credit terminat / cheie invalida site-ul trimite SINGUR un e-mail
//   la PRINT_AI_ALERT_EMAIL (implicit contact@shopprint.ro), cel mult 1 pe 24 h pentru site + furnizor + tip (randul din PrintAiAlert).
// - Bugetele (PrintAiBudget) se verifica din ora in ora in shopprint (lib/insights/aiUsage.ts).
// - Fara tabele (SQL-ul inca nerulat) nu face nimic.
//
// Folosire:
//   const r = await trackOpenAI("chat", CHAT_MODEL, () => openai.chat.completions.create({...}));
//   recordOpenAI("whatsapp-comanda", data.model ?? model, data.usage);
//   recordAiError("openai", model, "grafica", err);

import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/email';
import { siteConfig } from '@/lib/siteConfig';

export const AI_SITE = String(siteConfig.domain || '').trim().toLowerCase().replace(/^www\./, '') || 'necunoscut';

export type AiProvider = 'openai' | 'anthropic' | 'google' | 'replicate' | 'other';
export type AiErrorType = 'credit' | 'auth' | 'rate' | 'other';

export type AiUsageEvent = {
    provider: AiProvider;
    model: string;
    feature: string;
    // TOTI tokenii de intrare, inclusiv cei cititi din cache (cachedTokens) si cei scrisi in cache (cacheWriteTokens)
    inputTokens?: number;
    outputTokens?: number;
    cachedTokens?: number;
    cacheWriteTokens?: number;
    costUsd?: number;
    // imagini / generari; implicit 1
    count?: number;
    ok: boolean;
    errorType?: AiErrorType;
    errorMessage?: string;
};

// ─── Preturi (USD pe 1M tokeni), ca in _deploy/shared/ai-usage.ts ─────
type Price = { in: number; out: number; cachedMul: number };
export const AI_PRICES: Record<string, Price> = {
    // OpenAI
    'gpt-5.6-luna': { in: 0.2, out: 1.2, cachedMul: 0.1 },
    'gpt-5.6-terra': { in: 2, out: 12, cachedMul: 0.1 },
    'gpt-5.6-sol': { in: 4, out: 20, cachedMul: 0.1 },
    'gpt-5-mini': { in: 0.25, out: 2, cachedMul: 0.1 },
    'gpt-4o-mini': { in: 0.15, out: 0.6, cachedMul: 0.5 },
    'gpt-4o': { in: 2.5, out: 10, cachedMul: 0.5 },
    'gpt-4.1-mini': { in: 0.4, out: 1.6, cachedMul: 0.25 },
    // Anthropic (citirea din cache 0,1x; scrierea in cache 1,25x)
    'claude-haiku-4-5': { in: 1, out: 5, cachedMul: 0.1 },
    'claude-sonnet-5': { in: 2, out: 10, cachedMul: 0.1 },
    'claude-opus-5': { in: 5, out: 25, cachedMul: 0.1 },
    'claude-opus-5-5': { in: 4, out: 20, cachedMul: 0.1 },
};
const CACHE_WRITE_MUL = 1.25;
const PRICE_KEYS = Object.keys(AI_PRICES).sort((a, b) => b.length - a.length);

export function priceOf(model: string): Price | null {
    const m = String(model || '').toLowerCase().replace(/^(openai|anthropic)\//, '');
    const k = PRICE_KEYS.find((key) => m === key || m.startsWith(`${key}-`) || m.startsWith(`${key}@`));
    return k ? AI_PRICES[k] : null;
}

// Cost estimat; null cand nu stim pretul (ex. imaginile gpt-image / Gemini: se numara doar apelurile)
export function estimateCostUsd(e: AiUsageEvent): number | null {
    if (typeof e.costUsd === 'number' && Number.isFinite(e.costUsd)) return Math.max(0, e.costUsd);
    const p = priceOf(e.model);
    if (!p) return null;
    const input = Math.max(0, e.inputTokens ?? 0);
    const cached = Math.min(input, Math.max(0, e.cachedTokens ?? 0));
    const written = Math.min(input - cached, Math.max(0, e.cacheWriteTokens ?? 0));
    const plain = input - cached - written;
    const out = Math.max(0, e.outputTokens ?? 0);
    return (plain * p.in + cached * p.in * p.cachedMul + written * p.in * CACHE_WRITE_MUL + out * p.out) / 1e6;
}

// ─── Clasificarea erorilor (SDK OpenAI / Anthropic / fetch), ca in _deploy/shared/ai-usage.ts ─────
type ErrLike = {
    status?: number;
    statusCode?: number;
    code?: string;
    type?: string;
    message?: string;
    response?: { status?: number };
    error?: { type?: string; code?: string; message?: string; status?: string; error?: { type?: string; message?: string } };
};
const CREDIT_RE =
    /credit balance|insufficient[_ ]?(credit|funds|balance|quota)|out of credits|exceeded your current quota|billing[_ ]hard[_ ]limit|billing_not_active|payment required|spend(ing)? limit|monthly limit|RESOURCE_EXHAUSTED/i;
const AUTH_RE = /invalid[_ ]api[_ ]key|incorrect api key|invalid x-api-key|authentication[_ ]error|unauthori[sz]ed|permission[_ ]error|api key not valid/i;

export function classifyAiError(err: unknown): AiErrorType {
    const e = (typeof err === 'object' && err !== null ? err : {}) as ErrLike;
    const status = e.status ?? e.statusCode ?? e.response?.status;
    const types = [e.type, e.code, e.error?.type, e.error?.code, e.error?.error?.type].filter(Boolean).join(' ');
    const text = `${e.message ?? (typeof err === 'string' ? err : '')} ${e.error?.message ?? ''} ${e.error?.error?.message ?? ''} ${types}`;
    // insufficient_quota vine la OpenAI cu 429, deci creditul se verifica inaintea limitei de viteza
    if (status === 402 || /billing_error|insufficient_quota/.test(types) || CREDIT_RE.test(text)) return 'credit';
    if (status === 401 || status === 403 || /authentication_error|permission_error|invalid_api_key/.test(types) || AUTH_RE.test(text)) return 'auth';
    if (status === 429 || /rate_limit/.test(types) || /rate limit/i.test(text)) return 'rate';
    return 'other';
}

// ─── Ziua in ora Romaniei ─────
const roDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(d);
const dayDate = (day: string) => new Date(`${day}T00:00:00Z`);

// ─── Coada (pe proces) si scrierea ─────
type Agg = {
    date: string;
    provider: string;
    model: string;
    feature: string;
    calls: number;
    errors: number;
    inputTokens: number;
    outputTokens: number;
    cachedTokens: number;
    costUsd: number;
    unpriced: number;
};
type State = { pending: Map<string, Agg>; timer: ReturnType<typeof setTimeout> | null; mem: Map<string, number> };
const g = globalThis as unknown as { __printAiUsage?: State };
const state: State = (g.__printAiUsage ??= { pending: new Map(), timer: null, mem: new Map() });
const FLUSH_MS = 2_000;
const int = (n: number | undefined) => Math.max(0, Math.round(Number(n) || 0));

function isMissingTable(e: unknown): boolean {
    const err = e as { code?: string; message?: string } | null;
    return /P2021|42P01|does not exist/i.test(`${err?.code ?? ''} ${err?.message ?? ''}`);
}
const isUnique = (e: unknown) => (e as { code?: string } | null)?.code === 'P2002';

async function writeAgg(a: Agg) {
    const where = { site_date_provider_model_feature: { site: AI_SITE, date: dayDate(a.date), provider: a.provider, model: a.model, feature: a.feature } };
    const create = { site: AI_SITE, date: dayDate(a.date), provider: a.provider, model: a.model, feature: a.feature, calls: a.calls, errors: a.errors, inputTokens: a.inputTokens, outputTokens: a.outputTokens, cachedTokens: a.cachedTokens, costUsd: a.costUsd, unpriced: a.unpriced };
    const update = {
        calls: { increment: a.calls },
        errors: { increment: a.errors },
        inputTokens: { increment: a.inputTokens },
        outputTokens: { increment: a.outputTokens },
        cachedTokens: { increment: a.cachedTokens },
        costUsd: { increment: a.costUsd },
        unpriced: { increment: a.unpriced },
    };
    try {
        await prisma.printAiUsageDaily.upsert({ where, create, update });
    } catch (e) {
        // doua procese au creat acelasi rand in acelasi timp: a doua oara e update
        if (isUnique(e)) await prisma.printAiUsageDaily.upsert({ where, create, update });
        else throw e;
    }
}

export async function flushAiUsage(): Promise<void> {
    if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
    }
    const batch = [...state.pending.values()];
    state.pending.clear();
    for (const a of batch) {
        try {
            await writeAgg(a);
        } catch (e) {
            if (!isMissingTable(e)) console.warn('[ai-usage] nu am putut scrie consumul:', e instanceof Error ? e.message : e);
        }
    }
}

export function recordAiUsage(e: AiUsageEvent): void {
    try {
        const date = roDay(new Date());
        const model = String(e.model || 'necunoscut').slice(0, 100);
        const feature = String(e.feature || 'general').slice(0, 60);
        const key = `${date}|${e.provider}|${model}|${feature}`;
        const a = state.pending.get(key) ?? { date, provider: e.provider, model, feature, calls: 0, errors: 0, inputTokens: 0, outputTokens: 0, cachedTokens: 0, costUsd: 0, unpriced: 0 };
        const n = Math.max(1, int(e.count ?? 1));
        if (e.ok) {
            a.calls += n;
            a.inputTokens += int(e.inputTokens);
            a.outputTokens += int(e.outputTokens);
            a.cachedTokens += int(e.cachedTokens);
            const cost = estimateCostUsd(e);
            if (cost === null) a.unpriced += n;
            else a.costUsd += cost;
        } else {
            a.errors += n;
        }
        state.pending.set(key, a);
        if (!state.timer) {
            state.timer = setTimeout(() => void flushAiUsage(), FLUSH_MS);
            (state.timer as { unref?: () => void }).unref?.();
        }
    } catch {
        /* niciodata nu arunca */
    }
}

// OpenAI: Chat Completions (prompt_tokens / completion_tokens) sau Responses / Images (input_tokens / output_tokens)
type OpenAIUsage = {
    prompt_tokens?: number | null;
    completion_tokens?: number | null;
    input_tokens?: number | null;
    output_tokens?: number | null;
    prompt_tokens_details?: { cached_tokens?: number | null } | null;
    input_tokens_details?: { cached_tokens?: number | null } | null;
} | null | undefined;
// usage: unknown, ca sa primeasca direct tipurile SDK-ului (CompletionUsage, ResponseUsage, ImagesResponse.Usage) sau JSON-ul din fetch
export function recordOpenAI(feature: string, model: string, raw: unknown, count = 1): void {
    const usage = raw as OpenAIUsage;
    recordAiUsage({
        provider: 'openai',
        model,
        feature,
        inputTokens: usage?.prompt_tokens ?? usage?.input_tokens ?? 0,
        outputTokens: usage?.completion_tokens ?? usage?.output_tokens ?? 0,
        cachedTokens: usage?.prompt_tokens_details?.cached_tokens ?? usage?.input_tokens_details?.cached_tokens ?? 0,
        count,
        ok: true,
    });
}

// Apel OpenAI prin SDK: inregistreaza consumul din raspuns sau eroarea (si o arunca mai departe, neschimbata)
export async function trackOpenAI<T extends { model?: string; usage?: unknown }>(feature: string, model: string, fn: () => Promise<T>): Promise<T> {
    let r: T;
    try {
        r = await fn();
    } catch (err) {
        recordAiError('openai', model, feature, err);
        throw err;
    }
    recordOpenAI(feature, r?.model || model, r?.usage);
    return r;
}

// In catch (sau la un raspuns HTTP cu eroare): scrie eroarea clasificata; la credit / cheie invalida anunta imediat pe e-mail
export function recordAiError(provider: AiProvider, model: string, feature: string, err: unknown): void {
    try {
        const e = err as { message?: unknown } | null;
        const message = (typeof e?.message === 'string' ? e.message : String(err)).slice(0, 500);
        const kind = classifyAiError(err);
        recordAiUsage({ provider, model, feature, ok: false, errorType: kind, errorMessage: message });
        void (async () => {
            try {
                await flushAiUsage();
                await prisma.printAiError.create({ data: { site: AI_SITE, provider, model: String(model).slice(0, 100), feature: String(feature).slice(0, 60), kind, message } });
            } catch (x) {
                if (!isMissingTable(x)) console.warn('[ai-usage] nu am putut scrie eroarea:', x instanceof Error ? x.message : x);
            }
            if (kind === 'credit' || kind === 'auth') await notifyKeyProblem(provider, model, feature, kind, message);
        })();
    } catch {
        /* niciodata nu arunca */
    }
}

// ─── Alerte pe e-mail (contact@shopprint.ro), cu deduplicare in PrintAiAlert ─────
export const DAY_MS = 86_400_000;
export const aiAlertRecipients = () =>
    (process.env.PRINT_AI_ALERT_EMAIL || 'contact@shopprint.ro')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

const PROVIDER_NAME: Record<string, string> = { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Gemini (Google)', replicate: 'Replicate', other: 'Furnizorul AI' };
export const providerName = (p: string) => PROVIDER_NAME[p] ?? p;

// true = avem voie sa trimitem acum. windowMs null = o singura data pe cheie (ex. bugetul unei zile / luni).
// Fara tabel (SQL nerulat): deduplicare doar in memoria procesului, ca sa nu plece un e-mail la fiecare cerere.
export async function claimAiAlert(key: string, kind: string, site: string | null, message: string, windowMs: number | null): Promise<boolean> {
    const now = Date.now();
    try {
        await prisma.printAiAlert.create({ data: { key, kind, site, message: message.slice(0, 1000) } });
        return true;
    } catch (e) {
        if (isUnique(e)) {
            if (windowMs === null) return false;
            const r = await prisma.printAiAlert
                .updateMany({ where: { key, sentAt: { lt: new Date(now - windowMs) } }, data: { sentAt: new Date(now), message: message.slice(0, 1000) } })
                .catch(() => ({ count: 0 }));
            return r.count > 0;
        }
        if (!isMissingTable(e)) return false;
        const last = state.mem.get(key);
        if (last !== undefined && (windowMs === null || last > now - windowMs)) return false;
        state.mem.set(key, now);
        return true;
    }
}

// E-mailul n-a plecat: eliberam cheia, ca sa se reincerce la urmatoarea ocazie
export async function releaseAiAlert(key: string): Promise<void> {
    state.mem.delete(key);
    await prisma.printAiAlert.deleteMany({ where: { key } }).catch(() => undefined);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);

export async function sendAiAlertEmail(subject: string, lines: string[], color = '#be123c'): Promise<boolean> {
    try {
        const resend = getResend();
        if (!resend) return false;
        const adminUrl = 'https://www.shopprint.ro/admin/monitorizare/consum-ai';
        const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#0f172a">
<h2 style="font-size:17px;color:${color};margin:0 0 10px">${esc(subject)}</h2>
${lines.map((l) => `<p style="font-size:14px;line-height:1.5;margin:0 0 8px">${esc(l)}</p>`).join('')}
<p style="margin:14px 0 0"><a href="${adminUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:9px 14px;border-radius:8px;font-size:14px">Deschide „Consum AI”</a></p>
</div>`;
        const { error } = await resend.emails.send({
            from: `Alerte AI <${process.env.EMAIL_FROM || 'contact@shopprint.ro'}>`,
            to: aiAlertRecipients(),
            subject,
            html,
        });
        return !error;
    } catch {
        return false;
    }
}

async function notifyKeyProblem(provider: string, model: string, feature: string, kind: 'credit' | 'auth', message: string) {
    try {
        const name = providerName(provider);
        const text =
            kind === 'credit'
                ? `${AI_SITE}: ${name} spune că s-au terminat creditele / cota (model ${model}, funcția „${feature}”). Asistentul AI nu răspunde până se reîncarcă contul.`
                : `${AI_SITE}: ${name} refuză cheia API (invalidă, revocată sau fără drepturi; model ${model}, funcția „${feature}”).`;
        const key = `ai-${kind}:${AI_SITE}:${provider}`;
        if (!(await claimAiAlert(key, `ai-${kind}`, AI_SITE, text, DAY_MS))) return;
        const sent = await sendAiAlertEmail(`AI: ${kind === 'credit' ? 'credit terminat' : 'cheie invalidă'} – ${AI_SITE} (${name})`, [
            text,
            `Mesajul furnizorului: ${message.slice(0, 300)}`,
            'Primești cel mult un e-mail pe zi pentru această problemă.',
        ]);
        if (!sent) await releaseAiAlert(key);
    } catch {
        /* niciodata nu arunca */
    }
}
