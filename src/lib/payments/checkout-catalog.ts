import type { CartItem } from "@/lib/services/checkout.service";

export interface CheckoutProduct {
  id: string;
  name: string;
  status: string;
  currency: string;
  price: number;
  sku: string | null;
  featured_image: string | null;
  discount_transfer_percent: number | null;
  product_variants: {
    id: string;
    price: number;
    sku: string | null;
    option1: string | null;
    image_url: string | null;
  }[];
}

export class CheckoutCatalogError extends Error {}

/** Resolve every line before creating any order or payment preference. */
export function resolveCheckoutItems(
  items: CartItem[],
  products: CheckoutProduct[],
): CartItem[] {
  const byId = new Map(products.map((product) => [product.id, product]));

  return items.map((item) => {
    const product = byId.get(item.productId);
    if (!product || product.status !== "active" || product.currency !== "ARS") {
      throw new CheckoutCatalogError(
        "Un producto ya no esta disponible. Actualiza tu carrito antes de continuar.",
      );
    }

    const variant = item.variantId
      ? product.product_variants.find((entry) => entry.id === item.variantId)
      : undefined;
    if (
      (item.variantId && !variant) ||
      (!item.variantId && product.product_variants.length > 0)
    ) {
      throw new CheckoutCatalogError(
        "La variante no esta disponible. Volve a elegir el producto en la tienda.",
      );
    }

    const price = variant ? variant.price : product.price;
    if (!Number.isFinite(price) || price <= 0) {
      throw new CheckoutCatalogError(
        "Un producto no tiene un precio disponible. Actualiza tu carrito.",
      );
    }
    // Never charge a changed catalog price without the customer's review.
    if (item.price !== price) {
      throw new CheckoutCatalogError(
        "El precio cambio. Quita y agrega el producto al carrito para actualizarlo.",
      );
    }

    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      quantity: item.quantity,
      price,
      name: product.name,
      image: variant?.image_url || product.featured_image || undefined,
      size: variant?.option1 ?? null,
      sku: variant?.sku || product.sku,
    };
  });
}
