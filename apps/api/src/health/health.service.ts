import { Inject, Injectable } from '@nestjs/common';
import { Health } from './health.types.js';
import { CLOCK } from './health.tokens.js';
import type { Clock } from './health.tokens.js';

@Injectable()
export class HealthService {
    constructor(@Inject(CLOCK) private readonly now: Clock) {}

    check(): Health {
        return { status: 'ok', uptime: process.uptime(), timestamp: this.now().toISOString() };
    }
}
