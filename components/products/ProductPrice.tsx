import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { getDiscountPercent, isOffer } from "@/lib/products";
import type { Product } from "@/types/product";

/**
 * Único lugar do projeto que renderiza preço.
 * O desconto é sempre derivado dos dois preços — nunca de um campo
 * armazenado, que poderia divergir.
 */
export function ProductPrice({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const offer = isOffer(product);
  const discount = getDiscountPercent(product);

  const sizes = {
    sm: { now: "text-base", was: "text-xs" },
    md: { now: "text-xl", was: "text-sm" },
    lg: { now: "text-3xl md:text-4xl", was: "text-base" },
  }[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      {offer && product.originalPrice && (
        <span className={cn("text-smoke line-through", sizes.was)}>
          {formatCurrency(product.originalPrice)}
        </span>
      )}
      <span className={cn("type-price", sizes.now, offer && "text-volt")}>
        {formatCurrency(product.price)}
      </span>
      {discount !== null && (
        <span className="text-xs font-bold text-volt">
          {discount}% menos
        </span>
      )}
      {/* Leitor de tela: sem isso, "R$ 189,90 R$ 149,90" sai sem contexto. */}
      <span className="sr-only">
        {offer && product.originalPrice
          ? `De ${formatCurrency(product.originalPrice)} por ${formatCurrency(product.price)}`
          : formatCurrency(product.price)}
      </span>
    </div>
  );
}
