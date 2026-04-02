# Lottery Simulator Backend

NestJS server for the Lottery Simulator application. Manages session lifecycle, simulation orchestration, concurrent access control, and persistence.

## Development Setup

See the root [README.md](../README.md) for full setup instructions. The quick start command installs dependencies and configures the database:

```bash
cd ..
npm run setup
```

## Environment Variables

Create `backend/.env` (or edit the existing one created by `npm run setup`):

```env
DATABASE_URL="mysql://user:password@localhost:3306/lotterySimulator"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## Running the Server

```bash
# Development mode (auto-reload on file changes)
npm run start:dev

# Production build
npm run build
node dist/main.js
```

## Code Quality and Testing

```bash
# Linting (ESLint)
npm run lint
npm run lint:fix

# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Overview

See the root [README.md](../README.md#27-api-and-realtime-contract-summary) for the complete API and WebSocket specification.

### REST Endpoints

- `POST /simulation/session` — Create a new simulation session
- `PATCH /simulation/session/:id/draw-speed` — Update draw speed (while simulation is running)
- `POST /simulation/session/:id/start` — Start the simulation
- `POST /simulation/session/:id/stop` — Stop the simulation
- `GET /` — Health check

### WebSocket Events

- **Client to server**: `subscribeSession(sessionId)` — Subscribe to session updates
- **Server to client**: 
  - `simulationProgress` — Simulation step update
  - `simulationComplete` — Simulation finished (five-match or max-years reached)
  - `simulationPaused` — Simulation paused (user stopped it or all clients disconnected)
  - `simulationError` — Error during simulation

## Architecture

```
SimulationController (REST)
    ↓
SimulationService (orchestration)
    ├─→ SimulationSessionService (CRUD)
    ├─→ SimulationLockService (concurrency)
    ├─→ SimulationPersistenceService (DB writes)
    └─→ SimulationGateway (WebSocket events)

Database (MySQL via Prisma)
    ├─ Session
    ├─ Draw
    └─ Ticket
```

## Key Design Patterns

### Concurrency Control

A single simulation session can only run on one backend instance at a time. The `SimulationLockService` coordinates this using the database:

- `simulationRunning` boolean flag on Session table
- On bootstrap, stale locks are automatically cleared (in case of ungraceful shutdown)
- Pause requests are tracked in memory during active simulation

### Memory Management

In-memory state for active simulations:

- `ticketCounts: Map<sessionId, count>` — Tracks ticket count to avoid repeated DB queries during simulation
- Cleaned up automatically when simulation lock is released
- Socket room cleanup handled by `SimulationGateway.handleDisconnect()`

### Data Integrity

Draw and Ticket creation is wrapped in a Prisma transaction to ensure consistency:

```typescript
await this.prisma.$transaction(async (tx) => {
  const draw = await tx.draw.create({ ... });
  await tx.ticket.create({ ... });
});
```

### WebSocket Architecture

Sessions are isolated using Socket.IO rooms (one room per session ID). When the last client disconnects from a session, the gateway requests a pause via `SimulationLockService.requestPause()`.

## TypeScript Strict Mode

All strict flags are enabled in `tsconfig.json`:

- `noImplicitAny` — No implicit `any` types
- `strictBindCallApply` — Strict type checking for `bind`, `call`, `apply`
- `noFallthroughCasesInSwitch` — Require breaks in switch cases

## Notes

- This is a single-instance backend (no distributed database locking required).
- The simulation loop is CPU-intensive and runs asynchronously from the HTTP request that started it.
- Socket.IO CORS is restricted to `FRONTEND_URL` for security.
