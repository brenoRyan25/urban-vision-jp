import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="contents">
          {/* Só os 4 primeiros com priority: são os que disputam o LCP.
              Marcar todos anularia o efeito. */}
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}
