import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/**
 * Field amarra label + controle + erro + dica com os aria-* corretos.
 * Sem ele, a acessibilidade seria repetida em ~12 campos do checkout
 * e esquecida em alguns. Todo campo do projeto passa por aqui.
 */
export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-titanium">
        {label}
        {/* "opcional" explícito em vez de asterisco em obrigatório:
            a maioria dos campos é obrigatória, então marcar a exceção
            gera menos ruído visual e é mais claro. */}
        {!required && <span className="ml-1.5 font-normal text-smoke">opcional</span>}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-smoke">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-surface border bg-graphite px-3.5 text-titanium " +
  "placeholder:text-smoke transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export function Input({
  id,
  invalid,
  hasHint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  invalid?: boolean;
  hasHint?: boolean;
}) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={
        invalid ? `${id}-error` : hasHint ? `${id}-hint` : undefined
      }
      className={cn(
        controlBase,
        "h-12",
        invalid
          ? "border-danger"
          : "border-steel hover:border-titanium/40 focus:border-iridium",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  id,
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  invalid?: boolean;
}) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "min-h-24 resize-y py-3",
        invalid
          ? "border-danger"
          : "border-steel hover:border-titanium/40 focus:border-iridium",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Cartão de escolha para pagamento e entrega.
 * É um <input type="radio"> real por baixo: navegação por setas do
 * teclado, leitura por leitor de tela e submit funcionam de graça —
 * o que um <div onClick> perderia.
 */
export function RadioCard({
  id,
  name,
  value,
  checked,
  onChange,
  title,
  subtitle,
  icon,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex h-full cursor-pointer flex-col gap-1 rounded-surface",
          "border-2 bg-graphite p-4 transition-colors",
          "peer-focus-visible:outline peer-focus-visible:outline-2",
          "peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iridium",
          checked
            ? "border-iridium bg-iridium/10"
            : "border-steel hover:border-titanium/40",
        )}
      >
        <span className="flex items-center gap-2 font-semibold text-titanium">
          {icon}
          {title}
        </span>
        {subtitle && (
          <span className="text-sm leading-snug text-smoke">{subtitle}</span>
        )}
      </label>
    </div>
  );
}
