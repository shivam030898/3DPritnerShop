"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle, ArrowRight, Bookmark, BookmarkCheck, Loader2, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { useCart } from "@/lib/useCart";
import { COLORS } from "@/lib/constants";
import { calculatePrintPrice } from "@/lib/pricing";
import { getPrintablesPriceOption } from "@/lib/printablesPricing";
import { fitsBuildVolume } from "@/lib/printerConfig";
import { buildVolumeLabel } from "@/lib/productSize";
import { formatINR } from "@/lib/utils";
import { saveDesignDraft } from "@/lib/actions/designs";
import { persistUploadIfNeeded, saveResumeUpload, loadResumeUpload, clearResumeUpload } from "@/lib/resumeUpload";
import { toast } from "@/lib/toastStore";
import Configurator from "@/components/configure/Configurator";
import PriceBreakdown from "@/components/configure/PriceBreakdown";
import PrintablesConfirmation from "@/components/upload/PrintablesConfirmation";
import StepIndicator from "@/components/configure/StepIndicator";
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
  const currentModel = useStore((s) => s.currentModel);
  const currentConfig = useStore((s) => s.currentConfig);
  const setCurrentModel = useStore((s) => s.setCurrentModel);
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
      setCurrentModel(resumed.model);
      setCurrentConfig(resumed.config);
      clearResumeUpload();
    }
    router.replace("/configure");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentModel && searchParams.get("resume") !== "1") router.replace("/upload");
  }, [currentModel, router, searchParams]);

  if (!currentModel) return null;

  const isUpload = currentModel.type === "upload";
  const upload = currentModel.type === "upload" ? currentModel : null;
  const printablesModel = currentModel.type === "printables" ? currentModel : null;

  const scale = currentConfig.scale;
  const printablesOption = printablesModel
    ? getPrintablesPriceOption(currentConfig.sizeTier, {
        materialKey: currentConfig.material,
        qualityKey: currentConfig.quality,
        quantity: currentConfig.quantity,
      })
    : null;

  const price = upload
    ? calculatePrintPrice({
        volumeCm3: upload.stats.volumeCm3 * scale ** 3,
        materialKey: currentConfig.material,
        qualityKey: currentConfig.quality,
        quantity: currentConfig.quantity,
      })
    : printablesOption!.price;

  const colorHex = COLORS.find((c) => c.key === currentConfig.color)?.hex ?? "#161616";

  const dimensionsMm = upload
    ? {
        width: upload.stats.dimensionsCm.x * 10 * scale,
        depth: upload.stats.dimensionsCm.y * 10 * scale,
        height: upload.stats.dimensionsCm.z * 10 * scale,
      }
    : printablesOption!.dimensionsMm;

  const sizeLabel = isUpload
    ? undefined
    : currentConfig.sizeTier[0].toUpperCase() + currentConfig.sizeTier.slice(1);

  const maxDimensionMm = Math.max(dimensionsMm.width, dimensionsMm.depth, dimensionsMm.height);
  // A Printables item has no real geometry — its box is a generic estimate,
  // not a measured fit — so we don't gate add-to-cart on it the way we do
  // for a real uploaded file.
  const fitsPrinter = isUpload ? fitsBuildVolume(dimensionsMm) : true;

  const handleAddToCart = async () => {
    if (upload && !fitsPrinter) return;
    setAddingToCart(true);
    try {
      if (upload) {
        const fileUrl = await persistUploadIfNeeded(upload.fileURL, upload.fileName);
        await addItem({
          type: "custom",
          modelSourceType: "UPLOAD",
          name: upload.fileName,
          fileName: upload.fileName,
          fileUrl,
          fileType: upload.fileType,
          statsJson: JSON.stringify(upload.stats),
          material: currentConfig.material,
          color: currentConfig.color,
          quality: currentConfig.quality,
          widthMm: dimensionsMm.width,
          depthMm: dimensionsMm.depth,
          heightMm: dimensionsMm.height,
          unitPrice: price.unitCost,
          quantity: currentConfig.quantity,
          notes: currentConfig.notes || undefined,
        });
      } else if (printablesModel) {
        await addItem({
          type: "custom",
          modelSourceType: "PRINTABLES",
          printablesUrl: printablesModel.url,
          name: "Printables model",
          material: currentConfig.material,
          color: currentConfig.color,
          quality: currentConfig.quality,
          sizeLabel,
          widthMm: dimensionsMm.width,
          depthMm: dimensionsMm.depth,
          heightMm: dimensionsMm.height,
          unitPrice: price.unitCost,
          quantity: currentConfig.quantity,
          notes: currentConfig.notes || undefined,
        });
      }
      setAdded(true);
      toast("Added to cart", "success");
    } catch {
      toast(
        upload ? "We couldn't upload your file. Please try again." : "We couldn't add this to your cart. Please try again.",
        "error"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSave = async () => {
    if (!upload) return;
    setSavingDraft(true);
    try {
      const fileUrl = await persistUploadIfNeeded(upload.fileURL, upload.fileName);
      const persistedUpload = { ...upload, fileURL: fileUrl };

      if (status !== "authenticated") {
        saveResumeUpload(persistedUpload, currentConfig);
        router.push(`/login?callbackUrl=${encodeURIComponent("/configure?resume=1")}`);
        return;
      }

      const result = await saveDesignDraft(persistedUpload, currentConfig);
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
    <div className="mx-auto max-w-6xl px-5 py-10 pb-44 md:py-14 lg:pb-14">
      <StepIndicator current={2} />

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl text-text md:text-3xl">Customize your print</h1>
          <p className="mt-1 text-sm text-text-dim">{upload ? upload.fileName : "Printables model"}</p>
        </div>
        {isUpload && (
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
        )}
      </div>

      {printablesModel && (
        <div className="mt-6">
          <PrintablesConfirmation url={printablesModel.url} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="h-[360px] overflow-hidden rounded-xl border border-border bg-surface md:h-[480px]">
          {upload ? (
            <ModelViewer
              fileURL={upload.fileURL}
              fileType={upload.fileType}
              color={colorHex}
              maxDimensionMm={maxDimensionMm}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Package size={32} strokeWidth={1.5} className="text-text-faint" />
              <p className="text-sm text-text-dim">
                Preview isn&apos;t available for external links — configure your print below.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <Configurator config={currentConfig} onChange={setCurrentConfig} sizeMode={isUpload ? "scale" : "tier"} />
          <PriceBreakdown price={price} estimate={!isUpload} />
          {isUpload && !fitsPrinter && (
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
          <div className="hidden lg:block">
            <AddToCartAction
              onClick={handleAddToCart}
              disabled={addingToCart || (isUpload && !fitsPrinter)}
              loading={addingToCart}
              added={added}
            />
          </div>
        </div>
      </div>

      {/* Mobile: price + CTA pinned above the tab bar so they're always visible. */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur-md lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-text-dim">
            Total · {price.estProductionDays} business days
          </span>
          <span className="text-display text-lg text-text">{formatINR(price.total)}</span>
        </div>
        <AddToCartAction
          onClick={handleAddToCart}
          disabled={addingToCart || (isUpload && !fitsPrinter)}
          loading={addingToCart}
          added={added}
        />
      </div>
    </div>
  );
}

function AddToCartAction({
  onClick,
  disabled,
  loading,
  added,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  added: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onClick} disabled={disabled} size="lg" className="w-full justify-center">
        {loading ? (
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
  );
}
