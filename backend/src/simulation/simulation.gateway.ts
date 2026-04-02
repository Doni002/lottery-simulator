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
  SimulationPausedPayload,
  StartSimulationPayload,
} from './types/simulation.types';

@WebSocketGateway()
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

  stopSimulationRun(sessionId: string) {
    const normalizedSessionId = sessionId.trim();

    if (!normalizedSessionId) {
      return { accepted: false, message: 'sessionId is required' };
    }

    this.simulationService.requestPause(normalizedSessionId);
    return { accepted: true, message: 'Stop requested' };
  }

  private async executeSimulationRun(sessionId: string) {
    const room = this.getSessionRoom(sessionId);

    try {
      const result = await this.simulationService.runSimulationUntilStop(
        sessionId,
        (progress) => {
          this.server.to(room).emit('simulationProgress', progress);
        },
      );

      if ('stopReason' in result) {
        this.server.to(room).emit('simulationComplete', result);
      } else {
        this.server.to(room).emit('simulationPaused', result as SimulationPausedPayload);
      }
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
