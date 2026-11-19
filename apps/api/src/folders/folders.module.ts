import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service.js';
import { FoldersController } from './folders.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    controllers: [FoldersController],
    providers: [FoldersService],
    imports: [PrismaModule],
})
export class FoldersModule {}
