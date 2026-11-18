import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { CLOCK } from './health.tokens.js';
import type { Clock } from './health.tokens.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    controllers: [HealthController],
    providers: [HealthService, { provide: CLOCK, useValue: (() => new Date()) satisfies Clock }],
    imports: [PrismaModule],
})
export class HealthModule {}
