import type { MetroProvider } from './provider';
import type { MetroStation, StationArrivals } from '../../types/transport';

const MOCK: Record<string, Array<{ line: string; destination: string; minutes: number; platform: string }>> = {
  colombia: [
    { line: '8', destination: 'Nuevos Ministerios', minutes: 2, platform: '1' },
    { line: '9', destination: 'Paco de Lucía', minutes: 5, platform: '2' },
    { line: '8', destination: 'Aeropuerto T4', minutes: 9, platform: '1' },
    { line: '9', destination: 'Arganda del Rey', minutes: 12, platform: '2' },
  ],
  'nuevos-ministerios': [
    { line: '10', destination: 'Puerta del Sur', minutes: 3, platform: '1' },
    { line: '8', destination: 'Aeropuerto T4', minutes: 6, platform: '3' },
    { line: '10', destination: 'Hospital Infanta Sofía', minutes: 10, platform: '2' },
  ],
  sol: [
    { line: '1', destination: 'Valdecarros', minutes: 1, platform: '1' },
    { line: '2', destination: 'Las Rosas', minutes: 4, platform: '2' },
    { line: '3', destination: 'Moncloa', minutes: 7, platform: '1' },
  ],
  'santiago-bernabeu': [
    { line: '10', destination: 'Puerta del Sur', minutes: 2, platform: '1' },
    { line: '10', destination: 'Tres Olivos', minutes: 8, platform: '2' },
  ],
};

export class MetroMockProvider implements MetroProvider {
  async getArrivals(station: MetroStation): Promise<StationArrivals> {
    const rows = (MOCK[station.id] ?? []).map((arrival, index) => ({ ...arrival, id: `${station.id}-${index}` }));
    return { station, arrivals: rows.map(a => ({...a, direction: a.destination})), fetchedAt: new Date().toISOString() };
  }
  async getStatus() { return 'ok' as const; }
}
