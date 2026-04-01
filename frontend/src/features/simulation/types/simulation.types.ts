export type MatchSummary = {
  twoMatches: number;
  threeMatches: number;
  fourMatches: number;
  fiveMatches: number;
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
  stopReason: 'fiveMatchHit' | 'maxYearsReached';
  totalDrawsRun: number;
};

export type SimulationErrorPayload = {
  sessionId?: string;
  message: string;
};

export type CreateSessionResponse = {
  session: {
    id: string;
  };
};

export type StartSimulationResponse = {
  accepted: boolean;
  message: string;
};
