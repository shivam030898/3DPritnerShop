"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import { MAX_UPLOAD_MB, SUPPORTED_FORMATS } from "@/lib/constants";
import { detectFileType } from "@/lib/fileType";
import { useStore } from "@/lib/store";

export default function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "analyzing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const setCurrentUpload = useStore((s) => s.setCurrentUpload);

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
        setCurrentUpload({ fileName: file.name, fileType, fileURL, stats });
        router.push("/configure");
      } catch {
        setError("We couldn't read this file. Please check it's a valid model and try again.");
        setStatus("error");
      }
    },
    [router, setCurrentUpload]
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
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center md:py-24"
      >
        {status === "analyzing" ? (
          <>
            <Loader2 size={32} className="animate-spin text-text-dim" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-text-dim">Analyzing your model…</p>
          </>
        ) : (
          <>
            <UploadCloud size={32} strokeWidth={1.5} className="text-text-dim" />
            <p className="mt-4 text-lg text-text">Drop your 3D model here</p>
            <p className="mt-1 text-sm text-text-faint">
              or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-text underline underline-offset-2"
              >
                browse files
              </button>
            </p>
            <p className="mt-6 text-xs text-text-faint">
              Supports {SUPPORTED_FORMATS.join(", ").toUpperCase()} · Max {MAX_UPLOAD_MB}MB
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
