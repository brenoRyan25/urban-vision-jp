import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildHref, type ActiveFilters } from "@/lib/catalogFilters";
import type { Facet } from "@/lib/products";
import type { Category, LensColor } from "@/types/product";

/**
 * Filtros são <Link>, não botões com estado.
 *
 * O servidor lê os searchParams, filtra e devolve o HTML pronto. Isso dá
 * três coisas de graça: link compartilhável, botão voltar funcionando, e
 * o filtro aplicado antes mesmo da hidratação. Uma solução com useState
 * seria mais lenta e teria flash de conteúdo.
 */

interface FilterBarProps {
  categories: Facet<Category>[];
  lensColors: Facet<LensColor>[];
  hasOffers: boolean;
  active: ActiveFilters;
}

const chip =
  "inline-flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2 " +
  "text-sm font-semibold transition-colors";

function Chip({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        chip,
        isActive
          ? "border-iridium bg-iridium text-white"
          : "border-steel bg-graphite text-titanium hover:border-titanium/50",
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Cada linha só aparece se houver mais de uma opção.
 * Filtro com uma opção só é fricção: ocupa espaço e não filtra nada.
 * Numa loja onde tudo é Juliette, a linha de categoria some sozinha.
 */
export function FilterBar({
  categories,
  lensColors,
  hasOffers,
  active,
}: FilterBarProps) {
  const showCategories = categories.length > 1;
  const showLensColors = lensColors.length > 1;
  const noneActive = !active.category && !active.lens && !active.offers;

  if (!showCategories && !showLensColors && !hasOffers) return null;

  return (
    <div className="flex flex-col gap-4">
      {(showCategories || hasOffers) && (
        <nav aria-label="Filtrar por tipo">
          {/* Rolagem horizontal no celular: mais rápido que um dropdown,
              e o corte na borda mostra que há mais opções à direita. */}
          <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
            <li>
              <Chip href={buildHref({}, {})} isActive={noneActive}>
                Todos
              </Chip>
            </li>

            {showCategories &&
              categories.map(({ value, count }) => (
                <li key={value.slug}>
                  <Chip
                    href={buildHref(active, {
                      category: active.category === value.slug ? undefined : value.slug,
                    })}
                    isActive={active.category === value.slug}
                  >
                    {value.label}
                    <span className="text-xs opacity-60">{count}</span>
                  </Chip>
                </li>
              ))}

            {hasOffers && (
              <li>
                <Chip
                  href={buildHref(active, { offers: !active.offers || undefined })}
                  isActive={Boolean(active.offers)}
                >
                  Ofertas
                </Chip>
              </li>
            )}
          </ul>
        </nav>
      )}

      {showLensColors && (
        <nav aria-label="Filtrar por cor da lente">
          <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
            {lensColors.map(({ value, count }) => (
              <li key={value.slug}>
                <Chip
                  href={buildHref(active, {
                    lens: active.lens === value.slug ? undefined : value.slug,
                  })}
                  isActive={active.lens === value.slug}
                >
                  <span
                    aria-hidden
                    className="size-3.5 rounded-full border border-black/15"
                    style={{ backgroundColor: value.swatch }}
                  />
                  {/* A cor nunca é o único sinal: o nome vem junto. */}
                  {value.label}
                  <span className="text-xs opacity-60">{count}</span>
                </Chip>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
