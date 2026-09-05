import { products } from "@/data/products";
import {
  CATEGORIES,
  LENS_COLORS,
  type Category,
  type CategorySlug,
  type LensColor,
  type LensColorSlug,
  type Product,
} from "@/types/product";

/**
 * ÚNICA porta de entrada para os produtos.
 * Nenhum componente importa data/products.ts diretamente — se importar,
 * a migração para banco de dados quebra a interface inteira.
 *
 * Por que as funções são async se hoje só leem um array: para que a
 * assinatura não mude no dia em que a implementação virar uma consulta
 * ao banco. Server Components dão `await` naturalmente, então não há
 * custo. Se nascessem síncronas, migrar viraria refactor em cascata.
 */

/* ---------------- Predicados derivados ---------------- */

/**
 * Oferta é a PRESENÇA de um preço anterior maior que o atual.
 * Não existe campo booleano separado: ele permitiria o estado
 * "marcado como oferta mas sem preço anterior".
 */
export function isOffer(product: Product): boolean {
  return product.originalPrice !== undefined && product.originalPrice > product.price;
}

/** Percentual arredondado. Derivado, nunca armazenado. */
export function getDiscountPercent(product: Product): number | null {
  if (!isOffer(product) || !product.originalPrice) return null;
  const pct = (1 - product.price / product.originalPrice) * 100;
  return Math.round(pct);
}

/* ---------------- Ordenação ---------------- */

export const SORT_OPTIONS = [
  { slug: "recentes", label: "Mais recentes" },
  { slug: "menor-preco", label: "Menor preço" },
  { slug: "maior-preco", label: "Maior preço" },
  { slug: "ofertas", label: "Ofertas primeiro" },
] as const;

export type SortSlug = (typeof SORT_OPTIONS)[number]["slug"];

export function isSortSlug(value: string | undefined): value is SortSlug {
  return SORT_OPTIONS.some((o) => o.slug === value);
}

/**
 * Esgotado sempre vai para o fim, qualquer que seja a ordenação.
 * Manter um produto indisponível no topo por ser "o mais recente"
 * é o caminho mais rápido para o cliente desistir.
 */
function sortProducts(list: Product[], sort: SortSlug): Product[] {
  const byAvailability = (a: Product, b: Product) =>
    Number(b.available) - Number(a.available);

  const comparators: Record<SortSlug, (a: Product, b: Product) => number> = {
    recentes: (a, b) => b.createdAt.localeCompare(a.createdAt),
    "menor-preco": (a, b) => a.price - b.price,
    "maior-preco": (a, b) => b.price - a.price,
    ofertas: (a, b) => (getDiscountPercent(b) ?? -1) - (getDiscountPercent(a) ?? -1),
  };

  return [...list].sort((a, b) => byAvailability(a, b) || comparators[sort](a, b));
}

/* ---------------- Consultas ---------------- */

export async function getProducts(): Promise<Product[]> {
  return sortProducts(products, "recentes");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

/** Resolve vários ids de uma vez. Usado pelo carrinho. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const set = new Set(ids);
  return products.filter((p) => set.has(p.id));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return sortProducts(
    products.filter((p) => p.featured && p.available),
    "recentes",
  ).slice(0, limit);
}

export async function getOfferProducts(limit?: number): Promise<Product[]> {
  const list = sortProducts(products.filter((p) => isOffer(p) && p.available), "ofertas");
  return limit ? list.slice(0, limit) : list;
}

export async function getProductsByCategory(category: CategorySlug): Promise<Product[]> {
  return sortProducts(
    products.filter((p) => p.category === category),
    "recentes",
  );
}

/* ---------------- Catálogo com filtros ---------------- */

export interface CatalogQuery {
  category?: string;
  lens?: string;
  /** Filtro só de ofertas — o que o item "Ofertas" do menu aponta. */
  offersOnly?: boolean;
  sort?: SortSlug;
}

/**
 * Pura e síncrona de propósito: além de usada aqui no servidor, roda
 * também no navegador (CatalogBrowser filtra no cliente, já que o site
 * é exportado estático — sem servidor para reprocessar por CEP). Uma
 * função só, os dois lugares nunca divergem.
 */
export function filterCatalog(list: Product[], { category, lens, offersOnly, sort = "recentes" }: CatalogQuery): Product[] {
  let filtered = list;

  if (category) filtered = filtered.filter((p) => p.category === category);
  if (lens) filtered = filtered.filter((p) => p.lensColor === lens);
  if (offersOnly) filtered = filtered.filter((p) => isOffer(p));

  return sortProducts(filtered, sort);
}

export async function getCatalog(query: CatalogQuery): Promise<Product[]> {
  return filterCatalog(products, query);
}

/* ---------------- Facetas ---------------- */

export interface Facet<T> {
  value: T;
  count: number;
}

/**
 * Filtros derivados dos dados, não fixos no componente.
 *
 * Cada faceta só é devolvida se tiver produto, e a UI esconde a linha
 * inteira quando sobra uma opção só. Enquanto o estoque tiver uma única
 * linha, o filtro de categoria nem aparece — filtro com uma opção só é
 * fricção pura. Assim que entrar a segunda linha, ele aparece sozinho,
 * sem alterar código.
 */
export async function getFacets(): Promise<{
  categories: Facet<Category>[];
  lensColors: Facet<LensColor>[];
  hasOffers: boolean;
}> {
  const countBy = <T extends { slug: string }>(
    options: readonly T[],
    key: (p: Product) => string,
  ): Facet<T>[] =>
    options
      .map((value) => ({
        value,
        count: products.filter((p) => key(p) === value.slug).length,
      }))
      .filter((f) => f.count > 0);

  return {
    categories: countBy(CATEGORIES, (p) => p.category),
    lensColors: countBy(LENS_COLORS, (p) => p.lensColor),
    hasOffers: products.some(isOffer),
  };
}

/** Para generateStaticParams: gera as páginas de produto no build. */
export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}
