import type { SupabaseClient } from "@supabase/supabase-js";
import type { PreparedEmail } from "@/lib/email/durable-delivery";

export interface PaymentEffect {
  id: string;
  order_id: string;
  kind: "order_confirmation";
  claim_token: string;
  payload: PreparedEmail | null;
}

export class PaymentEffectsRepository {
  constructor(private supabase: SupabaseClient) {}

  async claim(orderId?: string): Promise<PaymentEffect | null> {
    const { data, error } = await this.supabase.rpc("claim_payment_effect", { p_order_id: orderId ?? null });
    if (error) throw error;
    return data?.[0] ?? null;
  }

  async prepare(effect: PaymentEffect, payload: PreparedEmail): Promise<PreparedEmail> {
    const { data, error } = await this.supabase.rpc("prepare_payment_email", {
      p_id: effect.id, p_token: effect.claim_token, p_payload: payload,
    });
    if (error) throw error;
    return data as PreparedEmail;
  }

  async beginSend(effect: PaymentEffect): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("begin_payment_email_send", {
      p_id: effect.id, p_token: effect.claim_token,
    });
    if (error) throw error;
    return data === true;
  }

  async finish(effect: PaymentEffect, result: { success: boolean; error?: string; manual?: boolean; providerId?: string }): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("finish_payment_effect", {
      p_id: effect.id, p_token: effect.claim_token, p_success: result.success,
      p_error: result.error ?? null, p_manual: result.manual ?? false, p_provider_id: result.providerId ?? null,
    });
    if (error) throw error;
    return data === true;
  }

  async reviewCount(): Promise<number> {
    const { count, error } = await this.supabase.from("payment_effects")
      .select("id", { count: "exact", head: true }).eq("state", "manual_review");
    if (error) throw error;
    return count ?? 0;
  }
}
