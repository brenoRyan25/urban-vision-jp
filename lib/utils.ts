import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes e resolve conflitos do Tailwind.
 * Sem twMerge, `cn("px-4", "px-6")` produziria as duas classes e o
 * resultado dependeria da ordem no CSS gerado — bug silencioso.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Remove tudo que não for dígito. "58000-000" -> "58000000" */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Minúsculas, sem acento, espaços colapsados. Usado nas chaves de entrega. */
export function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
