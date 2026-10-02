"use client";
import {useCatalogTerms} from "@/hooks/useCatalogTerms";
import {Input} from "@/components/ui/input";
export default function CatalogFields({value,onChange}:{value:{catalog_term_ids:string[];is_kit:boolean;audio_url:string;pdf_url:string};onChange:(patch:Partial<typeof value>)=>void}){
 const terms=useCatalogTerms();
 return <fieldset><legend>Taxonomía y archivos externos</legend>
 {(["anatomy","need"] as const).map(kind=><fieldset key={kind}><legend>{kind==="anatomy"?"Categorías anatómicas":"Biotipos y necesidades"}</legend>{terms.filter(t=>t.kind===kind).map(t=><label key={t.id}><input type="checkbox" checked={value.catalog_term_ids.includes(t.id)} onChange={e=>onChange({catalog_term_ids:e.target.checked?[...value.catalog_term_ids,t.id]:value.catalog_term_ids.filter(id=>id!==t.id)})}/>{t.label}</label>)}</fieldset>)}
 <label><input type="checkbox" checked={value.is_kit} onChange={e=>onChange({is_kit:e.target.checked})}/>Kit o sinergia</label>
 <label>Audio externo (HTTPS)<Input type="url" value={value.audio_url} onChange={e=>onChange({audio_url:e.target.value})}/></label>
 <label>PDF externo (HTTPS)<Input type="url" value={value.pdf_url} onChange={e=>onChange({pdf_url:e.target.value})}/></label>
 </fieldset>;
}
