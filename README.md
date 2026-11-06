# document-portal

## Description

A restricted area of the website for document sharing.

**Planned features:**

- JWT authentication
- User roles with different permissions (admin, intern, extern)
- Uploading files of various formats and sizes to the server
- Downloading files
- Editing document descriptions and access rights for different users (admin)
- Display of the user who uploaded the file
- Email notifications
- Storage of metadata in the database and files on the server

## Tech stack

- Frontend: React, Tailwind, Tanstack Query
- Backend: NestJS
- DB: PostgreSQL + Prisma 7
- Documentation: Swagger / OpenAPI
- UI-kit: Storybook
- Tests: Vitest, Playwright

## Project docs / decisions

[docs/adr](/docs/adr/)

## Quick start

In order to work on this repository on your local machine, follow these steps !(Docker desktop should be running):

1. **Run Node version according to .nvmrc file**

    ```sh
    nvm use
    ```

2. **Install pnpm**

    ```sh
    npm i -g pnpm
    ```

3. **Install packages**
   Run

    ```sh
    pnpm install
    ```

    to set up project locally.

4. **Create .env**
   Run

    ```sh
    cp .env.example .env
    ```

5. **Up DB**

    Run

    ```sh
    pnpm db:up
    ```

6. **Run Front and Back**

    Run

    ```sh
    pnpm dev
    ```

    Endpoints:
    - API http://localhost:3000
    - Front http://localhost:5173
    - Mailpit http://localhost:8025
