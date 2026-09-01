import type { Address } from "./address";
import type { ResolvedCartItem } from "./cart";

export type PaymentMethod = "pix" | "cash" | "card";
export type DeliveryMethod = "delivery" | "pickup";

export interface Customer {
  name: string;
  /** Só dígitos. A formatação (83) 99999-9999 acontece na UI. */
  phone: string;
}

interface OrderBase {
  /** Identificador curto para você citar na conversa. Ex.: UV-K3M9 */
  reference: string;
  items: ResolvedCartItem[];
  subtotal: number;
  total: number;
  customer: Customer;
  payment: PaymentMethod;
  notes?: string;
}

/**
 * União discriminada: o TypeScript impede acessar `address` ou
 * `deliveryFee` num pedido de retirada. Sem isso, um endereço vazio
 * poderia vazar para a mensagem do WhatsApp.
 */
export type Order =
  | (OrderBase & {
      delivery: "pickup";
    })
  | (OrderBase & {
      delivery: "delivery";
      address: Address;
      /** null quando a taxa ficou "a combinar". */
      deliveryFee: number | null;
      deliveryDistanceKm: number | null;
    });
