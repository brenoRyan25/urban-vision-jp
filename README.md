# Urban Vision JP — Fase 1: fundação e design system

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha o número do WhatsApp
npm run dev
```

Abra **http://localhost:3000/design-system**. Essa página existe para você
validar cor, tipografia, botões, formulários e a tabela de entrega antes de
qualquer catálogo ser construído em cima deles. Ela não é indexada e será
removida ao fim do projeto.

Se preferir começar do zero em vez de copiar os arquivos:

```bash
npx create-next-app@latest urban-vision-jp \
  --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*"
npm install zustand clsx tailwind-merge
```

Depois substitua os arquivos gerados pelos deste pacote.

## O que existe nesta fase

```
app/globals.css              tokens do design system (Tailwind v4, @theme)
app/layout.tsx               fonte, metadata base
app/design-system/           página de validação (temporária)

components/ui/
  Button.tsx                 4 variantes, 3 tamanhos
  Field.tsx                  Field, Input, Textarea, RadioCard
  Badge.tsx                  oferta, destaque, esgotado, neutro
  Container.tsx              largura máxima e respiro lateral
  Skeleton.tsx               carregamento

config/store.ts              dados da loja
config/delivery.ts           parâmetros e tabela de distâncias

lib/utils.ts                 cn(), onlyDigits(), normalizeKey()
lib/format.ts                formatCurrency(), formatCep(), formatPhone()
lib/delivery.ts              quoteDelivery(), calculateFee()

types/product.ts             Product, CategorySlug
types/cart.ts                CartItem, ResolvedCartItem
types/address.ts             Address, ViaCepResponse
types/order.ts               Order (união discriminada), PaymentMethod
```

## Direção visual

Metal escovado e coating de lente, vindos da linhagem X-Metal dos óculos
estilo Juliette. Estrutura de **casca escura, miolo claro**: header, hero,
seção de marca e footer em `carbon`; catálogo, cards e página de produto em
`titanium`. Armação preta e lente espelhada aparecem sobre fundo claro em vez
de sumirem no fundo.

| Token          | Hex       | Onde                                  |
| -------------- | --------- | ------------------------------------- |
| `carbon`       | `#15181B` | Header, hero, footer                  |
| `graphite`     | `#2B2F33` | Superfície sobre o carbon             |
| `titanium`     | `#DCDFE1` | Fundo do catálogo                     |
| `titanium-100` | `#EEF0F1` | Cards, inputs                         |
| `iridium`      | `#6C4CF1` | Botão principal, foco, oferta         |
| `iridium-ink`  | `#4A2BC7` | Texto pequeno de acento em fundo claro |
| `ice`          | `#22D3EE` | Só no fio iridescente                 |

Contraste conferido: `iridium` com texto branco dá 5.3:1 (passa AA).
Sobre fundo claro o violeta puro dá 3.9:1 e reprovaria para texto pequeno —
por isso existe `iridium-ink`, com 6.4:1.

**Elemento de assinatura:** o fio iridescente (`.iridescent-line`), gradiente
violeta→ciano de 1–2px. Aparece em três lugares e em nenhum outro: borda
inferior do header, topo do card em oferta, e a barra do hero.

**Tipografia:** Archivo variable, família única. Display usa o eixo de largura
em 125% (expandido) com peso 800; corpo usa 100%. O contraste vem da largura,
não de uma segunda fonte.

**Forma:** cápsula em botões e badges (ecoa a silhueta da lente), 4px em
superfícies. Praticamente sem sombra — hierarquia por contraste de fundo e
borda de 1px.

**Movimento:** só responde a ação do usuário. Nenhuma seção entra sozinha ao
rolar. `prefers-reduced-motion` desliga tudo globalmente.

## Fotos dos produtos

