import { describe, expect, it } from 'vitest';
import { envSchema } from './env.schema.js';

// Minimal valid set
const validEnv = {
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
};

describe('envSchema', () => {
    it('accepts a minimal valid env and applies defaults', () => {
        const result = envSchema.safeParse(validEnv);

        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            NODE_ENV: 'development',
            PORT: 3000,
            DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        });
    });

    it('coerces PORT from string to number', () => {
        const result = envSchema.safeParse({ ...validEnv, PORT: '4000' });

        expect(result.success).toBe(true);
        expect(result.data?.PORT).toBe(4000);
    });

    it.each([
        ['PORT is not a number', { PORT: 'abc' }, 'PORT'],
        ['PORT is negative', { PORT: '-1' }, 'PORT'],
        ['NODE_ENV is unknown', { NODE_ENV: 'staging' }, 'NODE_ENV'],
        ['DATABASE_URL is not PostgreSQL', { DATABASE_URL: 'mysql://user:pass@localhost:3306/db' }, 'DATABASE_URL'],
    ])('rejects env when %s', (_case, override, field) => {
        const result = envSchema.safeParse({ ...validEnv, ...override });

        expect(result.success).toBe(false);
        expect(result.error?.issues.map((issue) => issue.path[0])).toContain(field);
    });

    it('rejects env without DATABASE_URL', () => {
        const result = envSchema.safeParse({});

        expect(result.success).toBe(false);
        expect(result.error?.issues.map((issue) => issue.path[0])).toContain('DATABASE_URL');
    });
});
