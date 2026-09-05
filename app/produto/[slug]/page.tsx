import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductPrice } from "@/components/products/ProductPrice";
import { StickyBuyBar } from "@/components/products/StickyBuyBar";
import { store } from "@/config/store";
import { deliveryConfig } from "@/config/delivery";
import { formatCurrency } from "@/lib/format";
import {
  getAllProductSlugs,
  getCatalog,
  getDiscountPercent,
  getProductBySlug,
} from "@/lib/products";
import { CATEGORIES, LENS_COLORS } from "@/types/product";

/** Gera todas as páginas de produto no build: HTML estático, sem servidor. */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Modelo não encontrado" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${formatCurrency(product.price)}`,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 1500, alt: product.name }],
    },
  };
}

const BUY_ANCHOR = "comprar";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const lens = LENS_COLORS.find((c) => c.slug === product.lensColor);
  const discount = getDiscountPercent(product);
  const images = product.images?.length ? product.images : [product.image];

  const related = (await getCatalog({ category: product.category }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  /** Dados estruturados: é o que faz o preço aparecer no Google. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${store.url}${product.image}`],
    brand: { "@type": "Brand", name: store.name },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "BRL",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${store.url}/produto/${product.slug}`,
    },
  };

  return (
    <main className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-6">
        <nav aria-label="Você está em" className="text-sm text-smoke">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-titanium">
                Início
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/catalogo" className="hover:text-titanium">
                Catálogo
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/catalogo?categoria=${category.slug}`}
                    className="hover:text-titanium"
                  >
                    {category.label}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={images}
            alt={`${product.name} — óculos ${lens?.label.toLowerCase() ?? ""} da ${store.name}`}
          />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {category && <Badge tone="neutral">{category.label}</Badge>}
              {lens && (
                <Badge tone="neutral">
                  <span
                    aria-hidden
                    className="mr-1.5 inline-block size-2.5 rounded-full border border-black/15 align-middle"
                    style={{ backgroundColor: lens.swatch }}
                  />
                  Lente {lens.label.toLowerCase()}
                </Badge>
              )}
              {discount !== null && product.available && (
                <Badge tone="offer">{discount}% menos</Badge>
              )}
              {!product.available && <Badge tone="soldOut">Esgotado</Badge>}
            </div>

            <h1 className="type-display mt-4 text-display-sm">{product.name}</h1>

            <p className="type-body mt-4 text-lg text-smoke">{product.description}</p>

            <ProductPrice product={product} size="lg" className="mt-6" />

            <div id={BUY_ANCHOR} className="mt-6">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                available={product.available}
                size="lg"
                fullWidth
              />
              {!product.available && (
                <p className="mt-3 text-sm text-smoke">
                  Esse modelo acabou. Avise-nos que chamamos você quando
                  voltar.
                </p>
              )}
            </div>

            {/* Informação de entrega no lugar onde a dúvida aparece:
                junto do botão de compra, não escondida no checkout. */}
            <div className="mt-6 rounded-surface border border-steel bg-graphite p-4 text-sm">
              <p className="font-semibold text-titanium">
                Entrega em {store.city} e região metropolitana
              </p>
              <p className="mt-1 text-smoke">
                Taxa a partir de {formatCurrency(deliveryConfig.minFee)}, calculada
                pelo CEP no checkout. Grátis acima de{" "}
                {formatCurrency(deliveryConfig.freeAbove)} em {store.city}.
              </p>
              <p className="mt-2 text-smoke">
                Retirada sem taxa em {store.address.neighborhood}.
              </p>
            </div>

            {product.details && (
              <div className="mt-8 border-t border-steel pt-8">
                <h2 className="type-title text-lg">Sobre esse modelo</h2>
                <p className="type-body mt-3 text-smoke">{product.details}</p>
              </div>
            )}
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <div className="border-t border-steel">
          <Container className="py-14">
            <h2 className="type-display text-2xl md:text-3xl">Da mesma linha</h2>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </Container>
        </div>
      )}

      <StickyBuyBar
        productId={product.id}
        productName={product.name}
        price={product.price}
        available={product.available}
        watchId={BUY_ANCHOR}
      />
    </main>
  );
}
