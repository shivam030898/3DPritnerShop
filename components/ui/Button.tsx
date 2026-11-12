import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Hover / focus / pressed / disabled behaviour is NOT defined here — it all
 * comes from the shared `.btn-fill` system in app/globals.css (a colour fill
 * that wipes in from the left; the button itself never moves or scales).
 * This component only picks the variant and the size.
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "btn-fill--solid",
  secondary: "btn-fill--outline",
  ghost: "btn-fill--ghost",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

/**
 * Wrapper for a Button's trailing icon. It used to nudge the icon forward
 * on hover; buttons no longer animate position at all, so this is now just
 * a stable inline box — kept so existing call sites don't need to change.
 */
export function ButtonArrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex">{children}</span>;
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
  const classes = cn(
    "btn-fill inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    disabled && "pointer-events-none",
    className
  );

  if (props.as === "link") {
    return (
      <div className="inline-block rounded-lg">
        <Link
          href={props.href}
          className={classes}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
        >
          {children}
        </Link>
      </div>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
