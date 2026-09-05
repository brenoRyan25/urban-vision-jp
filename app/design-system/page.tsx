import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { deliveryConfig } from "@/config/delivery";
import { store } from "@/config/store";
import { quoteDelivery } from "@/lib/delivery";
import { formatCurrency } from "@/lib/format";
import { FormPreview } from "./FormPreview";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "carbon", hex: "#0D0F11", use: "Fundo padrão do site inteiro" },
  { name: "graphite", hex: "#22262A", use: "Cards, painéis, inputs" },
  { name: "steel", hex: "#3A4046", use: "Bordas e divisores" },
  { name: "titanium", hex: "#DCDFE1", use: "Texto primário sobre o fundo" },
  { name: "volt", hex: "#D4FF3F", use: "CTA e preço em oferta — com parcimônia" },
  { name: "iridium", hex: "#6C4CF1", use: "Seleção, foco, badges" },
  { name: "ice", hex: "#22D3EE", use: "Só no fio iridescente" },
  { name: "titanium-100", hex: "#EEF0F1", use: "Superfície clara — rara, fora do fluxo de compra" },
];

const feeSamples = [
  { city: "João Pessoa", neighborhood: "Mangabeira" },
  { city: "João Pessoa", neighborhood: "Centro" },
  { city: "João Pessoa", neighborhood: "Manaíra" },
  { city: "João Pessoa", neighborhood: "Bessa" },
  { city: "Bayeux", neighborhood: "Centro" },
  { city: "Santa Rita", neighborhood: "Centro" },
  { city: "Cabedelo", neighborhood: "Intermares" },
  { city: "Lucena", neighborhood: "Centro" },
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-steel py-12 md:py-16">
      <h2 className="type-title mb-2 text-2xl md:text-3xl">{title}</h2>
      {note && <p className="type-body mb-8 text-sm text-smoke">{note}</p>}
      {!note && <div className="mb-8" />}
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      {/* ---- Casca escura: demonstra o hero e o fio iridescente ---- */}
      <div className="bg-carbon text-titanium">
        <Container className="py-20 md:py-28">
          <p className="mb-6 text-sm text-smoke">
            Página interna de validação · não indexada
          </p>
          <h1 className="type-display text-display-lg">
            Urban
            <br />
            Vision JP
          </h1>
          <div className="iridescent-line mt-8 h-px w-full max-w-lg" />
          <p className="type-body mt-8 text-lg text-titanium/80">
            Direção visual: streetwear eyewear, dark-first. Metal escovado e
            coating de lente (iridium) para seleção e estrutura, um acento
            elétrico (volt) para ação — carbon e graphite são a superfície
            padrão do site inteiro, não só do hero.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg">Ver o catálogo</Button>
            <Button variant="secondary" size="lg">
              Ver ofertas
            </Button>
          </div>
        </Container>
      </div>

      {/* ---- Miolo claro ---- */}
      <Container className="pb-24">
        <Section
          title="Cor"
          note="O violeta iridium aparece em cerca de 5% da área da tela. Acento que se espalha deixa de ser acento."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {palette.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-surface border border-steel"
              >
                <div className="h-24" style={{ backgroundColor: c.hex }} />
                <div className="bg-graphite p-3">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-smoke">{c.hex}</p>
                  <p className="mt-1 text-xs text-smoke">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Tipografia"
          note="Archivo variable. O display usa o eixo de largura em 125% (expandido); o corpo usa 100%. Uma família, dois eixos."
        >
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-2 text-xs text-smoke">
                display-lg · hero · clamp(3.5rem → 9.5rem)
              </p>
              <p className="type-display text-display-lg">
                Olhar de rua
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-smoke">display-md · título de seção</p>
              <p className="type-display text-display-md">
                Top ofertas
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-smoke">title · nome de produto</p>
              <p className="type-title text-2xl">Juliet Ruby Iridium</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-smoke">
                price · números tabulares, para os dígitos não dançarem quando a
                quantidade muda
              </p>
              <p className="type-price text-3xl">{formatCurrency(149.9)}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-smoke">body · máx. 68 caracteres por linha</p>
              <p className="type-body">
                Armação em liga leve com acabamento escovado e lente polarizada.
                Feito para quem anda pela cidade o dia inteiro e não abre mão de
                enxergar bem no fim da tarde.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Botões"
          note="Cápsula porque ecoa a silhueta da lente. Altura mínima de 44px em todos os tamanhos: alvo de toque confortável no celular."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">Adicionar ao carrinho</Button>
              <Button variant="secondary" size="lg">
                Continuar comprando
              </Button>
              <Button variant="ghost" size="lg">
                Limpar filtros
              </Button>
              <Button size="lg" disabled>
                Esgotado
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="md">Tamanho médio</Button>
              <Button size="sm" variant="secondary">
                Tamanho pequeno
              </Button>
            </div>
          </div>
        </Section>

        <Section title="Badges e estados de produto">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="offer">-17%</Badge>
            <Badge tone="featured">Destaque</Badge>
            <Badge tone="soldOut">Esgotado</Badge>
            <Badge tone="neutral">Juliet</Badge>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-surface border border-steel bg-graphite">
              {/* O fio iridescente marca o card em oferta. Um dos três
                  únicos lugares onde ele aparece. */}
              <div className="iridescent-line h-0.5 w-full" />
              <div className="aspect-4/5 bg-steel/40" />
              <div className="p-4">
                <p className="text-sm font-semibold">Em oferta</p>
                <p className="mt-1 text-xs text-smoke">
                  Imagem 4:5, fio iridescente no topo
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-surface border border-steel bg-graphite opacity-60">
              <div className="aspect-4/5 bg-steel/40" />
              <div className="p-4">
                <p className="text-sm font-semibold">Esgotado</p>
                <p className="mt-1 text-xs text-smoke">
                  Opacidade reduzida, ordenado por último
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-surface border border-steel bg-graphite">
              <Skeleton className="aspect-4/5 rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-surface border border-dashed border-steel p-4">
              <p className="text-sm text-smoke">
                Todas as fotos entram em 4:5. Grade uniforme é o que faz o
                catálogo parecer curado.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Formulários"
          note="Teclado numérico e autocomplete corretos no celular: o navegador preenche boa parte do checkout sozinho."
        >
          <FormPreview />
        </Section>

        <Section
          title="Taxa de entrega"
          note={`Origem: ${deliveryConfig.originNeighborhood}. Fórmula: máx(${formatCurrency(deliveryConfig.minFee)}; ${formatCurrency(deliveryConfig.baseFee)} + km × ${formatCurrency(deliveryConfig.pricePerKm)}), arredondada para R$ 0,50. Frete grátis acima de ${formatCurrency(deliveryConfig.freeAbove)} em João Pessoa.`}
        >
          <div className="overflow-x-auto rounded-surface border border-steel">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-graphite">
                <tr>
                  <th className="p-3 font-semibold">Destino</th>
                  <th className="p-3 font-semibold">Distância</th>
                  <th className="p-3 font-semibold">Carrinho R$ 159,90</th>
                  <th className="p-3 font-semibold">Carrinho R$ 320,00</th>
                </tr>
              </thead>
              <tbody>
                {feeSamples.map((s) => {
                  const low = quoteDelivery({ ...s, subtotal: 159.9 });
                  const high = quoteDelivery({ ...s, subtotal: 320 });
                  const label = (q: ReturnType<typeof quoteDelivery>) =>
                    q.status === "free"
                      ? "Grátis"
                      : q.status === "priced"
                        ? formatCurrency(q.fee)
                        : q.status === "on_request"
                          ? "A combinar"
                          : "A combinar";
                  return (
                    <tr
                      key={`${s.city}-${s.neighborhood}`}
                      className="border-t border-steel"
                    >
                      <td className="p-3">
                        {s.neighborhood}, {s.city}
                      </td>
                      <td className="p-3 text-smoke">
                        {"km" in low && low.km !== null ? `${low.km} km` : "—"}
                      </td>
                      <td className="type-price p-3">{label(low)}</td>
                      <td className="type-price p-3">{label(high)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="type-body mt-4 text-sm text-smoke">
            A partir de {deliveryConfig.originNeighborhood}, Mangabeira e
            Bancários ficam baratos e a orla fica cara. Acima de{" "}
            {deliveryConfig.maxRadiusKm} km a taxa vira &quot;a combinar&quot;: o
            pedido continua sendo aceito, só não mostra um número que mataria a
            venda.
          </p>
        </Section>

        <Section
          title="Movimento"
          note="Só responde a ação do usuário. Nenhuma seção entra sozinha ao rolar a página, e prefers-reduced-motion é respeitado globalmente."
        >
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="mb-2 text-xs text-smoke">
                animate-pop · badge do carrinho ao adicionar
              </p>
              <span className="animate-pop inline-flex h-7 min-w-7 items-center justify-center rounded-pill bg-iridium px-2 text-xs font-bold text-white">
                3
              </span>
            </div>
            <div>
              <p className="mb-2 text-xs text-smoke">
                animate-rise · toast de confirmação
              </p>
              <div className="animate-rise inline-flex items-center gap-3 rounded-surface bg-carbon px-4 py-3 text-sm text-titanium">
                Adicionado ao carrinho
                <span className="font-semibold underline underline-offset-4">
                  Ver carrinho
                </span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Estados vazios e de erro">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-surface border border-steel bg-graphite p-8 text-center">
              <p className="type-title text-xl">Seu carrinho está vazio</p>
              <p className="type-body mx-auto mt-2 text-sm text-smoke">
                Escolha um modelo e ele aparece aqui.
              </p>
              <Button className="mt-6">Ver o catálogo</Button>
            </div>
            <div className="rounded-surface border border-steel bg-graphite p-8">
              <p className="type-title text-xl">
                Não encontramos esse CEP
              </p>
              <p className="type-body mt-2 text-sm text-smoke">
                Confira os números ou preencha o endereço manualmente abaixo. O
                erro diz o que houve e o que fazer — nunca só &quot;algo deu
                errado&quot;.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Configuração pendente">
          <ul className="type-body flex list-disc flex-col gap-2 pl-5 text-sm">
            <li>
              <code>config/store.ts</code> — endereço da loja, horários,
              Instagram e política de troca estão com valores de exemplo.
            </li>
            <li>
              <code>.env.local</code> — o número do WhatsApp ainda não foi
              definido{" "}
              {store.whatsappNumber
                ? `(atual: ${store.whatsappNumber})`
                : "(vazio)"}
              .
            </li>
            <li>
              <code>config/delivery.ts</code> — confira no mapa as distâncias dos
              bairros onde você mais vende.
            </li>
          </ul>
        </Section>
      </Container>
    </main>
  );
}
