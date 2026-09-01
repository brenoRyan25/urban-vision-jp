/**
 * O item guarda o mínimo. Nome, preço e imagem NÃO são copiados aqui.
 *
 * Motivo: o carrinho persiste no navegador. Se guardássemos o preço,
 * um cliente que voltasse duas semanas depois veria — e pediria — um
 * valor que a loja não pratica mais. Resolvendo o produto pelo catálogo
 * na renderização, o preço está sempre correto.
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** Item já cruzado com o catálogo, pronto para exibir. */
export interface ResolvedCartItem {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  image: string;
  unitPrice: number;
  lineTotal: number;
  available: boolean;
  /** Preço "de", só quando o produto está em oferta. Usado para somar o
   *  desconto total na mensagem do pedido — não afeta subtotal/total,
   *  que já são calculados sobre unitPrice (preço atual). */
  originalPrice?: number;
}
