"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Container } from "@/components/ui/Container";
import { store } from "@/config/store";
import { cn, withBasePath } from "@/lib/utils";
import { selectTotalQuantity, useCart } from "@/store/cart";
import type { Product } from "@/types/product";

const links = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?ofertas=1", label: "Ofertas" },
];

/**
 * "Ofertas" aponta para /catalogo?ofertas=1 em vez de uma página própria.
 * Uma rota /ofertas separada duplicaria a lógica do catálogo e dividiria
 * a autoridade de SEO entre duas URLs com produtos quase iguais.
 */
export function Header({ products }: { products: Product[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const count = useCart(selectTotalQuantity);
  const hydrated = useCart((s) => s.hydrated);

  // Fecha o menu ao navegar — senão ele fica aberto sobre a nova página.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-carbon text-titanium">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={`${store.name} — início`}
            >
              <Image
                src={withBasePath("/logo-uban-vision.jpg")}
                alt=""
                width={40}
                height={40}
                className="size-9 rounded-full md:size-10"
              />
              <span className="type-title hidden text-lg tracking-tight sm:inline md:text-xl">
                URBAN VISION <span className="text-smoke">JP</span>
              </span>
            </Link>

            <nav aria-label="Principal" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "text-sm font-semibold transition-colors hover:text-white",
                        pathname === l.href.split("?")[0] && l.href === "/"
                          ? "text-white"
                          : "text-titanium/70",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex h-11 items-center gap-2 rounded-pill px-3 text-sm font-semibold transition-colors hover:bg-graphite"
                aria-label={
                  hydrated && count > 0
                    ? `Carrinho, ${count} ${count === 1 ? "item" : "itens"}`
                    : "Carrinho"
                }
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
                  <path
                    d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Só renderiza o número depois da hidratação: o servidor
                    não conhece o localStorage e o React acusaria mismatch. */}
                {hydrated && count > 0 && (
                  <span
                    key={count}
                    className="animate-pop absolute -right-0.5 top-1 flex h-5 min-w-5 items-center justify-center rounded-pill bg-iridium px-1 text-[11px] font-bold text-white"
                  >
                    {count}
                  </span>
                )}
                <span className="hidden md:inline">Carrinho</span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                className="flex size-11 items-center justify-center rounded-pill transition-colors hover:bg-graphite md:hidden"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
                  {menuOpen ? (
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Container>

        {menuOpen && (
          <nav
            id="menu-mobile"
            aria-label="Principal"
            className="animate-rise border-t border-graphite md:hidden"
          >
            <Container>
              <ul className="flex flex-col py-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block py-3 text-base font-semibold text-titanium/80 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        )}

        {/* Fio iridescente: um dos três únicos lugares onde ele aparece. */}
        <div className="iridescent-line h-px w-full" />
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </>
  );
}
