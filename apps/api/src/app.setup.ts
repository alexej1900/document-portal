import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

export function configureApp(app: INestApplication): void {
    // Global prefix for API
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();
}
