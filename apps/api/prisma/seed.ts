import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: ['query'],
});

async function main() {
    if (process.env.NODE_ENV === 'production') {
        console.log('Seeding is not allowed in production mode.');
        process.exitCode = 1;
        return;
    }

    const INTERN_FOLDER_ID = '123e4567-e89b-12d3-a456-426614174000';
    const EXTERN_FOLDER_ID = '123e4567-e89b-12d3-a456-426614174001';

    await prisma.$transaction(async (tx) => {
        const internFolder = await tx.folder.upsert({
            where: { id: INTERN_FOLDER_ID },
            update: {},
            create: {
                id: INTERN_FOLDER_ID,
                name: 'Intern Folder',
                description: 'Folder for intern documents',
                type: 'INTERN',
            },
        });

        const externFolder = await tx.folder.upsert({
            where: { id: EXTERN_FOLDER_ID },
            update: {},
            create: {
                id: EXTERN_FOLDER_ID,
                name: 'Extern Folder',
                description: 'Folder for extern documents',
                type: 'EXTERN',
            },
        });

        const users = [
            { email: 'admin@example.com', role: 'ADMIN' },
            { email: 'intern@example.com', role: 'INTERN' },
            { email: 'extern@example.com', role: 'EXTERN' },
        ] as const;

        const passwordHash = null;

        const [, , extern] = await Promise.all(
            users.map(({ email, role }) =>
                tx.user.upsert({
                    where: { email },
                    update: {},
                    create: { email, role, passwordHash },
                })
            )
        );

        await tx.folderAccess.upsert({
            where: {
                userId_folderId: { userId: extern!.id, folderId: externFolder.id },
            },
            update: { mode: 'READ_ONLY' },
            create: { userId: extern!.id, folderId: externFolder.id, mode: 'READ_ONLY' },
        });

        console.log({ internFolder, externFolder, users: [...users] });
        console.log('Seed completed');
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
