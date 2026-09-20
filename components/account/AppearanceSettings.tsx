"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
] as const;

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map((opt) => {
        const active = mounted && theme === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setTheme(opt.key)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-sm transition-colors",
              active ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-dim hover:border-text-faint"
            )}
          >
            <opt.icon size={17} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
