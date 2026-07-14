# Momentum

AI personal operating system built with Next.js App Router, Supabase, and TanStack Query.

## Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **Data:** Supabase client for CRUD, Drizzle for complex queries
- **State:** TanStack Query (server), Zustand (UI)
- **Analytics:** PostHog

## Setup

1. Copy `.env.example` to `.env.local` and fill in credentials
2. `npm install`
3. `supabase db push` (applies migrations including pg_cron task generation)
4. `npm run dev` → http://localhost:3000

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run test` — Vitest unit tests (scheduling logic)
- `npm run test:e2e` — Playwright E2E tests
- `npm run typecheck` — TypeScript check

## Routes

| Route                    | Description                            |
| ------------------------ | -------------------------------------- |
| `/login`, `/signup`      | Auth                                   |
| `/onboarding/*`          | 4-step onboarding wizard               |
| `/today`                 | Dashboard with progress + tasks        |
| `/timeline`              | Day/week calendar with drag-reschedule |
| `/goals`                 | Goals list + detail                    |
| `/coach`                 | AI coach suggestions + chat            |
| `/trackers/gym/[taskId]` | Gym set logging                        |
| `/progress`              | Analytics + consistency heatmap        |
| `/settings`              | Profile + notification prefs           |

## Architecture

Single Next.js app (no microfrontends). Auth via `@supabase/ssr` middleware. Task instances materialized on plan confirm (30-day window) and maintained nightly via `pg_cron`.
