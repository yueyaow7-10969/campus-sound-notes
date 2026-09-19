import {activities,natureValues,Observation,sources} from './domain';
export type Snapshot={schema_version:1;updated_at:string|null;records:Observation[]};
const fields=['id','place_name','observed_at','public_latitude','public_longitude','source','disturbance','activity','note','weather','nature_presence','kind'];
export function parseSnapshot(value:unknown):Snapshot {
 const bad=()=>{throw Error('The map data is not valid. Please try again after the next update.');};
 if(!value||typeof value!=='object')return bad();
 const s=value as Snapshot;
 if(s.schema_version!==1||!Array.isArray(s.records)||!(s.updated_at===null||validDate(s.updated_at))||(!s.updated_at&&s.records.length))return bad();
 const ids=new Set<string>();
 for(const r of s.records){
  if(!r||Object.keys(r).some(k=>!fields.includes(k))||!/^CSN-[A-Za-z0-9-]{3,64}$/.test(r.id)||ids.has(r.id))return bad();
  ids.add(r.id);
  if(typeof r.place_name!=='string'||!r.place_name.trim()||r.place_name.length>100||!validDate(r.observed_at)||Date.parse(r.observed_at)>Date.parse(s.updated_at!))return bad();
  if(typeof r.public_latitude!=='number'||r.public_latitude<1.275||r.public_latitude>1.325||typeof r.public_longitude!=='number'||r.public_longitude<103.755||r.public_longitude>103.795)return bad();
  if(![r.public_latitude,r.public_longitude].every(n=>Number.isFinite(n)&&Math.abs(n*1000-Math.round(n*1000))<1e-7))return bad();
  if(!(sources as readonly string[]).includes(r.source)||!(activities as readonly string[]).includes(r.activity)||!Number.isInteger(r.disturbance)||r.disturbance<1||r.disturbance>5)return bad();
  if(!['real','hypothetical'].includes(r.kind)||!(r.nature_presence===null||(natureValues as readonly string[]).includes(r.nature_presence))||![null,'dry','rain','unsure'].includes(r.weather))return bad();
  if(!(r.note===null||typeof r.note==='string'&&r.note.length<=500))return bad();
 }
 return {schema_version:1,updated_at:s.updated_at,records:s.records};
}
function validDate(s:unknown):s is string{
 if(typeof s!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(Z|[+-]\d\d:\d\d)$/.test(s)||!Number.isFinite(Date.parse(s)))return false;
 const zone=s.match(/([+-])(\d\d):(\d\d)$/),offset=zone?(Number(zone[2])*60+Number(zone[3]))*60000*(zone[1]==='+'?1:-1):0;
 return new Date(Date.parse(s)+offset).toISOString().slice(0,19)===s.slice(0,19);
}
