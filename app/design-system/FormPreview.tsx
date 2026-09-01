"use client";

import { useState } from "react";
import { Field, Input, RadioCard, Textarea } from "@/components/ui/Field";
import { formatCep, formatPhone } from "@/lib/format";

export function FormPreview() {
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [payment, setPayment] = useState("pix");
  const [delivery, setDelivery] = useState("delivery");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <Field id="demo-name" label="Nome" required>
          <Input id="demo-name" placeholder="Como podemos te chamar" autoComplete="name" />
        </Field>

        <Field
          id="demo-phone"
          label="Telefone"
          required
          hint="É por aqui que confirmamos o pedido."
        >
          <Input
            id="demo-phone"
            hasHint
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(83) 99999-9999"
            inputMode="numeric"
            autoComplete="tel"
          />
        </Field>

        <Field id="demo-cep" label="CEP" required>
          <Input
            id="demo-cep"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            placeholder="58000-000"
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </Field>

        <Field
          id="demo-error"
          label="Número"
          required
          error="Informe o número da residência."
        >
          <Input id="demo-error" invalid defaultValue="" placeholder="123" />
        </Field>

        <Field id="demo-notes" label="Observações">
          <Textarea id="demo-notes" placeholder="Entregar após as 18h, por exemplo." />
        </Field>
      </div>

      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-semibold text-titanium">
            Como você prefere pagar
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { v: "pix", t: "Pix", s: "Chave enviada após a confirmação" },
              { v: "cash", t: "Dinheiro", s: "Na entrega" },
              { v: "card", t: "Cartão", s: "Maquininha na entrega" },
            ].map((o) => (
              <RadioCard
                key={o.v}
                id={`pay-${o.v}`}
                name="demo-payment"
                value={o.v}
                checked={payment === o.v}
                onChange={setPayment}
                title={o.t}
                subtitle={o.s}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-semibold text-titanium">
            Como você quer receber
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RadioCard
              id="del-delivery"
              name="demo-delivery"
              value="delivery"
              checked={delivery === "delivery"}
              onChange={setDelivery}
              title="Entrega"
              subtitle="João Pessoa e região metropolitana"
            />
            <RadioCard
              id="del-pickup"
              name="demo-delivery"
              value="pickup"
              checked={delivery === "pickup"}
              onChange={setDelivery}
              title="Retirada"
              subtitle="José Américo, sem taxa"
            />
          </div>
        </fieldset>

        <div className="rounded-surface border border-steel bg-graphite p-4 text-sm text-smoke">
          Os cartões acima são <code>input type=&quot;radio&quot;</code> de verdade.
          Setas do teclado, leitor de tela e envio do formulário funcionam sem
          código extra — o que um <code>div</code> com clique perderia.
        </div>
      </div>
    </div>
  );
}
