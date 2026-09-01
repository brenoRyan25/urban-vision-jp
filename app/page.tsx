import Link from "next/link";
import { BrandSection } from "@/components/home/BrandSection";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { TrustBar } from "@/components/home/TrustBar";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getFeaturedProducts, getOfferProducts, getProducts } from "@/lib/products";
import { store } from "@/config/store";

/** Homepage estática: nenhuma parte depende de requisição. */
export default async function Home() {
  const [offers, featured, all] = await Promise.all([
    getOfferProducts(4),
    getFeaturedProducts(4),
    getProducts(),
  ]);

  // >>> SUBSTITUIR pela foto principal da loja.
  const heroImage = all[0]?.image ?? "/products/juliette-black.webp";

  return (
    <main>
      <Hero heroImage={heroImage} />

      <Container className="py-8">
        <TrustBar />
      </Container>

      <ProductSection
        title="Top ofertas"
        subtitle="Enquanto durar o estoque."
        products={offers}
        href="/catalogo?ofertas=1"
        linkLabel="Ver todas as ofertas"
        editorial
      />

      <ProductSection
        title="Destaques"
        subtitle="Os modelos que mais saem."
        products={featured}
        href="/catalogo"
        linkLabel="Ver o catálogo"
      />

      <BrandSection />

      <section>
        <Container className="py-20 text-center md:py-28">
          <h2 className="type-display text-display-sm">
            Achou o seu?
          </h2>
          <p className="type-body mx-auto mt-4 text-smoke">
            Monte o pedido aqui. A gente confirma com você antes de
            despachar. Entregamos em {store.city} e região metropolitana.
          </p>
          <Link
            href="/catalogo"
            className={buttonClasses({ size: "lg", className: "mt-8" })}
          >
            Explorar catálogo
          </Link>
        </Container>
      </section>
    </main>
  );
}
