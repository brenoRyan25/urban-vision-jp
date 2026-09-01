import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] items-center">
      <Container className="text-center">
        <h1 className="type-display text-display-sm">Página fora do ar</h1>
        <p className="type-body mx-auto mt-4 text-smoke">
          O endereço não existe ou o modelo saiu do catálogo.
        </p>
        <Link href="/catalogo" className={buttonClasses({ className: "mt-8" })}>
          Ver o catálogo
        </Link>
      </Container>
    </main>
  );
}
