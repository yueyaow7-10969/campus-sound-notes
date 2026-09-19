export const sources=['traffic','construction','equipment','people','nature','other','unsure'] as const;
export const activities=['walking','studying','resting','waiting','socialising','working','other'] as const;
export const natureValues=['none','background','clear','dominant','unsure'] as const;
export const ratings=['Not at all · Did not affect my activity.','Slightly · Noticed it, but easy to continue.','Moderately · Distracted me at times.','Very · Made it hard to continue.','Extremely · I stopped or changed my activity.'];
export const natureLabels={none:'None heard',background:'In the background',clear:'Clearly audible',dominant:'Dominant',unsure:'Unsure'};
export type Observation={id:string;place_name:string;observed_at:string;public_latitude:number;public_longitude:number;source:string;disturbance:number;activity:string;note:string|null;weather:string|null;nature_presence:string|null;kind:'real'|'hypothetical'};
export const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);
export function soundscape(rows:Observation[],layer:'disturbance'|'nature'){
 const groups=new Map<string,Observation[]>();
 rows.forEach(r=>{const key=`${r.public_latitude.toFixed(3)},${r.public_longitude.toFixed(3)}`;groups.set(key,[...(groups.get(key)||[]),r]);});
 return [...groups.entries()].map(([id,rs])=>{const valid=layer==='nature'?rs.filter(r=>['none','background','clear','dominant'].includes(r.nature_presence||'')):rs;const numerator=valid.filter(r=>layer==='nature'?['clear','dominant'].includes(r.nature_presence||''):r.disturbance>=4).length;return {id,name:rs[0].place_name,latitude:rs[0].public_latitude,longitude:rs[0].public_longitude,total:rs.length,numerator,denominator:valid.length,percent:valid.length?Math.round(numerator/valid.length*100):null};});
}
