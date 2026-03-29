export type SimulationSession = {
  customNumbers: number[] | null;
  randomSeedEnabled: boolean;
  drawSpeed: number;
};

export type MatchSummary = {
  twoMatches: number;
  threeMatches: number;
  fourMatches: number;
  fiveMatches: number;
};

export type PersistedTicketSnapshot = {
  winningNumbers: number[];
  ticketNumbers: number[];
};

export type SimulationStats = {
  yearsSpent: number;
  costOfTickets: number;
};

export type SimulationStopReason = 'fiveMatchHit' | 'maxYearsReached';

export type StartSimulationPayload = {
  sessionId: string;
};

export type SimulationProgressPayload = {
  sessionId: string;
  drawIndex: number;
  numberOfTickets: number;
  yearsSpent: number;
  costOfTickets: number;
  matches: MatchSummary;
  winningNumbers: number[];
  yourNumbers: number[];
  matchCount: number;
  isPersistedDraw: boolean;
};

export type SimulationCompletePayload = SimulationProgressPayload & {
  stopReason: SimulationStopReason;
  totalDrawsRun: number;
};

export type SimulationErrorPayload = {
  sessionId?: string;
  message: string;
};
