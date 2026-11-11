import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Health (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

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

    afterEach(async () => {
        await app.close();
    });
});
