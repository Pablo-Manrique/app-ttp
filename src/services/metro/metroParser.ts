import type { MetroArrival, MetroStation, StationArrivals } from '../../types/transport';
export interface RawTeleindicator { linea?:unknown; nombreli?:unknown; estaciontel?:unknown; idnumerica?:unknown; nombreest?:unknown; anden?:unknown; sentido?:unknown; proximo?:unknown; siguiente?:unknown; fechaHoraEmisionPrevision?:unknown; fechaHoraRegistro?:unknown; }
const text=(v:unknown)=>v==null?'':String(v).trim();
const num=(v:unknown)=>{ if(v==null||v==='') return null; const n=Number(v); return Number.isFinite(n)?n:null; };
function parseTimestamp(v:unknown):string|undefined { const s=text(v); if(!s) return undefined; const t=Date.parse(s); return Number.isNaN(t)?undefined:new Date(t).toISOString(); }
export function parseMetroResponse(payload:unknown, station:MetroStation, nowMs=Date.now()):StationArrivals {
 const rows=Array.isArray(payload)?payload:[]; const arrivals:MetroArrival[]=[]; let sourceUpdatedAt:string|undefined;
 for(const raw of rows as RawTeleindicator[]){ const line=text(raw.linea); const destination=text(raw.sentido)||text(raw.nombreli)||'Destino no disponible'; if(!line) continue;
  const emitted=parseTimestamp(raw.fechaHoraEmisionPrevision); if(emitted) sourceUpdatedAt=sourceUpdatedAt && sourceUpdatedAt>emitted?sourceUpdatedAt:emitted;
  let age=0; if(emitted){ const delta=Math.max(0,nowMs-Date.parse(emitted)); age=Math.floor(delta/60000); }
  for(const [kind,value] of [['next',raw.proximo],['following',raw.siguiente]] as const){ const candidate=num(value); if(candidate==null) continue; const minutes=candidate-age; if(minutes<0) continue;
   const platform=text(raw.anden)||undefined; const id=[station.id,line,platform??'',destination,kind].join('|'); arrivals.push({id,line,destination,minutes,platform,direction:text(raw.sentido)||undefined,sourceUpdatedAt:emitted}); }
 }
 const unique=[...new Map(arrivals.map(a=>[`${a.line}|${a.platform??''}|${a.destination}|${a.minutes}`,a])).values()].sort((a,b)=>a.minutes-b.minutes);
 return {station,arrivals:unique,fetchedAt:new Date(nowMs).toISOString(),sourceUpdatedAt};
}
