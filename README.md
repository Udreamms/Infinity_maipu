# Infinity Maipú · Web

Web pública de **Infinity Maipú** (canchas de fútbol 7 y 9, quincho, zona de eventos y cafetería en 4 Poniente 200, Maipú) con una cancha 3D interactiva hecha con three.js.

Monorepo en TypeScript con npm workspaces.

| Ruta | Qué es |
|---|---|
| `apps/web` | Frontend Next.js (App Router): página, componentes y experiencia 3D |
| `apps/api` | Backend Fastify: rutas de canchas y reservas |
| `packages/functions` | Lógica de negocio pura y esquemas zod (precios, disponibilidad) con tests |
| `packages/database` | Acceso a datos con Firebase (Firestore, firebase-admin) |
| `firebase/` + `firebase.json` | Reglas, índices y emuladores de Firestore |
| `legacy/` | Página original en HTML, solo como referencia |

## Empezar

```bash
npm install
cp .env.example .env   # completa las credenciales de Firebase
npm run dev            # web en :3000 y api en :4000
npm test
```

## Estado

Versión de ejemplo: la reserva, los pagos y las cuentas se simulan en el navegador. La conexión con Firebase está preparada pero faltan las credenciales.

www.infinity-maipu.com · Todos los derechos reservados.
