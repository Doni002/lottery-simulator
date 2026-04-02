import { Inject, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
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
export class SimulationGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly socketSessions = new Map<string, string>();

  constructor(
    @Inject(forwardRef(() => SimulationService))
    private readonly simulationService: SimulationService,
  ) {}

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
    this.socketSessions.set(client.id, sessionId);
    client.emit('sessionSubscribed', { sessionId });
  }

  handleDisconnect(client: Socket) {
    const sessionId = this.socketSessions.get(client.id);
    this.socketSessions.delete(client.id);

    if (!sessionId) return;

    const room = this.getSessionRoom(sessionId);
    const roomSockets = this.server.sockets.adapter.rooms.get(room);
    const remainingClients = roomSockets ? roomSockets.size : 0;

    if (remainingClients === 0) {
      this.simulationService.requestPause(sessionId);
    }
  }

  async executeSimulationRun(sessionId: string) {
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
