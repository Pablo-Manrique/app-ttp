# Roadmap

## Phase 0 — Spike (now)
- [x] Mobile-first React/Vite/PWA shell.
- [x] Provider boundary.
- [x] Real Metro endpoint adapter based on the current observed response contract.
- [x] Local mock provider.
- [ ] Browser CORS test against the live endpoint.

## Phase 1 — Real Metro MVP
- [ ] Import complete Metro station catalog from official CRTM GTFS/open data.
- [ ] Search stations.
- [ ] Favorite station with line/direction filters.
- [ ] Poll arrivals with a sensible minimum interval.
- [ ] Show “last updated” and stale-data state.
- [ ] Incidents/service status.

## Phase 2 — Habitual journeys
- [ ] Journey editor: origin, destination, preferred line/sense, walking buffer.
- [ ] “Leave now” view.
- [ ] Manual start/end trip logging.
- [ ] Automatic/assisted trip observation.

## Phase 3 — Personal statistics
- [ ] Median, mean and P90 by journey.
- [ ] Split by weekday and time band.
- [ ] Confidence / minimum sample-size rules.
- [ ] Recommended departure time.

## Phase 4 — Cercanías
- [ ] Add Renfe GTFS static provider.
- [ ] Add trip updates / vehicle positions.
- [ ] Reuse journey/statistics domain.
