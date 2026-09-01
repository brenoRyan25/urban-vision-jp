import { store } from "@/config/store";

/**
 * Loja nova, cliente que não conhece, sem pagamento online. Estes três
 * sinais respondem a dúvida antes que ela vire desistência.
 */
export function TrustBar() {
  const items = [
    store.trust.exchange,
    store.trust.warranty,
    store.trust.responseTime,
  ];

  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 divide-x divide-steel">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 px-6 text-xs font-semibold uppercase tracking-wide text-smoke first:pl-0"
        >
          <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-iridium" fill="none" aria-hidden>
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
