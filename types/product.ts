/**
 * Categorias como union type, e não `string`.
 * Um erro de digitação ("juliete") faria o produto sumir do filtro
 * em silêncio; assim o TypeScript pega no ato.
 */
export const CATEGORIES = [
  { slug: "juliet", label: "Juliet" },
  { slug: "esportivo", label: "Esportivos" },
  { slug: "classico", label: "Clássicos" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type Category = (typeof CATEGORIES)[number];

/**
 * Cor da lente. Numa loja onde quase tudo é juliet, esta é a decisão
 * real do cliente — muito mais do que a categoria. O filtro de cor e o
 * de categoria são derivados dos dados: cada um só aparece quando há
 * mais de um valor em uso. Ver getFacets() em lib/products.ts.
 */
export const LENS_COLORS = [
  { slug: "preta", label: "Preta", swatch: "#2B2F33" },
  { slug: "ruby", label: "Ruby", swatch: "#96283C" },
  { slug: "ice", label: "Ice", swatch: "#78C8DC" },
  { slug: "violeta", label: "Violeta", swatch: "#6C4CF1" },
  { slug: "dourada", label: "Dourada", swatch: "#B4965A" },
  { slug: "fume", label: "Fumê", swatch: "#787E84" },
  { slug: "verde", label: "Verde", swatch: "#50B478" },
  { slug: "azul", label: "Azul", swatch: "#3C78DC" },
] as const;

export type LensColorSlug = (typeof LENS_COLORS)[number]["slug"];
export type LensColor = (typeof LENS_COLORS)[number];

export interface Product {
  /** Único e estável. Nunca reaproveitar o id de um produto removido. */
  id: string;
  /** Usado na URL: /produto/juliet-black */
  slug: string;
  name: string;
  /** Curta — vai no card e na meta description. Máx. ~140 caracteres. */
  description: string;
  /** Longa — só na página do produto. Opcional. */
  details?: string;

  /** Sempre número. A formatação "R$ 149,90" acontece só na interface. */
  price: number;
  /**
   * Preço anterior. A PRESENÇA DESTE CAMPO é o que define uma oferta.
   * Não existe campo `isOffer` nem `discount`: ambos seriam uma segunda
   * fonte de verdade para a mesma informação e poderiam divergir do preço.
   * Ver isOffer() e getDiscountPercent() em lib/products.ts.
   */
  originalPrice?: number;

  /** Caminho em /public. Proporção 4:5 (ex.: 1200x1500). */
  image: string;
  /** Galeria da página do produto. A primeira deve repetir `image`. */
  images?: string[];

  category: CategorySlug;
  lensColor: LensColorSlug;
  /** Aparece na seção Destaques da homepage. */
  featured?: boolean;
  /** Obrigatório: opcional criaria produto em estado ambíguo. */
  available: boolean;
  /** ISO 8601. Necessário para a ordenação "Mais recentes". */
  createdAt: string;
}
