# Lottery Simulator

Lottery Simulator is a full-stack application that simulates weekly lottery draws until either:

- a five-number match is hit, or
- a maximum simulation horizon is reached.

The application uses REST for session lifecycle commands and WebSocket for real-time simulation updates.

## 1. Setup and Configuration

### 1.1 Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8+

### 1.2 Quick Start

```bash
git clone https://github.com/Doni002/lottery-simulator.git
cd lottery-simulator
npm run setup
npm run dev
```

What `npm run setup` does:

- installs root, frontend, and backend dependencies
- creates `backend/.env` from `backend/.env.example` if missing
- runs Prisma migration and client generation

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### 1.3 Environment Configuration

If your local MySQL settings are different, edit `backend/.env`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/lotterySimulator"
PORT=3000
```

Frontend runtime endpoints:

`frontend/public/env.js` is also versioned in git with local defaults. Edit only if your backend runs on a different URL:

```js
window.api_base_url = 'http://localhost:3000';
window.socket_url = 'http://localhost:3000';
```

### 1.4 Quality Checks

Frontend:

```bash
cd frontend
npm run lint
npm run test
```

Backend:

```bash
cd backend
npm run lint
npm run test
npm run test:e2e
```

## 2. Architecture Plan

### 2.1 Goals and Constraints

- Keep the implementation simple and understandable for a single core feature.
- Provide real-time feedback to the user during long-running simulations.
- Persist meaningful outcomes in MySQL using Prisma.
- Keep frontend and backend independently testable.

### 2.2 Architectural Elements and Reasoning

1. Frontend: React + Vite + TypeScript
- Why: Fast iteration speed, strong typing, and straightforward component/hook architecture.
- Key responsibility: Render simulation UI, send control commands, and display live progress.

2. Backend: NestJS (REST + WebSocket Gateway)
- Why: Clear modular boundaries (controller, gateway, services) and strong DTO validation.
- Key responsibility: Session management, simulation execution, concurrency lock, persistence.

3. Persistence: Prisma + MySQL
- Why: Reliable schema/migrations and type-safe DB access.
- Key responsibility: Persist sessions, draws, and ticket snapshots for tracked outcomes.

4. Communication Split: REST + WebSocket
- REST (control plane): create/start/stop/update session settings.
- WebSocket (data plane): stream `simulationProgress`, `simulationComplete`, `simulationPaused`, `simulationError`.
- Why: Commands are request/response; simulation output is continuous and event-driven.

5. Validation and Safety
- Backend uses global NestJS `ValidationPipe` with whitelist and transform.
- Why: Reject malformed input early and keep service logic focused on domain behavior.

### 2.3 Architecture Diagram (Mermaid)

```mermaid
flowchart LR
	subgraph FE[Frontend - React/Vite]
		APP[App + SimulationContainer]
		API[API Service]
		SOCK[Socket Service + useSimulationSocket]
		APP --> API
		APP --> SOCK
	end

	subgraph BE[Backend - NestJS]
		CTRL[SimulationController\nREST endpoints]
		GW[SimulationGateway\nWebSocket events]
		SVC[SimulationService]
		SESS[SimulationSessionService]
		LOCK[SimulationLockService]
		PERSIST[SimulationPersistenceService]
		CTRL --> SVC
		GW --> SVC
		SVC --> SESS
		SVC --> LOCK
		SVC --> PERSIST
	end

	subgraph DB[MySQL via Prisma]
		SESSION[(Session)]
		DRAW[(Draw)]
		TICKET[(Ticket)]
	end

	API -->|HTTP REST| CTRL
	SOCK -->|WebSocket| GW
	PERSIST --> SESSION
	PERSIST --> DRAW
	PERSIST --> TICKET
	SESS --> SESSION
```

### 2.4 Architecture Diagram (ASCII)

```text
+------------------------------ Frontend ------------------------------+
| React App (SimulationContainer)                                      |
|   |- REST client (services/api.ts)                                   |
|   '- Socket client (services/socket.ts + useSimulationSocket)        |
+-----------------------------+----------------------------------------+
															| HTTP + WebSocket
															v
+------------------------------ Backend -------------------------------+
| NestJS AppModule                                                    |
|   |- SimulationController (REST)                                    |
|   |- SimulationGateway (WS)                                         |
|   '- SimulationService                                              |
|       |- SimulationSessionService                                   |
|       |- SimulationLockService                                      |
|       '- SimulationPersistenceService                               |
+-----------------------------+----------------------------------------+
															| Prisma Client
															v
+------------------------------ MySQL ---------------------------------+
| Session | Draw | Ticket                                              |
+---------------------------------------------------------------------+
```

### 2.5 Runtime Flow (High Level)

1. Frontend calls `POST /simulation/session` to create a session.
2. Frontend subscribes to session events over WebSocket (`subscribeSession`).
3. Frontend calls `POST /simulation/session/:id/start`.
4. Backend runs simulation loop and emits progress events to the session room.
5. Frontend can update draw speed via `PATCH /simulation/session/:id/draw-speed` while running.
6. Simulation ends with either `simulationComplete` (five-match or max-years) or `simulationPaused` after stop request.

### 2.6 Trade-offs

1. Chosen simplicity over distributed scalability
- Current in-process simulation lock is straightforward for a single backend instance.

2. Chosen explicit module boundaries over over-engineering
- Services are separated by responsibility (session, lock, persistence), keeping future extraction easy.

3. Chosen app-side env script for frontend runtime URL configuration
- `frontend/public/env.js` allows changing backend URL without rebuilding frontend bundle.

### 2.7 API and Realtime Contract Summary

REST endpoints:

- `POST /simulation/session`
- `GET /simulation/session/:id`
- `PATCH /simulation/session/:id/custom-numbers`
- `PATCH /simulation/session/:id/random-seed`
- `PATCH /simulation/session/:id/draw-speed`
- `POST /simulation/session/:id/start`
- `POST /simulation/session/:id/stop`

WebSocket events:

- Client to server: `subscribeSession`
- Server to client: `simulationProgress`, `simulationComplete`, `simulationPaused`, `simulationError`

## 3. Repository Structure

```text
lottery-simulator/
	frontend/                # React app (UI + socket client)
	backend/                 # NestJS app (REST + WebSocket + Prisma)
	README.md                # Architecture and setup documentation
```
