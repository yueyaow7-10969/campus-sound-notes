export type LocationFields={latitude:string;longitude:string;accuracy_m:string;captured_at:string;location_source:'device'|'preset'|'manual';location_issue:string};
/** Use explicit participant location fields only, never Qualtrics IP-derived metadata. */
export function resolveLocation(row:Record<string,string>,preset?:{latitude:number;longitude:number}):LocationFields {
 const raw=(key:string)=>(row['__js_csn_'+key]||'').trim();
 const source=raw('location_source'),lat=raw('latitude'),lon=raw('longitude'),accuracy=raw('accuracy_m'),captured=raw('captured_at');
 const empty={latitude:'',longitude:'',accuracy_m:'',captured_at:'',location_source:'manual' as const,location_issue:''};
 if(![source,lat,lon,accuracy,captured].some(Boolean))return preset?{...empty,latitude:String(preset.latitude),longitude:String(preset.longitude),location_source:'preset'}:empty;
 const latitude=Number(lat),longitude=Number(lon),a=Number(accuracy);
 if(source!=='device'||!lat||!lon||!accuracy||!Number.isFinite(latitude)||latitude<1.275||latitude>1.325||!Number.isFinite(longitude)||longitude<103.755||longitude>103.795||!Number.isFinite(a)||a<=0||a>50000||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(captured)||!Number.isFinite(Date.parse(captured)))return {...empty,location_issue:'Invalid or incomplete device coordinates: resolve before publishing.'};
 return {latitude:String(latitude),longitude:String(longitude),accuracy_m:String(a),captured_at:captured,location_source:'device',location_issue:a>100?'Device accuracy exceeds 100 m: check the observation location.':''};
}
