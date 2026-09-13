import type { JourneyObservation } from '../../types/transport';

const quantile = (values: number[], q: number) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a,b) => a-b);
  const p = (sorted.length - 1) * q;
  const base = Math.floor(p);
  const rest = p - base;
  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
};

export const calculateJourneyStats = (observations: JourneyObservation[], journeyId: string) => {
  const values = observations.filter(o => o.journeyId === journeyId && o.durationMinutes != null).map(o => o.durationMinutes as number);
  return {
    n: values.length,
    mean: values.length ? values.reduce((a,b) => a+b, 0) / values.length : null,
    median: quantile(values, .5),
    p90: quantile(values, .9),
  };
};
export type JourneyStats = ReturnType<typeof calculateJourneyStats>;
