import {readFile,writeFile} from 'node:fs/promises';
import {parseCSV,typedModule} from './lib.mjs';
const [input,updatedAt]=process.argv.slice(2);
if(!input||!updatedAt)throw Error('Usage: npm run data:publish -- private-data/review.csv 2026-09-19T12:00:00+08:00');
const rows=parseCSV(await readFile(input,'utf8')),headers=rows.shift(),records=[];
for(const line of rows){const r=Object.fromEntries(headers.map((h,i)=>[h,line[i]||'']));if(r.publish!=='yes')continue;
 for(const key of ['place_name','note','location_detail'])r[key]=r[key]?.replace(/^'(?=\s*[=+@-])/,'')||'';
 if(r.consent!=='yes')throw Error('Cannot publish without consent.');
 if(r.location_issue?.trim())throw Error('Resolve and clear the location issue before publishing.');
 if(!r.latitude||!r.longitude)throw Error('Resolve the public place coordinates before publishing.');
 if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:00\+08:00$/.test(r.observed_at)||Date.parse(r.observed_at)>Date.parse(updatedAt))throw Error('Check observation time and SGT format.');
 for(const text of [r.place_name,r.note])if(/@|https?:\/\/|(?:\+?\d[\s()-]*){8,}|(?:[A-Za-z]:\\|\/Users\/)/.test(text))throw Error('Review possible contact details or private paths before publication.');
 records.push({id:r.id,place_name:r.place_name,observed_at:r.observed_at,public_latitude:Math.round(Number(r.latitude)*1000)/1000,public_longitude:Math.round(Number(r.longitude)*1000)/1000,source:r.source,disturbance:Number(r.disturbance),activity:r.activity,nature_presence:r.nature_presence||null,weather:r.weather||null,note:r.note||null,kind:r.kind});
}
const {parseSnapshot}=await typedModule('shared/snapshot.ts');
const snapshot=parseSnapshot({schema_version:1,updated_at:updatedAt,records});
await writeFile('public/data/observations.json',JSON.stringify(snapshot,null,2)+'\n');
console.log(`Published snapshot with ${records.length} explicitly approved rows. Raw fields are excluded.`);
