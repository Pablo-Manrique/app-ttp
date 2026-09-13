export type LineId = string;

export type BoardStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'stale'
  | 'error';

export interface MetroStation {
  id: string;
  name: string;
  apiCode: string;
  lines: LineId[];
  latitude?: number;
  longitude?: number;
}

export interface MetroArrival {
  id: string;
  line: LineId;
  destination: string;
  minutes: number;
  platform?: string;
  direction?: string;
  sourceUpdatedAt?: string;
}

export interface StationArrivals {
  stationId: string;
  stationName: string;
  arrivals: MetroArrival[];
  fetchedAt: string;
  sourceUpdatedAt?: string;
}

export interface StationState {
  status: BoardStatus;
  arrivals: MetroArrival[];
  fetchedAt?: string;
  sourceUpdatedAt?: string;
  error?: string;
  requestId?: number;
}

export interface FavoriteStation {
  stationId: string;
  label?: string;
  lineFilter?: LineId[];
  directionFilter?: string;
  createdAt: string;
}

export interface JourneyDefinition {
  id: string;
  name: string;
  originStationId: string;
  destinationLabel: string;
  preferredLines: LineId[];
  expectedWalkMinutes: number;
  transferBufferMinutes: number;
  targetArrivalTime?: string;
  active: boolean;
}

export interface JourneyObservation {
  id: string;
  journeyId: string;
  startedAt: string;
  arrivedAt?: string;
  durationMinutes?: number;
  source: 'manual' | 'timer';
  note?: string;
}