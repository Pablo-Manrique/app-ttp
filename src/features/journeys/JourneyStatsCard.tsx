import type { JourneyStats } from '../history/stats';
export function JourneyStatsCard({ stats }: { stats: JourneyStats }) {
  const f = (v: number | null) => v == null ? '—' : `${Math.round(v)} min`;
  return <div className="stats-grid"><div><span>Observaciones</span><strong>{stats.n}</strong></div><div><span>Media</span><strong>{f(stats.mean)}</strong></div><div><span>Mediana</span><strong>{f(stats.median)}</strong></div><div><span>P90</span><strong>{f(stats.p90)}</strong></div></div>;
}
