import type {
  MetroArrival,
  MetroStation,
  StationArrivals,
} from '../../types/transport';

function getText(
  element: Element,
  tagName: string,
): string | undefined {
  const value = element.querySelector(tagName)?.textContent?.trim();

  return value || undefined;
}

function getNumber(
  element: Element,
  tagName: string,
): number | undefined {
  const value = getText(element, tagName);

  if (value === undefined || value === '') {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function getValidTimestamp(
  element: Element,
): string | undefined {
  const value = getText(element, 'fechaHoraEmisionPrevision');

  if (!value) {
    return undefined;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? undefined : value;
}

function calculateMinutes(
  minutes: number,
  sourceTimestamp: string | undefined,
  nowMs: number,
): number {
  if (!sourceTimestamp) {
    return Math.max(0, Math.round(minutes));
  }

  const sourceMs = Date.parse(sourceTimestamp);

  if (Number.isNaN(sourceMs)) {
    return Math.max(0, Math.round(minutes));
  }

  const elapsedMinutes = Math.floor(
    Math.max(0, nowMs - sourceMs) / 60_000,
  );

  return Math.max(0, Math.round(minutes) - elapsedMinutes);
}

function createArrival(
  row: Element,
  station: MetroStation,
  minutes: number,
  sourceUpdatedAt: string | undefined,
  nowMs: number,
  suffix: string,
): MetroArrival | null {
  const line = getText(row, 'linea');
  const destination = getText(row, 'sentido');
  const platform = getText(row, 'anden');

  if (!line || !destination || !platform) {
    return null;
  }

  if (!Number.isFinite(minutes) || minutes < 0) {
    return null;
  }

  const adjustedMinutes = calculateMinutes(
    minutes,
    sourceUpdatedAt,
    nowMs,
  );

  return {
    id: [
      station.id,
      line,
      platform,
      destination,
      adjustedMinutes,
      suffix,
    ].join(':'),
    line,
    destination,
    minutes: adjustedMinutes,
    platform,
    direction: destination,
    sourceUpdatedAt,
  };
}

export function parseMetroResponse(
  xml: string,
  station: MetroStation,
  nowMs = Date.now(),
): StationArrivals {
  const parser = new DOMParser();

  const document = parser.parseFromString(
    xml,
    'application/xml',
  );

  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error(
      'La respuesta de Metro contiene XML no válido.',
    );
  }

  const rows = Array.from(
    document.querySelectorAll('Vtelindicadores'),
  );

  const arrivals: MetroArrival[] = [];

  for (const row of rows) {
    const sourceUpdatedAt = getValidTimestamp(row);

    const nextMinutes = getNumber(row, 'proximo');

    if (nextMinutes !== undefined && nextMinutes >= 0) {
      const arrival = createArrival(
        row,
        station,
        nextMinutes,
        sourceUpdatedAt,
        nowMs,
        'next',
      );

      if (arrival) {
        arrivals.push(arrival);
      }
    }

    const followingMinutes = getNumber(
      row,
      'siguiente',
    );

    if (
      followingMinutes !== undefined &&
      followingMinutes >= 0
    ) {
      const arrival = createArrival(
        row,
        station,
        followingMinutes,
        sourceUpdatedAt,
        nowMs,
        'following',
      );

      if (arrival) {
        arrivals.push(arrival);
      }
    }
  }

  const uniqueArrivals = Array.from(
    new Map(
      arrivals.map((arrival) => [
        [
          arrival.line,
          arrival.platform,
          arrival.destination,
          arrival.minutes,
        ].join('|'),
        arrival,
      ]),
    ).values(),
  );

  uniqueArrivals.sort((a, b) => {
    if (a.minutes !== b.minutes) {
      return a.minutes - b.minutes;
    }

    return a.line.localeCompare(b.line);
  });

  const sourceDates = uniqueArrivals
    .map((arrival) =>
      arrival.sourceUpdatedAt
        ? Date.parse(arrival.sourceUpdatedAt)
        : NaN,
    )
    .filter((value) => !Number.isNaN(value));

  const sourceUpdatedAt =
    sourceDates.length > 0
      ? new Date(Math.max(...sourceDates)).toISOString()
      : undefined;

  return {
    stationId: station.id,
    stationName: station.name,
    arrivals: uniqueArrivals,
    fetchedAt: new Date(nowMs).toISOString(),
    sourceUpdatedAt,
  };
}