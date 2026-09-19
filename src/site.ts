import config from '../public/site-config.json';
export function surveyUrl(value:string):string|null {
 try { const u=new URL(value); return u.protocol==='https:'&&u.hostname.endsWith('.qualtrics.com')&&/^\/jfe\/form\/SV_[A-Za-z0-9]+$/.test(u.pathname)&&!u.search&&!u.hash&&!u.username&&!u.password?u.href:null; } catch {return null;}
}
export const qualtricsUrl=surveyUrl(config.qualtricsUrl);
