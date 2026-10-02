import { z } from "zod";
import { cartItemSchema } from "@/lib/validations/checkout.schema";
export const couponSchema = z.object({
  code: z.string().trim().toUpperCase().min(1).max(40).regex(/^[A-Z0-9_-]+$/),
  type: z.enum(["percent", "fixed"]), value: z.number().finite().positive().multipleOf(0.01).max(999999999),
  minimum_purchase: z.number().finite().nonnegative().multipleOf(0.01).max(999999999).default(0),
  expires_at: z.string().datetime({ offset: true }).nullable().default(null),
  usage_limit: z.number().int().positive().nullable().default(null),
  is_active: z.boolean().default(true), combinable_con_transferencia: z.boolean().default(true),
}).refine(c => c.type !== "percent" || c.value <= 100, "El porcentaje no puede superar 100.");
export const announcementSchema = z.object({
  message: z.string().trim().min(1).max(500),
  link: z.string().trim().max(2000).nullable().default(null).refine(link => !link || (/^\/(?!\/)/.test(link) && !/[\\\s]/.test(link)) || /^https:\/\/[^\s\\]+$/i.test(link), "Usá un enlace interno o HTTPS."),
  is_active: z.boolean().default(true), sort_order: z.number().int().min(0).max(10000).default(0),
});
export const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(100),
  postalCode: z.string().trim().max(12).optional(),
  couponCode: z.string().trim().toUpperCase().max(40).optional(),
  paymentMethod: z.enum(["mercadopago", "bank_transfer"]).default("mercadopago"),
});
