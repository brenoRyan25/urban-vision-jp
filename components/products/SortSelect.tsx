"use client";

import { useRouter } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/products";
import { buildHref, type ActiveFilters } from "@/lib/catalogFilters";

/**
 * Envolvido num <form method="get"> de verdade: sem JavaScript o campo
 * ainda envia e a ordenação funciona. Com JavaScript, muda na hora.
 */
export function SortSelect({
  value,
  active,
}: {
  value: string;
  /** Filtros ativos, para preservá-los ao montar a nova URL. */
  active: ActiveFilters;
}) {
  const router = useRouter();

  return (
    <form action="/catalogo" method="get" className="flex items-center gap-2">
      <label htmlFor="ordem" className="whitespace-nowrap text-sm text-smoke">
        Ordenar por
      </label>
      <select
        id="ordem"
        name="ordem"
        defaultValue={value}
        onChange={(e) =>
          router.push(buildHref(active, { sort: e.target.value }), { scroll: false })
        }
        className="h-10 rounded-surface border border-steel bg-graphite px-3 text-sm font-semibold text-titanium hover:border-titanium/50"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.label}
          </option>
        ))}
      </select>
      <noscript>
        <button
          type="submit"
          className="h-10 rounded-pill bg-carbon px-4 text-sm font-semibold text-titanium"
        >
          Aplicar
        </button>
      </noscript>
    </form>
  );
}
