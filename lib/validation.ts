import { onlyDigits } from "@/lib/utils";
import type { DeliveryMethod } from "@/types/order";

/**
 * Validação em ~80 linhas, tipada.
 *
 * react-hook-form + zod pesam ~25 kB para oito campos e exigiriam mais
 * configuração do que este arquivo tem de código. Se o checkout crescer,
 * zod sozinho é a primeira dependência a entrar — o schema também
 * serviria para validar a resposta do ViaCEP.
 */

export interface CheckoutValues {
  name: string;
  phone: string;
  delivery: DeliveryMethod;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  notes: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

/** Celular brasileiro: 11 dígitos, o nono começando com 9. Fixo: 10. */
export function isValidPhone(phone: string): boolean {
  const d = onlyDigits(phone);
  if (d.length === 11) return d[2] === "9";
  return d.length === 10;
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Informe seu nome.";
  }

  if (!onlyDigits(values.phone)) {
    errors.phone = "Informe seu WhatsApp.";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Confira o número: precisa ter DDD e 8 ou 9 dígitos.";
  }

  // Retirada não exige nenhum campo de endereço.
  if (values.delivery === "delivery") {
    if (onlyDigits(values.cep).length !== 8) {
      errors.cep = "Informe um CEP com 8 números.";
    }
    if (!values.street.trim()) errors.street = "Informe a rua.";
    if (!values.number.trim()) errors.number = "Informe o número.";
    if (!values.neighborhood.trim()) errors.neighborhood = "Informe o bairro.";
    if (!values.city.trim()) errors.city = "Informe a cidade.";
    if (values.state.trim().length !== 2) errors.state = "UF com 2 letras.";
  }

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const emptyCheckout: CheckoutValues = {
  name: "",
  phone: "",
  delivery: "delivery",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  notes: "",
};
