"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}

export const NumberInput = ({ label, value, onChange, step = 1, min = 1 }: NumberInputProps) => {
  const [text, setText] = useState(String(value));
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) {
      setText(String(value));
    }
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      onChange(min);
      setText(String(min));
      return;
    }
    const parsed = parseInt(trimmed, 10);
    const next = Number.isFinite(parsed) && parsed > 0 ? Math.max(min, parsed) : min;
    onChange(next);
    setText(String(next));
  };

  const inc = (d: number) => {
    isEditingRef.current = false;
    const next = Math.max(min, value + d);
    onChange(next);
    setText(String(next));
  };

  return (
    <div>
      {label ? <label className="field-label">{label}</label> : null}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => inc(-step)}
          disabled={value <= min}
          className="flex items-center justify-center w-12 h-12 bg-slate-50 border border-slate-200 rounded-l-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 active:scale-95 transition-all disabled:opacity-50"
          aria-label={`Scade ${label.toLowerCase()}`}
        >
          <Minus size={18} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onFocus={(e) => {
            isEditingRef.current = true;
            e.target.select();
          }}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^\d+$/.test(v)) {
              setText(v);
            }
          }}
          onBlur={() => {
            isEditingRef.current = false;
            commit(text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              isEditingRef.current = false;
              commit(text);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-full h-12 text-center bg-white border-y border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          onClick={() => inc(step)}
          className="flex items-center justify-center w-12 h-12 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 active:scale-95 transition-all"
          aria-label={`Crește ${label.toLowerCase()}`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
