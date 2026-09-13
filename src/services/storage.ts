import type { FavoriteStation, JourneyDefinition, JourneyObservation } from '../types/transport';

const PREFIX = 'metro-trayectos:v2:';
const MAX_ITEMS = 5000;
const safeArray = <T>(value: unknown, validator: (item: unknown) => item is T): T[] =>
  Array.isArray(value) ? value.filter(validator).slice(0, MAX_ITEMS) : [];
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const isFavorite = (v: unknown): v is FavoriteStation => isObject(v) && typeof v.stationId === 'string' && v.stationId.length < 100 && typeof v.createdAt === 'string';
const isJourney = (v: unknown): v is JourneyDefinition => isObject(v) && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.originStationId === 'string';
const isObservation = (v: unknown): v is JourneyObservation => isObject(v) && typeof v.id === 'string' && typeof v.journeyId === 'string' && typeof v.startedAt === 'string';
const read = <T>(key: string, fallback: T, validator: (value: unknown) => value is T): T => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw || raw.length > 1_000_000) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validator(parsed) ? parsed : fallback;
  } catch { return fallback; }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* Private mode/quota: app remains usable in memory. */ }
};
const isFavoriteArray = (v: unknown): v is FavoriteStation[] => Array.isArray(v) && safeArray(v, isFavorite).length === v.length && v.length <= MAX_ITEMS;
const isJourneyArray = (v: unknown): v is JourneyDefinition[] => Array.isArray(v) && safeArray(v, isJourney).length === v.length && v.length <= MAX_ITEMS;
const isObservationArray = (v: unknown): v is JourneyObservation[] => Array.isArray(v) && safeArray(v, isObservation).length === v.length && v.length <= MAX_ITEMS;
export const storage = {
  getFavorites: () => read('favorites', [] as FavoriteStation[], isFavoriteArray),
  saveFavorites: (v: FavoriteStation[]) => write('favorites', v.slice(0, MAX_ITEMS)),
  getJourneys: () => read('journeys', [] as JourneyDefinition[], isJourneyArray),
  saveJourneys: (v: JourneyDefinition[]) => write('journeys', v.slice(0, MAX_ITEMS)),
  getObservations: () => read('observations', [] as JourneyObservation[], isObservationArray),
  saveObservations: (v: JourneyObservation[]) => write('observations', v.slice(0, MAX_ITEMS)),
};
