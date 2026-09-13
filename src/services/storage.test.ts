import { describe, expect, it, beforeEach } from 'vitest';
import { storage } from './storage';
beforeEach(() => localStorage.clear());
describe('secure storage', () => {
  it('rejects malformed JSON', () => { localStorage.setItem('metro-trayectos:v2:favorites', '{bad'); expect(storage.getFavorites()).toEqual([]); });
  it('rejects non-array payloads', () => { localStorage.setItem('metro-trayectos:v2:favorites', JSON.stringify({ stationId: 'x' })); expect(storage.getFavorites()).toEqual([]); });
  it('filters malformed entries', () => { localStorage.setItem('metro-trayectos:v2:favorites', JSON.stringify([{ stationId: 'ok', createdAt: '2026-01-01' }, { nope: true }])); expect(storage.getFavorites()).toHaveLength(1); });
  it('limits oversized payloads', () => { localStorage.setItem('metro-trayectos:v2:favorites', 'x'.repeat(1_000_001)); expect(storage.getFavorites()).toEqual([]); });
});
