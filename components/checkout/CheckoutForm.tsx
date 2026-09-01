"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CepInput } from "./CepInput";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Field, Input, RadioCard, Textarea } from "@/components/ui/Field";
import { deliveryConfig } from "@/config/delivery";
import { store } from "@/config/store";
import { calculateSubtotal, resolveCartItems, unavailableItems } from "@/lib/cart";
import { quoteDelivery } from "@/lib/delivery";
import { formatCurrency, formatPhone, roundMoney } from "@/lib/format";
import { cn, onlyDigits } from "@/lib/utils";
import {
  emptyCheckout,
  hasErrors,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/validation";
import { buildOrderMessage, buildWhatsAppUrl, createOrderReference } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { useCustomer } from "@/store/customer";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

/**
 * Página única, seções empilhadas — e não checkout em etapas.
 *
 * Multi-step serve para formulário longo. Este tem 3 campos no mínimo e
 * 8 no máximo; cada tela intermediária seria um ponto de abandono, e no
 * celular a barra de progresso roubaria altura útil. Aqui o resumo e o
 * total ficam visíveis o tempo todo.
 */
export function CheckoutForm({ products }: { products: Product[] }) {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);

  const saved = useCustomer((s) => s.data);
  const saveCustomer = useCustomer((s) => s.save);

  const [values, setValues] = useState<CheckoutValues>(emptyCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  /** Validação só depois da primeira tentativa de envio. Marcar campo
   *  como inválido antes de a pessoa terminar de digitar é hostil. */
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ reference: string } | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Cliente recorrente é o melhor cliente: um pedido repetido vira 3 toques.
  useEffect(() => {
    if (saved) setValues((v) => ({ ...v, ...saved }));
  }, [saved]);

  const set = <K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Depois do primeiro envio, revalida ao digitar para o erro sumir
    // assim que for corrigido.
    if (submitted) {
      setErrors(validateCheckout({ ...values, [key]: value }));
    }
  };

  const { resolved } = resolveCartItems(items, products);
  const subtotal = calculateSubtotal(resolved);
  const blocked = unavailableItems(resolved);

  const quote = useMemo(
    () =>
      values.delivery === "delivery" && values.city
        ? quoteDelivery({
            city: values.city,
            neighborhood: values.neighborhood,
            subtotal,
          })
        : null,
    [values.delivery, values.city, values.neighborhood, subtotal],
  );

  const deliveryFee =
    quote?.status === "priced" ? quote.fee : quote?.status === "free" ? 0 : null;
  const total = roundMoney(subtotal + (deliveryFee ?? 0));

  const [payment, setPayment] = useState<"pix" | "cash" | "card">("pix");

  const buildOrder = (reference: string): Order => {
    const base = {
      reference,
      items: resolved,
      subtotal,
      total,
      customer: { name: values.name.trim(), phone: onlyDigits(values.phone) },
      payment,
      notes: values.notes.trim() || undefined,
    };

    if (values.delivery === "pickup") {
      return { ...base, delivery: "pickup" };
    }

    return {
      ...base,
      delivery: "delivery",
      address: {
        cep: onlyDigits(values.cep),
        street: values.street.trim(),
        number: values.number.trim(),
        complement: values.complement.trim() || undefined,
        neighborhood: values.neighborhood.trim(),
        city: values.city.trim(),
        state: values.state.trim().toUpperCase(),
      },
      deliveryFee,
      deliveryDistanceKm: quote && "km" in quote ? quote.km : null,
    };
  };

  /**
   * O botão é uma âncora com href já calculado, e não window.open.
   *
   * Se houvesse qualquer await antes de abrir a janela, o Safari do iOS
   * bloquearia por perder o vínculo com o gesto do usuário. Como <a>,
   * abre sempre — e ainda é mais acessível.
   */
  const href = useMemo(() => {
    if (!store.whatsappNumber) return "#";
    return buildWhatsAppUrl(
      store.whatsappNumber,
      buildOrderMessage(buildOrder("UV-XXXX")),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, payment, resolved, subtotal, total, deliveryFee, quote]);

  const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const found = validateCheckout(values);
    setSubmitted(true);
    setErrors(found);

    if (hasErrors(found) || resolved.length === 0 || blocked.length > 0) {
      e.preventDefault();
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Gera a referência e reescreve o href de forma síncrona, ainda
    // dentro do clique — o navegador segue o href atualizado.
    const reference = createOrderReference();
    e.currentTarget.href = buildWhatsAppUrl(
      store.whatsappNumber,
      buildOrderMessage(buildOrder(reference)),
    );

    saveCustomer({
      name: values.name,
      phone: values.phone,
      cep: values.cep,
      street: values.street,
      number: values.number,
      complement: values.complement,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
    });

    // Não limpamos o carrinho: se o WhatsApp não abrir, o cliente
    // perderia o pedido inteiro. Limpar é decisão dele, no carrinho.
    void clear;

    setSubmittedOrder({ reference });
  };

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-smoke" role="status">
        Carregando seu pedido...
      </div>
    );
  }

  if (resolved.length === 0) {
    return <EmptyCart />;
  }

  if (submittedOrder) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <p className="type-title text-2xl">Pedido preparado com sucesso</p>
        <p className="type-price mt-2 text-lg text-volt">{submittedOrder.reference}</p>
        <p className="type-body mt-4 text-smoke">
          Abrimos uma conversa com a loja já com tudo preenchido — é só
          confirmar por lá para fechar o pedido.
        </p>
        <Link
          href="/catalogo"
          className={buttonClasses({ size: "lg", className: "mt-8" })}
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  const isDelivery = values.delivery === "delivery";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      <div className="flex flex-col gap-10">
        <div ref={errorRef}>
          {submitted && hasErrors(errors) && (
            <div
              role="alert"
              className="rounded-surface border border-danger/40 bg-danger/5 p-4 text-sm text-danger"
            >
              Faltam alguns dados para fechar o pedido. Os campos estão marcados
              abaixo.
            </div>
          )}
          {blocked.length > 0 && (
            <div
              role="alert"
              className="mt-3 rounded-surface border border-danger/40 bg-danger/5 p-4 text-sm text-danger"
            >
              {blocked.map((i) => i.name).join(", ")} esgotou. Remova do carrinho
              para continuar.
            </div>
          )}
        </div>

        {/* ---- 1. Dados ---- */}
        <section className="flex flex-col gap-5">
          <h2 className="type-title text-xl">Seus dados</h2>

          <Field id="name" label="Nome" required error={errors.name}>
            <Input
              id="name"
              invalid={Boolean(errors.name)}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="name"
              placeholder="Como podemos te chamar"
            />
          </Field>

          <Field
            id="phone"
            label="Telefone"
            required
            error={errors.phone}
            hint="É por aqui que confirmamos o pedido."
          >
            <Input
              id="phone"
              hasHint
              invalid={Boolean(errors.phone)}
              value={values.phone}
              onChange={(e) => set("phone", formatPhone(e.target.value))}
              inputMode="numeric"
              autoComplete="tel"
              placeholder="(83) 99999-9999"
              maxLength={15}
            />
          </Field>
        </section>

        {/* ---- 2. Pagamento ---- */}
        <section className="flex flex-col gap-4">
          <h2 className="type-title text-xl">Como você prefere pagar</h2>
          <fieldset>
            <legend className="sr-only">Forma de pagamento</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { v: "pix", t: "Pix", s: "Chave enviada após a confirmação" },
                { v: "cash", t: "Dinheiro", s: "Na entrega ou retirada" },
                { v: "card", t: "Cartão", s: "Maquininha na entrega" },
              ].map((o) => (
                <RadioCard
                  key={o.v}
                  id={`pay-${o.v}`}
                  name="payment"
                  value={o.v}
                  checked={payment === o.v}
                  onChange={(v) => setPayment(v as typeof payment)}
                  title={o.t}
                  subtitle={o.s}
                />
              ))}
            </div>
          </fieldset>
        </section>

        {/* ---- 3. Recebimento ---- */}
        <section className="flex flex-col gap-4">
          <h2 className="type-title text-xl">Como você quer receber</h2>
          <fieldset>
            <legend className="sr-only">Forma de recebimento</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <RadioCard
                id="del-delivery"
                name="delivery"
                value="delivery"
                checked={isDelivery}
                onChange={(v) => set("delivery", v as "delivery")}
                title="Entrega"
                subtitle={`${store.city} e região. A partir de ${formatCurrency(deliveryConfig.minFee)}, grátis acima de ${formatCurrency(deliveryConfig.freeAbove)}.`}
              />
              <RadioCard
                id="del-pickup"
                name="delivery"
                value="pickup"
                checked={!isDelivery}
                onChange={(v) => set("delivery", v as "pickup")}
                title="Retirada, sem taxa"
                subtitle={`${store.address.neighborhood}, ${store.city}`}
              />
            </div>
          </fieldset>

          {!isDelivery && (
            <div className="animate-rise rounded-surface border border-steel bg-graphite p-4 text-sm">
              <p className="font-semibold text-titanium">Retirar em</p>
              <p className="mt-1 text-smoke">
                {store.address.street}, {store.address.number} —{" "}
                {store.address.neighborhood}
              </p>
              <p className="mt-1 text-smoke">{store.pickupHours}</p>
            </div>
          )}
        </section>

        {/* ---- 4. Endereço (só para entrega) ---- */}
        {isDelivery && (
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="type-title text-xl">Endereço de entrega</h2>

            <CepInput
              value={values.cep}
              onChange={(v) => set("cep", v)}
              error={errors.cep}
              numberFieldId="number"
              onResolved={(a) =>
                setValues((v) => ({
                  ...v,
                  cep: v.cep,
                  // Campos continuam editáveis: o ViaCEP erra em
                  // loteamento novo, e o cliente precisa poder corrigir.
                  street: a.street || v.street,
                  neighborhood: a.neighborhood || v.neighborhood,
                  city: a.city,
                  state: a.state,
                }))
              }
            />

            <Field id="street" label="Rua" required error={errors.street}>
              <Input
                id="street"
                invalid={Boolean(errors.street)}
                value={values.street}
                onChange={(e) => set("street", e.target.value)}
                autoComplete="address-line1"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="number" label="Número" required error={errors.number}>
                <Input
                  id="number"
                  invalid={Boolean(errors.number)}
                  value={values.number}
                  onChange={(e) => set("number", e.target.value)}
                  inputMode="numeric"
                  placeholder="123"
                />
              </Field>

              <Field id="complement" label="Complemento">
                <Input
                  id="complement"
                  value={values.complement}
                  onChange={(e) => set("complement", e.target.value)}
                  autoComplete="address-line2"
                  placeholder="Apto 302, bloco B"
                />
              </Field>
            </div>

            <Field id="neighborhood" label="Bairro" required error={errors.neighborhood}>
              <Input
                id="neighborhood"
                invalid={Boolean(errors.neighborhood)}
                value={values.neighborhood}
                onChange={(e) => set("neighborhood", e.target.value)}
                autoComplete="address-level3"
              />
            </Field>

            <div className="grid grid-cols-[1fr_100px] gap-5">
              <Field id="city" label="Cidade" required error={errors.city}>
                <Input
                  id="city"
                  invalid={Boolean(errors.city)}
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  autoComplete="address-level2"
                />
              </Field>

              <Field id="state" label="UF" required error={errors.state}>
                <Input
                  id="state"
                  invalid={Boolean(errors.state)}
                  value={values.state}
                  onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))}
                  autoComplete="address-level1"
                  maxLength={2}
                  placeholder="PB"
                />
              </Field>
            </div>
          </section>
        )}

        {/* ---- 5. Observações ---- */}
        <section className="flex flex-col gap-4">
          <h2 className="type-title text-xl">Observações</h2>
          <Field id="notes" label="Algo que precisamos saber">
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Entregar após as 18h, ponto de referência, etc."
              maxLength={400}
            />
          </Field>
        </section>
      </div>

      {/* ---- Resumo ---- */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-surface border border-steel bg-graphite p-5">
          <h2 className="type-title text-lg">Resumo do pedido</h2>

          <ul className="mt-4 divide-y divide-steel text-sm">
            {resolved.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate">{item.name}</span>
                  <span className="text-smoke">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                </span>
                <span className="type-price shrink-0">
                  {formatCurrency(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-steel pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-smoke">Subtotal</span>
              <span className="type-price">{formatCurrency(subtotal)}</span>
            </div>

            {isDelivery && (
              <div className="flex justify-between gap-3">
                <span className="text-smoke">
                  Entrega
                  {quote && "km" in quote && quote.km !== null && (
                    <span className="ml-1 text-xs">(~{quote.km} km)</span>
                  )}
                </span>
                <span className="type-price text-right">
                  {!quote ? (
                    <span className="font-normal text-smoke">informe o CEP</span>
                  ) : quote.status === "free" ? (
                    <Badge tone="offer">Grátis</Badge>
                  ) : quote.status === "priced" ? (
                    formatCurrency(quote.fee)
                  ) : (
                    <span className="font-normal text-smoke">a combinar</span>
                  )}
                </span>
              </div>
            )}

            <div className="mt-2 flex items-baseline justify-between border-t border-steel pt-3">
              <span className="font-semibold">Total</span>
              <span className="type-price text-2xl">{formatCurrency(total)}</span>
            </div>

            {isDelivery && quote && quote.status === "on_request" && (
              <p className="text-xs text-smoke">
                Você está a mais de {deliveryConfig.maxRadiusKm} km da loja.
                Combinamos a taxa antes de fechar o pedido.
              </p>
            )}
          </div>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSubmit}
            className={buttonClasses({
              size: "lg",
              fullWidth: true,
              className: cn("mt-5", !store.whatsappNumber && "pointer-events-none opacity-50"),
            })}
          >
            Confirmar pedido
          </a>

          {!store.whatsappNumber && (
            <p role="alert" className="mt-2 text-xs text-danger">
              Configure NEXT_PUBLIC_WHATSAPP_NUMBER em .env.local para habilitar
              o envio.
            </p>
          )}

          <p className="mt-3 text-center text-xs text-smoke">
            Você confere tudo antes de confirmar com a loja.
          </p>

          <Link
            href="/carrinho"
            className="mt-4 block text-center text-sm font-semibold text-smoke underline underline-offset-4 hover:text-titanium"
          >
            Voltar ao carrinho
          </Link>
        </div>
      </aside>
    </div>
  );
}
