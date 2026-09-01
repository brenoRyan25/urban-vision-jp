import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductSection({
  title,
  subtitle,
  products,
  href,
  linkLabel,
  dark,
  editorial,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href: string;
  linkLabel: string;
  dark?: boolean;
  /** Drop editorial: primeiro item em destaque, resto ao redor — em vez
   *  da grade uniforme. Reservado para "Top ofertas": uma coleção se
   *  apresenta, o catálogo se navega — os dois pedem layouts diferentes. */
  editorial?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section className={dark ? "bg-carbon text-titanium" : undefined}>
      <Container className="py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="type-display text-display-sm">{title}</h2>
            {subtitle && (
              <p className={dark ? "mt-2 text-titanium/60" : "mt-2 text-smoke"}>
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={href}
            className="text-sm font-semibold underline underline-offset-4 hover:opacity-70"
          >
            {linkLabel}
          </Link>
        </div>

        <div className="mt-8">
          {editorial ? (
            <ul
              className={cn(
                "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]",
                "sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0",
                "lg:grid-cols-4 lg:grid-flow-dense",
              )}
            >
              {products.map((product, index) => (
                <li
                  key={product.id}
                  className={cn(
                    "w-[78vw] shrink-0 sm:w-auto",
                    index === 0 && "sm:col-span-2 sm:row-span-2",
                  )}
                >
                  <ProductCard product={product} priority={index < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Container>
    </section>
  );
}
