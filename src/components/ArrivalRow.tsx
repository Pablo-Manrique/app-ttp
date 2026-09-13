import type { MetroArrival } from '../types/transport';
import { formatMinutes } from '../utils/format';
export function ArrivalRow({ arrival }: { arrival: MetroArrival }) {
  return <div className="arrival-row"><div className="line-badge">L{arrival.line}</div><div className="arrival-main"><strong>{arrival.destination}</strong><span>{arrival.platform ? `Andén ${arrival.platform}` : 'Llegada estimada'}</span></div><div className="arrival-time">{formatMinutes(arrival.minutes)}</div></div>;
}
