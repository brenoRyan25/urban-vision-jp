"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

/**
 * Zustand em vez de Context API.
 *
 * Com Context, todo consumidor re-renderiza a cada mudança: o badge do
 * header, o drawer, a página do carrinho e cada botão "adicionar" se
 * inscrevem no mesmo objeto, então aumentar a quantidade de um item
 * re-renderiza tudo. Aqui o consumo é por seletor:
 *
 *   const count = useCart((s) => s.items.length)   // só isso re-renderiza
 *
 * São 1,2 kB e dispensam Provider — o que também evita empurrar a
 * fronteira "use client" para o topo da árvore no layout.
 */

const MAX_QUANTITY_PER_ITEM = 10;

interface CartState {
  items: CartItem[];
  /**
   * localStorage não existe no servidor, então o primeiro render do
   * cliente precisa bater com o HTML do servidor. Quem lê o carrinho
   * espera esta flag antes de mostrar número — sem isso, erro de
   * hidratação em produção no primeiro dia.
   */
  hydrated: boolean;

  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  /** Remove itens que saíram do catálogo. Chamado ao resolver o carrinho. */
  pruneMissing: (validIds: string[]) => void;
}

/**
 * localStorage é síncrono, então o zustand chama onRehydrateStorage
 * ainda durante a execução de create() abaixo — antes de `useCart` ser
 * atribuída. Referenciar `useCart` dentro do callback lança
 * "Cannot access 'useCart' before initialization", erro que o zustand
 * engole em silêncio: os itens chegam a ser lidos do storage, mas
 * `hydrated` nunca vira true e a tela fica presa em "Carregando...".
 * Por isso capturamos `set` aqui, fora do binding `useCart`.
 */
let setCartState: ((partial: Partial<CartState>) => void) | null = null;

export const useCart = create<CartState>()(
  persist(
    (set) => {
      setCartState = set;
      return {
        items: [],
        hydrated: false,

        add: (productId, quantity = 1) =>
          set((state) => {
            const existing = state.items.find((i) => i.productId === productId);
            if (!existing) {
              return { items: [...state.items, { productId, quantity }] };
            }
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, MAX_QUANTITY_PER_ITEM),
                    }
                  : i,
              ),
            };
          }),

        remove: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          })),

        setQuantity: (productId, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              return { items: state.items.filter((i) => i.productId !== productId) };
            }
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM) }
                  : i,
              ),
            };
          }),

        increment: (productId) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY_PER_ITEM) }
                : i,
            ),
          })),

        decrement: (productId) =>
          set((state) => ({
            items: state.items
              .map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
              )
              .filter((i) => i.quantity > 0),
          })),

        clear: () => set({ items: [] }),

        pruneMissing: (validIds) =>
          set((state) => {
            const valid = new Set(validIds);
            const kept = state.items.filter((i) => valid.has(i.productId));
            return kept.length === state.items.length ? state : { items: kept };
          }),
      };
    },
    {
      name: "uvjp-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      /**
       * Versionado desde já: quando o formato de CartItem mudar, um
       * carrinho antigo no navegador do cliente seria lido como lixo.
       * Descartar é mais seguro do que tentar interpretar.
       */
      migrate: () => ({ items: [] }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => () => {
        setCartState?.({ hydrated: true });
      },
    },
  ),
);

/* ---------------- Seletores ---------------- */

/** Total de peças no carrinho. Usado pelo badge do header. */
export const selectTotalQuantity = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectQuantityOf = (productId: string) => (state: CartState) =>
  state.items.find((i) => i.productId === productId)?.quantity ?? 0;
