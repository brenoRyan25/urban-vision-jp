"use client";

import { useEffect, useRef, useState } from "react";
import { Field, Input } from "@/components/ui/Field";
import { formatCep } from "@/lib/format";
import { onlyDigits } from "@/lib/utils";
import { CEP_MESSAGES, getAddressByCep } from "@/lib/viacep";
import type { AddressFromCep } from "@/types/address";

export function CepInput({
  value,
  onChange,
  onResolved,
  error,
  numberFieldId,
}: {
  value: string;
  onChange: (value: string) => void;
  onResolved: (address: AddressFromCep) => void;
  error?: string;
  /** Para mover o foco ao próximo campo depois de preencher. */
  numberFieldId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lastQueried = useRef<string>("");

  const lookup = async (raw: string) => {
    const digits = onlyDigits(raw);
    if (digits.length !== 8 || digits === lastQueried.current) return;
    lastQueried.current = digits;

    /* Cancela a consulta anterior. Sem isso, o cliente que digita
       58000000 e corrige para 58020540 pode ter a primeira resposta
       chegando por último e sobrescrevendo o endereço certo. */
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setMessage(null);

    const result = await getAddressByCep(digits, { signal: controller.signal });

    // Descarta se o cliente já mudou o CEP nesse meio-tempo.
    if (onlyDigits(value) !== digits && lastQueried.current !== digits) return;

    setLoading(false);

    if (result.status === "success") {
      onResolved(result.data);
      setMessage(null);
      // Número é o próximo campo que a pessoa precisa preencher.
      // Economiza um toque e confirma que a busca funcionou.
      requestAnimationFrame(() => document.getElementById(numberFieldId)?.focus());
      return;
    }

    setMessage(CEP_MESSAGES[result.status]);
  };

  // Limpa a requisição pendente se o componente sair da tela.
  useEffect(() => () => controllerRef.current?.abort(), []);

  return (
    <Field
      id="cep"
      label="CEP"
      required
      error={error}
      hint={loading ? undefined : "Preenchemos o endereço para você."}
    >
      <div className="relative">
        <Input
          id="cep"
          hasHint
          invalid={Boolean(error)}
          value={value}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="58000-000"
          maxLength={9}
          onChange={(e) => {
            const formatted = formatCep(e.target.value);
            onChange(formatted);
            setMessage(null);
            // Dispara ao completar os 8 dígitos — sem uma requisição
            // por tecla digitada.
            if (onlyDigits(formatted).length === 8) void lookup(formatted);
          }}
          // Rede de segurança: colar um CEP ou sair do campo também consulta.
          onBlur={(e) => void lookup(e.target.value)}
          className="pr-11"
        />

        {loading && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2"
            role="status"
            aria-label="Buscando endereço"
          >
            <svg viewBox="0 0 24 24" className="size-5 animate-spin text-iridium" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </div>

      {/* Mensagem do ViaCEP separada do erro de validação: uma diz que a
          busca falhou, a outra que o campo está inválido. */}
      {message && (
        <p role="status" className="mt-1 text-xs text-smoke">
          {message}
        </p>
      )}
    </Field>
  );
}
