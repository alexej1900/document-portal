import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { HealthService } from './health.service.js';
import { CLOCK } from './health.tokens.js';

describe('HealthService', () => {
    const fixed = new Date('2026-11-10T12:00:00Z');
    let service: HealthService;
    let prisma: { $queryRaw: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        prisma = { $queryRaw: vi.fn() };

        const module = await Test.createTestingModule({
            providers: [
                HealthService,
                { provide: CLOCK, useValue: () => fixed },
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get(HealthService);
    });

    describe('checkReadiness', () => {
        it('reports the database as up when the query succeeds', async () => {
            prisma.$queryRaw.mockResolvedValue([]);

            await expect(service.checkReadiness()).resolves.toEqual({ status: 'ok', database: 'up' });
            expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('throws 503 when the database query fails', async () => {
            prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

            await expect(service.checkReadiness()).rejects.toThrow(ServiceUnavailableException);
        });
    });

    describe('check health', () => {
        it('returns the current time from the clock', async () => {
            expect(service.check()).toEqual({
                status: 'ok',
                timestamp: '2026-11-10T12:00:00.000Z',
                uptime: expect.any(Number),
            });
        });
    });
});
