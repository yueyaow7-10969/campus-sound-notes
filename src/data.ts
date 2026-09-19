import {Observation} from '../shared/domain';
import {parseSnapshot,Snapshot} from '../shared/snapshot';
export async function loadSnapshot(signal?:AbortSignal):Promise<Snapshot> {
 const response=await fetch(`${import.meta.env.BASE_URL}data/observations.json`,{signal,cache:'no-cache'});
 if(!response.ok)throw Error('The map data could not load. Please try again.');
 return parseSnapshot(await response.json());
}
export async function loadNote(id:string,signal?:AbortSignal):Promise<Observation> {
 const s=await loadSnapshot(signal),r=s.records.find(r=>r.id===id);
 if(!r)throw Error('This observation is not in the current map update.'); return r;
}
