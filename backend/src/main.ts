// main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsIoAdapter } from './common/adapters/cors-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';

  app.enableCors({ origin: frontendUrl, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new CorsIoAdapter(app, configService));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
