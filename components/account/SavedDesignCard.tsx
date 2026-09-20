"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Box, Trash2, RotateCw, Loader2 } from "lucide-react";
import type { Design } from "@/lib/generated/prisma";
import type { MaterialKey, QualityKey, ColorKey } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { deleteDesign } from "@/lib/actions/designs";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "@/lib/toastStore";

export default function SavedDesignCard({ design }: { design: Design }) {
  const router = useRouter();
  const setCurrentUpload = useStore((s) => s.setCurrentUpload);
  const setCurrentConfig = useStore((s) => s.setCurrentConfig);
  const [deleting, setDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handlePrintAgain = () => {
    setCurrentUpload({
      fileName: design.name,
      fileType: (design.fileType as "stl" | "obj" | "3mf") ?? "stl",
      fileURL: design.fileUrl,
      stats: {
        volumeCm3: design.volumeCm3,
        dimensionsCm: JSON.parse(design.dimensionsCm || "{}"),
        triangleCount: 0,
      },
    });
    setCurrentConfig({
      material: (design.material as MaterialKey) ?? "pla",
      color: (design.color as ColorKey) ?? "black",
      quality: (design.quality as QualityKey) ?? "standard",
      quantity: 1,
    });
    router.push("/configure");
  };

  const handleDelete = () => {
    setDeleting(true);
    startTransition(async () => {
      await deleteDesign(design.id);
      toast("Design deleted", "default");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex h-28 items-center justify-center rounded-lg bg-surface-2 text-text-faint">
        <Box size={28} strokeWidth={1.5} />
      </div>
      <p className="mt-4 truncate text-sm font-medium text-text">{design.name}</p>
      <p className="mt-1 text-xs text-text-faint">
        Uploaded {formatDate(design.createdAt)}
        {design.lastOrderedAt && ` · Last ordered ${formatDate(design.lastOrderedAt)}`}
      </p>
      {design.lastPrice && (
        <p className="mt-1 text-xs text-text-faint">Last price {formatINR(design.lastPrice)}</p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handlePrintAgain}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-strong px-3 py-2 text-xs text-text transition-colors hover:border-text"
        >
          <RotateCw size={13} />
          Print again
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting || isPending}
          aria-label="Delete design"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-strong text-text-dim transition-colors hover:border-accent hover:text-accent"
        >
          {deleting || isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
