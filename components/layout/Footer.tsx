import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { deliveryConfig } from "@/config/delivery";
import { store } from "@/config/store";
import { formatCurrency } from "@/lib/format";

export function Footer() {
  return (
    <footer className="bg-carbon text-titanium">
      <div className="iridescent-line h-px w-full opacity-40" />
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="type-title text-lg">
              URBAN VISION <span className="text-smoke">JP</span>
            </p>
            <p className="mt-3 text-sm text-titanium/60">{store.tagline}</p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-sm font-bold">Loja</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-titanium/60">
              <li><Link href="/catalogo" className="hover:text-titanium">Catálogo</Link></li>
              <li><Link href="/catalogo?ofertas=1" className="hover:text-titanium">Ofertas</Link></li>
              <li><Link href="/carrinho" className="hover:text-titanium">Carrinho</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold">Entrega e retirada</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-titanium/60">
              <li>{store.city} e região metropolitana</li>
              <li>Taxa a partir de {formatCurrency(deliveryConfig.minFee)}</li>
              <li>Grátis acima de {formatCurrency(deliveryConfig.freeAbove)}</li>
              <li>Retirada em {store.address.neighborhood}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold">Contato</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-titanium/60">
              <li>
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-titanium"
                >
                  @{store.instagram}
                </a>
              </li>
              <li>{store.pickupHours}</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-graphite pt-6 text-xs text-smoke">
          © {new Date().getFullYear()} {store.name} · {store.city}, {store.state}
        </p>
      </Container>
    </footer>
  );
}
