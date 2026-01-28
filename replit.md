# UCL Match Predictor

## Overview

A UEFA Champions League match prediction application that uses Monte Carlo simulations (20,000 iterations) to predict match outcomes. The app analyzes team form, squad strength, and tactical factors to generate probabilistic predictions for UCL fixtures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a single-page application pattern with a component-based architecture. UI components are organized in `client/src/components/ui/` using shadcn/ui primitives built on Radix UI.

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: RESTful JSON API under `/api/*` routes

The server handles match predictions through a custom prediction engine that implements:
- Poisson distribution random sampling for goal simulation
- Elo-like strength rating calculations
- Home advantage factors
- UCL-specific baseline statistics

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Managed via `drizzle-kit push`

The database stores match scenarios with team statistics and prediction results. Schema uses JSONB columns for flexible team stats storage.

### Prediction Engine
Located in `server/prediction-engine.ts`, implements:
- 20,000 Monte Carlo simulations per prediction
- 0.15 home advantage factor
- 2.8 UCL baseline goals per match
- Comprehensive match statistics including shots, corners, cards

### Project Structure
```
├── client/          # React frontend
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── pages/          # Route pages
│       └── lib/            # Utilities and query client
├── server/          # Express backend
│   ├── routes.ts           # API endpoints
│   ├── prediction-engine.ts # Monte Carlo simulation
│   ├── ucl-data.ts         # Team/fixture data
│   └── storage.ts          # Database operations
├── shared/          # Shared types and schema
└── migrations/      # Database migrations
```

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- `connect-pg-simple` for session storage
- `pg` driver for database connections

### UI Components
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- Lucide icons
- Custom fonts: Orbitron and Rajdhani (Google Fonts)

### Development Tools
- Vite with React plugin
- Replit-specific plugins for dev banner and error overlay
- ESBuild for production server bundling

### Key npm packages
- `drizzle-orm` / `drizzle-zod` for database and validation
- `@tanstack/react-query` for data fetching
- `class-variance-authority` for component variants
- `zod` for schema validation