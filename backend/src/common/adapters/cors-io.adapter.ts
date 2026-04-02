import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, ServerOptions } from 'socket.io';

export class CorsIoAdapter extends IoAdapter {
  private readonly corsOrigin: string;

  constructor(app: INestApplication, configService: ConfigService) {
    super(app);
    this.corsOrigin =
      configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    return super.createIOServer(port, {
      ...options,
      cors: { origin: this.corsOrigin, credentials: true },
    }) as Server;
  }
}
