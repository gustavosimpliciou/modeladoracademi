# Nativos Academy

Plataforma de aprendizagem online para estudar cursos, acompanhar progresso e concluir atividades em uma experiência premium e responsiva.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Clerk Auth is provisioned through the Replit-managed Clerk setup; browser sessions use Clerk cookies.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nativos-academy/src/pages/academy-pages.tsx` — landing, dashboard, catalog, course, lesson, activities, and auth-adjacent UI
- `artifacts/nativos-academy/src/components/academy-ui.tsx` — branded shell and reusable learning primitives
- `lib/api-spec/openapi.yaml` — source of truth for the learning API contract
- `artifacts/api-server/src/routes/academy.ts` — dashboard, courses, lessons, activities, and progress endpoints
- `lib/db/src/schema/academy.ts` — persisted academy data model
- `artifacts/nativos-academy/src/index.css` — dark graphite/orange theme and typography tokens

## Architecture decisions

- OpenAPI is the contract for the first vertical learning flow; generated hooks are consumed by the frontend instead of hand-written fetch calls.
- Learning progress is persisted in PostgreSQL and recalculated from completed lessons when a checkpoint is saved.
- Clerk is the authentication provider; the app uses base-path-aware sign-in and sign-up routes and cookie-based browser sessions.

## Product

- Public academy landing page and course catalog
- Student dashboard with active courses, progress, stats, and recent activity
- Course workspace with modules, lesson locking, materials, and next actions
- Lesson checkpoint persistence and completion updates
- Activities list and branded Clerk authentication screens

## User preferences

- Use Portuguese UI copy and a restrained dark black/graphite/orange visual language based on the provided Nativos reference.

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- Restart both `artifacts/api-server: API Server` and `artifacts/nativos-academy: web` after contract, auth, or toolchain changes.
- `vite build` requires workflow-provided `PORT` and `BASE_PATH`; use the package typecheck for routine artifact verification.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
