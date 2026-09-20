"use client";

import { Check } from "lucide-react";
import { MATERIALS, COLORS, QUALITIES } from "@/lib/constants";
import type { CurrentConfig } from "@/lib/store";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

export default function Configurator({
  config,
  onChange,
}: {
  config: CurrentConfig;
  onChange: (patch: Partial<CurrentConfig>) => void;
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
        <legend className="text-sm font-medium text-text">Quantity</legend>
        <div className="mt-3">
          <QuantityStepper
            value={config.quantity}
            onChange={(quantity) => onChange({ quantity })}
          />
        </div>
      </fieldset>
    </div>
  );
}
