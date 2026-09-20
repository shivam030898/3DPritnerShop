"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleSavedProduct } from "@/lib/actions/savedProducts";
import { toast } from "@/lib/toastStore";
import { cn } from "@/lib/utils";

export default function SaveButton({
  slug,
  initialSaved,
  size = "sm",
}: {
  slug: string;
  initialSaved: boolean;
  size?: "sm" | "md";
}) {
  const { status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      toast("Sign in to save designs", "default");
      router.push("/login");
      return;
    }

    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const result = await toggleSavedProduct(slug);
      if (!result.ok) {
        setSaved(!next);
        toast(result.error, "error");
      }
    });
  };

  const dim = size === "sm" ? 14 : 17;
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from saved" : "Save design"}
      aria-pressed={saved}
      className={cn(
        "flex items-center justify-center rounded-full bg-surface/90 text-text shadow-card backdrop-blur transition-transform hover:scale-105",
        box
      )}
    >
      <Heart
        size={dim}
        className={saved ? "fill-accent text-accent" : "text-text-dim"}
      />
    </button>
  );
}
