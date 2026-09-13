# Metro Trayectos v0.2

Versión endurecida y preparada para crecer: separación de dominio/proveedor, estado explícito, cancelación y timeout de requests, refresco sin solapamientos, persistencia versionada, UI de favoritos y registro manual de observaciones.

## Comandos
- `npm install`
- `npm run dev`
- `npm run check`
- `npm test`
- `npm run build`

## Configuración
Copia `.env.example` a `.env` y usa `VITE_METRO_PROVIDER=mock` para desarrollo sin depender de CORS/API.

## Nota de despliegue
La API de Metro puede bloquear peticiones desde GitHub Pages mediante CORS. Si ocurre, el siguiente paso es desplegar un proxy mínimo (Cloudflare Worker/Netlify Function), sin acoplarlo al frontend.
