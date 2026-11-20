import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { Prisma } from '../../generated/prisma/client.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const { status, message } = this.resolve(exception);

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception)
            );
        }

        response.status(status).json({
            statusCode: status,
            error: STATUS_CODES[status],
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }

    private resolve(exception: unknown): { status: number; message: string | string[] } {
        if (exception instanceof HttpException) {
            const body = exception.getResponse();
            const message =
                typeof body === 'string'
                    ? body
                    : ((body as { message?: string | string[] }).message ?? exception.message);
            return { status: exception.getStatus(), message };
        }

        if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2002') {
            return { status: HttpStatus.CONFLICT, message: 'Resource already exists' };
        }

        return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
    }
}
