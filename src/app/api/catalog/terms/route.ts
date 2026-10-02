import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export async function GET() {
 const db=await createClient(); const {data,error}=await db.from("catalog_terms").select("*").eq("is_active",true).order("sort_order").order("id");
 return error?NextResponse.json({error:"Taxonomía no disponible"},{status:503}):NextResponse.json({terms:data},{headers:{"Cache-Control":"no-store"}});
}
