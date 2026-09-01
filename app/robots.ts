import type { MetadataRoute } from "next";
import { store } from "@/config/store";

// Exigido pelo output: "export" — confirma que essa rota não depende
// de nada em tempo de requisição, só pode ser gerada uma vez no build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nada a indexar nessas rotas, e o design-system é interno.
      disallow: ["/checkout", "/carrinho", "/design-system"],
    },
    sitemap: `${store.url}/sitemap.xml`,
  };
}
