import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "offer" | "neutral" | "soldOut" | "featured";

const tones: Record<Tone, string> = {
  offer: "bg-iridium text-white",
  neutral: "border border-steel bg-graphite text-titanium",
  soldOut: "bg-carbon text-titanium",
  featured: "border border-titanium/40 text-titanium",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1",
        "text-xs font-bold [font-stretch:112%] tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
