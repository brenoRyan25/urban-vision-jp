"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CartItemRow } from "./CartItemRow";
import { EmptyCart } from "./EmptyCart";
import { FreeDeliveryHint } from "./FreeDeliveryHint";
import { buttonClasses } from "@/components/ui/Button";
import { calculateSubtotal, countPieces, resolveCartItems } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

/**
 * Gaveta em vez de navegar para a página: o cliente confere o carrinho
 * sem perder a posição de rolagem no catálogo. A página /carrinho
 * continua existindo — é o destino do link do toast e do "voltar".
 * Os dois usam os mesmos CartItemRow e resumo.
 *
 * Radix seria uma dependência inteira pelo foco preso; aqui são ~25
 * linhas de useEffect.
 */
export function CartDrawer({
  open,
  onClose,
  products,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const items = useCart((s) => s.items);
  const pruneMissing = useCart((s) => s.pruneMissing);
  const panelRef = useRef<HTMLDivElement>(null);

  const { resolved, missingIds } = resolveCartItems(items, products);
  const subtotal = calculateSubtotal(resolved);
  const pieces = countPieces(resolved);

  // Produto saiu do catálogo: some do carrinho em silêncio.
  useEffect(() => {
    if (missingIds.length > 0) pruneMissing(products.map((p) => p.id));
  }, [missingIds.length, products, pruneMissing]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      // Prende o foco dentro da gaveta enquanto ela estiver aberta.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-carbon/80 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-carbon",
          "transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-steel px-5 py-4">
          <h2 className="type-title text-lg">
            Carrinho
            {pieces > 0 && <span className="ml-2 text-smoke">{pieces}</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="flex size-10 items-center justify-center rounded-pill hover:bg-graphite"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {resolved.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyCart onNavigate={onClose} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-steel">
                {resolved.map((item) => (
                  <CartItemRow key={item.productId} item={item} onNavigate={onClose} />
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t border-steel bg-graphite px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <FreeDeliveryHint subtotal={subtotal} />

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-smoke">Subtotal</span>
                <span className="type-price text-xl">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-smoke">
                A taxa de entrega é calculada no checkout, pelo CEP.
              </p>

              <Link
                href="/checkout"
                onClick={onClose}
                className={buttonClasses({ size: "lg", fullWidth: true })}
              >
                Fechar pedido
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-semibold text-smoke underline underline-offset-4 hover:text-titanium"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
