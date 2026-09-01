import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { store } from "@/config/store";

/** >>> AJUSTAR: reescreva com a história real da loja. */
export function BrandSection() {
  return (
    <section className="bg-carbon text-titanium">
      <Container className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <h2 className="type-display text-display-md">
            Feito para
            <br />
            a rua
          </h2>

          <div className="flex flex-col justify-center">
            <p className="type-body text-lg text-titanium/70">
              A {store.name} nasceu em {store.city} com uma ideia simples: óculos
              com presença não precisam custar o preço de uma vitrine de
              shopping. Selecionamos poucos modelos, testamos cada um e só
              vendemos o que usaríamos.
            </p>
            <p className="type-body mt-4 text-lg text-titanium/70">
              Todos com proteção UV400, estojo e garantia. Você escolhe aqui,
              a gente confirma com você antes de despachar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className={buttonClasses({ variant: "primary" })}>
                Ver todos os modelos
              </Link>
              <a
                href={`https://instagram.com/${store.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "secondary" })}
              >
                @{store.instagram}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
