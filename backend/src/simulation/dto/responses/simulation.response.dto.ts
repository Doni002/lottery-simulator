import { Session } from '@prisma/client';

export type CreateSessionResponse = { session: Session };
export type StartSimulationResponse = { accepted: boolean; message: string };
export type StopSimulationResponse = { accepted: boolean; message: string };
