import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { getEnv } from './config/env.js';

async function bootstrap() {
  const env = getEnv();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: env.WEB_ORIGIN,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dragons Hire API')
    .setDescription('Rent the right dragon for the right mission.')
    .setVersion('0.1.0')
    .addCookieAuth('better-auth.session_token')
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig), {
    jsonDocumentUrl: 'docs-json',
  });

  await app.listen(env.PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`API running on ${env.BETTER_AUTH_URL}`);
  logger.log(`Swagger available on ${env.BETTER_AUTH_URL}/docs`);
}

await bootstrap();
