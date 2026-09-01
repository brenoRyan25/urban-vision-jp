import type { MetadataRoute } from "next";
import { store } from "@/config/store";
import { getProducts } from "@/lib/products";

// Exigido pelo output: "export" — confirma que essa rota não depende
// de nada em tempo de requisição, só pode ser gerada uma vez no build.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    { url: store.url, changeFrequency: "weekly", priority: 1 },
    { url: `${store.url}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${store.url}/produto/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
