import { CreateFolderDto } from './create-folder.dto.js';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {}
