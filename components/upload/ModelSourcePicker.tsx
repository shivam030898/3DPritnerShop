"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { parsePrintablesUrl } from "@/lib/printables";
import { cn } from "@/lib/utils";
import UploadDropzone from "./UploadDropzone";

const EASE = [0.16, 1, 0.3, 1] as const;
const LINK_TUTORIAL_KEY = "forma-link-tutorial-seen";
const LINK_TUTORIAL_DELAY_MS = 1200;

/**
 * The two ways a customer can hand us a model: upload a real file, or paste
 * a Printables.com link. We never build a model catalog/search of our own —
 * Printables is just where people find the design; this only validates and
 * stores the link (see lib/printables.ts).
 */
export default function ModelSourcePicker({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const setCurrentModel = useStore((s) => s.setCurrentModel);
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tutorialActive, setTutorialActive] = useState(false);

  // First-time visitors get a subtle nudge toward the link field instead of
  // having to discover it behind the "Find a model" toggle. Skipped entirely
  // once they've ever interacted with this flow, or if they've asked the OS
  // for reduced motion.
  useEffect(() => {
    let alreadySeen = true;
    try {
      alreadySeen = localStorage.getItem(LINK_TUTORIAL_KEY) === "1";
    } catch {
      alreadySeen = true;
    }
    if (alreadySeen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => {
      setExpanded(true);
      setTutorialActive(true);
    }, LINK_TUTORIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismissTutorial = () => {
    setTutorialActive(false);
    try {
      localStorage.setItem(LINK_TUTORIAL_KEY, "1");
    } catch {
      // localStorage unavailable — tutorial may reappear next visit, non-fatal.
    }
  };

  const handleUseModel = () => {
    dismissTutorial();
    const result = parsePrintablesUrl(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setCurrentModel({ type: "printables", url: result.url, modelId: result.modelId });
    router.push("/configure");
  };

  return (
    <div className="w-full">
      <UploadDropzone compact={compact} />

      <div className={cn("flex items-center gap-3", compact ? "mt-4" : "mt-6")}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-text-faint">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className={compact ? "mt-4" : "mt-6"}>
        {!expanded ? (
          <button
            type="button"
            onClick={() => {
              setExpanded(true);
              dismissTutorial();
            }}
            className={cn(
              "w-full text-center text-text-dim transition-colors hover:text-text",
              compact ? "text-xs" : "text-sm"
            )}
          >
            Don&apos;t have a model?{" "}
            <span className="font-medium text-text underline underline-offset-2">
              Find a model on Printables
            </span>
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <AnimatePresence>
                {tutorialActive && (
                  <motion.div
                    key="link-tutorial-tooltip"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="flex w-fit items-center gap-1.5 rounded-full bg-text px-3 py-1.5 text-[11px] font-medium text-bg shadow-card"
                  >
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg" />
                    </span>
                    No 3D model? Paste a printable model link here.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <AnimatePresence>
                    {tutorialActive && (
                      <motion.span
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0], scale: [0.97, 1.03, 1.08] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        className="pointer-events-none absolute -inset-1 rounded-lg border border-accent"
                      />
                    )}
                  </AnimatePresence>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={dismissTutorial}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUseModel();
                      }
                    }}
                    placeholder="Paste your Printables model URL"
                    className={cn(
                      "w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-text",
                      compact ? "h-9" : "h-11",
                      tutorialActive && "border-accent shadow-[0_0_0_4px_var(--color-accent-soft)]"
                    )}
                  />
                  {tutorialActive && !value && (
                    <motion.span
                      aria-hidden
                      animate={{ opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-[1.5px] -translate-y-1/2 bg-accent"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleUseModel}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-text font-medium text-bg transition-colors hover:bg-text/85",
                    compact ? "h-9 px-4 text-xs" : "h-11 px-5 text-sm"
                  )}
                >
                  Use this model
                  <ArrowRight size={compact ? 13 : 14} />
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertCircle size={13} className="shrink-0" />
                  {error}
                </div>
              )}

              <p className="text-[11px] text-text-faint">
                e.g. https://www.printables.com/model/123456-example-model
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
