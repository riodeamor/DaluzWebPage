import { describe, it, expect, vi } from "vitest";
import { formatCurrency, getOrderCustomerName, getStatusLabel, getPaymentMethodLabel } from "./admin-display";
import { OrdersService } from "./services/orders.service";
import { OrdersRepository } from "./repositories/orders.repository";

describe("presentación administrativa", () => {
  it("respeta facturación, envío y usuario del correo, sin depender del perfil", async () => {
    const order = { billing_first_name: " Ana ", billing_last_name: "Paz", shipping_first_name: "Eva", email: "maria@example.com" };
    expect(getOrderCustomerName(order)).toBe("Ana Paz");
    expect(getOrderCustomerName({ ...order, billing_first_name: null, billing_last_name: null })).toBe("Eva");
    expect(getOrderCustomerName({ email: order.email, customer_name: "Cliente" })).toBe("maria");
    expect(getOrderCustomerName({ email: "" })).toBe("—");
    const repo = new OrdersRepository({} as never);
    vi.spyOn(repo, "list").mockResolvedValue({ data: [order], count: 1 });
    expect((await new OrdersService(repo).listOrders({ limit: 10, offset: 0 })).orders[0].customer_name).toBe("Ana Paz");
  });
  it("mantiene el importe en pesos y muestra miles y centavos argentinos", () => {
    expect(formatCurrency(13000).replace(/\s/g, " ")).toBe("$ 13.000,00");
    expect(formatCurrency(9).replace(/\s/g, " ")).toBe("$ 9,00");
    expect(formatCurrency(10000.5).replace(/\s/g, " ")).toBe("$ 10.000,50");
  });
  it("traduce estados de la base y de la pasarela sin cambiar los valores", () => {
    expect(["delivered", "paid", "pending", "cancelled"].map(getStatusLabel)).toEqual(["Entregado", "Pagado", "Pendiente", "Cancelado"]);
    expect(getStatusLabel("awaiting_transfer")).toBe("Pendiente de transferencia");
    expect(getStatusLabel("approved")).toBe("Pagado");
    expect(getStatusLabel("proof_submitted")).toBe("Comprobante enviado");
    expect(getStatusLabel("unknown_enum")).toBe("Estado desconocido");
    expect(getPaymentMethodLabel("credit_card")).toBe("Tarjeta de crédito");
  });
});
