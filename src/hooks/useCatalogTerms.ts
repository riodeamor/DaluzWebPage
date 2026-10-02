"use client";
import {useEffect,useState} from "react";
import type {CatalogTerm} from "@/lib/catalog/search";
export function useCatalogTerms(){
 const [terms,setTerms]=useState<CatalogTerm[]>([]);
 useEffect(()=>{const abort=new AbortController();fetch("/api/catalog/terms",{signal:abort.signal}).then(r=>r.ok?r.json():Promise.reject()).then(d=>setTerms(d.terms)).catch(()=>{});return()=>abort.abort();},[]);
 return terms;
}
