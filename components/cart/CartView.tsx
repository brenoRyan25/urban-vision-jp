"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CartItemRow } from "./CartItemRow";
import { EmptyCart } from "./EmptyCart";
import { FreeDeliveryHint } from "./FreeDeliveryHint";
import { buttonClasses } from "@/components/ui/Button";
import { calculateSubtotal, resolveCartItems, unavailableItems } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

export function CartView({ products }: { products: Product[] }) {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const pruneMissing = useCart((s) => s.pruneMissing);

  const { resolved, missingIds } = resolveCartItems(items, products);
  const subtotal = calculateSubtotal(resolved);
  const blocked = unavailableItems(resolved);

  useEffect(() => {
    if (missingIds.length > 0) pruneMissing(products.map((p) => p.id));
  }, [missingIds.length, products, pruneMissing]);

  // Espera a leitura do localStorage: sem isso o servidor renderizaria
  // "carrinho vazio" e o cliente veria o conteúdo piscar.
  if (!hydrated) {
    return (
      <div className="py-16 text-center text-smoke" role="status">
        Carregando carrinho...
      </div>
    );
  }

  if (resolved.length === 0) return <EmptyCart />;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
      <ul className="divide-y divide-steel border-y border-steel">
        {resolved.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </ul>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="flex flex-col gap-4 rounded-surface border border-steel bg-graphite p-5">
          <FreeDeliveryHint subtotal={subtotal} />

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-smoke">Subtotal</span>
            <span className="type-price text-2xl">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-smoke">
            A taxa de entrega é calculada no checkout, pelo CEP.
          </p>

          {blocked.length > 0 && (
            <p role="alert" className="rounded-surface bg-danger/5 p-3 text-sm text-danger">
              {blocked.map((i) => i.name).join(", ")} esgotou. Remova para
              continuar.
            </p>
          )}

          <Link
            href="/checkout"
            aria-disabled={blocked.length > 0}
            className={buttonClasses({
              size: "lg",
              fullWidth: true,
              className: blocked.length > 0 ? "pointer-events-none opacity-45" : "",
            })}
          >
            Fechar pedido
          </Link>

          <Link
            href="/catalogo"
            className="text-center text-sm font-semibold text-smoke underline underline-offset-4 hover:text-titanium"
          >
            Continuar comprando
          </Link>
        </div>
      </aside>
    </div>
  );
}
