"use client";

import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Barra fixa no rodapé do celular, com preço e botão.
 *
 * Motivo: na página de produto o botão principal fica acima da dobra e
 * some assim que o cliente rola para ler a descrição. Recolocar o CTA
 * ao alcance do polegar é uma das intervenções de maior efeito medido
 * em e-commerce mobile.
 *
 * Aparece só depois que o botão original sai da tela — usando
 * IntersectionObserver, sem listener de scroll.
 */
export function StickyBuyBar({
  productId,
  productName,
  price,
  available,
  watchId,
}: {
  productId: string;
  productName: string;
  price: number;
  available: boolean;
  /** id do elemento observado (o botão principal da página). */
  watchId: string;
}) {
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        shown.current = true;
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-steel bg-carbon/95 backdrop-blur",
        "px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden",
        "transition-transform duration-200",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      /* Escondido de verdade quando fora da tela: senão continua
         recebendo foco de teclado atrás do rodapé. */
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-smoke">{productName}</p>
          <p className="type-price text-lg">{formatCurrency(price)}</p>
        </div>
        <AddToCartButton
          productId={productId}
          productName={productName}
          available={available}
        />
      </div>
    </div>
  );
}
