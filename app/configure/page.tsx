"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle, ArrowRight, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useCart } from "@/lib/useCart";
import { COLORS } from "@/lib/constants";
import { calculatePrintPrice } from "@/lib/pricing";
import { fitsBuildVolume } from "@/lib/printerConfig";
import { buildVolumeLabel } from "@/lib/productSize";
import { saveDesignDraft } from "@/lib/actions/designs";
import { persistUploadIfNeeded, saveResumeUpload, loadResumeUpload, clearResumeUpload } from "@/lib/resumeUpload";
import { toast } from "@/lib/toastStore";
import Configurator from "@/components/configure/Configurator";
import PriceBreakdown from "@/components/configure/PriceBreakdown";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const ModelViewer = dynamic(() => import("@/components/upload/ModelViewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function ConfigurePage() {
  return (
    <Suspense fallback={null}>
      <ConfigureContent />
    </Suspense>
  );
}

function ConfigureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const currentUpload = useStore((s) => s.currentUpload);
  const currentConfig = useStore((s) => s.currentConfig);
  const setCurrentUpload = useStore((s) => s.setCurrentUpload);
  const setCurrentConfig = useStore((s) => s.setCurrentConfig);
  const { addItem } = useCart();
  const [saved, setSaved] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Resume state after an auth redirect (e.g. Google OAuth) sent the user back here.
  useEffect(() => {
    if (searchParams.get("resume") !== "1") return;
    const resumed = loadResumeUpload();
    if (resumed) {
      setCurrentUpload(resumed.upload);
      setCurrentConfig(resumed.config);
      clearResumeUpload();
    }
    router.replace("/configure");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUpload && searchParams.get("resume") !== "1") router.replace("/upload");
  }, [currentUpload, router, searchParams]);

  if (!currentUpload) return null;

  const price = calculatePrintPrice({
    volumeCm3: currentUpload.stats.volumeCm3,
    materialKey: currentConfig.material,
    qualityKey: currentConfig.quality,
    quantity: currentConfig.quantity,
  });

  const colorHex = COLORS.find((c) => c.key === currentConfig.color)?.hex ?? "#161616";
  const dimensionsMm = {
    width: currentUpload.stats.dimensionsCm.x * 10,
    depth: currentUpload.stats.dimensionsCm.y * 10,
    height: currentUpload.stats.dimensionsCm.z * 10,
  };
  const maxDimensionMm = Math.max(dimensionsMm.width, dimensionsMm.depth, dimensionsMm.height);
  const fitsPrinter = fitsBuildVolume(dimensionsMm);

  const handleAddToCart = async () => {
    if (!fitsPrinter) return;
    setAddingToCart(true);
    try {
      const fileUrl = await persistUploadIfNeeded(currentUpload.fileURL, currentUpload.fileName);

      await addItem({
        type: "custom",
        name: currentUpload.fileName,
        fileName: currentUpload.fileName,
        fileUrl,
        fileType: currentUpload.fileType,
        statsJson: JSON.stringify(currentUpload.stats),
        material: currentConfig.material,
        color: currentConfig.color,
        quality: currentConfig.quality,
        widthMm: dimensionsMm.width,
        depthMm: dimensionsMm.depth,
        heightMm: dimensionsMm.height,
        unitPrice: price.unitCost,
        quantity: currentConfig.quantity,
      });
      setAdded(true);
      toast("Added to cart", "success");
    } catch {
      toast("We couldn't upload your file. Please try again.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSave = async () => {
    setSavingDraft(true);
    try {
      const fileUrl = await persistUploadIfNeeded(currentUpload.fileURL, currentUpload.fileName);
      const upload = { ...currentUpload, fileURL: fileUrl };

      if (status !== "authenticated") {
        saveResumeUpload(upload, currentConfig);
        router.push(`/login?callbackUrl=${encodeURIComponent("/configure?resume=1")}`);
        return;
      }

      const result = await saveDesignDraft(upload, currentConfig);
      if (result.ok) {
        setSaved(true);
        toast("Design saved to your library", "success");
      } else {
        toast(result.error, "error");
      }
    } catch {
      toast("Couldn't save this design. Please try again.", "error");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl text-text md:text-3xl">Customize your print</h1>
          <p className="mt-1 text-sm text-text-dim">{currentUpload.fileName}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved || savingDraft}
          className="hidden items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-text disabled:text-accent sm:flex"
        >
          {savingDraft ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <BookmarkCheck size={16} />
          ) : (
            <Bookmark size={16} />
          )}
          {saved ? "Saved" : "Save design"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="h-[360px] overflow-hidden rounded-xl border border-border bg-surface md:h-[480px]">
          <ModelViewer
            fileURL={currentUpload.fileURL}
            fileType={currentUpload.fileType}
            color={colorHex}
            maxDimensionMm={maxDimensionMm}
            className="h-full w-full"
          />
        </div>

        <div className="flex flex-col gap-8">
          <Configurator config={currentConfig} onChange={setCurrentConfig} />
          <PriceBreakdown price={price} />
          {!fitsPrinter && (
            <div className="flex items-start gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Too large to print as one piece</p>
                <p className="mt-0.5">
                  This model is {Math.round(maxDimensionMm)}mm on its longest edge, which exceeds the{" "}
                  {buildVolumeLabel()} printer build volume. Try a smaller model, or split it into multiple
                  parts before uploading.
                </p>
              </div>
            </div>
          )}
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart || !fitsPrinter}
            size="lg"
            className="w-full justify-center"
          >
            {addingToCart ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding…
              </>
            ) : (
              <>
                Add to cart
                <ArrowRight size={16} />
              </>
            )}
          </Button>
          {added && (
            <Link href="/cart" className="text-center text-sm font-medium text-text underline underline-offset-2">
              View cart →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
