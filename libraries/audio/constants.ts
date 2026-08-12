/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const MASTER_BUS_LOWPASS_FREQUENCY = 2200;
export const MASTER_BUS_LOWPASS_SPREAD = 0.85;

export const MASTER_BUS_COMPRESSION_THRESHOLD = -24;
export const MASTER_BUS_COMPRESSION_KNEE = 30;
export const MASTER_BUS_COMPRESSION_RATIO = 4;
export const MASTER_BUS_COMPRESSION_ATTACK = 0.003;
export const MASTER_BUS_COMPRESSION_RELEASE = 0.25;

export const [
  MINOR_THIRD,
  MAJOR_THIRD,
  PERFECT_FIFTH,
  AUGMENTED_FIFTH,
  DIMINISHED_FIFTH,
] = [3, 4, 7, 8, 9];

export const TRIAD_HARMONICS: Record<string, number[]> = {
  "°": [MINOR_THIRD, DIMINISHED_FIFTH],
  m: [MINOR_THIRD, PERFECT_FIFTH],
  M: [MAJOR_THIRD, PERFECT_FIFTH],
  "+": [MAJOR_THIRD, AUGMENTED_FIFTH],
};

export const TUNING_HZ = 440;
export const SEMITONE_OFFSET: Record<string, number> = {
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
