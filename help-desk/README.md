# Helpdesk Ticket Tracker

A fullstack MERN helpdesk system for managing support tickets with SLA tracking, status workflows, and dashboard analytics.

## Run it

```bash
npm install     # once, installs client + server + docs
npm run dev     # starts all three together
```

| What | URL |
|------|-----|
| Frontend (React + Vite) | http://localhost:5173 |
| Backend API (Express) | http://localhost:4000/api |
| API docs (OpenAPI / Swagger UI) | http://localhost:4001 |

The database is **in-memory SQLite**: nothing to install, and it resets to 5 users and 20 tickets every time the server restarts (including when `tsx watch` restarts after you save a server file). Every API request has an artificial ~550 ms delay so you can see loading states.

Seed logins (password `123` for all): `admin`, `alice`, `bob`, `carol`, `dave`.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, React Router v6, Axios, CSS Modules
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (in-memory) via Drizzle ORM

## Project structure

```
client/src/
  app/                 router, Layout, Navbar
  features/<feature>/  components/<Name>/<Name>.tsx + .module.css, types/   (auth, dashboard, tickets, users)
  shared/              components, hooks, utils, types used by more than one feature
server/src/
  server.ts            seeds the db, starts listening
  app.ts               middleware + mounts /api
  routes.ts            mounts each module
  modules/<module>/    <module>.routes -> .controller -> .service -> .repository (+ .types)
  middleware/          errorHandler
  shared/              custom errors, shared types
  db/                  schema, in-memory connection, seed data
docs/openapi.yaml      the API contract shown on :4001
```

## Backend layers

A request flows **routes -> controller -> service -> repository -> db**:

- **routes** map a method + path to a controller function
- **controller** reads `req.params` / `req.query` / `req.body`, validates it by hand, calls the service, sends the response
- **service** business rules (SLA deadline, status transitions, "not found" errors, response shape)
- **repository** the only layer that talks to the database

Errors are thrown as `ValidationError` (400) / `NotFoundError` (404) / `ConflictError` (409) and turned into JSON by `middleware/errorHandler.ts`. A stubbed function you haven't written yet throws `NotImplementedError` and answers `501`.

## API

See http://localhost:4001 for the interactive version (source: `docs/openapi.yaml`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tickets` | List tickets (paginated, filterable, sortable) |
| GET | `/api/tickets/:id` | Get ticket details |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| DELETE | `/api/tickets/:id` | Delete ticket |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users/login` | Simple login |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/stats/recent` | Recently updated tickets (5 by default, `?limit=` up to 10) |

## To-Do

Work through these using only the code, the docs at http://localhost:4001, and the browser. Look for `🔴 TODO` comments in each file. Call the backend directly from your components with `axios` (base URL `http://localhost:4000/api`).

### Backend

Repositories are pre-written, and so are `GET /api/tickets` (filtering, sorting, pagination), `GET /api/tickets/:id` and the users and stats endpoints. Validate by hand, no libraries. `parseId`, `validateTicketBody`, `calculateSlaDeadline` and `isValidStatusTransition` are already written for you. Check each endpoint at http://localhost:4001 before wiring it to the frontend.

- [ ] **`POST /api/tickets`**: controller validates the body and returns `201`; service computes the SLA deadline and saves.
- [ ] **`PUT /api/tickets/:id`**: controller reads the id and the body; service checks the ticket exists (`404` if not) and saves the update.
- [ ] **`PATCH /api/tickets/:id/status`**: controller reads the id and the status; service checks the ticket exists (`404`), rejects an invalid transition with `409`, and sets `resolvedAt` / `closedAt`.
- [ ] **`DELETE /api/tickets/:id`**: controller reads the id; service checks the ticket exists (`404` if not), then deletes.
- [ ] **`GET /api/stats/recent?limit=`**: read the optional `limit` query param (default 5, whole number 1–10, otherwise `400`) in the controller and pass it through the service.

### Frontend

These files are stubbed and need implementing. Reference screenshots are in each feature folder.

- [ ] **Dashboard:** `Dashboard.tsx`, `StatsPanel.tsx`, `RecentActivity.tsx`
- [ ] **Tickets:** `TicketList.tsx`, `TicketCreateForm.tsx`
- [ ] **Auth:** `AuthContext.tsx` (and wrap `<AuthProvider>` around the app in `main.tsx`), `LoginForm.tsx`, `UserBadge.tsx`
- [ ] **Bonus:** `UserList.tsx`, the users table (fetch, loading and error states, rendering the rows).

## Hints

### Shared components (`src/shared/components/`)

Already there, don't build them from scratch:

- **`<LoadingSpinner />`**: drop-in loading state, no props needed
- **`<StatusBadge status={...} />`** and **`<PriorityBadge priority={...} />`**: styled badges
- **`<ErrorBoundary />`** and **`<NotFound />`**

### Shared utilities (`src/shared/utils/formatters.ts`)

- **`formatDate(dateString)`**: ISO date string to `Mon DD, YYYY, HH:MM AM/PM`
- **`formatTimeRemaining(deadline)`**: `Xh Ym Zs` remaining, or `"BREACHED"` if past due
- **`formatDuration(seconds)`**: seconds to `Xh Ym` (useful for the average resolution time on the dashboard)

### Feature types (`src/features/<feature>/types/`)

Each feature has its TypeScript types already defined, so import them instead of writing your own:

| Import path | Key types |
|---|---|
| `features/auth/types/auth.types.ts` | `User`, `AuthContextType` |
| `features/tickets/types/ticket.types.ts` | `Ticket`, `CreateTicketData`, `TicketStatus`, `TicketPriority`, `PaginatedResponse` |
| `features/users/types/user.types.ts` | `User` (agent/admin shape) |
| `features/dashboard/types/dashboard.types.ts` | `DashboardStats` |

### Shared API types (`src/shared/types/api.types.ts`)

Generic response wrappers (`ApiResponse<T>`, `PaginatedResponse<T>`) for typing Axios responses.
