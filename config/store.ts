/**
 * Fonte única das informações da loja.
 * Nenhum componente deve conter esses dados fixos.
 *
 * >>> AJUSTAR: todos os campos marcados com AJUSTAR abaixo.
 */

export const store = {
  name: "Urban Vision JP",
  shortName: "UVJP",
  tagline: "Óculos que mudam a leitura da rua.",
  description:
    "Óculos estilo Juliette em João Pessoa. Modelos selecionados, entrega na região metropolitana e pedido direto pelo WhatsApp.",

  city: "João Pessoa",
  state: "PB",

  /** >>> AJUSTAR: endereço completo da loja (aparece na opção Retirada). */
  address: {
    street: "Rua Exemplo",
    number: "000",
    neighborhood: "José Américo de Almeida",
    city: "João Pessoa",
    state: "PB",
    zip: "58073-000",
  },

  /** >>> AJUSTAR: horários reais. Exibidos quando o cliente escolhe Retirada. */
  pickupHours: "Segunda a sexta, 9h às 18h. Sábado, 9h às 13h.",

  /** >>> AJUSTAR: seu @ do Instagram. É o sinal de confiança mais forte de uma loja local. */
  instagram: "urbanvisionjp",

  /**
   * O número vem de variável de ambiente porque muda por ambiente
   * (produção, teste) e não deve ficar versionado no repositório.
   * Formato: código do país + DDD + número, só dígitos. Ex: 5583999999999
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

  /** >>> AJUSTAR: sua política real. Aparece na faixa de confiança antes do footer. */
  trust: {
    exchange: "Troca em até 7 dias",
    warranty: "Garantia de 90 dias contra defeito",
    responseTime: "Respondemos em minutos no horário comercial",
  },

  /**
   * Parcelamento. Deixado desligado até você confirmar as condições
   * da sua maquininha — anunciar parcela errada gera atrito na venda.
   * Quando ligar, o preço no card ganha "ou 3x de R$ 00,00".
   */
  installments: {
    enabled: false,
    maxCount: 3,
    minInstallmentValue: 30,
  },

  /**
   * URL de produção — usada em metadata, Open Graph e sitemap.
   * >>> AJUSTAR: troque SEU-USUARIO pelo seu usuário do GitHub.
   * Formato de página de projeto: https://usuario.github.io/urban-vision-jp
   */
  url: "https://SEU-USUARIO.github.io/urban-vision-jp",
} as const;

export type Store = typeof store;
