import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { store } from "@/config/store";

/**
 * Hero em campanha, não em vitrine: a foto é uma camada de fundo em
 * tela cheia, com um véu de gradiente para o texto ficar legível por
 * cima — não uma caixa de 50% ao lado do texto. Isso é o que dá a
 * primeira tela a sensação de anúncio de marca, e não de template.
 *
 * >>> SUBSTITUIR a imagem por uma foto real de campanha (retrato/still
 *     em ambiente urbano). O hero é 80% imagem: nenhuma decisão de
 *     código compensa foto ruim numa loja de óculos.
 */
export function Hero({ heroImage }: { heroImage: string }) {
  return (
    <section className="relative flex min-h-[85dvh] items-end overflow-hidden bg-carbon text-titanium md:min-h-[90dvh]">
      <Image
        src={heroImage}
        alt="Óculos estilo Juliette da Urban Vision JP"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-carbon via-carbon/70 to-carbon/10" />
      <div className="absolute inset-0 bg-linear-to-r from-carbon/80 via-carbon/10 to-transparent" />

      <Container className="relative py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-smoke [font-stretch:87%]">
          Coleção atual — {store.city}
        </p>

        <h1 className="type-display mt-3 text-display-lg">
          Olhar
          <br />
          de rua.
        </h1>

        <div className="iridescent-line mt-6 h-px w-40" />

        <p className="type-body mt-6 max-w-md text-lg text-titanium/70 md:text-xl">
          Lentes Juliette, atitude urbana. Entrega em {store.city} e região —
          retirada também disponível.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalogo"
            className={buttonClasses({ variant: "primary", size: "lg" })}
          >
            Explorar catálogo
          </Link>
          <Link
            href="/catalogo?ofertas=1"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Ver ofertas
          </Link>
        </div>
      </Container>
    </section>
  );
}
