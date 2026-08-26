# PahamIn

PahamIn is a web-based AI-assisted learning media platform that helps teachers generate classroom learning media, designed to be presented on Interactive Flat Panels (IFP / touchscreen classroom displays).

This repository is currently a **scaffold**: the development environment and monorepo structure are set up, but product features have not been implemented yet.

## Requirements

- Node.js 20+
- pnpm 9+

## Installation

From the repository root:

```bash
pnpm install
```

## Running the frontend

```bash
pnpm --filter @pahamin/web dev
```

Frontend runs at http://localhost:5173

## Running the backend

```bash
pnpm --filter @pahamin/api start:dev
```

Backend runs at http://localhost:3000

## Running both together

```bash
pnpm dev
```

## Development ports

| App     | URL                    |
|---------|------------------------|
| Web     | http://localhost:5173  |
| API     | http://localhost:3000  |

The Vite dev server proxies `/api` requests to the NestJS server at `http://localhost:3000`.

## Project structure

```
pahamin/
├── apps/
│   ├── web/       # Vite + React + TypeScript frontend
│   └── api/       # NestJS backend
├── packages/
│   └── shared/    # Placeholder for future shared code
├── package.json
├── pnpm-workspace.yaml
└── README.md
```
