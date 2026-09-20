"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    disabled && "pointer-events-none opacity-50",
    className
  );

  if (props.as === "link") {
    return (
      <motion.div whileTap={{ scale: 0.98 }} className="inline-block">
        <Link href={props.href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
