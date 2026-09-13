import type {
  FavoriteStation,
  JourneyDefinition,
  JourneyObservation,
} from '../types/transport';

const PREFIX = 'metro-trayectos:v2:';

const MAX_ITEMS = 5000;
const MAX_SERIALIZED_SIZE = 1_000_000;

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

const isNonEmptyString = (value: unknown, maxLength = 500): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.length <= maxLength;

const isFavorite = (value: unknown): value is FavoriteStation =>
  isObject(value) &&
  isNonEmptyString(value.stationId, 100) &&
  isNonEmptyString(value.createdAt, 100);

const isJourney = (value: unknown): value is JourneyDefinition =>
  isObject(value) &&
  isNonEmptyString(value.id, 100) &&
  isNonEmptyString(value.name, 200) &&
  isNonEmptyString(value.originStationId, 100);

const isObservation = (value: unknown): value is JourneyObservation =>
  isObject(value) &&
  isNonEmptyString(value.id, 100) &&
  isNonEmptyString(value.journeyId, 100) &&
  isNonEmptyString(value.startedAt, 100);

const filterSafeArray = <T>(
  value: unknown,
  validator: (item: unknown) => item is T,
): T[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(validator)
    .slice(0, MAX_ITEMS);
};

const readArray = <T>(
  key: string,
  validator: (item: unknown) => item is T,
): T[] => {
  try {
    const raw = localStorage.getItem(PREFIX + key);

    if (!raw || raw.length > MAX_SERIALIZED_SIZE) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return filterSafeArray(parsed, validator);
  } catch {
    return [];
  }
};

const writeArray = <T>(key: string, value: T[]): void => {
  try {
    const safeValue = Array.isArray(value)
      ? value.slice(0, MAX_ITEMS)
      : [];

    const serialized = JSON.stringify(safeValue);

    if (serialized.length > MAX_SERIALIZED_SIZE) {
      return;
    }

    localStorage.setItem(PREFIX + key, serialized);
  } catch {
    // localStorage puede no estar disponible o estar lleno.
    // La aplicación sigue funcionando en memoria.
  }
};

export const storage = {
  getFavorites: (): FavoriteStation[] =>
    readArray('favorites', isFavorite),

  saveFavorites: (value: FavoriteStation[]): void =>
    writeArray('favorites', value),

  getJourneys: (): JourneyDefinition[] =>
    readArray('journeys', isJourney),

  saveJourneys: (value: JourneyDefinition[]): void =>
    writeArray('journeys', value),

  getObservations: (): JourneyObservation[] =>
    readArray('observations', isObservation),

  saveObservations: (value: JourneyObservation[]): void =>
    writeArray('observations', value),
};