import type { Product } from "@/types/product";

/**
 * ============================================================
 * FONTE ÚNICA DOS PRODUTOS
 * ============================================================
 *
 * >>> É AQUI QUE VOCÊ MEXE. Nenhum componente contém dado de produto.
 *
 * COMO CADASTRAR UM PRODUTO
 *
 * 1. Coloque as fotos em public/products/ no formato .webp, recorte
 *    4:5 vertical (1200x1500). Fundo neutro claro, mesma distância e
 *    mesmo enquadramento em todos os modelos — é isso que faz a grade
 *    parecer curada.
 * 2. `id` precisa ser único e nunca mudar. Se apagar um produto, não
 *    reaproveite o id: carrinhos salvos no navegador do cliente apontam
 *    para ele.
 * 3. `slug` vira a URL (/produto/juliet-black). Só minúsculas, sem
 *    acento, separado por hífen. Mudar o slug quebra links já enviados.
 * 4. OFERTA: basta preencher `originalPrice` com o preço antigo. Não
 *    existe campo "isOffer" nem "discount" — o desconto é calculado a
 *    partir dos dois preços, então nunca fica divergente.
 * 5. `available: false` deixa o produto visível, mas esgotado e no fim
 *    da lista. Produto esgotado também comunica que a loja vende.
 * 6. `featured: true` coloca na seção de destaques da home. Use em 3 a 4
 *    produtos; destacar tudo é destacar nada.
 * 7. `createdAt` alimenta a ordenação "Mais recentes". Use a data em que
 *    o modelo entrou no estoque.
 * 8. Preço sempre número: 149.9, nunca "R$ 149,90".
 */

export const products: Product[] = [
  {
    id: "1",
    slug: "half-jacket",
    name: "Half Jacket",
    description:
      "Máscara esportiva branca com lente preta polarizada. Estrutura leve para quem não para quieto.",
    details:
      "Armação em nylon branco fosco com hastes emborrachadas em preto, feita pra ficar no rosto durante o treino sem escorregar. Lente preta polarizada com proteção UV400, curvatura ampla que dá campo de visão livre nas laterais. Estrutura flexível e resistente a impacto leve. Acompanha estojo rígido e flanela.",
    price: 89.99,
    image: "/products/half-jacket.webp",
    images: [
      "/products/half-jacket.webp",
      "/products/half-jacket-2.webp",
      "/products/half-jacket-3.webp",
    ],
    category: "half-jacket",
    lensColor: "preta",
    featured: true,
    available: true,
    createdAt: "2026-09-05",
  },
  {
    id: "2",
    slug: "juliet-ruby",
    name: "Juliet Ruby",
    description:
      "Armação metálica com lente ruby espelhada. A peça mais chamativa da linha.",
    details:
      "Estrutura em metal com acabamento envelhecido e lente ruby espelhada, que reflete em vermelho profundo e escurece a visão de fora sem escurecer a de dentro. Encaixe curto e justo, pensado pra quem gosta de um estilo mais retrô e ousado. Proteção UV400. Acompanha estojo rígido e flanela.",
    price: 99.99,
    image: "/products/juliet-ruby.webp",
    images: [
      "/products/juliet-ruby.webp",
      "/products/juliet-ruby-2.webp",
      "/products/juliet-ruby-3.webp",
    ],
    category: "juliet",
    lensColor: "ruby",
    featured: false,
    available: true,
    createdAt: "2026-09-05",
  },
  {
    id: "3",
    slug: "juliet-ducati",
    name: "Juliet Ducati",
    description:
      "Armação em metal preto fosco com detalhes em vermelho e lente preta. A combinação mais pedida da linha Juliet.",
    details:
      "Estrutura em metal preto fosco com acabamento em borracha vermelha nas plaquetas de nariz e ponta das hastes — o colorway Ducati da linha. Lente preta com proteção UV400 e encaixe curto, no estilo clássico X-Metal. Acompanha estojo rígido e flanela.",
    price: 99.99,
    image: "/products/juliet-ducati.webp",
    images: ["/products/juliet-ducati.webp"],
    category: "juliet",
    lensColor: "preta",
    featured: true,
    available: true,
    createdAt: "2026-09-05",
  },
  {
    id: "4",
    slug: "permian-brown",
    name: "Permian Brown",
    description:
      "Armação preta brilhante com lente marrom. Visual mais discreto, sem perder o esporte.",
    details:
      "Estrutura em nylon preto brilhante com hastes emborrachadas e lente marrom, que segura bem em dias de luz mais baixa sem escurecer demais a visão. Proteção UV400. Acompanha estojo rígido e flanela.",
    price: 99.9,
    image: "/products/permian-brown.webp",
    images: ["/products/permian-brown.webp"],
    category: "permian",
    lensColor: "marrom",
    featured: false,
    available: true,
    createdAt: "2026-09-05",
  },
  {
    id: "5",
    slug: "penny-cooper",
    name: "Penny Cooper",
    description:
      "Armação compacta em metal cor cobre com lente ruby espelhada. O tamanho menor da linha, mesmo acabamento X-Metal.",
    details:
      "Estrutura em metal com acabamento cobre (colorway Cooper) e lente ruby espelhada. Encaixe mais compacto que a Juliet, indicado pra quem acha a Juliet grande no rosto. Proteção UV400. Acompanha estojo rígido e flanela.",
    price: 99.9,
    image: "/products/penny-cooper.webp",
    images: ["/products/penny-cooper.webp"],
    category: "penny",
    lensColor: "ruby",
    featured: true,
    available: true,
    createdAt: "2026-09-05",
  },
  {
    id: "6",
    slug: "juliet-side-blinders",
    name: "Juliet Side Blinders",
    description:
      "Juliet clássica em preto com blinders laterais. Bloqueia a luz que entra pelas bordas da lente.",
    details:
      "Mesma estrutura X-Metal preta da Juliet, com os side blinders encaixados — as abas laterais que fecham a entrada de luz pelas bordas da lente. Lente preta com proteção UV400. Acompanha estojo rígido e flanela.",
    price: 169.99,
    image: "/products/juliet-side-blinders.webp",
    images: ["/products/juliet-side-blinders.webp"],
    category: "juliet",
    lensColor: "preta",
    featured: true,
    available: true,
    createdAt: "2026-09-05",
  },
];
