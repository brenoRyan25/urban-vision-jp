import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <svg viewBox="0 0 64 64" className="size-16 text-steel" fill="none" aria-hidden>
        <circle cx="21" cy="34" r="11" stroke="currentColor" strokeWidth="3" />
        <circle cx="43" cy="34" r="11" stroke="currentColor" strokeWidth="3" />
        <path d="M32 32h0M10 30l-6-6M54 30l6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="type-title mt-5 text-xl">Seu carrinho está vazio</p>
      <p className="type-body mt-2 text-sm text-smoke">
        Escolha um modelo e ele aparece aqui.
      </p>
      <Link
        href="/catalogo"
        onClick={onNavigate}
        className={buttonClasses({ className: "mt-6" })}
      >
        Explorar catálogo
      </Link>
    </div>
  );
}
