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
    slug: "juliet-half-jacket",
    name: "Juliet Half Jacket",
    description:
      "Máscara esportiva branca com lente preta polarizada. Estrutura leve para quem não para quieto.",
    details:
      "Armação em nylon branco fosco com hastes emborrachadas em preto, feita pra ficar no rosto durante o treino sem escorregar. Lente preta polarizada com proteção UV400, curvatura ampla que dá campo de visão livre nas laterais. Estrutura flexível e resistente a impacto leve. Acompanha estojo rígido e flanela.",
    price: 89.99,
    image: "/products/juliet-half-jacket.webp",
    images: [
      "/products/juliet-half-jacket.webp",
      "/products/juliet-half-jacket-2.webp",
      "/products/juliet-half-jacket-3.webp",
    ],
    category: "juliet",
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
    featured: true,
    available: true,
    createdAt: "2026-09-05",
  },
];
