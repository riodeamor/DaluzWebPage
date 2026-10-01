import { describe, expect, it } from "vitest";
import type { CartItem } from "@/lib/services/checkout.service";
import {
  CheckoutCatalogError,
  type CheckoutProduct,
  resolveCheckoutItems,
} from "./checkout-catalog";

const product: CheckoutProduct = {
  id: "p1",
  name: "Formula del catalogo",
  status: "active",
  currency: "ARS",
  price: 1250.5,
  sku: "SKU-1",
  featured_image: "https://example.com/product.jpg",
  discount_transfer_percent: 10,
  product_variants: [],
};
const item: CartItem = {
  productId: "p1",
  name: "Nombre enviado por el navegador",
  price: 1250.5,
  quantity: 2,
  image: "https://example.com/untrusted.jpg",
  size: "Tamano inventado",
  sku: "SKU-inventado",
};
const variant = {
  id: "v1",
  price: 2500,
  sku: "SKU-V1",
  option1: "100ml",
  image_url: "https://example.com/variant.jpg",
};

describe("resolveCheckoutItems", () => {
  it("builds the order line from the catalog, preserving only quantity and selection", () => {
    expect(resolveCheckoutItems([item], [product])).toEqual([{
      productId: "p1", variantId: null, quantity: 2, price: 1250.5,
      name: product.name, image: product.featured_image, size: null, sku: "SKU-1",
    }]);
  });

  it.each([0.01, 1, 1250, 1300, Infinity, NaN])(
    "rejects a manipulated or stale price %s",
    (price) => {
      expect(() => resolveCheckoutItems([{ ...item, price }], [product]))
        .toThrow(CheckoutCatalogError);
    },
  );

  it.each(["draft", "archived"])("rejects %s products", (status) => {
    expect(() => resolveCheckoutItems([item], [{ ...product, status }]))
      .toThrow(CheckoutCatalogError);
  });

  it("rejects missing products and unsupported currency", () => {
    expect(() => resolveCheckoutItems([item], [])).toThrow(CheckoutCatalogError);
    expect(() => resolveCheckoutItems([item], [{ ...product, currency: "USD" }]))
      .toThrow(CheckoutCatalogError);
  });

  it.each([0, -1, NaN, Infinity])("rejects invalid catalog prices %s", (price) => {
    expect(() => resolveCheckoutItems([item], [{ ...product, price }]))
      .toThrow(CheckoutCatalogError);
  });

  it("uses the selected variant's price and metadata", () => {
    const result = resolveCheckoutItems(
      [{ ...item, variantId: "v1", price: 2500 }],
      [{ ...product, product_variants: [variant] }],
    );
    expect(result[0]).toEqual({
      productId: "p1", variantId: "v1", quantity: 2, price: 2500,
      name: product.name, image: variant.image_url, size: "100ml", sku: "SKU-V1",
    });
  });

  it("rejects a variant from another product", () => {
    expect(() => resolveCheckoutItems(
      [{ ...item, variantId: "v2" }],
      [product, { ...product, id: "p2", product_variants: [{ ...variant, id: "v2" }] }],
    )).toThrow(CheckoutCatalogError);
  });

  it("cannot bypass variant pricing by omitting the variant or using the base price", () => {
    const catalog = [{ ...product, product_variants: [variant] }];
    expect(() => resolveCheckoutItems([item], catalog)).toThrow(CheckoutCatalogError);
    expect(() => resolveCheckoutItems([{ ...item, variantId: "v1" }], catalog))
      .toThrow(CheckoutCatalogError);
  });

  it("validates every line in a mixed cart", () => {
    expect(() => resolveCheckoutItems(
      [item, { ...item, productId: "missing" }], [product],
    )).toThrow(CheckoutCatalogError);
  });
});
