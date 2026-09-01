"use client";

import Link from "next/link";
import { useToast } from "@/store/toast";

/**
 * Confirmação de que o produto entrou no carrinho.
 * Sem isso o cliente clica de novo e acaba com 2 unidades sem querer.
 *
 * role="status" (não "alert"): o leitor de tela anuncia sem interromper
 * o que a pessoa estiver fazendo.
 */
export function Toast() {
  const toast = useToast((s) => s.toast);
  const dismiss = useToast((s) => s.dismiss);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      /* bottom-20 no celular para não cobrir a StickyBuyBar. */
      className="animate-rise fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-md items-center gap-4 rounded-surface border border-steel bg-graphite px-4 py-3 text-titanium shadow-lg md:bottom-6"
      key={toast.id}
    >
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      {toast.actionHref && toast.actionLabel && (
        <Link
          href={toast.actionHref}
          onClick={dismiss}
          className="whitespace-nowrap text-sm font-bold underline underline-offset-4"
        >
          {toast.actionLabel}
        </Link>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar aviso"
        className="text-smoke transition-colors hover:text-titanium"
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
