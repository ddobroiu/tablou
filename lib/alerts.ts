// Alerte catre mydashboard (e-mail la contact@mydashboard.ro): credite terminate la un furnizor, erori importante.
// Fara MYDASHBOARD_ALERT_TOKEN (ex. local) nu trimite nimic. Nu arunca niciodata.
const PROJECT = "print";
const SITE = "tablou.net";
const CREDIT_RE = /credit balance|insufficient[_ ](credit|funds|balance|quota)|out of credits|exceeded your current quota|billing|payment required|spend(ing)? limit|RESOURCE_EXHAUSTED/i;
export function faraCredite(err: unknown): boolean {
  const e = err as { status?: number; statusCode?: number; code?: string; response?: { status?: number }; message?: string; error?: { type?: string; message?: string; code?: string } } | null;
  const status = e?.status ?? e?.statusCode ?? e?.response?.status;
  const text = `${e?.message ?? ""} ${e?.code ?? ""} ${e?.error?.type ?? ""} ${e?.error?.code ?? ""} ${e?.error?.message ?? ""}`;
  return status === 402 || CREDIT_RE.test(text);
}
export async function alerta(kind: "credits" | "error", key: string, message: string, resolved = false): Promise<void> {
  const token = process.env.MYDASHBOARD_ALERT_TOKEN;
  if (!token) return;
  try {
    await fetch("https://mydashboard.ro/api/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-alert-token": token },
      body: JSON.stringify({ project: PROJECT, kind, key: `${SITE}:${key}`, message: `${SITE}: ${message}`.slice(0, 900), resolved }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* alerta nu blocheaza niciodata aplicatia */ }
}
