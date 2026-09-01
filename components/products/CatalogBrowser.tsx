"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FilterBar } from "./FilterBar";
import { ProductGrid } from "./ProductGrid";
import { SortSelect } from "./SortSelect";
import { buttonClasses } from "@/components/ui/Button";
import { filterCatalog, getFacets, isSortSlug } from "@/lib/products";
import type { Product } from "@/types/product";

/**
 * Client Component: o site é exportado estático (GitHub Pages, sem
 * servidor), então não há como reprocessar a busca a cada mudança de
 * searchParams no servidor como antes. Filtra a lista inteira aqui,
 * no navegador — data/products.ts já é um array estático, então isso
 * não perde nada em relação à versão server-side.
 */
export function CatalogBrowser({
  products,
  facets,
}: {
  products: Product[];
  facets: Awaited<ReturnType<typeof getFacets>>;
}) {
  const searchParams = useSearchParams();

  const active = useMemo(() => {
    const sortParam = searchParams.get("ordem") ?? undefined;
    return {
      category: searchParams.get("categoria") ?? undefined,
      lens: searchParams.get("lente") ?? undefined,
      offers: searchParams.get("ofertas") === "1",
      sort: isSortSlug(sortParam) ? sortParam : "recentes",
    } as const;
  }, [searchParams]);

  const productList = useMemo(
    () =>
      filterCatalog(products, {
        category: active.category,
        lens: active.lens,
        offersOnly: active.offers,
        sort: active.sort,
      }),
    [products, active],
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        <FilterBar
          categories={facets.categories}
          lensColors={facets.lensColors}
          hasOffers={facets.hasOffers}
          active={active}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-steel pt-5">
          <p aria-live="polite" className="text-sm text-smoke">
            {productList.length === 1 ? "1 modelo" : `${productList.length} modelos`}
          </p>
          <SortSelect value={active.sort} active={active} />
        </div>
      </div>

      <div className="mt-8">
        {productList.length > 0 ? (
          <ProductGrid products={productList} />
        ) : (
          /* Estado vazio como direção, não como lamento:
             diz o que houve e oferece a saída. */
          <div className="rounded-surface border border-steel bg-graphite p-10 text-center">
            <p className="type-title text-xl">Nenhum modelo com esses filtros</p>
            <p className="type-body mx-auto mt-2 text-sm text-smoke">
              Tente afrouxar um dos filtros ou veja a linha completa.
            </p>
            <Link href="/catalogo" className={buttonClasses({ className: "mt-6" })}>
              Ver todos os modelos
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
