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

    const previousSessionId = this.socketSessions.get(client.id);
    if (previousSessionId && previousSessionId !== sessionId) {
      this.unsubscribeClientFromSession(client, previousSessionId);
    }

    const room = this.getSessionRoom(sessionId);
    void client.join(room);
    this.socketSessions.set(client.id, sessionId);
    client.emit('sessionSubscribed', { sessionId });
  }

  @SubscribeMessage('unsubscribeSession')
  handleUnsubscribeSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload?: StartSimulationPayload,
  ) {
    const requestedSessionId = payload?.sessionId?.trim();
    const trackedSessionId = this.socketSessions.get(client.id);
    const sessionId = requestedSessionId || trackedSessionId;

    if (!sessionId) {
      return;
    }

    this.unsubscribeClientFromSession(client, sessionId);
  }

  handleDisconnect(client: Socket) {
    const sessionId = this.socketSessions.get(client.id);
    this.socketSessions.delete(client.id);

    if (!sessionId) return;

    this.pauseSessionIfNoSubscribers(sessionId);
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
        this.server.to(room).emit('simulationPaused', result);
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

  private unsubscribeClientFromSession(client: Socket, sessionId: string) {
    const room = this.getSessionRoom(sessionId);
    void client.leave(room);

    if (this.socketSessions.get(client.id) === sessionId) {
      this.socketSessions.delete(client.id);
    }

    this.pauseSessionIfNoSubscribers(sessionId);
  }

  private pauseSessionIfNoSubscribers(sessionId: string) {
    const room = this.getSessionRoom(sessionId);
    const roomSockets = this.server.sockets.adapter.rooms.get(room);
    const remainingClients = roomSockets ? roomSockets.size : 0;

    if (remainingClients === 0) {
      this.simulationService.requestPause(sessionId);
    }
  }

  private getSessionRoom(sessionId: string) {
    return `simulation-session:${sessionId}`;
  }
}
