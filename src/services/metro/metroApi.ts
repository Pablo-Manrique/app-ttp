import type {
  MetroStation,
  StationArrivals,
} from '../../types/transport';

import { parseMetroResponse } from './metroParser';

const BASE =
  'https://serviciosapp.metromadrid.es/servicios/rest/teleindicadores';

const validApiCode = (code: string) =>
  /^[a-zA-Z0-9_-]{1,80}$/.test(code);

export async function fetchMetroArrivals(
  station: MetroStation,
  signal?: AbortSignal,
  timeoutMs = 8000,
): Promise<StationArrivals> {
  if (!validApiCode(station.apiCode)) {
    throw new Error('Código de estación no válido.');
  }

  const controller = new AbortController();

  const timer = window.setTimeout(
    () => controller.abort(),
    Math.max(1000, Math.min(timeoutMs, 30000)),
  );

  const onAbort = () => controller.abort();

  signal?.addEventListener('abort', onAbort, {
    once: true,
  });

  try {
    const response = await fetch(
      `${BASE}/${encodeURIComponent(station.apiCode)}`,
      {
        method: 'GET',
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
        headers: {
          Accept: 'application/xml, text/xml',
        },
        referrerPolicy: 'no-referrer',
      },
    );

    if (!response.ok) {
      throw new Error(
        `Metro API HTTP ${response.status}`,
      );
    }

    const contentType =
      response.headers.get('content-type') ?? '';

    console.log(
      '[Metro API] Content-Type:',
      contentType,
    );

    const xml = await response.text();

    console.log(
      '[Metro API] Respuesta XML:',
      xml,
    );

    return parseMetroResponse(xml, station);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'La consulta ha tardado demasiado o fue cancelada.',
      );
    }

    throw error instanceof Error
      ? error
      : new Error(
          'No se pudo consultar Metro.',
        );
  } finally {
    window.clearTimeout(timer);

    signal?.removeEventListener(
      'abort',
      onAbort,
    );
  }
}