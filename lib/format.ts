import { onlyDigits } from "./utils";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** formatCurrency(149.9) -> "R$ 149,90" */
export function formatCurrency(value: number): string {
  return BRL.format(value);
}

/**
 * Arredonda para 2 casas de forma segura.
 * 159.90 * 3 dá 479.70000000000005 em ponto flutuante; sem isso, o total
 * do carrinho pode divergir em um centavo da soma das linhas.
 */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** formatCep("58000000") -> "58000-000". Devolve a entrada se incompleta. */
export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** formatPhone("83999999999") -> "(83) 99999-9999". Aceita fixo e celular. */
export function formatPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** "6" -> "6 km" · "0.5" -> "menos de 1 km" */
export function formatDistance(km: number): string {
  if (km < 1) return "menos de 1 km";
  return `${km} km`;
}
