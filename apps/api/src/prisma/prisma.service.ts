import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Env } from '../config/env.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
    constructor(config: ConfigService<Env, true>) {
        super({
            adapter: new PrismaPg({ connectionString: config.get('DATABASE_URL', { infer: true }) }),
            log:
                config.get('NODE_ENV', { infer: true }) === 'development'
                    ? ['query', 'warn', 'error']
                    : ['warn', 'error'],
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
