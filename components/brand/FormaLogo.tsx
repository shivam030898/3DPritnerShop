import { cn } from "@/lib/utils";

/**
 * Brand blue, fixed across light and dark mode — this is the identity
 * color from the FORMA mark itself (sampled from the source artwork), not
 * a themed UI accent, so it deliberately does not read from --color-accent
 * (which shifts slightly in dark mode for on-screen contrast elsewhere).
 */
const BRAND_BLUE = "#1039FC";

/**
 * The FORMA icon mark as vector paths (traced from the source artwork),
 * replacing the old raster PNG so it no longer goes dark-on-dark in dark
 * mode. The monochrome shapes use `currentColor` so they inherit text
 * color from an ancestor (e.g. Tailwind's `text-text`, which already
 * flips light/dark via CSS variables); the blue drip stays fixed.
 */
function FormaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M25,12 a5,5 0 0 1 5,-5 h43 a5,5 0 0 1 5,5 v22 a5,5 0 0 1 -5,5 h-43 a5,5 0 0 1 -5,-5 z M40,23.6 a5.3,5.3 0 1 0 0.001,0 z"
      />
      <polygon fill="currentColor" points="32,43 70,43 57,63 45,63" />
      <path
        stroke={BRAND_BLUE}
        strokeWidth="9.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M51,67 L51,79 Q51,84.5 56.5,84.5 L82,84.5"
      />
    </svg>
  );
}

export default function FormaLogo({
  className,
  iconClassName = "h-7 w-7",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-display text-lg text-text", className)}>
      <FormaMark className={cn("shrink-0 text-text", iconClassName)} />
      FORMA
    </span>
  );
}
