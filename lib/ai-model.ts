/**
 * Modelul OpenAI pentru textul AI al site-ului (asistentul de pe site, WhatsApp, extragerea comenzilor).
 * Implicit gpt-5.6-luna ($0.20 / $1.20 per 1M tokeni); OPENAI_MODEL îl schimbă (ex. gpt-4o).
 * Generarea de imagini (gpt-image-2 / Gemini) NU folosește această constantă.
 */
export const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

type ChatOptions = {
  reasoning_effort?: "none" | "low" | "medium" | "high";
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
};

/**
 * Parametrii compatibili cu modelul, pentru Chat Completions:
 * - gpt-5.x / o*: max_completion_tokens (nu max_tokens); temperature și uneltele (tools) merg doar cu
 *   reasoning_effort "none" (implicit aici; cu gândire primește în plus loc pentru tokenii de gândire);
 * - gpt-4o și celelalte: temperature + max_tokens, ca înainte.
 */
export function chatOptions(
  model: string,
  o: { temperature?: number; maxTokens?: number; effort?: "none" | "low" | "medium" } = {},
): ChatOptions {
  if (/^(gpt-5|o\d)/.test(model)) {
    const effort = o.effort ?? "none";
    return {
      reasoning_effort: effort,
      ...(effort === "none" && o.temperature !== undefined && { temperature: o.temperature }),
      ...(o.maxTokens && { max_completion_tokens: o.maxTokens + (effort === "none" ? 0 : 2000) }),
    };
  }
  return {
    ...(o.temperature !== undefined && { temperature: o.temperature }),
    ...(o.maxTokens && { max_tokens: o.maxTokens }),
  };
}