A regra que mais afeta o resultado final. Todas as imagens entram em **4:5
vertical** (recomendado 1200×1500), fundo neutro claro uniforme, mesma
distância e mesmo enquadramento em todos os modelos. Grade uniforme é o que
faz o catálogo parecer curado. Pelo menos uma foto de uso por modelo, para a
galeria da página de produto.

Arquivos em `public/products/`, referenciados apenas em `data/products.ts`.

## Entrega

Origem: José Américo de Almeida.

```
taxa = máx( R$ 8,00 ; R$ 5,00 + km × R$ 1,20 )   arredondada para R$ 0,50
```

O km vem da tabela em `config/delivery.ts`, não de uma API de rotas: o ViaCEP
não devolve coordenadas, e geocodificar exigiria chave paga, backend para
protegê-la e mais um ponto de falha no checkout. A fórmula por km continua
idêntica — só a origem do número muda. Quando o volume justificar, troca-se
`resolveDistanceKm()` por uma chamada de API sem alterar a interface.

Três degraus de fallback (`cidade:bairro` → `cidade` → a combinar) garantem
que **o checkout nunca trava** por causa de um bairro não mapeado.

Acima de 30 km a taxa passaria de R$ 41 e inviabilizaria a venda, então vira
"a combinar" — o pedido continua sendo aceito.

Frete grátis acima de R$ 299, só em João Pessoa. Gratuito para Cabedelo
(22 km) consumiria a margem de um par inteiro.

## Ajustes pendentes

Procure por `>>> AJUSTAR` no código:

- `config/store.ts` — endereço, horários de retirada, Instagram, política
- `config/delivery.ts` — distâncias dos bairros onde você mais vende
- `.env.local` — `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Dependências

Três, todas justificadas:

| Pacote                     | Peso     | Por quê                                          |
| -------------------------- | -------- | ------------------------------------------------ |
| `zustand`                  | ~1,2 kB  | Carrinho com seletores e persistência (Fase 2)   |
| `clsx` + `tailwind-merge`  | ~2 kB    | `cn()` — sem ele, classes Tailwind conflitam em silêncio |

Deixadas de fora de propósito: Framer Motion (~34 kB, nada aqui precisa),
react-hook-form + zod (~25 kB para oito campos), biblioteca de toast
(~40 linhas resolvem), kit de UI pronto (empurraria o visual para o template
genérico que queremos evitar).

---

# Fase 2 — Produtos, catálogo e carrinho

## Novo nesta fase

```
data/products.ts             10 produtos fictícios (SUBSTITUIR)
lib/products.ts              camada de acesso, async, com facetas
store/cart.ts                carrinho (Zustand + persist)
store/toast.ts               feedback de "adicionado"

components/products/
  ProductCard.tsx            Server Component
  ProductGrid.tsx
  ProductPrice.tsx
  AddToCartButton.tsx        "use client" — a única ilha do card
  FilterBar.tsx              filtros como <Link>, sem JavaScript
  SortSelect.tsx             "use client", degrada para <form method=get>
  ProductGallery.tsx         "use client"
  StickyBuyBar.tsx           "use client" — CTA fixo no celular

