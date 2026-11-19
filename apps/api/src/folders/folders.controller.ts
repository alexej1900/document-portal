import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { FoldersService } from './folders.service.js';
import { Folder } from '../generated/prisma/client.js';
import { UpdateFolderDto } from './dto/update-folder.dto.js';
import { CreateFolderDto } from './dto/create-folder.dto.js';

@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get()
    getAll(): Promise<Folder[]> {
        return this.foldersService.findAll();
    }

    @Get(':id')
    getFolderById(@Param('id', new ParseUUIDPipe({ version: '7' })) id: string): Promise<Folder> {
        return this.foldersService.findOne(id);
    }

    @Patch(':id')
    updateFolder(
        @Param('id', new ParseUUIDPipe({ version: '7' })) id: string,
        @Body() data: UpdateFolderDto
    ): Promise<Folder> {
        return this.foldersService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteFolder(@Param('id', new ParseUUIDPipe({ version: '7' })) id: string): Promise<void> {
        return this.foldersService.remove(id);
    }

    @Post()
    createFolder(@Body() data: CreateFolderDto): Promise<Folder> {
        return this.foldersService.create(data);
    }
}
