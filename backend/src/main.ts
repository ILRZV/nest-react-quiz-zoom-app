import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {createProxyMiddleware} from 'http-proxy-middleware';
import * as session from 'express-session';
import {configService} from "./config/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        '/api/zoomapp/proxy',
        createProxyMiddleware({
            target: `http://${configService.getValue('FRONTEND_HOST')}:9090`,
            changeOrigin: true,
        })
    );

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );

    await app.listen(5000);
}

bootstrap();
