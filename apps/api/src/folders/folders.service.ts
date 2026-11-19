import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Folder } from '../generated/prisma/client.js';
import { UpdateFolderDto } from './dto/update-folder.dto.js';
import { CreateFolderDto } from './dto/create-folder.dto.js';

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly logger = new Logger(FoldersService.name);

    async findAll(): Promise<Folder[]> {
        return this.prisma.folder.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findOne(id: string): Promise<Folder> {
        const folder = await this.prisma.folder.findUnique({ where: { id } });

        if (!folder) {
            throw new NotFoundException(`Folder ${id} not found`);
        }

        return folder;
    }

    async update(id: string, data: UpdateFolderDto): Promise<Folder> {
        await this.findOne(id); // 404, if not found, will throw NotFoundException
        return this.prisma.folder.update({ where: { id }, data });
    }

    async create(data: CreateFolderDto): Promise<Folder> {
        const newFolder = await this.prisma.folder.create({
            data,
        });
        return newFolder;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.prisma.folder.delete({ where: { id } });
    }
}
