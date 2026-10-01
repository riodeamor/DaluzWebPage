import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { CheckoutProduct } from "@/lib/payments/checkout-catalog";
import type { CartItem } from "@/lib/services/checkout.service";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  findManyByIds: vi.fn(),
  createOrder: vi.fn(),
  createOrderItems: vi.fn(),
  createMercadoPagoPreference: vi.fn(),
  markOrderFailed: vi.fn(),
  getConfigs: vi.fn(),
  findByIdWithItems: vi.fn(),
  sendBankTransferInstructions: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("next/headers", () => ({ cookies: () => ({ get: vi.fn() }) }));
vi.mock("@/lib/auth/helpers", () => ({ getServiceClient: () => ({}) }));
vi.mock("@/lib/repositories/products.repository", () => ({
  ProductsRepository: class { findManyByIds = mocks.findManyByIds; },
}));
vi.mock("@/lib/repositories/orders.repository", () => ({
  OrdersRepository: class { findByIdWithItems = mocks.findByIdWithItems; },
}));
vi.mock("@/lib/repositories/system.repository", () => ({
  SystemRepository: class { getConfigs = mocks.getConfigs; },
}));
vi.mock("@/lib/services/checkout.service", () => ({
  CheckoutService: class {
    createOrder = mocks.createOrder;
    createOrderItems = mocks.createOrderItems;
    createMercadoPagoPreference = mocks.createMercadoPagoPreference;
    markOrderFailed = mocks.markOrderFailed;
  },
}));
vi.mock("@/lib/email/notifications", () => ({
  EmailNotificationService: { sendBankTransferInstructions: mocks.sendBankTransferInstructions },
}));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), error: vi.fn() } }));

import { POST } from "./route";

const product: CheckoutProduct = {
  id: "p1", name: "Formula", status: "active", currency: "ARS", price: 1000,
  sku: "SKU-1", featured_image: null, discount_transfer_percent: 10,
  product_variants: [],
};
const item = { productId: "p1", name: "Untrusted", price: 1000, quantity: 2 };
const customerInfo = { email: "test@example.com", addressNumber: "123" };
const canonicalItem = {
  productId: "p1", variantId: null, name: "Formula", price: 1000,
  quantity: 2, image: undefined, size: null, sku: "SKU-1",
};

function request(paymentMethod?: string, items: CartItem[] = [item]) {
  return new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    body: JSON.stringify({ items, customerInfo, paymentMethod }),
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
}
function expectNoOrder() {
  expect(mocks.createOrder).not.toHaveBeenCalled();
  expect(mocks.createOrderItems).not.toHaveBeenCalled();
  expect(mocks.createMercadoPagoPreference).not.toHaveBeenCalled();
  expect(mocks.sendBankTransferInstructions).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
  mocks.findManyByIds.mockResolvedValue([product]);
  mocks.createOrder.mockResolvedValue({ id: "o1" });
  mocks.createOrderItems.mockResolvedValue(undefined);
  mocks.createMercadoPagoPreference.mockResolvedValue({ preferenceId: "mp1", initPoint: "https://example.com/pay" });
  mocks.findByIdWithItems.mockResolvedValue({ id: "o1" });
  mocks.getConfigs.mockResolvedValue([
    { config_key: "bank_transfer_alias", config_value: "prueba.alias" },
    { config_key: "bank_transfer_bank", config_value: "Banco de prueba" },
    { config_key: "bank_transfer_holder", config_value: "Titular de prueba" },
    { config_key: "bank_transfer_cbu", config_value: JSON.stringify("1234567890123456789012") },
  ]);
});

describe("POST /api/checkout catalog validation", () => {
  it.each(["mercadopago", "bank_transfer"])("rejects tampered prices before writing for %s", async (method) => {
    const response = await POST(request(method, [{ ...item, price: 1 }]));
    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain("precio");
    expectNoOrder();
  });

  it.each(["mercadopago", "bank_transfer"])("rejects a missing product for %s", async (method) => {
    mocks.findManyByIds.mockResolvedValue([]);
    expect((await POST(request(method))).status).toBe(409);
    expectNoOrder();
  });

  it.each(["mercadopago", "bank_transfer"])("fails closed if the catalog cannot be read for %s", async (method) => {
    mocks.findManyByIds.mockRejectedValue(new Error("Catalog unavailable"));
    expect((await POST(request(method))).status).toBe(500);
    expectNoOrder();
  });

  it("preserves the default Mercado Pago response and passes catalog data to payment", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ method: "mercadopago", id: "mp1", init_point: "https://example.com/pay" });
    expect(mocks.createOrder).toHaveBeenCalledWith("u1", customerInfo, [canonicalItem]);
    expect(mocks.createOrderItems).toHaveBeenCalledWith("o1", [canonicalItem]);
    expect(mocks.createMercadoPagoPreference).toHaveBeenCalledWith({ id: "o1" }, [canonicalItem], customerInfo);
  });

  it("keeps transfer discounts based on catalog prices and stored percentages", async () => {
    const response = await POST(request("bank_transfer"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ method: "bank_transfer", redirectUrl: "/checkout/transferencia/o1" });
    expect(mocks.createOrder).toHaveBeenCalledWith("u1", customerInfo, [canonicalItem], "bank_transfer", {
      subtotal: 2000, discount: 200, total: 1800,
    });
    expect(mocks.createOrderItems).toHaveBeenCalledWith("o1", [canonicalItem]);
    expect(mocks.createMercadoPagoPreference).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated checkout before reading the catalog", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    expect((await POST(request())).status).toBe(401);
    expect(mocks.findManyByIds).not.toHaveBeenCalled();
    expectNoOrder();
  });

  it.each(["mercadopago", "bank_transfer"])("rejects an invalid variant before writing for %s", async (method) => {
    expect((await POST(request(method, [{ ...item, variantId: "other-product-variant" }]))).status).toBe(409);
    expectNoOrder();
  });

  it.each(["mercadopago", "bank_transfer"])("uses variant pricing for %s", async (method) => {
    mocks.findManyByIds.mockResolvedValue([{
      ...product,
      product_variants: [{ id: "v1", price: 1500, sku: "V1", option1: "100ml", image_url: null }],
    }]);
    const response = await POST(request(method, [{ ...item, variantId: "v1", price: 1500 }]));
    expect(response.status).toBe(200);
    expect(mocks.createOrderItems).toHaveBeenCalledWith("o1", [{
      ...canonicalItem, variantId: "v1", price: 1500, sku: "V1", size: "100ml",
    }]);
    if (method === "bank_transfer") {
      expect(mocks.createOrder.mock.calls[0][4]).toEqual({ subtotal: 3000, discount: 300, total: 2700 });
    }
  });
});
