import { Test } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import { CLOCK } from './health.tokens.js';
import { describe, expect, it } from 'vitest';

describe('HealthService', () => {
    it('returns the current time from the clock', async () => {
        const fixed = new Date('2026-11-10T12:00:00Z');

        const module = await Test.createTestingModule({
            providers: [HealthService, { provide: CLOCK, useValue: () => fixed }],
        }).compile();

        const service = module.get(HealthService);

        expect(service.check()).toEqual({
            status: 'ok',
            timestamp: '2026-11-10T12:00:00.000Z',
            uptime: expect.any(Number),
        });
    });
});
