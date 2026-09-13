import type { MetroStation, StationArrivals } from './transport';

export type MetroProviderStatus = 'ok' | 'degraded' | 'offline';

export interface MetroProvider {
  getArrivals(station: MetroStation): Promise<StationArrivals>;
  getStatus(): Promise<MetroProviderStatus>;
}
