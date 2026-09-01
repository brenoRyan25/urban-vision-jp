"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { ResolvedCartItem } from "@/types/cart";

/** Usado na gaveta e na página. Um componente, dois containers. */
export function CartItemRow({
  item,
  onNavigate,
}: {
  item: ResolvedCartItem;
  onNavigate?: () => void;
}) {
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={`/produto/${item.slug}`}
        onClick={onNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-surface bg-steel/40"
      >
        <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/produto/${item.slug}`}
              onClick={onNavigate}
              className="type-title block truncate text-base hover:underline"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 text-sm text-smoke">
              {formatCurrency(item.unitPrice)} cada
            </p>
            {!item.available && (
              <Badge tone="soldOut" className="mt-1.5">
                Esgotado
              </Badge>
            )}
          </div>
          <p className="type-price shrink-0 text-base">
            {formatCurrency(item.lineTotal)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-pill border border-steel">
            <button
              type="button"
              onClick={() => decrement(item.productId)}
              aria-label={`Diminuir quantidade de ${item.name}`}
              className="flex size-9 items-center justify-center rounded-pill text-lg hover:bg-graphite"
            >
              −
            </button>
            {/* aria-live: quem usa leitor de tela ouve o novo número
                sem precisar navegar de volta até ele. */}
            <span
              aria-live="polite"
              className="type-price w-8 text-center text-sm"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(item.productId)}
              aria-label={`Aumentar quantidade de ${item.name}`}
              className="flex size-9 items-center justify-center rounded-pill text-lg hover:bg-graphite"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(item.productId)}
            className="text-sm font-semibold text-smoke underline underline-offset-4 hover:text-danger"
          >
            Remover
            <span className="sr-only"> {item.name} do carrinho</span>
          </button>
        </div>
      </div>
    </li>
  );
}
