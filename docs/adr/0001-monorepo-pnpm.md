# 1. Monorepo with pnpm workspaces

- **Status:** Accepted
- **Date:** 2026-10-27
- **Deciders:** Aliaksei Badnarchuk

## Context

Document Portal consists of a NestJS API (`apps/api`), a React SPA (`apps/web`)
and TypeScript types generated from the API's OpenAPI spec (`packages/api-types`).
A change to an API endpoint usually needs a matching change in the frontend.
The project is developed by one person, with CI on GitHub Actions.

Options considered:

1. **Separate repositories** for API and web.
2. **Monorepo with npm or Yarn workspaces.**
3. **Monorepo with pnpm workspaces.**
4. **Monorepo with Nx or Turborepo** on top of a package manager.

## Decision

We use a single repository with **pnpm workspaces** (option 3).
No Nx or Turborepo for now.

- Workspaces: `apps/*`, `packages/*` (`pnpm-workspace.yaml`).
- Internal packages are referenced with `workspace:*`.
- The pnpm version is pinned via `packageManager` in the root `package.json`,
  the Node version via `.nvmrc` and `engines`.

## Consequences

**Positive**

- API, generated types and frontend change in one pull request,
  so a breaking API change fails the frontend type check in the same CI run.
- Shared tooling (ESLint, Prettier, TypeScript base config, commit hooks) lives in one place.
- pnpm's strict `node_modules` prevents "phantom" dependencies:
  a package can only import what it declares.
- The content-addressable store keeps installs fast and disk usage low.

**Negative**

- One CI pipeline sees every change; jobs must be scoped with
  `pnpm --filter` and path filters to stay fast.
- Some tools assume a flat `node_modules`; they may need extra `.npmrc` settings.

**Revisit when**

- CI or local builds become slow enough that task caching pays off — then evaluate Turborepo.
