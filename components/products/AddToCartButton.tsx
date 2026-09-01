"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";

/**
 * A única parte do ProductCard que precisa de JavaScript.
 * Numa grade de 24 produtos isso hidrata 24 botõezinhos em vez de
 * 24 cards inteiros — a diferença aparece no Lighthouse mobile.
 */
const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
    <path
      d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function AddToCartButton({
  productId,
  productName,
  available,
  size = "md",
  fullWidth,
  iconOnly,
}: {
  productId: string;
  productName: string;
  available: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  /** Botão circular só com o ícone — usado sobre a foto no ProductCard,
   *  onde uma barra de texto pesaria mais do que a própria foto. */
  iconOnly?: boolean;
}) {
  const add = useCart((s) => s.add);
  const show = useToast((s) => s.show);

  if (!available) {
    if (iconOnly) return null;
    return (
      <Button size={size} fullWidth={fullWidth} disabled aria-disabled>
        Esgotado
      </Button>
    );
  }

  const onClick = () => {
    add(productId);
    show({
      message: `${productName} no carrinho`,
      actionLabel: "Ver carrinho",
      actionHref: "/carrinho",
    });
  };

  if (iconOnly) {
    return (
      <Button
        size={size}
        onClick={onClick}
        aria-label={`Adicionar ${productName} ao carrinho`}
        className="size-10 px-0"
      >
        <CartIcon />
      </Button>
    );
  }

  return (
    <Button size={size} fullWidth={fullWidth} onClick={onClick}>
      Adicionar
      {/* O nome do produto no rótulo acessível evita 24 botões
          idênticos chamados "Adicionar" para quem usa leitor de tela. */}
      <span className="sr-only"> {productName} ao carrinho</span>
    </Button>
  );
}
