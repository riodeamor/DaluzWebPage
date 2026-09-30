const pesoFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return pesoFormatter.format(amount);
}

const statusLabels: Readonly<Record<string, string>> = {
  delivered: "Entregado", completed: "Completado", paid: "Pagado",
  approved: "Pagado", pending: "Pendiente", cancelled: "Cancelado",
  canceled: "Cancelado", processing: "Procesando", shipped: "Enviado",
  failed: "Fallido", rejected: "Rechazado", refunded: "Reembolsado",
  partially_refunded: "Reembolsado parcialmente", awaiting_transfer: "Pendiente de transferencia",
  in_process: "En proceso", in_mediation: "En revisión", authorized: "Autorizado",
  charged_back: "Contracargo", expired: "Vencido", proof_submitted: "Comprobante enviado",
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] ?? "Estado desconocido";
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Readonly<Record<string, string>> = {
    credit_card: "Tarjeta de crédito", debit_card: "Tarjeta de débito",
    prepaid_card: "Tarjeta prepaga", bank_transfer: "Transferencia bancaria",
    transfer: "Transferencia bancaria", cash: "Efectivo", ticket: "Pago en efectivo",
    account_money: "Dinero en cuenta", mercadopago: "Mercado Pago",
    visa: "Visa", master: "Mastercard", amex: "American Express",
  };
  return labels[method] ?? "Otro medio de pago";
}

export function getStatusColor(status: string): { bg: string; text: string } {
  if (["delivered", "completed", "paid", "approved"].includes(status))
    return { bg: "rgba(40, 93, 48, 0.15)", text: "#1e5629" };
  if (["pending", "awaiting_transfer", "in_process", "in_mediation"].includes(status))
    return { bg: "rgba(245, 158, 11, 0.15)", text: "#92400e" };
  if (["processing", "shipped", "authorized"].includes(status))
    return { bg: "rgba(29, 63, 106, 0.15)", text: "#0d3a6e" };
  if (["failed", "rejected", "charged_back"].includes(status))
    return { bg: "rgba(139, 0, 0, 0.15)", text: "#8b0000" };
  return { bg: "rgba(107, 114, 128, 0.15)", text: "#4b5563" };
}

export function getOrderCustomerName(order: Record<string, unknown>): string {
  const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
  for (const prefix of ["billing", "shipping"]) {
    const name = [clean(order[`${prefix}_first_name`]), clean(order[`${prefix}_last_name`])].filter(Boolean).join(" ");
    if (name && name.toLowerCase() !== "cliente") return name;
  }
  const email = clean(order.email) || clean(order.customer_email);
  return email.split("@")[0] || "—";
}
