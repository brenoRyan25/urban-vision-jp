import type { Product } from "@/types/product";

/**
 * ============================================================
 * FONTE ÚNICA DOS PRODUTOS
 * ============================================================
 *
 * >>> É AQUI QUE VOCÊ MEXE. Nenhum componente contém dado de produto.
 *
 * Os 10 produtos abaixo são fictícios, só para a interface ter o que
 * mostrar. Substitua por completo pelos seus modelos reais.
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
 * 3. `slug` vira a URL (/produto/juliette-black). Só minúsculas, sem
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
    slug: "juliette-black",
    name: "Juliette Black",
    description:
      "Armação escovada em liga leve com lente polarizada. O modelo que abre a linha.",
    details:
      "Estrutura em liga leve com acabamento escovado que não marca digital. Lente polarizada com proteção UV400, feita para o sol forte do fim da tarde. Hastes com borracha antiderrapante nas pontas — segura mesmo com o rosto suado. Acompanha estojo rígido e flanela.",
    price: 149.9,
    originalPrice: 189.9,
    image: "/products/juliette-black.webp",
    images: ["/products/juliette-black.webp", "/products/juliette-black-2.webp"],
    category: "juliette",
    lensColor: "preta",
    featured: true,
    available: true,
    createdAt: "2026-08-12",
  },
  {
    id: "2",
    slug: "juliette-ruby",
    name: "Juliette Ruby",
    description:
      "Lente com coating vermelho espelhado. Para quem não quer passar despercebido.",
    details:
      "O coating ruby reflete a luz em vermelho profundo e escurece a visão de fora sem escurecer a de dentro. Armação em liga leve escovada, lente com proteção UV400. Acompanha estojo rígido e flanela.",
    price: 169.9,
    originalPrice: 209.9,
    image: "/products/juliette-ruby.webp",
    images: ["/products/juliette-ruby.webp", "/products/juliette-ruby-2.webp"],
    category: "juliette",
    lensColor: "ruby",
    featured: true,
    available: true,
    createdAt: "2026-08-10",
  },
  {
    id: "3",
    slug: "juliette-ice",
    name: "Juliette Ice",
    description:
      "Coating azul-gelo sobre armação prata. O contraste mais alto da linha.",
    details:
      "Armação prata escovada com lente de coating azul-gelo. Reflexo frio que muda de tom conforme o ângulo da luz. Proteção UV400 e hastes com ponta emborrachada. Acompanha estojo rígido e flanela.",
    price: 179.9,
    image: "/products/juliette-ice.webp",
    images: ["/products/juliette-ice.webp"],
    category: "juliette",
    lensColor: "ice",
    featured: true,
    available: true,
    createdAt: "2026-08-20",
  },
  {
    id: "4",
    slug: "juliette-violet",
    name: "Juliette Violet",
    description: "Coating iridescente que vira violeta na luz direta.",
    details:
      "O coating muda de violeta para azul conforme a incidência da luz. Armação grafite fosco, lente com proteção UV400. Acompanha estojo rígido e flanela.",
    price: 189.9,
    image: "/products/juliette-violet.webp",
    images: ["/products/juliette-violet.webp"],
    category: "juliette",
    lensColor: "violeta",
    available: true,
    createdAt: "2026-08-22",
  },
  {
    id: "5",
    slug: "juliette-gold",
    name: "Juliette Gold",
    description: "Armação e lente em tom dourado. Peça de acabamento quente.",
    details:
      "Acabamento dourado escovado na armação e na lente, com proteção UV400. O único modelo da linha em tom quente. Acompanha estojo rígido e flanela.",
    price: 199.9,
    originalPrice: 239.9,
    image: "/products/juliette-gold.webp",
    images: ["/products/juliette-gold.webp"],
    category: "juliette",
    lensColor: "dourada",
    available: true,
    createdAt: "2026-07-28",
  },
  {
    id: "6",
    slug: "juliette-white",
    name: "Juliette White",
    description: "Armação off-white com lente fumê. Leitura mais leve da linha.",
    details:
      "Armação off-white com lente fumê degradê, proteção UV400. Pesa menos que os modelos em liga escura. Acompanha estojo rígido e flanela.",
    price: 159.9,
    image: "/products/juliette-white.webp",
    images: ["/products/juliette-white.webp"],
    category: "juliette",
    lensColor: "fume",
    available: false,
    createdAt: "2026-07-15",
  },
  {
    id: "7",
    slug: "razor-sport",
    name: "Razor Sport",
    description:
      "Máscara única com lente verde. Para correr, pedalar e jogar bola.",
    details:
      "Lente única em curvatura ampla, campo de visão sem interrupção no centro. Estrutura flexível que não quebra ao torcer, ventilação nas laterais para não embaçar. Proteção UV400. Acompanha estojo semirrígido.",
    price: 139.9,
    originalPrice: 169.9,
    image: "/products/razor-sport.webp",
    images: ["/products/razor-sport.webp"],
    category: "esportivo",
    lensColor: "verde",
    featured: true,
    available: true,
    createdAt: "2026-08-18",
  },
  {
    id: "8",
    slug: "razor-sport-blue",
    name: "Razor Sport Blue",
    description: "Mesma estrutura do Razor, lente azul espelhada.",
    details:
      "Lente única azul espelhada com curvatura ampla. Estrutura flexível, ventilação lateral e proteção UV400. Acompanha estojo semirrígido.",
    price: 139.9,
    image: "/products/razor-sport-blue.webp",
    images: ["/products/razor-sport-blue.webp"],
    category: "esportivo",
    lensColor: "azul",
    available: true,
    createdAt: "2026-08-05",
  },
  {
    id: "9",
    slug: "arc-classic",
    name: "Arc Classic",
    description: "Formato arredondado com acetato grafite. Uso diário.",
    details:
      "Acetato grafite com dobradiça metálica reforçada. Formato arredondado que combina com rosto quadrado e anguloso. Lente fumê com proteção UV400. Acompanha estojo rígido e flanela.",
    price: 129.9,
    image: "/products/arc-classic.webp",
    images: ["/products/arc-classic.webp"],
    category: "classico",
    lensColor: "fume",
    available: true,
    createdAt: "2026-06-30",
  },
  {
    id: "10",
    slug: "arc-classic-tortoise",
    name: "Arc Classic Tortoise",
    description: "O Arc em acetato tartaruga, com lente marrom.",
    details:
      "Acetato tartaruga feito em camadas, então cada peça tem um desenho um pouco diferente. Dobradiça metálica reforçada e lente marrom com proteção UV400. Acompanha estojo rígido e flanela.",
    price: 129.9,
    originalPrice: 149.9,
    image: "/products/arc-classic-tortoise.webp",
    images: ["/products/arc-classic-tortoise.webp"],
    category: "classico",
    lensColor: "fume",
    available: true,
    createdAt: "2026-07-02",
  },
];
