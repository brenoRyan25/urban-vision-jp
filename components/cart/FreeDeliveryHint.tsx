import { deliveryConfig } from "@/config/delivery";
import { formatCurrency } from "@/lib/format";
import { remainingForFreeDelivery } from "@/lib/delivery";
import { store } from "@/config/store";

/**
 * Alavanca de ticket médio: o cliente com R$ 219 no carrinho adiciona um
 * segundo par para não pagar entrega. É a intervenção mais barata que
 * existe para aumentar o valor do pedido.
 */
export function FreeDeliveryHint({ subtotal }: { subtotal: number }) {
  const missing = remainingForFreeDelivery(subtotal);
  const progress = Math.min(100, (subtotal / deliveryConfig.freeAbove) * 100);

  if (missing === null) {
    return (
      <p className="rounded-surface bg-iridium/15 px-3 py-2.5 text-sm font-semibold text-iridium">
        Entrega grátis em {store.city}
      </p>
    );
  }

  return (
    <div className="rounded-surface bg-graphite px-3 py-2.5">
      <p className="text-sm text-titanium">
        Faltam <strong>{formatCurrency(missing)}</strong> para entrega grátis em{" "}
        {store.city}
      </p>
      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-pill bg-steel"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso para entrega grátis"
      >
        <div
          className="h-full rounded-pill bg-iridium transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
