import {
  DEFAULT_JOAO_PESSOA_KM,
  deliveryConfig,
  distanceTable,
} from "@/config/delivery";
import { roundMoney } from "@/lib/format";
import { normalizeKey } from "@/lib/utils";

/**
 * Resultado discriminado, no mesmo padrão que lib/viacep.ts vai usar.
 * O TypeScript obriga a tratar todos os casos na UI, e cada um tem uma
 * mensagem diferente — "não entregamos aí" é diferente de "não sei calcular".
 */
export type DeliveryQuote =
  | { status: "free"; fee: 0; km: number | null; area: string | null }
  | { status: "priced"; fee: number; km: number; area: string }
  | { status: "on_request"; km: number | null; area: string | null }
  | { status: "unknown" };

interface QuoteInput {
  city: string;
  neighborhood: string;
  /** Subtotal dos produtos, sem a taxa. Decide o frete grátis. */
  subtotal: number;
}

interface ResolvedDistance {
  km: number;
  area: string;
  /** true quando caiu no fallback da cidade, sem precisão de bairro. */
  approximate: boolean;
}

/**
 * Três degraus de fallback, porque bairro novo e loteamento aparecem
 * o tempo todo e o checkout NUNCA pode travar por causa disso:
 *   1. cidade:bairro   (preciso)
 *   2. cidade          (aproximado)
 *   3. João Pessoa sem bairro mapeado -> média da cidade
 * Fora disso, devolve null e a taxa vira "a combinar".
 */
function resolveDistanceKm(
  city: string,
  neighborhood: string,
): ResolvedDistance | null {
  const c = normalizeKey(city);
  const n = normalizeKey(neighborhood);

  const exact = distanceTable[`${c}:${n}`];
  if (exact !== undefined) {
    return { km: exact, area: neighborhood, approximate: false };
  }

  const byCity = distanceTable[c];
  if (byCity !== undefined) {
    return { km: byCity, area: city, approximate: true };
  }

  if (c === "joao pessoa") {
    return {
      km: DEFAULT_JOAO_PESSOA_KM,
      area: neighborhood || city,
      approximate: true,
    };
  }

  return null;
}

/** Arredonda para cima no múltiplo de R$ 0,50 mais próximo. */
function roundFee(value: number): number {
  const step = deliveryConfig.roundToStep;
  return roundMoney(Math.round(value / step) * step);
}

/** taxa = max(minFee, baseFee + km * pricePerKm) */
export function calculateFee(km: number): number {
  const raw = deliveryConfig.baseFee + km * deliveryConfig.pricePerKm;
  return roundFee(Math.max(deliveryConfig.minFee, raw));
}

export function quoteDelivery({
  city,
  neighborhood,
  subtotal,
}: QuoteInput): DeliveryQuote {
  const resolved = resolveDistanceKm(city, neighborhood);

  // Resolve a distância ANTES de checar frete grátis, para conseguir
  // mostrar "Grátis (4 km)" e o cliente entender de onde veio.
  const km = resolved?.km ?? null;
  const area = resolved?.area ?? null;

  const cityAllowsFree = (
    deliveryConfig.freeAboveCities as readonly string[]
  ).includes(normalizeKey(city));

  if (cityAllowsFree && subtotal >= deliveryConfig.freeAbove) {
    return { status: "free", fee: 0, km, area };
  }

  if (resolved === null) return { status: "unknown" };

  if (resolved.km > deliveryConfig.maxRadiusKm) {
    return { status: "on_request", km, area };
  }

  return {
    status: "priced",
    fee: calculateFee(resolved.km),
    km: resolved.km,
    area: resolved.area,
  };
}

/**
 * Quanto falta para o frete grátis. Alavanca de ticket médio: exibido no
 * carrinho, faz o cliente com R$ 219 adicionar um segundo par para não
 * pagar entrega. Devolve null quando já atingiu ou quando não se aplica.
 */
export function remainingForFreeDelivery(subtotal: number): number | null {
  const missing = deliveryConfig.freeAbove - subtotal;
  return missing > 0 ? roundMoney(missing) : null;
}
