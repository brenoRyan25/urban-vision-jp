import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const products = await getProducts();

  return (
    <main>
      <Container className="py-10 md:py-14">
        <h1 className="type-display text-display-sm">Finalizar pedido</h1>
        <p className="type-body mt-3 text-smoke">
          Preencha os dados, escolha pagamento e entrega, e revise tudo antes
          de confirmar.
        </p>
        <div className="mt-10">
          <CheckoutForm products={products} />
        </div>
      </Container>
    </main>
  );
}
