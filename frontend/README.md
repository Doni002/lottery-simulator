# Lottery Simulator Frontend

React + TypeScript + Vite UI for the Lottery Simulator application. Provides an interactive interface to create sessions, configure parameters, run simulations, and view real-time progress.

## Development Setup

See the root [README.md](../README.md) for full setup instructions. From the project root:

```bash
npm run setup
npm run dev
```

This starts the frontend dev server at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Configuration

### Backend URL

By default, the frontend connects to `http://localhost:3000`. To change this, edit `public/env.js`:

```js
window.api_base_url = 'http://your-backend-url:3000';
window.socket_url = 'http://your-backend-url:3000';
```

This approach allows changing the backend URL at runtime without rebuilding the bundle.

## Running

```bash
# Development (watch mode with HMR)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Code Quality and Testing

```bash
# Linting (ESLint)
npm run lint
npm run lint:fix

# Unit tests (Vitest)
npm run test

# Test in watch mode
npm run test:watch

# Test coverage
npm run test:cov
```

## Architecture

### Key Components

- **App** — Root component with error boundary
- **SimulationContainer** — Main page with session creation, configuration, controls, and results
- **API Service** (`services/api.ts`) — REST client for session lifecycle commands
- **Socket Service** (`services/socket.ts`) — WebSocket client for real-time updates
- **useSimulationSocket** Hook — Manages WebSocket subscription and event handling

### Directory Structure

```
src/
  ├─ main.tsx               # Entry point
  ├─ App.tsx                # Root component
  ├─ app/
  │  ├─ layouts/            # Header and page layout
  │  ├─ ErrorBoundary.tsx   # Error handling
  ├─ features/simulation/
  │  ├─ SimulationContainer.tsx    # Main UI
  │  ├─ components/          # Simulation-specific components
  │  ├─ hooks/               # Custom hooks (useSimulationSocket)
  │  ├─ api/                 # API communication
  │  ├─ types/               # TypeScript types
  │  └─ utils/               # Helpers
  ├─ services/
  │  ├─ api.ts               # REST client
  │  ├─ socket.ts            # WebSocket client
  ├─ styles/                 # Global CSS + Tailwind
  └─ types/                  # Global types

```

### State Management

- **React Hooks** for local component state
- **useSimulationSocket** hook maintains the WebSocket connection and dispatches events
- Session state, simulation progress, and results managed within SimulationContainer

### Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** in `styles/variables.css` for custom theming

## API Integration

The frontend communicates with the backend via:

1. **REST** (session lifecycle commands)
   - Create session: `POST /simulation/session`
   - Update draw speed: `PATCH /simulation/session/:id/draw-speed`
   - Start/stop: `POST /simulation/session/:id/start|stop`

2. **WebSocket** (real-time simulation updates)
   - Subscribe: `subscribeSession(sessionId)`
   - Events: `simulationProgress`, `simulationComplete`, `simulationPaused`, `simulationError`

## Testing

Tests use **Vitest** and **React Testing Library**:

- Unit tests: `*.test.ts(x)` files co-located with source
- Setup: `test/setup.ts` configures testing globals and React Testing Library
- Mock API and WebSocket in tests to avoid external dependencies

## Notes

- Vite provides fast HMR (Hot Module Replacement) during development
- TypeScript is strict (see root `tsconfig.base.json` and `tsconfig.app.json`)
- The `public/env.js` pattern allows environment-driven configuration without rebuilds
- error-boundary catches React render errors to prevent blank screens
