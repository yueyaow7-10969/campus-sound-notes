import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {parseCSV,csv,typedModule} from './lib.mjs';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Usage: npm run data:prepare -- private-data/export.csv private-data/review.csv');
if(!resolve(output).startsWith(resolve('private-data')+'/')&&!resolve(output).startsWith(resolve('private-data')+'\\'))throw Error('Review files must stay in private-data/.');
const rows=parseCSV(await readFile(input,'utf8')),headers=rows.shift();
const required=['place','date','time','source','disturbance','activity','consent'];
if(!headers||required.some(h=>!headers.includes(h)))throw Error('Export with question tags: '+required.join(', '));
const {publicPlaces}=await typedModule('src/publicPlaces.ts');
const fields=['id','publish','kind','place_name','observed_at','latitude','longitude','source','disturbance','activity','nature_presence','weather','note','consent','location_detail'];
const result=[fields];let skipped=0;
for(const line of rows){const r=Object.fromEntries(headers.map((h,i)=>[h,line[i]||'']));
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)){skipped++;continue;}
 if(r.Finished&&!['1','true','True'].includes(r.Finished)){skipped++;continue;}
 if(!['1','yes','Yes','I agree'].includes(r.consent)){skipped++;continue;}
 const place=publicPlaces.find(p=>p.name===r.place);
 const item={id:'CSN-'+randomUUID(),publish:'no',kind:'real',place_name:place?.name||r.location_detail,observed_at:r.date+'T'+r.time+':00+08:00',latitude:place?.latitude??'',longitude:place?.longitude??'',source:r.source.toLowerCase(),disturbance:r.disturbance.match(/^[1-5]/)?.[0]||'',activity:r.activity.toLowerCase(),nature_presence:({'None heard':'none','In the background':'background','Clearly audible':'clear','Dominant':'dominant','Unsure':'unsure'})[r.nature]||r.nature?.toLowerCase()||'',weather:r.weather?.toLowerCase()||'',note:r.note||'',consent:'yes',location_detail:r.location_detail||''};
 result.push(fields.map(f=>item[f]));
}
await mkdir(dirname(resolve(output)),{recursive:true});await writeFile(output,csv(result));
console.log(`Prepared ${result.length-1} rows for private review; skipped ${skipped} headers/incomplete/non-consenting rows. Nothing published. Reuse this review file to keep IDs stable.`);
