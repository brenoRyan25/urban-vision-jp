export interface ActiveFilters {
  category?: string;
  lens?: string;
  offers?: boolean;
  sort?: string;
}

/** Monta a URL preservando os outros filtros e limpando os vazios. */
export function buildHref(
  active: ActiveFilters,
  patch: Partial<ActiveFilters>,
): string {
  const merged = { ...active, ...patch };
  const params = new URLSearchParams();
  if (merged.category) params.set("categoria", merged.category);
  if (merged.lens) params.set("lente", merged.lens);
  if (merged.offers) params.set("ofertas", "1");
  if (merged.sort && merged.sort !== "recentes") params.set("ordem", merged.sort);
  const qs = params.toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}
