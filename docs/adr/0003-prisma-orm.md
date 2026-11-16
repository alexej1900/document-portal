# 1.Prisma ORM

- **Status:** Accepted
- **Date:** 2026-11-16
- **Deciders:** Aliaksei Badnarchuk

## Context

Document Portal uses PostgreSQL as DB. We would like to use ORM to work with DB effectively, easilly and convinient.

Options considered:

1. **Drizzle**
2. **TypeORM**
3. **Prisma 7**
4. **Prisma 8**

## Decision

We use Prisma v7:

- Prisma was selected because of schema-first approach, types generation and migrations out of the box.
- At the time of 16.11.2026 Prisma installs Prisma 8 as default version.
- Official NestJS page describes work with Prisma 7.
- TypeORM used often for legacy projects.
- Drizzle is closer to SQL.

## Consequences

**Positive**

- Official NestJS page describes work with Prisma 7 - we can use official NestJS documentation.
- There is lots of examples of use NestJS + Prisma v7.
- Full Type Safety: Prisma automatically generates types based on your schema. Errors in queries or attempts to access a nonexistent field are detected as early as the code-writing or compilation stage.
- Centralized data schema (schema.prisma): The entire database structure is described in a single declarative file. It serves as a single source of truth and clearly documents all entities and relationships.
- Convenient Migrations (Prisma Migrate): This tool makes it easy to create and apply database migrations with a single command (prisma migrate dev) without having to write SQL scripts manually.
- Data Visualization (Prisma Studio): The built-in graphical web interface allows you to view and edit data in the database directly in your browser.

**Negative**

- Risk of data loss during a reset: Commands such as `prisma migrate reset` or automatic conflict resolution (e.g., `migrate dev` when a schema drift is detected) may completely delete and recreate the database in development mode.
- Issues with providers: Changing the database type (for example, from PostgreSQL to MySQL) isn't always easy—it requires rewriting the provider configuration and recompiling the migrations.
- Problems with connection pooling: When using PgBouncer or similar connection poolers, errors often occur with prepared statements.
- Heavy client: The @prisma/client generated file is relatively large (several megabytes), which can significantly increase the size of the final build.

**Revisit when**

- New documentation for NestJS and Prisma v8 will be available.
