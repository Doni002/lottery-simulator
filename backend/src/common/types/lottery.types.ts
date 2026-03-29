export type SimulationSession = {
  customNumbers: number[] | null;
  randomSeedEnabled: boolean;
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
