import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false, follow: true },
};

/**
 * Server shell + ilha client. O catálogo é buscado aqui e desce por
 * props: os dados de produto não entram no bundle do cliente.
 */
export default async function CarrinhoPage() {
  const products = await getProducts();

  return (
    <main>
      <Container className="py-10 md:py-14">
        <h1 className="type-display text-display-sm">Carrinho</h1>
        <div className="mt-8">
          <CartView products={products} />
        </div>
      </Container>
    </main>
  );
}
