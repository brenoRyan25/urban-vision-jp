import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { CatalogBrowser } from "@/components/products/CatalogBrowser";
import { getFacets, getProducts } from "@/lib/products";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Todos os modelos da ${store.name}. Óculos de sol com entrega em ${store.city} e região metropolitana.`,
  alternates: { canonical: "/catalogo" },
};

/**
 * Server Component só para o título estático e para buscar os dados
 * uma vez. O filtro em si roda no cliente — ver CatalogBrowser.
 */
export default async function CatalogoPage() {
  const [products, facets] = await Promise.all([getProducts(), getFacets()]);

  return (
    <main>
      <div className="bg-carbon text-titanium">
        <Container className="py-14 md:py-20">
          <h1 className="type-display text-display-md">Catálogo</h1>
          <p className="type-body mt-4 text-titanium/70">
            {facets.categories.length > 1
              ? "Vários modelos, todos com proteção UV400."
              : "Toda a coleção, com proteção UV400."}
          </p>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogBrowser products={products} facets={facets} />
        </Suspense>
      </Container>
    </main>
  );
}

/** Só o formato geral, pra não pular o layout enquanto useSearchParams resolve. */
function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/5" />
        ))}
      </div>
    </div>
  );
}
