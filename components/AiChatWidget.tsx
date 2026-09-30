"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Bot, Phone } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { CANVAS_CONSTANTS } from "@/lib/pricing";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

type Msg = { role: "user" | "assistant"; content: string };

const DEFAULT_MESSAGES: Msg[] = [
  {
    role: "assistant",
    content:
      "Salut! Spune-mi ce vrei să printezi (canvas / banner / autocolant), dimensiunea (cm) și cantitatea, iar îți calculez prețul instant.",
  },
];

function waPhoneE164(roPhone: string) {
  const digits = roPhone.replace(/[^\d]/g, "");
  if (digits.startsWith("40")) return digits;
  if (digits.startsWith("0")) return `40${digits.slice(1)}`;
  return digits;
}

const AI_CHAT_STORAGE_KEY = `${String(siteConfig.domain || "site").replace(/[^a-z0-9]+/gi, "_")}_ai_chat_conversation_id`;

export default function AiChatWidget() {
  const [messages, setMessages] = useState<Msg[]>(DEFAULT_MESSAGES);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showCanvasFrameOptions, setShowCanvasFrameOptions] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [selectedConfiguratorId, setSelectedConfiguratorId] = useState<string>("canvas");
  const [qty, setQty] = useState<number>(1);
  const [w, setW] = useState<string>("100");
  const [h, setH] = useState<string>("100");
  const [preset, setPreset] = useState<string>("");
  const [textileSize, setTextileSize] = useState<string>("M");
  const [textileMaterial, setTextileMaterial] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      let id = localStorage.getItem(AI_CHAT_STORAGE_KEY);
      if (!id) {
        id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(AI_CHAT_STORAGE_KEY, id);
      }
      setConversationId(id);
    } catch {
      setConversationId(
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`
      );
    }
  }, []);

  const whatsappHref = useMemo(() => {
    const phone = waPhoneE164(siteConfig.phone);
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content;
    const pref = lastUser
      ? `Bună! Am discutat cu asistentul de pe site. Întrebare: ${lastUser}`
      : "Bună! Vreau să discut cu un operator.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(pref)}`;
  }, [messages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  };

  const send = async () => {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setText("");
    setLoading(true);
    setShowCanvasFrameOptions(false);
    scrollToBottom();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          ...(conversationId ? { conversationId } : {}),
        }),
      });

      const data = (await res.json().catch(() => null)) as any;
      const reply =
        (data?.reply as string) ||
        (data?.message as string) ||
        "A apărut o eroare. Încearcă din nou.";

      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "Nu am reușit să răspund acum. Încearcă din nou sau folosește WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const lastAssistant = useMemo(() => {
    return [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";
  }, [messages]);

  const shouldSuggestCanvasFrameOptions = useMemo(() => {
    const t = lastAssistant.toLowerCase();
    return (
      (t.includes("canvas") || t.includes("canva")) &&
      (t.includes("ramă") || t.includes("rama")) &&
      (t.includes("dimensi") || t.includes("opțiun") || t.includes("optiun"))
    );
  }, [lastAssistant]);

  const canvasFrameOptions = useMemo(() => {
    const rect = Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE);
    const sq = Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE);
    // Keep consistent ordering (by area then width).
    const sortFn = (a: string, b: string) => {
      const [aw, ah] = a.split("x").map(Number);
      const [bw, bh] = b.split("x").map(Number);
      const aa = (aw || 0) * (ah || 0);
      const ba = (bw || 0) * (bh || 0);
      if (aa !== ba) return aa - ba;
      return (aw || 0) - (bw || 0);
    };
    return {
      rectangle: rect.sort(sortFn),
      square: sq.sort(sortFn),
    };
  }, []);

  const applyFrameSize = (size: string) => {
    setText((prev) => {
      const p = prev.trim();
      // If user already typed something, append size; otherwise just use size.
      if (!p) return size;
      if (p.includes("x")) return p; // already has dims
      return `${p} ${size}`;
    });
    setShowCanvasFrameOptions(false);
  };

  const selectedConfigurator = useMemo(() => {
    return CONFIGURATORS_REGISTRY.find((c) => c.id === selectedConfiguratorId) || CONFIGURATORS_REGISTRY[0];
  }, [selectedConfiguratorId]);

  const isTextile = selectedConfigurator?.category === "textile";

  const availablePresets = useMemo(() => {
    const presets = selectedConfigurator?.dimensions?.presets || [];
    return presets.map((p) => ({
      label: p.label || `${p.width}x${p.height}`,
      value: `${p.width}x${p.height}`,
    }));
  }, [selectedConfigurator]);

  const isPresetBased = !isTextile && selectedConfigurator?.dimensions?.type === "preset" && availablePresets.length > 0;

  const textileMaterials = useMemo(() => {
    const mats = selectedConfigurator?.materials || [];
    return mats.map((m) => ({ id: m.id, name: m.name }));
  }, [selectedConfigurator]);

  const applyPresetToDims = (value: string) => {
    setPreset(value);
    const m = value.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
    if (!m) return;
    setW(m[1]);
    setH(m[2]);
  };

  const sendQuickForm = () => {
    const q = Math.max(1, Math.floor(qty || 1));
    const name = selectedConfigurator?.name || "Produs";

    if (isTextile) {
      const matName =
        textileMaterials.find((m) => m.id === textileMaterial)?.name || "";
      const msg = [
        name,
        matName && `model: ${matName}`,
        textileSize && `mărime: ${textileSize}`,
        `${q} buc`,
      ]
        .filter(Boolean)
        .join(", ");
      setText(msg);
      setShowQuickForm(false);
      return;
    }

    const ww = parseFloat(String(w).replace(",", "."));
    const hh = parseFloat(String(h).replace(",", "."));
    const hasDims = Number.isFinite(ww) && Number.isFinite(hh) && ww > 0 && hh > 0;
    const dims = hasDims ? `${ww}x${hh}` : "";
    const msg = [name, dims && `${dims} cm`, `${q} buc`].filter(Boolean).join(", ");
    setText(msg);
    setShowQuickForm(false);
  };

  const renderContent = (content: string) => {
    // Convert URLs into clickable links (keeps newlines via whitespace-pre-wrap).
    const urlRe = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = content.split(urlRe);
    return parts.map((p, i) => {
      if (!p) return null;
      if (urlRe.test(p)) {
        const href = p.startsWith("http") ? p : `https://${p}`;
        // Trim common trailing punctuation
        const cleanHref = href.replace(/[),.]+$/g, "");
        const cleanLabel = p.replace(/[),.]+$/g, "");
        return (
          <a
            key={i}
            href={cleanHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-black text-[#9E2E4C] hover:text-[#7F2540] break-all"
          >
            {cleanLabel}
          </a>
        );
      }
      return <React.Fragment key={i}>{p}</React.Fragment>;
    });
  };

  return (
    <section className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="p-4 md:p-5 border-b border-stone-100 bg-gradient-to-r from-rose-50 to-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#B8385A] text-white flex items-center justify-center shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <p className="font-black tracking-tight text-stone-900 leading-tight">Chat AI {siteConfig.name}</p>
              <p className="text-xs text-stone-500 font-semibold">Prețuri instant pentru canvas / banner / autocolant</p>
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-black text-xs shadow-sm transition-colors"
            title="Treci la operator uman pe WhatsApp"
          >
            <Phone size={14} />
            Operator (WhatsApp)
          </a>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div ref={scrollRef} className="h-[320px] md:h-[360px] overflow-auto pr-1 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-stone-950 text-white"
                    : "bg-stone-50 border border-stone-100 text-stone-800"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-black text-[#9E2E4C]">
                    <MessageCircle size={12} />
                    Asistent
                  </div>
                )}
                <div className="whitespace-pre-wrap">{renderContent(m.content)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowQuickForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#B8385A] text-white font-black text-xs hover:bg-[#9E2E4C] transition-colors"
          >
            Căsuțe dimensiuni (rapid)
          </button>
          <button
            type="button"
            onClick={() => setText("vreau toate configuratoarele")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-stone-950 text-white font-black text-xs hover:bg-stone-800 transition-colors"
          >
            Listă configuratoare
          </button>
        </div>

        {showQuickForm && (
          <div className="mt-3 p-4 rounded-2xl border border-stone-200 bg-stone-50">
            <p className="text-xs font-black text-stone-700 mb-3">Formular rapid (pentru toate produsele)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Produs</label>
                <select
                  value={selectedConfiguratorId}
                  onChange={(e) => {
                    setSelectedConfiguratorId(e.target.value);
                    setPreset("");
                    setTextileMaterial("");
                  }}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                >
                  {CONFIGURATORS_REGISTRY.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {isTextile ? (
                <>
                  <div>
                    <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Mărime</label>
                    <select
                      value={textileSize}
                      onChange={(e) => setTextileSize(e.target.value)}
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                    >
                      {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Model (opțional)</label>
                    <select
                      value={textileMaterial}
                      onChange={(e) => setTextileMaterial(e.target.value)}
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                    >
                      <option value="">Alege…</option>
                      {textileMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : isPresetBased ? (
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Dimensiune (preset)</label>
                  <select
                    value={preset}
                    onChange={(e) => applyPresetToDims(e.target.value)}
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                  >
                    <option value="">Alege…</option>
                    {availablePresets.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label} ({p.value})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Lățime (cm)</label>
                    <input
                      value={w}
                      onChange={(e) => setW(e.target.value)}
                      inputMode="decimal"
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Înălțime (cm)</label>
                    <input
                      value={h}
                      onChange={(e) => setH(e.target.value)}
                      inputMode="decimal"
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                      placeholder="100"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-stone-600 uppercase tracking-wider">Cantitate (buc)</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={sendQuickForm}
                className="flex-1 h-11 rounded-xl bg-stone-950 text-white font-black text-sm hover:bg-stone-800 transition-colors"
              >
                Pune în mesaj
              </button>
              <button
                type="button"
                onClick={() => setShowQuickForm(false)}
                className="h-11 px-4 rounded-xl border border-stone-200 bg-white font-black text-sm text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Închide
              </button>
            </div>

            <p className="mt-2 text-[11px] text-stone-500 font-medium">
              După „Pune în mesaj”, mai poți adăuga material/finisaj (ex: 440g, laminat, 3mm) și apoi „Trimite”.
            </p>
          </div>
        )}

        {shouldSuggestCanvasFrameOptions && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCanvasFrameOptions((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-stone-950 text-white font-black text-xs hover:bg-stone-800 transition-colors"
            >
              Vezi opțiuni disponibile (ramă canvas)
            </button>

            {showCanvasFrameOptions && (
              <div className="mt-3 p-3 rounded-2xl border border-stone-200 bg-stone-50">
                <p className="text-xs font-bold text-stone-700 mb-2">
                  Alege o dimensiune fixă (lățime × înălțime):
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] font-black text-stone-600 mb-2 uppercase tracking-wider">
                      Dreptunghi
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {canvasFrameOptions.rectangle.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => applyFrameSize(s)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs font-black hover:border-[#B8385A] hover:text-[#9E2E4C] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-black text-stone-600 mb-2 uppercase tracking-wider">
                      Pătrat
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {canvasFrameOptions.square.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => applyFrameSize(s)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs font-black hover:border-[#B8385A] hover:text-[#9E2E4C] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-stone-500 font-medium">
                  După ce alegi dimensiunea, scrie și cantitatea (ex: „1 buc”).
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder='Ex: "Canvas 60x40 cm cu ramă, 1 buc"'
            className="flex-1 h-12 px-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#B8385A] font-semibold text-stone-900 placeholder:text-stone-400"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !text.trim()}
            className="h-12 px-4 rounded-2xl bg-[#B8385A] hover:bg-[#9E2E4C] disabled:bg-stone-200 disabled:text-stone-500 text-white font-black shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <Send size={16} />
            Trimite
          </button>
        </div>

        <p className="mt-3 text-[11px] text-stone-500 font-medium">
          Dacă vrei un operator, apasă „Operator (WhatsApp)”. Pentru preț: trimite produsul, dimensiunile și cantitatea.
        </p>
      </div>
    </section>
  );
}

