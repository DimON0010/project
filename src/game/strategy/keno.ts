import { randomFloat } from "../algorithm/random";
import { KenoRisk, KenoRoundState } from "./keno.types";
import { GameOutcome } from "./types";
import { createRoundState } from "./utils";

export class Keno {
  private static readonly multiplierMatrix = {
    [KenoRisk.low]: [
      [0.5, 1.75],
      [0, 1.9, 3.7],
      [0, 1, 1.28, 25],
      [0, 0, 2.1, 7.8, 89],
      [0, 0, 1.4, 3, 11, 250],
      [0, 0, 1, 2, 5, 90, 600],
      [0, 0, 1, 1.5, 3.4, 14, 220, 600],
      [0, 0, 1, 1.4, 2, 5.5, 39, 100, 700],
      [0, 0, 1, 1.2, 1.5, 2.4, 7.4, 40, 230, 900],
      [0, 0, 1, 1.1, 1.2, 1.6, 3.4, 12, 40, 240, 900],
    ],
    [KenoRisk.high]: [
      [0, 3.96],
      [0, 0, 16],
      [0, 0, 0, 80.5],
      [0, 0, 0, 9, 250],
      [0, 0, 0, 4.2, 47, 440],
      [0, 0, 0, 0, 10, 340, 700],
      [0, 0, 0, 0, 6, 80, 380, 700],
      [0, 0, 0, 0, 4, 15, 260, 500, 800],
      [0, 0, 0, 0, 3, 10, 56, 400, 700, 1000],
      [0, 0, 0, 0, 2.3, 7, 12, 62, 400, 800, 1000],
    ],
  };

  static readonly minBet = 0;
  static readonly maxBet = 39;

  static readonly minPredictionTiles = 1;
  static readonly maxPredictionTiles = 10;

  private static _intersection(sequence: number[], prediction: number[]) {
    return sequence.filter((elem) => prediction.includes(elem)).length;
  }

  static generateUniqueSequence(): number[] {
    const seq: number[] = [];

    while (seq.length < this.maxPredictionTiles) {
      const result = randomFloat() * (this.maxBet + 1);
      const num = Math.trunc(result);

      if (seq.indexOf(num) === -1) {
        seq.push(num);
      }
    }

    return seq;
  }

  static generateRoundState(): KenoRoundState {
    const outcome = this.generateUniqueSequence();
    return createRoundState<KenoRoundState>(outcome);
  }

  static getResult(sequence: number[], prediction: number[], risk: KenoRisk) {
    const hits = this._intersection(sequence, prediction);

    const multiplier = this.multiplierMatrix[risk][prediction.length - 1][hits];

    return {
      multiplier,
      result: multiplier > 0 ? GameOutcome.WIN : GameOutcome.LOSS,
    };
  }
}
