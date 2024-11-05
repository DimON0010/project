import { uid } from "uid/secure";

// 256-bit seed string
const DEFAULT_SEED_SIZE = 32;

export const createSeed = (size = DEFAULT_SEED_SIZE) => uid(size);
