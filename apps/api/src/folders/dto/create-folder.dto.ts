import { FolderType } from '../../generated/prisma/client.js';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFolderDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsEnum(FolderType)
    type!: FolderType;
}
