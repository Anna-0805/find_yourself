# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

VV Work: an MVP job board for EU vacancies (candidates and employers). It has a React SPA frontend and an Express backend. All UI text, error messages, and server responses are in Ukrainian, so keep new strings in Ukrainian. README.md (in Ukrainian) explains the design decisions and lists the deployed URLs: frontend on Vercel, backend on Render.

## Repository layout: two frontend copies

There are **two near-duplicate frontends**. Before editing, confirm which one the user means:

- **Root (`./src`, `./package.json`)**: the older version. README's run instructions point here, and the root `vercel.json` holds the SPA rewrite rule. Auth is client-only: `AuthContext.login` accepts any password of 6+ characters and saves the user to `localStorage` (`vv_work_user`). Forms use hand-written validation.
- **`client/`**: the newer version. It adds `react-hook-form` + `zod` (schemas in `client/src/utils/validation.ts`) and a `Navbar`. Its `AuthContext` uses server-side JWT cookie auth (`credentials: 'include'`, checks the session via `/auth/me` on mount, exposes `isLoading`).
- **`server/`**: the Express backend, which both frontends share.

`public/` and `src/assets/` are also duplicated under `client/`. `src/vercel.json` / `client/src/vercel.json` are stray copies; Vercel only reads the project-root one.

## Commands

Frontend (run from `./` or `client/`):
- `npm run dev`: Vite dev server on http://localhost:5173
- `npm test`: Vitest in watch mode (jsdom, globals, setup in `src/setupTests.ts`)
- `npx vitest run src/App.test.tsx -t "<test name>"`: run one test
- `npm run lint`: ESLint
- `npm run build`: at the root this runs **lint → vitest run → `tsc -b` → vite build**, so a lint or test failure breaks the build. The `client/` build skips lint.

Backend (`server/`):
- `npm start`: runs `src/index.ts` directly with `tsx` on port 5000 (`PORT` env). There is no compile step and no tests.
- Env vars (`server/.env`, loaded by dotenv): `RESEND_API_KEY`, `JWT_SECRET`, `CLIENT_ORIGIN`, `PORT`, `NODE_ENV`.

## Architecture notes

- **API base URL is hardcoded** in `src/services/constants.ts` / `client/src/services/constants.ts` as `API_URL`. The root copy points to `localhost:5000`; the `client/` copy points to the Render production URL. Switch it by hand for local or prod.
- **CORS**: the server allows only one origin, `CLIENT_ORIGIN`, with credentials. It defaults to the production Vercel URL, so local dev needs `CLIENT_ORIGIN=http://localhost:5173` in `server/.env`.
- **Server structure**: `index.ts` → `routes/*.routes.ts` → `controllers/*.controller.ts`. Both routers mount at `/api`, giving `/api/vacancies`, `/api/applications`, `/api/register`, `/api/login`, `/api/me`, `/api/logout`, `/api/forgot-password`, `/api/change-password`.
  - **Mismatch:** `client/src/context/AuthContext.tsx` calls `/api/auth/login`, `/api/auth/me`, and `/api/auth/logout`, but the server serves those routes without the `/auth` prefix.
- **Persistence is in-memory**: `server/src/services/db.service.ts` holds plain arrays (users, vacancies seeded from `mockData.ts`, applications), and everything resets when the server restarts. Passwords are stored and compared in plaintext. Login sets an httpOnly `token` JWT cookie.
- **Email** (`services/mail.service.ts`) calls the Resend HTTP API with a sandbox sender. Controllers treat send failures as non-fatal: registration still returns 201, and forgot-password puts the temporary password in the response.
- **Main data flow**: a candidate submits `ApplyModal` → `POST /api/applications`. An employer's `Profile` page lists them via `GET /api/applications`, and `EmployerVacancyForm` posts new vacancies.
- **`mockApi.ts` is still in use**: partner pages (`pages/Partner.tsx`) and the Contacts form submission go through `fakeFetch`. It adds a 300–800 ms delay and fails at random about 20% of the time, on purpose, to exercise the Skeleton loading and `ErrorRetry` UI. `Vacancy`/`PartnerData` types are also imported from it.
- **State**: React Context only (no Redux or Zustand); read it through the `useAuth` hook. `ProtectedRoute` guards `/profile`. Home-page search uses a manual 400 ms `setTimeout` debounce plus `useMemo` filtering.
- **Tests** (`App.test.tsx`) re-implement validation, debounce, and ErrorRetry logic inline instead of importing the real components, so changing app code won't break them.
