# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Maison au top" — a household task management app for families. React 19 + Vite frontend that talks to a REST API running at `http://localhost:3000`.

## Commands

```bash
npm run dev       # start dev server (HMR)
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

No test suite is configured.

## Architecture

### Auth flow

`AuthService` ([src/services/AuthService.js](src/services/AuthService.js)) reads a JWT from `localStorage`. On login, the token is stored and `axios.defaults.headers.Authorization` is set globally so all subsequent requests are authenticated. The JWT carries `role`, `email`, and `user_id` claims.

`AuthProvider` ([src/Contexte/AuthProvider.jsx](src/Contexte/AuthProvider.jsx)) wraps the whole app and exposes auth state via `AuthContext` ([src/Contexte/AuthContext.js](src/Contexte/AuthContext.js)):

| Field | Purpose |
|---|---|
| `isLogged` | whether a valid non-expired token exists |
| `role` | `"temp"` / `"admin"` / other role string |
| `userId`, `mail` | extracted from JWT |
| `families` | loaded on login; list of families the user belongs to |
| `selectedFamily` | the currently active family (first by default); drives data fetching in child pages |
| `user`, `tasksByUserId` | fetched by `Homepage` after login |

### User roles

- **`temp`**: newly registered, no family yet → Homepage shows create/join family forms
- **`admin`**: family owner → sees task validation tab, can generate invite codes
- Other roles: regular family members

### API layer

All API calls are in [src/services/service.js](src/services/service.js) as named exports using axios. The base URL is hardcoded to `http://localhost:3000`. Empty strings in form fields must be converted to `null` before sending to the API (SQL rejects empty strings for nullable FK/date columns).

### Routing & layout

`App.jsx` sets up a persistent sidebar layout: `<Navbar>` on the left, page content on the right. Routes:

| Path | Page |
|---|---|
| `/` | Homepage (login, register, onboarding) |
| `/tasks` | Kanban board by family member + task creation |
| `/planning` | Planning |
| `/members` | Member list, invite codes, pending join requests |
| `/dashboard` | Dashboard |
| `/rewards` | Rewards |
| `/settings` | Settings |

Pages read `selectedFamily` from context and re-fetch their data whenever it changes.

### Key patterns

- Pages call `useContext(AuthContext)` directly — no custom hook wrapper.
- `selectedFamily` is the single source of truth for "which family is active." All data-fetching `useEffect`s depend on it.
- `TasksCard` ([src/components/cards/Index.jsx](src/components/cards/Index.jsx)) is a shared display component used in both `Homepage` (user's own tasks) and `Task` (family kanban).

### Files to ignore

- `src/APPSave` and `src/pages/Task_old.jsx` are backup/archive files, not active code.
