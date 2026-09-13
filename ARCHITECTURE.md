# Architecture decisions

## Provider boundary
The UI never talks to Metro directly. It depends on `MetroProvider`, so adding Cercanías later means adding a provider/adapter, not rewriting views.

## Journey statistics
`JourneyObservation` is deliberately a first-class domain entity. The target feature is to estimate real trip duration from local observations and eventually recommend a departure time using median/P90.

## Data ingestion
The seed station catalog is deliberately small. The proper next step is a build-time script that consumes official CRTM GTFS and emits a compact station catalog for the app.

## Backend policy
Try direct browser access first. If CORS prevents it, add only a minimal proxy/cache layer. Do not introduce a persistent backend before the API proves it is necessary.
