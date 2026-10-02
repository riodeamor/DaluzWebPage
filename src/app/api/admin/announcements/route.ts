import { commerceCrud } from "@/lib/commerce/admin-crud";
import { announcementSchema } from "@/lib/commerce/schemas";
const handlers = commerceCrud("announcements", announcementSchema);
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
