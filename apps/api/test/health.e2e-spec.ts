import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Health (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: { $queryRaw: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        prisma = { $queryRaw: vi.fn() };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        app = moduleFixture.createNestApplication({ logger: false });

        configureApp(app);

        await app.init();
    });

    it('GET /api/health returns status, uptime and timestamp', async () => {
        const response = await request(app.getHttpServer()).get('/api/health').expect(200);

        expect(response.body).toEqual({
            status: 'ok',
            uptime: expect.any(Number),
            timestamp: expect.any(String),
        });
    });

    it('GET /api/health/ready returns 200 when the database is up', async () => {
        prisma.$queryRaw.mockResolvedValue([]);

        const response = await request(app.getHttpServer()).get('/api/health/ready').expect(200);

        expect(response.body).toEqual({ status: 'ok', database: 'up' });
    });

    it('GET /api/health/ready returns 503 without error details when the database is down', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432'));

        const response = await request(app.getHttpServer()).get('/api/health/ready').expect(503);

        expect(response.body).toEqual({ status: 'error', database: 'down' });
    });

    afterEach(async () => {
        await app.close();
    });
});
