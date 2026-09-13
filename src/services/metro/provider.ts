import type { MetroStation, StationArrivals } from '../../types/transport';
import { fetchMetroArrivals } from './metroApi'; import { MetroMockProvider } from './metroMock';
export interface MetroProvider { getArrivals(station:MetroStation, signal?:AbortSignal):Promise<StationArrivals>; }
class ApiProvider implements MetroProvider { getArrivals(s:MetroStation,signal?:AbortSignal){return fetchMetroArrivals(s,signal);} }
export const metroProvider:MetroProvider=import.meta.env.VITE_METRO_PROVIDER==='mock'?new MetroMockProvider():new ApiProvider();
export const metroProviderMode=import.meta.env.VITE_METRO_PROVIDER==='mock'?'mock':'api';
