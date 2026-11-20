import type { ArgumentsHost } from '@nestjs/common';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exception.filter.js';
import { Prisma } from '../../generated/prisma/client.js';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let response: {
        status: ReturnType<typeof vi.fn>;
        json: ReturnType<typeof vi.fn>;
    };
    let host: ArgumentsHost;

    beforeEach(() => {
        filter = new AllExceptionsFilter();

        response = { status: vi.fn(), json: vi.fn() };
        response.status.mockReturnValue(response);

        const request = {
            method: 'GET',
            url: '/api/folders',
        };

        host = {
            switchToHttp: () => ({
                getResponse: () => response,
                getRequest: () => request,
            }),
        } as unknown as ArgumentsHost;
    });

    const sentBody = () => response.json.mock.calls[0]?.[0];

    it('keeps the status and message of an HttpException', () => {
        filter.catch(new NotFoundException('Folder not found'), host);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(sentBody()).toMatchObject({
            ststuaCode: 404,
            error: 'Not found',
            message: 'Folder not found',
            path: '/api/folders',
        });
    });

    it('passes validation messages as an array', () => {
        filter.catch(new BadRequestException(['name should not be ampty']), host);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(sentBody()).toMatchObject({
            error: 'Bad request',
            message: ['name should not be empty'],
        });
    });

    it('maps a Prisma unique constraint to 409', () => {
        const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: 'test',
        });

        filter.catch(error, host);

        expect(response.status).toHaveBeenCalledWith(409);
        expect(sentBody()).toMatchObject({
            error: 'Conflict',
        });
    });

    it('hides details of unexpected errors', () => {
        vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

        filter.catch(new Error('connect ECONNREFUSED 127.0.0.1:5432'), host);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(sentBody()).toMatchObject({
            statusCode: 500,
            message: 'Internal server error',
        });
        expect(JSON.stringify(sentBody())).not.toContain('ECONNREFUSED');
    });
});
