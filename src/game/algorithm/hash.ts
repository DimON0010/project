import crypto from "crypto";

export const createHash = (seed: string) =>
  crypto.createHash("sha3-256").update(seed).digest("hex");
