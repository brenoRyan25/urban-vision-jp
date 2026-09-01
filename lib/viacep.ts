import { onlyDigits } from "@/lib/utils";
import type { AddressFromCep, ViaCepResponse } from "@/types/address";

/**
 * Resultado discriminado em vez de exceção.
 *
 * `throw` perderia a diferença entre "esse CEP não existe" (culpa de
 * digitação, mensagem específica) e "a API caiu" (não é culpa do
 * cliente, precisa liberar o preenchimento manual). O TypeScript ainda
 * obriga a interface a tratar todos os casos.
 */
export type CepResult =
  | { status: "success"; data: AddressFromCep }
  | { status: "invalid" }
  | { status: "not_found" }
  | { status: "unavailable" };

const CEP_LENGTH = 8;
const TIMEOUT_MS = 6000;

/** Cache em memória: redigitar o mesmo CEP não dispara nova requisição. */
const cache = new Map<string, AddressFromCep>();

export function isValidCepFormat(cep: string): boolean {
  const digits = onlyDigits(cep);
  // "00000000" passa no comprimento mas não existe; o ViaCEP o rejeita
  // com 400, o que já cai em "invalid" abaixo.
  return digits.length === CEP_LENGTH;
}

/**
 * O ViaCEP responde HTTP 200 mesmo para CEP inexistente, sinalizando com
 * `{ "erro": true }` — e em algumas respostas com a string "true".
 * Checar response.ok não basta.
 */
function isNotFound(payload: ViaCepResponse): boolean {
  return payload.erro === true || payload.erro === "true";
}

export async function getAddressByCep(
  cep: string,
  options?: { signal?: AbortSignal },
): Promise<CepResult> {
  const digits = onlyDigits(cep);

  if (digits.length !== CEP_LENGTH) return { status: "invalid" };

  const cached = cache.get(digits);
  if (cached) return { status: "success", data: cached };

  try {
    /* Combina o timeout com o AbortController de quem chamou: se o
       cliente corrigir o CEP, a requisição anterior é cancelada e não
       sobrescreve o endereço certo com o errado. */
    const signals = [AbortSignal.timeout(TIMEOUT_MS)];
    if (options?.signal) signals.push(options.signal);

    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: AbortSignal.any(signals),
      headers: { Accept: "application/json" },
    });

    // 400 = formato recusado pela própria API.
    if (response.status === 400) return { status: "invalid" };
    if (!response.ok) return { status: "unavailable" };

    const payload = (await response.json()) as ViaCepResponse;

    if (isNotFound(payload)) return { status: "not_found" };

    // Resposta 200 mas sem os campos esperados: trata como indisponível
    // em vez de preencher o formulário com undefined.
    if (typeof payload.localidade !== "string" || typeof payload.uf !== "string") {
      return { status: "unavailable" };
    }

    const data: AddressFromCep = {
      cep: digits,
      street: payload.logradouro ?? "",
      neighborhood: payload.bairro ?? "",
      city: payload.localidade,
      state: payload.uf,
    };

    cache.set(digits, data);
    return { status: "success", data };
  } catch {
    // Rede fora, timeout, JSON malformado ou requisição cancelada.
    return { status: "unavailable" };
  }
}

export const CEP_MESSAGES: Record<Exclude<CepResult["status"], "success">, string> = {
  invalid: "O CEP precisa ter 8 números.",
  not_found: "Não encontramos esse CEP. Confira os números ou preencha o endereço abaixo.",
  unavailable: "A busca de CEP está fora do ar. Pode preencher o endereço abaixo normalmente.",
};
