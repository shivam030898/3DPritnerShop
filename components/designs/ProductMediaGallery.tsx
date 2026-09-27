"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryMediaItem =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster: string };

const HOVER_ZOOM_SCALE = 2.2;
const TAP_ZOOM_SCALE = 2.5;

/**
 * True only for mouse/trackpad devices — touch devices get tap-to-zoom
 * instead (see the lightbox below). Starts `false` (matching the server
 * render) and updates after mount — reading `matchMedia` in the initial
 * state would run during hydration too, before the server/client markup
 * is reconciled, and mismatch on any real desktop browser.
 */
function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverCapable(query.matches);
    const onChange = (e: MediaQueryListEvent) => setHoverCapable(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return hoverCapable;
}

/**
 * Amazon-style product media gallery.
 *
 * The core invariant: the viewer's box size is set entirely by CSS
 * (fixed per-breakpoint height, `w-full` width) and never by the media
 * itself. Both images (`next/image fill`) and video (`absolute inset-0`)
 * are taken out of normal flow, so neither can push the container to
 * grow/shrink — a portrait photo, a square photo, a landscape video all
 * render inside the exact same box via `object-fit: contain`, with zero
 * layout shift on switch. Don't reintroduce intrinsic width/height on the
 * media elements; that's the bug this was built to fix.
 */
export default function ProductMediaGallery({
  productName,
  media,
  limited,
}: {
  productName: string;
  media: GalleryMediaItem[];
  limited: boolean;
}) {
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, media.length - 1);
  const active = media[safeIndex];
  const hasMultiple = media.length > 1;
  const hoverCapable = useHoverCapable();

  const goTo = (i: number) => setIndex((i + media.length) % media.length);
  // Functional updates (not closing over safeIndex) so the keydown listener
  // below always steps from the current index, not a stale one.
  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1 + media.length) % media.length);

  // Cursor-follow zoom (desktop/trackpad only — see useHoverCapable).
  const [hoverZoom, setHoverZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  };

  // Full-screen tap-to-zoom view — the touch equivalent of hover-zoom.
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);
  const [lightboxOrigin, setLightboxOrigin] = useState({ x: 50, y: 50 });

  // Switching media (thumbnail, arrow, or color change) always resets any
  // in-progress zoom so the next image starts from a clean, un-zoomed state.
  useEffect(() => {
    setHoverZoom(false);
    setLightboxZoomed(false);
  }, [active.src]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const toggleLightboxZoom = (e: React.MouseEvent<HTMLElement>) => {
    if (lightboxZoomed) {
      setLightboxZoomed(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setLightboxOrigin({
      x: Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)),
    });
    setLightboxZoomed(true);
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:gap-4">
      {hasMultiple && (
        <div className="hidden lg:flex lg:w-[72px] lg:shrink-0 lg:flex-col lg:gap-3">
          {media.map((item, i) => (
            <Thumbnail key={i} item={item} active={i === safeIndex} onClick={() => goTo(i)} />
          ))}
        </div>
      )}

      <div
        className="pd-image relative flex h-[440px] w-full min-w-0 items-center justify-center overflow-hidden rounded-md bg-white outline-none focus-visible:ring-2 focus-visible:ring-text/40 sm:h-[560px] lg:h-[680px]"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${productName} media`}
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={(e) => {
          if (!hasMultiple) return;
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={active.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {active.type === "image" ? (
              <div
                className={cn("relative h-full w-full", hoverCapable ? "cursor-zoom-in" : "cursor-pointer")}
                onMouseMove={hoverCapable ? handleZoomMove : undefined}
                onMouseEnter={hoverCapable ? () => setHoverZoom(true) : undefined}
                onMouseLeave={hoverCapable ? () => setHoverZoom(false) : undefined}
                // A plain div is only script-focusable, so Chromium's
                // :focus-visible heuristic treats any focus — including one
                // from this click reaching the .pd-image ancestor above —
                // as "visible" and leaves a ring showing after the
                // lightbox closes. Suppressing the default focus-on-
                // mousedown here (scoped to just the image, not the
                // chevron/thumbnail buttons) keeps keyboard Tab navigation
                // working while a plain click no longer triggers it.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLightboxOpen(true)}
              >
                <div
                  className="h-full w-full"
                  style={{
                    transform: hoverZoom ? `scale(${HOVER_ZOOM_SCALE})` : undefined,
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transition: hoverZoom ? "transform 60ms linear" : "transform 200ms ease-out",
                  }}
                >
                  <Image
                    src={active.src}
                    alt={active.alt ?? productName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain"
                    priority={safeIndex === 0}
                  />
                </div>
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity",
                    hoverZoom ? "opacity-0" : "opacity-70"
                  )}
                >
                  <ZoomIn size={15} />
                </span>
              </div>
            ) : (
              <video
                key={active.src}
                controls
                playsInline
                poster={active.poster}
                className="absolute inset-0 h-full w-full object-contain"
              >
                <source src={active.src} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </AnimatePresence>

        {limited && active.type === "image" && (
          <p className="text-mono-label pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
            Limited
          </p>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous media"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next media"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm",
                // Videos show their own control bar at the bottom, so the
                // counter moves up to the top to avoid overlapping it.
                active.type === "video" ? "top-3" : "bottom-3"
              )}
            >
              {safeIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">
          {media.map((item, i) => (
            <Thumbnail key={i} item={item} active={i === safeIndex} onClick={() => goTo(i)} />
          ))}
        </div>
      )}

      {lightboxOpen && active.type === "image" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoomed view"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous media"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next media"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            className="flex h-full w-full items-center justify-center overflow-hidden p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Plain <img> (not next/image) — this is the un-cropped, full-resolution
                source, and the point of the lightbox is to see it at full detail. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.alt ?? productName}
              onClick={toggleLightboxZoom}
              className={cn(
                "max-h-full max-w-full cursor-zoom-in object-contain",
                lightboxZoomed && "cursor-zoom-out"
              )}
              style={{
                transform: lightboxZoomed ? `scale(${TAP_ZOOM_SCALE})` : undefined,
                transformOrigin: `${lightboxOrigin.x}% ${lightboxOrigin.y}%`,
                transition: "transform 200ms ease-out",
              }}
            />
          </div>

          {hasMultiple && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[11px] text-white/80">
              {safeIndex + 1} / {media.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Thumbnail({
  item,
  active,
  onClick,
}: {
  item: GalleryMediaItem;
  active: boolean;
  onClick: () => void;
}) {
  const src = item.type === "image" ? item.src : item.poster;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.type === "video" ? "Play video" : "View product photo"}
      aria-current={active}
      className={cn(
        "relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white transition-all duration-200 lg:h-[68px] lg:w-[68px]",
        active
          ? "ring-2 ring-text ring-offset-2 ring-offset-bg"
          : "opacity-55 hover:opacity-90"
      )}
    >
      <Image src={src} alt="" fill sizes="80px" className="object-cover" />
      {item.type === "video" && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <Play size={15} className="text-white" fill="white" />
        </span>
      )}
    </button>
  );
}
