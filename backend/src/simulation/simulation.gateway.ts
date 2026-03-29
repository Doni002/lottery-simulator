import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SimulationService } from './services/simulation.service';
import type {
  SimulationErrorPayload,
  StartSimulationPayload,
} from './types/simulation.types';

@WebSocketGateway({ cors: { origin: '*' } })
export class SimulationGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly simulationService: SimulationService) {}

  @SubscribeMessage('subscribeSession')
  handleSubscribeSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: StartSimulationPayload,
  ) {
    const sessionId = payload?.sessionId?.trim();

    if (!sessionId) {
      client.emit('simulationError', {
        message: 'sessionId is required',
      });
      return;
    }

    const room = this.getSessionRoom(sessionId);
    client.join(room);
    client.emit('sessionSubscribed', { sessionId });
  }

  async startSimulationRun(sessionId: string) {
    const normalizedSessionId = sessionId.trim();

    if (!normalizedSessionId) {
      return {
        accepted: false,
        message: 'sessionId is required',
      };
    }

    const lock = await this.simulationService.tryAcquireSimulationLock(
      normalizedSessionId,
    );

    if (!lock.acquired) {
      return {
        accepted: false,
        message: lock.message,
      };
    }

    void this.executeSimulationRun(normalizedSessionId);

    return {
      accepted: true,
      message: 'Simulation started',
    };
  }

  private async executeSimulationRun(sessionId: string) {
    const room = this.getSessionRoom(sessionId);

    try {
      const completion = await this.simulationService.runSimulationUntilStop(
        sessionId,
        (progress) => {
          this.server.to(room).emit('simulationProgress', progress);
        },
      );

      this.server.to(room).emit('simulationComplete', completion);
    } catch (error) {
      this.emitError(room, {
        sessionId,
        message:
          error instanceof Error ? error.message : 'Simulation run failed',
      });
    } finally {
      await this.simulationService.releaseSimulationLock(sessionId);
    }
  }

  private emitError(room: string, payload: SimulationErrorPayload) {
    this.server.to(room).emit('simulationError', payload);
  }

  private getSessionRoom(sessionId: string) {
    return `simulation-session:${sessionId}`;
  }
}
