import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "./AddToCartButton";
import { ProductPrice } from "./ProductPrice";
import { getDiscountPercent, isOffer } from "@/lib/products";
import { cn, withBasePath } from "@/lib/utils";
import { CATEGORIES, LENS_COLORS, type Product } from "@/types/product";

/**
 * Server Component. Nada aqui é hidratado — só o AddToCartButton.
 *
 * `priority` deve ser true apenas nos primeiros cards visíveis: é o que
 * antecipa o carregamento da maior imagem da dobra (LCP) sem competir
 * com as imagens de baixo.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const offer = isOffer(product);
  const discount = getDiscountPercent(product);
  const lens = LENS_COLORS.find((c) => c.slug === product.lensColor);
  const category = CATEGORIES.find((c) => c.slug === product.category);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-surface border border-steel bg-graphite",
        "transition-colors hover:border-titanium/40",
        !product.available && "opacity-60",
      )}
    >
      {/* Fio iridescente: um dos três únicos lugares onde ele aparece. */}
      {offer && product.available && <div className="iridescent-line h-0.5 w-full" />}

      {/* Div, não <Link>, porque o botão de comprar mora aqui do lado do
          link da foto — os dois precisam ser irmãos, não um <button>
          dentro de um <a>. */}
      <div className="relative aspect-4/5 overflow-hidden bg-steel/30">
        <Link href={`/produto/${product.slug}`} className="absolute inset-0 block">
          <Image
            src={withBasePath(product.image)}
            alt={`${product.name} — óculos ${lens?.label.toLowerCase() ?? ""} da Urban Vision JP`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Marcas de mira nos cantos — o "Vision" da marca, sutil, só no
            hover/foco. Reaparece em outras telas de produto: é a
            assinatura visual junto do fio iridescente. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <span className="absolute left-0 top-0 size-4 border-l border-t border-iridium" />
          <span className="absolute right-0 top-0 size-4 border-r border-t border-iridium" />
          <span className="absolute bottom-0 left-0 size-4 border-b border-l border-iridium" />
          <span className="absolute bottom-0 right-0 size-4 border-b border-r border-iridium" />
        </span>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-2">
          {discount !== null && product.available && (
            <Badge tone="offer">{discount}% menos</Badge>
          )}
          {!product.available && <Badge tone="soldOut">Esgotado</Badge>}
        </div>

        {/* z-10: fica acima do ::after do link do nome (cobre o card
            inteiro), senão o botão não recebe clique. */}
        <div className="absolute bottom-3 right-3 z-10">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            available={product.available}
            size="sm"
            iconOnly
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {category && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-smoke">
            {category.label}
          </p>
        )}
        <h3 className="type-title text-lg">
          <Link
            href={`/produto/${product.slug}`}
            /* Área de clique cobre o card inteiro sem aninhar links. */
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-1">
          <ProductPrice product={product} />
        </div>
      </div>
    </article>
  );
}
