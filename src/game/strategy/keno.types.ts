import { IRoundState } from "./types";

export interface KenoRoundState extends IRoundState {
  outcome: number[];
}

export enum KenoRisk {
  low = "low",
  high = "high",
}
