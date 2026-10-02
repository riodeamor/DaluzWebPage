export const obsoleteConfig=(key:string)=>key==="seo_twitter_handle"||key==="maintenance_mode"||/^brand_.*color$/.test(key);
