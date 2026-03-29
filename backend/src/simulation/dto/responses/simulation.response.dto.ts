import { Prisma, Session } from '@prisma/client';

export type SessionWithRelations = Prisma.SessionGetPayload<{
  include: { tickets: true; draws: true };
}>;

export type CreateSessionResponse = { session: Session };
export type SessionDetailsResponse = { session: SessionWithRelations };
export type StartSimulationResponse = { accepted: boolean; message: string };
