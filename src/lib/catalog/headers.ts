export interface HeroSlide { _key:string; isActive:boolean; desktop?:string; mobile?:string; titulo?:string; subtitulo?:string; textoBoton?:string; linkDestino?:string }
export const safeDestination=(value?:string)=>value && (/^\/(?!\/)/.test(value)||/^https:\/\//.test(value)) ? value : "/productos";
