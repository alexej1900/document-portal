import { INestApplication } from '@nestjs/common';

export function configureApp(app: INestApplication): void {
    // CORS
    // app.enableCors({ origin: '*' });

    // Global prefix for API
    app.setGlobalPrefix('api');

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();
}
