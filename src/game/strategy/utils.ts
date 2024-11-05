import { createHash } from "../algorithm/hash";
import { createSeed } from "../algorithm/seeding";
import { IRoundState } from "./types";

export const createRoundState = <T extends IRoundState>(
  outcome: T["outcome"]
): T => {
  const seed = `${outcome}:${createSeed(24)}`;
  const hash = createHash(seed);

  return { seed, hash, outcome } as T;
};
