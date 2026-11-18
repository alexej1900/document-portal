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

    const INTERN_FOLDER_ID = '00000000-0000-7000-8000-000000000000';
    const EXTERN_FOLDER_ID = '00000000-0000-7000-8000-000000000001';

    const seedData = await prisma.$transaction(async (tx) => {
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

        const admin = await tx.user.upsert({
            where: {
                email: 'admin@example.com',
            },
            update: {},
            create: {
                email: 'admin@example.com',
                role: 'ADMIN',
            },
        });

        const intern = await tx.user.upsert({
            where: {
                email: 'intern@example.com',
            },
            update: {},
            create: {
                email: 'intern@example.com',
                role: 'INTERN',
            },
        });

        const extern = await tx.user.upsert({
            where: {
                email: 'extern@example.com',
            },
            update: {},
            create: {
                email: 'extern@example.com',
                role: 'EXTERN',
            },
        });

        await tx.folderAccess.upsert({
            where: { userId_folderId: { userId: extern.id, folderId: externFolder.id } },
            update: { mode: 'READ_ONLY' },
            create: { userId: extern.id, folderId: externFolder.id, mode: 'READ_ONLY' },
        });

        return { internFolder, externFolder, admin, intern, extern };
    });
    console.log(seedData);
    console.log('Seed completed');
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
