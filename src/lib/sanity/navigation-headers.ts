import { getClient } from "./client";
import type {HeroSlide} from "@/lib/catalog/headers";
export async function getHomeHeaders():Promise<{heroSlides:HeroSlide[]}|null>{return getClient(false).fetch('*[_type == "homeSettings"][0]{heroSlides[]{_key,isActive,"desktop":imagenDesktop.asset->url,"mobile":imagenMobile.asset->url,titulo,subtitulo,textoBoton,linkDestino}}',{}, {next:{tags:["home-headers"],revalidate:60}}).catch(()=>null)}
export async function getLineHeader(id:string){return getClient(false).fetch('*[_type == "lineSettings" && categoryId == $id][0]{heroBanner{"src":imagen.asset->url,"alt":textoAlt,"href":linkDestino}}',{id},{next:{tags:["line-headers"],revalidate:60}}).catch(()=>null)}
