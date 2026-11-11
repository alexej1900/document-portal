import { Test } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
    let controller: HealthController;
    let healthService: { check: ReturnType<typeof vi.fn<HealthService['check']>> };

    beforeEach(async () => {
        // 1. Mock service: only the method, that controller uses, is mocked
        healthService = { check: vi.fn<HealthService['check']>() };

        // 2. Mini-module: real controller + mock instead of service
        const moduleRef = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [{ provide: HealthService, useValue: healthService }],
        }).compile();

        controller = moduleRef.get(HealthController);
    });

    it('returns exactly what HealthService.check() returns', () => {
        // 3. Set the mock to return a specific value
        const result = { status: 'ok', uptime: 42, timestamp: '2026-11-11T12:00:00.000Z' };
        healthService.check.mockReturnValue(result);

        // 4. Call the controller method and assert that it returns the same value as the mock
        expect(controller.check()).toBe(result);
        expect(healthService.check).toHaveBeenCalledTimes(1);
    });
});
