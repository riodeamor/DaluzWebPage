import { describe, it, expect } from "vitest";
import { shippingRegionSchema, coveragesOverlap, coverageSchema, geographicKey } from "./shipping";
const c = (province: string | null, city: string | null, postal_from: number | null, postal_to: number | null) => coverageSchema.parse({province,city,postal_from,postal_to});
describe("regiones configurables y cobertura",()=>{
 it("normaliza acentos, espacios y mayúsculas sin asignar provincias a CP",()=> expect(geographicKey("  CÓRDOBA   Capital ")).toBe("cordoba capital"));
 it("permite una región nueva fuera de las cinco claves anteriores",()=> expect(shippingRegionSchema.parse({name:"Entrega local Mendoza",rate_ars:1234,carrier_id:"00000000-0000-0000-0000-000000000001",is_active:true,coverage:[c("Mendoza","Capital",5500,5599)]}).name).toBe("Entrega local Mendoza"));
 it.each([
  [{province:null,city:"Capital",postal_from:null,postal_to:null}],
  [{province:null,city:null,postal_from:5000,postal_to:null}],
  [{province:null,city:null,postal_from:5999,postal_to:5000}],
  [{province:null,city:null,postal_from:null,postal_to:null}],
 ])("rechaza cobertura inválida %j", coverage => expect(shippingRegionSchema.safeParse({name:"Prueba",rate_ars:10,carrier_id:null,is_active:false,coverage}).success).toBe(false));
 it("los bordes compartidos se superponen",()=> expect(coveragesOverlap(c(null,null,5000,5100),c(null,null,5100,5200))).toBe(true));
 it("rangos adyacentes no se superponen",()=> expect(coveragesOverlap(c(null,null,5000,5099),c(null,null,5100,5200))).toBe(false));
 it("provincia restringe el rango, localidades distintas son disjuntas",()=>{
  expect(coveragesOverlap(c("Córdoba",null,5000,5999),c("Mendoza",null,5000,5999))).toBe(false);
  expect(coveragesOverlap(c("Mendoza","Capital",null,null),c("Mendoza","San Rafael",null,null))).toBe(false);
 });
 it("un rango postal y una provincia sin rango son potencialmente ambiguos",()=> expect(coveragesOverlap(c(null,null,5000,5999),c("Mendoza",null,null,null))).toBe(true));
 it("permite borrador sin tarifa, pero no activarlo",()=>{
  const draft={name:"Por definir",rate_ars:null,carrier_id:null,is_active:false,coverage:[]};
  expect(shippingRegionSchema.safeParse(draft).success).toBe(true);
  expect(shippingRegionSchema.safeParse({...draft,is_active:true}).success).toBe(false);
 });
});
