import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Toast } from "@/components/ui/Toast";
import { store } from "@/config/store";
import { getProducts } from "@/lib/products";
import "./globals.css";

/**
 * Uma família só, dois eixos.
 * Archivo variable expõe o eixo de LARGURA (wdth): display em 125%
 * (expandido) e corpo em 100%. O contraste da marca vem da largura,
 * não de uma segunda fonte — mais leve e mais coeso.
 * next/font hospeda os arquivos no próprio domínio: sem requisição
 * externa e sem layout shift.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: {
    default: `${store.name} — ${store.tagline}`,
    template: `%s · ${store.name}`,
  },
  description: store.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: store.name,
    title: `${store.name} — ${store.tagline}`,
    description: store.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0f11",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* O catálogo desce por props para a gaveta do carrinho conseguir
     resolver os itens salvos sem importar data/products.ts no cliente. */
  const products = await getProducts();

  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <Header products={products} />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
        <Toast />
      </body>
    </html>
  );
}
