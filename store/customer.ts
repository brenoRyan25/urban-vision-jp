"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Dados do cliente salvos separadamente do carrinho.
 *
 * Cliente recorrente é o melhor cliente, e redigitar nome, telefone e
 * endereço a cada pedido é a fricção mais cara do checkout. Com isso, um
 * pedido repetido vira três toques.
 *
 * Fica só no navegador da própria pessoa — nada é enviado a servidor.
 */
export interface SavedCustomer {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CustomerState {
  data: SavedCustomer | null;
  save: (data: SavedCustomer) => void;
  forget: () => void;
}

export const useCustomer = create<CustomerState>()(
  persist(
    (set) => ({
      data: null,
      save: (data) => set({ data }),
      forget: () => set({ data: null }),
    }),
    {
      name: "uvjp-customer",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
