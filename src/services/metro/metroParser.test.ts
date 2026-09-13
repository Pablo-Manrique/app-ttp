import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  parseMetroResponse,
} from './metroParser';

import type {
  MetroStation,
} from '../../types/transport';

const station: MetroStation = {
  id: 'x',
  name: 'X',
  apiCode: 'x',
  lines: ['1'],
};

describe('parseMetroResponse', () => {
  it('parses Metro XML and normalizes numeric predictions', () => {
    const xml = `
      <VtelindicadoresCollection>
        <Vtelindicadores>
          <linea>1</linea>
          <nombreli>TEST</nombreli>
          <estaciontel>1</estaciontel>
          <idnumerica>1</idnumerica>
          <nombreest>X</nombreest>
          <anden>2</anden>
          <sentido>Pinar</sentido>
          <proximo>7</proximo>
          <siguiente>12</siguiente>
          <fechaHoraEmisionPrevision>
            2026-01-01T10:03:00Z
          </fechaHoraEmisionPrevision>
        </Vtelindicadores>
      </VtelindicadoresCollection>
    `;

    const now = Date.parse(
      '2026-01-01T10:05:00Z',
    );

    const result = parseMetroResponse(
      xml,
      station,
      now,
    );

    expect(
      result.arrivals.map((x) => x.minutes),
    ).toEqual([5, 10]);

    expect(result.arrivals[0].line).toBe('1');
    expect(
      result.arrivals[0].destination,
    ).toBe('Pinar');

    expect(
      result.arrivals[0].platform,
    ).toBe('2');

    expect(result.sourceUpdatedAt).toBe(
      '2026-01-01T10:03:00.000Z',
    );
  });

  it('ignores malformed rows and negative arrivals', () => {
    const xml = `
      <VtelindicadoresCollection>
        <Vtelindicadores>
          <linea></linea>
          <proximo>2</proximo>
        </Vtelindicadores>

        <Vtelindicadores>
          <linea>1</linea>
          <sentido>A</sentido>
          <anden>1</anden>
          <proximo>bad</proximo>
          <siguiente>-1</siguiente>
        </Vtelindicadores>
      </VtelindicadoresCollection>
    `;

    const result = parseMetroResponse(
      xml,
      station,
    );

    expect(result.arrivals).toHaveLength(0);
  });

  it('deduplicates equivalent arrivals', () => {
    const xml = `
      <VtelindicadoresCollection>
        <Vtelindicadores>
          <linea>1</linea>
          <sentido>A</sentido>
          <anden>1</anden>
          <proximo>3</proximo>
          <siguiente>8</siguiente>
        </Vtelindicadores>

        <Vtelindicadores>
          <linea>1</linea>
          <sentido>A</sentido>
          <anden>1</anden>
          <proximo>3</proximo>
          <siguiente>8</siguiente>
        </Vtelindicadores>
      </VtelindicadoresCollection>
    `;

    const result = parseMetroResponse(
      xml,
      station,
    );

    expect(result.arrivals).toHaveLength(2);
  });

  it('does not trust invalid timestamps as valid freshness', () => {
    const xml = `
      <VtelindicadoresCollection>
        <Vtelindicadores>
          <linea>1</linea>
          <sentido>A</sentido>
          <anden>1</anden>
          <proximo>3</proximo>
          <fechaHoraEmisionPrevision>
            invalid
          </fechaHoraEmisionPrevision>
        </Vtelindicadores>
      </VtelindicadoresCollection>
    `;

    const result = parseMetroResponse(
      xml,
      station,
    );

    expect(
      result.sourceUpdatedAt,
    ).toBeUndefined();
  });

  it('handles empty following prediction', () => {
    const xml = `
      <VtelindicadoresCollection>
        <Vtelindicadores>
          <linea>8</linea>
          <sentido>Aeropuerto T-4</sentido>
          <anden>1</anden>
          <proximo>0</proximo>
          <siguiente/>
        </Vtelindicadores>
      </VtelindicadoresCollection>
    `;

    const result = parseMetroResponse(
      xml,
      station,
    );

    expect(result.arrivals).toHaveLength(1);
    expect(result.arrivals[0].minutes).toBe(0);
  });
});