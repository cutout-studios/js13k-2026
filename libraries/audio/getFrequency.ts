import type { Frequency, ScaleDegree } from "./types.ts";
import { OCTAVE_SIZE, TUNING_HZ } from "./constants.ts";

export const getFrequency = (note: ScaleDegree): Frequency =>
  TUNING_HZ * 2 ** (note / OCTAVE_SIZE);
