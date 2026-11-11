import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { envSchema } from './config/env.schema.js';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, cache: true, validationSchema: envSchema }), HealthModule],
})
export class AppModule {}
