import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import type { Health } from './health.interface.js';

@Controller()
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get('health')
    check(): Health {
        return this.healthService.check();
    }
}
