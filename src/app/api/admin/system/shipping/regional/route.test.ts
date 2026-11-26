import { beforeEach, describe, it, expect, vi } from "vitest";
import { NextResponse } from "next/server";
const m = vi.hoisted(()=>({auth:vi.fn(),from:vi.fn(),insert:vi.fn(),update:vi.fn(),eq:vi.fn(),select:vi.fn(),result:{data:null,error:null} as {data:unknown,error:unknown}}));
vi.mock("@/lib/auth/helpers",()=>({requireAdmin:m.auth}));
vi.mock("next/cache",()=>({revalidateTag:vi.fn()}));
import {POST,PUT} from "./route";
const region={name:"Mendoza configurable",rate_ars:1234,carrier_id:"00000000-0000-0000-0000-000000000001",is_active:true,coverage:[{province:"Mendoza",city:null,postal_from:5500,postal_to:5599}]};
const request=(body:unknown)=>new Request("http://localhost/api/admin/system/shipping/regional",{method:"POST",body:JSON.stringify(body)});
beforeEach(()=>{vi.clearAllMocks();m.result={data:{id:"00000000-0000-0000-0000-000000000002",version:1,...region},error:null};const b={insert:m.insert,update:m.update,eq:m.eq,select:m.select,single:async()=>m.result,maybeSingle:async()=>m.result};for(const fn of [m.insert,m.update,m.eq,m.select])fn.mockReturnValue(b);m.from.mockReturnValue(b);m.auth.mockResolvedValue({ok:true,supabase:{from:m.from}});});
describe("Admin de regiones configurable",()=>{
 it("deniega escritura sin admin antes de consultar datos",async()=>{m.auth.mockResolvedValue({ok:false,response:NextResponse.json({error:"Forbidden"},{status:403})});expect((await POST(request(region))).status).toBe(403);expect(m.from).not.toHaveBeenCalled();});
 it("crea en tabla nueva y normaliza cobertura; no toca zonas/config anterior",async()=>{expect((await POST(request(region))).status).toBe(201);expect(m.from).toHaveBeenCalledWith("shipping_regions");expect(m.insert).toHaveBeenCalledWith(expect.objectContaining({coverage:[{province:"mendoza",city:null,postal_from:5500,postal_to:5599}]}));expect(m.from).toHaveBeenCalledTimes(1);});
 it("rechaza actividad sin tarifa/transportista y rango invertido",async()=>{expect((await POST(request({...region,rate_ars:null}))).status).toBe(400);expect((await POST(request({...region,coverage:[{province:null,city:null,postal_from:5599,postal_to:5500}]}))).status).toBe(400);expect(m.insert).not.toHaveBeenCalled();});
 it("una superposición SQL no se informa como guardada",async()=>{m.result={data:null,error:{code:"P0001",message:"La cobertura se superpone con otra región activa"}};const response=await POST(request(region));expect(response.status).toBe(400);expect((await response.json()).error).toMatch(/superpone/);});
 it("edita por ID y versión; conflicto preserva borrador del cliente",async()=>{m.result={data:null,error:null};expect((await PUT(request({...region,kind:"region",id:"00000000-0000-0000-0000-000000000002",version:3}))).status).toBe(409);expect(m.eq).toHaveBeenCalledWith("version",3);});
 it("guarda umbral configurable y activación sólo en policy",async()=>{const response=await PUT(request({kind:"policy",enabled:true,free_shipping_threshold_ars:90000,version:1}));expect(response.status).toBe(200);expect(m.from).toHaveBeenCalledWith("shipping_policy");expect(m.update).toHaveBeenCalledWith({enabled:true,free_shipping_threshold_ars:90000});expect(m.eq).toHaveBeenCalledWith("version",1);});
});
