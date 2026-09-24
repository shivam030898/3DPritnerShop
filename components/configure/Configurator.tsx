"use client";

import { Check } from "lucide-react";
import { MATERIALS, COLORS, QUALITIES } from "@/lib/constants";
import type { CurrentConfig } from "@/lib/store";
import type { PrintablesSizeKey } from "@/lib/printablesPricing";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

const SCALE_OPTIONS = [
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
];

const TIER_OPTIONS: { value: PrintablesSizeKey; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function Configurator({
  config,
  onChange,
  /** "scale" for a real uploaded model (percent scale of its native size); "tier" for a Printables link (no real geometry, so a coarse Small/Medium/Large size instead). */
  sizeMode = "scale",
}: {
  config: CurrentConfig;
  onChange: (patch: Partial<CurrentConfig>) => void;
  sizeMode?: "scale" | "tier";
}) {
  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="text-sm font-medium text-text">Material</legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MATERIALS.map((m) => {
            const active = config.material === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onChange({ material: m.key })}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-lg border px-3.5 py-3 text-left transition-colors",
                  active ? "border-text bg-surface-2" : "border-border-strong hover:border-text-faint"
                )}
              >
                <span className="flex w-full items-center justify-between text-sm text-text">
                  {m.name}
                  {active && <Check size={14} />}
                </span>
                <span className="text-xs text-text-faint">{m.finish}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Color</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {COLORS.map((c) => {
            const active = config.color === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => onChange({ color: c.key })}
                aria-label={c.name}
                aria-pressed={active}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-transform",
                  active ? "border-text scale-105" : "border-transparent hover:scale-105"
                )}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
                  style={{ background: c.key === "custom" ? undefined : c.hex }}
                >
                  {c.key === "custom" ? (
                    <span
                      className="h-full w-full rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #ff5a1f, #2f5fd6, #1a8f4c, #d1352b, #ff5a1f)",
                      }}
                    />
                  ) : active ? (
                    <Check
                      size={14}
                      className={c.key === "white" ? "text-text" : "text-white"}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Quality</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {QUALITIES.map((q) => {
            const active = config.quality === q.key;
            return (
              <button
                key={q.key}
                type="button"
                onClick={() => onChange({ quality: q.key })}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-3 text-center transition-colors",
                  active ? "border-text bg-surface-2" : "border-border-strong hover:border-text-faint"
                )}
              >
                <span className="text-sm text-text">{q.name}</span>
                <span className="text-xs text-text-faint">{q.layerHeight}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Size</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {sizeMode === "scale"
            ? SCALE_OPTIONS.map((s) => {
                const active = config.scale === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onChange({ scale: s.value })}
                    className={cn(
                      "flex items-center justify-center gap-1 rounded-lg border px-2 py-3 text-sm transition-colors",
                      active ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-dim hover:border-text-faint"
                    )}
                  >
                    {s.label}
                    {active && <Check size={14} />}
                  </button>
                );
              })
            : TIER_OPTIONS.map((t) => {
                const active = config.sizeTier === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => onChange({ sizeTier: t.value })}
                    className={cn(
                      "flex items-center justify-center gap-1 rounded-lg border px-2 py-3 text-sm transition-colors",
                      active ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-dim hover:border-text-faint"
                    )}
                  >
                    {t.label}
                    {active && <Check size={14} />}
                  </button>
                );
              })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Quantity</legend>
        <div className="mt-3">
          <QuantityStepper
            value={config.quantity}
            onChange={(quantity) => onChange({ quantity })}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Additional instructions</legend>
        <textarea
          value={config.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Optional — anything we should know before printing this (e.g. orientation, tolerances)."
          rows={3}
          maxLength={500}
          className="mt-3 w-full resize-none rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-text"
        />
      </fieldset>
    </div>
  );
}
