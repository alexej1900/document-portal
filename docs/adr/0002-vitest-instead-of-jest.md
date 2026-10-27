# 2. Vitest instead of Jest

- **Status:** Accepted
- **Date:** 2026-10-27
- **Deciders:** Aliaksei Badnarchuk

## Context

Tests are needed in three places: the NestJS API (unit and HTTP e2e),
the React app built with Vite, and Storybook component tests.

- The API is a NestJS 12 project in ESM mode. For ESM projects the Nest CLI
  sets up Vitest by default; Jest needs extra configuration for native ESM.
- Storybook 10 runs component tests through its Vitest addon.
- Many existing NestJS projects and tutorials still use Jest.

Options considered:

1. **Jest everywhere.**
2. **Jest for the API, Vitest for the frontend.**
3. **Vitest everywhere.**

## Decision

We use **Vitest everywhere** (option 3):

- API unit tests and HTTP e2e tests: Vitest + Supertest.
- Frontend: Vitest + React Testing Library + MSW.
- Storybook: interaction tests via the Vitest addon.

Browser end-to-end tests are a separate concern and use Playwright.

## Consequences

**Positive**

- One test runner, one config style and one mocking API (`vi.fn`, `vi.mock`) across the repo.
- Native ESM and TypeScript support without extra transforms.
- The frontend test setup reuses the Vite config.

**Negative**

- Vitest transforms with esbuild, which does not emit decorator metadata
  (`emitDecoratorMetadata`). NestJS dependency injection relies on it, so API tests
  need an SWC transform (`unplugin-swc`) unless the CLI already configures one.
- Fewer NestJS + Vitest examples exist than NestJS + Jest examples.

**Mitigation**

- The Jest and Vitest APIs are nearly identical (`jest.fn` → `vi.fn`,
  `jest.mock` → `vi.mock`), so reading and maintaining Jest-based code stays easy.
