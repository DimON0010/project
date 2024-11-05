export interface IRoundState {
  seed: string;
  hash: string;
  outcome: unknown;
}

export enum GameOutcome {
  WIN = "WIN",
  LOSS = "LOSS",
}
