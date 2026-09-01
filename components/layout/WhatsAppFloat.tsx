"use client";

import { usePathname } from "next/navigation";
import { store } from "@/config/store";

/**
 * Botão flutuante para tirar dúvida — escondido no carrinho e no
 * checkout. Ali ele tiraria o cliente do funil no exato momento em que
 * ele ia converter.
 */
const HIDDEN_ON = ["/carrinho", "/checkout"];

export function WhatsAppFloat() {
  const pathname = usePathname();

  if (!store.whatsappNumber) return null;
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <a
      href={`https://wa.me/${store.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvida no WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-pill border border-steel bg-graphite text-titanium shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a13 13 0 0 1-5.6-4.9c-.4-.6-.9-1.5-.9-2.5 0-1 .5-1.5.7-1.7.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.5 0 1Z" />
      </svg>
    </a>
  );
}
