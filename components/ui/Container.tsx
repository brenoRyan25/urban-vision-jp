import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Largura máxima e respiro lateral únicos do projeto. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 md:px-8", className)}>
      {children}
    </div>
  );
}
