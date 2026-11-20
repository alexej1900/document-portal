import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { FoldersService } from './folders.service.js';
import { NotFoundException } from '@nestjs/common/exceptions/index.js';

const FOLDER_ID = '00000000-0000-7000-8000-000000000001';

const folder = {
    id: FOLDER_ID,
    name: 'Test Folder',
    descroption: null,
    type: 'EXTERN' as const,
    createdAt: new Date('2026-11-10T12:00:00Z'),
    updatedAt: new Date('2026-11-10T12:00:00Z'),
};

describe('FoldersService', () => {
    let service: FoldersService;
    let prisma: {
        folder: {
            findMany: ReturnType<typeof vi.fn>;
            findUnique: ReturnType<typeof vi.fn>;
            update: ReturnType<typeof vi.fn>;
            create: ReturnType<typeof vi.fn>;
            delete: ReturnType<typeof vi.fn>;
        };
    };

    beforeEach(async () => {
        prisma = {
            folder: {
                findMany: vi.fn(),
                findUnique: vi.fn(),
                update: vi.fn(),
                create: vi.fn(),
                delete: vi.fn(),
            },
        };

        const module = await Test.createTestingModule({
            providers: [FoldersService, { provide: PrismaService, useValue: prisma }],
        }).compile();

        service = module.get(FoldersService);
    });

    describe('findOne', () => {
        it('returns the folder when it exists', async () => {
            prisma.folder.findUnique.mockResolvedValue(folder);

            await expect(service.findOne(FOLDER_ID)).resolves.toEqual(folder);
            expect(prisma.folder.findUnique).toHaveBeenCalledWith({ where: { id: FOLDER_ID } });
        });

        it('throw NotFoundException when the folder does not exist', async () => {
            prisma.folder.findUnique.mockResolvedValue(null);

            await expect(service.findOne(FOLDER_ID)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('updates an existing folder', async () => {
            const updated = { ...folder, name: 'Updated Folder' };
            prisma.folder.findUnique.mockResolvedValue(folder);
            prisma.folder.update.mockResolvedValue(updated);

            await expect(service.update(FOLDER_ID, { name: 'Updated Folder' })).resolves.toBe(updated);
            expect(prisma.folder.update).toHaveBeenCalledWith({
                where: { id: FOLDER_ID },
                data: { name: 'Updated Folder' },
            });
        });

        it('does not call update when folder does not exist', async () => {
            prisma.folder.findUnique.mockResolvedValue(null);

            await expect(service.update(FOLDER_ID, { name: 'Updated folder' })).rejects.toThrow(NotFoundException);
            expect(prisma.folder.update).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('does not call delete when folder does not exist', async () => {
            prisma.folder.findUnique.mockResolvedValue(null);

            await expect(service.remove(FOLDER_ID)).rejects.toThrow(NotFoundException);
            expect(prisma.folder.delete).not.toHaveBeenCalled();
        });
    });
});
