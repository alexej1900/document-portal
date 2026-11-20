import { plainToInstance } from 'class-transformer';
import { CreateFolderDto } from './create-folder.dto.js';
import { validate } from 'class-validator';

async function invalidFields(input: Record<string, unknown>): Promise<string[]> {
    const dto = plainToInstance(CreateFolderDto, input);
    const errors = await validate(dto);
    return errors.map((error) => error.property);
}

const validInput = { name: 'Contracts', type: 'EXTERN' };

describe('CreateFolderDto', () => {
    it('accepts a valid folder', async () => {
        expect(await invalidFields(validInput)).toEqual([]);
    });

    it('accepts an optional description', async () => {
        expect(await invalidFields({ ...validInput, description: 'Some description' })).toEqual([]);
    });

    it.each([
        ['name is empty', { name: '' }, 'name'],
        ['name is too long', { name: 'a'.repeat(121) }, 'name'],
        ['name is not a string', { name: 123 }, 'name'],
        ['type is unknown', { type: 'PUBLIC' }, 'type'],
        ['description is too long', { description: 'a'.repeat(1001) }, 'description'],
    ])('rejects the folder when %s', async (_case, override, field) => {
        expect(await invalidFields({ ...validInput, ...override })).toContain(field);
    });

    it('rejects the folder when required fields are missing', async () => {
        expect(await invalidFields({})).toEqual(expect.arrayContaining(['name', 'type']));
    });
});
