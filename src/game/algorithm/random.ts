import { randomBytes } from "crypto";

const max = Math.pow(2, 32);

export const randomFloat = () => randomBytes(4).readUInt32BE(0) / max;
