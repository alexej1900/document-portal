import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { envSchema } from './config/env.schema.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { FoldersModule } from './folders/folders.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true, validationSchema: envSchema }),
        HealthModule,
        PrismaModule,
        FoldersModule,
    ],
})
export class AppModule {}
