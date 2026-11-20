import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { configureApp } from '../src/app.setup.js';
import request from 'supertest';

const FOLDER_ID = '00000000-0000-7000-8000-000000000001';

const folder = {
    id: FOLDER_ID,
    name: 'Test Folder',
    descroption: null,
    type: 'EXTERN' as const,
    createdAt: new Date('2026-11-10T12:00:00Z'),
    updatedAt: new Date('2026-11-10T12:00:00Z'),
};

describe('Folders (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: {
        folder: {
            findMany: ReturnType<typeof vi.fn>;
            findUnique: ReturnType<typeof vi.fn>;
            create: ReturnType<typeof vi.fn>;
            delete: ReturnType<typeof vi.fn>;
            update: ReturnType<typeof vi.fn>;
        };
    };

    beforeEach(async () => {
        prisma = {
            folder: {
                findMany: vi.fn(),
                findUnique: vi.fn(),
                create: vi.fn(),
                delete: vi.fn(),
                update: vi.fn(),
            },
        };

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        app = moduleRef.createNestApplication({ logger: false });

        configureApp(app);

        await app.init();
    });

    describe('POST /api/folders', () => {
        it('creates a folder from a valid body', async () => {
            prisma.folder.create.mockImplementation(({ data }) => Promise.resolve({ id: FOLDER_ID, ...data }));

            const response = await request(app.getHttpServer())
                .post('/api/folders')
                .send({ name: 'Contracts', type: 'EXTERN' })
                .expect(201);
            expect(response.body).toMatchObject({
                id: FOLDER_ID,
                name: 'Contracts',
                type: 'EXTERN',
            });
        });

        it('rejects unknown fields', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/folders')
                .send({ name: 'Contracts', type: 'EXTERN', role: 'ADMIN' })
                .expect(400);

            expect(response.body.message).toEqual(['property role should not exist']);
            expect(prisma.folder.create).not.toHaveBeenCalled();
        });

        it('returns validation error in the common format', async () => {
            const response = await request(app.getHttpServer()).post('/api/folders').send({ name: '' }).expect(400);

            expect(response.body).toMatchObject({
                statusCode: 400,
                error: 'Bad Request',
                path: '/api/folders',
                message: expect.arrayContaining(['name should not be empty']),
            });
        });
    });

    describe('GET /api/folders/:id', () => {
        it('returns 400 for an id that is not a UUID', async () => {
            await request(app.getHttpServer()).get('/api/folders/not-a-uuid').expect(400);

            expect(prisma.folder.findUnique).not.toHaveBeenCalled();
        });

        it('returns 404 when the folder does not exist', async () => {
            prisma.folder.findUnique.mockResolvedValue(null);

            const response = await request(app.getHttpServer()).get(`/api/folders/${FOLDER_ID}`).expect(404);

            expect(response.body).toMatchObject({ statusCode: 404, error: 'Not Found' });
        });
    });

    describe('PATCH /api/folders/:id', () => {
        it('returns 404 if folder does not exist', async () => {
            prisma.folder.findUnique.mockResolvedValue(null);
            await request(app.getHttpServer())
                .patch(`/api/folders/${FOLDER_ID}`)
                .send({ name: 'Updated folder' })
                .expect(404);

            expect(prisma.folder.update).not.toHaveBeenCalled();
        });

        it('returns 200 when folder was updated', async () => {
            prisma.folder.findUnique.mockResolvedValue(folder);
            prisma.folder.update.mockResolvedValue({ ...folder, name: 'Updated folder' });

            const response = await request(app.getHttpServer())
                .patch(`/api/folders/${FOLDER_ID}`)
                .send({ name: 'Updated folder' })
                .expect(200);

            expect(response.body).toMatchObject({
                id: FOLDER_ID,
                name: 'Updated folder',
                type: 'EXTERN',
            });
        });
    });

    describe('DELETE /api/folders/:id', () => {
        it('returns 204 if folder was deleted', async () => {
            prisma.folder.findUnique.mockResolvedValue(folder);
            await request(app.getHttpServer()).delete(`/api/folders/${FOLDER_ID}`).expect(204);

            expect(prisma.folder.delete).toHaveBeenCalled();
        });
    });

    afterEach(async () => {
        await app.close();
    });
});
