import { Test } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import { CLOCK } from './health.tokens.js';
import { vi } from 'vitest';
import { HealthController } from './health.controller.js';

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

describe('HealthController', () => {
    let controller: HealthController;
    let healthService: { check: ReturnType<typeof vi.fn<HealthService['check']>> };

    beforeEach(async () => {
        // 1. Фальшивый сервис: только метод, который нужен контроллеру
        healthService = { check: vi.fn<HealthService['check']>() };

        // 2. Мини-модуль: настоящий контроллер + мок вместо сервиса
        const moduleRef = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [{ provide: HealthService, useValue: healthService }],
        }).compile();

        controller = moduleRef.get(HealthController);
    });

    it('returns exactly what HealthService.check() returns', () => {
        // 3. Говорим моку, что вернуть
        const result = { status: 'ok', uptime: 42, timestamp: '2026-11-11T12:00:00.000Z' };
        healthService.check.mockReturnValue(result);

        // 4. Вызываем метод контроллера и проверяем
        expect(controller.check()).toBe(result);
        expect(healthService.check).toHaveBeenCalledTimes(1);
    });
});