components/ui/Toast.tsx
app/catalogo/page.tsx
app/produto/[slug]/page.tsx
app/not-found.tsx
public/products/*.webp       12 placeholders (SUBSTITUIR)
```

## Resultado do build

```
/catalogo         1,85 kB   123 kB First Load
/produto/[slug]   2,77 kB   124 kB First Load   10 páginas estáticas
```

As 10 páginas de produto são geradas no build (SSG). O catálogo é dinâmico
porque lê `searchParams` — filtro e ordenação são resolvidos no servidor.

## Filtros

Derivados dos dados, em `getFacets()`. Cada linha de filtro só aparece se
houver mais de uma opção em uso:

- Se todo o estoque for de uma linha só, a linha de **categoria** some sozinha.
- Se só houver uma cor de lente, a linha de **cor** some sozinha.
- Se nenhum produto tiver `originalPrice`, o chip **Ofertas** some.

Você mexe em `data/products.ts` e a interface se ajusta. Nada de código.

Os filtros vivem na URL (`/catalogo?categoria=juliet&lente=ruby&ordem=menor-preco`),
então o link é compartilhável, o botão voltar funciona e o filtro é aplicado
antes da hidratação.

## Substituir os produtos

1. Apague os 10 produtos de `data/products.ts` e cadastre os seus. As
   instruções estão no cabeçalho do arquivo.
2. Troque as imagens de `public/products/`. Os placeholders atuais têm a
   palavra SUBSTITUIR escrita neles de propósito — se algum passar para
   produção, é impossível não ver.
3. Ajuste `CATEGORIES` e `LENS_COLORS` em `types/product.ts` para as suas
   categorias e cores reais.

## Ver funcionando

- `/catalogo` — grade, filtros, ordenação, estado vazio
- `/catalogo?lente=ruby` — filtro por cor
- `/produto/juliet-ruby` — galeria com 3 fotos, barra fixa no celular
- `/produto/half-jacket` — outra linha, fora da categoria Juliet
- `/design-system` — referência visual

A home ainda redireciona para o catálogo. Ela é construída na Fase 3.

---

# Fases 3 a 8 — Projeto completo

## Build final

```
/                 1,64 kB   122 kB
/carrinho         2,29 kB   127 kB
/catalogo         2,06 kB   123 kB
/checkout         7,36 kB   126 kB
/produto/[slug]   2,97 kB   124 kB   10 páginas estáticas
/robots.txt  /sitemap.xml
+ First Load JS compartilhado: 103 kB
```

Tudo estático menos `/catalogo`, que é dinâmico por ler `searchParams`.

## Novo nesta entrega

```
components/layout/   Header (menu + gaveta), Footer, WhatsAppFloat
components/home/     Hero, TrustBar, ProductSection, BrandSection
components/cart/     CartDrawer, CartView, CartItemRow, EmptyCart,
                     FreeDeliveryHint
components/checkout/ CheckoutForm, CepInput

lib/cart.ts          resolução dos itens e totais
lib/viacep.ts        consulta de CEP
lib/validation.ts    validação do checkout
lib/whatsapp.ts      mensagem e URL

store/customer.ts    dados do cliente para pedidos repetidos

app/page.tsx         homepage
app/carrinho/        página do carrinho
app/checkout/        checkout
app/sitemap.ts  app/robots.ts
```

## Carrinho: gaveta e página

A gaveta abre pelo botão do header e evita perder a posição de rolagem no
catálogo. A página `/carrinho` existe porque o link do toast e o "voltar"
precisam de um destino real. As duas usam os mesmos `CartItemRow`,
`FreeDeliveryHint` e resumo — nada é duplicado.

O foco fica preso dentro da gaveta enquanto ela está aberta, `Esc` fecha e o
foco volta para o botão que a abriu. São ~25 linhas de `useEffect`; Radix
seria uma dependência inteira para isso.

## Checkout

Página única com seções empilhadas, e não etapas. O formulário tem 3 campos
no mínimo e 8 no máximo — cada tela intermediária seria um ponto de abandono,
e no celular a barra de progresso roubaria altura útil. O resumo e o total
ficam visíveis o tempo todo.

Validação só depois da primeira tentativa de envio; a partir daí, revalida ao
digitar para o erro sumir assim que for corrigido. Marcar campo como inválido
antes de a pessoa terminar de digitar é hostil.

O endereço aparece só quando "Entrega" está selecionado, e nenhum campo dele
é exigido em "Retirada".

**Nome, telefone e endereço são salvos no navegador** (`store/customer.ts`) e
pré-preenchidos no pedido seguinte. Fica só no aparelho da pessoa.

## ViaCEP

Dispara ao completar os 8 dígitos, com `onBlur` como rede de segurança. Sem
requisição por tecla.

Tratamentos que costumam faltar e estão aqui:

- **200 com `{ "erro": true }`** — o ViaCEP responde 200 para CEP inexistente,
  e o campo às vezes vem como string. `response.ok` não basta.
- **Corrida de requisições** — digitar `58000000` e corrigir para `58020540`
  deixa duas em voo; a primeira poderia responder por último e sobrescrever o
  endereço certo. Cancelado por `AbortController`.
- **Timeout de 6s** — para não travar em loading se a API pendurar.
- **Cache em memória** — redigitar o mesmo CEP não dispara nova requisição.
- **Foco vai para o campo Número** após preencher: economiza um toque e
  confirma que a busca funcionou.
- **Campos continuam editáveis** — o ViaCEP erra em loteamento novo.
- **API fora do ar libera o preenchimento manual**, com mensagem dizendo isso.

Cada situação tem mensagem própria, porque "esse CEP não existe" e "a busca
está fora do ar" pedem reações diferentes do cliente.

## WhatsApp

`buildOrderMessage()` e `buildWhatsAppUrl()` são puras — nenhuma toca
`window`. Dá para testar a mensagem isoladamente e reaproveitar num backend
que use a API oficial no futuro.

**O botão é uma âncora com `href` já calculado, não `window.open`.** Se
houvesse qualquer `await` antes de abrir, o Safari do iOS bloquearia por
perder o vínculo com o gesto do usuário.

A mensagem sai com identificador curto (`UV-K3M9`) para você citar o pedido na
conversa. Endereço só aparece em entrega; observações só aparecem se
existirem.

**O carrinho não é limpo ao enviar.** Se o WhatsApp não abrir, o cliente
perderia o pedido inteiro. Limpar é decisão dele.

## Acessibilidade

- Contraste conferido: `iridium` com branco 5.3:1, `iridium-ink` sobre fundo
  claro 6.4:1. Ambos passam AA.
- Formas de pagamento e entrega são `input type="radio"` reais: setas do
  teclado e leitor de tela funcionam sem código extra.
- Cor da lente nunca é o único sinal — o nome vem junto do círculo.
- Botões "Adicionar" carregam o nome do produto em `sr-only`, senão seriam 24
  botões idênticos para quem usa leitor de tela.
- `prefers-reduced-motion` desliga todas as animações globalmente.
- A barra fixa do celular fica `inert` quando escondida, para não receber foco
  atrás do rodapé.

## O que falta você fazer

1. **Fotos reais** em `public/products/` — 4:5, fundo neutro claro, mesmo
   enquadramento. É a peça que mais afeta o resultado.
2. **Foto do hero** — hoje ele reutiliza a primeira foto do catálogo. Marcado
   com `>>> SUBSTITUIR` em `app/page.tsx`.
3. **`data/products.ts`** — trocar os 10 fictícios pelos seus.
4. **`config/store.ts`** — endereço, horários, Instagram, política de troca.
5. **`config/delivery.ts`** — conferir distâncias dos bairros onde mais vende.
6. **`.env.local`** — `NEXT_PUBLIC_WHATSAPP_NUMBER`. Sem ele o botão de
   finalizar fica desabilitado, com aviso na tela.
7. **Texto da marca** em `components/home/BrandSection.tsx` — reescrever com a
   história real.

## Não implementado, de propósito

- **Framer Motion** — tudo que o projeto anima sai com `transition` do
  Tailwind e dois `@keyframes`. Os ~34 kB não se pagam aqui.
- **react-hook-form + zod** — `lib/validation.ts` tem 80 linhas e resolve.
- **Biblioteca de toast** — `store/toast.ts` tem 30 linhas.
- **Página `/ofertas` separada** — é `/catalogo?ofertas=1`. Uma rota própria
  duplicaria a lógica e dividiria a autoridade de SEO entre URLs quase iguais.
- **Painel `/admin`** — fase futura. `lib/products.ts` já é async justamente
  para que a troca por banco de dados não toque na interface.
