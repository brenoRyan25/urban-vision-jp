/**
 * ENTREGA — parâmetros e tabela de distâncias.
 *
 * Este arquivo é só dado. A lógica de cálculo fica em lib/delivery.ts.
 *
 * Por que tabela e não API de rotas:
 * o ViaCEP não devolve latitude/longitude, então calcular km real exigiria
 * uma segunda API (Google, Mapbox) com chave, custo por requisição, backend
 * para proteger a chave e mais um ponto de falha no checkout. A tabela dá o
 * mesmo resultado, instantânea e de graça. A fórmula de precificação continua
 * sendo "por km" — só a origem do km muda. No dia em que o volume justificar,
 * troca-se resolveDistanceKm() por uma chamada de API sem alterar a UI.
 */

export const deliveryConfig = {
  /** Origem de todas as distâncias. */
  originNeighborhood: "José Américo de Almeida",
  originCity: "João Pessoa",

  /** taxa = max(minFee, baseFee + km * pricePerKm), arredondada. */
  minFee: 8,
  baseFee: 5,
  pricePerKm: 1.2,

  /** Arredonda para o próximo múltiplo de R$ 0,50. */
  roundToStep: 0.5,

  /**
   * Acima disso a taxa passaria de R$ 41 e inviabilizaria a venda.
   * O pedido continua sendo aceito: a taxa vira "a combinar".
   */
  maxRadiusKm: 30,

  /** Frete grátis a partir deste subtotal. */
  freeAbove: 299,

  /**
   * Frete grátis só dentro de João Pessoa. Gratuito para Cabedelo (22 km)
   * consumiria a margem inteira de um par.
   */
  freeAboveCities: ["joao pessoa"],
} as const;

/**
 * DISTÂNCIA RODOVIÁRIA APROXIMADA (km) A PARTIR DE JOSÉ AMÉRICO.
 *
 * Chaves normalizadas: minúsculas, sem acento.
 *   "cidade:bairro"  → precisão por bairro (João Pessoa)
 *   "cidade"         → fallback quando o bairro não está mapeado
 *
 * >>> AJUSTAR: confira no Google Maps os bairros onde você mais vende
 *     e corrija os valores. Os demais podem ficar como estão — o erro de
 *     1 km custa R$ 1,20 na taxa.
 */
export const distanceTable: Record<string, number> = {
  // ---- João Pessoa · zona sul/sudeste (próxima da loja) ----
  "joao pessoa:jose americo de almeida": 1,
  "joao pessoa:ernesto geisel": 2,
  "joao pessoa:cidade verde": 2,
  "joao pessoa:costa e silva": 3,
  "joao pessoa:cristo redentor": 3,
  "joao pessoa:funcionarios": 3,
  "joao pessoa:joao paulo ii": 4,
  "joao pessoa:mangabeira": 4,
  "joao pessoa:bancarios": 4,
  "joao pessoa:jardim sao paulo": 4,
  "joao pessoa:agua fria": 4,
  "joao pessoa:anatolia": 5,
  "joao pessoa:cuia": 5,
  "joao pessoa:grotao": 5,
  "joao pessoa:valentina figueiredo": 5,
  "joao pessoa:jardim cidade universitaria": 5,
  "joao pessoa:castelo branco": 6,
  "joao pessoa:planalto boa esperanca": 6,
  "joao pessoa:cidade dos colibris": 6,
  "joao pessoa:jardim veneza": 6,

  // ---- João Pessoa · centro e eixo oeste ----
  "joao pessoa:cruz das armas": 6,
  "joao pessoa:oitizeiro": 7,
  "joao pessoa:varjao": 7,
  "joao pessoa:rangel": 7,
  "joao pessoa:jaguaribe": 7,
  "joao pessoa:torre": 7,
  "joao pessoa:expedicionarios": 7,
  "joao pessoa:estados": 7,
  "joao pessoa:centro": 8,
  "joao pessoa:tambia": 8,
  "joao pessoa:trincheiras": 8,
  "joao pessoa:treze de maio": 8,
  "joao pessoa:pedro gondim": 8,
  "joao pessoa:bairro das industrias": 8,
  "joao pessoa:alto do mateus": 9,
  "joao pessoa:roger": 9,
  "joao pessoa:padre ze": 9,
  "joao pessoa:varadouro": 9,
  "joao pessoa:distrito industrial": 9,
  "joao pessoa:ilha do bispo": 10,
  "joao pessoa:mandacaru": 10,

  // ---- João Pessoa · sul distante ----
  "joao pessoa:gramame": 8,
  "joao pessoa:paratibe": 9,
  "joao pessoa:mucumagro": 9,
  "joao pessoa:mussure": 10,
  "joao pessoa:barra de gramame": 12,

  // ---- João Pessoa · orla (mais caro a partir de José Américo) ----
  "joao pessoa:portal do sol": 7,
  "joao pessoa:altiplano cabo branco": 8,
  "joao pessoa:miramar": 8,
  "joao pessoa:tambauzinho": 8,
  "joao pessoa:brisamar": 10,
  "joao pessoa:manaira": 10,
  "joao pessoa:tambau": 10,
  "joao pessoa:cabo branco": 10,
  "joao pessoa:penha": 10,
  "joao pessoa:aeroclube": 11,
  "joao pessoa:joao agripino": 11,
  "joao pessoa:bessa": 12,
  "joao pessoa:jardim oceania": 12,
  "joao pessoa:ponta do seixas": 12,

  // ---- Região metropolitana · fallback por cidade ----
  "bayeux": 14,
  "santa rita": 17,
  "conde": 18,
  "cabedelo": 22,
  "cabedelo:intermares": 19,
  "cabedelo:ponta de campina": 26,
  "conde:jacuma": 28,
  "conde:carapibus": 30,

  // Acima do raio de 30 km → taxa a combinar, não entram na tabela:
  // Lucena, Alhandra, Cruz do Espírito Santo, Sapé, Pitimbu,
  // Caaporã, Mamanguape, Rio Tinto, Pedras de Fogo.
};

/** Fallback quando João Pessoa é a cidade mas o bairro não está mapeado. */
export const DEFAULT_JOAO_PESSOA_KM = 8;
