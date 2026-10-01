import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Types
// ============================================

export interface OrderListFilters {
  status?: string | null;
  limit: number;
  offset: number;
}

export interface PaymentOrderSnapshot {
  id: string;
  status: string;
  payment_status: string | null;
  mercadopago_payment_id: string | number | null;
  total_amount: number;
  currency: string;
  updated_at: string;
}

export class PaymentConflictError extends Error {
  constructor() {
    super("El pedido cambio mientras se procesaba el pago. Volve a intentarlo.");
  }
}

// ============================================
// Repository
// ============================================

export class OrdersRepository {
  constructor(private supabase: SupabaseClient) {}

  // ---- Orders ----

  async insert(data: Record<string, unknown>) {
    const { data: order, error } = await this.supabase
      .from("orders")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return order;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async findByIdWithItems(id: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product_name,
          variant_title
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async update(id: string, data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  /** A single conditional UPDATE elects one winner across server instances. */
  async updatePaymentIfUnchanged(
    order: PaymentOrderSnapshot,
    changes: Record<string, unknown>,
  ): Promise<boolean> {
    let query = this.supabase
      .from("orders")
      .update(changes)
      .eq("id", order.id)
      .eq("status", order.status)
      .eq("updated_at", order.updated_at)
      .eq("total_amount", order.total_amount)
      .eq("currency", order.currency);

    query = order.payment_status === null
      ? query.is("payment_status", null)
      : query.eq("payment_status", order.payment_status);
    query = order.mercadopago_payment_id === null
      ? query.is("mercadopago_payment_id", null)
      : query.eq("mercadopago_payment_id", order.mercadopago_payment_id);

    const { data, error } = await query.select("id").maybeSingle();
    if (error) throw error;
    return data !== null;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async confirmPayment(order: PaymentOrderSnapshot, payment: Record<string, unknown>): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("confirm_order_payment_once", {
      p_order_id: order.id, p_expected: order, p_payment: payment,
    });
    if (error) {
      if (error.code === "40001") throw new PaymentConflictError();
      throw error;
    }
    return data === true;
  }

  async list(filters: OrderListFilters): Promise<{
    data: any[];
    count: number | null;
  }> {
    let query = this.supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        email,
        billing_first_name,
        billing_last_name,
        shipping_first_name,
        shipping_last_name,
        status,
        payment_status,
        total_amount,
        currency,
        created_at,
        updated_at,
        mp_payment_id,
        mp_payment_method,
        mp_payment_type,
        order_items (
          id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], count };
  }

  async getAllStatuses(): Promise<{ status: string }[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("status");

    if (error) throw error;
    return data || [];
  }

  async getPaidRevenueSince(since: string): Promise<{ total_amount: number }[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", since);

    if (error) throw error;
    return data || [];
  }

  async getRecent(limit: number) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("id, order_number, email, billing_first_name, billing_last_name, shipping_first_name, shipping_last_name, status, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // ---- Order Items ----

  async insertItems(items: Record<string, unknown>[]): Promise<void> {
    const { error } = await this.supabase
      .from("order_items")
      .insert(items);

    if (error) throw error;
  }

  async getItemsByOrderId(orderId: string) {
    const { data, error } = await this.supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }

  async removeItemsByOrderId(orderId: string): Promise<void> {
    const { error } = await this.supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (error) throw error;
  }
}
