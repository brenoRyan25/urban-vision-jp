import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Cápsula (radius-pill) porque ecoa a silhueta da lente — é a forma que
 * amarra botão, badge e a marca. Superfícies (cards, inputs) usam 4px.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-pill " +
  "font-semibold [font-stretch:112%] whitespace-nowrap " +
  "transition-[background-color,color,border-color,transform] duration-150 " +
  "active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-45";

/**
 * `volt` é o único CTA de ação do site — por isso é sempre "primary".
 * `iridium` fica reservado para seleção/estrutura (foco, badges, chips
 * ativos), nunca para um botão de compra: dois acentos de ação
 * competindo diluiriam os dois.
 */
const variants: Record<Variant, string> = {
  primary: "bg-volt text-carbon hover:bg-volt/90",
  secondary:
    "bg-transparent text-titanium border border-steel hover:border-titanium hover:bg-graphite",
  ghost: "bg-transparent text-titanium hover:bg-graphite",
};

const sizes: Record<Size, string> = {
  // 44px de altura mínima: alvo de toque confortável no celular.
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Mesmas variantes para quando o elemento precisa ser um link. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}
