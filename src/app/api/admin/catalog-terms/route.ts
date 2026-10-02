import {z} from "zod";import {commerceCrud} from "@/lib/commerce/admin-crud";
const handlers=commerceCrud("catalog_terms",z.object({slug:z.string().regex(/^[a-z0-9-]{1,80}$/),label:z.string().trim().min(1).max(120),kind:z.enum(["anatomy","need"]),group_name:z.enum(["facial","capilar"]).nullable(),sort_order:z.number().int(),is_active:z.boolean()}));export const {GET,POST,PUT,DELETE}=handlers;
