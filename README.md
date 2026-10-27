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

- Frontend: React
- Backend: NestJS
- DB: PostgreSQL + Prisma 7
- Documentation: Swagger / OpenAPI
- UI-kit: Storybook

## Project docs / decisions

[docs/adr](/docs/adr/)

## Quick start

In order to work on this repository on your local machine, follow these steps:

1. **Run Node version according to .nvmrc file**

    ```sh
    nvm use
    ```

2. **Install packages**
   Run

    ```sh
    pnpm install
    ```

    to set up project locally.
