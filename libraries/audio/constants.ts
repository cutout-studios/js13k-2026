import { ScaleDegree } from "./types.ts";

export const [
  MINOR_THIRD,
  MAJOR_THIRD,
  PERFECT_FIFTH,
  AUGMENTED_FIFTH,
  DIMINISHED_FIFTH,
] = [3, 4, 7, 8, 9];

export const TRIAD_HARMONICS: Record<string, ScaleDegree[]> = {
  "°": [MINOR_THIRD, DIMINISHED_FIFTH],
  m: [MINOR_THIRD, PERFECT_FIFTH],
  M: [MAJOR_THIRD, PERFECT_FIFTH],
  "+": [MAJOR_THIRD, AUGMENTED_FIFTH],
};

export const TUNING_HZ = 440;
export const SEMITONE_OFFSET: Record<string, ScaleDegree> = {
  A: 0,
  B: 2,
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
};

export const OCTAVE_SIZE = 12;
export const MIDDLE_OCTAVE_NUMBER = 4;

export const DURATION_INDEX = 1;
