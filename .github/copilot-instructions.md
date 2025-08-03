# Copilot Instructions for NextStopTurkey

## Project Overview
NextStopTurkey is a full-stack tours and travel management platform. It features a Vite/React/TypeScript frontend, an Express.js backend, and a PostgreSQL database. The project is containerized with Docker and supports both local and production deployments. Supabase has been fully removed; all data access is now via PostgreSQL and REST APIs.

## Architecture & Key Components
- **Frontend** (`src/`): React 18 + TypeScript, Vite, Tailwind CSS, React Query, React Router, shadcn-ui. Uses Axios for API calls to backend.
- **Backend** (`backend/`): Express.js (TypeScript), REST API, JWT authentication, email services, PostgreSQL connection via `config/database.js`.
- **Database**: PostgreSQL, managed locally (Homebrew or Docker) or in production. All schema changes via migration scripts or ORM.
- **Dev Scripts**: `start-dev.sh` orchestrates local startup (DB, backend, frontend). `deploy-prod.sh` for production. `docker-compose.yml` for container orchestration.

## Developer Workflows
- **Local Dev (Recommended):**
  - Run `./start-dev.sh` for one-command startup (starts DB, backend, frontend, installs deps if needed).
  - Manual: install deps, run backend (`cd backend && npm run dev`), then frontend (`npm run dev`).
- **Database Migrations:**
  - Use migration scripts or ORM (e.g., Prisma) for schema changes. See `README.md` and `roadmap.MD` for details.
- **Seeding:**
  - `cd backend && npm run seed` to populate sample data.
- **Testing:**
  - No global test runner by default. Add tests in `__tests__` folders. See `roadmap.MD` for Jest/React Testing Library setup.
- **Docker:**
  - `docker-compose up -d` for full containerized dev/prod.

## Project-Specific Conventions
- **API URLs:**
  - Frontend expects API at `VITE_API_URL` (default: `http://localhost:3001`).
- **Environment Variables:**
  - Backend: `backend/.env` (DB, JWT, email config)
  - Frontend: `.env.local` (API URL, app name)
- **Database:**
  - All tables use UUID PKs. Enum values must match backend expectations. See `STATUS.md` for current tables.
- **No Supabase:**
  - All Supabase code has been removed. Use only PostgreSQL and REST APIs.
- **Component Patterns:**
  - Admin features in `src/components/admin/`. Use React Query for data, React Hook Form for forms.
- **Linting:**
  - ESLint config in `eslint.config.js`. TypeScript strict mode is recommended.

## Integration Points
- **Email:**
  - Email services are abstracted in `src/emails/` and backend email modules.
- **Authentication:**
  - JWT-based, handled in backend and consumed by frontend.
- **Admin Panel:**
  - All admin features are React components under `src/components/admin/`.

## Key Files & References
- `README.md`, `STATUS.md`, `roadmap.MD`: High-level architecture, workflows, and migration notes
- `start-dev.sh`, `docker-compose.yml`, `deploy-prod.sh`: Service orchestration
- `backend/routes/`, `src/components/`, `src/hooks/`: Main business logic
- `backend/config/database.js`: DB connection

## Example: Local Dev Startup
```bash
./start-dev.sh
# or, for Docker
docker-compose up -d
```

## Example: Adding a Migration
- Add SQL to a migration file, then:
```bash
psql -h localhost -U postgres -d nextstopturkey -f migration.sql
```

---
For more, see `README.md`, `STATUS.md`, and `roadmap.MD`.
