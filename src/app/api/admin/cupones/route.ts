import { commerceCrud } from "@/lib/commerce/admin-crud";
import { couponSchema } from "@/lib/commerce/schemas";
const handlers = commerceCrud("coupons", couponSchema);
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
