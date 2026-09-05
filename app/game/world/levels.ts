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

import { atan, PI, round, sqrt } from "~/alias";
import { Band, doTimes, flat } from "~/common";

import { rollBand } from "~/random";
import { DIFFICULTY_HALFLIFE, WAVES_PER_LEVEL_BAND } from "./constants.ts";

export const levelCurve = (
  level: number,
  halflife = DIFFICULTY_HALFLIFE,
) => (2 * atan(level / halflife)) / PI;

export const levelRoll = (
  [start, end]: Band,
  level: number,
  halflife = DIFFICULTY_HALFLIFE,
) => {
  const span = end - start, curve = levelCurve(level, halflife);
  return rollBand([start + span * curve, start + span * sqrt(curve)]);
};

export const levelRollOverrides = (
  base: number[],
  overrides: [number, Band][],
  level = 1,
) => {
  const snapshot = flat(base);

  doTimes(overrides, ([statID, statBand]) => {
    snapshot[statID] = levelRoll(statBand, level);
  });

  return snapshot;
};

export const getWavesInLevel = (level: number) =>
  round(levelRoll(WAVES_PER_LEVEL_BAND, level, DIFFICULTY_HALFLIFE * 4));
