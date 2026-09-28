"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-text text-bg hover:bg-text/85 disabled:bg-border-strong disabled:text-text-faint",
  secondary:
    "bg-surface text-text border border-border-strong hover:border-text disabled:text-text-faint disabled:hover:border-border-strong",
  ghost: "text-text hover:bg-surface-2 disabled:text-text-faint",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

/**
 * One shared hover/tap/focus language for every CTA that goes through this
 * component — a hair of scale and a soft shadow, nothing that reads as "an
 * animation" on its own. Background-color feedback stays on the plain
 * Tailwind `hover:` classes above (already smooth, no reason to move it
 * into Framer state); this only owns the properties CSS :hover can't
 * orchestrate cleanly across a button and its child arrow at once.
 */
const BUTTON_VARIANTS: Variants = {
  rest: { scale: 1, boxShadow: "0 0px 0px rgba(20, 20, 20, 0)" },
  hover: { scale: 1.02, boxShadow: "0 6px 20px rgba(20, 20, 20, 0.12)" },
  tap: { scale: 0.98, boxShadow: "0 2px 8px rgba(20, 20, 20, 0.08)" },
};

const HOVER_TRANSITION = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Wrap a trailing icon (almost always `<ArrowRight />`) in this so it nudges
 * forward when the enclosing <Button> is hovered/focused/tapped — it reads
 * the "hover"/"tap" variant from the nearest ancestor via Framer's variant
 * propagation, so no separate hover listener or state is needed here.
 * Only meant for a Button's own trailing icon, not standalone icon buttons,
 * quantity controls, or carousel chevrons — those aren't "come forward" CTAs.
 */
const ARROW_VARIANTS: Variants = {
  rest: { x: 0 },
  hover: { x: 5 },
  tap: { x: 5 },
};

export function ButtonArrow({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.span
      variants={shouldReduceMotion ? undefined : ARROW_VARIANTS}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
};

type ButtonProps = CommonProps & {
  as?: "button";
  type?: "button" | "submit";
  onClick?: () => void;
};

type LinkProps = CommonProps & {
  as: "link";
  href: string;
};

export default function Button(props: ButtonProps | LinkProps) {
  const { children, variant = "primary", size = "md", className, disabled } = props;
  const shouldReduceMotion = useReducedMotion();
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    disabled && "pointer-events-none opacity-50",
    className
  );

  // Reduced motion: skip Framer's gesture-driven variants entirely (no
  // scale, no shadow, no arrow nudge) and fall back to the plain color
  // transition already on `classes` above — the button stays fully
  // functional, it just stops moving.
  const motionProps = shouldReduceMotion
    ? {}
    : {
        variants: BUTTON_VARIANTS,
        initial: "rest",
        whileHover: "hover",
        whileFocus: "hover",
        whileTap: "tap",
        transition: HOVER_TRANSITION,
      };

  if (props.as === "link") {
    return (
      <motion.div {...motionProps} className="inline-block rounded-lg">
        <Link href={props.href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
