import {readFile,readdir} from 'node:fs/promises';
import {typedModule} from './lib.mjs';
const {surveyUrl}=await typedModule('src/site.ts');
const {qualtricsUrl}=JSON.parse(await readFile('public/site-config.json','utf8'));
if(!surveyUrl(qualtricsUrl))throw Error('Configure and verify the published Qualtrics anonymous link before release.');
const {parseSnapshot}=await typedModule('shared/snapshot.ts');parseSnapshot(JSON.parse(await readFile('public/data/observations.json','utf8')));
async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())await scan(p);else if(/\.(html|json|js|css|map)$/.test(p)){const s=await readFile(p,'utf8');if(/chatgpt|openai|\/api\/submissions|\/api\/session|oai-authenticated|[A-Za-z]:\\Users\\|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]+/i.test(s))throw Error('Release privacy check failed: '+p);}}}
await scan('dist/client');console.log('Release configuration, public snapshot and built assets passed.');
