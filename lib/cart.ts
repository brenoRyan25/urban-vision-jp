import { roundMoney } from "@/lib/format";
import type { CartItem, ResolvedCartItem } from "@/types/cart";
import type { Product } from "@/types/product";

/**
 * Funções puras: recebem os itens salvos e o catálogo, devolvem o
 * carrinho pronto para exibir. Nenhuma importa data/products.ts.
 *
 * O catálogo desce do servidor por props — assim os dados de produto
 * não viram import dentro do bundle do cliente, e a troca por banco de
 * dados continua acontecendo num lugar só.
 */

export function resolveCartItems(
  items: CartItem[],
  products: Product[],
): { resolved: ResolvedCartItem[]; missingIds: string[] } {
  const byId = new Map(products.map((p) => [p.id, p]));
  const resolved: ResolvedCartItem[] = [];
  const missingIds: string[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      missingIds.push(item.productId);
      continue;
    }
    resolved.push({
      productId: product.id,
      quantity: item.quantity,
      name: product.name,
      slug: product.slug,
      image: product.image,
      unitPrice: product.price,
      lineTotal: roundMoney(product.price * item.quantity),
      available: product.available,
      originalPrice: product.originalPrice,
    });
  }

  return { resolved, missingIds };
}

/**
 * Soma as linhas já arredondadas, e não os preços brutos.
 * 159.90 * 3 dá 479.70000000000005 em ponto flutuante; somar os brutos
 * faria o total divergir da soma visível das linhas.
 */
export function calculateSubtotal(items: ResolvedCartItem[]): number {
  return roundMoney(items.reduce((sum, i) => sum + i.lineTotal, 0));
}

export function countPieces(items: ResolvedCartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Itens que ficaram indisponíveis depois de entrar no carrinho. */
export function unavailableItems(items: ResolvedCartItem[]): ResolvedCartItem[] {
  return items.filter((i) => !i.available);
}
