import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-charcoal text-ivory hover:bg-charcoal/90 border border-charcoal",
  secondary:
    "bg-gold text-white hover:bg-gold-muted border border-gold",
  ghost: "bg-transparent text-charcoal hover:bg-champagne/40",
  outline:
    "bg-transparent border border-charcoal/20 text-charcoal hover:border-gold hover:text-gold",
};

export function Button({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-sm px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
