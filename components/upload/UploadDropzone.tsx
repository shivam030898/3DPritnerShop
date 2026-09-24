"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import { MAX_UPLOAD_MB, SUPPORTED_FORMATS } from "@/lib/constants";
import { detectFileType } from "@/lib/fileType";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function UploadDropzone({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "analyzing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const setCurrentModel = useStore((s) => s.setCurrentModel);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const fileType = detectFileType(file.name);
      if (!fileType) {
        setError(`Unsupported format. Please upload ${SUPPORTED_FORMATS.join(", ")}.`);
        setStatus("error");
        return;
      }

      const maxBytes = MAX_UPLOAD_MB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File is too large. Maximum size is ${MAX_UPLOAD_MB}MB.`);
        setStatus("error");
        return;
      }

      setStatus("analyzing");
      try {
        const { parseModelFile } = await import("@/lib/parseModel");
        const stats = await parseModelFile(file, fileType);
        const fileURL = URL.createObjectURL(file);
        setCurrentModel({ type: "upload", fileName: file.name, fileType, fileURL, stats });
        router.push("/configure");
      } catch {
        setError("We couldn't read this file. Please check it's a valid model and try again.");
        setStatus("error");
      }
    },
    [router, setCurrentModel]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        animate={{
          borderColor: dragging ? "var(--color-accent)" : "var(--color-border-strong)",
          backgroundColor: dragging ? "var(--color-accent-soft)" : "var(--color-surface)",
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center",
          compact ? "gap-0.5 px-5 py-6" : "px-6 py-16 md:py-24"
        )}
      >
        {status === "analyzing" ? (
          <>
            <Loader2
              size={compact ? 20 : 32}
              className="animate-spin text-text-dim"
              strokeWidth={1.5}
            />
            <p className={cn("text-text-dim", compact ? "mt-2 text-xs" : "mt-4 text-sm")}>
              Analyzing your model…
            </p>
          </>
        ) : (
          <>
            <UploadCloud size={compact ? 20 : 32} strokeWidth={1.5} className="text-text-dim" />
            <p className={cn("text-text", compact ? "mt-2 text-sm" : "mt-4 text-lg")}>
              Drop your 3D model here
            </p>
            <p className={cn("text-text-faint", compact ? "text-xs" : "mt-1 text-sm")}>
              or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-text underline underline-offset-2"
              >
                browse files
              </button>
            </p>
            <p className={cn("text-text-faint", compact ? "mt-2 text-[10px]" : "mt-6 text-xs")}>
              {SUPPORTED_FORMATS.join(" · ").toUpperCase()}
              {!compact && ` · Max ${MAX_UPLOAD_MB}MB`}
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent"
        >
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
