"use client";

import { create } from "zustand";

/**
 * Toast em ~30 linhas. Uma biblioteca (sonner, react-hot-toast) traria
 * posicionamento, empilhamento e fila que não usaríamos: aqui existe uma
 * mensagem por vez, sempre disparada pela mesma ação.
 */
export interface ToastPayload {
  id: number;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

interface ToastState {
  toast: ToastPayload | null;
  show: (payload: Omit<ToastPayload, "id">) => void;
  dismiss: () => void;
}

let counter = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>()((set) => ({
  toast: null,
  show: (payload) => {
    counter += 1;
    set({ toast: { ...payload, id: counter } });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => set({ toast: null }), 4000);
  },
  dismiss: () => {
    if (timer) clearTimeout(timer);
    set({ toast: null });
  },
}));
