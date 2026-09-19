import {mkdir,copyFile,readdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
if(!process.argv.includes('--draft'))execFileSync(process.execPath,['scripts/check-release.mjs'],{stdio:'inherit'});
const root=resolve('release/pages');await mkdir(root,{recursive:true});
const files=['README.md','package.json','package-lock.json','index.html','tsconfig.json','vite.config.ts','.gitignore','src/Boundary.tsx','src/Explore.tsx','src/Form.tsx','src/Map.tsx','src/main.tsx','src/ui.tsx','src/site.ts','src/data.ts','src/publicPlaces.ts','src/base.css','src/theme.css','src/app.css','src/botanical.svg','src/env.d.ts','shared/domain.ts','shared/snapshot.ts','shared/location.ts','scripts/lib.mjs','scripts/prepare-data.mjs','scripts/publish-data.mjs','scripts/check-release.mjs','scripts/package-pages.mjs','tests/static-data.test.mjs','tests/location.test.mjs','qualtrics/campus-sound-notes-survey.txt','qualtrics/SETUP.md','qualtrics/location-question.js','public/site-config.json','public/data/observations.json'];
for(const f of files){const to=resolve(root,f);await mkdir(dirname(to),{recursive:true});await copyFile(f,to);}
// Clear only previous compiled files in the strictly scoped release/docs directory.
const docs=resolve(root,'docs');const {rm}=await import('node:fs/promises');
if(docs!==resolve('release/pages/docs'))throw Error('Unexpected target.');
await rm(docs,{recursive:true,force:true});
async function copyTree(from,to){await mkdir(to,{recursive:true});for(const e of await readdir(from,{withFileTypes:true})){if(e.isDirectory())await copyTree(from+'/'+e.name,to+'/'+e.name);else await copyFile(from+'/'+e.name,to+'/'+e.name);}}
await copyTree('dist/client',docs);await writeFile(docs+'/.nojekyll','');
const findings=[];
async function audit(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name==='.git')continue;const p=dir+'/'+e.name;if(e.isDirectory())await audit(p);else{const text=await readFile(p,'utf8');if(!p.endsWith('/scripts/check-release.mjs')&&!p.endsWith('/scripts/package-pages.mjs')&&/chatgpt|oai-authenticated|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]+/i.test(text))findings.push(p.slice(root.length+1));}}}
await audit(root);if(findings.length)throw Error('Package audit requires review: '+findings.join(', '));
console.log(`Prepared ${files.length} allowlisted source files and compiled docs. Private exports and previous history excluded.${process.argv.includes('--draft')?' DRAFT: not ready to activate.':''}`);
