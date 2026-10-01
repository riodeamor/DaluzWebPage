import { SupabaseClient } from "@supabase/supabase-js";
import type { CheckoutProduct } from "@/lib/payments/checkout-catalog";

// ============================================
// Repository
// ============================================

export class ProductsRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * Catalogo de checkout en lote: precios, variantes y descuentos del servidor.
   */
  async findManyByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const { data, error } = await this.supabase
      .from("products")
      .select(`
        id, name, status, currency, price, sku, featured_image,
        discount_transfer_percent,
        product_variants (id, price, sku, option1, image_url)
      `)
      .in("id", Array.from(new Set(ids)));

    if (error) throw error;
    return (data || []) as CheckoutProduct[];
  }

  async update(id: string, data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const { error } = await this.supabase.rpc("decrease_product_stock", {
      product_id: productId,
      quantity,
    });

    if (error) throw error;
  }
}
