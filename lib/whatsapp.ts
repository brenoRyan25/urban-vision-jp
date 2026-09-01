import { store } from "@/config/store";
import { formatCurrency, formatPhone, roundMoney } from "@/lib/format";
import type { Order, PaymentMethod } from "@/types/order";
import type { ResolvedCartItem } from "@/types/cart";

/**
 * Funções puras: nenhuma toca `window`.
 *
 * Isso permite testar a mensagem isoladamente e, no futuro, reaproveitar
 * a mesma geração num backend que envie pela API oficial do WhatsApp.
 */

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "Pix",
  cash: "Dinheiro",
  card: "Cartão",
};

/**
 * Identificador curto do pedido, para você citar na conversa em vez de
 * contar itens. Gerado no momento do envio — nunca na renderização, ou
 * o servidor e o cliente produziriam valores diferentes.
 */
export function createOrderReference(): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UV-${random}`;
}

/**
 * Soma quanto o cliente economizou nos itens em oferta.
 * Não usa order.subtotal (que já é líquido, sobre unitPrice) — soma a
 * diferença por linha e depois soma-se de volta para achar o subtotal
 * "cheio", igual a um cupom aplicado num recibo comum.
 */
function calculateDiscount(items: ResolvedCartItem[]): number {
  return roundMoney(
    items.reduce((sum, item) => {
      if (item.originalPrice === undefined || item.originalPrice <= item.unitPrice) {
        return sum;
      }
      return sum + (item.originalPrice - item.unitPrice) * item.quantity;
    }, 0),
  );
}

/**
 * Sem emoji: a marca é streetwear clean, e a mensagem é lida pelo
 * cliente antes de enviar e pela loja depois — os dois merecem texto
 * direto, não um recibo decorado.
 */
export function buildOrderMessage(order: Order): string {
  const lines: string[] = [];

  lines.push(`Olá! Gostaria de fazer um pedido na ${store.name}.`);
  lines.push(`Pedido ${order.reference}`);
  lines.push("");

  lines.push(`*Nome*: ${order.customer.name}`);
  lines.push(`*Telefone*: ${formatPhone(order.customer.phone)}`);
  lines.push("");

  // Retirada não tem endereço: uma linha basta, não precisa de seção vazia.
  if (order.delivery === "delivery") {
    const a = order.address;
    lines.push(`*Endereço*: ${a.street}, ${a.number}`);
    if (a.complement) lines.push(a.complement);
    lines.push(`*Bairro*: ${a.neighborhood}`);
    lines.push(`*Cidade*: ${a.city}`);
  } else {
    lines.push("Retirada na loja");
  }
  lines.push("");

  lines.push(`*Pagamento*: ${PAYMENT_LABELS[order.payment]}`);
  lines.push("");

  lines.push(`*Itens*:`);
  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} x${item.quantity} = ${formatCurrency(item.lineTotal)}`,
    );
  });
  lines.push("");

  const discount = calculateDiscount(order.items);
  const grossSubtotal = roundMoney(order.subtotal + discount);
  lines.push(`*Subtotal*: ${formatCurrency(grossSubtotal)}`);
  if (discount > 0) {
    lines.push(`*Desconto*: -${formatCurrency(discount)}`);
  }

  if (order.delivery === "delivery") {
    const fee =
      order.deliveryFee === null
        ? "a combinar"
        : order.deliveryFee === 0
          ? "Grátis"
          : formatCurrency(order.deliveryFee);
    lines.push(`*Frete*: ${fee}`);
  }

  lines.push(`*Total*: ${formatCurrency(order.total)}`);
  if (order.delivery === "delivery" && order.deliveryFee === null) {
    lines.push(`*Total ainda não inclui a taxa de entrega, a combinar.*`);
  }

  const notes = order.notes?.trim();
  if (notes) {
    lines.push("");
    lines.push(`*Observações*: ${notes}`);
  }

  return lines.join("\n");
}

/**
 * wa.me decide sozinho entre app e WhatsApp Web, então funciona em
 * celular e desktop sem ramificação de código.
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
