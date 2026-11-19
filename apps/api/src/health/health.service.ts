import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import type { Health, Readiness } from './health.types.js';
import { CLOCK } from './health.tokens.js';
import type { Clock } from './health.tokens.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HealthService {
    private readonly logger = new Logger(HealthService.name);

    constructor(
        @Inject(CLOCK) private readonly now: Clock,
        private readonly prisma: PrismaService
    ) {}

    check(): Health {
        return { status: 'ok', uptime: process.uptime(), timestamp: this.now().toISOString() };
    }

    async checkReadiness(): Promise<Readiness> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
        } catch (error) {
            this.logger.error('Database readiness check failed', error);
            throw new ServiceUnavailableException('Database is not available');
        }

        return { status: 'ok', database: 'up' };
    }
}
